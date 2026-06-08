import crypto from "node:crypto";
import type { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { sendPendingGrantEmails } from "@/server/vault/download-delivery";
import { finalizeSuccessfulPayment } from "@/server/vault/secure-fulfillment";


type PaystackWebhookPayload = Prisma.JsonObject & {
  event?: string;
  data?: Prisma.JsonObject & {
    reference?: string;
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

function createDedupeKey(rawBody: string) {
  return `PAYSTACK:${crypto
    .createHash("sha256")
    .update(rawBody)
    .digest("hex")}`;
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    route: "paystack-webhook",
  });
}

export async function POST(request: Request) {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;

  if (!secretKey) {
    return NextResponse.json(
      { error: "Paystack secret key is not configured." },
      { status: 500 },
    );
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-paystack-signature") ?? "";
  const expectedSignature = crypto
    .createHmac("sha512", secretKey)
    .update(rawBody)
    .digest("hex");

  if (!safeCompare(signature, expectedSignature)) {
    return NextResponse.json(
      { error: "Invalid webhook signature." },
      { status: 401 },
    );
  }

  let payload: PaystackWebhookPayload;

  try {
    payload = JSON.parse(rawBody) as PaystackWebhookPayload;
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON payload." },
      { status: 400 },
    );
  }

  const reference =
    typeof payload?.data?.reference === "string"
      ? payload.data.reference
      : null;

  const attempt = reference
    ? await prisma.paymentAttempt.findUnique({
        where: { providerReference: reference },
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
      provider: "PAYSTACK",
      eventType: typeof payload?.event === "string" ? payload.event : null,
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

  if (payload?.event !== "charge.success" || !reference || !attempt) {
    await prisma.webhookEvent.update({
      where: { id: webhookEvent.id },
      data: { processedAt: new Date() },
    });

    return NextResponse.json({ received: true }, { status: 200 });
  }

  const verifyResponse = await fetch(
    `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
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
    verifyJson?.status === true &&
    data?.status === "success" &&
    data?.reference === reference &&
    data?.currency === attempt.currency &&
    Number(data?.amount) === attempt.amount * 100 &&
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
    paidAt: data?.paid_at ? new Date(data.paid_at) : new Date(),
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