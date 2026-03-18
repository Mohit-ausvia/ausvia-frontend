import { withSentryConfig } from "@sentry/nextjs";

const wooHost =
  typeof process.env.NEXT_PUBLIC_WOO_URL === "string" && process.env.NEXT_PUBLIC_WOO_URL
    ? new URL(process.env.NEXT_PUBLIC_WOO_URL).hostname
    : "placeholder.example.com";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: process.env.WP_MEDIA_DOMAIN || "placeholder.example.com",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "http",
        hostname: process.env.WP_MEDIA_DOMAIN || "placeholder.example.com",
        pathname: "/wp-content/uploads/**",
      },
      { protocol: "https", hostname: wooHost, pathname: "/**" },
      { protocol: "http", hostname: wooHost, pathname: "/**" },
    ],
  },
  // WooCommerce proxy rewrite — add real rewrite after domain decision is confirmed
  // async rewrites() {
  //   return [{ source: '/api/wc/:path*', destination: `${process.env.WOO_STORE_API_URL}/:path*` }];
  // },
};

const sentryDsn = process.env.NEXT_PUBLIC_SENTRY_DSN?.trim();
export default sentryDsn
  ? withSentryConfig(nextConfig, {
      org: process.env.SENTRY_ORG ?? "",
      project: process.env.SENTRY_PROJECT ?? "",
      silent: true,
      widenClientFileUpload: true,
      hideSourceMaps: true,
      disableLogger: true,
    })
  : nextConfig;
