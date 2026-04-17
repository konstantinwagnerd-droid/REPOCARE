# Klinisches Studienprotokoll

## Titel

**Klinische Validierung von CareAI — Prädiktive Risikoerkennung in der stationären Langzeitpflege** (Akronym: **CAREAI-VAL-01**)

**Version:** 1.0 — Draft
**Datum:** 2027-Q1
**Sponsor:** CareAI GmbH, Wien
**Studienleitung:** [Clinical Lead, DGKP + akademische Affiliation], [Medical Advisor MD]
**EUDAMED-/WHO-ICTRP-Registrierung:** vor Studienstart

---

## 1. Hintergrund & Rationale

Dekubitus, Stürze, Mangelernährung und Delir gehören zu den häufigsten pflegesensitiven Ereignissen in stationärer Langzeitpflege und sind mit erheblicher Morbidität, Mortalität, Ressourcen-Bindung und Lebensqualitäts-Einbußen assoziiert. Die **European Pressure Ulcer Advisory Panel (EPUAP)** schätzt Prävalenz 8-23% in Langzeitpflege; Sturz-Inzidenz 1.5 Stürze/Bett/Jahr (AGS Guideline).

Frühzeitige Risikoidentifikation ist Schlüssel für Prävention. Etablierte Tools (Braden, Morse, MUST) sind papierbasiert, zeitaufwändig, stark rater-abhängig. KI-basierte Clinical-Decision-Support-Systeme (CDS) zeigen in Akut-Settings vielversprechende Ergebnisse (Kottner 2019; Nakagami 2021), für **Langzeitpflege** ist die Evidenz jedoch limitiert.

**CareAI** integriert strukturierte Pflegedokumentation (SIS), freie Tagesberichte (via NLP), Vitalwerte und Medikationsdaten in ein multimodales Prädiktionsmodell. Diese Studie validiert Leistung und Sicherheit in realer DACH-Langzeitpflege.

## 2. Ziele

### 2.1 Primäres Ziel

Prospektive Validierung der **diagnostischen Güte** der CareAI-Dekubitus-Risiko-Klassifikation gegenüber etabliertem Goldstandard (Braden-Skala + 14-Tage-Follow-up-Inspektion).

### 2.2 Sekundäre Ziele

- Evaluation Sensitivity/Specificity für **Sturz**-Prädiktion.
- Evaluation für **Mangelernährung** (MUST-Verlauf).
- Evaluation für **Delir-Frühzeichen** (CAM-Assessment).
- Zeitersparnis in Dokumentation.
- Mitarbeitendenzufriedenheit (NPS, System-Usability-Scale).
- Safety-Signale / Adverse-Event-Monitoring.

## 3. Studiendesign

- **Typ:** Prospektiv, multizentrisch, non-randomisiert, kontrolliert (Pre-/Post-Vergleich intra-institutionell).
- **Dauer:** 6 Monate Beobachtung + 4 Wochen Baseline.
- **Standorte:** 3 Einrichtungen (1× Wien, 2× Deutschland — Bayern, NRW).
- **Fallzahl:** N ≈ 150 Bewohner:innen (≈ 50 pro Standort).

## 4. Endpunkte

### 4.1 Primary Endpoint

**Sensitivity CareAI-Dekubitus-Risiko-Klassifikation ≥ 85%** bei Specificity ≥ 80% (2-seitiges 95%-CI, untere Grenze muss Schwelle überschreiten).

### 4.2 Secondary Endpoints

| Endpoint | Messung | Ziel |
|----------|---------|------|
| Sturz-Prädiktion PPV | Alerts/beobachtete Stürze 7d | ≥ 50% |
| Mangelernährung AUC | ROC vs. MUST-Verlauf 30d | ≥ 0.80 |
| Delir Frühzeichen Sens. | CAM-positive Fälle | ≥ 70% |
| Zeitersparnis Dokumentation | Baseline vs. CareAI-Nutzung | ≥ 60% |
| SUS (System Usability Scale) | Post-Study Survey | ≥ 70 |
| NPS Mitarbeitende | Survey | ≥ 40 |

## 5. Ein-/Ausschlusskriterien

### 5.1 Einschluss

- Bewohner:in einer teilnehmenden Einrichtung
- Alter ≥ 65 J
- Pflegegrad ≥ 2 (DE) / Pflegestufe ≥ 2 (AT)
- Informed Consent durch Bewohner:in oder gesetzl. Vertreter:in
- Mindest-Aufenthaltsdauer 6 Monate prognostiziert

### 5.2 Ausschluss

- Palliativstatus (Lebenserwartung < 4 Wochen)
- Teilnahme an konkurrierender Studie mit gleicher Indikation
- Fehlende Einwilligungsfähigkeit UND keine gesetzliche Vertretung

## 6. Fallzahl-Berechnung (Power-Analyse)

**Annahmen:** Erwartete Sensitivity 88%, Ziel ≥ 85%, Alpha 0.05, Power 0.80, Prävalenz Dekubitus-Risiko-Ereignis 15% über 14 Tage.

- Erforderliche positive Fälle: ≈ 68
- Bei Inzidenz 15% pro 2-Wochen-Fenster, 12 Fenster je Bewohner:in → **N = 150** (unter Annahme Attrition 15%).

Unabhängige biostatistische Prüfung durch CRO-Partner.

## 7. Datenerhebung

### 7.1 Variablen

- **Baseline:** Demographie, Pflegegrad, Komorbiditäten, Medikation, Mobilität, Ernährungszustand, kognitiver Status.
- **Alle 14 Tage:** Braden-Score (manuell durch DGKP), MUST-Score, Sturz-Risiko-Assessment.
- **Kontinuierlich:** SIS-Einträge, Tagesberichte, Vitalwerte, Medikations-Änderungen.
- **Outcome-Assessments** durch verblindeten DGKP-Assessor alle 14 Tage + bei Ereignis.
- **Events:** jedes Dekubitus (EPUAP Grad 1-4 dokumentiert), Sturz, Delir, akute Mangelernährung.

### 7.2 CRF

Standardisierter Case-Report-Form (siehe `crf-case-report-form.md`). Elektronisch via **REDCap** oder **OpenClinica**.

## 8. Verblindung

- **Outcome-Assessoren** sind verblindet gegenüber CareAI-Risiko-Klassifikation.
- **Bewohner-seitig:** keine Verblindung (ethisch nicht vertretbar, da Standard-Pflege weiterläuft).
- **CareAI-Hinweise** werden während Studienzeit protokolliert, aber Interventionen erfolgen nach etabliertem Standard.

## 9. Statistische Analyse

- **Primär-Analyse:** ROC-Analyse, Sensitivity/Specificity mit 95%-CI (Clopper-Pearson).
- **Secondary:** deskriptiv + inferenzstatistisch (Chi² für kategorial, Wilcoxon für ordinal/nonparametrisch, t-Test bei Normalverteilung).
- **Subgruppen-Analyse:** Alter, Geschlecht, Pflegegrad, Multimorbidität (Charlson-Index).
- **Missing-Data:** MAR-Annahme, Multiple Imputation (m=20).
- **Interim-Analyse** nach 50% Rekrutierung (Monat 3) — DSMB-Review.

## 10. Ethik

- **Ethikkommission-Einreichung:** Medizinische Universität Wien + regionale EKs in DE.
- **Deklaration von Helsinki** (aktuelle Fassung) + ICH-GCP.
- **Vulnerable Population:** Schutzmaßnahmen (Vertrauens-Person, mehrstufiges Consent).
- **Studienleitungs-Team:** GCP-zertifiziert.

## 11. Datenschutz

- **Rechtsgrundlage:** DSGVO Art. 9(2)(j) (Forschung) + ergänzend § 2f DSG (AT) / § 27 BDSG (DE).
- **Pseudonymisierung** vor Datenverlassen der Einrichtung.
- **Studien-DB** in AT-Rechenzentrum, ISO 27001, separater Mandant.
- **DPIA** erstellt und von DPO freigegeben.
- **Aufbewahrung:** 10 Jahre post-Publikation, dann Löschung (außer aggregierte Ergebnisse).
- **Betroffenenrechte** (DSGVO Art. 15-22) vollständig umgesetzt, inkl. Widerrufs-Prozess.

## 12. Safety-Monitoring

- **DSMB (Data Safety Monitoring Board):** 3 externe Expert:innen (Geriatrie, Pflegewissenschaft, Biostatistik).
- **Stopping Rules:** bei ≥ 3 SAEs mit plausibler Kausalbeziehung zu CareAI.
- **Meldeweg:** SAE binnen 24h an Sponsor + DSMB; Serious Incidents zusätzlich binnen 15 Tagen an Behörde/EUDAMED.

## 13. Publikations-Plan

| Publikation | Journal-Ziel | Zeitpunkt |
|--------------|---------------|-----------|
| Study Protocol | Trials, BMC Nursing | nach Ethik-Freigabe |
| Main Results | Journal of the American Medical Directors Association (JAMDA) | Q4/27 – Q1/28 |
| Nutzer-Perspektive | Pflegewissenschaft | Q2/28 |
| ML-Methodik | npj Digital Medicine | Q2/28 |

Preprint auf medRxiv. Open Access präferiert.

## 14. Projekt-Organisation

| Rolle | Verantwortlich |
|-------|-----------------|
| Sponsor-Repräsentant | CEO CareAI |
| Principal Investigator | Clinical Lead |
| Coordinating Investigator pro Standort | PDL + DGKP |
| Data Manager | CRO-Partner |
| Biostatistik | externer Statistiker |
| Monitor | CRO |
| DSMB | 3 externe Expert:innen |

## 15. Studien-Timeline

| Monat | Aktivität |
|-------|-----------|
| M0 | Ethik-Einreichung |
| M2 | Ethik-Votum erwartet |
| M3 | Initiation Visits, Training |
| M4 | Recruitment Start |
| M4-M10 | Beobachtungszeitraum (6 Mon) |
| M10 | Last Patient Out |
| M11 | Data Cleaning |
| M12 | Statistical Analysis |
| M13 | Final Study Report + Publikation eingereicht |

## 16. Referenzen

- Kottner J et al. *Int J Nurs Stud.* 2019.
- Nakagami G et al. *J Wound Care.* 2021.
- EPUAP/NPIAP/PPPIA. International Pressure Injury Guideline 2019.
- ICH-GCP E6(R2).
- ISO 14155:2020 Clinical Investigation of Medical Devices for Human Subjects.
