# Changelog

Alle relevanten Änderungen an CareAI werden hier wave-weise dokumentiert. Format angelehnt an [Keep a Changelog](https://keepachangelog.com/de/1.1.0/).

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
