"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type FaqItem = { question?: string; answer?: string };

type ProductFaqSectionProps = {
  faqBlocks: FaqItem[];
  productName: string;
};

export default function ProductFaqSection({ faqBlocks, productName }: ProductFaqSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (!faqBlocks?.length) return null;

  return (
    <section className="py-6 md:py-8">
      <h2 className="font-sans text-black text-2xl md:text-3xl font-black tracking-tight mb-6">
        {productName} FAQs
      </h2>
      <div className="space-y-0">
        {faqBlocks.map((faq, i) => (
          <div key={i}>
            <div className="flex justify-center py-0" aria-hidden>
              <div className="h-px w-2/3 min-w-[160px] max-w-[320px] bg-gradient-to-r from-transparent via-[#E0E0E0] to-transparent" />
            </div>
            <div>
              <button
                type="button"
                onClick={() => setOpenIndex((k) => (k === i ? null : i))}
                className="w-full flex items-center justify-between gap-3 py-4 text-left focus:outline-none focus:ring-2 focus:ring-[#0E7C86]/30 rounded"
              >
                <span className="font-sans text-black text-base md:text-lg font-black flex-1 min-w-0 pr-2">
                  {faq.question || "Question"}
                </span>
                <span className="flex-shrink-0 text-black">
                  {openIndex === i ? (
                    <ChevronUp className="w-5 h-5" aria-hidden />
                  ) : (
                    <ChevronDown className="w-5 h-5" aria-hidden />
                  )}
                </span>
              </button>
              {openIndex === i && faq.answer && (
                <div className="pb-4">
                  <p className="font-sans text-[#444] text-base md:text-lg leading-[1.5] font-normal">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
