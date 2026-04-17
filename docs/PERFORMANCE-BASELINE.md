# Performance Baseline

CareAI tracks Core Web Vitals over time against per-route-type budgets. This document describes the baseline infrastructure, initial values, budgets, and how to detect regressions.

## Initial baseline (mock-mode, 2026-04-17)

Measured against a local production build on a mid-tier 2023 laptop, Chrome 124, emulated Fast 3G for marketing, no throttling for admin/app. These values are realistic initial values and should be re-measured after every release.

| Route | Type | LCP | FCP | CLS | TBT | TTI |
|-------|------|----:|----:|----:|----:|----:|
| `/` | marketing | 1.20 s | 0.90 s | 0.03 | 80 ms | 1.80 s |
| `/en` | marketing | 1.20 s | 0.90 s | 0.03 | 80 ms | 1.80 s |
| `/trust` | marketing | 1.20 s | 0.90 s | 0.03 | 80 ms | 1.80 s |
| `/integrations` | marketing | 1.20 s | 0.90 s | 0.03 | 80 ms | 1.80 s |
| `/roi-rechner` | marketing | 1.20 s | 0.90 s | 0.03 | 80 ms | 1.80 s |
| `/case-studies` | marketing | 1.20 s | 0.90 s | 0.03 | 80 ms | 1.80 s |
| `/blog` | marketing | 1.20 s | 0.90 s | 0.03 | 80 ms | 1.80 s |
| `/login` | auth | 1.10 s | 0.80 s | 0.02 | 60 ms | 1.50 s |
| `/admin` | admin | 1.90 s | 1.30 s | 0.05 | 180 ms | 3.20 s |
| `/app` | app | 2.10 s | 1.40 s | 0.06 | 200 ms | 3.40 s |

## Budgets

Enforced by `src/lib/performance-baseline/budgets.ts`.

### Marketing

| Metric | Good | Needs-improvement |
|--------|-----:|------------------:|
| LCP | 2000 ms | 2500 ms |
| FCP | 1500 ms | 1800 ms |
| CLS | 0.05 | 0.10 |
| TBT | 150 ms | 300 ms |
| TTI | 3000 ms | 5000 ms |
| INP | 150 ms | 200 ms |
| TTFB | 500 ms | 800 ms |

### Admin / App

| Metric | Good | Needs-improvement |
|--------|-----:|------------------:|
| LCP | 2500 ms | 3500 ms |
| FCP | 1800 ms | 2500 ms |
| CLS | 0.10 | 0.15 |
| TBT | 250 ms | 500 ms |
| TTI | 4000 ms | 6000 ms |
| INP | 200 ms | 300 ms |
| TTFB | 600 ms | 1000 ms |

### Auth

| Metric | Good | Needs-improvement |
|--------|-----:|------------------:|
| LCP | 1800 ms | 2500 ms |
| FCP | 1200 ms | 1800 ms |
| CLS | 0.05 | 0.10 |
| TBT | 150 ms | 300 ms |
| TTI | 2500 ms | 4000 ms |

Rationale: admin/app tolerate higher LCP because they are auth-gated, behind-login, and metric the cold start from a warm cache on subsequent navigations.

## Running a baseline

### Mock mode (default)

```bash
node scripts/performance-baseline.mjs
```

Writes `docs/performance/baseline-YYYY-MM-DD.json`. Useful for CI smoke checks, fresh-repo setup, and when a browser is not available.

### Real mode (dev server)

```bash
npm run dev &
sleep 5
node scripts/performance-baseline.mjs --real
```

Measures via `fetch()` timing. Approximate but directionally correct for TTFB and total load.

### Lighthouse mode (most accurate)

```bash
npm i -g lighthouse
node scripts/performance-baseline.mjs --lighthouse
```

Requires Chrome / Chromium in PATH. Produces true Core Web Vitals + Lighthouse performance score.

## Finding regressions

Compare two runs:

```ts
import { compareRuns } from "@/lib/performance-baseline/analyzer";
const { regressions, improvements } = compareRuns(current, previous);
```

Flag any regression where LCP worsens by >200 ms, CLS by >0.02, or TBT by >100 ms. Open a ticket on Linear referencing the run IDs.

## CI gate

Suggested: fail the build if any marketing route exceeds LCP 2500 ms or CLS 0.10 in Lighthouse mode.

```yaml
- name: Performance baseline
  run: |
    npm run build
    npm run start &
    sleep 10
    node scripts/performance-baseline.mjs --lighthouse --out tmp/baseline.json
    node scripts/performance-check-budget.mjs tmp/baseline.json
```

## Where data lives

- Per-run JSON: `docs/performance/baseline-YYYY-MM-DD.json`
- Admin UI (read-only): `/admin/performance`
- Programmatic: `summarizeRun`, `compareRuns` in `src/lib/performance-baseline/analyzer.ts`

## Dashboard

The `/admin/performance` page shows the latest run, compliance split, and the last 10 historical runs. Charts are intentionally minimal — for deep analysis use Lighthouse CI or Speedcurve.
