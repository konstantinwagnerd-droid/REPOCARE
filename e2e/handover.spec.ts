import { test, expect } from "@playwright/test";

test("Schichtbericht / Handover generieren", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel(/e-?mail/i).fill("pdl@careai.demo");
  await page.getByLabel(/passwort/i).fill("DemoPdl!2026");
  await page.getByRole("button", { name: /anmelden|login/i }).click();

  await page.goto("/app/handover");
  await page.getByRole("button", { name: /generieren|erstellen/i }).click();
  await expect(page.getByText(/schichtbericht|übergabe/i)).toBeVisible({ timeout: 15_000 });
});
