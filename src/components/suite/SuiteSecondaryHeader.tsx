"use client";

import Link from "next/link";
import { useMemo, useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

const suiteNavItems = [
  { label: "Model Suite", href: "/models/suite" },
  { label: "Launch Suite", href: "/suite/launch-suite" },
  { label: "Impact Suite", href: "/suite/impact-suite" },
  { label: "Pricing", href: "/suite/pricing" },
];

const SUITE_NAV_COLORS = {
  bg: "#F8FAFC",
  border: "#E2E8F0",
  text: "#64748B",
  textHover: "#0F172A",
  textActive: "#000A16",
  activeLine: "#0A84FF",
};

function isPathActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function SuiteSecondaryHeader() {
  const pathname = usePathname();
  const scrollRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const isSuitePage = useMemo(() => {
    return (
      pathname?.startsWith("/models/suite") || pathname?.startsWith("/suite/")
    );
  }, [pathname]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !isSuitePage) return;

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
  }, [pathname, isSuitePage]);

  const scrollByAmount = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollBy({
      left: direction === "left" ? -220 : 220,
      behavior: "smooth",
    });
  };

  if (!isSuitePage) return null;

  return (
    <div
      className="border-y"
      style={{
        backgroundColor: SUITE_NAV_COLORS.bg,
        borderColor: SUITE_NAV_COLORS.border,
      }}
    >
      <div className="mx-auto w-full max-w-[1480px] px-4 sm:px-6 lg:px-8">
        <div className="min-w-0">
          <div className="relative">
            {canScrollLeft && (
              <>
                <div
                  className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14"
                  style={{
                    background: `linear-gradient(to right, ${SUITE_NAV_COLORS.bg}, transparent)`,
                  }}
                />
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
                <div
                  className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14"
                  style={{
                    background: `linear-gradient(to left, ${SUITE_NAV_COLORS.bg}, transparent)`,
                  }}
                />
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
              <nav className="flex min-w-max items-center gap-6 py-2 md:justify-center md:gap-8 lg:gap-10">
                {suiteNavItems.map((item) => {
                  const isActive = isPathActive(pathname, item.href);

                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="group relative shrink-0 px-1 py-3 text-[13px] font-medium tracking-[-0.01em] transition sm:text-sm"
                      style={{
                        color: isActive
                          ? SUITE_NAV_COLORS.textActive
                          : SUITE_NAV_COLORS.text,
                      }}
                    >
                      <span
                        className="transition-colors duration-200"
                        style={{
                          color: isActive
                            ? SUITE_NAV_COLORS.textActive
                            : undefined,
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.color =
                              SUITE_NAV_COLORS.textHover;
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.color = "";
                          }
                        }}
                      >
                        {item.label}
                      </span>

                      <span
                        className={`absolute bottom-0 left-0 h-[2px] rounded-full transition-all duration-200 ${
                          isActive
                            ? "w-full opacity-100"
                            : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                        }`}
                        style={{ backgroundColor: SUITE_NAV_COLORS.activeLine }}
                      />
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
