# 04 — Clinical Evaluation Report (CER)

**Dokument-ID:** CAI-REG-004
**Version:** 1.0 — Draft
**Basis:** MDR Art. 61 + Annex XIV Part A, MDCG 2020-1, MEDDEV 2.7/1 Rev. 4

## 1. Zweck und Umfang

Bewertung der **klinischen Sicherheit und Leistung** von CareAI CDS. Evaluiert wird:

- Eignung für deklarierte Zweckbestimmung
- Leistungsfähigkeit (primäre + sekundäre Endpunkte)
- Sicherheit (unerwünschte Ereignisse)
- Nutzen-Risiko-Verhältnis

## 2. Scope

- **Equivalent Device:** Nicht anwendbar (keine äquivalente CE-Software auf Markt mit identischer Zweckbestimmung verfügbar). Daher **eigene klinische Daten zwingend**.
- **Methodik:** Literaturrecherche **+** eigene klinische Validierungsstudie (PMCF-Plan im Anschluss).

## 3. Literaturrecherche-Strategie

### 3.1 Datenbanken

- PubMed / MEDLINE
- EMBASE
- CINAHL (pflegewissenschaftlich)
- Cochrane Library
- CareLit (DACH-pflegewissenschaftlich)

### 3.2 Suchstrategie (Beispiel)

```
("pressure ulcer" OR "decubitus" OR "pressure injury")
  AND ("machine learning" OR "artificial intelligence" OR "predictive model"
       OR "clinical decision support")
  AND ("nursing home" OR "long-term care" OR "elderly care")
  AND (year ≥ 2015)
```

Weitere Suchblöcke für: Sturzrisiko, Delir, Mangelernährung, NLP in Pflegedokumentation, Usability medizinischer Software.

### 3.3 Ein-/Ausschlusskriterien

**Eingeschlossen:** Peer-reviewed, Volltext verfügbar, Studiendesign mindestens prospektiv-observationell, ≥ 2015.

**Ausgeschlossen:** Case-Reports < 10 Fälle, rein theoretische Papers ohne Daten, Settings außerhalb Langzeitpflege (soweit Daten nicht übertragbar).

### 3.4 Bewertungs-Appraisal

Nach **Oxford Centre for EBM Levels of Evidence** + **MDCG 2020-1 Appendix III**. Jede Quelle wird bewertet für:
- Relevanz (Population, Intervention, Outcome)
- Methodische Qualität (Study-Design, Sample-Size, Bias)
- Übertragbarkeit auf CareAI-Kontext

## 4. Clinical Investigation Plan (CIP)

Da Literatur allein nicht vollständig abdeckt (proprietäre Modelle, spezifische DACH-Pflegedokumentations-Schemata SIS), wird eine **eigene Clinical Investigation** durchgeführt (siehe `docs/clinical/study-protocol.md`).

**Kernmerkmale:**
- Multizentrisch, 3 Einrichtungen (Wien + 2 DE)
- Prospektiv, 6 Monate Beobachtungszeitraum
- N = 150 Bewohner:innen
- Primary Endpoint: **Sensitivity/Specificity der Dekubitus-Risikoprädiktion ≥ 85% / ≥ 80%**
- Ethik-Votum erforderlich (EK Wien / DE Ethikkommissionen)

## 5. Primary Endpoints

| Endpoint | Ziel | Messung |
|----------|------|---------|
| Sensitivity Dekubitus-Risiko | ≥ 85% | ROC-Analyse gegen Goldstandard Braden + Follow-up |
| Specificity Dekubitus-Risiko | ≥ 80% | wie oben |
| PPV Sturzrisiko | ≥ 50% | Beobachtete Stürze / Alerts |
| False-Alarm-Rate | ≤ 15% | Alerts ohne klinischen Kontext |

## 6. Secondary Endpoints

- Zeitersparnis Dokumentation (Baseline vs. CareAI-Nutzung): ≥ 60%
- Mitarbeitendenzufriedenheit (NPS): ≥ 40
- Audit-Sicherheit (MDK-Prüf-Score): Verbesserung vs. Baseline
- Rate der erkannten Dekubitus-Ereignisse im Frühstadium: ≥ 20% erhöht

## 7. Post-Market Clinical Follow-up (PMCF) Plan

Nach MDR Annex XIV Part B. Ziel: kontinuierliche Evidenzsammlung nach CE-Mark.

### 7.1 PMCF-Aktivitäten

| Aktivität | Frequenz | Verantwortlich |
|-----------|----------|-----------------|
| Real-World-Performance-Monitoring (Accuracy, Drift) | kontinuierlich, monatliche Reports | Data-Science-Team |
| Nutzer-Feedback-Befragung (in-App + E-Mail) | quartalsweise | CX-Team |
| Incident-Tracking (Vigilance) | kontinuierlich | PRRC |
| Literatur-Update-Review | halbjährlich | Reg. Affairs |
| Subgroup-Performance-Analyse (Alter, Geschlecht, Pflegegrad) | halbjährlich | Data-Science |
| PMCF-Studie (erweitert auf 5 Heime) | Jahr 2 post-CE | Clinical Lead |
| PSUR-Report (Periodic Safety Update) | jährlich | PRRC |

### 7.2 PMCF-Report

Jährlicher PMCF-Report an Benannte Stelle. Trigger für Re-Evaluation bei:
- ≥ 5% Accuracy-Abfall
- ≥ 3 Vigilance-Meldungen ähnlichen Typs
- neue State-of-the-Art-Evidenz

## 8. Nutzen-Risiko-Bewertung

- **Quantifizierter Nutzen:** erwartete Reduktion Dekubitus-Inzidenz um 20-30% (Literatur: Kottner et al. 2019, Nakagami et al. 2021).
- **Quantifiziertes Restrisiko:** nach Risk-Control (Dok. 03) Rest-RPN aller Risiken ≤ akzeptabel.
- **Bewertung:** Nutzen überwiegt deutlich, Verhältnis positiv.

## 9. Schlussfolgerung

CareAI CDS erfüllt nach Datenlage (Literatur + geplante klinische Validierung) die **Anforderungen an klinische Leistung und Sicherheit** gemäß MDR Annex I GSPR. CE-Konformität aus klinischer Perspektive wird empfohlen, **vorbehaltlich** der positiven Ergebnisse der klinischen Validierungsstudie (siehe `docs/clinical/`).

## 10. Unterschriften

- **Clinical Lead:** _____________________ Datum: _______
- **Regulatory Affairs:** _____________________ Datum: _______
- **PRRC:** _____________________ Datum: _______
