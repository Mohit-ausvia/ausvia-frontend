"use client";

import { useEffect, useState } from "react";

type GeorgiaHeroBlockProps = {
  georgiaIntro: string;
  georgiaHeading: string;
  georgiaSub: string;
  georgiaDescription: string;
  onAskGeorgia: () => void;
};

export default function GeorgiaHeroBlock({
  georgiaIntro,
  georgiaHeading,
  georgiaSub,
  georgiaDescription,
  onAskGeorgia,
}: GeorgiaHeroBlockProps) {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    setTyped("");
    let i = 0;
    const delay = 700;
    const charMs = 55;
    const t1 = window.setTimeout(() => {
      const id = setInterval(() => {
        if (i <= georgiaIntro.length) {
          setTyped(georgiaIntro.slice(0, i));
          i++;
        } else {
          clearInterval(id);
        }
      }, charMs);
      return () => clearInterval(id);
    }, delay);
    return () => clearTimeout(t1);
  }, [georgiaIntro]);

  return (
    <div className="px-6 pt-5 pb-5 md:pt-4 md:pb-6 bg-white">
      <div className="md:flex md:items-center md:gap-10 lg:gap-14 max-w-[1120px] mx-auto">
        {/* 3a. Star burst — centred in left column on desktop */}
        <div className="flex justify-center items-center min-h-[95px] md:w-1/2 md:min-h-[286px]">
          <div className="relative inline-flex items-center justify-center w-[100px] h-[100px] md:w-[170px] md:h-[170px]">
            {/* Rays (scaled further on desktop only) */}
            <div className="absolute inset-0 origin-center md:scale-[1.35]" aria-hidden>
              {[
                { angle: 0, width: 110 },
                { angle: 45, width: 110 },
                { angle: 90, width: 110 },
                { angle: 135, width: 110 },
                { angle: 180, width: 110 },
                { angle: 225, width: 110 },
                { angle: 270, width: 110 },
                { angle: 315, width: 110 },
                { angle: 22.5, width: 80 },
                { angle: 67.5, width: 80 },
                { angle: 112.5, width: 80 },
                { angle: 157.5, width: 80 },
              ].map(({ angle, width }) => (
                <div
                  key={`${angle}-${width}`}
                  className="ray"
                  style={{
                    width,
                    left: "50%",
                    top: "50%",
                    transform: `translate(-50%, -50%) rotate(${angle}deg)`,
                  }}
                >
                  <div className="ray-p1" />
                  <div className="ray-p2" />
                </div>
              ))}
            </div>

            <span
              className="relative z-10 text-[48px] md:text-[78px]"
              style={{ color: "#0A0A0A" }}
              aria-hidden
            >
              ✦
            </span>
          </div>
        </div>

        {/* Blended vertical divider — desktop only */}
        <div
          className="hidden md:block w-px self-stretch shrink-0 bg-gradient-to-b from-transparent via-[#D8D8D3] to-transparent"
          aria-hidden
        />

        {/* Right column — intro, buttons, headings, description, CTAs */}
        <div className="mt-3 md:mt-0 md:w-1/2 md:flex md:flex-col md:items-center md:justify-center md:text-center">
          {/* 3b. Typewriter intro */}
          <p
            className="text-center w-full mb-1 md:mb-2 font-serif italic text-[13px] md:text-[14px] min-h-[1.4em]"
            style={{ color: "#1A1A18", opacity: 0.82, fontFamily: "'Playfair Display', serif" }}
          >
            {typed}
          </p>

          {/* 3c. Ask Georgia button — white like Scan Face, larger on desktop */}
          <button
            type="button"
            onClick={onAskGeorgia}
            className="w-full md:w-auto mt-1 mb-2 md:mb-3 py-[11px] md:py-2.5 md:px-16 rounded-full border font-sans font-extrabold text-[14px] md:text-[16px] uppercase tracking-[0.2em] transition-all duration-200 hover:bg-[#0A0A0A] hover:text-[#F8F8F4] hover:border-[#0A0A0A] active:bg-[#0A0A0A] active:text-[#F8F8F4]"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#1A1A18", color: "#1A1A18" }}
          >
            <span className="mr-2">ASK GEORGIA</span>
            <span className="inline-block text-[17px] md:text-[20px] align-middle animate-star-spin" aria-hidden>
              ✦
            </span>
          </button>

          {/* 3e. Main heading (no dot) */}
          <div className="flex flex-row items-center justify-center">
            <h1
              className="font-serif tracking-tight text-center"
              style={{
                color: "#1A1A18",
                fontFamily: "'Playfair Display', serif",
                fontSize: "21px",
                fontWeight: 800,
                letterSpacing: "-0.02em",
              }}
            >
              <span
                className="mr-1"
                style={{
                  fontWeight: 900,
                  fontSize: "21px",
                  letterSpacing: "-0.03em",
                }}
              >
                AI
              </span>
              {georgiaHeading.replace(/^AI\s*/i, "")}
            </h1>
          </div>

          {/* 3f. Subheading */}
          <p
            className="text-center mt-1 md:mt-2 font-serif italic text-[13px] md:text-[14px]"
            style={{ color: "#8A8A86", fontFamily: "'Playfair Display', serif" }}
          >
            {georgiaSub}
          </p>

          {/* Description paragraph — single flowing line so it wraps cleanly in portrait and landscape */}
          <p
            className="mt-2 md:mt-3 text-center font-serif text-[13px] md:text-[14px] leading-relaxed max-w-[420px] md:mx-auto break-words"
            style={{ color: "#8A8A86", fontFamily: "'Playfair Display', serif" }}
          >
            {georgiaDescription.replace(
              / — so you shop with confidence, not guesswork\.$/i,
              " — so you shop with confidence."
            )}
          </p>

          {/* Scan Face / Take Quiz buttons */}
          <div className="mt-5 md:mt-6 flex items-center justify-center gap-5">
            <button
              type="button"
              className="flex-1 max-w-[160px] md:flex-none md:w-[190px] py-3 rounded-full border font-sans text-[12px] font-medium tracking-[0.08em] uppercase transition-colors duration-150"
              style={{
                backgroundColor: "#FFFFFF",
                borderColor: "#D8D8D3",
                color: "#1A1A18",
              }}
            >
              Scan Face
            </button>
            <button
              type="button"
              className="flex-1 max-w-[160px] md:flex-none md:w-[190px] py-3 rounded-full font-sans text-[12px] font-semibold tracking-[0.08em] uppercase transition-colors duration-150"
              style={{
                backgroundColor: "#0A0A0A",
                color: "#F8F8F4",
              }}
            >
              ✦ Take Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
