"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { VerticalConfig } from "@/config/verticals";
import type { MockProduct } from "@/lib/mock-category-data";
import GeorgiaHeroBlock from "@/components/category/GeorgiaHeroBlock";
import SubcategoryPills from "@/components/category/SubcategoryPills";
import FilterBar from "@/components/category/FilterBar";
import ProductCard from "@/components/category/ProductCard";
import GeorgiaDrawer from "@/components/category/GeorgiaDrawer";
import GeorgiaCompactBar from "@/components/category/GeorgiaCompactBar";

type CategoryPageClientProps = {
  verticalKey: string;
  config: VerticalConfig;
  products: MockProduct[];
  initialSub?: string;
};

export default function CategoryPageClient({
  verticalKey,
  config,
  products,
  initialSub,
}: CategoryPageClientProps) {
  const searchParams = useSearchParams();
  const [activeSub, setActiveSub] = useState(() => {
    const desired = (initialSub ?? "All").trim();
    return config.subcategories.includes(desired) ? desired : "All";
  });
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showCompactBar, setShowCompactBar] = useState(false);

  useEffect(() => {
    const desired = (searchParams.get("sub") ?? initialSub ?? "All").trim();
    const next = config.subcategories.includes(desired) ? desired : "All";
    setActiveSub(next);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, config.subcategories.join("|")]);

  useEffect(() => {
    const onScroll = () => {
      // Show compact bar after scrolling past ~280px (below hero area)
      if (window.scrollY > 280) setShowCompactBar(true);
      else setShowCompactBar(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filteredProducts =
    activeSub === "All"
      ? products
      : products.filter((p) => p.subcategory === activeSub);

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb + Hero */}
      <div className="bg-white">
        {/* Breadcrumb — same as product page: blended dividers, ol/li, grey links, black current */}
        <div className="max-w-[1400px] mx-auto px-4 md:px-10 pt-2 md:pt-2 pb-1">
          <nav className="my-2 py-0 mb-0" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-x-2 font-sans text-sm md:text-base text-[#6b6b6b]">
              <li>
                <Link href="/" className="hover:underline hover:text-[#444]">
                  Home
                </Link>
              </li>
              <li className="text-[#9a9a9a]" aria-hidden="true"> &gt; </li>
              <li className="text-black font-medium">
                {config.label}
              </li>
              {activeSub !== "All" && (
                <>
                  <li className="text-[#9a9a9a]" aria-hidden="true"> &gt; </li>
                  <li className="text-black font-medium" aria-current="page">
                    {activeSub}
                  </li>
                </>
              )}
            </ol>
          </nav>
        </div>

        {/* Georgia Hero Block */}
        <GeorgiaHeroBlock
          georgiaIntro={config.georgiaIntro}
          georgiaHeading={config.georgiaHeading}
          georgiaSub={config.georgiaSub}
          georgiaDescription={config.georgiaDescription}
          onAskGeorgia={() => setDrawerOpen(true)}
        />

      </div>

      {/* Subcategory Pills */}
      <SubcategoryPills
        subcategories={config.subcategories}
        active={activeSub}
        onSelect={setActiveSub}
      />

      {/* Filter Bar */}
      <FilterBar resultCount={filteredProducts.length} />

      {/* Product Grid */}
      <div className="px-3 pt-1 pb-[100px] grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 bg-white">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            productSlug={product.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")}
          />
        ))}
      </div>

      {/* Compact Georgia bar — only when hero is scrolled past and drawer is closed */}
      {showCompactBar && !drawerOpen && (
        <GeorgiaCompactBar
          verticalLabel={config.label}
          onAskGeorgia={() => setDrawerOpen(true)}
        />
      )}

      {/* Georgia Drawer */}
      <GeorgiaDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        verticalLabel={config.label}
      />
    </div>
  );
}
