import { test, expect } from "@playwright/test";

const roles = [
  { email: "admin@careai.demo", password: "DemoAdmin!2026", expectedUrl: /\/admin/ },
  { email: "pdl@careai.demo", password: "DemoPdl!2026", expectedUrl: /\/admin/ },
  { email: "pflegekraft@careai.demo", password: "DemoPk!2026", expectedUrl: /\/app/ },
  { email: "familie@careai.demo", password: "DemoFam!2026", expectedUrl: /\/family/ },
];

for (const r of roles) {
  test(`login routes ${r.email} to ${String(r.expectedUrl)}`, async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel(/e-?mail/i).fill(r.email);
    await page.getByLabel(/passwort/i).fill(r.password);
    await page.getByRole("button", { name: /anmelden|login/i }).click();
    await expect(page).toHaveURL(r.expectedUrl, { timeout: 15_000 });
  });
}

test("invalid credentials shows error", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel(/e-?mail/i).fill("wrong@careai.demo");
  await page.getByLabel(/passwort/i).fill("wrongpass");
  await page.getByRole("button", { name: /anmelden|login/i }).click();
  await expect(page.getByText(/falsch|ungültig|fehler/i)).toBeVisible({ timeout: 10_000 });
});
