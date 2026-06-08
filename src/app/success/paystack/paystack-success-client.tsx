"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type VerifyState =
  | { kind: "loading" }
  | { kind: "success"; reference: string }
  | { kind: "pending"; reference?: string }
  | { kind: "error"; message: string };

async function parseApiResponse(response: Response) {
  const text = await response.text();

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      text.startsWith("<!DOCTYPE")
        ? "The server returned an HTML error page instead of JSON."
        : text || "Invalid server response.",
    );
  }
}

export default function PaystackSuccessClient() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const [state, setState] = useState<VerifyState>({ kind: "loading" });

  useEffect(() => {
    if (!reference) {
      queueMicrotask(() => {
        setState({
          kind: "error",
          message: "No payment reference was returned.",
        });
      });

      return;
    }

    const safeReference = reference;
    let cancelled = false;

    async function verify() {
      try {
        const response = await fetch(
          `/api/payments/paystack/verify?reference=${encodeURIComponent(safeReference)}`,
          { method: "GET" },
        );

        const json = await parseApiResponse(response);

        if (cancelled) return;

        if (json?.verified) {
          setState({ kind: "success", reference: safeReference });
          return;
        }

        setState({ kind: "pending", reference: safeReference });
      } catch (error) {
        if (!cancelled) {
          setState({
            kind: "error",
            message:
              error instanceof Error
                ? error.message
                : "We could not verify the payment yet.",
          });
        }
      }
    }

    verify();

    return () => {
      cancelled = true;
    };
  }, [reference]);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-16 sm:px-6 md:py-24">
      <div className="mx-auto max-w-[760px] rounded-[32px] border border-slate-200 bg-white p-8 md:p-10">
        <p className="text-sm font-medium uppercase tracking-[0.16em] text-blue-600">
          Paystack Payment
        </p>

        {state.kind === "loading" && (
          <>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-4xl">
              Verifying your payment...
            </h1>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Please wait while we confirm your transaction on the server.
            </p>
          </>
        )}

        {state.kind === "success" && (
          <>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-4xl">
              Payment confirmed.
            </h1>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Your order has been marked as paid. Reference:{" "}
              <span className="font-medium text-slate-900">
                {state.reference}
              </span>
            </p>
          </>
        )}

        {state.kind === "pending" && (
          <>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-4xl">
              Payment received, still confirming.
            </h1>
            <p className="mt-4 text-base leading-8 text-slate-600">
              We have your reference and are waiting for a confirmed successful
              status.
            </p>
          </>
        )}

        {state.kind === "error" && (
          <>
            <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-4xl">
              We could not confirm the payment.
            </h1>
            <p className="mt-4 text-base leading-8 text-slate-600">
              {state.message}
            </p>
          </>
        )}

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/shop"
            className="inline-flex rounded-full bg-[#0A84FF] px-5 py-3 text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#006FE0]"
          >
            Back to Shop
          </Link>

          <Link
            href="/checkout"
            className="inline-flex rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition-colors duration-200 hover:border-slate-300 hover:bg-slate-50"
          >
            Return to Checkout
          </Link>
        </div>
      </div>
    </main>
  );
}
