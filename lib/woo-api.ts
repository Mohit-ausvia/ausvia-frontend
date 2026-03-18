/**
 * WooCommerce REST API v3 — fetch product by slug. Server-side only.
 */

export type WooProductImage = {
  id: number;
  src: string;
  alt: string;
  name?: string;
};

export type WooMetaData = {
  id?: number;
  key: string;
  value: string;
};

export type WooProduct = {
  id: number;
  name: string;
  slug: string;
  sku?: string;
  permalink: string;
  price: string;
  regular_price: string;
  sale_price: string;
  description: string;
  short_description: string;
  images: WooProductImage[];
  meta_data: WooMetaData[];
  categories?: { id: number; name: string; slug: string }[];
  tags?: { id: number; name: string; slug: string }[];
};

function getBaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_WOO_URL;
  if (!url || url === "") {
    throw new Error("NEXT_PUBLIC_WOO_URL is not set");
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

/**
 * Fetch a single product by slug. Returns null if not found.
 */
export async function getProductBySlug(slug: string): Promise<WooProduct | null> {
  const base = getBaseUrl();
  const url = `${base}/wp-json/wc/v3/products?slug=${encodeURIComponent(slug)}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Basic ${getAuth()}`,
    },
    next: { revalidate: 3600 },
  });
  if (!res.ok) {
    if (res.status === 404) return null;
    throw new Error(`WooCommerce API error: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) return null;
  return data[0] as WooProduct;
}

/**
 * Fetch a single product by SKU. Returns null if not found.
 */
export async function getProductBySku(sku: string): Promise<WooProduct | null> {
  if (!sku?.trim()) return null;
  const base = getBaseUrl();
  const url = `${base}/wp-json/wc/v3/products?sku=${encodeURIComponent(sku.trim())}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Basic ${getAuth()}`,
    },
    next: { revalidate: 3600 },
  });
  if (!res.ok) return null;
  const data = await res.json();
  if (!Array.isArray(data) || data.length === 0) return null;
  return data[0] as WooProduct;
}

/**
 * Get meta value by key (checks both key and _key).
 */
export function getProductMeta(product: WooProduct, key: string): string | null {
  const entry = product.meta_data?.find(
    (m) => m.key === key || m.key === `_${key}`
  );
  return entry?.value ?? null;
}
