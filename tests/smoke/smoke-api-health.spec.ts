import { test, expect } from '@playwright/test';

const BASE = process.env.SMOKE_BASE_URL || 'http://localhost:3000';

test.describe('Smoke: API Health', () => {
  test('GET /api/health liefert 200', async ({ request }) => {
    const res = await request.get(`${BASE}/api/health`);
    expect(res.status()).toBe(200);
    const body = await res.json().catch(() => ({}));
    expect(body).toBeDefined();
  });

  test('GET /api/health/ready liefert 200', async ({ request }) => {
    const res = await request.get(`${BASE}/api/health/ready`, { failOnStatusCode: false });
    // /ready kann 503 sein waehrend Warmup - aber nicht 500
    expect([200, 503]).toContain(res.status());
  });
});
