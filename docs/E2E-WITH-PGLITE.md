# E2E-Tests mit PGlite

Die Playwright-Specs im Ordner `e2e/` sprechen gegen einen laufenden Next.js-Server.
Dieser Server nutzt lokal eine **in-process PGlite** als Postgres-kompatible DB
(`@electric-sql/pglite`). Das heisst: jeder E2E-Test trifft in Wirklichkeit einen
echten DB-Zustand — aus demselben Prozess wie die App.

## Setup

1. **Abhaengigkeiten**: bereits in `package.json` vorhanden — `@playwright/test`, `@electric-sql/pglite`.
2. **Browser-Binaries**: einmalig `npx playwright install` (falls noch nicht geschehen).
3. **Seed**: `npm run db:seed` (oder der Bootstrap in `src/db/bootstrap.ts`, der bei erstem Zugriff automatisch laeuft).
4. **DB-Pfad**: Default = `./local.db`. Fuer Isolation:
   ```bash
   PGLITE_PATH=./local.db.test npm run dev
   PGLITE_PATH=./local.db.test npx playwright test e2e/db-integration.spec.ts
   ```

## Die neue Spec: `e2e/db-integration.spec.ts`

Im Unterschied zu den anderen E2E-Specs, die sich ueberwiegend auf UI-Assertions
beschraenken, prueft die `db-integration.spec.ts` auch Seiteneffekte gegen die echte DB:

| Test                               | Was wird geprueft                                                                  |
|------------------------------------|------------------------------------------------------------------------------------|
| Pflegekraft-Login -> Dashboard     | Credentials werden gegen `users` in PGlite geprueft, Session-Cookie gesetzt.       |
| `/api/sync` ohne Session → 401     | Endpoint gemountet, Auth-Pfad aktiv.                                               |
| `/api/sync` mit Session → Audit    | Batch-Write legt Audit-Log-Eintraege an (im selben PGlite-Prozess lesbar).         |
| Konflikt-Simulation                | `__simulateConflict` → Response markiert Op als `version-mismatch`.                |
| Resource-Whitelist                 | Unbekannte Resource → Response markiert Op als `resource-not-allowed`.             |

## Welche Tests eignen sich fuer "echte DB"?

| Kategorie                          | DB wirklich noetig?              | Empfehlung                         |
|------------------------------------|----------------------------------|------------------------------------|
| Login / Auth                       | Ja — Password-Hash-Abgleich      | echte DB                           |
| Audit-Log-Schreibvorgaenge         | Ja — sonst unverifizierbar       | echte DB                           |
| RBAC-Pfade                         | Ja — role aus `users` kommt      | echte DB                           |
| Pures UI-Rendering                 | Nein                             | mocken ok                          |
| Lighthouse / a11y                  | Nein                             | mocken ok                          |

## Isolations-Strategie

Da PGlite **in-process** laeuft, gibt es zwei saubere Optionen:

1. **Separate DB-Datei pro Run**: `PGLITE_PATH=./local.db.test` (empfohlen fuer CI).
2. **Ephemere Memory-DB**: `PGLITE_PATH=memory://` — verliert den Seed-Zustand.
   Nur sinnvoll mit einem `beforeAll`-Seed-Skript.

Fuer Runs gegen die Standard-DB gilt: **keine destruktiven Operationen** im Testflow.
Die aktuelle Spec nutzt nur Audit-Log-Schreibvorgaenge mit eindeutigen Test-IDs —
idempotent und kollisionsfrei.

## Cleanup

- **Lokal**: `rm ./local.db.test-*` nach jedem Run (oder `.gitignore`-Eintrag).
- **CI**: Cache-Key auf Commit-SHA binden, nach Run verwerfen.

Eine automatische Rollback-Logik pro Test (SAVEPOINT / TRANSACTION) ist aktuell nicht
aktiv — PGlite unterstuetzt Transactions, aber die Next.js-Route-Handlers muessten dann
in denselben Transaction-Scope eingebunden werden, was die TABU-Zone `src/db/` beruehrt.

## CI-Integration

`playwright.config.ts` faehrt in CI mit `npm run build && npm run start`.
Fuer die neue Spec empfiehlt sich ein separater CI-Job:

```yaml
- name: E2E DB Integration
  env:
    PGLITE_PATH: ./local.db.test
  run: |
    npm run db:seed
    npx playwright test e2e/db-integration.spec.ts --project=chromium
```

So bleiben die bestehenden E2E-Runs unveraendert, und der DB-lastige Test laeuft isoliert.

## Bekannte Gotchas

- Der Test geht davon aus, dass der Seed die Demo-User (`pflegekraft@careai.demo`) angelegt hat.
  Wenn `db:seed` fehlt, liefert `/login` 401 und der Test faellt mit Timeout.
- In parallelen Workern (`fullyParallel: true`) konkurrieren alle Tests um denselben DB-File.
  Fuer die DB-Spec ggf. `test.describe.configure({ mode: "serial" })` setzen, falls Flakes auftreten.
- Der `/api/sync`-Endpoint ist aktuell ein **Mock** (nur Audit-Log, keine Domain-Writes).
  Sobald die realen Domain-Writes folgen, muss die Spec um `select *` Assertions gegen `berichte`, `vitalwerte`, etc. erweitert werden.
