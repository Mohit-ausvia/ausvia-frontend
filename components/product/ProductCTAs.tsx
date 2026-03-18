"use client";

import { useState } from "react";
import AskGeorgiaDrawer from "./AskGeorgiaDrawer";

type ProductCTAsProps = {
  productName: string;
  productId?: number;
  wrapperClassName?: string;
  addToCartClassName?: string;
  askGeorgiaClassName?: string;
  /** When true, only render the Ask Georgia button (e.g. for sticky bar). */
  onlyAskGeorgia?: boolean;
  /** When "hero", button shows "✦ ASK GEORGIA" (uppercase, icon left) for the section-under-image block. */
  variant?: "default" | "hero";
};

export default function ProductCTAs({
  productName,
  productId,
  wrapperClassName = "",
  addToCartClassName = "",
  askGeorgiaClassName = "",
  onlyAskGeorgia = false,
  variant = "default",
}: ProductCTAsProps) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isHero = variant === "hero";

  return (
    <>
      <div className={`flex flex-col gap-3 ${wrapperClassName}`}>
        {!onlyAskGeorgia && !isHero && (
          <button
            type="button"
            className={`w-full bg-teal text-white py-3 rounded-md font-medium hover:bg-teal/90 transition-colors ${addToCartClassName}`}
          >
            Add to Cart
          </button>
        )}
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          className={`w-full border border-teal text-teal py-3 rounded-md font-medium hover:bg-teal/10 transition-colors flex items-center justify-center gap-2 ${askGeorgiaClassName}`}
        >
          {isHero ? (
            <>
              <span>ASK GEORGIA</span>
              <span className="inline-block text-xl font-black animate-star-spin leading-none" aria-hidden>✦</span>
            </>
          ) : (
            <>
              <span>Ask Georgia</span>
              <span className="inline-block text-lg font-black animate-star-spin leading-none" aria-hidden>✦</span>
            </>
          )}
        </button>
      </div>
      <AskGeorgiaDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        productName={productName}
      />
    </>
  );
}
