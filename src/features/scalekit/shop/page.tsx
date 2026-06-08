"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  Search,
  ShoppingCart,
  SlidersHorizontal,
  X,
} from "lucide-react";

import SiteShell from "@/components/layout/site-shell";

import VaultProductCard from "../components/vault-product-card";
import { vaultProducts } from "../data/vault-products";
import { useVaultCart } from "../hooks/use-vault-cart";
import type { VaultProductCategory } from "../lib/vault-types";

type CategoryFilter = "All Products" | VaultProductCategory;

type SortOption =
  | "recommended"
  | "name-ascending"
  | "price-low"
  | "price-high";

const categoryOptions: CategoryFilter[] = [
  "All Products",
  "Research & Insights",
  "SEO & Discovery",
  "Performance & Speed",
  "Themes & Design",
  "API & Integration",
  "CRO & Conversion",
  "Automation & Growth",
  "Technical Utilities",
];

const sortOptions: Array<{
  value: SortOption;
  label: string;
}> = [
  {
    value: "recommended",
    label: "Recommended",
  },
  {
    value: "name-ascending",
    label: "Name: A to Z",
  },
  {
    value: "price-low",
    label: "Price: Low to High",
  },
  {
    value: "price-high",
    label: "Price: High to Low",
  },
];

export default function ScaleKitShopPage() {
  const { addItem, hasItem, itemCount } = useVaultCart();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("All Products");
  const [sortOption, setSortOption] =
    useState<SortOption>("recommended");

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    const products = vaultProducts.filter((product) => {
      const matchesCategory =
        selectedCategory === "All Products" ||
        product.category === selectedCategory;

      const matchesSearch =
        normalizedSearch.length === 0 ||
        product.title.toLowerCase().includes(normalizedSearch) ||
        product.category.toLowerCase().includes(normalizedSearch) ||
        product.shortDescription.toLowerCase().includes(normalizedSearch);

      return matchesCategory && matchesSearch;
    });

    return [...products].sort((firstProduct, secondProduct) => {
      switch (sortOption) {
        case "name-ascending":
          return firstProduct.title.localeCompare(secondProduct.title);

        case "price-low":
          return firstProduct.price - secondProduct.price;

        case "price-high":
          return secondProduct.price - firstProduct.price;

        case "recommended":
        default:
          return 0;
      }
    });
  }, [searchQuery, selectedCategory, sortOption]);

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedCategory !== "All Products" ||
    sortOption !== "recommended";

  function clearFilters() {
    setSearchQuery("");
    setSelectedCategory("All Products");
    setSortOption("recommended");
  }

  return (
    <SiteShell>
      <section className="border-b border-white/10 bg-[#020B1C] px-4 py-16 sm:px-6 md:py-20">
        <div className="mx-auto max-w-[1200px]">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.16em] text-[#6DA9FF]">
                ScaleKit Product Store
              </p>

              <h1 className="mt-4 max-w-[850px] text-4xl font-medium leading-[1.05] tracking-[-0.045em] text-white sm:text-5xl md:text-6xl">
                Practical tools for faster execution and measurable growth.
              </h1>

              <p className="mt-6 max-w-3xl text-base font-medium leading-8 text-slate-300 sm:text-lg">
                Explore focused products for research, SEO, performance,
                conversion, automation, integrations, technical operations,
                and digital growth.
              </p>
            </div>

            <Link
              href="/cart"
              className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#0064E0] px-5 text-sm font-medium text-white transition hover:bg-[#0057C7]"
            >
              <ShoppingCart className="h-4 w-4" strokeWidth={1.9} />
              View Cart
              {itemCount > 0 ? (
                <span className="inline-flex min-h-5 min-w-5 items-center justify-center rounded-full bg-white px-1.5 text-[10px] font-medium text-[#0064E0]">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              ) : null}
            </Link>
          </div>
        </div>
      </section>

      <section className="px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-[1200px]">
          <div className="rounded-[28px] border border-slate-200 bg-white p-4 shadow-[0_16px_50px_rgba(15,23,42,0.06)] sm:p-5">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_240px]">
              <label className="relative block">
                <span className="sr-only">Search ScaleKit products</span>

                <Search
                  className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
                  strokeWidth={1.9}
                />

                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search products, categories, or capabilities"
                  className="h-13 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-11 text-sm font-medium text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-[#0064E0]/50 focus:bg-white focus:ring-4 focus:ring-[#0064E0]/10"
                />

                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-200 hover:text-slate-700"
                    aria-label="Clear product search"
                  >
                    <X className="h-4 w-4" strokeWidth={1.9} />
                  </button>
                ) : null}
              </label>

              <label className="relative block">
                <span className="sr-only">Sort ScaleKit products</span>

                <SlidersHorizontal
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  strokeWidth={1.9}
                />

                <select
                  value={sortOption}
                  onChange={(event) =>
                    setSortOption(event.target.value as SortOption)
                  }
                  className="h-13 w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-10 text-sm font-medium text-slate-700 outline-none transition focus:border-[#0064E0]/50 focus:bg-white focus:ring-4 focus:ring-[#0064E0]/10"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
              {categoryOptions.map((category) => {
                const active = category === selectedCategory;
                const productCount =
                  category === "All Products"
                    ? vaultProducts.length
                    : vaultProducts.filter(
                        (product) => product.category === category,
                      ).length;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setSelectedCategory(category)}
                    className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition ${
                      active
                        ? "border-[#0064E0] bg-[#0064E0] text-white"
                        : "border-slate-200 bg-white text-slate-700 hover:border-[#0064E0]/40 hover:bg-[#F5F9FF] hover:text-[#0064E0]"
                    }`}
                  >
                    <span>{category}</span>

                    <span
                      className={`inline-flex min-h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] ${
                        active
                          ? "bg-white/18 text-white"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      {productCount}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-20 sm:px-6">
        <div className="mx-auto max-w-[1200px]">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Showing{" "}
                <span className="text-slate-950">
                  {filteredProducts.length}
                </span>{" "}
                {filteredProducts.length === 1 ? "product" : "products"}
              </p>

              {selectedCategory !== "All Products" ? (
                <p className="mt-1 text-sm font-medium text-[#0064E0]">
                  {selectedCategory}
                </p>
              ) : null}
            </div>

            {hasActiveFilters ? (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex items-center gap-2 self-start text-sm font-medium text-slate-600 transition hover:text-[#0064E0] sm:self-auto"
              >
                <X className="h-4 w-4" strokeWidth={1.9} />
                Clear filters
              </button>
            ) : null}
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => {
                const alreadyAdded = hasItem(product.id);

                return (
                  <VaultProductCard
                    key={product.id}
                    product={product}
                    action={
                      alreadyAdded
                        ? {
                            type: "link",
                            href: "/cart",
                            label: "Added to Cart",
                            className:
                              "inline-flex items-center justify-center rounded-full border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-medium text-blue-700 transition hover:bg-blue-100",
                          }
                        : {
                            type: "button",
                            label: "Add to Cart",
                            onClick: () => addItem(product.id),
                            className:
                              "inline-flex items-center justify-center rounded-full bg-[#0064E0] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#0057C7]",
                          }
                    }
                  />
                );
              })}
            </div>
          ) : (
            <div className="rounded-[28px] border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EAF3FF] text-[#0064E0]">
                <Search className="h-6 w-6" strokeWidth={1.9} />
              </div>

              <h2 className="mt-5 text-2xl font-medium tracking-[-0.03em] text-slate-950">
                No matching products found.
              </h2>

              <p className="mx-auto mt-3 max-w-lg text-sm font-medium leading-7 text-slate-600">
                Adjust your search or category selection to explore other
                ScaleKit tools.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-[#0064E0] px-6 text-sm font-medium text-white transition hover:bg-[#0057C7]"
              >
                View All Products
              </button>
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  );
}