"use client";

import Image from "next/image";
import Link from "next/link";

import SiteShell from "@/components/layout/site-shell";
import { useVaultCart } from "../hooks/use-vault-cart";
import { vaultUi } from "../lib/vault-ui";
import { formatUsd } from "../lib/currency";

export default function VaultCartPage() {
  const { items, subtotal, isEmpty, removeItem, clearCart } = useVaultCart();

  return (
    <SiteShell>
      {/* <VaultStripNav /> */}
      <section className="px-4 py-16 sm:px-6 md:py-20">
        <div className="mx-auto max-w-[1100px]">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-blue-600">
            Cart
          </p>

          <h1 className="mt-4 text-4xl font-medium leading-[1.05] tracking-[-0.04em] text-slate-950 sm:text-5xl">
            Review selected ScaleKit products.
          </h1>

          {isEmpty ? (
            <div className="mt-10 rounded-[28px] border border-slate-200 bg-white p-8">
              <p className="text-lg font-medium text-slate-950">
                Your cart is empty.
              </p>
              <p className="mt-3 max-w-2xl text-base leading-8 text-slate-600">
                Browse the ScaleKit shop and add the products you want to purchase.
              </p>

              <Link
                href="/shop"
                className={`${vaultUi.primaryButton} mt-6`}
              >
                Go to Shop
              </Link>
            </div>
          ) : (
            <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_340px]">
              <div className="rounded-[28px] border border-slate-200 bg-white p-6 md:p-8">
                <div className="space-y-5">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                    >
                      <div className="flex flex-col gap-5 sm:flex-row">
                        <div className="relative h-28 w-full overflow-hidden rounded-2xl bg-white sm:h-28 sm:w-36">
                          <Image
                            src={item.product.image}
                            alt={item.product.title}
                            fill
                            className="object-cover"
                            sizes="144px"
                          />
                        </div>

                        <div className="flex flex-1 flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-600">
                              {item.product.category}
                            </p>
                            <h2 className="mt-2 text-lg font-semibold text-slate-950">
                              {item.product.title}
                            </h2>
                            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-600">
                              {item.product.shortDescription}
                            </p>
                          </div>

                          <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
                            <p className="text-base font-semibold text-slate-950">
                              {formatUsd(item.product.price)}
                            </p>

                            <button
                              type="button"
                              onClick={() => removeItem(item.product.id)}
                              className="text-sm font-medium text-rose-600 transition-colors hover:text-rose-700"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/shop" className={vaultUi.secondaryButton}>
                    Continue Shopping
                  </Link>

                  <button
                    type="button"
                    onClick={clearCart}
                    className={vaultUi.dangerButton}
                  >
                    Clear Cart
                  </button>
                </div>
              </div>

              <aside className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 md:p-8">
                <h3 className="text-lg font-semibold text-slate-950">
                  Order Summary
                </h3>

                <div className="mt-6 space-y-4 text-sm text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Products</span>
                    <span>{items.length}</span>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-200 pt-4 text-base font-semibold text-slate-950">
                    <span>Subtotal</span>
                    <span>{formatUsd(subtotal)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className={`${vaultUi.primaryButton} mt-6 w-full`}
                >
                  Proceed to Checkout
                </Link>
              </aside>
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
