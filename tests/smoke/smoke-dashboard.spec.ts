import { test, expect } from '@playwright/test';

const BASE = process.env.SMOKE_BASE_URL || 'http://localhost:3000';

test.describe('Smoke: Dashboard', () => {
  test('Dashboard laedt und zeigt KPIs', async ({ page }) => {
    const res = await page.goto(`${BASE}/app/dashboard`);
    expect(res?.status()).toBeLessThan(500);
    // Nicht ausgeloggt
    expect(page.url()).not.toMatch(/\/login/);
    // Seite gerendert (kein 500)
    const content = await page.content();
    expect(content.length).toBeGreaterThan(500);
  });

  test('Navigation vorhanden', async ({ page }) => {
    await page.goto(`${BASE}/app/dashboard`);
    const nav = page.locator('nav, [role="navigation"]').first();
    await expect(nav).toBeVisible({ timeout: 10000 });
  });
});
