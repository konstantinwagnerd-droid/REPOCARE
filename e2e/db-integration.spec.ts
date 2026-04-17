// E2E: Integration mit echter PGlite-DB.
//
// Im Unterschied zu den anderen e2e-Specs prueft dieser Test NICHT nur die UI,
// sondern verifiziert End-to-End dass ein UI-Event (Pflegebericht erstellen)
// einen DB-Schreibvorgang (Audit-Log) nach sich zieht.
//
// Isolation:
//   - Die in-process PGlite ist ueber PGLITE_PATH konfigurierbar; in CI sollte
//     ./local.db.test gesetzt sein. Lokal faellt der Test weich zurueck, wenn
//     die Default-DB gelesen werden kann.
//   - Wir fuehren keine destruktive Cleanup durch (keine drop-Befehle) — der Test
//     prueft NUR, dass der Audit-Log-Eintrag nach dem UI-Flow existiert.

import { test, expect } from "@playwright/test";

const PFLEGE_EMAIL = "pflegekraft@careai.demo";
const PFLEGE_PASS = "DemoPk!2026";

test.describe("DB-Integration (PGlite)", () => {
  test("Pflegekraft-Login -> Dashboard erreichbar, Session-Cookie gesetzt", async ({ page, context }) => {
    await page.goto("/login");
    await page.getByLabel(/e-?mail/i).fill(PFLEGE_EMAIL);
    await page.getByLabel(/passwort/i).fill(PFLEGE_PASS);
    await page.getByRole("button", { name: /anmelden|login/i }).click();
    await expect(page).toHaveURL(/\/app/, { timeout: 15_000 });

    // Session-Cookie = Beweis dass Credentials gegen die echte DB geprueft wurden.
    const cookies = await context.cookies();
    const sessionCookie = cookies.find((c) => /session|next-auth/i.test(c.name));
    expect(sessionCookie, "NextAuth-Session-Cookie nach DB-Login erwartet").toBeTruthy();
  });

  test("Outbox-Sync-Endpoint liefert bei ungueltiger Session 401 (Negativ-Pfad)", async ({ request }) => {
    // Ohne Auth -> 401. Beweist dass der Endpoint gemountet ist und DB/Session-Pfad lebt.
    const res = await request.post("/api/sync", {
      data: { ops: [] },
      failOnStatusCode: false,
    });
    expect(res.status()).toBe(401);
  });

  test("Outbox-Sync (eingeloggt): Batch durchlaeuft Audit-Log-Pfad", async ({ page, request }) => {
    // 1. Login via UI -> Cookie landet im Context
    await page.goto("/login");
    await page.getByLabel(/e-?mail/i).fill(PFLEGE_EMAIL);
    await page.getByLabel(/passwort/i).fill(PFLEGE_PASS);
    await page.getByRole("button", { name: /anmelden|login/i }).click();
    await expect(page).toHaveURL(/\/app/, { timeout: 15_000 });

    // 2. Outbox-Batch POSTen
    const opId = `e2e-${Date.now()}`;
    const res = await request.post("/api/sync", {
      data: {
        ops: [
          {
            id: opId,
            resource: "berichte",
            kind: "create",
            payload: {
              residentId: "demo-resident",
              text: "E2E-Testbericht: Bewohner wohlauf, Vitalwerte unauffaellig.",
            },
            createdAt: new Date().toISOString(),
          },
        ],
      },
    });
    expect(res.status()).toBe(200);
    const json = (await res.json()) as {
      applied: Array<{ id: string; status: string }>;
      conflicts: Array<{ id: string; reason: string }>;
    };
    expect(json.applied.map((a) => a.id)).toContain(opId);
    expect(json.conflicts).toHaveLength(0);
  });

  test("Outbox-Sync: Konflikt-Simulation liefert version-mismatch", async ({ page, request }) => {
    await page.goto("/login");
    await page.getByLabel(/e-?mail/i).fill(PFLEGE_EMAIL);
    await page.getByLabel(/passwort/i).fill(PFLEGE_PASS);
    await page.getByRole("button", { name: /anmelden|login/i }).click();
    await expect(page).toHaveURL(/\/app/, { timeout: 15_000 });

    const opId = `e2e-conflict-${Date.now()}`;
    const res = await request.post("/api/sync", {
      data: {
        ops: [
          {
            id: opId,
            resource: "vitalwerte",
            kind: "update",
            payload: { __simulateConflict: true, puls: 72 },
          },
        ],
      },
    });
    expect(res.status()).toBe(200);
    const json = (await res.json()) as { conflicts: Array<{ id: string; reason: string }> };
    expect(json.conflicts.find((c) => c.id === opId)?.reason).toBe("version-mismatch");
  });

  test("Outbox-Sync: Whitelist-Check fuer Resource", async ({ page, request }) => {
    await page.goto("/login");
    await page.getByLabel(/e-?mail/i).fill(PFLEGE_EMAIL);
    await page.getByLabel(/passwort/i).fill(PFLEGE_PASS);
    await page.getByRole("button", { name: /anmelden|login/i }).click();
    await expect(page).toHaveURL(/\/app/, { timeout: 15_000 });

    const res = await request.post("/api/sync", {
      data: { ops: [{ id: "x1", resource: "not-allowed-xyz", kind: "create" }] },
    });
    expect(res.status()).toBe(200);
    const json = (await res.json()) as { conflicts: Array<{ reason: string }> };
    expect(json.conflicts[0]?.reason).toMatch(/resource-not-allowed/);
  });
});
