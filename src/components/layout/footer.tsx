"use client";

import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore, type ReactNode } from "react";
import {
  BadgeCheck,
  CircleHelp,
  Clock3,
  Download,
  Mail,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
} from "lucide-react";

// Temporary placeholder. Replace only this import path when the ScaleKit logo is ready.
import scaleKitLogo from "@/assets/logos/scalekit.png";

const FOOTER_COLORS = {
  bg: "#020B1C",
  accent: "#0B7CFF",
  text: "#F8FAFC",
  muted: "#C7D2E1",
  soft: "#8FA2BF",
  divider: "rgba(11, 124, 255, 0.22)",
  iconBg: "#0B7CFF",
  iconText: "#FFFFFF",
};

const DEFAULT_SERVER_HOUR = 18;

type FooterLabelTone =
  | "new"
  | "popular"
  | "research"
  | "seo"
  | "performance"
  | "design"
  | "integration"
  | "conversion"
  | "automation"
  | "technical"
  | "support"
  | "secure";

type FooterLabel = {
  text: string;
  tone: FooterLabelTone;
};

type FooterItem = {
  label: string;
  href: string;
  labels?: FooterLabel[];
};

const footerLabelClasses: Record<FooterLabelTone, string> = {
  new: "bg-[#F04D23] text-white",
  popular: "bg-[#FC7E24] text-white",
  research: "bg-[#5300D9] text-white",
  seo: "bg-[#0064E0] text-white",
  performance: "bg-[#29BE3E] text-white",
  design: "bg-[#E61525] text-white",
  integration: "bg-[#0F3D33] text-white",
  conversion: "bg-[#FC7E24] text-white",
  automation: "bg-[#651FFF] text-white",
  technical: "bg-[#334155] text-white",
  support: "bg-[#0B7CFF] text-white",
  secure: "bg-[#29BE3E] text-white",
};

const explore: FooterItem[] = [
  {
    label: "Home",
    href: "/home",
    labels: [{ text: "Start", tone: "new" }],
  },
  {
    label: "Shop",
    href: "/shop",
    labels: [{ text: "Products", tone: "popular" }],
  },
  {
    label: "Cart",
    href: "/cart",
  },
  {
    label: "Checkout",
    href: "/checkout",
    labels: [{ text: "Secure", tone: "secure" }],
  },
];

const productCategories: FooterItem[] = [
  {
    label: "Research & Insights",
    href: "/shop",
    labels: [{ text: "Research", tone: "research" }],
  },
  {
    label: "SEO & Discovery",
    href: "/shop",
    labels: [{ text: "SEO", tone: "seo" }],
  },
  {
    label: "Performance & Speed",
    href: "/shop",
    labels: [{ text: "Speed", tone: "performance" }],
  },
  {
    label: "Themes & Design",
    href: "/shop",
    labels: [{ text: "Design", tone: "design" }],
  },
  {
    label: "API & Integration",
    href: "/shop",
    labels: [{ text: "API", tone: "integration" }],
  },
  {
    label: "CRO & Conversion",
    href: "/shop",
    labels: [{ text: "CRO", tone: "conversion" }],
  },
  {
    label: "Automation & Growth",
    href: "/shop",
    labels: [{ text: "Growth", tone: "automation" }],
  },
  {
    label: "Technical Utilities",
    href: "/shop",
    labels: [{ text: "Tools", tone: "technical" }],
  },
];

const customerAccess: FooterItem[] = [
  {
    label: "Verify Download Access",
    href: "/downloads/verify",
    labels: [{ text: "Secure", tone: "secure" }],
  },
  {
    label: "Frequently Asked Questions",
    href: "/home#vault-faq",
  },
  {
    label: "Product Access Support",
    href: "mailto:info@scalekit.com?subject=ScaleKit%20Product%20Access%20Support",
    labels: [{ text: "Support", tone: "support" }],
  },
  {
    label: "Payment Support",
    href: "mailto:info@scalekit.com?subject=ScaleKit%20Payment%20Support",
  },
];

const contact: FooterItem[] = [
  {
    label: "info@scalekit.com",
    href: "mailto:info@scalekit.com",
    labels: [{ text: "Email", tone: "support" }],
  },
  {
    label: "Product Access Request",
    href: "mailto:info@scalekit.com?subject=ScaleKit%20Product%20Access%20Request",
  },
  {
    label: "Order Verification Support",
    href: "mailto:info@scalekit.com?subject=ScaleKit%20Order%20Verification%20Support",
  },
];

function getHourSnapshot() {
  return new Date().getHours();
}

function getServerHourSnapshot() {
  return DEFAULT_SERVER_HOUR;
}

function subscribeToHourChange(callback: () => void) {
  const intervalId = window.setInterval(callback, 60_000);

  return () => {
    window.clearInterval(intervalId);
  };
}

function useCurrentHour() {
  return useSyncExternalStore(
    subscribeToHourChange,
    getHourSnapshot,
    getServerHourSnapshot,
  );
}

function isExternalHref(href: string) {
  return (
    href.startsWith("http") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  );
}

function ArrowUpRightIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M7 17L17 7M17 7H9M17 7V15"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FooterMiniLabel({ label }: { label: FooterLabel }) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-md px-1.5 py-1 text-[9px] font-medium uppercase leading-none tracking-[0.03em] ${footerLabelClasses[label.tone]}`}
    >
      {label.text}
    </span>
  );
}

function FooterItemLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  const className =
    "group inline-flex items-start gap-2 text-sm leading-7 transition";
  const style = { color: FOOTER_COLORS.muted };

  if (isExternalHref(href)) {
    return (
      <a href={href} className={className} style={style}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className} style={style}>
      {children}
    </Link>
  );
}

function FooterSection({
  title,
  items,
}: {
  title: string;
  items: FooterItem[];
}) {
  return (
    <div>
      <h3
        className="text-[15px] font-medium tracking-[-0.02em]"
        style={{ color: FOOTER_COLORS.text }}
      >
        {title}
      </h3>

      <ul className="mt-6 space-y-4">
        {items.map((item) => (
          <li key={`${title}-${item.label}`}>
            <FooterItemLink href={item.href}>
              <span
                className="mt-1.25 shrink-0 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                style={{ color: FOOTER_COLORS.accent }}
              >
                <ArrowUpRightIcon />
              </span>

              <span className="transition group-hover:text-white">
                <span className="inline-flex flex-wrap items-center gap-2">
                  <span>{item.label}</span>

                  {item.labels?.map((label) => (
                    <FooterMiniLabel
                      key={`${item.label}-${label.text}-${label.tone}`}
                      label={label}
                    />
                  ))}
                </span>
              </span>
            </FooterItemLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

function QuickLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: ReactNode;
}) {
  const className =
    "inline-flex h-14 w-14 items-center justify-center rounded-full transition hover:scale-105";

  const style = {
    backgroundColor: FOOTER_COLORS.iconBg,
    color: FOOTER_COLORS.iconText,
  };

  if (isExternalHref(href)) {
    return (
      <a href={href} aria-label={label} className={className} style={style}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} aria-label={label} className={className} style={style}>
      {children}
    </Link>
  );
}

function getGreetingByHour(hour: number) {
  if (hour < 12) {
    return { text: "morning", emoji: "\u2600\uFE0F" };
  }

  if (hour < 18) {
    return { text: "afternoon", emoji: "\uD83C\uDF24\uFE0F" };
  }

  return { text: "evening", emoji: "\uD83C\uDF19" };
}

export default function Footer() {
  const hour = useCurrentHour();
  const greeting = getGreetingByHour(hour);
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="px-4 pt-14 pb-8 sm:px-6 md:px-8 md:pt-20"
      style={{ backgroundColor: FOOTER_COLORS.bg }}
    >
      <div className="mx-auto max-w-340">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <h2
              className="text-4xl font-medium leading-tight tracking-[-0.05em] sm:text-5xl md:text-6xl"
              style={{ color: FOOTER_COLORS.text }}
            >
              ScaleKit,{" "}
              <span style={{ color: FOOTER_COLORS.accent }}>
                good {greeting.text}
              </span>{" "}
              <span>{greeting.emoji}</span>
            </h2>
          </div>

          <div className="flex flex-wrap gap-4">
            <QuickLink href="/shop" label="Browse ScaleKit products">
              <ShoppingBag size={19} strokeWidth={1.9} />
            </QuickLink>

            <QuickLink href="/cart" label="View cart">
              <ShoppingCart size={19} strokeWidth={1.9} />
            </QuickLink>

            <QuickLink href="/downloads/verify" label="Verify download access">
              <Download size={19} strokeWidth={1.9} />
            </QuickLink>

            <QuickLink
              href="mailto:info@scalekit.com"
              label="Email ScaleKit support"
            >
              <Mail size={19} strokeWidth={1.9} />
            </QuickLink>
          </div>
        </div>

        <div className="mt-12 grid gap-12 xl:grid-cols-[1.2fr_0.9fr_1.2fr_1fr]">
          <div>
            <Link href="/home" className="inline-flex items-center gap-3">
              <Image
                src={scaleKitLogo}
                alt="ScaleKit logo"
                width={170}
                height={52}
                className="h-auto w-37.5 object-contain sm:w-42.5"
                priority={false}
              />
            </Link>

            <p
              className="mt-6 max-w-md text-base leading-8"
              style={{ color: FOOTER_COLORS.muted }}
            >
              ScaleKit provides practical digital tools for research, SEO,
              performance, conversion, automation, integration, and technical
              growth.
            </p>
          </div>

          <FooterSection title="Explore" items={explore} />
          <FooterSection
            title="Product Categories"
            items={productCategories}
          />
          <FooterSection title="Customer Access" items={customerAccess} />
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <FooterSection title="Contact & Support" items={contact} />

          <div
            className="rounded-[28px] border p-6 sm:p-7"
            style={{ borderColor: FOOTER_COLORS.divider }}
          >
            <h3
              className="text-[15px] font-medium tracking-[-0.02em]"
              style={{ color: FOOTER_COLORS.text }}
            >
              Secure Product Delivery
            </h3>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-white/[0.035] p-4">
                <ShieldCheck
                  className="h-5 w-5"
                  style={{ color: FOOTER_COLORS.accent }}
                  strokeWidth={1.9}
                />
                <p className="mt-3 text-sm font-medium text-white">
                  Secure checkout
                </p>
                <p
                  className="mt-2 text-xs leading-6"
                  style={{ color: FOOTER_COLORS.soft }}
                >
                  Payments are processed through protected payment channels.
                </p>
              </div>

              <div className="rounded-2xl bg-white/[0.035] p-4">
                <BadgeCheck
                  className="h-5 w-5"
                  style={{ color: FOOTER_COLORS.accent }}
                  strokeWidth={1.9}
                />
                <p className="mt-3 text-sm font-medium text-white">
                  Verified access
                </p>
                <p
                  className="mt-2 text-xs leading-6"
                  style={{ color: FOOTER_COLORS.soft }}
                >
                  Product access is linked to the email used at checkout.
                </p>
              </div>

              <div className="rounded-2xl bg-white/[0.035] p-4">
                <Clock3
                  className="h-5 w-5"
                  style={{ color: FOOTER_COLORS.accent }}
                  strokeWidth={1.9}
                />
                <p className="mt-3 text-sm font-medium text-white">
                  Access support
                </p>
                <p
                  className="mt-2 text-xs leading-6"
                  style={{ color: FOOTER_COLORS.soft }}
                >
                  Assisted access requests are handled within 24 hours.
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p
                className="text-sm leading-7"
                style={{ color: FOOTER_COLORS.soft }}
              >
                Need help with an order, payment, or download?
              </p>

              <a
                href="mailto:info@scalekit.com?subject=ScaleKit%20Support"
                className="inline-flex items-center gap-2 text-sm font-medium text-white transition hover:text-[#5EA2FF]"
              >
                <CircleHelp size={17} strokeWidth={1.9} />
                Contact Support
              </a>
            </div>
          </div>
        </div>

        <div
          className="mt-14 border-t pt-6"
          style={{ borderColor: FOOTER_COLORS.divider }}
        >
          <div className="flex flex-col gap-3 text-sm md:flex-row md:items-center md:justify-between">
            <p style={{ color: FOOTER_COLORS.muted }}>
              {"\u00A9"} {currentYear} ScaleKit. All Rights Reserved.
            </p>

            <p style={{ color: FOOTER_COLORS.soft }}>
              Digital tools for execution and growth.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
