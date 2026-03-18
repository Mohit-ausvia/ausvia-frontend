import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

function getBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_WOO_URL;
  if (!url?.trim()) throw new Error("NEXT_PUBLIC_WOO_URL is not set");
  return url.replace(/\/$/, "");
}

function getAuth(): string {
  const key = process.env.WOO_CONSUMER_KEY;
  const secret = process.env.WOO_CONSUMER_SECRET;
  if (!key || !secret) throw new Error("WOO_CONSUMER_KEY and WOO_CONSUMER_SECRET are required");
  return Buffer.from(`${key}:${secret}`).toString("base64");
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const productId = parseInt(id, 10);
    if (Number.isNaN(productId)) {
      return NextResponse.json({ message: "Invalid product ID" }, { status: 400 });
    }

    const body = await request.json();
    const { rating, review, reviewer, reviewer_email } = body;

    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json({ message: "Rating must be between 1 and 5" }, { status: 400 });
    }
    if (typeof review !== "string" || !review.trim()) {
      return NextResponse.json({ message: "Review text is required" }, { status: 400 });
    }
    if (typeof reviewer !== "string" || !reviewer.trim()) {
      return NextResponse.json({ message: "Reviewer name is required" }, { status: 400 });
    }
    if (typeof reviewer_email !== "string" || !reviewer_email.trim()) {
      return NextResponse.json({ message: "Reviewer email is required" }, { status: 400 });
    }

    const baseUrl = getBaseUrl();
    const auth = getAuth();
    const res = await fetch(`${baseUrl}/wp-json/wc/v3/products/${productId}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify({
        reviewer: reviewer.trim(),
        reviewer_email: reviewer_email.trim(),
        review: review.trim(),
        rating,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return NextResponse.json(
        { message: err || "WooCommerce could not create the review" },
        { status: res.status >= 400 && res.status < 500 ? res.status : 502 }
      );
    }

    const data = await res.json();
    return NextResponse.json({ success: true, id: data.id });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Failed to submit review";
    return NextResponse.json({ message }, { status: 500 });
  }
}
