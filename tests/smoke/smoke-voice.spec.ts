import { test, expect } from '@playwright/test';

const BASE = process.env.SMOKE_BASE_URL || 'http://localhost:3000';

test.describe('Smoke: Voice', () => {
  test('/app/voice rendert', async ({ page, context }) => {
    await context.grantPermissions(['microphone']);
    const res = await page.goto(`${BASE}/app/voice`);
    if (res?.status() === 404) {
      test.skip(true, '/app/voice nicht aktiviert');
      return;
    }
    expect(res?.status()).toBeLessThan(500);
    // UI erwartet: Mikrofon-Button oder Recording-Hinweis
    const mic = page.locator('button[aria-label*="ikrofon" i], button[aria-label*="ecord" i], [data-testid="mic-button"]').first();
    await expect(mic).toBeVisible({ timeout: 10000 });
  });
});
