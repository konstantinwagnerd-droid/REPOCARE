# CareAI — Capabilities Overview

**Stand**: 2026-04-18
**Version**: Pre-Launch (Demo-bereit)
**Deployment**: https://repocare.vercel.app
**Zielmarkt**: DACH-Pflege (Deutschland + Österreich + Schweiz)

> CareAI ist eine KI-gestützte Pflegedokumentations-SaaS, die Medifox/Vivendi/Senso-Pflege ersetzt. Gebaut mit Next.js 15, Claude 4.7, Supabase. Autonome Multi-Agent-Entwicklung, offline-fähig, DSGVO-konform.

---

## 1. Rollen & Zugriff

| Rolle | Route | Zweck |
|-------|-------|-------|
| **Owner** (versteckt) | `/owner/*` | Plattform-Betreiber. Cockpit über alle Mandanten, Impersonation, SQL-Inspektor, Audit-Global. 404 für alle anderen. |
| **Admin / PDL** | `/admin/*` | Pflegedienstleitung einer Einrichtung. Stammdaten, Auswertungen, Compliance, Abrechnung. |
| **Pflegekraft** | `/app/*` | Operative Pflege-UI. Dokumentation, Schichtbericht, Medikation, Voice-Input. |
| **Angehörige** | `/family/*` | Angehörigen-Portal. Lese-Nachrichten, Biografie-Beitrag. |
| **Kiosk** | `/(kiosk)/*` | Stationäre Tablets: Schnell-Anmeldung, Notruf, Wahl-Touchscreen. |
| **Öffentlich** | `/`, `/blog`, `/legal`, `/agb`, `/datenschutz` | Marketing + Legal. |

**Auth**: NextAuth v5, bcrypt+JWT, RBAC, Audit-getrackte Impersonation, CSRF mit HMAC-SHA256, Session-Tracking.

---

## 2. Pflegekraft-UI (`/app/*`) — 25 Routen

| Route | Feature | DACH-Bezug |
|-------|---------|-----------|
| `/app/bewohner` | Bewohner-Liste, Suche, Filter | — |
| `/app/aufnahme` | Einzugs-Checkliste | DE: Heim-Verträge §15 WBVG, AT: HeimVG |
| `/app/biographie` | Biographie-Erhebung für Bezugspflege | DNQP Beziehungsgestaltung |
| `/app/handover` | Schichtübergabe (SBAR-Format) | — |
| `/app/voice` | Whisper/Scribe-Transkription → strukturierte SIS | Real-API (OpenAI/ElevenLabs) |
| `/app/voice-commands` | Hands-Free-Hotword "Hey CareAI" | Web Speech API |
| `/app/pflegediagnosen` | NANDA-I Diagnosen + NIC Interventionen + NOC Outcomes | Internationaler Standard |
| `/app/expertenstandards` | 8 DNQP-Assessments (Dekubitus, Sturz, Schmerz, Ernährung, Harnkontinenz, Entlassungsmanagement, Wund, Beziehung) | DE §113a SGB XI |
| `/app/interventionen` | SMART-Maßnahmenplanung | — |
| `/app/wunddoku` | TIME-Prinzip, Foto, Messreihe, Lokalisation | DNQP + ICW |
| `/app/medikation-amts` | PRISCUS 2.0 + FORTA 2023 + Interaktions-Engine + Beers | Priscus-Liste 2023-Update |
| `/app/heimaufg` | Heimaufsicht-Meldungen | AT: HeimAufG, DE: BayWoTeWoG |
| `/app/fallbesprechung` | 6-Phasen-Moderator mit Timer, SMART-Action-Generator | — |
| `/app/pflegevisite` | §11 SGB XI Protokoll (Donabedian-Triade) | DE |
| `/app/leistungsnachweis` | DE §37.3 SGB V Leistungsnachweis | DE Krankenkasse |
| `/app/pflegegeld-antrag` | Auto-Filler PG-Antrag | DE + AT (BPGG) |
| `/app/schulungen` | HTML5-Quiz für Pflicht-Schulungen + PDF-Zertifikat | DNQP, Hygiene (KRINKO), BtM (BtMG §13), Brandschutz |
| `/app/zeiterfassung` | Ein-/Ausstempeln, Pausen | §ArbZG konform |
| `/app/search` | Global-Search über Bewohner, Berichte, Termine | — |
| `/app/print/*` | 8 Druckvorlagen (siehe §6) | DIN A4 |

**Mobile-First**: Bottom-Tab-Nav (5 Tabs), safe-area-inset für iPhone-Notch, iPad-hochkant-optimiert.

**Offline-Modus**: Service-Worker + IndexedDB-Queue. Mutationen werden lokal gespeichert, nach WLAN-Wiederherstellung synchronisiert, Konflikt-Resolution via Version-Check.

**i18n**: de (Standard), en, tr, ar — Sprachumschalter nur in Pflege-UI. RTL-Auto-Switch für Arabisch. Pflege-Fachbegriffe aus Literatur übersetzt.

---

## 3. Admin / PDL (`/admin/*`) — 49 Routen

### Stammdaten & Team
- `/admin/residents` — Bewohner-Verwaltung, PG-Zuordnung, primärer Ansprechpartner
- `/admin/staff` — Pflegekräfte, Qualifikationen, Fachkraftstatus
- `/admin/dienstplan-solver` — Dienstplan-Optimierung (Qualifikations-Matching, Mindestbesetzung)
- `/admin/dienstplan-qualifikation` — Qualifikations-Warnings live
- `/admin/schedule` — Schichtplan, Vertretungen
- `/admin/subunternehmer` — Leiharbeit/Subunternehmer-Verträge

### Qualität & Compliance
- `/admin/dokumentation` — Dokumentations-Quoten pro Bewohner
- `/admin/audit` — Revisionsfestes Audit-Log (DSGVO Art. 32)
- `/admin/dsgvo` — Art. 15-22 Self-Service (Auskunft, Berichtigung, Löschung)
- `/admin/anonymizer` — Datenexport anonymisiert für Analytics
- `/admin/legal` — Datenschutz, AV-Vertrag, DSFA, TOM als PDF
- `/admin/zertifizierungen` — ISO 27001 / KTQ / NQZ / MDK §114 Tracker
- `/admin/a11y-audit` — Barrierefreiheits-Audit
- `/admin/backup` — Export/Restore-Manager

### Finanzen & Abrechnung
- `/admin/abrechnung` — DTA §302 SGB V EDIFACT-Export (DE) + BPGG (AT)
- `/admin/controlling` — PDL-Kosten-Cockpit mit What-If-Simulator, DACH-Benchmarks
- `/admin/billing` — Platform-Abos, Rechnungen
- `/admin/leads` — Sales-Pipeline

### KI & Automatisierung
- `/admin/ai-training` — Mandantenspezifisches Training der Prompts
- `/admin/ai-usage` — Claude/OpenAI-Token-Verbrauch + Kosten
- `/admin/amts` — AMTS-Dashboard: Warnmeldungen pro Bewohner, PRISCUS/FORTA-Hits
- `/admin/anomaly` — Anomalie-Detektion (ungewöhnliche Dokumentations-Pattern)
- `/admin/knowledge-graph` — Bewohner-Beziehungs-Netz

### Benchmarking & Reports
- `/admin/benchmarking` — DACH-Bundesdurchschnitt (Destatis, Statistik Austria, MDS) mit Quartil-Klassifikation
- `/admin/benchmarks` — Eigene Werte über Zeit
- `/admin/analytics` — Live-Metriken
- `/admin/dashboards` — Dashboard-Builder (Drag & Drop)
- `/admin/report-builder` — Advanced Reports
- `/admin/reports/builder` — No-Code SQL-Builder (whitelist-basiert, injection-safe)
- `/admin/reports/saved` — Gespeicherte Reports, CSV/JSON-Export
- `/admin/exports` — Standard-Exporte

### Integration & Kommunikation
- `/admin/whatsapp` — WhatsApp via Evolution API, Template-Massen-Send
- `/admin/email-inbox` — Eingangsmails klassifiziert
- `/admin/email-routing` — Auto-Routing-Regeln (Lead/Bewerbung/Beschwerde)
- `/admin/webhooks` — Outbound-Webhooks mit HMAC
- `/admin/crm-sync` — CRM-Integration
- `/admin/marketing-automation` — E-Mail-Sequenzen, Segmente
- `/admin/press-release` — PR-Text-Generator

### Weitere
- `/admin/vorlagen` — 32 DACH-Pflegedokument-Templates (Pflegegeld, SIS, MD-Prüfung, NQZ, Abrechnung)
- `/admin/schulungen` — Schulungs-Module + Fälligkeits-Tracking
- `/admin/lms` — Learning Management
- `/admin/sample-data` — Demo-Daten generieren
- `/admin/tools` — Admin-Werkzeuge
- `/admin/tours` — Geführte Onboarding-Tours
- `/admin/impersonation` — Temporäres Rollen-Switchen (audit-getrackt)
- `/admin/feature-flags` — Tenant-basierte Feature-Flags, % Rollout
- `/admin/notifications` — Benachrichtigungs-Policies
- `/admin/migration` — Daten-Migration aus Medifox/Vivendi (Import-CSVs)
- `/admin/ab-testing` — A/B-Tests
- `/admin/whitelabel` — Mandanten-Branding
- `/admin/performance` — App-Performance-Metriken
- `/admin/settings` — Einrichtungs-Konfiguration
- `/admin/incidents` — Ereignismeldungen (Sturz, Medikation, Aggression)
- `/admin/badges` — Gamification

---

## 4. Owner-Cockpit (`/owner/*`) — versteckt, 404 für alle anderen

- `/owner` — Live-Dashboard mit Sparklines: aktive Sessions, Logins heute, Audit-Events, Errors
- `/owner/tenants` — Alle Mandanten
- `/owner/users` — Alle User über alle Mandanten + Impersonation-Button
- `/owner/residents` — Alle Bewohner global
- `/owner/logins` — Login-Historie
- `/owner/sessions` — Aktive Sessions
- `/owner/leads` — Globale Sales-Pipeline
- `/owner/audit` — Globales Audit-Log
- `/owner/database` — SQL-Inspektor (read-only)
- `/owner/files` — Storage-Inventar, Backups
- `/owner/system` — Env-Vars (maskiert), Build-Info, DB-Stats
- `/owner/settings` — Platform-Settings

**Security**: Owner-Account nie in Demo-Login-Liste. Owner-E-Mail nur dem User selbst bekannt. Owner-Sidebar ist `role !== 'owner'` gefiltert — unsichtbar für alle.

---

## 5. APIs — REST-Endpoints

### Öffentlich
- `POST /api/setup` — DDL + Seed (token-geschützt)
- `GET /api/health` — Liveness
- `POST /api/leads` — Lead-Capture vom Marketing

### Auth
- Standard NextAuth `/api/auth/*`

### Pflege-Kernfunktionen
- `POST /api/voice/transcribe` — Audio → Text (Whisper/Scribe)
- `POST /api/sis/structure` — Transkript → strukturierte SIS (Claude 4.7)
- `POST /api/care-reports/generate` — KI-Zusammenfassung
- `GET/POST /api/residents/*`
- `GET/POST /api/medications/*`
- `POST /api/wounds/*`
- `POST /api/incidents`

### Training & Quiz
- `/api/training/modules` — CRUD
- `/api/training/attempt` — Start/Submit mit Scoring
- `/api/training/certificate/[id]`
- `/api/training/seed` — 4 Pflichtmodule idempotent

### Abrechnung
- `POST /api/abrechnung/dta` — DTA-Datei §302 SGB V generieren (IK-Prüfziffer Modulo-10, ISO-8859-15)
- `GET /api/abrechnung/export`

### Kommunikation
- `POST /api/whatsapp/send` — Evolution API
- `POST /api/email/inbound` — Webhook (HMAC-signiert) → Klassifikation
- `GET /api/email/rules`

### Owner & Admin
- `/api/owner/impersonate`
- `/api/admin/training/export`
- `/api/controlling/export`
- `/api/reports/run`

---

## 6. Print-Dokumente — 8 DIN-A4-Druckvorlagen (`/app/print/*`)

Alle nutzen `@media print` + `window.print()` — keine PDF-Library nötig.

1. **Schichtbericht** — Schichtübergabe mit Vitalzeichen + Vorkommnissen
2. **SIS** — Strukturierte Informationssammlung §113b SGB XI (6 Themenfelder + R1-R7 Risiken)
3. **Maßnahmenplan** — Gruppiert nach Tageszeit (Früh/Mittag/Abend/Nacht/b.B.)
4. **Wunddoku** — DNQP/ICW mit TIME-Prinzip + Messreihe
5. **Vitalzeichen-Verlauf** — Mit ASCII-Trend-Chart
6. **Incident-Meldung** — 5-W-Methode + Benachrichtigungs-Checkliste
7. **Pflegevisite** — Donabedian-Triade + SMART-Verabredungen
8. **Qualitäts-Jahresbericht** — Belegung, PG-Mix, Sturz-/Dekubitus-Inzidenz pro 1000 BT, Fluktuation, Schulungs-Quote

---

## 7. DACH-Spezifika (was kein Mitbewerber hat)

### Deutschland
- **DTA §302 SGB V EDIFACT-Export** — direkte Krankenkassen-Abrechnung mit IK-Prüfziffer Modulo-10 + ISO-8859-15 + SLGA+SLLA-Segmente
- **8 DNQP-Expertenstandards** — Dekubitus, Sturz, Schmerz, Ernährung, Kontinenz, Entlassung, Wund, Beziehung
- **PRISCUS 2.0 + FORTA 2023** — Alterspharmakologie mit Interaktions-Engine + Beers als Second Opinion
- **MDK-Prüfung** — §114 SGB XI Vorbereitungs-Templates
- **Pflegegeld DE** — Auto-Filler für Eigenantrag + Gutachter-Vorbereitung
- **Werdenfelser Weg FEM** — Freiheitsentziehende Maßnahmen mit richterlicher Zustimmung
- **§37.3 SGB V Leistungsnachweis** — Häusliche Krankenpflege

### Österreich
- **BPGG Pflegegeld** — Auto-Filler Bundesland-spezifisch
- **NQZ Nationales Qualitätszertifikat** — 10 Qualitätskategorien-Template
- **HeimAufG Meldungen** — Heimaufsichts-Meldewesen
- **ELGA-Integration** — dokumentiert (TI-Integration siehe Konzept-Doc)

### Beides
- **Werdenfelser Weg (DE) / §38 UbG (AT)** — Dokumentation FEM
- **BtMG §13 + SMG (AT)** — BtM/Opiate-Dokumentation mit Doppel-Kontrolle
- **ISO 27001 / KTQ / NQZ** — Zertifizierungs-Tracker mit Audit-Checklisten

---

## 8. KI & Automatisierung

- **Claude 4.7 Sonnet** — SIS-Strukturierung, Zusammenfassungen, Pflegediagnosen-Vorschläge
- **Prompt-Caching** — `cache_control: ephemeral` für System-Prompts >500 Zeichen → 90% Kosten-Reduktion
- **Cost-Tracking** — Pro Request in Cent (integer), Monatsbudget-Alarm in EUR
- **PII-Scrubbing** — Namen/SVN/IBAN aus LLM-Requests vor Versand
- **Versionierte Prompts** — v1/v2-Versionen mit A/B-Test-fähig
- **Whisper / ElevenLabs Scribe** — Voice-to-Text mit EU-Endpoint-Präferenz
- **Regex-Klassifikator** — E-Mail-Routing ohne LLM-Kosten (Lead/Bewerbung/Beschwerde)

---

## 9. Sicherheit & Compliance

- **DSGVO Art. 15-22 Self-Service** (Admin-UI)
- **DSGVO Art. 32 TOM** — dokumentiert als BayLDA-Matrix
- **DSFA** — Art. 35 mit R1-R12 Risiko-Inventar
- **AV-Vertrag** — 13 Paragraphen + 3 Anlagen (Subunternehmer-Liste, TOM, Weisungen)
- **Audit-Log** — jede DB-Mutation, revisionsfest, 10-Jahre-Aufbewahrung
- **Owner-Impersonation** — audit-getrackt, mit Zeitlimit
- **CSP (Content-Security-Policy)** — Nonce-basiert, Web-Crypto
- **HTTPS-only** — Vercel + Custom-Domain mit HSTS
- **Passwort-Hashing** — bcrypt cost 12
- **Datenresidenz** — Supabase Frankfurt (fra1), Hetzner-Option für On-Premise
- **Verschlüsselung at-rest** — AES-256-GCM für sensitive Blobs, eigener Schlüssel
- **Backup** — Supabase PITR + S3-kompatibel (Hetzner Object Storage)

---

## 10. Technische Architektur

| Layer | Technologie |
|-------|-------------|
| Frontend | Next.js 15 App Router, React 19, TypeScript strict |
| Styling | Tailwind CSS, shadcn/ui, Lucide Icons, mobile-first |
| Backend | Next.js Server Actions + Route Handlers |
| DB (Prod) | Supabase Postgres via Transaction Pooler (IPv4, pgbouncer, aws-1-eu-central-1) |
| DB (Dev) | PGlite embedded — offline-fähige lokale Dev-DB |
| ORM | Drizzle mit dualem Client-Mode |
| Auth | NextAuth v5 + bcrypt + JWT |
| LLM | Claude 4.7 Sonnet via fetch-basiertem Client (kein SDK-Lock-in) |
| Voice | OpenAI Whisper-1 + ElevenLabs Scribe (EU) |
| E-Mail | Resend + Postmark + SMTP-Fallback |
| Storage | S3 (Hetzner) + Local-Fallback |
| Hosting | Vercel fra1 (Frankfurt) |
| Monitoring | Sentry mit PHI-Scrubbing (beforeSend) |
| Tests | Playwright E2E (Login, SIS-Create, Print-Flow) |
| CI | GitHub Actions (Lint + E2E) |

---

## 11. Vertriebs-Argumente

| Mitbewerber | CareAI-Differenzierer |
|-------------|-----------------------|
| **Medifox DAN** | KI-Spracherfassung nativ, nicht Add-On. Moderne Web-UI, keine Windows-Installation. DSGVO-Konform by Design. Mandanten-fähig. |
| **Vivendi** | Mobile-First, Offline-Fähig. 32 DACH-Vorlagen out-of-the-box. Owner-Cockpit für Multi-Einrichtungen. |
| **Senso-Pflege (AT)** | Beide Länder aus einer Hand. BPGG + DNQP + NQZ. |
| **Voize** | Wir haben Voice + vollständige Doku-Suite. Voize ist nur Voice. |
| **dan.touch** | Moderner Tech-Stack, niedrigere TCO, Real-Time-Collab. |

---

## 12. Roadmap (Öffentlich)

- ✅ **Phase 1** — Pflege-Kernfunktionen, SIS, Handover, AMTS, Wunddoku, Medikation
- ✅ **Phase 2** — Abrechnung DTA §302, DNQP 8 Standards, Pflegegeld-Auto-Fill
- ✅ **Phase 3** — Controlling, Zertifizierungs-Tracker, Query-Builder
- ✅ **Phase 4** — WhatsApp, i18n TR+AR, Fallbesprechung, Print-PDFs, Schulungs-Quiz, E-Mail-Routing
- 🔄 **Phase 5** (läuft) — Sentry, E2E-Tests, Benchmarking, Performance-Tuning
- 📋 **Phase 6** — Feature-Flags, DSGVO-Anonymizer, Family-PWA, Voice-Hotword
- 📋 **Phase 7** — ELGA-AT-Anbindung, TI-Anbindung DE (gematik), KIM-Fachdienst
- 📋 **Phase 8** — Mobile Native Apps (Expo), Offline-Sync für iOS/Android
- 📋 **Phase 9** — Hetzner-On-Premise-Deployment für Kunden mit Datenhaltung-Pflicht

---

## 13. Zahlen (Status 2026-04-18)

- **Commits auf main**: 30+
- **Routes**: 49 Admin + 25 Pflege-App + 8 Print + 10 Owner + 12 Public = **104 Routen**
- **DB-Tabellen**: 40+ (53 DDL-Statements beim Setup)
- **DACH-Vorlagen**: 32 offizielle Dokumente
- **Blog-Artikel**: 16 SEO-optimiert, 16.506 Wörter
- **Pflichtschulungen**: 4 Module mit 22 Fragen (DNQP, Hygiene, BtM, Brandschutz)
- **Zertifizierungs-Templates**: 6 (ISO 27001, KTQ, NQZ, Diakonie, Caritas, MDK §114)
- **Benchmark-KPIs**: 10+ mit Destatis/Statistik-Austria/MDS-Quellen
- **Sprachen**: 4 (de, en, tr, ar mit RTL)
- **E2E-Tests**: 3 kritische Flows (läuft)

---

## 14. Deployment

```bash
# 1. Environment
cp .env.example .env.local
# DATABASE_URL, AUTH_SECRET, ANTHROPIC_API_KEY, etc.

# 2. Install
npm install --legacy-peer-deps

# 3. DB Setup (einmalig)
curl "https://repocare.vercel.app/api/setup?token=$SETUP_TOKEN"

# 4. Login
# Demo-Pflegekraft:  pflege@careai.demo / Demo2026!
# Demo-Admin/PDL:    pdl@careai.demo   / Demo2026!
# Owner (versteckt): konstantin.wagner.d@gmail.com / <privat>
```

---

**Kontakt**: konstantin.wagner.d@gmail.com
**Stack-Highlights**: [Next.js 15](https://nextjs.org) · [Claude](https://anthropic.com) · [Supabase](https://supabase.com) · [Vercel](https://vercel.com)

*Gebaut mit autonomer Multi-Agent-Orchestrierung — 30+ parallele Agents, je ein dediziertes Feature pro Agent, zero merge-conflicts durch territoriale Ordner-Partitionierung.*
