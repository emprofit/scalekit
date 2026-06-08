"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import SiteShell from "@/components/layout/site-shell";
import { useVaultCart } from "../hooks/use-vault-cart";
import {
  readVaultCheckoutEmail,
  writeVaultCheckoutEmail,
} from "../lib/vault-checkout";
import { vaultUi } from "../lib/vault-ui";
import { formatNgn, formatUsd } from "../lib/currency";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

type PaymentProvider = "paystack" | "flutterwave";

async function parseApiResponse(response: Response) {
  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      text.startsWith("<!DOCTYPE")
        ? "The server returned an HTML error page instead of JSON. Check the API route and server logs."
        : text || "The server returned an invalid response.",
    );
  }
}

export default function VaultCheckoutPage() {
  const { items, subtotal, isEmpty } = useVaultCart();
  const [email, setEmail] = useState("");
  const [activeProvider, setActiveProvider] = useState<PaymentProvider | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [fxRate, setFxRate] = useState<number | null>(null);

  useEffect(() => {
    setEmail(readVaultCheckoutEmail());
  }, []);

  useEffect(() => {
    writeVaultCheckoutEmail(email);
  }, [email]);

  useEffect(() => {
    let active = true;

    async function loadRate() {
      try {
        const response = await fetch("/api/fx/usd-ngn");
        const json = await response.json();

        if (
          active &&
          response.ok &&
          json?.ok === true &&
          Number.isFinite(Number(json.rate))
        ) {
          setFxRate(Number(json.rate));
        }
      } catch {
        // The server retrieves the authoritative rate when payment starts.
      }
    }

    void loadRate();

    return () => {
      active = false;
    };
  }, []);

  const emailIsValid = useMemo(() => isValidEmail(email), [email]);

  async function startPayment(provider: PaymentProvider) {
    if (!emailIsValid || items.length === 0) return;

    try {
      setErrorMessage("");
      setActiveProvider(provider);

      const response = await fetch(`/api/payments/${provider}/initialize`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          productIds: items.map((item) => item.product.id),
        }),
      });

      const json = await parseApiResponse(response);

      if (!response.ok || !json?.authorizationUrl) {
        throw new Error(
          json?.error || `Unable to initialize ${provider} payment.`,
        );
      }

      window.location.href = json.authorizationUrl;
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Payment initialization failed.",
      );
      setActiveProvider(null);
    }
  }

  return (
    <SiteShell>
      {/* <VaultStripNav /> */}
      <section className="px-4 py-16 sm:px-6 md:py-20">
        <div className="mx-auto max-w-[1100px]">
          <p className="text-sm font-medium uppercase tracking-[0.16em] text-blue-600">
            Checkout
          </p>

          <h1 className="mt-4 text-4xl font-medium leading-[1.05] tracking-[-0.04em] text-slate-950 sm:text-5xl">
            Secure payment and digital delivery.
          </h1>

          {isEmpty ? (
            <div className="mt-10 rounded-[28px] border border-slate-200 bg-white p-8">
              <p className="text-lg font-medium text-slate-950">
                No products in checkout yet.
              </p>
              <p className="mt-3 max-w-2xl text-base leading-8 text-slate-600">
                Add products to your cart before continuing to checkout.
              </p>

              <Link
                href="/shop"
                className={`${vaultUi.primaryButton} mt-6`}
              >
                Go to Shop
              </Link>
            </div>
          ) : (
            <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_360px]">
              <div className="rounded-[28px] border border-slate-200 bg-white p-8">
                <h2 className="text-xl font-semibold text-slate-950">
                  Customer details
                </h2>

                <div className="mt-6">
                  <label
                    htmlFor="vault-checkout-email"
                    className="block text-sm font-medium text-slate-700"
                  >
                    Payment email
                  </label>

                  <input
                    id="vault-checkout-email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-[#0A84FF]"
                  />

                  <p className="mt-3 text-sm leading-7 text-slate-500">
                    This email will be used for payment confirmation and secure
                    download delivery for purchased products.
                  </p>
                </div>

                <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">
                  <h3 className="text-base font-semibold text-slate-950">
                    Delivery rule
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-slate-700">
                    Only the email used to complete payment will receive the
                    secure ScaleKit download access. The access package is
                    issued after payment verification. Assisted product access
                    requests are handled within 24 hours through{" "}
                    <a
                      href="mailto:info@scalekit.com"
                      className="font-medium text-blue-700 underline underline-offset-2"
                    >
                      info@scalekit.com
                    </a>
                    .
                  </p>
                </div>

                <div className="mt-8">
                  <h3 className="text-base font-semibold text-slate-950">
                    Payment methods
                  </h3>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <button
                      type="button"
                      disabled={!emailIsValid || !!activeProvider}
                      onClick={() => startPayment("paystack")}
                      className={`${vaultUi.primaryButton} disabled:cursor-not-allowed disabled:opacity-50`}
                    >
                      {activeProvider === "paystack"
                        ? "Redirecting..."
                        : "Pay with Paystack"}
                    </button>

                    <button
                      type="button"
                      disabled={!emailIsValid || !!activeProvider}
                      onClick={() => startPayment("flutterwave")}
                      className={`${vaultUi.secondaryButton} disabled:cursor-not-allowed disabled:opacity-50`}
                    >
                      {activeProvider === "flutterwave"
                        ? "Redirecting..."
                        : "Pay with Flutterwave"}
                    </button>
                  </div>

                  {!emailIsValid && (
                    <p className="mt-3 text-sm text-amber-600">
                      Enter a valid email to continue to payment.
                    </p>
                  )}

                  {errorMessage && (
                    <p className="mt-3 text-sm text-rose-600">{errorMessage}</p>
                  )}

                  <p className="mt-4 text-xs leading-5 text-slate-500">
                    Prices are displayed in USD. Your final payable amount in
                    NGN will be calculated securely at checkout.
                  </p>
                </div>
              </div>

              <aside className="rounded-[28px] border border-slate-200 bg-slate-50 p-6 md:p-8">
                <h3 className="text-lg font-semibold text-slate-950">
                  Order Summary
                </h3>

                <div className="mt-6 space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.product.id}
                      className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-3"
                    >
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                        <Image
                          src={item.product.image}
                          alt={item.product.title}
                          fill
                          className="object-cover"
                          sizes="64px"
                        />
                      </div>

                      <div className="flex min-w-0 flex-1 items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-slate-950">
                            {item.product.title}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {item.product.category}
                          </p>
                        </div>

                        <p className="shrink-0 text-sm font-semibold text-slate-950">
                          {formatUsd(item.product.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 border-t border-slate-200 pt-4">
                  <div className="flex items-center justify-between text-base font-semibold text-slate-950">
                    <span>Total</span>
                    <div className="text-right">
                      <div>{formatUsd(subtotal)}</div>
                      {fxRate ? (
                        <div className="mt-1 text-xs font-medium text-slate-500">
                          Approx. {formatNgn(Math.ceil(subtotal * fxRate))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
