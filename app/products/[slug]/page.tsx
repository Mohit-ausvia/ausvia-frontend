import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { AlertTriangle, Check } from "lucide-react";
import { getProductBySlug, getProductBySku, getProductMeta, type WooProduct } from "@/lib/woo-api";
import { getSafetyFromCookies } from "@/lib/safety-params";
import { getPayload, getPairs, getStacks, GeorgiaError } from "@/lib/georgia-api";
import ProductCTAs from "@/components/product/ProductCTAs";
import PairsCarousel, { type PairItem } from "@/components/product/PairsCarousel";
import StickyAddToCartBar from "@/components/product/StickyAddToCartBar";
import IngredientsAccordion from "@/components/product/IngredientsAccordion";
import ProductImageGallery from "@/components/product/ProductImageGallery";
import ProductFaqSection from "@/components/product/ProductFaqSection";
import Appear from "@/components/ui/Appear";
import type { GeorgiaPayload } from "@/lib/georgia-api";
import type { GeorgiaPairsResult, GeorgiaStacksResult } from "@/lib/georgia-api";

function stripHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Preserve paragraph and line-break structure from HTML for description display. */
function descriptionFromHtml(html: string): string {
  if (!html) return "";
  return html
    .replace(/&nbsp;/gi, " ")
    .replace(/<\/p>\s*<p[^>]*>/gi, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(h[1-6]|div|li|ul|ol|section|article)>/gi, "\n")
    .replace(/<(h[1-6]|div|section|article)[^>]*>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<p[^>]*>/gi, "")
    .replace(/<\/(strong|b)>/gi, "\n")   // line break after section titles like "Key Features", "How to Use"
    .replace(/<li[^>]*>/gi, "\n• ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n /g, "\n")
    .replace(/ \n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .trim();
}

/** Split description into overview and Key Features (bullet lines after "Key Features" heading). */
function splitDescriptionOverviewAndKeyFeatures(fullDescription: string): { overview: string; keyFeatures: string[] } {
  const text = fullDescription.trim();
  const keyFeaturesMatch = text.match(/\bKey Features\b/i);
  if (!keyFeaturesMatch) {
    return { overview: text, keyFeatures: [] };
  }
  const idx = keyFeaturesMatch.index! + keyFeaturesMatch[0].length;
  const overview = text.slice(0, keyFeaturesMatch.index).trim();
  const after = text.slice(idx).trim();
  const keyFeatures = after
    .split(/\n+/)
    .map((line) => line.replace(/^[•\-]\s*/, "").trim())
    .filter((line) => line.length > 0);
  return { overview, keyFeatures };
}

function inferVertical(product: WooProduct): string | undefined {
  const meta = getProductMeta(product, "vertical");
  if (meta) return meta;
  const slug = product.categories?.[0]?.slug ?? "";
  if (/skincare|skin/i.test(slug)) return "skincare";
  if (/supplement|vitamin|mineral/i.test(slug)) return "supplements";
  if (/makeup|cosmetic/i.test(slug)) return "makeup";
  if (/baby|child|kid/i.test(slug)) return "baby_care";
  return undefined;
}

function getTrustMarkers(product: WooProduct): string {
  const meta = getProductMeta(product, "trust_markers") || getProductMeta(product, "_trust_markers");
  if (meta) return meta;
  const tags = product.tags?.map((t) => t.name).filter(Boolean);
  return tags?.join(" · ") ?? "";
}

/** Human-readable label for routine_step (e.g. second_cleanser → "Second cleanser"). */
function formatRoutineStep(step: string | null | undefined): string {
  if (!step || typeof step !== "string") return "";
  return step
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

/** Human-readable label for am_pm_use from brain_products_v2. */
function formatAmPmUse(amPm: string | null | undefined): string {
  if (!amPm || typeof amPm !== "string") return "";
  const labels: Record<string, string> = {
    am_only: "Morning only",
    pm_only: "Evening only",
    am_and_pm: "AM & PM",
    am_preferred: "Best in morning",
    pm_preferred: "Best in evening",
  };
  return labels[amPm.toLowerCase()] || amPm.replace(/_/g, " ");
}

type FaqBlock = { question?: string; answer?: string };

type GeorgiaAnchor = {
  georgia_primary_reason?: string | null;
  georgia_expert_tip?: string | null;
  georgia_soft_booster_line?: string | null;
  georgia_can_recommend?: boolean;
  warning_text?: string | null;
  key_actives?: unknown[];
  risk_flags?: Record<string, unknown>;
  vertical?: string;
  primary_concern?: string | null;
  goal_tags?: unknown[];
  faq_blocks?: FaqBlock[];
  /** Routine step (e.g. serum, cleanser) from brain_products_v2 vertical_payload */
  routine_step?: string | null;
  /** AM/PM use (e.g. pm_only, am_and_pm) from brain_products_v2 vertical_payload */
  am_pm_use?: string | null;
};

/** Resolve anchor product from payload. API may put it on anchor_product or in primary_products. */
function getAnchorFromPayload(payload: GeorgiaPayload | null, internalSku: string): GeorgiaAnchor | null {
  if (!payload) return null;
  const raw = payload as Record<string, unknown>;
  if (raw.anchor_product && typeof raw.anchor_product === "object") {
    return normalizeAnchor(raw.anchor_product as Record<string, unknown>);
  }
  if (!payload.primary_products?.length) return null;
  const list = payload.primary_products as Record<string, unknown>[];
  // When we requested anchor_sku, the API puts that product first — use it so we get faq_blocks etc.
  const anchor =
    list.find((p) => String(p.internal_sku ?? "").toLowerCase() === String(internalSku ?? "").toLowerCase()) ??
    list[0];
  return normalizeAnchor(anchor);
}

/** Read anchor fields from object, supporting both snake_case and camelCase from API. */
function normalizeAnchor(obj: Record<string, unknown>): GeorgiaAnchor {
  const get = (snake: string, camel: string) =>
    obj[snake] ?? obj[camel];
  const rawCanRecommend = get("georgia_can_recommend", "georgiaCanRecommend");
  const rawPrimaryReason = get("georgia_primary_reason", "georgiaPrimaryReason");
  const rawFaq = get("faq_blocks", "faqBlocks");
  const faq_blocks: FaqBlock[] = Array.isArray(rawFaq)
    ? (rawFaq as unknown[]).map((item) => {
        const x = item && typeof item === "object" ? (item as Record<string, unknown>) : {};
        const question = (x.question ?? x.Question ?? x.q) as string | undefined;
        const answer = (x.answer ?? x.Answer ?? x.a) as string | undefined;
        return { question: question?.trim() || undefined, answer: answer?.trim() || undefined };
      }).filter((fb) => fb.question || fb.answer)
    : [];
  return {
    georgia_primary_reason: (get("georgia_primary_reason", "georgiaPrimaryReason") as string | null) ?? null,
    georgia_expert_tip: (get("georgia_expert_tip", "georgiaExpertTip") as string | null) ?? null,
    georgia_soft_booster_line: (get("georgia_soft_booster_line", "georgiaSoftBoosterLine") as string | null) ?? null,
    georgia_can_recommend:
      rawCanRecommend !== undefined
        ? Boolean(rawCanRecommend)
        : rawPrimaryReason != null,
    warning_text: (get("warning_text", "warningText") as string | null) ?? null,
    key_actives: Array.isArray(get("key_actives", "keyActives")) ? (get("key_actives", "keyActives") as unknown[]) : [],
    risk_flags: (typeof get("risk_flags", "riskFlags") === "object" && get("risk_flags", "riskFlags") !== null)
      ? (get("risk_flags", "riskFlags") as Record<string, unknown>)
      : undefined,
    vertical: get("vertical", "vertical") as string | undefined,
    primary_concern: (get("primary_concern", "primaryConcern") as string | null) ?? null,
    goal_tags: Array.isArray(get("goal_tags", "goalTags")) ? (get("goal_tags", "goalTags") as unknown[]) : undefined,
    faq_blocks: faq_blocks.length > 0 ? faq_blocks : undefined,
    routine_step: (get("routine_step", "routineStep") as string | null) ?? null,
    am_pm_use: (get("am_pm_use", "amPmUse") as string | null) ?? null,
  };
}

/**
 * Safe-for flags: only show when explicitly confirmed. Do not show positive flags
 * for skincare or makeup at launch. Only show warning_text when present.
 */
function getSafeForFlags(anchor: GeorgiaAnchor | null, vertical: string | undefined): string[] {
  if (!anchor || !vertical) return [];
  const v = vertical.toLowerCase();
  if (v === "skincare" || v === "makeup") return [];

  const r = anchor.risk_flags && typeof anchor.risk_flags === "object" ? (anchor.risk_flags as Record<string, unknown>) : null;
  const flags: string[] = [];

  if (v === "supplements") {
    const concern = (anchor.primary_concern ?? "").toLowerCase();
    const tags = Array.isArray(anchor.goal_tags) ? anchor.goal_tags.map((t) => String(t).toLowerCase()) : [];
    const hasPregnancyContext = concern.includes("pregnancy") || tags.some((t) => t.includes("pregnancy"));
    if (hasPregnancyContext && r?.pregnancy_caution === false) flags.push("Pregnancy safe");
  }

  if (v === "baby-care" || v === "baby_care") {
    if (r?.child_caution === false || r?.child_safe === true) flags.push("Child safe");
  }

  return flags;
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  if (slug === "demo") {
    return {
      title: "Swisse Ceramides B3 (Demo) | AUSVIA",
      description: "Demo product page — use while WooCommerce products are not synced yet.",
    };
  }
  let product: WooProduct | null = null;
  try {
    product = await getProductBySlug(slug);
  } catch {
    // ignore
  }
  if (!product) {
    return { title: "Product Not Found | AUSVIA" };
  }
  const desc = stripHtml(product.description || product.short_description || "").slice(0, 155);
  const image = product.images?.[0]?.src;
  return {
    title: `${product.name} | AUSVIA`,
    description: desc || undefined,
    openGraph: {
      title: `${product.name} | AUSVIA`,
      description: desc || undefined,
      images: image ? [{ url: image }] : undefined,
    },
  };
}

/** Mock product for /products/demo when WooCommerce has no products synced yet. */
function getDemoProduct(): WooProduct {
  return {
    id: 0,
    name: "Swisse Ceramides B3 Daily Balance Moisturiser 120ml",
    slug: "demo",
    permalink: "",
    price: "24.99",
    regular_price: "24.99",
    sale_price: "",
    description: "Hydrating and balancing moisturiser with Niacinamide 5%, Zinc Sulfate 1.5%, and Ceramides for breakout control, pore refining, and barrier support.",
    short_description: "Ceramides + Niacinamide moisturiser.",
    images: [],
    meta_data: [
      { key: "internal_sku", value: "AUS000006" },
      { key: "brand", value: "Swisse" },
      { key: "trust_markers", value: "Dermatologist tested · Fragrance options" },
      { key: "ingredients_text", value: "Aqua, Niacinamide, Glycerin, Ceramide NP, etc." },
      { key: "directions_text", value: "Apply to clean skin morning and evening." },
      { key: "warnings_text", value: "For external use only. Avoid contact with eyes." },
    ],
    categories: [{ id: 1, name: "Skincare", slug: "skincare" }],
    tags: [],
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;

  const isDemo = slug === "demo";
  const product = isDemo ? getDemoProduct() : await getProductBySlug(slug);
  if (!product) notFound();

  const internalSku =
    isDemo
      ? "AUS000006"
      : getProductMeta(product, "internal_sku") ||
        getProductMeta(product, "_internal_sku") ||
        product.sku ||
        null;
  const cookieStore = await cookies();
  const safetyParams = getSafetyFromCookies(cookieStore);
  const vertical = inferVertical(product);

  let payload: GeorgiaPayload | null = null;
  let pairsResult: GeorgiaPairsResult | null = null;
  let stacksResult: GeorgiaStacksResult | null = null;

  if (internalSku) {
    try {
      payload = await getPayload({
        anchor_sku: internalSku,
        vertical,
        safety: safetyParams,
        product_limit: 5,
        combo_limit: 5,
        cross_limit: 3,
      });
    } catch (err) {
      console.error("Georgia API failed:", err, "URL:", process.env.GEORGIA_API_URL);
      if (err instanceof GeorgiaError) {
        console.error("[ProductPage] Georgia getPayload failed:", err.message, err.status);
      } else {
        console.error("[ProductPage] Georgia getPayload error:", err);
      }
    }
    try {
      pairsResult = await getPairs(internalSku, safetyParams);
    } catch (err) {
      if (err instanceof GeorgiaError) {
        console.error("[ProductPage] Georgia getPairs failed:", err.message);
      }
    }
    try {
      stacksResult = await getStacks(internalSku, safetyParams);
    } catch (err) {
      if (err instanceof GeorgiaError) {
        console.error("[ProductPage] Georgia getStacks failed:", err.message);
      }
    }
  }

  let georgiaAnchor = internalSku ? getAnchorFromPayload(payload, internalSku) : null;
  // Fallback: if anchor has no faq_blocks but first primary product does (e.g. API shape), use it
  if (georgiaAnchor && !georgiaAnchor.faq_blocks?.length && payload?.primary_products?.length) {
    const first = (payload.primary_products as Record<string, unknown>[])[0];
    const fromFirst = normalizeAnchor(first);
    if (fromFirst.faq_blocks?.length) {
      georgiaAnchor = { ...georgiaAnchor, faq_blocks: fromFirst.faq_blocks };
    }
  }
  if (process.env.NODE_ENV === "development" && georgiaAnchor) {
    const faqCount = georgiaAnchor.faq_blocks?.length ?? 0;
    console.log("[ProductPage] FAQ blocks on anchor:", faqCount, "internalSku:", internalSku ?? "(none)");
  }
  const pairs = pairsResult?.pairs ?? [];
  const stacks = stacksResult?.stacks ?? [];

  const rawPairs = Array.isArray(pairs)
    ? (pairs as Record<string, unknown>[]).map((p) => ({
        paired_sku: String(p.paired_sku ?? ""),
        explanation_text: typeof p.explanation_text === "string" ? p.explanation_text : undefined,
      }))
    : [];
  const pairsWithProducts = await Promise.all(
    rawPairs.map(async (pair) => {
      const wooProduct = await getProductBySku(pair.paired_sku);
      return {
        ...pair,
        product_name: wooProduct?.name ?? pair.paired_sku,
        image_url: wooProduct?.images?.[0]?.src ?? undefined,
        paired_slug: wooProduct?.slug ?? undefined,
        price: wooProduct?.price ?? undefined,
      };
    })
  );

  const rawStacks = Array.isArray(stacks)
    ? (stacks as Record<string, unknown>[]).map((s) => ({
        paired_sku: String(s.paired_sku ?? ""),
        paired_vertical: typeof s.paired_vertical === "string" ? s.paired_vertical : undefined,
        explanation_text: typeof s.explanation_text === "string" ? s.explanation_text : undefined,
      }))
    : [];
  const stacksWithProducts = await Promise.all(
    rawStacks.map(async (stack) => {
      const wooProduct = await getProductBySku(stack.paired_sku);
      return {
        ...stack,
        product_name: wooProduct?.name ?? stack.paired_sku,
        paired_slug: wooProduct?.slug ?? undefined,
        image_url: wooProduct?.images?.[0]?.src ?? undefined,
        price: wooProduct?.price ?? undefined,
      };
    })
  );

  const productImages =
    product.images?.length > 0
      ? product.images.map((img) => ({ src: img.src, alt: img.alt || product.name }))
      : [];
  const safeForFlags = getSafeForFlags(georgiaAnchor, vertical);
  const keyActives = Array.isArray(georgiaAnchor?.key_actives) ? georgiaAnchor!.key_actives : [];
  const ingredientsText =
    getProductMeta(product, "ingredients_tab") ||
    getProductMeta(product, "ingredients_text") ||
    getProductMeta(product, "ingredients");
  const directionsText =
    getProductMeta(product, "directions_tab") ||
    getProductMeta(product, "directions_text") ||
    getProductMeta(product, "directions");
  const warningsText =
    getProductMeta(product, "warning_tab") ||
    getProductMeta(product, "warnings_tab") ||
    getProductMeta(product, "warnings_text") ||
    getProductMeta(product, "warnings");

  const brandName = getProductMeta(product, "brand") || getProductMeta(product, "_brand") || product.name.split(" ")[0] || "Product";

  return (
    <>
      {/* Product page — very light grey bg, breadcrumb + black/white header (mobile-first ref) */}
      <div className="bg-white pb-2 min-h-screen">
        <div className="max-w-[1400px] mx-auto px-4 md:px-10 pt-4 md:pt-20 pb-4 relative">
          {/* Breadcrumb — blended dividers (centered, fade at ends) */}
          <div className="flex justify-center" aria-hidden>
            <div className="h-px w-2/3 min-w-[160px] max-w-[320px] bg-gradient-to-r from-transparent via-[#E0E0E0] to-transparent" />
          </div>
          <nav className="my-3 py-0" aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-x-1.5 font-sans text-sm text-[#6b6b6b]">
              <li>
                <Link href="/" className="hover:underline hover:text-[#444]">
                  Home
                </Link>
              </li>
              <li className="text-[#9a9a9a]" aria-hidden="true"> &gt; </li>
              <li>
                {product.categories?.[0] ? (
                  <Link href={`/category/${product.categories[0].slug}`} className="hover:underline hover:text-[#444]">
                    {product.categories[0].name}
                  </Link>
                ) : (
                  <span>{vertical ? vertical.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) : "Shop"}</span>
                )}
              </li>
              <li className="text-[#9a9a9a]" aria-hidden="true"> &gt; </li>
              <li className="truncate max-w-[180px] md:max-w-none text-black font-medium" title={product.name} aria-current="page">
                {product.name}
              </li>
            </ol>
          </nav>
          <div className="flex justify-center mb-4 md:mb-6" aria-hidden>
            <div className="h-px w-2/3 min-w-[160px] max-w-[320px] bg-gradient-to-r from-transparent via-[#E0E0E0] to-transparent" />
          </div>

          <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-x-10 relative">
            {/* Left column — image + title block; order: title first on mobile, image on desktop first */}
            <aside className="w-full md:w-[50%] md:flex-shrink-0 order-1 md:sticky md:top-[50px] md:self-start flex flex-col">
              {/* Title block — brand (black), title (black bold), price in pill (ref) */}
              <div className="order-1 md:order-2 mb-4 md:mb-0 md:mt-10">
                <p className="font-sans text-black text-xs uppercase tracking-[0.15em] font-medium mb-2">
                  {brandName}
                </p>
                <h1 className="font-sans text-[#0d0d0d] text-2xl md:text-4xl font-black leading-snug mb-3 capitalize">
                  {product.name}
                </h1>
                {product.price != null && product.price !== "" && (
                  <p
                    className="font-sans text-[#1A1A18]"
                    style={{
                      fontSize: "28px",
                      fontWeight: 700,
                      letterSpacing: "-0.02em",
                      fontVariantNumeric: "lining-nums tabular-nums",
                      fontFamily:
                        'system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
                      fontFeatureSettings: '"lnum" 1, "tnum" 1',
                    }}
                  >
                    ${product.price} AUD
                  </p>
                )}
              </div>
              {/* Image gallery — second on mobile, first on desktop */}
              <div className="order-2 md:order-1 w-full">
                <ProductImageGallery images={productImages} productName={product.name} />
              </div>
              {/* Ask Georgia section under image — reference: white block, personalised copy, teal pill CTA */}
              <section className="order-3 mt-6 md:mt-8 bg-white py-6 px-4 md:px-6">
                <p className="font-sans text-[#6e6e73] text-xs uppercase tracking-[0.2em] font-semibold mb-3">
                  PERSONALISED FOR YOU
                </p>
                <p className="font-sans text-[#1d1d1f] text-lg md:text-xl font-black mb-1">
                  Not sure if this is right for you?
                </p>
                <div className="mt-5">
                  <ProductCTAs
                    productName={product.name}
                    productId={product.id}
                    onlyAskGeorgia
                    variant="hero"
                    wrapperClassName=""
                    askGeorgiaClassName="!rounded-[980px] !bg-white !text-black !border-2 !border-black !py-2.5 !font-black !text-base !uppercase tracking-wide hover:!bg-gray-100 transition-all duration-300"
                  />
                </div>
              </section>
              <div className="flex justify-center order-4" aria-hidden>
                <div className="h-px w-2/3 min-w-[160px] max-w-[320px] bg-gradient-to-r from-transparent via-[#E0E0E0] to-transparent" />
              </div>
            </aside>

            {/* Intelligence column — right on desktop, below image on mobile */}
            <div className="w-full md:flex-1 md:min-w-0 order-2 flex flex-col relative">
              {/* Georgia — only show when she can recommend; hide entirely when she cannot */}
              {georgiaAnchor != null && georgiaAnchor.georgia_can_recommend === true && (georgiaAnchor.georgia_primary_reason || georgiaAnchor.georgia_expert_tip) && (
                <>
                  <section className="py-6 md:py-8">
                    {/* Georgia's Verdict — dividers only (no wrap/borders) */}
                    {georgiaAnchor.georgia_primary_reason && (
                      <div className="pb-4">
                        <div className="flex items-center gap-2 mb-10">
                          <span className="font-sans text-black text-base md:text-lg uppercase tracking-[0.15em] font-black">
                            GEORGIA&apos;S VERDICT
                          </span>
                          <span className="font-sans text-[#6e6e73] text-[10px] uppercase tracking-wide ml-auto">
                            AI · PERSONALISED
                          </span>
                        </div>
                        <p className="font-sans text-[#444] text-base md:text-lg leading-[1.4] italic font-normal mb-4">
                          {georgiaAnchor.georgia_primary_reason}
                        </p>
                      </div>
                    )}
                    {georgiaAnchor.georgia_primary_reason && georgiaAnchor.georgia_expert_tip && (
                      <div className="flex justify-center my-4" aria-hidden>
                        <div className="h-px w-2/3 min-w-[160px] max-w-[320px] bg-gradient-to-r from-transparent via-[#E0E0E0] to-transparent" />
                      </div>
                    )}
                    {georgiaAnchor.georgia_expert_tip && (
                      <div className="pt-0">
                        <p className="font-sans text-black text-base md:text-lg uppercase tracking-[0.15em] font-black mb-10">
                          + EXPERT TIP
                        </p>
                        <p className="font-sans text-[#444] text-base md:text-lg leading-[1.4] font-normal mb-4">
                          {georgiaAnchor.georgia_expert_tip}
                        </p>
                      </div>
                    )}
                  </section>
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-[#E0E0E0] to-transparent" />
                </>
              )}

              {/* Key Actives — light grey wrap from divider to divider */}
              {keyActives.length > 0 && (
                <div className="bg-[#FAFAF8]">
                  <div className="flex justify-center py-0" aria-hidden>
                    <div className="h-px w-2/3 min-w-[160px] max-w-[320px] bg-gradient-to-r from-transparent via-[#E0E0E0] to-transparent" />
                  </div>
                  <section className="py-6 md:py-8">
                    <p className="font-sans text-black text-base md:text-lg uppercase tracking-[0.15em] font-black mb-10">
                      KEY ACTIVES
                    </p>
                    <p className="font-sans text-[#444] text-base md:text-lg leading-[1.4] font-normal mb-6">
                      What&apos;s in it. Every active, explained.
                    </p>
                    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
                      {keyActives.map((active: unknown, i: number) => {
                        const a = active as Record<string, unknown>;
                        const name = (a?.name as string) ?? "";
                        const dose = (a?.dose as string) ?? null;
                        const fn = (a?.function as string) ?? "";
                        return (
                          <div
                            key={i}
                            className="flex-shrink-0 w-[160px] bg-white border border-[#E0E0E0] rounded-lg px-4 py-4"
                          >
                            {dose && (
                              <p className="font-serif text-[#1d1d1f] text-base mb-1" style={{ fontFamily: "var(--font-serif)" }}>
                                {dose}
                              </p>
                            )}
                            <p className="font-sans text-[#1d1d1f] font-semibold text-sm">{name}</p>
                            {fn && <p className="font-sans text-[#6e6e73] text-xs mt-2">{fn}</p>}
                          </div>
                        );
                      })}
                    </div>
                  </section>
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-[#E0E0E0] to-transparent" />
                </div>
              )}

              {/* Description — heading like Georgia's Verdict + overview */}
              <section className="py-6 md:py-8">
                {(() => {
                  const raw = descriptionFromHtml(
                    product.description || product.short_description || "No description available."
                  );
                  const { overview, keyFeatures } = splitDescriptionOverviewAndKeyFeatures(raw);
                  return (
                    <>
                      <div className="flex items-center gap-2 mb-10">
                        <span className="font-sans text-black text-base md:text-lg uppercase tracking-[0.15em] font-black">
                          PRODUCT DESCRIPTION
                        </span>
                      </div>
                      {overview && (
                        <p className="font-sans text-[#444] text-base md:text-lg leading-[1.4] font-normal whitespace-pre-line mb-4">
                          {overview}
                        </p>
                      )}
                      {!overview && keyFeatures.length === 0 && (
                        <p className="font-sans text-[#444] text-base md:text-lg leading-[1.4] font-normal whitespace-pre-line mb-4">
                          {raw || "No description available."}
                        </p>
                      )}
                    </>
                  );
                })()}
              </section>

              {/* Key Features — light grey background from divider to divider only */}
              {(() => {
                const raw = descriptionFromHtml(
                  product.description || product.short_description || ""
                );
                const { keyFeatures } = splitDescriptionOverviewAndKeyFeatures(raw);
                if (keyFeatures.length === 0) return null;
                const hasRoutine = !!(georgiaAnchor?.routine_step || georgiaAnchor?.am_pm_use);
                return (
                  <div className="bg-[#FAFAF8]">
                    {/* Top divider */}
                    <div className="flex justify-center py-0" aria-hidden>
                      <div className="h-px w-2/3 min-w-[160px] max-w-[320px] bg-gradient-to-r from-transparent via-[#E0E0E0] to-transparent" />
                    </div>
                    <section className="py-6 md:py-8">
                      <div className="flex items-center gap-2 mb-10">
                        <span className="font-sans text-black text-base md:text-lg uppercase tracking-[0.15em] font-black">
                          KEY FEATURES
                        </span>
                      </div>
                    <ul className="space-y-2 font-sans text-[#444] text-base md:text-lg leading-[1.4] font-normal mb-4">
                      {keyFeatures.map((feature, i) => (
                        <li key={i} className="flex gap-2">
                          <span className="text-[#6e6e73] mt-0.5 shrink-0" aria-hidden>•</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </section>
                    {/* Bottom divider (before Routine) */}
                    {hasRoutine && (
                      <div className="flex justify-center py-0" aria-hidden>
                        <div className="h-px w-2/3 min-w-[160px] max-w-[320px] bg-gradient-to-r from-transparent via-[#E0E0E0] to-transparent" />
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Routine — same style as Description section (only when AM/PM data from brain) */}
              {(georgiaAnchor?.routine_step || georgiaAnchor?.am_pm_use) && (
                <section className="py-6 md:py-8">
                  <div className="flex items-center gap-2 mb-10">
                    <span className="font-sans text-black text-base md:text-lg uppercase tracking-[0.15em] font-black">
                      ROUTINE
                    </span>
                  </div>
                  <p className="font-sans text-[#444] text-base md:text-lg leading-[1.4] font-normal mb-4">
                    Use this product in the step and time below so it works best with the rest of your routine.
                  </p>
                  <div className="flex flex-wrap gap-3 mb-5">
                    {georgiaAnchor?.routine_step && (
                      <div className="inline-flex flex-col rounded-lg border border-[#E0E0E0] bg-white px-4 py-3 min-w-[140px]">
                        <span className="font-sans text-[#6e6e73] text-xs uppercase tracking-wide mb-0.5">Step in routine</span>
                        <span className="font-sans text-[#1d1d1f] font-medium text-sm">{formatRoutineStep(georgiaAnchor.routine_step)}</span>
                      </div>
                    )}
                    {georgiaAnchor?.am_pm_use && (
                      <div className="inline-flex flex-col rounded-lg border border-[#E0E0E0] bg-white px-4 py-3 min-w-[140px]">
                        <span className="font-sans text-[#6e6e73] text-xs uppercase tracking-wide mb-0.5">When to use</span>
                        <span className="font-sans text-[#1d1d1f] font-medium text-sm">{formatAmPmUse(georgiaAnchor.am_pm_use)}</span>
                      </div>
                    )}
                  </div>
                  {georgiaAnchor?.am_pm_use && (
                    <p className="font-sans text-[#444] text-base md:text-lg leading-[1.4] font-normal mb-4">
                      Morning (AM) routines focus on protection and antioxidants; evening (PM) is when repair and actives like retinol work best. Using products at the right time helps them work effectively.
                    </p>
                  )}
                </section>
              )}
              <div className="h-px w-full bg-gradient-to-r from-transparent via-[#E0E0E0] to-transparent" />

              {/* How to use — same style as Description section */}
              {directionsText?.trim() && (
                <section className="py-6 md:py-8">
                  <div className="flex items-center gap-2 mb-10">
                    <span className="font-sans text-black text-base md:text-lg uppercase tracking-[0.15em] font-black">
                      HOW TO USE
                    </span>
                  </div>
                  <p className="font-sans text-[#444] text-base md:text-lg leading-[1.4] font-normal whitespace-pre-line mb-4">
                    {directionsText}
                  </p>
                </section>
              )}

              {/* Ingredients — light grey wrap from divider to divider */}
              {ingredientsText?.trim() && (
                <div className="bg-[#FAFAF8]">
                  <div className="flex justify-center py-0" aria-hidden>
                    <div className="h-px w-2/3 min-w-[160px] max-w-[320px] bg-gradient-to-r from-transparent via-[#E0E0E0] to-transparent" />
                  </div>
                  <section className="py-6 md:py-8">
                    <div className="flex items-center gap-2 mb-10">
                      <span className="font-sans text-black text-base md:text-lg uppercase tracking-[0.15em] font-black">
                        INGREDIENTS
                      </span>
                    </div>
                    <div className="mb-4">
                      <IngredientsAccordion ingredientsText={ingredientsText} />
                    </div>
                  </section>
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-[#E0E0E0] to-transparent" />
                </div>
              )}

              {/* Warnings — same style as Description section */}
              {(georgiaAnchor?.warning_text || safeForFlags.length > 0 || (warningsText?.trim() ?? "")) && (
                <>
                  <section className="py-6 md:py-8">
                    <div className="flex items-center gap-2 mb-10">
                      <span className="font-sans text-black text-base md:text-lg uppercase tracking-[0.15em] font-black">
                        WARNINGS
                      </span>
                    </div>
                    <ul className="space-y-3 font-sans text-[#444] text-base md:text-lg leading-[1.4] font-normal list-none pl-0 mb-4">
                      {georgiaAnchor?.warning_text && (
                        <li className="flex gap-3 items-start border-l-2 border-[#C0392B]/40 pl-4 py-1">
                          <AlertTriangle className="flex-shrink-0 w-4 h-4 text-[#C0392B]/80 mt-0.5 animate-warning-blink" aria-hidden />
                          <span>{georgiaAnchor.warning_text}</span>
                        </li>
                      )}
                      {warningsText?.trim() && (
                        <li className="flex gap-3 items-start border-l-2 border-[#C0392B]/40 pl-4 py-1">
                          <AlertTriangle className="flex-shrink-0 w-4 h-4 text-[#C0392B]/80 mt-0.5 animate-warning-blink" aria-hidden />
                          <span className="whitespace-pre-line">{warningsText}</span>
                        </li>
                      )}
                    </ul>
                    {safeForFlags.length > 0 && (
                      <div className="mt-4 pt-4 mb-4">
                        <p className="font-sans text-[#444] text-base md:text-lg font-normal mb-2">Safe for</p>
                        <div className="flex flex-wrap gap-2">
                          {safeForFlags.map((label) => (
                            <span
                              key={label}
                              className="inline-flex items-center gap-1.5 font-sans text-sm text-[#1A6B3C] bg-[#E8F5EE]/80 px-3 py-1.5 rounded-md"
                            >
                              <Check className="w-3.5 h-3.5 flex-shrink-0" aria-hidden />
                              {label}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </section>
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-[#E0E0E0] to-transparent" />
                </>
              )}

              {/* FAQ — accordion with blended dividers (like reference) */}
              {georgiaAnchor?.faq_blocks && georgiaAnchor.faq_blocks.length > 0 && (
                <>
                  <ProductFaqSection
                    faqBlocks={georgiaAnchor.faq_blocks}
                    productName={product.name}
                  />
                  <div className="h-px w-full bg-gradient-to-r from-transparent via-[#E0E0E0] to-transparent" />
                </>
              )}
            </div>
          </div>

          {/* Georgia's Picks for You — right under FAQ, same bright white as above */}
          {pairsWithProducts.length > 0 ? (
            <section className="w-full py-6 md:py-8 bg-white">
              <div className="max-w-[1400px] mx-auto px-0 md:px-10">
                <Appear>
                  <h2 className="font-sans text-black mb-4 md:mb-6" style={{ fontSize: "28px", fontWeight: 700 }}>
                    Georgia&apos;s Picks for You
                  </h2>
                  <PairsCarousel pairs={pairsWithProducts} context="pairs" />
                </Appear>
              </div>
            </section>
          ) : (
            <section className="w-full py-6 md:py-8 bg-white" aria-hidden>
              <div className="max-w-[1400px] mx-auto px-0 md:px-10">
                <h2 className="font-sans text-black mb-4 md:mb-6" style={{ fontSize: "28px", fontWeight: 700 }}>
                  Georgia&apos;s Picks for You
                </h2>
                <div className="flex gap-3 overflow-hidden">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex-shrink-0 w-[200px] min-h-[420px] rounded-lg bg-[#F8F8F4] border border-[#D8D8D3] animate-pulse" />
                  ))}
                </div>
              </div>
            </section>
          )}
          {/* Blended divider between Georgia's Picks and Complete Your Routine */}
          {pairsWithProducts.length > 0 && stacksWithProducts.length > 0 && (
            <div className="flex justify-center w-full py-0" aria-hidden>
              <div className="h-px w-2/3 min-w-[160px] max-w-[320px] bg-gradient-to-r from-transparent via-[#E0E0E0] to-transparent" />
            </div>
          )}
          {/* Complete Your Routine — same format as Georgia's Picks, inside same padded container for consistent left gap */}
          {stacksWithProducts.length > 0 && (
            <section className="w-full py-6 md:py-8 bg-white">
              <div className="max-w-[1400px] mx-auto px-0 md:px-10">
                <Appear>
                  <h2 className="font-sans text-black mb-4 md:mb-6" style={{ fontSize: "28px", fontWeight: 700 }}>
                    Complete Your Routine
                  </h2>
                  <PairsCarousel pairs={stacksWithProducts as PairItem[]} context="stacks" />
                </Appear>
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Sticky Add to Cart bar — quantity selector + black Add To Cart button */}
      <StickyAddToCartBar productId={product.id} productName={product.name} />

      {/* Continuous Discovery — soft gradient fade into minimal footer */}
      <div className="w-full h-1 bg-gradient-to-b from-transparent to-[#F5F5F7]" aria-hidden />
      <footer className="w-full bg-[#F5F5F7] py-6 pb-14 px-4 md:px-10 border-t border-[#E0E0E0]">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <Link href="/" className="font-sans text-[#0E7C86] font-semibold text-sm tracking-wide">
            AUSVIA
          </Link>
          <nav className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-[#6e6e73]">
            <Link href="/shipping" className="hover:text-[#1d1d1f] transition-colors">
              Shipping
            </Link>
            <Link href="/about" className="hover:text-[#1d1d1f] transition-colors">
              About
            </Link>
            <Link href="/contact" className="hover:text-[#1d1d1f] transition-colors">
              Contact
            </Link>
          </nav>
          <div className="flex items-center gap-2 text-xs text-[#6e6e73]">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#0E7C86]/10 text-[#0E7C86] font-medium">
              Safe in 2026
            </span>
          </div>
        </div>
      </footer>
    </>
  );
}
