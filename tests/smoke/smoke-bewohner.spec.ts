import { test, expect } from '@playwright/test';

const BASE = process.env.SMOKE_BASE_URL || 'http://localhost:3000';

test.describe('Smoke: Bewohner', () => {
  test('Bewohner-Liste laedt', async ({ page }) => {
    const res = await page.goto(`${BASE}/app/bewohner`);
    expect(res?.status()).toBeLessThan(500);
    // Liste oder Leer-Zustand vorhanden
    const hasContent = await page.locator('table, [role="list"], [data-testid="bewohner-list"], text=/Keine Bewohner/i').first().isVisible({ timeout: 10000 }).catch(() => false);
    expect(hasContent).toBeTruthy();
  });

  test('Bewohner-Detail oeffnet (falls vorhanden)', async ({ page }) => {
    await page.goto(`${BASE}/app/bewohner`);
    const firstRow = page.locator('table tbody tr a, [data-testid="bewohner-item"]').first();
    const visible = await firstRow.isVisible({ timeout: 5000 }).catch(() => false);
    if (!visible) {
      test.skip(true, 'Keine Bewohner im System - Detail-Test uebersprungen');
      return;
    }
    await firstRow.click();
    await page.waitForURL(/\/app\/bewohner\/[^/]+/, { timeout: 10000 });
    // SIS-Tab sollte vorhanden sein
    const sisTab = page.locator('text=/SIS|Informationssammlung/i').first();
    await expect(sisTab).toBeVisible({ timeout: 10000 });
  });
});
