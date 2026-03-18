import Link from "next/link";
import Image from "next/image";

export type StackItem = {
  paired_sku: string;
  paired_slug?: string;
  paired_vertical?: string;
  product_name?: string;
  explanation_text?: string;
  image_url?: string;
  price?: string;
};

type StacksSectionProps = {
  stacks: StackItem[];
};

export default function StacksSection({ stacks }: StacksSectionProps) {
  if (!stacks || stacks.length === 0) return null;

  return (
    <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 md:mx-0 md:px-0 scrollbar-hide">
      {stacks.map((stack) => {
        const slug = stack.paired_slug || stack.paired_sku;
        const name = stack.product_name || stack.paired_sku;
        const imgSrc = stack.image_url;
        return (
          <Link
            key={stack.paired_sku}
            href={`/products/${slug}`}
            className="flex-shrink-0 w-[calc(50%-0.5rem)] min-w-[140px] md:w-[200px] rounded-lg overflow-hidden border border-[#E0E0E0] bg-white hover:border-[#0E7C86]/40 transition-colors"
          >
            <div className="aspect-square relative bg-white">
              {imgSrc ? (
                <Image
                  src={imgSrc}
                  alt={name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 200px"
                  unoptimized={imgSrc.includes("localhost") || imgSrc.startsWith("http://")}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#6e6e73] text-xs">
                  Product
                </div>
              )}
            </div>
            <div className="p-3">
              {stack.paired_vertical && (
                <span className="text-[#0E7C86] text-[11px] uppercase tracking-wide block mb-1">
                  {stack.paired_vertical.replace(/_/g, " ")}
                </span>
              )}
              <p className="text-[#1d1d1f] text-[13px] font-medium line-clamp-2">
                {name}
              </p>
              {stack.price != null && stack.price !== "" && (
                <p
                  className="text-[#1d1d1f] mt-1"
                  style={{
                    fontFamily:
                      'system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
                    fontSize: "14px",
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    fontVariantNumeric: "lining-nums tabular-nums",
                    fontFeatureSettings: '"lnum" 1, "tnum" 1',
                  }}
                >
                  ${stack.price}
                </p>
              )}
              {stack.explanation_text && (
                <p className="text-[#6e6e73] text-[11px] truncate mt-0.5">
                  {stack.explanation_text}
                </p>
              )}
            </div>
          </Link>
        );
      })}
    </div>
  );
}
