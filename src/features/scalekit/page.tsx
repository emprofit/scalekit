import Link from "next/link";

import SiteShell from "@/components/layout/site-shell";
import VaultHero from "./components/vault-hero";
import VaultFaq from "./components/vault-faq";
import VaultProductCard from "./components/vault-product-card";
import { vaultProducts } from "./data/vault-products";
import { vaultUi } from "./lib/vault-ui";

const scaleKitCategories = [
  "Research & Insights",
  "SEO & Discovery",
  "Performance & Speed",
  "Themes & Design",
  "API & Integration",
  "CRO & Conversion",
  "Automation & Growth",
  "Technical Utilities",
] as const;

export default function VaultPage() {
  const featuredProducts = vaultProducts
    .filter((item) => item.featured)
    .slice(0, 6);

  const categories = scaleKitCategories.map((category) => ({
    name: category,
    productCount: vaultProducts.filter(
      (product) => product.category === category,
    ).length,
  }));

  return (
    <SiteShell>
      <VaultHero />

      <section className="px-4 pb-16 pt-16 sm:px-6">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-8 text-center">
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-[#0064E0]">
              Explore by category
            </p>

            <h2 className="mx-auto mt-3 max-w-[760px] text-3xl font-medium tracking-[-0.035em] text-slate-950 sm:text-4xl">
              Find the right tools for your next stage of growth.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                href="/shop"
                className="group flex min-h-[86px] items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 transition hover:-translate-y-0.5 hover:border-[#0064E0]/40 hover:shadow-[0_14px_36px_rgba(15,23,42,0.08)]"
              >
                <span className="text-sm font-medium text-slate-800 transition group-hover:text-[#0064E0]">
                  {category.name}
                </span>

                <span className="shrink-0 rounded-full bg-[#EAF3FF] px-2.5 py-1 text-xs font-medium text-[#0064E0]">
                  {category.productCount}{" "}
                  {category.productCount === 1 ? "product" : "products"}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.16em] text-slate-500">
                Featured Products
              </p>

              <h2 className="mt-3 text-3xl font-medium tracking-[-0.03em] text-slate-950 sm:text-4xl">
                Start with tools built for real execution.
              </h2>
            </div>

            <Link href="/shop" className={vaultUi.primaryButton}>
              Visit Shop
            </Link>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {featuredProducts.map((product) => (
              <VaultProductCard
                key={product.id}
                product={product}
                action={{
                  type: "link",
                  href: "/shop",
                  label: "View in Shop",
                  className: vaultUi.secondaryButton,
                }}
              />
            ))}
          </div>
        </div>
      </section>

      <VaultFaq />
    </SiteShell>
  );
}