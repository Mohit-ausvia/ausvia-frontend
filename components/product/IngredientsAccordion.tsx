"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type IngredientsAccordionProps = {
  ingredientsText: string | null;
};

export default function IngredientsAccordion({ ingredientsText }: IngredientsAccordionProps) {
  const [expanded, setExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const full = ingredientsText?.trim() ?? "";

  // Detect if content actually overflows 3 lines (so we only show toggle when needed)
  useEffect(() => {
    const el = contentRef.current;
    if (!el || !full) return;
    if (expanded) {
      setIsClamped(true); // had more, so keep button visible
      return;
    }
    const check = () => {
      if (el.scrollHeight > el.clientHeight) setIsClamped(true);
      else setIsClamped(false);
    };
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [full, expanded]);

  if (!full) return null;

  return (
    <div className="w-full">
      <div
        ref={contentRef}
        className={`font-sans text-[#444] text-base md:text-lg leading-[1.4] font-normal whitespace-pre-line ${!expanded ? "line-clamp-3" : ""}`}
      >
        {full}
      </div>
      {(isClamped || expanded) && (
        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="mt-3 flex items-center gap-2 font-sans text-[#0E7C86] text-sm font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-[#0E7C86]/30 rounded"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-4 h-4" aria-hidden />
              Show less
            </>
          ) : (
            <>
              <ChevronDown className="w-4 h-4" aria-hidden />
              View full list
            </>
          )}
        </button>
      )}
    </div>
  );
}
