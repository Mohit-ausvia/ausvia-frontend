"use client";

type GeorgiaCompactBarProps = {
  verticalLabel: string;
  onAskGeorgia: () => void;
};

export default function GeorgiaCompactBar({ verticalLabel, onAskGeorgia }: GeorgiaCompactBarProps) {
  return (
    <div className="fixed inset-x-0 top-[70px] md:top-[82px] z-40 px-3 md:px-6 lg:px-8">
      <div className="max-w-[1120px] mx-auto">
        <button
          type="button"
          onClick={onAskGeorgia}
          className="w-full flex items-center justify-between gap-3 rounded-full border bg-white/95 backdrop-blur-sm px-4 py-2 md:py-2.5 shadow-[0_4px_16px_rgba(0,0,0,0.06)] transition hover:bg-white"
          style={{ borderColor: "#E0E0E0" }}
          aria-label="Ask Georgia while browsing"
        >
          <div className="flex items-center gap-2">
            <span
              className="flex h-6 w-6 items-center justify-center rounded-full text-[13px]"
              style={{ backgroundColor: "#0A0A0A", color: "#FFFFFF" }}
              aria-hidden
            >
              ✦
            </span>
            <div className="flex flex-col items-start">
              <span className="font-sans text-[11px] md:text-[10px] uppercase tracking-[0.16em]" style={{ color: "#8A8A86" }}>
                Georgia
              </span>
              <span className="font-sans text-[12px] md:text-[11px]" style={{ color: "#1A1A18" }}>
                Need help choosing {verticalLabel.toLowerCase()}?
              </span>
            </div>
          </div>
          <span
            className="font-sans text-[11px] md:text-[10px] font-semibold px-3 py-1 rounded-full border whitespace-nowrap"
            style={{ borderColor: "#D8D8D3", color: "#1A1A18" }}
          >
            Ask Georgia
          </span>
        </button>
      </div>
    </div>
  );
}

