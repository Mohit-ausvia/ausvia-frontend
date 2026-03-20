import type { ReactNode } from "react";
import HomeCategoryCarousel from "@/components/home/HomeCategoryCarousel";

/** Same ✦ + rays as category hero button star, for hero “between” placement. */
function HeroBetweenStar() {
  return (
    <span
      className="relative inline-flex h-[36px] w-[36px] shrink-0 items-center justify-center md:h-[44px] md:w-[44px] animate-hero-star-slide"
      aria-hidden
    >
      <span className="absolute inset-0 origin-center" aria-hidden>
        {[
          { angle: 0, width: 30 },
          { angle: 45, width: 30 },
          { angle: 90, width: 30 },
          { angle: 135, width: 30 },
          { angle: 180, width: 30 },
          { angle: 225, width: 30 },
          { angle: 270, width: 30 },
          { angle: 315, width: 30 },
        ].map(({ angle, width }) => (
          <span
            key={`home-between-hero-pill-ray-${angle}`}
            className="ray"
            style={{
              width,
              left: "50%",
              top: "50%",
              transform: `translate(-50%, -50%) rotate(${angle}deg)`,
            }}
            aria-hidden
          >
            <span className="ray-p1" />
            <span className="ray-p2" />
          </span>
        ))}
      </span>
      <span className="relative z-10 text-[30px] md:text-[36px]" style={{ color: "#0A0A0A" }} aria-hidden>
        ✦
      </span>
    </span>
  );
}

/** Pill CTA — reference style: 1px black border, #E8E8E8 fill, bold label */
function HeroPillButton({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a
      href={href}
      className="inline-flex min-h-[48px] w-full items-center justify-center gap-1.5 rounded-full border border-black bg-[#E8E8E8] px-6 py-3 text-center font-sans text-[13px] font-bold tracking-[0.02em] text-black transition-colors hover:bg-[#DEDEDE] sm:w-auto sm:min-w-[168px] sm:px-8 sm:py-3.5 sm:text-[14px]"
    >
      {children}
    </a>
  );
}

export default function HomePage() {
  return (
    <div className="bg-[#F5F5F7]">
      {/* Hero — editorial layout (light grey, left-aligned, twin pill CTAs) */}
      <section className="bg-[#F2F2F2] text-[#0A0A0A]">
        <div className="relative mx-auto max-w-[1120px] px-4 pb-10 pt-8 md:px-10 md:pb-14 md:pt-12 lg:pt-14">
          <div className="max-w-xl text-left">
            <p className="font-sans text-[20px] font-bold tracking-tight text-black md:text-[22px]">
              Georgia.
            </p>
            <h1 className="mt-3 font-sans text-[28px] font-bold leading-[1.12] tracking-tight text-black md:mt-4 md:text-[40px] lg:text-[44px]">
              Australian AI health &amp; beauty has arrived.
            </h1>
            <p className="mt-4 max-w-[36ch] font-sans text-[15px] font-normal leading-relaxed text-[#4A4A4A] md:mt-5 md:text-[17px] md:leading-relaxed">
              Cooler routines, clearer ingredients, season-smart advice. When your goals change, the
              support from Georgia does too.
            </p>
            <div className="mt-4 flex justify-center md:mt-5" aria-hidden>
              <HeroBetweenStar />
            </div>
            <div className="mt-6 flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:flex-wrap sm:gap-4 md:mt-9">
              <HeroPillButton href="/category/skincare">
                <span className="shrink-0">Ask Georgia</span>
              </HeroPillButton>
              <HeroPillButton href="/scan">Scan your face</HeroPillButton>
            </div>
          </div>
        </div>
      </section>

      {/* Apple-style swipeable category cards — one row per vertical */}
      <div className="h-8 md:h-10 bg-white" aria-hidden />
      <div className="bg-white">
      {[
        {
          key: "supplements",
          heading: "Vitamins & Supplements.",
          headingRest: "Discover pharmaceutical-grade Australian supplements.",
          cards: [
            {
              title: "Multivitamin",
              subtitle: "Everyday foundations",
              sub: "Vitamins",
              bg: "linear-gradient(180deg, #0B0B0B 0%, #0B0B0B 55%, #1A1A1A 100%)",
              fg: "#FFFFFF",
              plusBg: "rgba(255,255,255,0.92)",
              plusFg: "#0A0A0A",
              art: "🧬",
              imgSrc: "/card-icons/MULTI.avif",
              imgAlt: "Multivitamin",
            },
            {
              title: "Protein",
              subtitle: "Recovery + strength",
              sub: "Protein",
              bg: "radial-gradient(600px circle at 30% 20%, rgba(255,255,255,0.14), rgba(255,255,255,0) 55%), linear-gradient(180deg, #0B0B0B 0%, #0B0B0B 60%, #151515 100%)",
              fg: "#FFFFFF",
              plusBg: "rgba(255,255,255,0.92)",
              plusFg: "#0A0A0A",
              art: "🥤",
            },
            {
              title: "Muscle Repair",
              subtitle: "Post-workout support",
              sub: "Energy",
              bg: "linear-gradient(180deg, #0B0B0B 0%, #0B0B0B 55%, #141414 100%)",
              fg: "#FFFFFF",
              plusBg: "rgba(255,255,255,0.92)",
              plusFg: "#0A0A0A",
              art: "💪",
            },
            {
              title: "Sports Supplements",
              subtitle: "Performance essentials",
              sub: "Omega",
              bg: "radial-gradient(650px circle at 50% 30%, rgba(14,124,134,0.22), rgba(14,124,134,0) 58%), linear-gradient(180deg, #0B0B0B 0%, #0B0B0B 65%, #141414 100%)",
              fg: "#FFFFFF",
              plusBg: "rgba(255,255,255,0.92)",
              plusFg: "#0A0A0A",
              art: "🏃",
            },
          ],
        },
        {
          key: "skincare",
          heading: "Essential Skincare",
          headingRest: "Science-backed care for changing skin",
          cards: [
            {
              title: "Cleansers",
              subtitle: "Gentle daily reset",
              sub: "Cleansers",
              art: "🫧",
              imgSrc: "/card-icons/cleanser.jpg",
              imgAlt: "Cleansers",
            },
            { title: "Serums", subtitle: "Targeted actives", sub: "Serums", art: "💧" },
            { title: "Moisturisers", subtitle: "Barrier support", sub: "Moisturisers", art: "🧴" },
            { title: "Sunscreens", subtitle: "Everyday SPF", sub: "Sunscreens", art: "☀️" },
          ].map((c) => ({
            ...c,
            bg: "#ffffff",
            fg: "#1A1A18",
            plusBg: "rgba(0,0,0,0.06)",
            plusFg: "#1A1A18",
          })),
        },
        {
          key: "makeup",
          heading: "SHOP MAKEUP",
          headingRest: "Exotic makeup bestsellers you've seen all over your feed.",
          cards: [
            {
              title: "Foundation",
              subtitle: "FACE",
              sub: "Foundation",
              art: "🎨",
              imgSrc: "/card-icons/FOUNDATION.webp",
              imgAlt: "Foundation",
            },
            {
              title: "Lip",
              subtitle: "LIPS",
              sub: "Lip",
              art: "💄",
              imgSrc: "/card-icons/LIPS.webp",
              imgAlt: "Lip",
            },
            {
              title: "Eye",
              subtitle: "EYES",
              sub: "Eye",
              art: "👁️",
              imgSrc: "/card-icons/EYES.jpg",
              imgAlt: "Eye",
            },
            { title: "Tools", subtitle: "TOOLS", sub: "Tools", art: "🖌️" },
          ].map((c) => ({
            ...c,
            bg: "radial-gradient(700px circle at 50% 20%, rgba(255,255,255,0.10), rgba(255,255,255,0) 55%), linear-gradient(180deg, #060606 0%, #0B0B0B 60%, #111111 100%)",
            fg: "#FFFFFF",
            plusBg: "rgba(255,255,255,0.92)",
            plusFg: "#0A0A0A",
          })),
        },
        {
          key: "baby-care",
          heading: "Advanced Baby Care",
          headingRest: "Trusted by midwives, loved by parents",
          cards: [
            {
              title: "Body Wash",
              subtitle: "Gentle cleanse",
              sub: "Body Wash",
              art: "🧼",
              imgSrc: "/card-icons/baby.jpg",
              imgAlt: "Body Wash",
            },
            { title: "Moisturiser", subtitle: "Soft skin care", sub: "Moisturiser", art: "🧴" },
            { title: "Wipes", subtitle: "Everyday essentials", sub: "Wipes", art: "🧻" },
            { title: "Sun Protection", subtitle: "Outdoor safe", sub: "Sun Protection", art: "🍼" },
          ].map((c) => ({
            ...c,
            bg: "linear-gradient(180deg, #EBEBED 0%, #E3E3E6 58%, #D8D8DC 100%)",
            fg: "#1A1A18",
            plusBg: "rgba(0,0,0,0.08)",
            plusFg: "#1A1A18",
          })),
        },
      ].map((row) => {
        const isSkincare = row.key === "skincare";
        const isMakeup = row.key === "makeup";
        const isBabyCare = row.key === "baby-care";
        const isGreySection = row.key === "skincare" || row.key === "makeup" || row.key === "baby-care";
        const sectionBg = isGreySection ? "#EBEBED" : "#ffffff";

        const headingAndCarousel = (
          <>
            <h2
              className={`font-sans font-black tracking-tight text-[#1A1A18] mb-3 md:mb-4 ${
                row.key === "makeup" ? "pl-4 md:pl-6" : ""
              }`}
              style={{
                fontSize: "32px",
                lineHeight: (row as any).headingRest
                  ? 1.05
                  : 1.15,
              }}
            >
              {(row as any).headingRest ? (
                <>
                  <span className="block font-black uppercase text-[#0A0A0A] text-[26px] md:text-[30px] leading-none">
                    {row.heading}
                  </span>
                    <span
                      className={`block text-[#6A6A66] text-[18px] font-normal leading-none ${
                        row.key === "supplements" ||
                        row.key === "skincare" ||
                        row.key === "makeup" ||
                        row.key === "baby-care"
                          ? "mt-1 md:mt-1.5"
                          : ""
                      } md:text-[22px]`}
                    >
                    {(row as any).headingRest}
                  </span>
                </>
              ) : (
                row.heading
              )}
            </h2>
            {row.key === "makeup" ? (
              <div className="mt-4 md:mt-6 px-1 md:px-2">
                <div className="grid grid-cols-2 gap-x-[4px] gap-y-[12px]">
                  {row.cards.map((card) => (
                    <a
                      key={`${row.key}-${card.title}`}
                      href={`/category/${row.key}?sub=${encodeURIComponent(card.sub)}`}
                      className="block"
                      aria-label={card.title}
                    >
                      <div className="relative w-full aspect-square overflow-hidden rounded-none bg-white min-h-[260px] md:min-h-[380px]">
                        {(card as any).imgSrc ? (
                          <img
                            src={(card as any).imgSrc}
                            alt={(card as any).imgAlt ?? card.title}
                            className="absolute inset-0 h-full w-full object-cover"
                          />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center bg-[#F5F5F7]">
                            <span aria-hidden className="text-[46px]">
                              {card.art}
                            </span>
                          </div>
                        )}
                      </div>
                      <p className="mt-0.5 font-sans text-[14px] font-bold text-[#1A1A18] leading-tight text-center px-2">
                        {card.subtitle ?? card.title}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            ) : (
              <div
                className={
                  row.key === "supplements" || row.key === "skincare" || row.key === "baby-care"
                    ? "mt-2 md:mt-3"
                    : ""
                }
              >
                <HomeCategoryCarousel
                  bgColor={sectionBg}
                  extendedBottom={false}
                  arrowButtonBg={isGreySection ? "#ffffff" : undefined}
                >
                  {row.cards.map((card) => {
                    const minH = isSkincare
                      ? "min-h-[420px] md:min-h-[460px]"
                      : isBabyCare
                        ? "min-h-[250px] md:min-h-[280px]"
                        : isMakeup
                          ? "min-h-[500px] md:min-h-[556px]"
                          : "min-h-[470px] md:min-h-[520px]";
                    const baseCard = isSkincare
                      ? "block w-[60vw] max-w-[252px] md:w-[272px] rounded-[24px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.05),0_14px_36px_-12px_rgba(0,0,0,0.14)] relative"
                      : "block w-[68vw] max-w-[300px] md:w-[320px] rounded-[28px] overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.05),0_14px_36px_-12px_rgba(0,0,0,0.14)] relative";
                    return (
                      <a
                        key={`${row.key}-${card.title}`}
                        href={`/category/${row.key}?sub=${encodeURIComponent(card.sub)}`}
                        className={`${baseCard} ${minH}`}
                        aria-label={card.title}
                        style={
                          (card as any).imgSrc
                            ? { background: "transparent", color: card.fg }
                            : { background: card.bg, color: card.fg }
                        }
                      >
                        {(card as any).imgSrc ? (
                          <>
                            <img
                              src={(card as any).imgSrc}
                              alt=""
                              className="absolute inset-0 z-0 h-full w-full min-h-full min-w-full object-cover pointer-events-none"
                              style={{
                                objectPosition: isMakeup ? "center top" : "50% 50%",
                              }}
                            />
                            <div
                              className="pointer-events-none absolute inset-x-0 top-0 z-10 px-4 pt-4 pb-12 md:px-5 md:pt-4.5 md:pb-14"
                              style={{
                                background:
                                  typeof card.fg === "string" && card.fg === "#FFFFFF"
                                    ? "linear-gradient(to bottom, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.18) 45%, transparent 100%)"
                                    : "linear-gradient(to bottom, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.5) 40%, transparent 100%)",
                              }}
                            />
                            <p
                              className="absolute left-0 right-0 top-0 z-20 px-4 pt-4 font-sans text-[24px] font-semibold uppercase tracking-[0.06em] md:px-5 md:pt-4.5 md:text-[28px]"
                              style={{ color: card.fg }}
                            >
                              {card.title}
                            </p>
                          </>
                        ) : (
                          <div
                            className={`relative z-10 flex h-full min-h-0 flex-col p-5 pt-5 ${minH}`}
                          >
                            <p
                              className="shrink-0 font-sans text-[20px] font-semibold uppercase tracking-[0.16em] opacity-80 md:text-[24px]"
                              style={{ color: card.fg }}
                            >
                              {card.title}
                            </p>
                            <div className="flex min-h-0 flex-1 items-center justify-center">
                              <div
                                className={
                                  isSkincare
                                    ? "h-[100px] w-[100px] rounded-[22px] flex items-center justify-center relative"
                                    : isBabyCare
                                      ? "h-[90px] w-[90px] rounded-[20px] flex items-center justify-center relative"
                                      : "h-[120px] w-[120px] rounded-[26px] flex items-center justify-center relative"
                                }
                                style={{
                                  background:
                                    typeof card.fg === "string" && card.fg === "#FFFFFF"
                                      ? "rgba(255,255,255,0.06)"
                                      : "rgba(0,0,0,0.04)",
                                  fontSize: isSkincare ? 48 : isBabyCare ? 40 : 56,
                                }}
                                aria-hidden
                              >
                                <span className="relative z-0">{card.art}</span>
                              </div>
                            </div>
                          </div>
                        )}
                      </a>
                    );
                  })}
                </HomeCategoryCarousel>
              </div>
            )}
          </>
        );

        const mainSection = (
          <section
            key={`${row.key}-main`}
            className={
              row.key === "makeup" ? "bg-white" : isGreySection ? "bg-[#EBEBED]" : "bg-white"
            }
          >
            <div
              className={`mx-auto pt-5 md:pt-8 ${
                row.key === "skincare" ? "pb-0 md:pb-0" : "pb-8 md:pb-12"
              } ${
                row.key === "makeup"
                  ? "max-w-none px-0 md:px-0"
                  : "max-w-[1120px] px-4 md:px-10"
              }`}
            >
              {headingAndCarousel}
            </div>
          </section>
        );

        const skincareCtaSection =
          row.key === "skincare" ? (
            <div
              key={`${row.key}-cta`}
              className="bg-[#F0E7E2] py-0"
              aria-label="Face scaner section"
            >
              <div className="max-w-none mx-0 px-0 pt-0 pb-0">
                <h2
                  className="px-4 md:px-10 font-sans font-black tracking-tight text-[#1A1A18] uppercase text-[26px] md:text-[30px] mb-4"
                  aria-hidden
                >
                  FACE SCANNER
                </h2>
                <a
                  href="/skincare-feature"
                  aria-label="Explore skincare feature"
                  className="block rounded-none overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
                >
                  <img
                    src="/card-icons/Face%20scanner1.jpeg"
                    alt="Face scanner"
                    className="block h-auto w-full"
                  />
                </a>
                {/* Keep bottom flush; still white immediately below image */}
                <div className="bg-white h-0 md:h-0" aria-hidden />
              </div>
            </div>
          ) : null;

        return [mainSection, skincareCtaSection];
      })}
      </div>
    </div>
  );
}
