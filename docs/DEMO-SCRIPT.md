# Demo-Script — Investor / Förderung (15 Minuten)

## Ziel

In 15 Minuten: Produktvision, echte Funktionen, Impact und regulatorische Compliance zeigen.

## Vorbereitung

- `pnpm db:push && pnpm db:seed` ausgeführt
- `pnpm dev` läuft
- Browser auf `http://localhost:3000`, Zoom 110%
- Inkognito-Fenster parallel offen (für Rollen-Wechsel)

---

## 0 — Warum CareAI (2 Min, ohne Bildschirm)

> „In DACH fehlen bis 2030 rund 500.000 Pflegekräfte. Gleichzeitig verbringen Pflegende bis zu 35% ihrer Arbeitszeit mit Dokumentation. CareAI gibt ihnen einen Teil dieser Zeit zurück.“

## 1 — Marketing-Landing (2 Min)

- `/` öffnen
- Hero: „Mehr Zeit für Menschen. Weniger für Papierkram.“
- Down-Scroll: Feature-Grid → Impact (SDGs) → Preise → Datenschutz → FAQ
- Key Takeaway: **DSGVO, EU AI Act, Hetzner Hosting — vom ersten Moment compliant.**

## 2 — Pflegekraft-Workflow (5 Min)

- **Login** als `pflege@careai.demo` / `Demo2026!`
- **Dashboard:** „Das sieht die Schwester morgens nach dem Einstempeln.“
  → KPIs, offene Aufgaben, letzte Einträge
- **Bewohner:in Anna Berger** öffnen (Liste → Detail)
  - Tabs: **Übersicht** (Stammdaten, Risiko-Scores), **SIS** (6 Themenfelder + R1–R7), **Maßnahmenplan**, **Tagesberichte**, **Vitalwerte** (Charts!), **Medikation** (Plan + MAR), **Wunddoku**, **Risiken** (Trend)
- **Spracheingabe** (`/app/voice`)
  - Mikrofon tippen, 5 Sek warten, stoppen
  - Transkription-Loader → KI-Struktur-Loader → SIS-Vorschlag + Vitals + Maßnahmen
  - „Die Pflegekraft hätte jetzt in 20 Sekunden dokumentiert, was sonst 7 Minuten Tippen kostet.“
- **Schichtbericht** (`/app/handover`): Button „Bericht generieren“ → 2 Sek Loader → strukturierte Übergabe.

## 3 — Administration & Compliance (3 Min)

- Logout → Login `admin@careai.demo`
- **Admin-Übersicht:** KPIs der Woche, Dokumentationszeit `-67%`, NPS `+62`
- **Audit-Log** (`/admin/audit`): „Jede Änderung. Revisionsfest. MDK-sicher.“
- **Dienstplan:** Wochenraster
- **Reports:** Pflegegrad-Übersicht, MDK-Export-Buttons
- **Einstellungen:** Hosting Falkenstein, AV-Vertrag, AES-256

## 4 — Angehörige (2 Min)

- Logout → Login `familie@careai.demo`
- **Angehörigen-Portal:** „Nur was Familie sehen soll. Keine medizinischen Details. Wohlbefinden, Aktivitäten, Nachrichten.“
- Wichtig: Read-only, keine Doku-Einsicht → DSGVO-konform

## 5 — Zusammenfassung (1 Min)

- **Impact:** 67% weniger Doku-Zeit, +21% Mitarbeiterbindung (Pilot-Daten)
- **Markt:** 14.000 stationäre Einrichtungen DACH · 200.000 € ARR/Einrichtung möglich
- **Compliance:** DSGVO + EU AI Act + MDK ready — kein Nachzügler
- **Next:** Whisper-Integration, FHIR-Export, 3 zusätzliche Piloten Q3

## Typische Fragen & Antworten

| Frage | Antwort |
|---|---|
| Warum nicht Vivendi? | Vivendi ist 90er-Jahre Ergonomie. Pflegekräfte dokumentieren lieber am Papier als dort. CareAI ist mobile-first + Spracheingabe. |
| Wie trainiert ihr? | Zwei Piloten, eigene Datenbasis + generalisierte Open-Source-Modelle. Kein Training auf Kundendaten ohne explizite Opt-in. |
| Was ist mit Halluzinationen? | Jeder KI-Output ist als Vorschlag markiert, Pflegekraft bestätigt. Audit-Log speichert „vorgeschlagen durch KI v1.2“. |
| Lock-in? | Voller Export in FHIR + CSV jederzeit, on-prem Option für Enterprise. |
