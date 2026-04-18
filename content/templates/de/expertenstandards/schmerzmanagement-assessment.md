---
id: de-es-schmerz
title: Expertenstandard Schmerzmanagement
jurisdiction: de
category: expertenstandards
applicable_to:
  - stationaer
  - ambulant
legal_reference: § 113a SGB XI
source_url: "https://www.dnqp.de/expertenstandards-und-auditinstrumente/"
version_date: 2023-06-01
assessment_tool: NRS, VAS, BESD (für Menschen mit Demenz)
---

# Schmerzmanagement — Assessment

**Bewohner:in:** {{resident.name}} | Datum/Uhrzeit: {{datum}}

## 1. Schmerz-Screening
Schmerzen aktuell? [ ] ja [ ] nein  →  bei ja: detailliertes Assessment

## 2. NRS (Numeric Rating Scale, 0–10)
- Aktuell: {{nrs_aktuell}}
- Maximal in 24h: {{nrs_max}}
- Durchschnitt in 24h: {{nrs_avg}}
- Akzeptable Schmerzstärke: {{nrs_akzeptabel}}

## 3. Bei Demenz: BESD (Beurteilung Schmerz bei Demenz)
- Atmung unabhängig Vokalisation: {{besd_atmung}}
- Negative Lautäußerung: {{besd_laut}}
- Gesichtsausdruck: {{besd_gesicht}}
- Körpersprache: {{besd_koerper}}
- Trösten: {{besd_trost}}
- **Summe: {{besd_summe}} / 10** → ab 2 Pkt. Schmerz möglich

## 4. Schmerz-Dimensionen
- Lokalisation: {{schmerz_lok}}
- Charakter: {{schmerz_char}} (stechend/dumpf/brennend/kolikartig)
- Zeitlicher Verlauf: {{schmerz_zeit}}
- Verstärkend: {{schmerz_verstaerk}}
- Lindernd: {{schmerz_linder}}

## 5. Medikation (WHO-Stufenschema)
- Stufe 1 Non-Opioide: {{med_s1}}
- Stufe 2 schwache Opioide: {{med_s2}}
- Stufe 3 starke Opioide: {{med_s3}}
- Adjuvantien: {{med_adj}}

## 6. Nicht-medikamentöse Maßnahmen
{{nicht_med}}

## 7. Evaluation
- Wirkungseintritt: {{wirk_eintritt}}
- Nebenwirkungen: {{neben}}
- Re-Assessment: {{reeval}}


---

**Quelle:** [DNQP](https://www.dnqp.de/expertenstandards-und-auditinstrumente/) — DNQP Schmerzmanagement akut+chronisch (2. Akt. 2020)
**Rechtsgrundlage:** § 113a SGB XI
**Stand:** 2023-06-01
