import crypto from "node:crypto";
import type { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { sendPendingGrantEmails } from "@/server/vault/download-delivery";
import { finalizeSuccessfulPayment } from "@/server/vault/secure-fulfillment";


type FlutterwaveWebhookPayload = Prisma.JsonObject & {
  event?: string;
  event_type?: string;
  tx_ref?: string;
  data?: Prisma.JsonObject & {
    tx_ref?: string;
  };
};
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function safeCompare(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);

  if (aBuffer.length !== bBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(aBuffer, bBuffer);
}

function isValidFlutterwaveWebhook(
  rawBody: string,
  request: Request,
  secretHash: string,
) {
  const currentSignature = request.headers.get("flutterwave-signature");

  if (currentSignature) {
    const expectedSignature = crypto
      .createHmac("sha256", secretHash)
      .update(rawBody)
      .digest("base64");

    return safeCompare(currentSignature, expectedSignature);
  }

  const legacySignature = request.headers.get("verif-hash");

  if (legacySignature) {
    return safeCompare(legacySignature, secretHash);
  }

  return false;
}

function createDedupeKey(rawBody: string) {
  return `FLUTTERWAVE:${crypto
    .createHash("sha256")
    .update(rawBody)
    .digest("hex")}`;
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    route: "flutterwave-webhook",
  });
}

export async function POST(request: Request) {
  const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
  const webhookSecret = process.env.FLUTTERWAVE_WEBHOOK_SECRET_HASH;

  if (!secretKey || !webhookSecret) {
    return NextResponse.json(
      { error: "Flutterwave webhook configuration is incomplete." },
      { status: 500 },
    );
  }

  const rawBody = await request.text();

  if (!isValidFlutterwaveWebhook(rawBody, request, webhookSecret)) {
    return NextResponse.json(
      { error: "Invalid webhook signature." },
      { status: 401 },
    );
  }

  let payload: FlutterwaveWebhookPayload;

  try {
    payload = JSON.parse(rawBody) as FlutterwaveWebhookPayload;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400 },
    );
  }

  const txRef =
    typeof payload?.data?.tx_ref === "string"
      ? payload.data.tx_ref
      : typeof payload?.tx_ref === "string"
        ? payload.tx_ref
        : null;

  const attempt = txRef
    ? await prisma.paymentAttempt.findUnique({
        where: { providerReference: txRef },
        include: { order: true },
      })
    : null;

  const dedupeKey = createDedupeKey(rawBody);

  const webhookEvent = await prisma.webhookEvent.upsert({
    where: { dedupeKey },
    update: {},
    create: {
      dedupeKey,
      orderId: attempt?.orderId ?? undefined,
      provider: "FLUTTERWAVE",
      eventType:
        typeof payload?.event === "string"
          ? payload.event
          : typeof payload?.event_type === "string"
            ? payload.event_type
            : null,
      signatureValid: true,
      payload: payload as Prisma.InputJsonValue,
    },
  });

  if (webhookEvent.processedAt) {
    return NextResponse.json(
      { received: true, duplicate: true },
      { status: 200 },
    );
  }

  if (!txRef || !attempt) {
    await prisma.webhookEvent.update({
      where: { id: webhookEvent.id },
      data: { processedAt: new Date() },
    });

    return NextResponse.json({ received: true }, { status: 200 });
  }

  const verifyResponse = await fetch(
    `https://api.flutterwave.com/v3/transactions/verify_by_reference?tx_ref=${encodeURIComponent(txRef)}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
    },
  );

  const verifyJson = await verifyResponse.json();
  const data = verifyJson?.data;

  const paid =
    verifyResponse.ok &&
    verifyJson?.status === "success" &&
    data?.status === "successful" &&
    data?.tx_ref === txRef &&
    data?.currency === attempt.currency &&
    Number(data?.amount) === attempt.amount &&
    (!data?.customer?.email ||
      String(data.customer.email).toLowerCase() ===
        attempt.order.email.toLowerCase());

  if (!paid) {
    await prisma.webhookEvent.update({
      where: { id: webhookEvent.id },
      data: { processedAt: new Date() },
    });

    return NextResponse.json(
      { received: true, verified: false },
      { status: 200 },
    );
  }

  const result = await finalizeSuccessfulPayment({
    paymentAttemptId: attempt.id,
    providerTxId: data?.id ? String(data.id) : null,
    paidAt: data?.created_at ? new Date(data.created_at) : new Date(),
    rawVerify: verifyJson,
  });

  const delivery = await sendPendingGrantEmails(result.orderId);

  await prisma.webhookEvent.update({
    where: { id: webhookEvent.id },
    data: { processedAt: new Date() },
  });

  return NextResponse.json(
    {
      received: true,
      fulfilled: delivery.status === "FULFILLED",
      delivery,
    },
    { status: 200 },
  );
}