# ATOSS Medical Solutions (atoss.com)

**Stand:** 2026-04-18
**Quellen:** atoss.com (Medical Solutions)
**Marktposition:** Dienstplan-Spezialist für Healthcare, ~200 Krankenhäuser + Pflegeheime DACH

## Hauptprodukt

- **ATOSS Staff Efficiency Suite — Medical**
- **ATOSS Workforce Scheduling**
- **ATOSS Mobile Workforce**

## Kernstärken Dienstplan

- **Qualifikations-Matching:** jede Schicht definiert Min/Max pro Qualifikation (z.B. "min. 2 Fachkräfte Früh"), System warnt/verhindert Planung
- **Arbeitszeitgesetz ArbZG:** automatische Prüfung Ruhezeiten 11h, max 10h/Tag, Wochenarbeitszeit
- **Tarif-Engine:** AVR Caritas / Diakonie / TVöD-K / TV-L / individuelle Hausverträge
- **Wunsch-Portal:** Mitarbeiter geben Dienstwünsche in App ein
- **Tauschbörse:** genehmigungspflichtiger P2P-Tausch
- **Jahresarbeitszeitkonten:** Über-/Unterstunden, Ausgleichsrechnung
- **Bedarfs-Forecasting:** KI-Prognose Personalbedarf nach Bewohner-Mix/Pflegegrad
- **Compliance-Check:** Jugendarbeitsschutz, Mutterschutz, Schwerbehinderung

## Integrationen

- **SAP HCM / SuccessFactors**
- **Loga / P&I** (Personalabrechnung)
- **DATEV Lohn**
- **Zeiterfassung-Hardware:** Kaba, Interflex, PCS

## Preismodell

- Enterprise, typisch €8-15/MA/Monat + Einmalgebühr Einführung

## CareAI-relevante Gaps

CareAI hat bereits `/admin/dienstplan-solver` Route aber kein sichtbares Qualifikations-Matching. Must-Have-Features:
1. **Qualifikations-Matrix pro Schicht** (min Fachkraft / Azubi / Hilfskraft)
2. **ArbZG-Check** (Ruhezeiten, max Stunden) mit Warnung
3. **Wunsch-Portal** für Pflegekräfte
4. **Bedarfs-Forecast** basierend auf Bewohner-Mix (Pflegegrad → Min-Personal)
