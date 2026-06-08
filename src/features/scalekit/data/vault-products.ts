import type { StaticImageData } from "next/image";

import researchInsightsImage from "@/assets/products/scalekit/research-insights.png";
import seoDiscoveryImage from "@/assets/products/scalekit/seo-discovery.png";
import performanceSpeedImage from "@/assets/products/scalekit/performance-speed.png";
import themesDesignImage from "@/assets/products/scalekit/themes-design.png";
import apiIntegrationImage from "@/assets/products/scalekit/api-integration.png";
import croConversionImage from "@/assets/products/scalekit/cro-conversion.png";
import automationGrowthImage from "@/assets/products/scalekit/automation-growth.png";
import technicalUtilitiesImage from "@/assets/products/scalekit/technical-utilities.png";

import {
  scaleKitProductDefinitions,
  type ScaleKitProductImageKey,
} from "@/data/scalekit-products";
import type { VaultProduct } from "../lib/vault-types";

const productImages: Record<ScaleKitProductImageKey, StaticImageData> = {
  "research-insights": researchInsightsImage,
  "seo-discovery": seoDiscoveryImage,
  "performance-speed": performanceSpeedImage,
  "themes-design": themesDesignImage,
  "api-integration": apiIntegrationImage,
  "cro-conversion": croConversionImage,
  "automation-growth": automationGrowthImage,
  "technical-utilities": technicalUtilitiesImage,
};

export const vaultProducts: VaultProduct[] = scaleKitProductDefinitions.map(
  (product) => ({
    id: product.id,
    slug: product.slug,
    title: product.title,
    category: product.category,
    shortDescription: product.shortDescription,
    price: product.priceUsdCents / 100,
    priceUsdCents: product.priceUsdCents,
    currency: product.currency,
    featured: product.featured,
    deliveryType: product.deliveryType,
    fileKey: product.fileKey,
    image: productImages[product.imageKey],
    rating: product.rating,
    reviewCount: product.reviewCount,
    details: product.details,
  }),
);

export function getVaultProductById(productId: string) {
  return vaultProducts.find((product) => product.id === productId);
}