/**
 * Typed wrapper for Georgia API. Server-side only. Base URL from GEORGIA_API_URL.
 * X-API-Key from GEORGIA_API_KEY. All calls use cache: 'no-store'.
 */

export type SafetyParams = {
  pregnancy: boolean;
  breastfeeding: boolean;
  child: boolean;
  sensitive: boolean;
};

function getBaseUrl(): string {
  const url = process.env.GEORGIA_API_URL;
  if (!url || url === "") {
    throw new GeorgiaError("GEORGIA_API_URL is not set");
  }
  return url.replace(/\/$/, "");
}

function getHeaders(): HeadersInit {
  const key = process.env.GEORGIA_API_KEY;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Cache: "no-store",
  };
  if (key && key !== "") {
    (headers as Record<string, string>)["X-API-Key"] = key;
  }
  return headers;
}

export class GeorgiaError extends Error {
  constructor(
    message: string,
    public status?: number,
    public body?: string
  ) {
    super(message);
    this.name = "GeorgiaError";
  }
}

async function fetchGeorgia(
  path: string,
  searchParams?: Record<string, string | number | boolean | undefined>
): Promise<Response> {
  const base = getBaseUrl();
  const url = new URL(path, base);
  if (searchParams) {
    for (const [k, v] of Object.entries(searchParams)) {
      if (v !== undefined && v !== "") {
        url.searchParams.set(k, String(v));
      }
    }
  }
  const res = await fetch(url.toString(), {
    headers: getHeaders(),
    cache: "no-store",
  });
  if (!res.ok) {
    const body = await res.text();
    throw new GeorgiaError(
      `Georgia API error: ${res.status} ${res.statusText}`,
      res.status,
      body
    );
  }
  return res;
}

// --- Payload types (minimal for Phase 0) ---

export type GeorgiaPayloadParams = {
  vertical?: string;
  primary_concern?: string;
  goal_tags?: string[];
  life_stage_primary?: string;
  anchor_sku?: string;
  pregnancy?: boolean;
  breastfeeding?: boolean;
  child?: boolean;
  sensitive?: boolean;
  product_limit?: number;
  combo_limit?: number;
  cross_limit?: number;
};

export type GeorgiaPayload = {
  primary_products: unknown[];
  same_vertical_pairs: unknown[];
  cross_vertical_stacks: unknown[];
  metadata: Record<string, unknown>;
};

export type GeorgiaRecommendParams = {
  vertical?: string;
  primary_concern?: string;
  goal_tags?: string[];
  life_stage_primary?: string;
  pregnancy?: boolean;
  breastfeeding?: boolean;
  child?: boolean;
  sensitive?: boolean;
  product_limit?: number;
};

export type GeorgiaRecommendResult = {
  products: unknown[];
  count: number;
};

export type GeorgiaPairsResult = {
  anchor_sku: string;
  pairs: unknown[];
  count: number;
};

export type GeorgiaStacksResult = {
  anchor_sku: string;
  stacks: unknown[];
  count: number;
};

export type QuizCompleteBody = {
  user_id: string;
  vertical?: string;
  primary_concern?: string;
  life_stage_primary?: string;
  pregnancy?: boolean;
  breastfeeding?: boolean;
  child?: boolean;
  sensitive?: boolean;
  [key: string]: unknown;
};

export type ScanCompleteBody = {
  user_id: string;
  internal_sku: string;
  [key: string]: unknown;
};

function safetyToParams(safety: SafetyParams): Record<string, string> {
  return {
    pregnancy: safety.pregnancy ? "true" : "false",
    breastfeeding: safety.breastfeeding ? "true" : "false",
    child: safety.child ? "true" : "false",
    sensitive: safety.sensitive ? "true" : "false",
  };
}

export async function getPayload(params: GeorgiaPayloadParams & { safety?: SafetyParams }): Promise<GeorgiaPayload> {
  const safety = params.safety ?? {
    pregnancy: false,
    breastfeeding: false,
    child: false,
    sensitive: false,
  };
  const q: Record<string, string | number | boolean | undefined> = {
    ...safetyToParams(safety),
    vertical: params.vertical,
    primary_concern: params.primary_concern,
    life_stage_primary: params.life_stage_primary,
    anchor_sku: params.anchor_sku,
    product_limit: params.product_limit,
    combo_limit: params.combo_limit,
    cross_limit: params.cross_limit,
  };
  if (params.goal_tags?.length) {
    q.goal_tags = params.goal_tags.join(",");
  }
  const res = await fetchGeorgia("/georgia/payload", q);
  return res.json();
}

export async function getRecommend(
  params: GeorgiaRecommendParams & { safety?: SafetyParams }
): Promise<GeorgiaRecommendResult> {
  const safety = params.safety ?? {
    pregnancy: false,
    breastfeeding: false,
    child: false,
    sensitive: false,
  };
  const q: Record<string, string | number | boolean | undefined> = {
    ...safetyToParams(safety),
    vertical: params.vertical,
    primary_concern: params.primary_concern,
    life_stage_primary: params.life_stage_primary,
    product_limit: params.product_limit,
  };
  if (params.goal_tags?.length) {
    q.goal_tags = params.goal_tags.join(",");
  }
  const res = await fetchGeorgia("/georgia/recommend", q);
  return res.json();
}

export async function getPairs(
  anchorSku: string,
  safetyParams: SafetyParams
): Promise<GeorgiaPairsResult> {
  const res = await fetchGeorgia("/georgia/pairs", {
    anchor_sku: anchorSku,
    ...safetyToParams(safetyParams),
  });
  return res.json();
}

export async function getStacks(
  anchorSku: string,
  safetyParams: SafetyParams
): Promise<GeorgiaStacksResult> {
  const res = await fetchGeorgia("/georgia/stacks", {
    anchor_sku: anchorSku,
    ...safetyToParams(safetyParams),
  });
  return res.json();
}

export async function postQuizComplete(body: QuizCompleteBody): Promise<void> {
  const base = getBaseUrl();
  const res = await fetch(`${base}/profile/quiz-complete`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new GeorgiaError(`quiz-complete failed: ${res.status}`, res.status, text);
  }
}

export async function postScanComplete(body: ScanCompleteBody): Promise<void> {
  const base = getBaseUrl();
  const res = await fetch(`${base}/profile/scan-complete`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(body),
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new GeorgiaError(`scan-complete failed: ${res.status}`, res.status, text);
  }
}
