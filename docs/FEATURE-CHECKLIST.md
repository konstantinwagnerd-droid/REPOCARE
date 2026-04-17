# Feature-Merge-Checklist

Diese 20 Punkte muessen **vor** dem Merge eines Feature-Branches erfuellt sein.
Im PR-Template sind sie als Checkboxen eingebaut — bitte ehrlich abhaken oder
mit Begruendung streichen.

## Tests & Qualitaet

1. **Unit-Tests** — mindestens 1 neuer Vitest-Test pro Business-Logik-Modul
2. **E2E-Test** — mindestens 1 Playwright-Spec, der den Happy Path abdeckt
3. **Linter gruen** — `npm run lint` ohne Warnungen im Diff
4. **Typecheck gruen** — `npm run typecheck` clean
5. **Build gruen** — `npm run build` erfolgreich lokal und in CI

## Dokumentation

6. **API dokumentiert** — neue Endpoints in `public/openapi.yaml` (Summary,
   Description, Params, Responses, Tags, Security)
7. **Feature-Beschreibung** — kurzer Eintrag in `docs/INDEX.md` oder
   Feature-spezifischem MD
8. **CHANGELOG.md** — Eintrag unter `## [Unreleased]` (Format: Keep-a-Changelog)

## Sicherheit & Compliance

9. **DSGVO-Check** — speichert das Feature PII? Falls ja:
    - Eintrag in `docs/SECURITY.md` → „Datenkategorien“
    - DSGVO-Auskunfts-Export (`/api/dsgvo/export`) liefert neue Felder
    - DSGVO-Loeschantrag (`/api/dsgvo/delete`) loescht/anonymisiert sauber
10. **Audit-Log-Trigger** — jede Lese-/Schreib-Aktion auf sensiblen Daten ruft
    `audit.log(...)`
11. **RBAC-Pruefung** — Route ruft `requireRole(...)` und filtert auf Tenant
12. **Secrets & Keys** — kein `.env`-Wert im Diff, keine hardcoded Tokens

## UX

13. **A11y** — Keyboard-Navigation funktioniert (Tab, Shift+Tab, Enter, Escape)
14. **A11y** — Screenreader: axe-Score > 95 (Lighthouse-CI)
15. **i18n** — alle User-facing Strings in `content/i18n/de.json`
    (Englisch-Fallback wenn relevant)
16. **Dark-Mode** — UI funktioniert in `light` und `dark`, keine hardcoded Farben
17. **Responsive** — Layout funktioniert auf 375 px (iPhone SE) bis 1920 px

## Zustaende

18. **Error-States** — Fehler-UI mit verstaendlicher Botschaft + Retry
19. **Loading-States** — Skeleton/Spinner waehrend Ladens, kein Flash of Empty
20. **Empty-States** — bei leeren Listen Hilfe-Hinweis + Call-to-Action

## Bonus (wenn zutreffend)

- [ ] Performance-Budget eingehalten (TTFB, LCP, Bundle)
- [ ] Neue Metrik in Grafana-Dashboard ergaenzt
- [ ] Feature-Flag angelegt (fuer grosse Aenderungen)
- [ ] Migrationen reversibel (Up + Down)
- [ ] Runbook geschrieben (wenn Alert dazukommt)

---

Bei Unsicherheiten: Slack `#careai-dev` oder Review anfordern. Lieber 3x
nachfragen als 1x Produktionsausfall.
