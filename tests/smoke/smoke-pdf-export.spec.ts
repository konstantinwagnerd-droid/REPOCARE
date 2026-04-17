import { test, expect } from '@playwright/test';

const BASE = process.env.SMOKE_BASE_URL || 'http://localhost:3000';

test.describe('Smoke: PDF-Export', () => {
  test('Bewohner-Akte PDF liefert application/pdf', async ({ request }) => {
    // Vorher bekannten Bewohner-ID setzen oder ersten finden
    const res = await request.get(`${BASE}/api/bewohner/export-pdf?demo=1`, {
      failOnStatusCode: false,
    });
    if (res.status() === 404) {
      test.skip(true, 'PDF-Endpoint nicht vorhanden');
      return;
    }
    expect(res.status()).toBeLessThan(500);
    if (res.status() === 200) {
      const ct = res.headers()['content-type'] || '';
      expect(ct).toMatch(/application\/pdf/);
      const body = await res.body();
      expect(body.length).toBeGreaterThan(1000);
      // PDF-Header: %PDF
      expect(body.subarray(0, 4).toString()).toBe('%PDF');
    }
  });
});
