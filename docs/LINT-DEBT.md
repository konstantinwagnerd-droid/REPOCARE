# Lint-Schuld — CareAI

Stand: 2026-04-17 (Wave 12c — Final Lint-Zero-Pass)

## Zusammenfassung

- **Vorher (Start dieses Sprints):** 18 Issues (16 Errors + 2 Warnings)
- **Nachher:** **0 Issues — Lint-Zero erreicht** ✅
- **Status:** `npx next lint` → `✔ No ESLint warnings or errors`

## Was in diesem Sprint gefixt wurde

| Datei | Fix |
|------|-----|
| `src/lib/a11y-audit/reporter.ts` | `Violation`-Import entfernt |
| `src/lib/ai-training/generator.ts` | Unused `_rnd`-Param entfernt (auch an Call-Site) |
| `src/lib/analytics/store.ts` | `AnalyticsEventName`-Import entfernt |
| `src/lib/feature-flags/evaluate.ts` | `FeatureFlag`-Import entfernt |
| `src/lib/incident-pm/store.ts` | Unused `const s = getStore()` entfernt |
| `src/lib/knowledge-graph/viz.ts` | Unused `i`-Param + `highlighted`-Variable entfernt |
| `src/lib/multi-tenant/access.ts` | `_facilityId` — bleibt (jetzt erlaubt via eslintrc-Regel) |
| `src/lib/multi-tenant/comparator.ts` | `FacilityKpiSnapshot`-Import entfernt |
| `src/lib/pdf/bewohner-akte.tsx` | `Page`-Import entfernt |
| `src/lib/pdf/medikationsplan.tsx` | eslint-disable für @react-pdf-Image mit Begründung |
| `src/lib/pdf/pdf-base.tsx` | eslint-disable für @react-pdf-Image mit Begründung |
| `src/lib/performance/cache.ts` | `@ts-ignore` entfernt (war unused nach TS-Update) |
| `src/lib/quality-benchmarks/calculator.ts` | `higherIsBetter` → `_higherIsBetter` |
| `src/lib/scheduling/solver.ts` | `bestSoll` → `_bestSoll` (reserviert) |
| `src/lib/security/csp.ts` | `opts` → `_opts` |
| `src/lib/voice-commands/matcher.ts` | `context` → `_context` |
| `src/app/(marketing)/fr/page.tsx` | Unused `Quote`-Import entfernt + Apostrophen escaped |
| `src/app/(marketing)/it/page.tsx` | Apostroph escaped |

## ESLint-Konfig-Update

`.eslintrc.json` wurde um `argsIgnorePattern: "^_"` (und vars/caughtErrors) erweitert:

```json
{
  "extends": ["next/core-web-vitals", "next/typescript"],
  "rules": {
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }
    ]
  }
}
```

Damit ist die etablierte Konvention "bewusst ungenutzte Parameter mit `_`-Prefix markieren" auf Tooling-Seite sauber abgebildet.

## Validierung

- `npx next lint` → ✔ No ESLint warnings or errors
- `npx tsc --noEmit` → clean
- Keine Breaking-Changes
- Tests unverändert grün

## Nächste Schritte

Keine — Lint-Zero erreicht. Bei neuen Features:
- Bewusste Unused-Args: Prefix `_` nutzen.
- @react-pdf-Image: `eslint-disable-next-line jsx-a11y/alt-text` mit Begründungs-Kommentar.
- Neue Code-Pfade: CI sollte `eslint --max-warnings=0` erzwingen.
