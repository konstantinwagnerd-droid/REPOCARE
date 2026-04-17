import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const pages = [
  "/",
  "/demo-anfrage",
  "/ueber-uns",
  "/kontakt",
  "/security",
  "/trust",
  "/agb",
  "/impressum",
  "/datenschutz",
  "/login",
];

for (const p of pages) {
  test(`WCAG 2.2 AA — ${p}`, async ({ page }) => {
    await page.goto(p);
    // Wait for content-visible paint
    await page.waitForLoadState("networkidle");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .disableRules(["color-contrast"]) // handled visually; DS enforces it
      .analyze();
    expect.soft(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });
}
