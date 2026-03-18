"use client";

import { useRef, useEffect, useCallback } from "react";

type SubcategoryPillsProps = {
  subcategories: string[];
  active: string;
  onSelect: (sub: string) => void;
};

const EDGE_ZONE_PX = 72;
const EDGE_SCROLL_SPEED = 8;

export default function SubcategoryPills({ subcategories, active, onSelect }: SubcategoryPillsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const directionRef = useRef<number>(0);
  const rafRef = useRef<number | null>(null);

  const tick = useCallback(() => {
    const el = scrollRef.current;
    if (!el || directionRef.current === 0) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 0) return;
    const next = el.scrollLeft + directionRef.current * EDGE_SCROLL_SPEED;
    el.scrollLeft = Math.max(0, Math.min(maxScroll, next));
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const media = window.matchMedia("(min-width: 768px)");
    if (!media.matches) return;

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const width = rect.width;
      if (x < EDGE_ZONE_PX) {
        directionRef.current = -1;
        if (rafRef.current == null) rafRef.current = requestAnimationFrame(tick);
      } else if (x > width - EDGE_ZONE_PX) {
        directionRef.current = 1;
        if (rafRef.current == null) rafRef.current = requestAnimationFrame(tick);
      } else {
        directionRef.current = 0;
      }
    };

    const onLeave = () => {
      directionRef.current = 0;
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      onLeave();
    };
  }, [tick]);

  return (
    <div
      ref={scrollRef}
      className="mt-4 md:mt-6 py-1 px-4 mb-0 overflow-x-auto scrollbar-hide bg-white touch-pan-x"
      style={{ WebkitOverflowScrolling: "touch" } as React.CSSProperties}
    >
      <div className="flex gap-6 md:gap-8 w-max min-w-full md:min-w-0">
        {subcategories.map((sub) => {
          const isActive = sub === active;
          return (
            <button
              key={sub}
              type="button"
              onClick={() => onSelect(sub)}
              className={`shrink-0 py-2 font-sans text-[13px] md:text-[14px] transition-colors duration-150 border-b-2 -mb-px ${
                isActive
                  ? "font-semibold text-[#1A1A18] border-[#1A1A18]"
                  : "font-normal text-[#4A4A46] border-transparent hover:text-[#1A1A18]"
              }`}
            >
              {sub}
            </button>
          );
        })}
      </div>
    </div>
  );
}
