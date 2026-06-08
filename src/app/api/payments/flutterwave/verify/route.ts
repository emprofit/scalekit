import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { sendPendingGrantEmails } from "@/server/vault/download-delivery";
import { finalizeSuccessfulPayment } from "@/server/vault/secure-fulfillment";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json(
        { error: "Flutterwave secret key is not configured." },
        { status: 500 },
      );
    }

    const { searchParams } = new URL(request.url);
    const txRef = searchParams.get("tx_ref")?.trim();

    if (!txRef) {
      return NextResponse.json(
        { error: "Transaction reference is required." },
        { status: 400 },
      );
    }

    const attempt = await prisma.paymentAttempt.findUnique({
      where: { providerReference: txRef },
      include: { order: true },
    });

    if (!attempt || attempt.provider !== "FLUTTERWAVE") {
      return NextResponse.json(
        { error: "Payment attempt not found." },
        { status: 404 },
      );
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

    await prisma.paymentAttempt.update({
      where: { id: attempt.id },
      data: {
        providerTxId: data?.id ? String(data.id) : null,
        status: data?.status || "unknown",
        rawVerify: verifyJson,
      },
    });

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
      return NextResponse.json({
        verified: false,
        status: data?.status || "pending",
        reference: txRef,
      });
    }

    const result = await finalizeSuccessfulPayment({
      paymentAttemptId: attempt.id,
      providerTxId: data?.id ? String(data.id) : null,
      paidAt: data?.created_at ? new Date(data.created_at) : new Date(),
      rawVerify: verifyJson,
    });

    const delivery = await sendPendingGrantEmails(result.orderId);

    return NextResponse.json({
      verified: true,
      status: "successful",
      reference: txRef,
      orderId: result.orderId,
      grantsCreated: result.grants.length,
      delivery,
    });
  } catch (error) {
    console.error("Flutterwave verify error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Flutterwave verification failed.",
      },
      { status: 500 },
    );
  }
}