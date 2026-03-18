import Link from "next/link";

const CATEGORIES = [
  { slug: "skincare", label: "Skincare" },
  { slug: "supplements", label: "Supplements" },
  { slug: "makeup", label: "Makeup" },
  { slug: "baby_care", label: "Baby Care" },
];

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-[#d2d2d7]/50 bg-[#F5F5F7]">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#6e6e73]">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} href={`/category/${c.slug}`} className="hover:text-[#1d1d1f] transition-colors">
              {c.label}
            </Link>
          ))}
          <Link href="/about" className="hover:text-[#1d1d1f] transition-colors">
            About
          </Link>
          <Link href="/contact" className="hover:text-[#1d1d1f] transition-colors">
            Contact
          </Link>
        </nav>
        <nav className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-[#6e6e73]">
          <Link href="/privacy" className="hover:text-[#1d1d1f] transition-colors">
            Privacy Policy
          </Link>
          <Link href="/terms" className="hover:text-[#1d1d1f] transition-colors">
            Terms
          </Link>
        </nav>
        <p className="mt-6 text-xs text-[#6e6e73]">AUSVIA — personalised recommendations you can trust.</p>
      </div>
    </footer>
  );
}
