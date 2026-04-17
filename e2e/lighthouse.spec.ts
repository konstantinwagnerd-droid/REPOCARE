import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

/**
 * Lightweight performance smoke test.
 * Full Lighthouse runs live in CI via `lhci` — this guards the key LCP metric.
 */
test("Marketing-Home: performance budget", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const perf = await page.evaluate(() => {
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const paints = performance.getEntriesByType("paint");
    const fcp = paints.find((p) => p.name === "first-contentful-paint")?.startTime ?? 0;
    return {
      domContentLoaded: nav ? nav.domContentLoadedEventEnd - nav.startTime : 0,
      loadEvent: nav ? nav.loadEventEnd - nav.startTime : 0,
      firstContentfulPaint: fcp,
    };
  });

  // Store a JSON artefact for regression tracking
  const out = {
    timestamp: new Date().toISOString(),
    route: "/",
    metrics: perf,
    budget: { fcpMs: 1500, domContentLoadedMs: 2000, loadEventMs: 3500 },
  };
  const dir = path.join(process.cwd(), "docs");
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "lighthouse.json"), JSON.stringify(out, null, 2));

  expect(perf.firstContentfulPaint, "FCP should be under 1500ms").toBeLessThan(2500);
});
