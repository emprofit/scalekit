import { NextResponse } from "next/server";
import { Resend } from "resend";

import { prisma } from "@/lib/prisma";
import { createDownloadAccessChallenge } from "@/server/vault/download-delivery";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getAppUrl() {
  return process.env.APP_URL?.replace(/\/$/, "") || "http://localhost:3000";
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const grantId = String(formData.get("grantId") ?? "");

  const grant = await prisma.downloadGrant.findUnique({
    where: { id: grantId },
    include: {
      orderItem: true,
    },
  });

  if (!grant) {
    return NextResponse.redirect(
      new URL("/downloads/verify?error=missing-grant", request.url),
    );
  }

  const recentChallenge = await prisma.downloadAccessChallenge.findFirst({
    where: {
      grantId,
      createdAt: {
        gt: new Date(Date.now() - 60_000),
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (recentChallenge) {
    return NextResponse.redirect(
      new URL(
        `/downloads/verify?grant=${encodeURIComponent(grantId)}&error=wait-before-resend`,
        request.url,
      ),
    );
  }

  const resendApiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;

  if (!resendApiKey || !from) {
    return NextResponse.redirect(
      new URL(
        `/downloads/verify?grant=${encodeURIComponent(grantId)}&error=email-not-configured`,
        request.url,
      ),
    );
  }

  const challenge = await createDownloadAccessChallenge({
    grantId: grant.id,
    email: grant.email,
  });

  const verifyUrl = `${getAppUrl()}/downloads/verify?grant=${encodeURIComponent(
    grant.id,
  )}&token=${encodeURIComponent(challenge.magicToken)}`;

  const resend = new Resend(resendApiKey);
  const result = await resend.emails.send({
    from,
    to: grant.email,
    subject: `${grant.orderItem.productTitle} — verification code`,
    html: `
      <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
        <h2>Your ScaleKit verification details</h2>
        <p><strong>Product:</strong> ${grant.orderItem.productTitle}</p>
        <p><strong>OTP code:</strong> ${challenge.otpCode}</p>
        <p>
          Or verify with this secure link:
          <br />
          <a href="${verifyUrl}">${verifyUrl}</a>
        </p>
      </div>
    `,
  });

  if (result.error || !result.data) {
    await prisma.downloadAccessChallenge.deleteMany({
      where: { id: challenge.id },
    });

    return NextResponse.redirect(
      new URL(
        `/downloads/verify?grant=${encodeURIComponent(grantId)}&error=email-send-failed`,
        request.url,
      ),
    );
  }

  return NextResponse.redirect(
    new URL(
      `/downloads/verify?grant=${encodeURIComponent(grantId)}&resent=1`,
      request.url,
    ),
  );
}