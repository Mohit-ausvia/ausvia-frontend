"use client";

import { Children, isValidElement, useCallback, useRef } from "react";

/** Apple-style flat circle + rounded-stroke chevrons (reference match). */
function CarouselChevron({ direction }: { direction: "left" | "right" }) {
  const isLeft = direction === "left";
  return (
    <svg
      width={11}
      height={18}
      viewBox="0 0 11 18"
      fill="none"
      className="shrink-0"
      aria-hidden
    >
      <path
        d={isLeft ? "M8 3L3.5 9L8 15" : "M3 3L7.5 9L3 15"}
        stroke="#3C3C43"
        strokeWidth={2.65}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

type HomeCategoryCarouselProps = {
  /** Matches section background so gaps between cards blend (no colour breakout). */
  bgColor: string;
  children: React.ReactNode;
  /** Extra padding below arrows (e.g. supplements section). */
  extendedBottom?: boolean;
  /** Arrow button circle background (e.g. "#ffffff" for skincare on grey). */
  arrowButtonBg?: string;
};

export default function HomeCategoryCarousel({
  bgColor,
  children,
  extendedBottom = false,
  arrowButtonBg,
}: HomeCategoryCarouselProps) {
  const isWhiteBtn = arrowButtonBg === "#ffffff" || arrowButtonBg === "white";
  const btnClass = isWhiteBtn
    ? "bg-white border border-[#E5E5E5] hover:bg-[#F5F5F5] active:bg-[#EEEEEE]"
    : "bg-[#EBEBEB] hover:bg-[#E5E5E5] active:bg-[#E0E0E0]";
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollByDirection = useCallback((direction: -1 | 1) => {
    const el = scrollRef.current;
    if (!el) return;
    const step = Math.min(el.clientWidth * 0.88, 340);
    el.scrollBy({ left: direction * step, behavior: "smooth" });
  }, []);

  return (
    <div
      className={extendedBottom ? "pb-4 md:pb-6" : ""}
      style={{ backgroundColor: bgColor }}
    >
      <div
        ref={scrollRef}
        className="mt-6 md:mt-7 -mx-4 px-4 md:mx-0 md:px-0 overflow-x-auto scrollbar-hide"
        style={{ backgroundColor: bgColor }}
      >
        {/* Padding gutters (not flex gap) = same bg as section so gaps match; avoids shadow darkening the strip */}
        <div
          className="flex w-max flex-row flex-nowrap snap-x snap-mandatory"
          style={{ backgroundColor: bgColor }}
        >
          {Children.map(children, (child, i) => {
            if (!isValidElement(child)) return child;
            return (
              <div
                key={child.key ?? i}
                className={`snap-start shrink-0 ${i > 0 ? "pl-4" : ""}`}
                style={{ backgroundColor: bgColor }}
              >
                {child}
              </div>
            );
          })}
        </div>
      </div>
      <div
        className="flex justify-end gap-2 mt-4 md:mt-5"
        style={{ backgroundColor: bgColor }}
      >
        <button
          type="button"
          aria-label="Previous"
          onClick={() => scrollByDirection(-1)}
          className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${btnClass} transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3C3C43] active:scale-[0.98]`}
        >
          <CarouselChevron direction="left" />
        </button>
        <button
          type="button"
          aria-label="Next"
          onClick={() => scrollByDirection(1)}
          className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${btnClass} transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#3C3C43] active:scale-[0.98]`}
        >
          <CarouselChevron direction="right" />
        </button>
      </div>
    </div>
  );
}
