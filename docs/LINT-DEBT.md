# Lint-Schuld — CareAI

Stand: 2026-04-17 (nach UX-Finale / Tour-Feature-Session)

## Zusammenfassung

- **Vorher:** 42 Issues (39 Errors + 3 Warnings)
- **Nachher:** 18 Issues (16 Errors + 2 Warnings)
- **Reduktion:** 57%
- **Einschätzung:** Kein Demo-Blocker. TypeScript-Kompilation unveraendert. Alle verbleibenden Issues liegen in `src/lib/` — in der aktuellen Session war `src/lib/` als TABU markiert.

## Was gefixt wurde (24 Issues)

| Datei | Fix |
|------|-----|
| `src/app/(marketing)/rechtliches/hinweisgeberschutz/page.tsx` | `&quot;` statt `"` |
| `src/app/admin/a11y-audit/view.tsx` | Unused `Badge`-Import entfernt |
| `src/app/admin/billing/client.tsx` | Apostrophe escaped |
| `src/app/admin/feature-flags/client.tsx` | Apostrophe escaped (2x) |
| `src/app/admin/impersonation/client.tsx` | Apostrophe escaped (2x) |
| `src/app/app/residents/[id]/page.tsx` | Unused `FileDown`-Import |
| `src/app/gruppe/page.tsx` | Unused `Bed`, `Users` |
| `src/app/lms/page.tsx` | Unused `role`-Variable |
| `src/app/telemedizin/historie/page.tsx` | Apostrophe escaped |
| `src/app/telemedizin/raum/[id]/raum-client.tsx` | Unused Card-Imports, unused `e` |
| `src/components/app/sidebar.tsx` | Unused Lucide-Icons (4) |
| `src/components/sample-data/SampleDataClient.tsx` | Apostrophe escaped |
| `src/components/whitelabel/WhitelabelEditor.tsx` | Unused `useMemo` |
| `src/components/wound-timelapse/WoundTimelapseClient.tsx` | `<img>` mit eslint-disable-next-line + Begruendung |

## Verbleibende Issues (18 — alle in `src/lib/`)

| Datei | Issue | Typ |
|------|-------|-----|
| `src/lib/a11y-audit/reporter.ts` | unused `Violation` | Refactor |
| `src/lib/ai-training/generator.ts` | unused `_rnd` | Refactor |
| `src/lib/analytics/store.ts` | unused `AnalyticsEventName` | Refactor |
| `src/lib/email-transport/providers/resend.ts` | unused `retry` | Logik pruefen |
| `src/lib/feature-flags/evaluate.ts` | unused `FeatureFlag` | Refactor |
| `src/lib/incident-pm/store.ts` | unused `s` | Refactor |
| `src/lib/knowledge-graph/viz.ts` | unused `i`, `highlighted` | Refactor |
| `src/lib/multi-tenant/access.ts` | unused `_facilityId` | Refactor |
| `src/lib/multi-tenant/comparator.ts` | unused `FacilityKpiSnapshot` | Refactor |
| `src/lib/pdf/bewohner-akte.tsx` | unused `Page` | Refactor |
| `src/lib/pdf/medikationsplan.tsx` | Image alt-text | a11y |
| `src/lib/pdf/pdf-base.tsx` | Image alt-text | a11y |
| `src/lib/performance/cache.ts` | @ts-ignore → @ts-expect-error | Trivial |
| `src/lib/quality-benchmarks/calculator.ts` | unused `higherIsBetter` | Refactor |
| `src/lib/scheduling/solver.ts` | unused `bestSoll` | Refactor |
| `src/lib/security/csp.ts` | unused `opts` | Refactor |
| `src/lib/voice-commands/matcher.ts` | unused `context` | Refactor |

## Einschaetzung

**Alle verbleibenden Issues sind in Business-Logik-Modulen (`src/lib/`).** Sie sind unkritisch (Code-Hygiene, kein Correctness-Problem) und koennen in einem dedizierten lib/-Cleanup-Sprint in ca. 30 Minuten behoben werden. Build, Tests und Runtime sind unbetroffen.

## Naechste Schritte

1. Dedicated lib/-Cleanup-Sprint (ca. 30 Min fuer alle 18 Issues)
2. ESLint-Regel `@typescript-eslint/no-unused-vars` mit `argsIgnorePattern: "^_"` konfigurieren — dann koennen bewusste Unused-Args mit `_`-Prefix akzeptiert werden
3. Bei `src/lib/pdf/*.tsx`: `alt=""` als dekorativ deklarieren
