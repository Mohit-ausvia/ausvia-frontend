"use client";

import Link from "next/link";
import { Search, User, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";

const VERTICALS = [
  { slug: "skincare", label: "Skincare" },
  { slug: "supplements", label: "Supplements" },
  { slug: "makeup", label: "Makeup" },
  { slug: "baby-care", label: "Baby Care" },
];

export default function Header() {
  const [cartCount, setCartCount] = useState<number>(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetch("/api/cart/count")
      .then((res) => res.json())
      .then((data) => setCartCount(Number(data?.count) || 0))
      .catch(() => setCartCount(0));
  }, []);

  return (
    <header className="flex h-[42px] w-full items-center justify-between px-4 border-b border-[#E5E5E5] bg-white">
      {/* Left: nav icon */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setMobileOpen((o) => !o)}
          className="relative z-[60] p-2 text-[#1A1A18] hover:opacity-70 transition-opacity"
          aria-label="Menu"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <line x1="1.5" y1="8" x2="22.5" y2="8" stroke="#333333" strokeWidth="2.8" strokeLinecap="round" />
            <line x1="1.5" y1="15" x2="22.5" y2="15" stroke="#333333" strokeWidth="2.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>
      {/* Center: AUSVIA */}
      <Link
        href="/"
        className="absolute left-1/2 -translate-x-1/2 font-sans font-extrabold text-[16px] text-[#1A1A18] hover:opacity-90"
        style={{ letterSpacing: "0.35em", whiteSpace: "nowrap" }}
      >
        AUSVIA
      </Link>
      {/* Right: search + profile + cart */}
      <div className="flex items-center gap-0">
        <button
          type="button"
          className="p-2 text-[#1A1A18] hover:opacity-70 transition-opacity"
          aria-label="Search"
        >
          <Search className="h-5 w-5" strokeWidth={2} />
        </button>
        <Link
          href="/account"
          className="p-2 text-[#1A1A18] hover:opacity-70 transition-opacity"
          aria-label="Account"
        >
          <User className="h-5 w-5" strokeWidth={2} />
        </Link>
        <Link
          href="/cart"
          className="relative p-2 text-[#1A1A18] hover:opacity-70 transition-opacity"
          aria-label="Cart"
        >
          <ShoppingBag className="h-5 w-5" strokeWidth={2} />
          {cartCount > 0 && (
            <span
              className="absolute right-0 top-0 h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "#0E7C86" }}
              aria-hidden
            />
          )}
        </Link>
      </div>

      {/* Mobile nav overlay */}
      {mobileOpen && (
        <div
          className="fixed left-0 right-0 top-[52px] bottom-0 z-40 bg-black/40 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}
      <div
        className={`fixed left-0 right-0 top-[52px] z-40 border-t border-[#D8D8D3] md:hidden transition-all ${
          mobileOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        style={{ backgroundColor: "#FFFFFF" }}
      >
        <nav className="flex flex-col px-4 py-3 gap-1">
          {VERTICALS.map((v) => (
            <Link
              key={v.slug}
              href={`/category/${v.slug}`}
              className="py-2.5 text-[#4A4A46] hover:text-[#1A1A18] text-sm font-medium"
              onClick={() => setMobileOpen(false)}
            >
              {v.label}
            </Link>
          ))}
          <Link
            href="/quiz"
            className="py-2.5 text-[#0E7C86] font-medium text-sm"
            onClick={() => setMobileOpen(false)}
          >
            Ask Georgia
          </Link>
        </nav>
      </div>
    </header>
  );
}
