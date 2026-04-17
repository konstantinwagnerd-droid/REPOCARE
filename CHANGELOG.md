# Changelog

Alle relevanten Änderungen an CareAI werden hier wave-weise dokumentiert. Format angelehnt an [Keep a Changelog](https://keepachangelog.com/de/1.1.0/).

---

## Wave 13 — 2026-04-17 (Finaler Polish)

**Commit:** *(dieser Commit)*

### Geändert
- `README.md` — Lint-Zero- und 5-Sprachen-Badges, erweiterte Feature-Matrix (Waves 10–12), „Produktion“-Abschnitt mit Hetzner-Deploy/Installer/Grafana-Links
- `SHOWCASE.md` — auf 30+ Highlight-Features erweitert (Guided Tours, Welcome-Onboarding, A/B-Testing, Marketing-Automation, CRM-Sync, Press-Release-Generator, i18n 5 Sprachen, Ops-/Compliance-Assets). Alle Route-Links verifiziert.
- `docs/PROJECT-SUMMARY.md` — komplette Neufassung für den 5-Minuten-Orientierungs-Einstieg, Top-15-Highlights, Q2-2026-Next-Steps
- `docs/GIT-HISTORY.md` — um Waves 10–13 ergänzt
- `docs/SPRINT-REPORT.md` — auf Final-Stand aktualisiert, Replacement-Cost ~550 Dev-Tage, Status „Production-grade ready for multi-tenant rollout“
- `docs/LINT-DEBT.md` — „0 Issues — Lint-Zero erreicht“ (Stand Wave 12c)
- `docs/INDEX.md` — neue Kategorien: Outreach+GTM, Regulatory+Clinical, Marketing-Platform, Platform-Core, i18n, Ops-Runbooks
- `ROADMAP.md` — CE-Mark-Timeline (18 Monate bis 2027 Q3), Clinical-Validation-Phase (N=150), EU-Expansion (FR/IT/ES produktiv Q4 2026), A/B-Testing + Marketing-Automation Rollout-Plan

---

## Wave 12c — 2026-04-17 (CE-MDR + Clinical + Lint-Zero)

**Commit:** `7d9df4f`

### Hinzugefügt
- `docs/regulatory/` — CE-MDR-Templates: Risk-File, Clinical-Evaluation, Post-Market-Surveillance
- `docs/clinical/` — Clinical-Study-Protocol (N=150, 3 Heime, 18 Monate)
- Store-Assets (App-Icons, Screenshots, Listing-Texte DE/EN/FR/IT/ES)

### Geändert
- Lint von 18 Issues → **0 Issues** (Lint-Zero erreicht)
- ESLint-Konfig um `argsIgnorePattern: "^_"` erweitert
- 18 Files cleanup (unused imports/vars, eslint-disables für @react-pdf/renderer)

---

## Wave 12b — 2026-04-17 (i18n Expansion + Marketing-Platform)

**Commit:** `042ba6c`

### Hinzugefügt
- `/fr`, `/it`, `/es` — vollständige Marketing-Präsenz in FR/IT/ES inkl. Blog, ROI-Rechner, Case-Studies, Kontakt, About, Trust
- `/admin/ab-testing` — A/B-Testing-Plattform mit Chi-Quadrat-Signifikanz, Winner-Picking, Assignment/Conversion/Results-APIs
- `/admin/marketing-automation` — Flows mit Trigger → Conditions → Actions (E-Mail, Lead-Scoring, Drip)
- `/admin/crm-sync` — bidirektionale HubSpot/Pipedrive-Sync (Push/Pull/Status)
- `docs/AB-TESTING.md`, `docs/MARKETING-AUTOMATION.md`, `docs/CRM-SYNC.md`, `docs/I18N-EXPANSION.md`

---

## Wave 12a — 2026-04-17 (Grafana + Developer Polish)

**Commit:** `07d268c`

### Hinzugefügt
- Grafana-Dashboards + Prometheus-Scraper-Konfiguration
- Swagger-API-Dokumentation Feinschliff
- Erweiterte Developer-Docs (DEVELOPMENT.md, DATABASE-MIGRATION.md)

---

## Wave 11b — 2026-04-17 (Operations-Kit)

**Commit:** `bd8ff4a`

### Hinzugefügt
- DR-Drill-Playbook mit realem Failover-Szenario
- Support-Playbook (Eskalationen, SLA, Templates)
- Pilot-Kit für 3 Wiener Heime (Setup-Guide, Schulung, Abnahme-Checkliste)
- Onboarding-Videos (Skripte, Storyboards)
- Escape-Room / Chaos-Engineering-Runbook

---

## Wave 11a — 2026-04-17 (Production Hardening)

**Commit:** `dac79be`

### Hinzugefügt
- Installer-Script für Ein-Kommando-Setup auf neuen Servern (`docs/INSTALLER.md`)
- Smoke-Tests (`docs/SMOKE-TESTS.md`)
- Load-Testing-Setup mit k6 (`docs/LOAD-TESTING.md`)
- Pentest-Checkliste (OWASP Top 10 + Pflege-spezifisch, `docs/PENTEST-CHECKLIST.md`)

---

## Wave 10 — 2026-04-17 (Production Readiness + Guided Tours)

**Commit:** `636d9e6` + `1291c37`

### Hinzugefügt
- Docker-Compose Production-Setup, Dockerfile
- LLM-Integration-Layer (Multi-Provider: Anthropic, OpenAI, Mock) — `docs/LLM-INTEGRATION.md`
- E-Mail-Versand (Resend/SMTP-Adapter), Email-Webhooks
- Storage-Adapter (S3-kompatibel)
- Deployment-Guide Hetzner (`docs/DEPLOYMENT.md`)
- `/admin/tours` — Guided-Tour-Builder (Schritte, Zielgruppe, Trigger)
- Kontext-Tooltips in allen Admin-Seiten
- `/onboarding-welcome` — personalisierter Willkommens-Flow
- Lint um 57% reduziert (in Wave 10, final Lint-Zero in Wave 12c)

---

## Wave 9 — 2026-04-17 (Finale Integration)

### Hinzugefügt
- `src/lib/press-release/` — Press-Release-Generator-Kern (5 Templates, Quality-Rules, Renderer)
- `src/app/admin/press-release/` — UI mit Template-Auswahl, dynamischem Form, Live-Preview, Quality-Score
- `POST /api/press-release/generate` — API-Endpoint, rollengeschützt (admin / pdl)
- `docs/PRESS-RELEASE-GENERATOR.md` — Doku inkl. Template-Beschreibungen, API-Beispiel
- Service-Worker-Registrierung in `src/app/layout.tsx` (nur https und localhost)
- Sitemap-Erweiterung: `/partner`, Presse-Unterseiten, `/help`, EN-Routen, hreflang-Alternates, EN-Blog
- package.json Scripts: `a11y`, `perf`, `audit:all`

### Geändert
- `SHOWCASE.md` — Broken-Link-Audit: `/admin/anomaly`, `wunden-timelapse`, `/admin/whitelabel`, `/admin/dashboards` korrigiert
- `docs/INDEX.md` — neue Sektionen für Qualität + Baselines, neue Doku einsortiert

---

## Wave 8 — 2026-04-17 (Enablement + Outreach)

### Hinzugefügt
- `docs/INVESTOR-OUTREACH.md` — Investor-Playbook, Zielgruppen-Listen, Templates
- `docs/DEMO-VIDEO.md` — Storyboard + Produktions-Guide für Investor-Demo-Video
- `docs/AI-TRAINING.md` — Synthetic-Dataset-Pipeline mit PII-Scan
- `src/app/admin/ai-training/` — Dataset-Index im Admin-Bereich
- `src/app/admin/performance/` + `src/lib/performance-baseline/` — Performance-Baseline-Tool
- `src/app/admin/a11y-audit/` + `src/lib/a11y-audit/` — In-App Accessibility-Audit

---

## Wave 7 — 2026-04-17 (Internationalisierung + Offline)

### Hinzugefügt
- `/en` Marketing-Routen: Home, About, Contact, Careers, Case Studies, Integrations, Trust, ROI Calculator, Blog
- `docs/INTERNATIONAL.md` — i18n-Architektur, Sprachauswahl, hreflang
- `docs/OFFLINE-SYNC-INTEGRATION.md` — Offline-First-Sync mit IndexedDB + Service-Worker
- `docs/E2E-WITH-PGLITE.md` — E2E-Setup mit PGlite (In-Memory Postgres)
- `docs/A11Y-AUDIT.md` — WCAG-Checkliste, Axe-Regeln
- `docs/PERFORMANCE-BASELINE.md` — Performance-Budget-Baseline
- `public/sw.js` — Service-Worker (Cache-First für statische Assets)

---

## Wave 6 — 2026-04-17 (Finale Politur)

**Commit:** `c3524d0` + `b2599a7`

### Hinzugefügt
- `docs/FINAL-TOUR.md` — 12-Stops Feature-Rundgang für Stakeholder
- `src/lib/offline/` — IndexedDB-Queue für Offline-Sync auf Mobile
- `src/components/wound/` — Wundverlauf-Zeitraffer mit Heilungstrend
- `src/lib/anonymizer/` — DSGVO-Export-Anonymisierung
- Sample-Data-Erweiterung: realistischere 12-Bewohner-Seeds mit 6 Monaten Historie
- Polish-Pass: Micro-Interactions, Skeleton-Loader, konsistente Fehler-Toasts

### Geändert
- Cross-Agent-Konsolidierung: einheitlicher Toast-Stil, konsistente Empty-States
- Audit-Log-Visualisierung mit Filtern pro Rolle/Aktion/Zeitraum

---

## Wave 5 — 2026-04-16 (Mobile + Telemedizin)

**Commit:** `8725ae0`

### Hinzugefügt
- `mobile-family/` — Expo-App für Angehörige (Push-Benachrichtigungen, Timeline)
- `src/app/telemedizin/` — Telemedizin-Sprechstunde (WebRTC-Stub)
- `src/lib/integrations/knowledge-graph/` — FHIR-basierter Pflege-Wissensgraph
- `src/lib/billing/` — Abrechnungs-Engine (DTA § 302 SGB V, Stub)
- `src/lib/feature-flags/` — Feature-Flag-System (Key-Value mit Facility-Scope)
- `src/lib/impersonation/` — Support-Impersonation mit Audit-Trail
- Zeiterfassung für Personal mit Pausenregeln

---

## Wave 4 — 2026-04-15 (Ökosystem)

**Commit:** `9b35e35`

### Hinzugefügt
- `mobile/` — Expo-App für Pflegekräfte (Offline-First)
- Multi-Einrichtungs-Betrieb (Mandantenwechsel, Konzern-Dashboard)
- Whitelabel-Engine (pro-Einrichtung-Branding: Logo, Farben, Domain)
- Qualitäts-Benchmarks (§ 113 SGB XI Indikatoren-Berechnung)
- Resident-Journey-Visualisierung (Timeline seit Einzug)
- Incident-Post-Mortem-Modul (Blameless-Template)
- Gamification: Badges für Pflegekräfte (Fortbildung, Vollständigkeit)
- Subunternehmer-Portal (Honorarkräfte, Dienstleister)

---

## Wave 3 — 2026-04-14 (Compliance + Community)

**Commit:** `35ca749`

### Hinzugefügt
- Notifications-System (E-Mail, Push, In-App; Präferenzen pro Nutzer)
- Analytics-Engine (KPI-Dashboard, Trend-Erkennung, Kohorten)
- Anomalie-Erkennung (statistische Outlier auf Vitalwerten + Audit)
- LMS (Lernmanagement-System mit Quiz, Zertifikaten, Spaced-Repetition)
- Migrations-Tool (Import aus Vivendi, Medifox, MyMedis, Senso, Connext)
- Presse-Bereich (Pressemeldungen, Expert:innen-Themen, Mediathek, Kontakt)
- Partner-Programm (Referral, Whitelabel, Integration-Partner)

---

## Wave 2 — 2026-04-13 (Operations)

**Commit:** `e36dcf0`

### Hinzugefügt
- Kiosk-Modus (Touch-optimiert für Stations-Tablets, 5 Screens)
- Voice-Commands (WebSpeech, 20+ Befehle: „Vitalwerte eintragen“, „Wunde fotografieren“ …)
- Dienstplan-Solver (Constraint-Solver mit Arbeitszeit-, Urlaubs-, Qualifikations-Regeln)
- Webhook-System (Event-getriebene Integrationen: `audit.created`, `resident.updated`, …)
- Report-Builder (Drag-&-Drop-Reports mit PDF-Export)
- Backup-Strategie (PITR + Retention + Off-Site-Verschlüsselung)
- Cross-Agent-Fixes (Sidebar-Konsistenz, Breadcrumbs, Empty-States)

---

## Wave 1 — 2026-04-12 (Foundation)

**Commit:** `7830cb8`

### Hinzugefügt
- PDF-Exports (Bewohner-Akte, Medikationsplan, Dienstplan — React PDF)
- Design-System (Tokens, Typografie, Farben, Komponenten-Bibliothek)
- Blog (15 SEO-Artikel zu Pflege, Compliance, KI)
- Test-Suite (Vitest-Unit, Playwright-E2E, Axe-A11y, Lighthouse)
- Security-Härtung (CSP, HSTS, COOP/COEP, CSRF-Schutz)
- SEO-Paket (Sitemap, Robots, Open-Graph, JSON-LD)

---

## Wave 0 — 2026-04-11 (Initial)

**Commit:** `8fb462d`

### Hinzugefügt
- Projekt-Scaffold: Next.js 15, TypeScript, Drizzle, Auth.js
- Datenbank-Schema (16 Tabellen)
- Auth-Flow (Credentials + JWT)
- Marketing-Landing
- Grundlegende Pflege-App (Bewohner, SIS, Maßnahmen)
- VS-Code + Editor-Config
