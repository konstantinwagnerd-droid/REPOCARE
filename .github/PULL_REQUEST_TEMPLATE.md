<!-- Danke fuer deinen Beitrag! Detaillierte Regeln: docs/CONTRIBUTING.md -->

## Was aendert sich?
<!-- Kurze Beschreibung + Motivation (1-3 Saetze) -->

## Linked Issues
Closes #

## Art der Aenderung
- [ ] Bugfix (`fix/`)
- [ ] Neue Funktion (`feat/`)
- [ ] Refactoring (`refactor/`)
- [ ] Dokumentation (`docs/`)
- [ ] Tests (`test/`)
- [ ] Performance (`perf/`)
- [ ] Security / Compliance
- [ ] Chore / Deps (`chore/`)

## Feature-Checklist (aus docs/FEATURE-CHECKLIST.md)

### Tests & Qualitaet
- [ ] Unit-Test (Vitest) hinzugefuegt
- [ ] E2E-Test (Playwright) hinzugefuegt
- [ ] `npm run lint` gruen
- [ ] `npm run typecheck` gruen
- [ ] `npm run build` gruen

### Dokumentation
- [ ] API in `public/openapi.yaml` dokumentiert
- [ ] Feature-Beschreibung in `docs/` aktualisiert
- [ ] `CHANGELOG.md` ergaenzt (Unreleased)

### Sicherheit & Compliance
- [ ] DSGVO-Impact geprueft (PII? Auskunft? Loeschung?)
- [ ] Audit-Log-Trigger fuer sensitive Aktionen
- [ ] RBAC + Tenant-Scoping enforced
- [ ] Keine Secrets / `.env`-Werte im Diff

### UX
- [ ] A11y — Keyboard + Screenreader
- [ ] i18n — neue Strings in `content/i18n/de.json`
- [ ] Dark-Mode funktioniert
- [ ] Mobile-responsive (375 px aufwaerts)

### Zustaende
- [ ] Error-States implementiert
- [ ] Loading-States implementiert
- [ ] Empty-States implementiert

## Screenshots / Evidence
<!-- UI-Aenderungen: Before/After, Playwright-Runs, Lighthouse-Scores -->

## Rollback-Plan
<!-- Wie rollt man zurueck? Feature-Flag? Migration reversibel? -->
