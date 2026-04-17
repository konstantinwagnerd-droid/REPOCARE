# docs/ — Zentraler Index

Alle technischen und produktbezogenen Markdown-Dokumente von CareAI, kategorisiert für schnellen Einstieg.

---

## Getting Started

| Dokument | Zweck |
|---|---|
| [`../START-HERE.md`](../START-HERE.md) | Erster Kontakt mit dem Repo — 5-Minuten-Einstieg |
| [`PROJECT-SUMMARY.md`](PROJECT-SUMMARY.md) | Finale 5-Minuten-Orientierung (13 Waves) |
| [`FINAL-TOUR.md`](FINAL-TOUR.md) | 12-Stops Feature-Rundgang für Stakeholder |
| [`DEMO-SCRIPT.md`](DEMO-SCRIPT.md) | Schritt-für-Schritt Investor-Demo (~15 Min) |
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | Komponentenaufbau, Datenfluss, technische Entscheidungen |
| [`API.md`](API.md) | REST-API-Referenz |
| [`api-tests.http`](api-tests.http) | REST-Client-Sammlung (VS Code / JetBrains) |
| [`FEATURE-CHECKLIST.md`](FEATURE-CHECKLIST.md) | Vollständige Feature-Liste zum Abhaken |

## Platform-Core

| Dokument | Zweck |
|---|---|
| [`DEPLOYMENT.md`](DEPLOYMENT.md) | Hetzner-Deploy, Docker-Compose, TLS |
| [`INSTALLER.md`](INSTALLER.md) | Ein-Kommando-Installer-Script für Pilot-Heime |
| [`LLM-INTEGRATION.md`](LLM-INTEGRATION.md) | Multi-Provider-LLM (Anthropic, OpenAI, Mock) |
| [`MONITORING.md`](MONITORING.md) | Grafana-Dashboards, Prometheus, Alerts |
| [`DATABASE-MIGRATION.md`](DATABASE-MIGRATION.md) | Drizzle-Migrations-Workflow, PGlite↔Postgres |
| [`DEVELOPMENT.md`](DEVELOPMENT.md) | Developer-Setup, Conventions |

## Compliance + Sicherheit

| Dokument | Zweck |
|---|---|
| [`SECURITY.md`](SECURITY.md) | DSGVO, EU AI Act, Verschlüsselung, Audit-Konzept |
| [`ANOMALY-DETECTION.md`](ANOMALY-DETECTION.md) | Statistische Outlier-Erkennung |
| [`NOTIFICATIONS.md`](NOTIFICATIONS.md) | Benachrichtigungs-Architektur + DSGVO |
| [`A11Y-AUDIT.md`](A11Y-AUDIT.md) | Accessibility-Audit, Axe-Regeln, WCAG |
| [`PENTEST-CHECKLIST.md`](PENTEST-CHECKLIST.md) | OWASP Top 10 + Pflege-spezifisch |

## Regulatory + Clinical

| Dokument | Zweck |
|---|---|
| [`regulatory/ce-mdr/`](regulatory/ce-mdr/) | CE-MDR-Templates: Risk-File, Clinical-Evaluation, PMS |
| [`clinical/study-protocol.md`](clinical/study-protocol.md) | Clinical-Study-Protokoll N=150, 3 Heime |
| [`clinical/consent-form.md`](clinical/consent-form.md) | Teilnehmer:innen-Einwilligung |
| [`clinical/participant-information-sheet.md`](clinical/participant-information-sheet.md) | Patient Information Sheet |
| [`clinical/crf-case-report-form.md`](clinical/crf-case-report-form.md) | Case Report Form |
| [`clinical/ethics-submission.md`](clinical/ethics-submission.md) | Ethik-Kommission-Einreichung |
| [`clinical/data-monitoring-committee.md`](clinical/data-monitoring-committee.md) | DMC-Charter |

## Qualität + Baselines

| Dokument | Zweck |
|---|---|
| [`PERFORMANCE-BASELINE.md`](PERFORMANCE-BASELINE.md) | Performance-Baseline, Lighthouse-Budgets |
| [`PERFORMANCE.md`](PERFORMANCE.md) | Caching, Bundle-Optimierung, DB-Indexing |
| [`TESTING.md`](TESTING.md) | Test-Pyramide (Vitest, Playwright, Axe, Lighthouse) |
| [`E2E-WITH-PGLITE.md`](E2E-WITH-PGLITE.md) | E2E-Test-Setup mit PGlite |
| [`SMOKE-TESTS.md`](SMOKE-TESTS.md) | Smoke-Tests nach Deployment |
| [`LOAD-TESTING.md`](LOAD-TESTING.md) | k6-Load-Testing-Setup |
| [`OFFLINE-SYNC-INTEGRATION.md`](OFFLINE-SYNC-INTEGRATION.md) | Offline-First Sync + Service-Worker |
| [`LINT-DEBT.md`](LINT-DEBT.md) | Lint-Status (aktuell **0 Issues**) |

## Integrationen

| Dokument | Zweck |
|---|---|
| [`MIGRATION.md`](MIGRATION.md) | Import aus Vivendi, Medifox, MyMedis, Senso, Connext |
| [`TELEMEDIZIN.md`](TELEMEDIZIN.md) | WebRTC-Sprechstunde |
| [`KNOWLEDGE-GRAPH.md`](KNOWLEDGE-GRAPH.md) | FHIR-basierter Pflege-Wissensgraph |

## Ops-Runbooks

| Dokument | Zweck |
|---|---|
| [`BACKUP-STRATEGY.md`](BACKUP-STRATEGY.md) | PITR, Retention, Off-Site-Verschlüsselung |
| [`DISASTER-RECOVERY.md`](DISASTER-RECOVERY.md) | RTO/RPO, Failover-Playbook |
| [`runbooks/dr-drill.md`](runbooks/dr-drill.md) | DR-Drill-Playbook mit Failover-Szenario |
| [`runbooks/dr-scenarios/`](runbooks/dr-scenarios/) | Konkrete DR-Szenarien (Chaos-Engineering / Escape-Room) |
| [`runbooks/on-call-rotation.md`](runbooks/on-call-rotation.md) | On-Call-Rotations-Regeln |
| [`runbooks/vulnerability-disclosure.md`](runbooks/vulnerability-disclosure.md) | Responsible-Disclosure-Policy |
| [`support/playbook.md`](support/playbook.md) | Support-Playbook (Eskalation, SLA) |
| [`support/faq.md`](support/faq.md) | FAQ für Pilot-Kund:innen |
| [`support/canned-responses.md`](support/canned-responses.md) | Vorgefertigte Support-Antworten |
| [`support/ticket-categorization.md`](support/ticket-categorization.md) | Ticket-Kategorisierung |
| [`support/troubleshooting-tree.md`](support/troubleshooting-tree.md) | Entscheidungsbaum für Pflegekräfte |
| [`MOBILE-APP.md`](MOBILE-APP.md) | Expo-Setup, Offline-Sync, Push |
| [`KIOSK.md`](KIOSK.md) | Stations-Tablet-Modus |
| [`DIENSTPLAN-SOLVER.md`](DIENSTPLAN-SOLVER.md) | Constraint-Solver |

## Marketing-Platform

| Dokument | Zweck |
|---|---|
| [`AB-TESTING.md`](AB-TESTING.md) | A/B-Testing mit Chi-Quadrat-Signifikanz |
| [`MARKETING-AUTOMATION.md`](MARKETING-AUTOMATION.md) | Flows: Trigger → Conditions → Actions |
| [`CRM-SYNC.md`](CRM-SYNC.md) | HubSpot/Pipedrive bidirektional |
| [`PRESS-RELEASE-GENERATOR.md`](PRESS-RELEASE-GENERATOR.md) | 5 PM-Templates, Live-Preview, Quality-Score |

## i18n

| Dokument | Zweck |
|---|---|
| [`INTERNATIONAL.md`](INTERNATIONAL.md) | i18n-Architektur, hreflang, Sprachauswahl |
| [`I18N-EXPANSION.md`](I18N-EXPANSION.md) | Expansion auf FR/IT/ES, Lokalisierungs-Prozess |

## Product-Enablement

| Dokument | Zweck |
|---|---|
| [`LMS.md`](LMS.md) | Lernmanagement-System |
| [`VOICE-COMMANDS.md`](VOICE-COMMANDS.md) | 20+ Sprachbefehle |
| [`ONBOARDING.md`](ONBOARDING.md) | Neukunden-Wizard |

## Outreach + Go-To-Market

| Dokument | Zweck |
|---|---|
| [`FOUNDER-OUTREACH/`](FOUNDER-OUTREACH/) | Founder-Outreach-Templates und -Listen |
| [`INVESTOR-OUTREACH.md`](INVESTOR-OUTREACH.md) | Investor-Outreach-Playbook + Listen |
| [`PARTNER-PROGRAM.md`](PARTNER-PROGRAM.md) | Referral-, Whitelabel-, Integration-Partner |
| [`DEMO-VIDEO.md`](DEMO-VIDEO.md) | Storyboard Investor-Demo-Video |
| [`AI-TRAINING.md`](AI-TRAINING.md) | Synthetic Training Datasets + PII-Scan |

## Content + Design

| Dokument | Zweck |
|---|---|
| [`DESIGN-SYSTEM.md`](DESIGN-SYSTEM.md) | Tokens, Typografie, Komponentenbibliothek |
| [`MARKETING-PAGES.md`](MARKETING-PAGES.md) | Marketing-Routen + Copy-Richtlinien |
| [`ANALYTICS.md`](ANALYTICS.md) | KPI-Dashboards, Event-Taxonomie |

## Root-Level-Referenzen

| Dokument | Zweck |
|---|---|
| [`../README.md`](../README.md) | Haupt-Einstieg |
| [`../CHANGELOG.md`](../CHANGELOG.md) | Wave-für-Wave Entwicklungs-Chronik |
| [`../ROADMAP.md`](../ROADMAP.md) | 18-Monats-Produktplan inkl. CE-Mark-Timeline |
| [`../SHOWCASE.md`](../SHOWCASE.md) | 30+ Highlight-Features |
| [`../QUALITY-BAR-AMPLIFIED.md`](../QUALITY-BAR-AMPLIFIED.md) | Qualitätsmaßstäbe + Definition of Done |
| [`../RESEARCH-SPEC.md`](../RESEARCH-SPEC.md) | Forschungs- und Evaluations-Rahmen |
| [`SPRINT-REPORT.md`](SPRINT-REPORT.md) | Wave-Chronik + Readiness-Assessment |
| [`GIT-HISTORY.md`](GIT-HISTORY.md) | Commit-by-Commit-Historie |

---

Dieser Index wird bei jedem größeren Doku-Pass aktualisiert. Wer ein neues `docs/*.md` hinzufügt, trägt es hier ein.
