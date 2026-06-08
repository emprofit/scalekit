import crypto from "node:crypto";
import { Resend } from "resend";

import { prisma } from "@/lib/prisma";

function sha256(value: string) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function createOtpCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function createMagicToken() {
  return crypto.randomBytes(32).toString("hex");
}

function getAppUrl() {
  return process.env.APP_URL?.replace(/\/$/, "") || "http://localhost:3000";
}

function getExpiryDate() {
  return new Date(Date.now() + 15 * 60 * 1000);
}

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return null;
  }

  return new Resend(apiKey);
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export async function createDownloadAccessChallenge(args: {
  grantId: string;
  email: string;
}) {
  const otpCode = createOtpCode();
  const magicToken = createMagicToken();
  const expiresAt = getExpiryDate();

  const challenge = await prisma.downloadAccessChallenge.create({
    data: {
      grantId: args.grantId,
      email: args.email.toLowerCase(),
      otpCodeHash: sha256(otpCode),
      magicTokenHash: sha256(magicToken),
      expiresAt,
    },
  });

  return {
    id: challenge.id,
    otpCode,
    magicToken,
    expiresAt,
  };
}

async function refreshOrderDeliveryStatus(orderId: string) {
  const items = await prisma.orderItem.findMany({
    where: { orderId },
    select: { deliveryStatus: true },
  });

  if (items.length === 0) {
    return "PAID" as const;
  }

  const deliveredStatuses = new Set(["EMAILED", "DOWNLOADED"]);
  const allDelivered = items.every((item) =>
    deliveredStatuses.has(item.deliveryStatus),
  );
  const anyDelivered = items.some((item) =>
    deliveredStatuses.has(item.deliveryStatus),
  );

  const status = allDelivered
    ? "FULFILLED"
    : anyDelivered
      ? "PARTIALLY_FULFILLED"
      : "PAID";

  await prisma.order.update({
    where: { id: orderId },
    data: {
      status,
      fulfilledAt: allDelivered ? new Date() : null,
    },
  });

  return status;
}

export async function sendPendingGrantEmails(orderId: string) {
  const resend = getResendClient();
  const from = process.env.RESEND_FROM_EMAIL;
  const appUrl = getAppUrl();

  if (!resend || !from) {
    console.warn(
      "Product-access email sending skipped: RESEND_API_KEY or RESEND_FROM_EMAIL is missing.",
    );

    await refreshOrderDeliveryStatus(orderId);

    return {
      sent: 0,
      failed: 0,
      skipped: true,
      status: "PAID" as const,
    };
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          downloadGrant: true,
        },
      },
    },
  });

  if (!order) {
    throw new Error("Order not found for product-access delivery.");
  }

  let sent = 0;
  let failed = 0;

  for (const item of order.items) {
    if (!item.downloadGrant) {
      continue;
    }

    const claim = await prisma.orderItem.updateMany({
      where: {
        id: item.id,
        deliveryStatus: "PENDING",
      },
      data: {
        deliveryStatus: "PROCESSING",
      },
    });

    if (claim.count !== 1) {
      continue;
    }

    const challenge = await createDownloadAccessChallenge({
      grantId: item.downloadGrant.id,
      email: order.email,
    });

    const verifyUrl = `${appUrl}/downloads/verify?grant=${encodeURIComponent(
      item.downloadGrant.id,
    )}&token=${encodeURIComponent(challenge.magicToken)}`;

    try {
      const result = await resend.emails.send({
        from,
        to: order.email,
        subject: `${item.productTitle} — secure product access`,
        html: `
          <div style="font-family:Arial,sans-serif;line-height:1.6;color:#0f172a">
            <h2 style="margin-bottom:8px;">Your ScaleKit product access is ready</h2>
            <p><strong>Product:</strong> ${escapeHtml(item.productTitle)}</p>
            <p>
              Use the secure magic link or OTP below to verify the payment email
              and access the product package.
            </p>

            <p>
              <a href="${verifyUrl}" style="display:inline-block;background:#0064E0;color:#fff;text-decoration:none;padding:12px 18px;border-radius:999px;">
                Verify product access
              </a>
            </p>

            <p><strong>OTP code:</strong> ${challenge.otpCode}</p>
            <p>This code expires at ${challenge.expiresAt.toUTCString()}.</p>

            <p style="color:#475569;font-size:14px;">
              Access is linked to ${escapeHtml(order.email)}. Depending on the
              product, the package may contain downloadable files,
              documentation, access details, setup resources, or other relevant
              materials.
            </p>
          </div>
        `,
      });

      if (result.error || !result.data) {
        throw new Error(
          result.error?.message || "The email provider did not accept the message.",
        );
      }

      await prisma.orderItem.update({
        where: { id: item.id },
        data: {
          deliveryStatus: "EMAILED",
        },
      });

      sent += 1;
    } catch (error) {
      failed += 1;

      await prisma.$transaction([
        prisma.downloadAccessChallenge.deleteMany({
          where: { id: challenge.id },
        }),
        prisma.orderItem.update({
          where: { id: item.id },
          data: {
            deliveryStatus: "PENDING",
          },
        }),
      ]);

      console.error(
        `Product-access email failed for order item ${item.id}:`,
        error,
      );
    }
  }

  const status = await refreshOrderDeliveryStatus(orderId);

  return {
    sent,
    failed,
    skipped: false,
    status,
  };
}

export async function verifyMagicLink(args: {
  grantId: string;
  token: string;
}) {
  const tokenHash = sha256(args.token);

  const challenge = await prisma.downloadAccessChallenge.findFirst({
    where: {
      grantId: args.grantId,
      magicTokenHash: tokenHash,
      usedAt: null,
      expiresAt: {
        gt: new Date(),
      },
    },
    include: {
      grant: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!challenge) {
    return null;
  }

  await prisma.downloadAccessChallenge.update({
    where: { id: challenge.id },
    data: {
      usedAt: new Date(),
    },
  });

  return challenge.grant;
}

export async function verifyOtpCode(args: {
  grantId: string;
  email: string;
  otp: string;
}) {
  const otpHash = sha256(args.otp);

  const challenge = await prisma.downloadAccessChallenge.findFirst({
    where: {
      grantId: args.grantId,
      email: args.email.toLowerCase(),
      otpCodeHash: otpHash,
      usedAt: null,
      expiresAt: {
        gt: new Date(),
      },
    },
    include: {
      grant: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!challenge) {
    return null;
  }

  await prisma.downloadAccessChallenge.update({
    where: { id: challenge.id },
    data: {
      usedAt: new Date(),
    },
  });

  return challenge.grant;
}