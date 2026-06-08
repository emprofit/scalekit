import crypto from "node:crypto";
import { NextResponse } from "next/server";

import {
  getServerVaultProductById,
  type ServerVaultCatalogItem,
} from "@/server/vault/catalog";
import {
  convertUsdCentsToNgn,
  getUsdNgnRate,
} from "@/server/fx/usd-ngn";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeProductIds(productIds: unknown): string[] {
  if (!Array.isArray(productIds)) return [];

  return [
    ...new Set(
      productIds.filter((item): item is string => typeof item === "string"),
    ),
  ];
}

function getCatalogProductsOrThrow(
  productIds: string[],
): ServerVaultCatalogItem[] {
  const products = productIds.map((id) => getServerVaultProductById(id));

  if (products.some((item) => !item)) {
    throw new Error("One or more selected products are invalid.");
  }

  return products as ServerVaultCatalogItem[];
}

function createReference() {
  const random = crypto.randomBytes(6).toString("hex");
  return `scalekit-flutterwave-${Date.now()}-${random}`;
}

function getAppUrl() {
  return process.env.APP_URL?.replace(/\/$/, "") || "http://localhost:3000";
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    route: "flutterwave-initialize",
  });
}

export async function POST(request: Request) {
  try {
    const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;

    if (!secretKey) {
      return NextResponse.json(
        { error: "Flutterwave secret key is not configured." },
        { status: 500 },
      );
    }

    const body = await request.json();
    const email =
      typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const productIds = normalizeProductIds(body.productIds);

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "A valid payment email is required." },
        { status: 400 },
      );
    }

    if (productIds.length === 0) {
      return NextResponse.json(
        { error: "No products selected for checkout." },
        { status: 400 },
      );
    }

    const products = getCatalogProductsOrThrow(productIds);
    const fx = await getUsdNgnRate();
    const pricedProducts = products.map((product) => ({
      product,
      unitAmountNgn: convertUsdCentsToNgn(product.priceUsdCents, fx.rate),
    }));
    const subtotalAmount = pricedProducts.reduce(
      (sum, item) => sum + item.unitAmountNgn,
      0,
    );
    const subtotalUsdCents = products.reduce(
      (sum, product) => sum + product.priceUsdCents,
      0,
    );
    const txRef = createReference();
    const redirectUrl =
      process.env.FLUTTERWAVE_SUCCESS_URL ||
      `${getAppUrl()}/success/flutterwave`;

    const { prisma } = await import("@/lib/prisma");

    const order = await prisma.order.create({
      data: {
        reference: txRef,
        email,
        currency: "NGN",
        subtotalAmount,
        status: "PENDING",
        provider: "FLUTTERWAVE",
        items: {
          create: pricedProducts.map(({ product, unitAmountNgn }) => ({
            productId: product.id,
            productSlug: product.slug,
            productTitle: product.title,
            unitAmount: unitAmountNgn,
            currency: "NGN",
          })),
        },
      },
    });

    const flutterwaveResponse = await fetch(
      "https://api.flutterwave.com/v3/payments",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${secretKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tx_ref: txRef,
          amount: subtotalAmount,
          currency: "NGN",
          redirect_url: redirectUrl,
          customer: {
            email,
          },
          customizations: {
            title: "ScaleKit",
            description: "Digital tools and secure product delivery",
          },
          meta: {
            source: "scalekit",
            orderId: order.id,
            productIds,
            subtotalUsdCents,
            usdNgnRate: fx.rate,
            rateProvider: fx.provider,
            rateUpdatedAt: fx.updatedAt,
          },
        }),
      },
    );

    const flutterwaveJson = await flutterwaveResponse.json();
    const authorizationUrl = flutterwaveJson?.data?.link;

    if (
      !flutterwaveResponse.ok ||
      flutterwaveJson?.status !== "success" ||
      !authorizationUrl
    ) {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "FAILED" },
      });

      return NextResponse.json(
        {
          error:
            flutterwaveJson?.message ||
            "Unable to initialize Flutterwave payment.",
        },
        { status: 502 },
      );
    }

    await prisma.$transaction([
      prisma.paymentAttempt.create({
        data: {
          orderId: order.id,
          provider: "FLUTTERWAVE",
          providerReference: txRef,
          amount: subtotalAmount,
          currency: "NGN",
          status: "initialized",
          authorizationUrl,
          rawInitialize: flutterwaveJson,
        },
      }),
      prisma.order.update({
        where: { id: order.id },
        data: { status: "INITIALIZED" },
      }),
    ]);

    return NextResponse.json({
      provider: "FLUTTERWAVE",
      reference: txRef,
      orderId: order.id,
      amount: subtotalAmount,
      currency: "NGN",
      subtotalUsdCents,
      usdNgnRate: fx.rate,
      rateProvider: fx.provider,
      authorizationUrl,
    });
  } catch (error) {
    console.error("Flutterwave initialize error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Flutterwave payment initialization failed.",
      },
      { status: 500 },
    );
  }
}