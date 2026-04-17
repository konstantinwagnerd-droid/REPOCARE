/**
 * Enable bundle analysis with:
 *    ANALYZE=true npm run build
 *
 * Usage in next.config.ts:
 *    import { withBundleAnalyzer } from "./src/lib/performance/bundle-analyzer.config";
 *    export default withBundleAnalyzer(nextConfig);
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const withBundleAnalyzer = (config: any) => {
  if (process.env.ANALYZE !== "true") return config;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const wrap = require("@next/bundle-analyzer")({ enabled: true, openAnalyzer: false });
    return wrap(config);
  } catch {
    return config;
  }
};
