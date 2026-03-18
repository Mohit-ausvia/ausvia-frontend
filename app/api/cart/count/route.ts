import { NextResponse } from "next/server";
import { getCartCount } from "@/lib/woo-store-api";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!process.env.WOO_STORE_API_URL?.trim()) {
    return NextResponse.json({ count: 0 });
  }
  try {
    const count = await getCartCount();
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
