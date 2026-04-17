# Lint-Schuld — CareAI

Stand: 2026-04-17 (Ende Autonom-Session, nach Wave 9 + Final)

## Zusammenfassung

- **Errors:** 39
- **Warnings:** 3
- **Gesamt:** 42 Issues
- **Einschätzung:** **Refactor-Backlog** — KEIN Demo-Blocker. TypeScript kompiliert clean (Exit 0), alle 52 Unit-Tests grün. Lint-Issues sind Code-Hygiene, nicht Correctness.

## Top-5-Kategorien

| # | Kategorie | Count | Beispiele |
|---|-----------|-------|-----------|
| 1 | `@typescript-eslint/no-unused-vars` | ~28 | Unused imports (`useMemo`, `Page`, `Violation`), unused args (`_rnd`, `_facilityId`, `opts`, `context`), unused locals (`s`, `bestSoll`, `highlighted`) |
| 2 | `react/no-unescaped-entities` | 1 | `"` statt `&quot;` in `SampleDataClient.tsx:179` |
| 3 | `@next/next/no-img-element` | 1 | `<img>` statt `<Image>` in `WoundTimelapseClient.tsx:226` |
| 4 | `jsx-a11y/alt-text` | 2 | `<Image>` ohne `alt` in PDF-Komponenten |
| 5 | `@typescript-eslint/ban-ts-comment` | 1 | `@ts-ignore` → `@ts-expect-error` in `performance/cache.ts:58` |

## Einschätzung

| Kategorie | Blocker? | Aufwand (Fix) |
|-----------|----------|---------------|
| Unused vars | Nein (ignorable) | 15–30 Min (massen-fix via `--fix` + Review) |
| React escapes | Nein | 1 Min |
| next/image | Nein (nur Perf-Warning) | 5 Min |
| Alt-text | PDF-Komponenten: okay mit `alt=""` | 2 Min |
| ts-comment | Nein | 1 Min |

**Fazit:** Alle Issues sind in <1h in einem dedizierten Cleanup-Sprint fixbar. Haben keinen Einfluss auf Build, Tests oder Runtime-Verhalten. Für aws-PreSeed-Einreichung und Investor-Demo **unkritisch** — `npm run build` und `npm run test` laufen durch.

## Nächste Schritte (wenn User das will)

1. `npx next lint --fix` für auto-fixable Issues
2. Manuelles Review der unused-vars-Liste (Underscore-Prefix oder echter Dead-Code?)
3. `<img>` → `next/image` für LCP-Verbesserung
4. Re-run Lint → Ziel: 0 Errors

## Betroffene Dateien (19)

```
src/components/sample-data/SampleDataClient.tsx
src/components/whitelabel/WhitelabelEditor.tsx
src/components/wound-timelapse/WoundTimelapseClient.tsx
src/lib/a11y-audit/reporter.ts
src/lib/ai-training/generator.ts
src/lib/analytics/store.ts
src/lib/feature-flags/evaluate.ts
src/lib/incident-pm/store.ts
src/lib/knowledge-graph/viz.ts
src/lib/multi-tenant/access.ts
src/lib/multi-tenant/comparator.ts
src/lib/pdf/bewohner-akte.tsx
src/lib/pdf/medikationsplan.tsx
src/lib/pdf/pdf-base.tsx
src/lib/performance/cache.ts
src/lib/quality-benchmarks/calculator.ts
src/lib/scheduling/solver.ts
src/lib/security/csp.ts
src/lib/voice-commands/matcher.ts
```
