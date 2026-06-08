import { scaleKitProductDefinitions } from "@/data/scalekit-products";

export type VaultCatalogItem = {
  id: string;
  slug: string;
  title: string;
  category: string;
  priceUsdCents: number;
  currency: "USD";
  fileKey: string;
};

export const vaultCatalog: VaultCatalogItem[] =
  scaleKitProductDefinitions.map((product) => ({
    id: product.id,
    slug: product.slug,
    title: product.title,
    category: product.category,
    priceUsdCents: product.priceUsdCents,
    currency: product.currency,
    fileKey: product.fileKey,
  }));

export function getVaultCatalogProductById(productId: string) {
  return vaultCatalog.find((product) => product.id === productId);
}