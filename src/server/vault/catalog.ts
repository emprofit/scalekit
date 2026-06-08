import { scaleKitProductDefinitions } from "@/data/scalekit-products";

export type ServerVaultCatalogItem = {
  id: string;
  slug: string;
  title: string;
  category: string;
  priceUsdCents: number;
  currency: "USD";
  fileKey: string;
};

export const serverVaultCatalog: ServerVaultCatalogItem[] =
  scaleKitProductDefinitions.map((product) => ({
    id: product.id,
    slug: product.slug,
    title: product.title,
    category: product.category,
    priceUsdCents: product.priceUsdCents,
    currency: product.currency,
    fileKey: product.fileKey,
  }));

export function getServerVaultProductById(productId: string) {
  return serverVaultCatalog.find((product) => product.id === productId);
}