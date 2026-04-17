# A11y Audit

CareAI commits to **WCAG 2.2 Level AA** across all marketing, admin and app surfaces. This doc describes the automated audit infrastructure, the rules it evaluates, false-positive handling, and the relationship to BFSG / EAA (European Accessibility Act, in force from June 2025).

## Why WCAG 2.2 AA

- **BFSG / EAA.** Care software serving consumer-facing functions (family portal, self-service onboarding) falls under the German Barrierefreiheitsstärkungsgesetz from June 2025.
- **MDK / QPR.** Accessibility is an implicit quality criterion.
- **Ethics.** Care staff include older users, users with visual/motor impairments. Calm, accessible UX is not optional.

## What the static auditor does

`src/lib/a11y-audit/runner.ts` walks `src/app/**` and `src/components/**` for `.tsx` files and evaluates 20 rules implemented in `src/lib/a11y-audit/rules.ts`. It is intentionally conservative — false negatives on contrast, focus traps and screen-reader flow. Combine with dynamic axe-core runs via Playwright (see below) for full coverage.

## Rules evaluated (20)

| ID | WCAG | Level | Severity | Focus |
|----|------|-------|----------|-------|
| `img-alt` | 1.1.1 | A | Serious | Images without alt |
| `button-name` | 4.1.2 | A | Serious | Empty buttons |
| `link-name` | 2.4.4 | A | Serious | Empty anchors |
| `label-for-input` | 3.3.2 | A | Serious | Unlabelled inputs |
| `html-lang` | 3.1.1 | A | Moderate | Missing lang on layouts |
| `heading-order` | 1.3.1 | A | Moderate | Heading level skips |
| `landmark-main` | 1.3.1 | A | Moderate | Missing main landmark |
| `aria-role-valid` | 4.1.2 | A | Moderate | Invalid ARIA roles |
| `contrast-low-risk` | 1.4.3 | AA | Moderate | Risky colour combos |
| `touch-target-size` | 2.5.8 | AA | Moderate | WCAG 2.2 target sizing |
| `focus-visible` | 2.4.7 | AA | Serious | outline-none without replacement |
| `autocomplete-personal` | 1.3.5 | AA | Minor | Missing autocomplete |
| `video-captions` | 1.2.2 | A | Serious | Videos without captions |
| `iframe-title` | 4.1.2 | A | Moderate | iframes missing title |
| `dialog-label` | 4.1.2 | A | Moderate | Unlabelled dialogs |
| `no-positive-tabindex` | 2.4.3 | A | Moderate | tabindex > 0 |
| `lang-mixed-content` | 3.1.2 | AA | Minor | Untagged foreign-language spans (manual) |
| `skip-link` | 2.4.1 | A | Moderate | Missing skip-to-main link |
| `aria-hidden-interactive` | 4.1.2 | A | Serious | Interactive inside aria-hidden |
| `table-headers` | 1.3.1 | A | Moderate | Data tables without th |

## Running the audit

### One-off, CLI

```bash
node scripts/a11y-audit.mjs              # markdown to stdout
node scripts/a11y-audit.mjs --json       # JSON
node scripts/a11y-audit.mjs --html report.html
```

Exits non-zero if any `critical` violations are found (currently the rule set has no `critical` rules — wired for future).

### Admin UI

Log in as admin or PDL → navigate to `/admin/a11y-audit`. Scan runs server-side on page load. Filter by severity, rule, file. Download JSON or HTML.

### Dynamic testing (axe-core via Playwright)

`src/lib/a11y-audit/playwright-integration.ts` exports `runDynamicAudit(context, urls)`. Wire this into a Playwright script or your CI pipeline. Requires `@axe-core/playwright`.

Example CI job:

```bash
npx playwright install
node scripts/a11y-dynamic.mjs http://localhost:3000 http://localhost:3000/en
```

## False-positive handling

The static auditor is a regex + light heuristic scanner. Expected false-positive rate: ~15% on contrast, ~10% on touch-target, ~5% on heading-order.

**Triage rules:**

1. If the match comes from a third-party component (e.g. Radix primitives already set `aria-*` via props the regex cannot see), mark as false positive — document in this file under *Known false positives*.
2. If the rule genuinely misfires on a pattern we use, adjust the rule in `rules.ts` with a narrower regex, keep a regression test, and re-run.
3. Never blanket-ignore by severity. Always by (ruleId, file-glob) pair.

### Known false positives

- `button-name` on Radix `<DialogClose>` variants — Radix injects `aria-label` via `asChild`. Static scanner cannot see this.
- `contrast-low-risk` is a risk heuristic, not a measurement. Always verify with dev-tools contrast checker.

## BFSG / EAA mapping

BFSG §3(2) Nr. 1 covers self-service terminals and consumer-facing software. Within CareAI this includes:

- Kiosk surface (`/kiosk`)
- Family portal (`/family`)
- Self-service marketing and signup flows

All three are on the audit path. Admin and professional caregiver surfaces are internal-use and follow WCAG 2.2 AA voluntarily (not BFSG-mandated).

## CI integration (recommended)

Add to `.github/workflows/ci.yml` (or equivalent):

```yaml
- name: A11y static audit
  run: node scripts/a11y-audit.mjs --json > a11y-report.json
- name: A11y dynamic audit
  run: npx playwright test tests/a11y/
```

## Governance

- New violations introduced in a PR must be resolved before merge. Existing violations have a dated remediation plan.
- Quarterly external audit by a certified WCAG auditor. Report stored in `docs/performance/external-audit-YYYY-MM.pdf`.
- Every year: refresh rules to match WCAG 2.3 when published.
