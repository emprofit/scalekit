import crypto from "node:crypto";

import {
  getVaultCatalogProductById,
  type VaultCatalogItem,
} from "../data/vault-catalog";

export function normalizeProductIds(productIds: unknown): string[] {
  if (!Array.isArray(productIds)) return [];

  return [
    ...new Set(
      productIds.filter((item): item is string => typeof item === "string"),
    ),
  ];
}

export function getCatalogProductsOrThrow(
  productIds: string[],
): VaultCatalogItem[] {
  const products = productIds.map((id) => getVaultCatalogProductById(id));

  if (products.some((item) => !item)) {
    throw new Error("One or more selected products are invalid.");
  }

  return products as VaultCatalogItem[];
}

export function calculateSubtotalUsdCents(products: VaultCatalogItem[]) {
  return products.reduce((sum, product) => sum + product.priceUsdCents, 0);
}

export function createProviderReference(
  prefix: "paystack" | "flutterwave",
) {
  const random = crypto.randomBytes(6).toString("hex");
  return `scalekit-${prefix}-${Date.now()}-${random}`;
}