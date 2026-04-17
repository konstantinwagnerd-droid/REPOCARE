# CareAI Smoke-Tests

**Ziel:** Nach jedem Deploy in unter 2 Minuten verifizieren, dass die kritischen User-Flows funktionieren.

## Philosophie

Smoke-Tests sind **keine** E2E-Tests.
- E2E = "alle Features korrekt"
- Smoke = "App laeuft ueberhaupt, Login geht, DB-Verbindung steht"

Wenn Smoke-Tests fehlschlagen: **sofortiger Rollback**.

## Test-Suite (6 Specs)

| Spec | Was wird getestet | Typische Dauer |
|---|---|---|
| `smoke-api-health.spec.ts` | `/api/health` + `/api/health/ready` liefern 200 | < 1s |
| `smoke-auth.spec.ts` | Login-Seite laedt, Login + Logout-Flow | ~5s |
| `smoke-dashboard.spec.ts` | Dashboard rendert, Navigation sichtbar | ~3s |
| `smoke-bewohner.spec.ts` | Liste laedt, Detail oeffnet, SIS-Tab existiert | ~5s |
| `smoke-pdf-export.spec.ts` | PDF-Endpoint liefert `application/pdf` mit `%PDF`-Header | ~3s |
| `smoke-voice.spec.ts` | `/app/voice` rendert, Mikrofon-Prompt erscheint | ~3s |

## Ausfuehrung

### Lokal gegen Dev
```bash
bash scripts/smoke/run-smoke.sh --base-url http://localhost:3000
```

### Gegen Production
```bash
bash scripts/smoke/run-smoke.sh \
  --base-url https://pflege.kunde.de \
  --user smoke@careai.health \
  --password "$SMOKE_PW"
```

### In CI/CD
Siehe `.github/workflows/deploy.yml` - laeuft automatisch nach jedem Deploy gegen die frisch deployte Prod-URL. Bei Exit-Code != 0 wird der vorherige Release aktiviert (Rollback).

## Exit-Codes

| Code | Bedeutung | CI-Aktion |
|---|---|---|
| 0 | Alles gruen | Deploy final freigeben |
| 1 | Test-Fails | **Rollback** + Alert |
| 2 | Setup-Fehler | Pipeline-Fail, Ops benachrichtigen |

## Neue Smoke-Tests hinzufuegen

**Regeln:**
1. Muss gegen Prod-URL laufbar sein - keine Seeds/Fixtures voraussetzen (sondern skippen)
2. Muss < 10s laufen
3. Darf keinen State veraendern (read-only oder self-undoing)
4. Keine Abhaengigkeit zu anderen Specs

**Template:**
```ts
import { test, expect } from '@playwright/test';
const BASE = process.env.SMOKE_BASE_URL || 'http://localhost:3000';

test('Feature XY erreichbar', async ({ page }) => {
  const res = await page.goto(`${BASE}/app/feature-xy`);
  expect(res?.status()).toBeLessThan(500);
  // Anwesenheits-Check (kein Deep-Check)
  await expect(page.locator('text=/Ueberschrift/').first()).toBeVisible({ timeout: 10000 });
});
```

## Interpretation der Ergebnisse

Der HTML-Report (`smoke-report/html/index.html`) zeigt:
- Rote Tests: Screenshot + Video + Trace
- `Timeout` meist = App zu langsam oder Content-Shift
- `net::ERR_CONNECTION_REFUSED` = URL nicht erreichbar -> Deploy hat nicht ausgeliefert
- `expect(status).toBeLessThan(500)` fail = Server-Error -> Logs pruefen

## FAQ

**Warum Playwright statt Vitest?**
Smoke-Tests muessen echtes HTTP gegen deployte Umgebungen machen. Vitest ist fuer Unit-Tests im Node-Prozess.

**Warum nicht Cypress?**
Playwright ist schneller, hat bessere Multi-Browser-Support und wird im Projekt bereits verwendet.

**Laufen Smoke-Tests in Prod?**
Ja. Deshalb:
- Nur Reads (mit Ausnahme Login - der hinterlegt eine Session, die beim naechsten Test eh neu gebildet wird)
- Kein Seed-Schreib
- Skippable wenn Feature nicht aktiviert
