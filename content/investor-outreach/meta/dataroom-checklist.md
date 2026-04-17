# Dataroom Checklist — Was vor dem ersten Call da sein muss

Standard-Struktur mit Ordner-Logik. Kein Dokument darf älter als 30 Tage sein.

## Struktur

```
/01-Overview
  - One-Pager (1 Seite PDF)
  - Deck v-aktuell (PDF)
  - 3-Min-Pitch-Video (link)
  - 8-Min-Produkt-Demo (link)

/02-Company
  - Handelsregister-Auszug
  - Gesellschaftervertrag (aktuellste Fassung)
  - Cap-Table (xlsx, waterfall)
  - ESOP-Plan
  - Beirat-Setup (falls vorhanden)

/03-Product
  - Architecture-Diagramm (PDF)
  - Feature-Roadmap (12 Monate)
  - Tech-Stack-Übersicht
  - Security-Whitepaper
  - AI/ML-Ansatz-Dokument (Fine-Tuning-Strategie)

/04-Financials
  - Aktueller P&L (letzte 12 Monate + YTD)
  - Cashflow-Statement
  - Finanzplan 36 Monate (Base/Upside/Downside)
  - Cohort-Analyse (ARR, Retention, Expansion)
  - Unit-Economics-Breakdown (CAC/LTV/Payback)
  - Burn-Multiple-Tracking

/05-Customers
  - Pilot-Liste mit Vertragsarten, Logos, Anzahl Einrichtungen
  - NPS-Tracking (Methodologie + Quartals-Werte)
  - Case-Studies (3x)
  - Churn- und Expansion-Historie

/06-Team
  - Org-Chart mit FTEs + Verträgen
  - Hiring-Plan 12 Monate
  - Key-Bios (Founder + Direct-Reports)
  - Advisor-Liste mit Equity-Verträgen

/07-References
  - Kunden-Referenzen (3 PDL/Heimleitung mit Einwilligung für Refcall)
  - Frühere Investor-Referenzen (falls vorhanden)
  - Technische Referenzen (ex-Kollegen, CTO-Benchmark)

/08-Legal
  - MSAs / DPAs (Template + ausgefüllte Beispiele)
  - Datenschutz-Folgenabschätzung (DPIA)
  - Technische und Organisatorische Maßnahmen (TOMs)
  - IP-Assignment-Nachweise (alle Contributors)
  - Open-Source-Lizenz-Audit (SBOM)

/09-Compliance
  - ISO 27001 Zertifikat (oder Pre-Audit-Status)
  - DSGVO-Compliance-Dokument
  - KHZG-Förderfähigkeits-Nachweis
  - MDR-Einstufungs-Dokument
  - Penetrations-Test-Report (letzter)

/10-Market
  - TAM/SAM/SOM-Analyse mit Quellen
  - Competitive Landscape (Marktkarte)
  - Go-To-Market-Strategie
  - Kundenakquisitions-Playbook

/11-Seed-Round
  - Term-Sheet (aktuelles)
  - Use-of-Funds-Breakdown
  - Milestone-Plan Post-Seed (Series-A-Readiness)
  - Investor-Rights-Overview
```

---

## Verfügbarkeits-Rules

- **Auf Anfrage:** 01 (Overview)
- **Nach NDA:** 02, 03, 04 (Company, Product, Financials)
- **Vor Term-Sheet:** 05, 06, 09 (Customers, Team, Compliance)
- **Legal/Final-DD:** 07, 08, 10, 11

## Access-Management

- **Tool:** DocSend / Ansarada / Google Drive mit Audit-Logs
- **Watermark:** Jedes PDF mit Investor-Name + Datum + eindeutige Viewer-ID
- **Expire:** 14 Tage Default, verlängerbar auf 30
- **Logs:** Welcher Investor liest welches Dokument wann, Download-Tracking

## Hygiene

- **Monatlich:** Financial-Snapshot aktualisieren
- **Quartalsweise:** Deck + Case-Studies + Cohorts refreshen
- **Bei Event:** Neuen Milestone-Brief in 01 ergänzen

---

## Red-Flags für DD-Blamage (vermeiden!)

- Cap-Table und Gesellschaftervertrag widersprechen sich → Fix vor Seed-Start
- ARR-Zahlen im Deck != Zahlen in Financials → identisch sein muss, bis auf die Kommastelle
- Advisor-Equity nicht in Cap-Table → DD-Killer
- Keine ausgefüllten MSAs im Dataroom → Seriosität angezweifelt
- Kein DPIA/TOM → Healthcare-Investor:innen sehen „nicht ready"
