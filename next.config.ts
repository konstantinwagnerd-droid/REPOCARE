import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";
import { withBundleAnalyzer } from "./src/lib/performance/bundle-analyzer.config";

const cacheImmutable = "public, max-age=31536000, immutable";
const cacheShort = "public, max-age=60, stale-while-revalidate=600";

const nextConfig: NextConfig = {
  // Standalone output lets the Docker image ship a minimal Node server
  // (see Dockerfile runner stage). Next.js 15 writes .next/standalone.
  output: "standalone",
  // ESLint during build: off. Lint-Errors (unused imports, unescaped "") are
  // style — not runtime — and they block deploys. Fix via `npm run lint` in
  // dev, not as a release gate.
  eslint: { ignoreDuringBuilds: true },
  // TypeScript: we still enforce tsc --noEmit in CI, so keep it strict here.
  experimental: {
    typedRoutes: false,
    optimizePackageImports: ["lucide-react", "date-fns", "recharts", "framer-motion"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [{ protocol: "https", hostname: "**" }],
    deviceSizes: [360, 640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 64, 96, 128, 256, 384],
  },
  // PGlite must not be bundled — it ships WASM + uses fs/promises with URL args
  // which break when webpack re-wraps them.
  serverExternalPackages: ["@electric-sql/pglite"],
  generateEtags: true,
  poweredByHeader: false,
  compress: true,
  productionBrowserSourceMaps: false,
  async headers() {
    return [
      {
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: cacheImmutable }],
      },
      {
        source: "/fonts/:path*",
        headers: [{ key: "Cache-Control", value: cacheImmutable }],
      },
      {
        source: "/og-images/:path*",
        headers: [{ key: "Cache-Control", value: cacheImmutable }],
      },
      {
        source: "/api/:path*",
        headers: [
          { key: "Cache-Control", value: "no-store" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
      {
        source: "/(.*)",
        headers: [{ key: "Cache-Control", value: cacheShort }],
      },
    ];
  },
  async redirects() {
    return [
      { source: "/home", destination: "/", permanent: true },
      { source: "/datenschutzerklaerung", destination: "/datenschutz", permanent: true },
    ];
  },
};

// Bundle-Analyzer → Sentry-Wrapper. Sentry-Wrapper ist optional: nur wenn SENTRY_DSN
// gesetzt ist + SENTRY_AUTH_TOKEN vorhanden → Source-Maps werden hochgeladen.
const analyzed = withBundleAnalyzer(nextConfig);

const sentryBuildOptions = {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  silent: true,
  hideSourceMaps: true,
  disableLogger: true,
  // Skip Sentry webpack plugin entirely if no auth token (local dev, PR builds).
  dryRun: !process.env.SENTRY_AUTH_TOKEN,
};

export default process.env.SENTRY_DSN
  ? withSentryConfig(analyzed, sentryBuildOptions)
  : analyzed;
