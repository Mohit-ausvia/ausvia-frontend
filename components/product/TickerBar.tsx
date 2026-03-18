const TICKER_ITEMS = [
  "✓ Authentic Australian Stock",
  "🇦🇺 Made in Australia",
  "✓ Free DDP Delivery — No Customs",
  "✓ Georgia Safety Verified",
  "✓ 30-Day Returns",
];

export default function TickerBar() {
  const duplicated = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <section className="w-full bg-[#1d1d1f] h-11 flex items-center overflow-hidden border-y border-[#E0E0E0]">
      <div className="flex items-center gap-6 whitespace-nowrap animate-tick w-max">
        {duplicated.map((item, i) => (
          <span key={i} className="text-sm text-[#f5f5f0]">
            <span className="text-[#0E7C86]">{item.charAt(0)}</span>
            {item.slice(1)}
          </span>
        ))}
      </div>
    </section>
  );
}
