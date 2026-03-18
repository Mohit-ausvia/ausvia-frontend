"use client";

import { useState } from "react";
import { ShoppingCart, Minus, Plus } from "lucide-react";
import Link from "next/link";

type StickyAddToCartBarProps = {
  productId: number;
  productName: string;
};

export default function StickyAddToCartBar({ productId, productName }: StickyAddToCartBarProps) {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAddToCart = async () => {
    setLoading(true);
    setAdded(false);
    try {
      const res = await fetch("/api/cart/add-item", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to add to cart");
      }
      setAdded(true);
    } catch {
      // Could toast error here
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#F5F5F7]/98 backdrop-blur-md border-t border-[#E0E0E0] shadow-[0_-4px 20px rgba(0,0,0,0.06)] safe-area-pb">
      <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-3 flex items-center gap-3">
        {/* Quantity selector — - 1 + */}
        <div className="flex items-center border border-[#D8D8D3] rounded-md bg-white overflow-hidden shrink-0">
          <button
            type="button"
            aria-label="Decrease quantity"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex items-center justify-center w-10 h-11 text-[#1A1A18] hover:bg-[#EBEBEB] transition-colors disabled:opacity-50"
          >
            <Minus className="w-4 h-4" strokeWidth={2.5} />
          </button>
          <span className="flex items-center justify-center min-w-[2.5rem] h-11 font-sans font-semibold text-[#1A1A18] text-base">
            {quantity}
          </span>
          <button
            type="button"
            aria-label="Increase quantity"
            onClick={() => setQuantity((q) => q + 1)}
            className="flex items-center justify-center w-10 h-11 text-[#1A1A18] hover:bg-[#EBEBEB] transition-colors"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>
        {/* Black Add to Cart button with icon */}
        {added ? (
          <Link
            href="/cart"
            className="flex-1 flex items-center justify-center gap-2 bg-[#1A1A18] text-white font-sans font-semibold text-base py-3.5 rounded-md hover:bg-[#333] transition-colors"
          >
            <ShoppingCart className="w-5 h-5" strokeWidth={2} />
            View Cart
          </Link>
        ) : (
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 bg-[#1A1A18] text-white font-sans font-semibold text-base py-3.5 rounded-md hover:bg-[#333] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            aria-label={`Add ${productName} to cart`}
          >
            <ShoppingCart className="w-5 h-5 shrink-0" strokeWidth={2} />
            {loading ? "Adding…" : "Add To Cart"}
          </button>
        )}
      </div>
    </div>
  );
}
