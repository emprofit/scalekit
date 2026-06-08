import type { StaticImageData } from "next/image";
import type { ScaleKitProductCategory } from "@/data/scalekit-products";

export type VaultProductCategory = ScaleKitProductCategory;

export type VaultProduct = {
  id: string;
  slug: string;
  title: string;
  category: VaultProductCategory;
  shortDescription: string;
  price: number;
  priceUsdCents: number;
  currency: "USD";
  featured?: boolean;
  deliveryType: "email-download";
  fileKey: string;
  image: StaticImageData;
  rating: number;
  reviewCount: number;
  details: {
    summary: string;
    businessBenefits: string[];
    productivityBenefits: string[];
  };
};