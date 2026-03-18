import Link from "next/link";
import Image from "next/image";

export type PairItem = {
  paired_sku: string;
  paired_slug?: string;
  product_name?: string;
  image_url?: string;
  explanation_text?: string;
  price?: string;
  /** Optional badge e.g. "Bestseller", "Top Rated", "New" */
  badge?: string;
};

/** Compatible with PairItem (e.g. stack items from routine) */
export type CarouselProductItem = PairItem;

type PairsCarouselProps = {
  pairs: CarouselProductItem[];
  /** Which context is this carousel used in? Affects how we treat generic explanation text. */
  context?: "pairs" | "stacks";
};

export default function PairsCarousel({ pairs, context = "pairs" }: PairsCarouselProps) {
  if (!pairs || pairs.length === 0) return null;

  return (
    <div className="flex overflow-x-auto pb-2 scrollbar-hide">
      {pairs.map((pair) => {
        const slug = pair.paired_slug || pair.paired_sku;
        const name = pair.product_name || pair.paired_sku;
        const imgSrc = pair.image_url;
        const rawBenefits = (pair.explanation_text || "").trim();

        // For Georgia's Picks (pairs), ensure we always show something helpful:
        // - If API gives a specific line, use it
        // - If it's the generic "Pairs well together." or empty, use a nicer fallback
        let benefits = rawBenefits;
        if (context === "pairs") {
          if (!benefits || benefits === "Pairs well together.") {
            benefits = "Georgia picked this to pair perfectly with your routine.";
          }
        }
        return (
          <Link
            key={pair.paired_sku}
            href={`/products/${slug}`}
            className="group flex-shrink-0 w-[65vw] min-w-[220px] max-w-[260px] md:w-[200px] md:min-w-0 md:max-w-none flex flex-col transition-all duration-150 outline-none focus-visible:ring-2 focus-visible:ring-[#1A1A18]/20 focus-visible:ring-inset"
          >
            {/* Image area — 1:1, bg #F5F5F0 */}
            <div className="relative w-full aspect-square bg-white flex items-center justify-center">
              {imgSrc ? (
                <Image
                  src={imgSrc}
                  alt={name}
                  fill
                  className="object-contain p-2 outline-none"
                  sizes="(max-width: 768px) 65vw, 200px"
                  unoptimized={imgSrc.includes("localhost") || imgSrc.startsWith("http://")}
                />
              ) : (
                <span className="text-[#8A8A86] text-xs">Product</span>
              )}
              {pair.badge && (
                <span
                  className="absolute top-2 left-2 rounded-full px-2 py-0.5 font-sans font-medium text-[#4A4A46]"
                  style={{ fontSize: "10px", fontWeight: 500, background: "#F0F0EB" }}
                >
                  {pair.badge}
                </span>
              )}
            </div>

            {/* Content — big space below image, title, more space, stars → benefits → divider → price → button */}
            <div className="flex flex-col flex-1 p-4 min-h-0">
              {/* Product name — bigger, heavy, bold */}
              <p
                className="font-sans text-[#1A1A18] leading-[1.4] line-clamp-2 pt-5 pb-1 font-bold"
                style={{ fontSize: "16px", fontWeight: 700 }}
              >
                {name}
              </p>

              {/* More space between title and star row */}
              <div className="mt-10 flex flex-col gap-1">
                {/* Star rating — black stars only, no count */}
                <div className="font-sans flex items-center" style={{ fontSize: "13px" }}>
                  <span className="text-[#1A1A18]" style={{ fontSize: "14px" }} aria-hidden>★★★★☆</span>
                </div>

                {/* Benefit tags — 12px, #8A8A86; more space below before divider */}
                {benefits && (
                  <p
                    className="font-sans text-[#8A8A86] line-clamp-2 mb-6"
                    style={{ fontSize: "12px" }}
                  >
                    {benefits}
                  </p>
                )}
              </div>

              {/* Divider above price; breathing space above, tight space below to price */}
              <div className="mt-auto pt-10 border-t border-[#D8D8D3]" />

              {/* Price under divider — system UI tabular numerals; AUD next to numbers */}
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
                  {pair.price != null && pair.price !== "" ? `$${pair.price}` : "—"}
                </span>
                {pair.price != null && pair.price !== "" && (
                  <span style={{ fontSize: "14px" }}>
                    AUD
                  </span>
                )}
              </div>

              {/* Add to Cart — grey outline, white bg */}
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
      })}
    </div>
  );
}
