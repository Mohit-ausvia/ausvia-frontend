"use client";

type GeorgiaDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
  verticalLabel: string;
};

export default function GeorgiaDrawer({ isOpen, onClose, verticalLabel }: GeorgiaDrawerProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-[200] animate-overlay-fade-in"
        style={{ backgroundColor: "rgba(10, 10, 10, 0.5)" }}
        onClick={onClose}
        aria-hidden
      />
      <div
        className="fixed inset-y-0 right-0 z-[201] w-full max-w-[480px] px-5 pt-5 pb-8 flex flex-col animate-drawer-up"
        style={{ backgroundColor: "#F8F8F4", borderTopLeftRadius: 20, borderBottomLeftRadius: 20 }}
        role="dialog"
        aria-label="Ask Georgia"
      >
        {/* Header row + close button */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-sans font-bold text-[14px] text-white shrink-0"
              style={{ backgroundColor: "#0A0A0A" }}
            >
              G
            </div>
            <div className="min-w-0">
              <span className="font-sans font-semibold text-[13px] text-[#1A1A18]">Georgia</span>
              <span className="font-sans text-[10px] text-[#8A8A86] ml-1.5">
                AI {verticalLabel} Advisor
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#8A8A86] hover:text-[#1A1A18] transition-colors"
            aria-label="Close chat"
          >
            <span className="text-2xl leading-none">×</span>
          </button>
        </div>
        {/* Messages area — anchored to bottom, scrolls up */}
        <div className="flex-1 flex flex-col justify-end gap-2 overflow-y-auto mt-1 mb-3">
          <div
            className="rounded-xl py-3 px-3.5 text-[12px] leading-relaxed"
            style={{ backgroundColor: "#EEEEE9", color: "#4A4A46" }}
          >
            Hi, I&apos;m Georgia. You&apos;re browsing our {verticalLabel} range. Tell me your main
            concern and I&apos;ll find exactly what&apos;s right for you.
          </div>
        </div>
        {/* Input row */}
        <div className="flex items-center gap-2 mt-1">
          <input
            type="text"
            placeholder={`Ask me anything about ${verticalLabel}...`}
            className="flex-1 py-2.5 px-4 rounded-full font-sans text-[16px] border outline-none focus:ring-2 focus:ring-[#0A0A0A]/20"
            style={{
              backgroundColor: "#EEEEE9",
              borderColor: "#D8D8D3",
              color: "#1A1A18",
            }}
            aria-label="Message Georgia"
          />
          <button
            type="button"
            className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#0A0A0A" }}
            aria-label="Send"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
            </svg>
          </button>
        </div>
      </div>
    </>
  );
}
