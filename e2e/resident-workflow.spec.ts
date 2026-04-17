import { test, expect } from "@playwright/test";

test.describe("Bewohner-Workflow (Pflegekraft)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/e-?mail/i).fill("pflegekraft@careai.demo");
    await page.getByLabel(/passwort/i).fill("DemoPk!2026");
    await page.getByRole("button", { name: /anmelden|login/i }).click();
    await expect(page).toHaveURL(/\/app/);
  });

  test("Bewohner anlegen → SIS erfassen → Bericht schreiben", async ({ page }) => {
    // Bewohner anlegen
    await page.goto("/app/residents/new");
    await page.getByLabel(/vorname/i).fill("Anna");
    await page.getByLabel(/nachname/i).fill("Testbewohner");
    await page.getByLabel(/geburt/i).fill("1940-05-12");
    await page.getByRole("button", { name: /speichern|anlegen/i }).click();
    await expect(page.getByText(/anna testbewohner/i)).toBeVisible();

    // SIS erfassen
    await page.getByRole("link", { name: /sis/i }).click();
    await page.getByRole("button", { name: /neuer eintrag|erfassen/i }).click();
    await page.getByRole("textbox").first().fill("Aufnahme-SIS-Eintrag");
    await page.getByRole("button", { name: /speichern/i }).click();

    // Bericht schreiben
    await page.getByRole("link", { name: /bericht/i }).click();
    await page.getByRole("textbox", { name: /beobachtung|inhalt/i }).fill("Wohlbefinden stabil.");
    await page.getByRole("button", { name: /speichern/i }).click();
    await expect(page.getByText(/wohlbefinden stabil/i)).toBeVisible();
  });
});
