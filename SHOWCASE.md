# CareAI Showcase — Die 30+ eindrucksvollsten Features

Schnellzugriff auf die Features, die Stakeholder, Förder-Juries und Investor:innen am häufigsten sehen wollen. Jedes Feature mit direktem Route-Link und 1–2-Zeilen-Beschreibung.

> Die App muss lokal laufen (`npm run dev`). Demo-Logins siehe [`README.md`](README.md).

---

## Pflege-Kern

### 1. KI-Spracheingabe mit SIS-Strukturierung
**Route:** `/app/voice`
Pflegekraft spricht frei — CareAI transkribiert, kategorisiert nach SIS-Themenfeldern (1–6) und schlägt strukturierte Einträge vor. Human-in-the-Loop bestätigt.

### 2. Schichtbericht-Generator
**Route:** `/app/schichtbericht`
Aus allen Ereignissen einer Schicht erzeugt CareAI in < 3 Sek. eine lesbare Übergabe für die Folgeschicht — mit Hervorhebung kritischer Änderungen.

### 3. Bewohner-Detail mit 6 Tabs
**Route:** `/app/bewohner/[id]`
SIS · Maßnahmenplan · Vitalwerte (live Recharts) · Medikation + MAR · Wunddoku · Risiko-Scores — alle Daten in einem Deck zusammengefasst.

### 4. Wundverlauf-Zeitraffer
**Route:** `/app/bewohner/[id]/wunden-timelapse/[woundId]`
Scrollt durch die Wundfotos eines Bewohners animiert und zeigt Flächen-, Farb- und Heilungstrend über Zeit.

### 5. Command-Palette (Cmd+K)
**Route:** global
Tastaturgetriebene Navigation durch die gesamte App. Suche nach Bewohner:innen, Aktionen, Seiten — blitzschnell.

### 6. Voice-Commands
**Route:** `/app/voice-commands`
20+ Sprachbefehle (WebSpeech) für freihändige Pflege am Bett.

---

## Admin + Compliance

### 7. Revisionsfestes Audit-Log
**Route:** `/admin/audit`
Append-only Log mit Hash-Chain. Jede Aktion ist nachvollziehbar — wer, was, wann, warum. MDK-/MD-prüfungsfest.

### 8. Dienstplan-Solver
**Route:** `/admin/dienstplan-solver` (+ `/admin/schedule`)
Constraint-Solver berechnet optimalen Wochenplan unter Berücksichtigung von Arbeitszeit, Urlaub, Qualifikationen und Wunsch-Präferenzen.

### 9. Anomalie-Erkennung
**Route:** `/admin/anomaly`
Statistische Outlier-Erkennung auf Vitalwerten (Blutdruck, Puls, Temperatur) und Audit-Mustern.

### 10. Qualitätsindikatoren § 113 SGB XI
**Route:** `/admin/dashboards`
Automatische Berechnung aller 10 MDK-Indikatoren (Dekubitus, Sturz, Gewichtsabnahme, …) in Echtzeit.

### 11. Multi-Tenant Benchmark
**Route:** `/admin/benchmarks`
Anonymisierte Cross-Facility-KPIs: Wo steht meine Einrichtung im Vergleich zum Durchschnitt ähnlicher Häuser?

### 12. Incident-Post-Mortem
**Route:** `/admin/incidents`
Blameless-Template für Beinahe-Unfälle — Root-Cause-Analyse, Folgeaktionen, Lessons Learned.

### 13. Whitelabel-Engine
**Route:** `/admin/whitelabel`
Pro-Einrichtung-Branding: Logo, Farben, Domain, Footer-Text — ohne Code-Änderung.

### 14. Impersonation (Support)
**Route:** `/admin/impersonation`
Support-Zugriff mit vollem Audit-Trail und Zeitlimit.

### 15. Migrations-Tool
**Route:** `/admin/migration`
Importiert Bestandsdaten aus Vivendi, Medifox, MyMedis, Senso, Connext — inklusive Datenintegritäts-Report.

---

## Tools & UX

### 16. Kiosk-Modus für Stations-Tablets
**Route:** `/kiosk`
Touch-optimierte Ansicht für fest montierte Tablets: Tagesübersicht, Medikamentenrunde, Angehörige, Aktivitäten, Notfall.

### 17. Angehörigen-Portal
**Route:** `/family`
Wohlbefindens-Score, Tagesübersicht, Aktivitäten-Timeline, Nachricht an Team.

### 18. Guided Tours
**Route:** `/admin/tours`
In-App-Tour-Builder mit Schritten, Zielgruppe und Launch-Triggern — senkt Time-to-First-Value.

### 19. Welcome-Onboarding
**Route:** `/onboarding-welcome`
Personalisierter Willkommens-Flow für neue Pflegekräfte, PDLs und Admins.

### 20. Telemedizin-Sprechstunde
**Route:** `/telemedizin`
WebRTC-Videocall mit ärztlichen Partner:innen, eingebunden in den Pflegekontext.

### 21. LMS (Lernmanagement)
**Route:** `/lms`
Fortbildungsmodule, Quiz, Zertifikate, Spaced-Repetition.

### 22. Knowledge-Graph
**Route:** `/admin/knowledge-graph`
FHIR-basierte Verknüpfung von Diagnosen, Medikamenten, Maßnahmen und Observations — navigierbare Ontologie.

---

## Growth & Marketing

### 23. A/B-Testing-Plattform
**Route:** `/admin/ab-testing`
Experiments mit Chi-Quadrat-Signifikanz, Winner-Picking, Conversions — komplette Plattform inkl. Assignment- und Results-API.

### 24. Marketing-Automation
**Route:** `/admin/marketing-automation`
Flows mit Trigger → Conditions → Actions. E-Mail-Sequenzen, Lead-Scoring, Drip-Kampagnen.

### 25. CRM-Sync
**Route:** `/admin/crm-sync`
Bidirektionale Sync mit HubSpot/Pipedrive — Contacts, Deals, Activities. Push + Pull + Status.

### 26. Press-Release-Generator
**Route:** `/admin/press-release`
5 PM-Templates, dynamisches Form, Live-Preview, Quality-Score — Ein-Klick PR-Draft.

### 27. Investor-Data-Room
**Route:** `/investors`
Pitch-Deck, Financial-Model, Cap-Table, Team, Traction, Q&A — alles an einem Ort für Due-Diligence.

### 28. Partner-Programm
**Route:** `/partner`
Referral-, Whitelabel- und Integration-Partner mit eigenem Portal.

### 29. Subunternehmer-Portal
**Route:** `/subunternehmer`
Für Honorarkräfte mit Besuchsdokumentation, Audit, Patient:innen-Zuweisung.

---

## Internationalisierung (5 Sprachen)

### 30. Marketing DE + EN + FR + IT + ES
**Routes:** `/` (DE) · `/en` · `/fr` · `/it` · `/es`
Vollständige Marketing-Präsenz in 5 Sprachen inkl. Blog, ROI-Rechner, Case-Studies, Kontakt — mit hreflang-Alternates.

---

## Mobile Apps

### 31. Pflegekraft-App (Expo) + Angehörigen-App (Expo) + Offline-Sync
**Pfad:** `mobile/` + `mobile-family/` + `src/lib/offline/`
Native iOS/Android-Apps mit IndexedDB-Queue-Sync — arbeiten auch ohne WLAN.

---

## Ops-Assets (ohne Web-Route)

- **Grafana-Monitoring** — Dashboards + Alerts, siehe [`docs/MONITORING.md`](docs/MONITORING.md)
- **Hetzner-Deploy + Installer-Script** — siehe [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md) und [`docs/INSTALLER.md`](docs/INSTALLER.md)
- **Disaster-Recovery-Drill** — siehe [`docs/runbooks/`](docs/runbooks/)
- **Pilot-Kit (3 Wiener Heime)** — siehe [`docs/support/`](docs/support/)
- **Escape-Room / Chaos-Engineering** — siehe [`docs/runbooks/`](docs/runbooks/)
- **Load-Testing + Pentest-Checkliste** — [`docs/LOAD-TESTING.md`](docs/LOAD-TESTING.md), [`docs/PENTEST-CHECKLIST.md`](docs/PENTEST-CHECKLIST.md)
- **Smoke-Tests** — [`docs/SMOKE-TESTS.md`](docs/SMOKE-TESTS.md)

## Compliance-Assets (ohne Web-Route)

- **CE-MDR-Pipeline** — Risk-Files, Clinical-Evaluation, Post-Market-Surveillance in [`docs/regulatory/`](docs/regulatory/)
- **Clinical-Validation** — Studien-Protokoll N=150, 3 Heime, in [`docs/clinical/`](docs/clinical/)
- **DSGVO / EU AI Act / ISO 27001 / ISO 13485** — siehe [`docs/SECURITY.md`](docs/SECURITY.md)

---

## Weitere Highlights (Ehrenerwähnung)

- **Onboarding-Wizard** (`/onboarding`) — Neukunden-Setup in 8 Schritten
- **PDF-Exports** — Bewohner-Akte, Medikationsplan, Dienstplan per Klick
- **Report-Builder** (`/admin/report-builder`) — Drag-&-Drop-Reports
- **Feature-Flags** (`/admin/feature-flags`) — Toggle pro Einrichtung
- **Zeiterfassung** (`/admin/zeiterfassung` + `/app/zeiterfassung`) — mit Pausen-Regeln
- **Badges** (`/admin/badges`) — Gamification für Pflegekräfte
- **Webhooks** (`/admin/webhooks`) — Event-getriebene Integrationen
- **Backup-Management** (`/admin/backup`) — PITR + Off-Site
- **AI-Training Datasets** (`/admin/ai-training`) — Synthetic, DSGVO-konform
- **A11Y + Performance In-App Audits** (`/admin/a11y-audit`, `/admin/performance`)
