# Pilot-Kit — Anleitung zum Ausdrucken

**8 druckbare PDFs als Markdown-Quellen.** Zielgruppe: CareAI Sales-Team, das in Einrichtungen geht.

---

## Dateien

| # | Datei | Umfang | Drucken als |
|---|-------|--------|-------------|
| 1 | `01-one-pager.md` | 1 A4 beidseitig | A4 Farbe |
| 2 | `02-rollout-fahrplan-8-wochen.md` | 4 A4 | A4 Farbe |
| 3 | `03-dsgvo-fact-sheet.md` | 2 A4 | A4 SW oder Farbe |
| 4 | `04-pflegekraft-quick-guide.md` | 1 A4 beidseitig | A4 Farbe, laminieren |
| 5 | `05-pdl-dashboard-walkthrough.md` | 4 A4 | A4 Farbe |
| 6 | `06-md-pruefung-vorbereitung.md` | 3 A4 | A4 Farbe |
| 7 | `07-integration-architektur.md` | 2 A4 | A4 Farbe (wegen ASCII-Diagramm Schrift klein) |
| 8 | `08-preisliste.md` | 2 A4 | A4 Farbe |

---

## Druckempfehlungen

- **Papier:** 120g, matt oder seidenmatt. Nicht glänzend — spiegelt unter LED-Decke.
- **Drucker:** Farb-Laser. Tintenstrahl ist OK, aber schmiert bei Feuchtigkeit (Kaffee im Pflegezimmer!).
- **Bindung:** Kit-Hülle mit 8 Kapiteln, Heftstreifen oder simple Büroklammer.
- **Quick-Guide (04) laminieren:** übersteht Desinfektion, Handschuhe, Hose-Waschgang.

---

## Workflow Markdown → PDF

1. `pandoc 01-one-pager.md -o one-pager.pdf --pdf-engine=xelatex -V geometry:margin=2cm -V mainfont="Inter"`
2. Oder: VSCode + Extension „Markdown PDF".
3. Oder: Web-Tool md-to-pdf.com.

**Einheitliches Template:**
```bash
pandoc [datei].md -o [datei].pdf \
  --pdf-engine=xelatex \
  --template=.pandoc/careai-template.tex \
  -V mainfont="Inter" \
  -V geometry:margin=2cm
```

(Template liegt in `.pandoc/` im Marketing-Repo.)

---

## Design-Notiz

- **Farben:** CareAI-Mint (#00C389) für Header, Anthrazit (#1A1A1A) für Text.
- **Typografie:** Inter für Headline, Source Sans 3 für Body.
- **Logo:** links oben jede Seite, unaufdringlich.
- **Footer:** „CareAI GmbH · Wien · DSGVO-konform · ISO 27001" auf jeder Seite.

---

## Übersetzungs-Status

| Sprache | Status | ETA |
|---------|--------|-----|
| Deutsch (Österreich) | ✅ vollständig | — |
| Deutsch (Deutschland) | 🔄 in Anpassung | Q3 2026 |
| English | 📋 geplant | Q4 2026 |
| Italienisch (Südtirol) | 📋 geplant | Q1 2027 |

---

## Update-Zyklus

- Quartalsweise Review durch Produkt + Sales.
- Bei Preisänderung: nur `08-preisliste.md` aktualisieren + allgemeinen Nachlauf der Verteilung.
- Änderungen über Pull-Request, reviewed von Comms + Legal.

**Owner:** Marketing-Ops · marketing@careai.at
