import path from "node:path";
import { readFile } from "node:fs/promises";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getServerVaultProductById } from "@/server/vault/catalog";
import {
  readVaultAccessCookieValue,
  VAULT_DOWNLOAD_ACCESS_COOKIE,
} from "@/server/vault/access-cookie";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  context: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await context.params;

    const cookieStore = await cookies();
    const rawCookie = cookieStore.get(VAULT_DOWNLOAD_ACCESS_COOKIE)?.value;
    const access = readVaultAccessCookieValue(rawCookie);

    if (!access) {
      return NextResponse.json(
        { error: "Verified download session is required." },
        { status: 401 },
      );
    }

    const grant = await prisma.downloadGrant.findUnique({
      where: { token },
      include: {
        orderItem: true,
      },
    });

    if (!grant) {
      return NextResponse.json(
        { error: "Download grant not found." },
        { status: 404 },
      );
    }

    if (grant.revokedAt) {
      return NextResponse.json(
        { error: "This download link has been revoked." },
        { status: 403 },
      );
    }

    if (grant.expiresAt && grant.expiresAt.getTime() < Date.now()) {
      return NextResponse.json(
        { error: "This download link has expired." },
        { status: 403 },
      );
    }

    if (grant.email.toLowerCase() !== access.email.toLowerCase()) {
      return NextResponse.json(
        { error: "This session does not match the grant email." },
        { status: 403 },
      );
    }

    if (!access.grantIds.includes(grant.id)) {
      return NextResponse.json(
        { error: "This grant is not available in the current session." },
        { status: 403 },
      );
    }

    const product = getServerVaultProductById(grant.orderItem.productId);

    if (!product) {
      return NextResponse.json(
        { error: "The linked product could not be resolved." },
        { status: 404 },
      );
    }

    const filePath = path.join(process.cwd(), "vault-files", product.fileKey);

    let fileBuffer: Buffer;

    try {
      fileBuffer = await readFile(filePath);
    } catch {
      return NextResponse.json(
        { error: "The product file is not available on the server." },
        { status: 404 },
      );
    }

    const now = new Date();

    await prisma.downloadGrant.update({
      where: { id: grant.id },
      data: {
        downloadCount: {
          increment: 1,
        },
        firstUsedAt: grant.firstUsedAt ?? now,
        lastUsedAt: now,
      },
    });

    await prisma.orderItem.update({
      where: { id: grant.orderItemId },
      data: {
        deliveryStatus: "DOWNLOADED",
      },
    });

    const filename =
      product.fileKey.split("/").pop() ??
      `${grant.orderItem.productSlug || "scalekit-product"}.zip`;

    return new Response(new Uint8Array(fileBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/octet-stream",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "private, no-store, max-age=0",
      },
    });
  } catch (error) {
    console.error("ScaleKit product download error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to process download.",
      },
      { status: 500 },
    );
  }
}
