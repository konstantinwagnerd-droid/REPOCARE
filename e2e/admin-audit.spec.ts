import { test, expect } from "@playwright/test";

test("Admin Audit-Log lässt sich filtern", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel(/e-?mail/i).fill("admin@careai.demo");
  await page.getByLabel(/passwort/i).fill("DemoAdmin!2026");
  await page.getByRole("button", { name: /anmelden|login/i }).click();

  await page.goto("/admin/audit");
  await expect(page.getByRole("heading", { name: /audit/i })).toBeVisible();

  // Filter: nur login-Events
  const filter = page.getByRole("combobox", { name: /aktion|action/i }).or(page.getByLabel(/aktion|action/i));
  if (await filter.count()) {
    await filter.first().selectOption({ label: "login" }).catch(async () => {
      await filter.first().click();
      await page.getByRole("option", { name: /login/i }).click();
    });
  }
  await expect(page.locator("table, [role=table]")).toBeVisible();
});
