# CareAI Showcase — Die 20 eindrucksvollsten Features

Schnellzugriff auf die Features, die Stakeholder, Förder-Juries und Investor:innen am häufigsten sehen wollen. Jedes Feature mit direktem Route-Link und 1–2-Zeilen-Beschreibung.

> Die App muss lokal laufen (`npm run dev`). Demo-Logins siehe [`README.md`](README.md).

---

## 1. KI-Spracheingabe mit SIS-Strukturierung

**Route:** `/app/voice`
Pflegekraft spricht frei — CareAI transkribiert, kategorisiert nach SIS-Themenfeldern (1–6) und schlägt strukturierte Einträge vor. Human-in-the-Loop bestätigt.

## 2. Schichtbericht-Generator

**Route:** `/app/schichtbericht`
Aus allen Ereignissen einer Schicht erzeugt CareAI in < 3 Sek. eine lesbare Übergabe für die Folgeschicht — mit Hervorhebung kritischer Änderungen.

## 3. Revisionsfestes Audit-Log

**Route:** `/admin/audit`
Append-only Log mit Hash-Chain. Jede Aktion ist nachvollziehbar — wer, was, wann, warum. MDK-/MD-prüfungsfest.

## 4. Bewohner-Detail mit 6 Tabs

**Route:** `/app/bewohner/[id]`
SIS · Maßnahmenplan · Vitalwerte (live Recharts) · Medikation + MAR · Wunddoku · Risiko-Scores — alle Daten in einem Deck zusammengefasst.

## 5. Wundverlauf-Zeitraffer

**Route:** `/app/bewohner/[id]/wunden-timelapse`
Scrollt durch die Wundfotos eines Bewohners animiert und zeigt Flächen-, Farb- und Heilungstrend über Zeit.

## 6. Dienstplan-Solver

**Route:** `/admin/schedule`
Constraint-Solver berechnet optimalen Wochenplan unter Berücksichtigung von Arbeitszeit, Urlaub, Qualifikationen und Wunsch-Präferenzen.

## 7. Kiosk-Modus für Stations-Tablets

**Route:** `/kiosk`
Touch-optimierte Ansicht für ein fest montiertes Tablet: Tagesübersicht, Medikamentenrunde, Angehörige, Aktivitäten, Notfall.

## 8. Command-Palette (Cmd+K)

**Route:** global
Tastaturgetriebene Navigation durch die gesamte App. Suche nach Bewohner:innen, Aktionen, Seiten — blitzschnell.

## 9. Anomalie-Erkennung

**Route:** `/admin/anomaly`
Statistische Outlier-Erkennung auf Vitalwerten (Blutdruck, Puls, Temperatur) und Audit-Mustern.

## 10. Angehörigen-Portal

**Route:** `/family`
Wohlbefindens-Score, Tagesübersicht, Aktivitäten-Timeline, Nachricht an Team — für Angehörige mit echtem Mehrwert.

## 11. Qualitätsindikatoren § 113 SGB XI

**Route:** `/admin/dashboards`
Automatische Berechnung aller 10 MDK-Indikatoren (Dekubitus, Sturz, Gewichtsabnahme, …) in Echtzeit, integriert in das Admin-Dashboard.

## 12. Multi-Tenant Benchmark

**Route:** `/admin/benchmarks`
Anonymisierte Cross-Facility-KPIs: Wo steht meine Einrichtung im Vergleich zum Durchschnitt ähnlicher Häuser?

## 13. LMS (Lernmanagement)

**Route:** `/lms`
Fortbildungsmodule, Quiz, Zertifikate, Spaced-Repetition — damit das Team regulatorisch auf Stand bleibt.

## 14. Migrations-Tool

**Route:** `/admin/migration`
Importiert Bestandsdaten aus Vivendi, Medifox, MyMedis, Senso, Connext — inklusive Datenintegritäts-Report.

## 15. Telemedizin-Sprechstunde

**Route:** `/telemedizin`
WebRTC-Videocall mit ärztlichen Partner:innen, eingebunden in den Pflegekontext (Bewohner, Medikation, Vitalwerte sichtbar).

## 16. Knowledge-Graph

**Route:** `/admin/knowledge-graph`
FHIR-basierte Verknüpfung von Diagnosen, Medikamenten, Maßnahmen und Observations — navigierbare Ontologie.

## 17. Whitelabel-Engine

**Route:** `/admin/whitelabel`
Pro-Einrichtung-Branding: Logo, Farben, Domain, Footer-Text — ohne Code-Änderung.

## 18. Investor-Data-Room

**Route:** `/investors`
Pitch-Deck, Financial-Model, Cap-Table, Team, Traction, Q&A — alles an einem Ort für Due-Diligence.

## 19. Mobile Apps (Expo)

**Route:** `mobile/` + `mobile-family/`
Native iOS/Android-Apps mit Offline-First-Sync für Pflegekräfte und Angehörige.

## 20. Incident-Post-Mortem

**Route:** `/admin/incidents`
Blameless-Template für Beinahe-Unfälle und Ereignisse — Root-Cause-Analyse, Folgeaktionen, Lessons Learned.

---

## Weitere Highlights (Ehrenerwähnung)

- **Voice-Commands** (`/app` + Mikrofon-Shortcut) — 20+ Sprachbefehle
- **Partner-Programm** (`/partner`) — Referral + Whitelabel + Integration
- **Subunternehmer-Portal** (`/subunternehmer`) — für Honorarkräfte
- **Onboarding-Wizard** (`/onboarding`) — Neukunden-Setup in 8 Schritten
- **PDF-Exports** — Bewohner-Akte, Medikationsplan, Dienstplan per Klick
- **Report-Builder** — Drag-&-Drop-Reports mit PDF-/Excel-Export
