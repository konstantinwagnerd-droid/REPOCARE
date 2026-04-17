# CareAI Sprint-Report

Stand: **2026-04-17** · Sprint-Ende Wave 6 · Finale Hygiene- und Konsolidierungs-Wave.

---

## Stand auf einen Blick

| Metrik | Wert |
|---|---|
| TypeScript-Quelldateien (`src/**`) | 605 |
| Routen (`page.tsx`) | 136 |
| App-Verzeichnisse | 355 |
| Git-Commits (seit Wave 0) | 8 |
| Markdown-Docs in `docs/` | 24 |
| Vitest-Unit-Tests (Files) | 9 |
| Playwright-E2E-Tests (Files) | 7 |
| Seed-Bewohner:innen | 12 (mit 6 Monaten Historie) |
| Audit-Events im Seed | 200+ |
| Content: Blog-Artikel | 15 |
| Content: Glossar-Einträge | vorhanden |
| Design-System-Tokens | dokumentiert |
| `npx tsc --noEmit` | clean (0 Errors) |
| `npx next lint` | 6 unused-vars, 2 a11y-Warnings (dokumentiert, nicht-blocking) |

---

## Wave-Chronik

### Wave 0 — Foundation (Commit `8fb462d`)
Scaffold, DB-Schema (16 Tabellen), Auth-Flow, Marketing-Landing, Grundfunktionen.

### Wave 1 — Foundation-Erweiterung (Commit `7830cb8`)
PDF-Exports, Design-System, Blog (15 Artikel), Test-Suite (Vitest + Playwright + Axe + Lighthouse), Security-Härtung, SEO.

### Wave 2 — Operations (Commit `e36dcf0`)
Kiosk-Modus, Voice-Commands (WebSpeech), Dienstplan-Solver, Webhooks, Report-Builder, Backup-Strategie, Cross-Agent-Konsistenz.

### Wave 3 — Compliance + Community (Commit `35ca749`)
Notifications-System, Analytics-Engine, Anomalie-Erkennung, LMS, Migrations-Tool, Presse-Bereich, Partner-Programm.

### Wave 4 — Ökosystem (Commit `9b35e35`)
Mobile-App (Expo), Multi-Einrichtungs-Betrieb, Whitelabel, Qualitäts-Benchmarks, Resident-Journey, Incident-Post-Mortem, Badges, Subunternehmer-Portal.

### Wave 5 — Mobile + Telemedizin (Commit `8725ae0`)
Mobile-Family-App, Telemedizin, Knowledge-Graph, Billing-Engine, Feature-Flags, Impersonation, Zeiterfassung.

### Wave 6 — Finale Politur (Commits `b2599a7` + `c3524d0`)
FINAL-TOUR-Doku, Offline-Sync-Lib, Wundverlauf-Zeitraffer, Sample-Data-Erweiterung, Anonymizer, Polish-Pass.

### Wave 7 (dieser Sprint) — Hygiene + Konsolidierung
README-Rewrite, CHANGELOG, ROADMAP, SHOWCASE, `docs/INDEX.md`, SPRINT-REPORT. Typo- und Dead-Link-Audit. Keine Code-Breaking-Changes.

---

## Offene Punkte

### Integrations-Stubs (erwartet produktive Anbindung)
- **Whisper / Claude Voice** — aktuell Mock-Transkript, API-Key-Integration bereit
- **ELGA (AT)** — Stub; benötigt Zertifikat + Produktiv-Zugang
- **DTA § 302 SGB V (DE)** — Stub; benötigt Partner-Lizenz bei Abrechnungszentrum
- **KIM (Kommunikation im Medizinwesen)** — Stub; benötigt Provider-Account
- **E-Mail-Versand** — derzeit nur Log; SMTP-/Resend-Credentials einzutragen

### KI-Pfade
- Die KI-Strukturierung in Schichtbericht und Voice-Input ist aktuell deterministisch (Template-basiert). Produktive LLM-Verkabelung steht an für Q2 2026.
- Der Knowledge-Graph ist FHIR-Datenmodell-fertig, aber nicht mit echten Observation-Feeds verkabelt.

### Lint-Schulden
- 6 unused-vars-Warnungen (in `scheduling/solver.ts`, `voice-commands/matcher.ts`, `multi-tenant/comparator.ts`, `pdf/bewohner-akte.tsx`, `pdf/medikationsplan.tsx`, `quality-benchmarks/calculator.ts`, `security/csp.ts`, `performance/cache.ts`) — risiko-arm, werden im nächsten Clean-Sprint entfernt
- 2 `jsx-a11y/alt-text`-Warnings in `pdf/*.tsx` — erwartet (React-PDF hat kein alt-Attribut)

### Doppelte/Redundante Files (Audit)
- **`src/app/(help)/help/articles.ts` vs. `content/blog/*.md`** — nicht redundant: `articles.ts` enthält 16 Hilfe-Artikel (Onboarding, How-Tos), `content/blog/` enthält 15 SEO-Artikel (Compliance, KI-Themen, Fachartikel). Beide dienen unterschiedlichen Zwecken.
- Keine sonstigen Duplikate gefunden.

### Dead-Links
- Keine defekten internen Markdown-Links gefunden (alle in README genannten Doku-Pfade existieren).

---

## Geschätzter Replacement-Cost

Wenn ein externes Team das aktuelle CareAI-Produkt von Grund auf neu bauen sollte, realistisch kalkuliert:

| Bereich | Dev-Tage |
|---|---|
| Architektur + Tech-Stack-Entscheidungen | 15 |
| Datenbank-Schema + Migrationen + Seed | 10 |
| Auth + RBAC + Multi-Tenancy | 12 |
| Marketing-Site (Landing, Blog, Presse, Karriere, Partner) | 20 |
| Pflege-App (Bewohner, SIS, Maßnahmen, Vitals, MAR, Wunden) | 35 |
| Admin-Bereich (Audit, Dienstplan, Settings, Reports) | 25 |
| Angehörigen-Portal | 8 |
| Kiosk-Modus | 6 |
| Mobile-Apps (Expo × 2) | 30 |
| Voice-Input + Voice-Commands | 12 |
| Schichtbericht-Generator + PDF-Exports | 10 |
| Dienstplan-Solver | 10 |
| Anomalie-Erkennung + Analytics + Benchmarks | 18 |
| LMS + Badges | 12 |
| Migrations-Tool (5 Formate) | 20 |
| Telemedizin + Knowledge-Graph + Billing-Stubs | 20 |
| Whitelabel + Feature-Flags + Impersonation + Zeiterfassung | 14 |
| Test-Suite (Vitest + Playwright + Axe + Lighthouse) | 15 |
| Security-Härtung (CSP, CSRF, Rate-Limit, Anonymizer) | 10 |
| Design-System + Komponenten-Bibliothek | 15 |
| Content: 15 Blog-Artikel + Glossar + 16 Hilfe-Artikel | 12 |
| Investor-Data-Room | 6 |
| Doku (24 Dokumente) | 10 |
| Polish + Cross-Agent-Konsistenz | 15 |
| **Summe** | **~360 Dev-Tage** |

Bei einem 3-Personen-Team: **~6 Monate** Full-Time.
Bei einem Solo-Developer in klassischer Arbeitsweise: **~18–24 Monate**.
Aktueller Projekt-Stand wurde in **6 Tagen** mit AI-gestützter Wave-Execution erreicht.

---

## Ready-for-Demo: **JA**

**Begründung:**

1. `npx tsc --noEmit` ist sauber (keine Type-Errors).
2. Build-Pipeline funktioniert, alle 136 Routen lassen sich rendern.
3. Alle Investor-Demo-Schritte aus `docs/DEMO-SCRIPT.md` funktionieren mit Seed-Daten.
4. Auth, RBAC, Audit-Log, Bewohner-Detail, Schichtbericht-Generator, Admin-Übersicht und Angehörigen-Portal sind live aus der DB bedient.
5. Spracheingabe und LLM-Teile sind als Mock eindeutig deklariert — bei einer Live-Demo wird das kommuniziert.
6. Design ist konsistent (Design-System, dokumentiert in `docs/DESIGN-SYSTEM.md`).
7. 9 Screenshots liegen bereit unter `docs/screenshots/`.
8. Doku ist konsolidiert (README, CHANGELOG, ROADMAP, SHOWCASE, INDEX).

**Einschränkungen für eine Produktions-Inbetriebnahme:**
- LLM-Integration muss verkabelt werden (aktuell Mock).
- ELGA/KIM/DTA brauchen Partner-Verträge.
- SMTP-/Push-Credentials müssen hinterlegt werden.
- Mobile-Apps sind Alpha — vor App-Store-Release: Feldtests nötig.

---

## Nächste Schritte

1. Whisper-Anbindung in Pilot-Einrichtung Wien testen (Q2 2026).
2. DSFA-Abnahme formal mit DSB-Österreich.
3. `aws Preseed` Abruf Tranche 1.
4. Team-Aufbau: +1 Head of Sales AT, +1 Customer Success.
5. Lint-Schulden im ersten Mai-Sprint abarbeiten.
