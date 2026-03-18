"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type StickyProductNavProps = {
  productName: string;
  price: string;
  productId: number;
};

export default function StickyProductNav({ productName, price, productId }: StickyProductNavProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-14 backdrop-blur border-b border-[#d2d2d7] flex items-center justify-between px-4 md:px-8"
      style={{ fontFamily: "var(--font-sans)", backgroundColor: "rgba(251,251,253,0.92)" }}
    >
      <Link href="/" className="text-[#0E7C86] font-semibold text-sm tracking-wide">
        AUSVIA
      </Link>
      <p className="absolute left-1/2 -translate-x-1/2 text-[#1d1d1f] text-sm font-medium max-w-[40%] truncate">
        {productName}
      </p>
      <Link href="#buy" className="text-[#0E7C86] text-sm font-medium hover:underline">
        Add to Cart ·{" "}
        {price ? (
          <span
            style={{
              fontFamily:
                'system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
              fontWeight: 600,
              letterSpacing: "-0.02em",
              fontVariantNumeric: "lining-nums tabular-nums",
              fontFeatureSettings: '"lnum" 1, "tnum" 1',
            }}
          >
            ${price}
          </span>
        ) : (
          ""
        )}
      </Link>
    </header>
  );
}
