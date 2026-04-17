/**
 * Playwright integration hook for dynamic a11y testing via axe-core.
 *
 * This is a helper, NOT a test spec. Invoke from scripts/a11y-audit-dynamic.mjs
 * when Playwright + @axe-core/playwright are installed.
 *
 * Example usage:
 *   import { chromium } from "playwright";
 *   import AxeBuilder from "@axe-core/playwright";
 *   import { runDynamicAudit } from "@/lib/a11y-audit/playwright-integration";
 *
 *   const browser = await chromium.launch();
 *   const ctx = await browser.newContext();
 *   const results = await runDynamicAudit(ctx, ["http://localhost:3000", "http://localhost:3000/en"]);
 */

export interface DynamicAuditUrl {
  url: string;
  violations: Array<{ id: string; impact: string | null; nodes: number; help: string }>;
  passes: number;
  timestamp: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function runDynamicAudit(context: any, urls: string[]): Promise<DynamicAuditUrl[]> {
  let AxeBuilder: unknown;
  try {
    AxeBuilder = (await import("@axe-core/playwright")).default;
  } catch {
    throw new Error("@axe-core/playwright not installed. Run: npm i -D @axe-core/playwright");
  }
  const results: DynamicAuditUrl[] = [];
  for (const url of urls) {
    const page = await context.newPage();
    await page.goto(url, { waitUntil: "networkidle" });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const axe = new (AxeBuilder as any)({ page });
    const scan = await axe.withTags(["wcag2a", "wcag2aa", "wcag22aa"]).analyze();
    results.push({
      url,
      violations: scan.violations.map((v: { id: string; impact: string | null; nodes: unknown[]; help: string }) => ({
        id: v.id, impact: v.impact, nodes: v.nodes.length, help: v.help,
      })),
      passes: scan.passes.length,
      timestamp: new Date().toISOString(),
    });
    await page.close();
  }
  return results;
}
