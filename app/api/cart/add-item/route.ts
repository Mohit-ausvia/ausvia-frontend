import { NextResponse } from "next/server";
import { addToCart } from "@/lib/woo-store-api";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  if (!process.env.WOO_STORE_API_URL?.trim()) {
    return NextResponse.json(
      { error: "Cart not configured" },
      { status: 503 }
    );
  }
  try {
    const body = await request.json();
    const productId = typeof body.productId === "number" ? body.productId : parseInt(String(body.productId), 10);
    const quantity = typeof body.quantity === "number" ? Math.max(1, body.quantity) : 1;
    if (!Number.isFinite(productId) || productId < 1) {
      return NextResponse.json(
        { error: "Invalid productId" },
        { status: 400 }
      );
    }
    await addToCart(productId, quantity);
    return NextResponse.json({ ok: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Add to cart failed";
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
