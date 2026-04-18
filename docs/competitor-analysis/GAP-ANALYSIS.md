# DACH Pflegesoftware — Gap-Analyse CareAI

**Stand:** 2026-04-18
**Methodik:** Produktbroschüren + öffentliche Webseiten der Wettbewerber + domain knowledge DNQP / SGB XI / ÖQZ.

Legende: ✓ = vorhanden · ~ = teilweise · ✗ = fehlt · — = nicht relevant für Produkt

## Feature-Matrix

| Feature | Medifox | Vivendi | Senso | voize | euregon | Novatec | ATOSS | medatixx | **CareAI** | **Prio** | **Aufwand** |
|---|---|---|---|---|---|---|---|---|---|---|---|
| **Pflegeplanung SIS** | ✓ | ✓ | ✓ | ~ | ✓ | ✓ | — | — | ✓ | — | — |
| **DNQP Expertenstandards (10)** | ✓ | ✓ | ~ (5) | ✗ | ✓ (8) | ✓ | — | — | ✗ | **MUST** | M |
| **Pflegediagnosen NANDA-I/PES** | ~ | ✓ | ✗ | ✗ | ~ | ✓ | — | — | ✗ | **MUST** | M |
| **NIC/NOC Intervention-Bibliothek** | ✓ | ✓ | ✗ | ✗ | ~ | ✓ | — | — | ✗ | **SHOULD** | M |
| **Dienstplan m. Qualifikations-Check** | ✓ | ✓ | ~ | — | ✓ | ✓ | ✓ | — | ~ | **MUST** | M |
| **ArbZG-Compliance Check** | ✓ | ✓ | ~ | — | ✓ | ✓ | ✓ | — | ✗ | **MUST** | S |
| **Medikation + AMTS-Check** | ✓ | ✓ | ~ | ✗ | ~ | ~ | — | ✓ | ✗ | **MUST** | L |
| **BMP (§31a SGB V)** | ✓ | ✓ | ✗ | ✗ | ~ | ✗ | — | ✓ | ✗ | **SHOULD** | S |
| **Wund-Doku + Foto-Vermessung** | ✓ | ✓ | ✓ | ✗ | ✓ | ✓ | — | — | ~ | **MUST** | M |
| **Bewohner-Aufnahme-Assistent** | ✓ | ✓ | ✓ | — | ✓ | ✓ | — | — | ✗ | **MUST** | S |
| **Leistungsnachweis SGB XI / AT-PG** | ✓ | ✓ | ✓ | — | ✓ | ✓ | — | — | ✗ | **MUST** | M |
| **Pflegevisite strukturiert** | ✓ | ✓ | ~ | — | ✓ | ✓ | — | — | ✗ | **MUST** | S |
| **Biographie (DNQP-konform)** | ✓ | ✓ | ~ | — | ~ | ✓ | — | — | ✗ | **MUST** | S |
| **Expertenstandards-Assessments (Braden, Norton, Tinetti...)** | ✓ | ✓ | ~ | ✗ | ✓ | ✓ | — | — | ✗ | **MUST** | M |
| **CIRS (Fehlermeldung anonym)** | ✓ | ✓ | ✗ | — | ~ | ~ | — | — | ~ | **SHOULD** | S |
| **QPR Qualitätsindikatoren** | ✓ | ✓ | ✓ | — | ✓ | ~ | — | — | ✗ | **SHOULD** | M |
| **DTA § 302 SGB V** | ✓ | ✓ | ✓ | — | ✓ | — | — | — | ✗ | **SHOULD** | L |
| **ePA / TI-Konnektor** | ✓ | ~ | ~ | — | ~ | — | — | ✓ | ✗ | **COULD** | XL |
| **e-Rezept** | ✓ | — | — | — | — | — | — | ✓ | ✗ | **COULD** | L |
| **ELGA (AT)** | — | — | — | — | — | ✓ | — | — | ✗ | **SHOULD** | L |
| **HEIMaufG-Meldung (AT)** | — | — | — | — | — | ✓ | — | — | ✗ | **MUST (AT)** | S |
| **BTHG / Eingliederungshilfe** | ~ | ✓ | ✗ | — | ~ | ~ | — | — | ✗ | **COULD** | XL |
| **Tourenplanung ambulant** | ✓ | — | ✓ | — | ✓ | ✗ | — | — | ✗ | **COULD** | L |
| **DATEV-Export** | ✓ | ✓ | ✓ | — | ✓ | ~ | — | — | ~ | **SHOULD** | S |
| **Sprachdokumentation** | ~ (voize) | ~ | ✓ | ✓ | ✓ | ~ | — | — | ~ | **SHOULD** | M |
| **Offline-Sync Mobile** | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | — | — | ~ | **MUST** | L |
| **Angehörigen-App** | ~ | ~ | ✓ | — | ~ | ~ | — | — | ✓ | — | — |
| **KI-Risiko-Prognose** | ~ | ✗ | ~ | — | ✗ | ✗ | — | — | ✓ | ✓ Vorteil | — |
| **KI-Schichtbericht** | ✗ | ✗ | ✗ | ~ | ✗ | ✗ | — | — | ✓ | ✓ Vorteil | — |

## Top-10 Must-Have-Gaps für Implementierung

Priorisiert nach **MDK/MD-Relevanz** × **Marktchance** × **Machbarkeit in Phase 1**:

1. **DNQP Expertenstandards-Modul** (10 Standards, je 6 Ebenen) — ohne das kein MDK-Pass
2. **Pflegediagnosen NANDA-I (PES-Schema)** — strukturierte Problem/Ätiologie/Symptom-Erfassung
3. **NIC Interventionen / NOC Outcomes** — Bibliothek mit Auswahlhilfe
4. **Dienstplan mit Qualifikations-Matrix + ArbZG-Check** — kritisches SaaS-Differenzial
5. **AMTS-Check Medikation** (Interaktion + Doppelverordnung + Allergie-Kontra)
6. **Wund-Doku mit L×B×T + Typ-Klassifikation** (existiert rudimentär, ausbauen)
7. **Bewohner-Aufnahme-Assistent** (strukturierter 7-Tage-Workflow)
8. **Leistungsnachweis** (SGB XI § 36-45b DE + Pflegegeldstufen AT)
9. **Pflegevisite** (PDL-Template quartalsweise)
10. **Biographie** (DNQP-konform, 10 Kapitel)

**Bonus AT:** HEIMaufG-Meldung (Pflicht bei jeder Freiheitsbeschränkung) — wenig Aufwand, hoher AT-Market-Fit.

## Strategische Ableitung

- **CareAI-Vorteile halten + ausbauen:** KI-Risiko-Prognose, KI-Schichtbericht, moderne UX (shadcn), Angehörigen-App.
- **Parität erreichen bei:** Expertenstandards, Pflegeplanung-Tiefe, Dienstplan, Medikation/AMTS.
- **Abstand halten:** BTHG (Vivendi-Domäne), TI/ePA (2-Jahres-Projekt, erst wenn relevant).
- **AT-first Feature:** HEIMaufG, ELGA, Pflegegeldstufen — Novatec-Parität = AT-Markt erobern.
