"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import type { VaultProduct } from "../lib/vault-types";
import { formatUsd } from "../lib/currency";
import VaultProductDetailsModal from "./vault-product-details-modal";
import VaultProductStars from "./vault-product-stars";

type VaultProductCardAction =
  | {
      type: "link";
      label: string;
      href: string;
      className: string;
    }
  | {
      type: "button";
      label: string;
      onClick: () => void;
      className: string;
    };

type VaultProductCardProps = {
  product: VaultProduct;
  action: VaultProductCardAction;
};

export default function VaultProductCard({
  product,
  action,
}: VaultProductCardProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <>
      <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white">
        <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100">
          <Image
            src={product.image}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          />

          <VaultProductStars
            rating={product.rating}
            reviewCount={product.reviewCount}
          />
        </div>

        <div className="p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">
            {product.category}
          </p>

          <h3 className="mt-3 text-xl font-medium text-slate-950">
            {product.title}
          </h3>

          <p className="mt-3 text-sm leading-7 text-slate-600">
            <button
              type="button"
              onClick={() => setDetailsOpen(true)}
              className="group mr-2 inline-flex items-center font-semibold text-[#0A84FF] transition-colors hover:text-[#006FE0]"
            >
              See details
              <span className="ml-1 transition-transform duration-200 group-hover:translate-x-0.5">
                {"\u2192"}
              </span>
            </button>
            <span>{product.shortDescription}</span>
          </p>

          <div className="mt-6 flex items-center justify-between gap-4">
            <p className="text-base font-semibold text-slate-950">
              {formatUsd(product.price)}
            </p>

            {action.type === "link" ? (
              <Link href={action.href} className={action.className}>
                {action.label}
              </Link>
            ) : (
              <button
                type="button"
                onClick={action.onClick}
                className={action.className}
              >
                {action.label}
              </button>
            )}
          </div>
        </div>
      </div>

      <VaultProductDetailsModal
        product={product}
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
      />
    </>
  );
}
