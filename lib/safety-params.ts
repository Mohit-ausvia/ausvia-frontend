/**
 * Safety filter params for Georgia API. Missing or null cookie values default to false.
 * A missing cookie is not a signal the filter should apply — it means unknown, default to false.
 */

export type SafetyParams = {
  pregnancy: boolean;
  breastfeeding: boolean;
  child: boolean;
  sensitive: boolean;
};

const COOKIE_PREFIX = "ausvia_safety_";
const KEYS: (keyof SafetyParams)[] = ["pregnancy", "breastfeeding", "child", "sensitive"];

function parseBool(value: string | undefined): boolean {
  if (value == null || value === "") return false;
  const v = value.trim().toLowerCase();
  return v === "true" || v === "1" || v === "yes";
}

/** Cookie store shape (e.g. from next/headers cookies()). */
export type CookieStore = {
  get(name: string): { value: string } | undefined;
};

/**
 * Read safety params from request cookies. Missing or null → false.
 */
export function getSafetyFromCookies(cookies: CookieStore): SafetyParams {
  const out: SafetyParams = {
    pregnancy: false,
    breastfeeding: false,
    child: false,
    sensitive: false,
  };
  for (const key of KEYS) {
    const val = cookies.get(`${COOKIE_PREFIX}${key}`)?.value;
    out[key] = parseBool(val);
  }
  return out;
}

/**
 * Set safety params as cookies. Use in Server Actions or route handlers with a cookie store.
 */
export function setSafetyCookies(
  params: SafetyParams,
  cookieStore: { set: (name: string, value: string, options?: Record<string, unknown>) => void }
): void {
  for (const key of KEYS) {
    cookieStore.set(`${COOKIE_PREFIX}${key}`, params[key] ? "true" : "false", {
      path: "/",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
    });
  }
}
