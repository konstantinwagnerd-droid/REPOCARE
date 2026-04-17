# Testing — CareAI

Zwei Ebenen: **Unit-Tests** (Vitest) und **E2E-Tests** (Playwright).

## Setup

```bash
npm install
npx playwright install --with-deps chromium
```

## Unit-Tests (Vitest)

- Konfiguration: `vitest.config.ts`
- Testumgebung: `happy-dom`
- Mocking: `vi.mock()` für DB-/Auth-Abhängigkeiten
- Ordner: `tests/`

```bash
npm run test          # einmal durchlaufen
npm run test:watch    # im Watch-Mode
npm run test:ui       # Vitest UI
```

### Neue Unit-Tests schreiben
1. Datei in `tests/<bereich>/<name>.test.ts`
2. Keine echten DB- oder Netzwerk-Aufrufe — mit `vi.mock()` isolieren
3. Arrange-Act-Assert-Pattern
4. Deutscher Testname ist erlaubt (wird über `describe` gruppiert)

Beispiel: `tests/lib/rbac.test.ts`.

## E2E-Tests (Playwright)

- Konfiguration: `playwright.config.ts`
- Browser: Chromium + Firefox + Mobile Pixel 7
- Ordner: `e2e/`
- Automatisches Starten des Dev-Servers oder gegen `$PLAYWRIGHT_BASE_URL`

```bash
npm run test:e2e                      # alle
npm run test:a11y                     # nur Accessibility
npm run test:lighthouse               # nur Performance-Smoke
npx playwright test --ui              # interaktiv
npx playwright test e2e/login.spec.ts # einzeln
```

### E2E-Demo-User
| Rolle        | Mail                        | Passwort        |
|--------------|-----------------------------|-----------------|
| Admin        | admin@careai.demo           | DemoAdmin!2026  |
| PDL          | pdl@careai.demo             | DemoPdl!2026    |
| Pflegekraft  | pflegekraft@careai.demo     | DemoPk!2026     |
| Angehörige:r | familie@careai.demo         | DemoFam!2026    |

### Accessibility
`e2e/a11y.spec.ts` fährt 10 Marketing-Seiten mit `@axe-core/playwright`
gegen WCAG 2.2 AA ab. Fehler werden als `expect.soft` reportet (blockiert
den Build nicht, erzeugt aber Evidenz).

### Performance
`e2e/lighthouse.spec.ts` speichert Ergebnis unter `docs/lighthouse.json`.
Volle Lighthouse-Runs laufen zusätzlich im CI (`lhci` empfohlen).

## Coverage

```bash
npx vitest run --coverage
```
Bericht unter `coverage/index.html`.

## CI

`.github/workflows/ci.yml` — Matrix aus `lint`, `typecheck`, `test`, `build`.
E2E läuft optional (Secret `RUN_E2E=true`).
