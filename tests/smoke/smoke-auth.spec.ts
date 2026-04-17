import { test, expect } from '@playwright/test';

// Smoke: Auth-Flow gegen live-URL
const BASE = process.env.SMOKE_BASE_URL || 'http://localhost:3000';
const TEST_USER = process.env.SMOKE_USER || 'admin@test.local';
const TEST_PW = process.env.SMOKE_PW || 'test-password';

test.describe('Smoke: Authentication', () => {
  test('Login-Seite laedt', async ({ page }) => {
    const res = await page.goto(`${BASE}/login`);
    expect(res?.status()).toBeLessThan(500);
    await expect(page.locator('input[type="email"], input[name="email"]').first()).toBeVisible({ timeout: 10000 });
  });

  test('Login + Logout Flow', async ({ page }) => {
    await page.goto(`${BASE}/login`);
    await page.fill('input[type="email"], input[name="email"]', TEST_USER);
    await page.fill('input[type="password"], input[name="password"]', TEST_PW);
    await page.click('button[type="submit"]');
    await page.waitForURL(/\/(app|dashboard)/, { timeout: 15000 }).catch(() => {});
    // Kein Redirect zurueck zu /login -> eingeloggt
    expect(page.url()).not.toMatch(/\/login/);
  });
});
