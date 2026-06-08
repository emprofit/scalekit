import { NextResponse } from "next/server";

import {
  VAULT_DOWNLOAD_ACCESS_COOKIE,
  buildVaultAccessCookie,
} from "@/server/vault/access-cookie";
import { verifyOtpCode } from "@/server/vault/download-delivery";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const formData = await request.formData();

  const grantId = String(formData.get("grantId") ?? "");
  const email = String(formData.get("email") ?? "");
  const otp = String(formData.get("otp") ?? "");

  const grant = await verifyOtpCode({ grantId, email, otp });

  if (!grant) {
    return NextResponse.redirect(
      new URL(
        `/downloads/verify?grant=${encodeURIComponent(grantId)}&error=invalid-otp`,
        request.url,
      ),
    );
  }

  const cookie = buildVaultAccessCookie([grant.id], grant.email);

  const response = NextResponse.redirect(
    new URL("/downloads/ready", request.url),
  );

  response.cookies.set(VAULT_DOWNLOAD_ACCESS_COOKIE, cookie.value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: cookie.expires,
  });

  return response;
}
