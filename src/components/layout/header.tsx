"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  Menu,
  ShoppingCart,
  X,
} from "lucide-react";

import scaleKitLogo from "@/assets/logos/scalekit.png";
import { getVaultProductById } from "@/features/scalekit/data/vault-products";
import {
  readVaultCart,
  subscribeVaultCart,
  type VaultCartItem,
} from "@/features/scalekit/lib/vault-cart";
import { formatUsd } from "@/features/scalekit/lib/currency";

type NavigationItem = {
  label: string;
  href: string;
};

const navigationItems: NavigationItem[] = [
  {
    label: "Home",
    href: "/home",
  },
  {
    label: "Shop",
    href: "/shop",
  },
  {
    label: "Cart",
    href: "/cart",
  },
  {
    label: "Checkout",
    href: "/checkout",
  },
];

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

function getCartSummary(cart: VaultCartItem[]) {
  return cart.reduce(
    (summary, item) => {
      const product = getVaultProductById(item.productId);

      if (!product) {
        return summary;
      }

      return {
        count: summary.count + 1,
        total: summary.total + product.price,
      };
    },
    {
      count: 0,
      total: 0,
    },
  );
}

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cart, setCart] = useState<VaultCartItem[]>([]);
  const headerRef = useRef<HTMLElement | null>(null);

  const cartSummary = getCartSummary(cart);

  useEffect(() => {
    function refreshCart() {
      setCart(readVaultCart());
    }

    refreshCart();

    return subscribeVaultCart(refreshCart);
  }, []);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (
        mobileOpen &&
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setMobileOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [mobileOpen]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setMobileOpen(false);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [pathname]);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 shadow-[0_8px_30px_rgba(15,23,42,0.04)] backdrop-blur-xl"
    >
      <div className="relative mx-auto flex h-[78px] w-full max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link
          href="/home"
          aria-label="ScaleKit home"
          className="flex shrink-0 items-center"
        >
          <div className="relative h-12 w-12 overflow-hidden rounded-2xl">
            <Image
              src={scaleKitLogo}
              alt="ScaleKit logo"
              fill
              sizes="48px"
              className="object-contain"
              priority
            />
          </div>
        </Link>

        <nav
          className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1.5 lg:flex"
          aria-label="ScaleKit primary navigation"
        >
          {navigationItems.map((item) => {
            const active = isActivePath(pathname, item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-[#EAF3FF] text-[#0064E0]"
                    : "text-[#000A16] hover:bg-slate-100 hover:text-[#0064E0]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/cart"
            aria-label={`View cart with ${cartSummary.count} products`}
            className="group hidden min-h-12 items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 transition hover:border-[#0064E0]/40 hover:bg-[#F5F9FF] lg:inline-flex"
          >
            <span className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#EAF3FF] text-[#0064E0]">
              <ShoppingCart className="h-4.5 w-4.5" strokeWidth={1.9} />

              <span className="absolute -right-2 -top-2 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#0064E0] px-1 text-[10px] font-medium leading-none text-white">
                {cartSummary.count > 99 ? "99+" : cartSummary.count}
              </span>
            </span>

            <span className="text-left">
              <span className="block text-[11px] font-medium uppercase tracking-[0.1em] text-slate-500">
                Cart total
              </span>

              <span className="mt-0.5 block text-sm font-medium text-[#000A16] transition group-hover:text-[#0064E0]">
                {formatUsd(cartSummary.total)}
              </span>
            </span>
          </Link>

          <Link
            href="/cart"
            aria-label={`View cart with ${cartSummary.count} products`}
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-[#000A16] transition hover:border-[#0064E0]/40 hover:bg-[#EAF3FF] lg:hidden"
          >
            <ShoppingCart className="h-5 w-5" strokeWidth={1.9} />

            <span className="absolute -right-1.5 -top-1.5 inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#0064E0] px-1 text-[10px] font-medium leading-none text-white">
              {cartSummary.count > 99 ? "99+" : cartSummary.count}
            </span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen((current) => !current)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-[#000A16] transition hover:border-[#0064E0]/40 hover:bg-[#EAF3FF] lg:hidden"
            aria-label={
              mobileOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={mobileOpen}
            aria-controls="scalekit-mobile-navigation"
          >
            {mobileOpen ? (
              <X className="h-5 w-5" strokeWidth={1.9} />
            ) : (
              <Menu className="h-5 w-5" strokeWidth={1.9} />
            )}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div
          id="scalekit-mobile-navigation"
          className="border-t border-slate-200 bg-white shadow-[0_22px_60px_rgba(15,23,42,0.12)] lg:hidden"
        >
          <nav
            className="mx-auto w-full max-w-[760px] px-4 py-5 sm:px-6"
            aria-label="ScaleKit mobile navigation"
          >
            <div className="mb-4 flex items-center justify-between rounded-2xl bg-[#F5F9FF] px-5 py-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.1em] text-slate-500">
                  Cart total
                </p>

                <p className="mt-1 text-lg font-medium text-[#000A16]">
                  {formatUsd(cartSummary.total)}
                </p>
              </div>

              <Link
                href="/cart"
                className="inline-flex items-center gap-2 rounded-xl bg-[#0064E0] px-4 py-3 text-sm font-medium text-white"
              >
                <ShoppingCart className="h-4 w-4" strokeWidth={1.9} />
                {cartSummary.count}{" "}
                {cartSummary.count === 1 ? "product" : "products"}
              </Link>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
              {navigationItems.map((item, index) => {
                const active = isActivePath(pathname, item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center justify-between px-5 py-4 text-base font-medium transition ${
                      index !== navigationItems.length - 1
                        ? "border-b border-slate-200"
                        : ""
                    } ${
                      active
                        ? "bg-[#EAF3FF] text-[#0064E0]"
                        : "text-[#000A16] hover:bg-slate-50"
                    }`}
                  >
                    <span>{item.label}</span>

                    <ChevronRight
                      className={`h-5 w-5 ${
                        active ? "text-[#0064E0]" : "text-slate-400"
                      }`}
                      strokeWidth={1.9}
                    />
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}