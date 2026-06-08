"use client";

import Image from "next/image";
import { useEffect } from "react";

import type { VaultProduct } from "../lib/vault-types";
import { formatUsd } from "../lib/currency";

type VaultProductDetailsModalProps = {
  product: VaultProduct;
  open: boolean;
  onClose: () => void;
};

function CloseIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M6 6L18 18M18 6L6 18"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function VaultProductDetailsModal({
  product,
  open,
  onClose,
}: VaultProductDetailsModalProps) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90]">
      <div
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <div className="absolute inset-x-4 top-1/2 mx-auto w-full max-w-3xl -translate-y-1/2 overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-2xl">
        <div className="grid max-h-[85vh] overflow-y-auto lg:grid-cols-[320px_minmax(0,1fr)]">
          <div className="relative min-h-[240px] bg-slate-100 lg:min-h-full">
            <Image
              src={product.image}
              alt={product.title}
              fill
              className="object-cover"
              sizes="320px"
            />
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">
                  {product.category}
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-slate-950">
                  {product.title}
                </h3>
                <p className="mt-3 text-base font-semibold text-slate-950">
                  {formatUsd(product.price)}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50"
                aria-label="Close product details"
              >
                <CloseIcon />
              </button>
            </div>

            <p className="mt-6 text-sm leading-7 text-slate-600">
              {product.details.summary}
            </p>

            <div className="mt-8">
              <h4 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
                How this helps your business
              </h4>
              <ul className="mt-4 space-y-3">
                {product.details.businessBenefits.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-500" />
                    <span className="text-sm leading-7 text-slate-700">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8">
              <h4 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
                Productivity impact
              </h4>
              <ul className="mt-4 space-y-3">
                {product.details.productivityBenefits.map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-1 h-2.5 w-2.5 rounded-full bg-emerald-500" />
                    <span className="text-sm leading-7 text-slate-700">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
