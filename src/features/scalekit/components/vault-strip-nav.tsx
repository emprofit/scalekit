"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { useVaultCart } from "../hooks/use-vault-cart";
import { vaultStripLinks } from "./vault-strip-links";

export function VaultStripNav() {
  const pathname = usePathname();
  const { itemCount } = useVaultCart();

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const updateScrollState = () => {
      const { scrollLeft, scrollWidth, clientWidth } = el;
      setCanScrollLeft(scrollLeft > 4);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
    };

    updateScrollState();

    el.addEventListener("scroll", updateScrollState);
    window.addEventListener("resize", updateScrollState);

    return () => {
      el.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [pathname, itemCount]);

  const scrollByAmount = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    const amount = 220;
    el.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="border-y border-slate-200 bg-[#F1F3F4]">
      <div className="mx-auto max-w-[1280px] px-5 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <div className="relative">
            {canScrollLeft && (
              <>
                <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-gradient-to-r from-[#F1F3F4] to-transparent" />
                <button
                  type="button"
                  aria-label="Scroll left"
                  onClick={() => scrollByAmount("left")}
                  className="absolute inset-y-0 left-0 z-20 flex items-center pl-1"
                >
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#2563EB] shadow-sm transition hover:bg-[#1D4ED8]">
                    <ChevronLeft className="h-4 w-4 text-white" />
                  </span>
                </button>
              </>
            )}

            {canScrollRight && (
              <>
                <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-gradient-to-l from-[#F1F3F4] to-transparent" />
                <button
                  type="button"
                  aria-label="Scroll right"
                  onClick={() => scrollByAmount("right")}
                  className="absolute inset-y-0 right-0 z-20 flex items-center pr-1"
                >
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#2563EB] shadow-sm transition hover:bg-[#1D4ED8]">
                    <ChevronRight className="h-4 w-4 text-white" />
                  </span>
                </button>
              </>
            )}

            <div
              ref={scrollRef}
              className="no-scrollbar w-full overflow-x-auto overflow-y-hidden"
            >
              <nav className="mx-auto flex min-w-max items-center justify-center gap-8 text-black/60 sm:gap-10 lg:gap-14">
                {vaultStripLinks.map((item) => {
                  const isActive = pathname === item.href;
                  const label =
                    item.href === "/cart" && itemCount > 0
                      ? `Cart (${itemCount})`
                      : item.label;

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={[
                        "relative inline-flex items-center justify-center whitespace-nowrap border-b-2 px-1 pb-4 pt-4 text-sm font-medium tracking-[-0.01em] transition-colors duration-200",
                        isActive
                          ? "border-[#2563EB] text-slate-950"
                          : "border-transparent text-slate-500 hover:text-slate-800",
                      ].join(" ")}
                    >
                      {label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
