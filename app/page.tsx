import Link from "next/link";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-semibold text-white">AUSVIA</h1>
      <p className="mt-6 text-[#6e6e73] text-sm font-medium">Test on phone: use your laptop IP instead of localhost (e.g. http://192.168.x.x:3000)</p>
      <div className="mt-6 space-y-3">
        <p className="text-[#6e6e73] text-sm">Quick links — tap to open product page:</p>
        <Link
          href="/products/swisse-retinol-0-1-clear-skin-pm-balance-serum-30ml"
          className="block text-[#0E7C86] hover:underline font-medium"
        >
          Swisse Retinol 0.1% Clear Skin PM Balance Serum 30ml
        </Link>
        <Link
          href="/products/la-roche-posay-lipikar-syndet-ap-cream-wash-400ml"
          className="block text-[#0E7C86] hover:underline"
        >
          La Roche-Posay Lipikar Syndet AP+ Cream Wash 400ml
        </Link>
      </div>
    </div>
  );
}
