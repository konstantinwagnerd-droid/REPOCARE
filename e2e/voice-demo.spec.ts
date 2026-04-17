import { test, expect } from "@playwright/test";

test("Voice-Demo: Mock-Transkription-Flow", async ({ page }) => {
  await page.route("**/api/voice/transcribe", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        transcript: "Frau Testbewohner hat heute gut gegessen.",
        confidence: 0.94,
        durationMs: 3200,
      }),
    });
  });

  await page.goto("/login");
  await page.getByLabel(/e-?mail/i).fill("pflegekraft@careai.demo");
  await page.getByLabel(/passwort/i).fill("DemoPk!2026");
  await page.getByRole("button", { name: /anmelden|login/i }).click();

  await page.goto("/app/voice");
  await page.getByRole("button", { name: /aufnahme|record/i }).click();
  await page.waitForTimeout(500);
  await page.getByRole("button", { name: /stopp|stop/i }).click();

  await expect(page.getByText(/gut gegessen/i)).toBeVisible({ timeout: 10_000 });
});
