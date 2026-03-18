/**
 * WooCommerce Store API v1 wrapper. Base URL from WOO_STORE_API_URL.
 * Used for cart operations (add to cart, get cart count).
 */

function getBaseUrl(): string {
  const url = process.env.WOO_STORE_API_URL;
  if (!url || url === "") {
    throw new Error("WOO_STORE_API_URL is not set");
  }
  return url.replace(/\/$/, "");
}

function getAuth(): string {
  const key = process.env.WOO_CONSUMER_KEY;
  const secret = process.env.WOO_CONSUMER_SECRET;
  if (!key || !secret) {
    throw new Error("WOO_CONSUMER_KEY and WOO_CONSUMER_SECRET are required");
  }
  return Buffer.from(`${key}:${secret}`).toString("base64");
}

export type CartResponse = {
  key?: string;
  item_count?: number;
  item_count_display?: number;
  [key: string]: unknown;
};

/**
 * Add item to cart. Product ID is the WooCommerce product ID (integer).
 */
export async function addToCart(
  productId: number,
  quantity: number = 1
): Promise<CartResponse> {
  const base = getBaseUrl();
  const res = await fetch(`${base}/wc/store/v1/cart/add-item`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${getAuth()}`,
    },
    body: JSON.stringify({ id: productId, quantity }),
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`WooCommerce addToCart failed: ${res.status} ${text}`);
  }
  return res.json();
}

/**
 * Get current cart item count. Returns 0 if cart empty or on error.
 */
export async function getCartCount(): Promise<number> {
  try {
    const base = getBaseUrl();
    const res = await fetch(`${base}/wc/store/v1/cart`, {
      headers: {
        Authorization: `Basic ${getAuth()}`,
      },
      cache: "no-store",
    });
    if (!res.ok) return 0;
    const data = await res.json();
    const count = data?.item_count ?? data?.item_count_display ?? 0;
    return typeof count === "number" ? Math.max(0, count) : 0;
  } catch {
    return 0;
  }
}
