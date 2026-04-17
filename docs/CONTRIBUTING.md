# Contributing to CareAI

Willkommen! Diese Anleitung bringt dich in unter 10 Minuten zu deinem ersten
Merge-Request.

## Setup in 3 Schritten

```bash
# 1. Klonen + Dependencies
git clone git@github.com:careai/careai-app.git
cd careai-app
npm install

# 2. Env-File und lokale DB
cp .env.example .env.local   # AUTH_SECRET, DATABASE_URL, … sind vorbefuellt
npm run db:push              # migriert Schema in lokale pglite

# 3. Dev-Server
npm run dev                  # http://localhost:3000
```

Wenn alles laeuft: `npm run test` (Vitest) und `npm run e2e` (Playwright) muessen
gruen sein.

## Branch-Naming

| Prefix | Zweck | Beispiel |
|--------|-------|----------|
| `feat/` | Neues Feature | `feat/voice-handover` |
| `fix/` | Bugfix | `fix/login-rate-limit` |
| `docs/` | Dokumentation | `docs/monitoring-runbooks` |
| `refactor/` | Refactoring ohne Verhaltensaenderung | `refactor/llm-client` |
| `chore/` | Build, CI, Deps | `chore/bump-next-15` |
| `test/` | Nur Tests | `test/e2e-export-flow` |
| `perf/` | Performance-Optimierung | `perf/report-list-index` |

Regel: immer von `main` branchen, Slug in kebab-case, maximal 50 Zeichen.

## Commit-Convention (Conventional Commits)

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

Typen: `feat` | `fix` | `docs` | `refactor` | `test` | `chore` | `perf` | `ci`

Beispiele:

```
feat(care): handover LLM prompt supports "klinisch" style
fix(auth): rate-limit uses IP+email, not only IP
docs(api): add 6 Swagger endpoint groups
chore(deps): bump drizzle-orm to 0.36.0
```

Breaking Changes: `feat!: ...` oder Footer `BREAKING CHANGE: ...`.

## PR-Workflow

1. **Branch + Commits pushen** — atomar, keine „WIP“-Commits in `main`.
2. **PR-Template ausfuellen** (wird automatisch geladen, siehe
   `.github/PULL_REQUEST_TEMPLATE.md`).
3. **Feature-Checklist** im PR abhaken (siehe [FEATURE-CHECKLIST.md](FEATURE-CHECKLIST.md)).
4. **CI muss gruen** sein: Lint, Typecheck, Unit-Tests, Build, E2E.
5. **Review** — mindestens 1 Approval. Security-relevante Changes: 2.
6. **Squash-Merge** — Commit-Message folgt Conventional Commits.

## Test-Pflicht

Neue Features muessen haben:

- mindestens **1 Unit-Test** (Vitest, `src/**/*.test.ts`)
- mindestens **1 E2E-Test** (Playwright, `e2e/*.spec.ts`)
- bei UI-Aenderungen: Screenshot in `docs/screenshots/` aktualisieren

Ausnahmen (Docs-only, Styling-only) bitte im PR begruenden.

## Code-Style

- **TypeScript strict**. Keine `any`. Wenn unvermeidbar, `// eslint-disable-next-line`
  mit Begruendung.
- **ESLint + Prettier** laufen via pre-commit (Husky). Keine manuellen Formatter.
- **Imports**: absolute Pfade (`@/lib/...`), nie `../../../`.
- **Deutsch** in User-facing Strings, **Englisch** in Code/Kommentaren/Variablen.

## Review-Checkliste (fuer Reviewer)

- [ ] Spec-Compliance — macht der Code was im PRD/Issue steht?
- [ ] Tests decken happy path + mindestens 1 edge case ab
- [ ] Keine Secrets oder `.env`-Werte im Diff
- [ ] Keine `console.log` / `debugger`
- [ ] Audit-Log-Trigger fuer sensitive Aktionen
- [ ] A11y: Keyboard-Navigation, ARIA-Labels
- [ ] i18n: neue Strings in `content/i18n/de.json`
- [ ] DSGVO: neue PII-Felder in Auskunfts-Export beruecksichtigt

## Fragen?

- Architektur-Deep-Dive: [DEVELOPMENT.md](DEVELOPMENT.md)
- Team-Regeln: [CODE-OF-CONDUCT.md](CODE-OF-CONDUCT.md)
- Security-Themen: `security@careai.at` (PGP auf Website)
- Alles andere: Slack `#careai-dev`
