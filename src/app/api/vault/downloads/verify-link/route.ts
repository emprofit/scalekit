import { NextResponse } from "next/server";

import {
  VAULT_DOWNLOAD_ACCESS_COOKIE,
  buildVaultAccessCookie,
} from "@/server/vault/access-cookie";
import { verifyMagicLink } from "@/server/vault/download-delivery";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const formData = await request.formData();

  const grantId = String(formData.get("grantId") ?? "");
  const token = String(formData.get("token") ?? "");

  const grant = await verifyMagicLink({ grantId, token });

  if (!grant) {
    return NextResponse.redirect(
      new URL("/downloads/verify?error=invalid-link", request.url),
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
