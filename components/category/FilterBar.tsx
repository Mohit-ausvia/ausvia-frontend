"use client";

type FilterBarProps = {
  resultCount: number;
};

export default function FilterBar({ resultCount }: FilterBarProps) {
  return (
    <div
      className="py-3 pl-4 pr-6 md:pr-12 mb-1 mt-2 md:mt-6 flex flex-col gap-1.5"
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1.5 md:gap-4 w-full">
        <div className="flex items-center gap-4 md:justify-start">
          <button
            type="button"
            className="min-w-[170px] py-2 px-6 font-sans font-bold text-[14px] tracking-[0.08em] border transition-colors duration-150 hover:bg-[#0A0A0A] hover:text-[#F8F8F4] flex items-center justify-center"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#B0B0AA", color: "#1A1A18", borderRadius: 0 }}
          >
            <span>Filters</span>
            <span
              className="ml-5 inline-block shrink-0"
              aria-hidden
              style={{
                width: 8,
                height: 8,
                borderBottom: "1.5px solid #6E6E73",
                borderRight: "1.5px solid #6E6E73",
                transform: "rotate(45deg) translateY(-2px)",
              }}
            />
          </button>
          <button
            type="button"
            className="min-w-[170px] py-2 px-6 font-sans font-bold text-[14px] tracking-[0.08em] border transition-colors duration-150 hover:bg-[#0A0A0A] hover:text-[#F8F8F4] flex items-center justify-center"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#B0B0AA", color: "#1A1A18", borderRadius: 0 }}
          >
            <span>Sort By</span>
            <span
              className="ml-5 inline-block shrink-0"
              aria-hidden
              style={{
                width: 8,
                height: 8,
                borderBottom: "1.5px solid #6E6E73",
                borderRight: "1.5px solid #6E6E73",
                transform: "rotate(45deg) translateY(-2px)",
              }}
            />
          </button>
        </div>
        <span
          className="font-sans font-semibold text-[13px] md:text-[14px] md:ml-auto"
          style={{
            color: "#8A8A86",
            fontVariantNumeric: "lining-nums tabular-nums",
            fontFeatureSettings: '"lnum" 1, "tnum" 1',
            letterSpacing: "-0.02em",
          }}
        >
          {resultCount} Results
        </span>
      </div>
    </div>
  );
}
