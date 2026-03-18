"use client";

import Image from "next/image";
import Link from "next/link";
import type { MockProduct } from "@/lib/mock-category-data";

type ProductCardProps = {
  product: MockProduct;
  productSlug?: string;
};

/** Category grid card — same layout and styling as Georgia's Picks on product page (PairsCarousel). */
export default function ProductCard({ product, productSlug }: ProductCardProps) {
  const href = productSlug ? `/products/${productSlug}` : "#";
  const imgSrc = product.imageUrl || undefined;
  const name = product.name;
  const priceDisplay =
    product.price != null && product.price !== ""
      ? product.price.startsWith("$")
        ? product.price
        : `$${product.price}`
      : "—";
  const benefits = product.georgiaRecommends && product.georgiaLine ? product.georgiaLine : undefined;

  return (
    <Link
      href={href}
      className="group flex flex-col transition-all duration-150 outline-none border border-transparent focus-visible:border-[#1A1A18] active:border-[#1A1A18]"
    >
      {/* Image area — 1:1, white bg, same as PairsCarousel */}
      <div className="relative w-full aspect-square bg-white flex items-center justify-center">
        {imgSrc ? (
          <Image
            src={imgSrc}
            alt={name}
            fill
            className="object-contain p-2 outline-none"
            sizes="(max-width: 768px) 50vw, 25vw"
            unoptimized={imgSrc.includes("localhost") || imgSrc.startsWith("http://")}
          />
        ) : (
          <span className="text-[#8A8A86] text-xs">Product</span>
        )}
        {product.badge && (
          <span
            className="absolute top-2 left-2 rounded-full px-2 py-0.5 font-sans font-medium text-[#4A4A46]"
            style={{ fontSize: "10px", fontWeight: 500, background: "#F0F0EB" }}
          >
            {product.badge}
          </span>
        )}
      </div>

      {/* Content — same structure as Georgia's Picks */}
      <div className="flex flex-col flex-1 p-4 min-h-0">
        {/* Product name — bigger, heavy, bold */}
        <p
          className="font-sans text-[#1A1A18] leading-[1.4] line-clamp-2 pt-5 pb-1 font-bold"
          style={{ fontSize: "16px", fontWeight: 700 }}
        >
          {name}
        </p>

        <div className="mt-10 flex flex-col gap-1">
          {/* Star rating — black stars only */}
          <div className="font-sans flex items-center" style={{ fontSize: "16px" }}>
            <span className="text-[#1A1A18]" style={{ fontSize: "18px" }} aria-hidden>
              ★★★★☆
            </span>
          </div>

          {/* Benefit line (Georgia recommendation) */}
          {benefits && (
            <p className="font-sans text-[#8A8A86] line-clamp-2 mb-6" style={{ fontSize: "12px" }}>
              {benefits}
            </p>
          )}
        </div>

        {/* Divider above price */}
        <div className="mt-auto pt-10 border-t border-[#D8D8D3]" />

        {/* Price — system UI tabular numerals, AUD */}
        <div
          className="flex items-baseline gap-1 -mt-5 text-[#1A1A18]"
          style={{
            fontFamily:
              'system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
            fontWeight: 700,
            letterSpacing: "-0.02em",
            fontVariantNumeric: "lining-nums tabular-nums",
            fontFeatureSettings: '"lnum" 1, "tnum" 1',
          }}
        >
          <span className="tracking-tight" style={{ fontSize: "14px" }}>
            {priceDisplay !== "—" ? priceDisplay : "—"}
          </span>
          {priceDisplay !== "—" && (
            <span style={{ fontSize: "14px" }}>
              AUD
            </span>
          )}
        </div>

        {/* Add to Cart — grey outline, white bg, same as product page */}
        <div className="mt-4">
          <span
            className="flex items-center justify-center w-full font-sans rounded transition-colors duration-150 group-hover:bg-[#1A1A18] group-hover:text-white"
            style={{
              height: "46px",
              fontSize: "14px",
              fontWeight: 500,
              color: "#1A1A18",
              border: "1px solid #D8D8D3",
              background: "#FFFFFF",
              borderRadius: "4px",
            }}
          >
            Add to Cart
          </span>
        </div>
      </div>
    </Link>
  );
}
