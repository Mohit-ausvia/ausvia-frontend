# AUSVIA Frontend

Next.js 14 (App Router) + TypeScript + Tailwind CSS. Phase 0 foundation.

## Setup

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment**

   Copy `.env.local` and fill in values (see `.env.local` for variable names). Leave empty for local dev; cart count will show 0 and Georgia API calls will fail until URLs/keys are set.

3. **Run**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000). You should see "AUSVIA" on a dark background with Header and Footer. Cart count shows 0 when Woo is not configured.

## Verify build

```bash
npm run build
```

TypeScript must compile with no errors. Header and Footer render; cart count renders without error (0 is fine when `WOO_STORE_API_URL` is unset).

## Phase 0 contents

- **Design tokens:** `tailwind.config.ts` (base, teal, gold, textPrimary, etc.)
- **Config:** `next.config.ts` — WP media `remotePatterns`; Woo rewrite placeholder comment
- **Lib:** `lib/georgia-api.ts`, `lib/woo-store-api.ts`, `lib/safety-params.ts`
- **App shell:** `app/layout.tsx`, `components/layout/Header.tsx`, `components/layout/Footer.tsx`
- **Test page:** `app/page.tsx` — "AUSVIA" on dark background
