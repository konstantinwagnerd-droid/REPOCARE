# 10 — EU AI Act — Hochrisiko-KI Compliance

**Dokument-ID:** CAI-REG-010
**Version:** 1.0 — Draft
**Basis:** Verordnung (EU) 2024/1689 (AI Act), wirksam 02.08.2026, volle Anwendbarkeit Hochrisiko-KI 02.08.2027

## 1. Einstufung

### Kategorie: Hochrisiko-KI

Nach **Annex III §5(b)** des AI Act: Systeme zur Verwendung im Gesundheitsbereich, die als Sicherheitskomponente eines Produkts dienen, **das unter harmonisierte EU-Produktvorschriften** (MDR) fällt, **UND** einer Konformitätsbewertung durch Dritte unterliegen → **Hochrisiko** (Art. 6(1) AI Act).

CareAI = Klasse IIa (Dritt-Bewertung durch NB) + Anwendung in Gesundheitsbereich → **Hochrisiko-KI**.

## 2. Verpflichtungen als Anbieter (Provider) gemäß Art. 16 AI Act

| Verpflichtung | AI-Act-Artikel | CareAI-Umsetzung |
|--------------|----------------|-------------------|
| Risikomanagement-System | Art. 9 | verzahnt mit ISO 14971 (Dok. 03) |
| Data Governance | Art. 10 | siehe §4 |
| Technische Dokumentation | Art. 11 + Annex IV | integriert in MDR-TD (Dok. 05) |
| Aufzeichnungs-Pflichten (Logging) | Art. 12 | Audit-Log + Modell-Betrieb-Log |
| Transparenz + Info für Nutzer | Art. 13 | IFU + In-App-Hinweise (Dok. 08) |
| Menschliche Aufsicht | Art. 14 | Human-in-the-Loop (Design-Prinzip) |
| Robustheit, Genauigkeit, Cybersecurity | Art. 15 | siehe §5 |
| Konformitätsbewertung | Art. 43 | integriert mit MDR-NB (Art. 43(3)) |
| Konformitätserklärung + CE | Art. 47-48 | eine DoC deckt MDR + AI Act ab |
| Registrierung in EU-Datenbank | Art. 49 | EUDAMED + AI-Act-Datenbank (geplant) |
| Post-Market-Monitoring | Art. 72 | verzahnt mit PMCF |
| Incident-Reporting | Art. 73 | verzahnt mit Vigilance |

## 3. Risikomanagement (Art. 9)

Bereits über ISO 14971 abgedeckt (Dok. 03). Zusätzliche AI-spezifische Risiken:

- Trainingsdaten-Bias → Subgroup-Fairness-Monitoring
- Modell-Drift → Drift-Detection
- Adversarial Inputs → Robustness-Testing
- Distributional Shift → Out-of-Distribution-Erkennung

## 4. Data Governance (Art. 10)

### 4.1 Trainings-, Validierungs- und Testdaten

- **Repräsentativität:** Trainingsset enthält Bewohner:innen aller Pflegegrade, beide Geschlechter, Altersbereich 65-100, multimorbide Profile.
- **Relevanz:** Nur Daten aus stationärer Langzeitpflege (keine Akut-Daten).
- **Fehler-/Bias-Prüfung:** Subgroup-Performance-Analyse dokumentiert.
- **Annotation:** durch mindestens zwei unabhängige DGKP, Inter-Rater-Reliability dokumentiert.
- **Datenschutz:** Pseudonymisierung vor ML-Pipeline, DPIA verpflichtend.
- **Datensatz-Karten (Data-Sheets):** pro Dataset dokumentiert (Motivation, Composition, Collection, Preprocessing, Uses, Distribution, Maintenance — nach Gebru et al. 2021).

### 4.2 Special Categories (DSGVO Art. 9)

Gesundheitsdaten = Sonderkategorie. Rechtsgrundlage: Art. 9(2)(h) iVm Art. 6(1)(c/f) + § 2 GuKG / § 22 BDSG.

## 5. Robustheit, Genauigkeit, Cybersecurity (Art. 15)

- **Accuracy-Metriken:** deklariert + überwacht (siehe CER Dok. 04).
- **Robustness:** adversarial testing gegen leichte Input-Perturbationen; Fail-safe bei OOD.
- **Cybersecurity:** siehe Dok. 05 §4 + IEC 81001-5-1 konform.
- **Resilienz gegen Fehler:** Graceful degradation — bei Modell-Unsicherheit → "niedriges Vertrauen, bitte manuell prüfen"-Hinweis.

## 6. Transparenz (Art. 13) & Human Oversight (Art. 14)

### 6.1 Transparenz

- Alle Nutzer sehen: "Sie interagieren mit einer KI-gestützten Entscheidungshilfe."
- Logo-Badge **"AI-assisted"** auf jeder Prädiktions-Anzeige.
- Confidence-Score sichtbar (hoch/mittel/niedrig + numerischer Wert).
- Feature-Importance / XAI-Hinweise ("Gewichtsverlust 4kg in 30 Tagen trägt maßgeblich zur Risiko-Einschätzung bei").

### 6.2 Human Oversight

- Pflegefachperson **muss** alle Empfehlungen bestätigen, bevor sie in Pflegeplan übernommen werden.
- Override jederzeit möglich, mit Begründungs-Feld (freiwillig).
- Training-Modul für Pflegefachpersonen verpflichtend vor Nutzung (Modul "Umgang mit KI-Hinweisen").

## 7. Aufzeichnungs-Pflichten (Art. 12 — Logging)

Hochrisiko-KI muss betrieblich geloggt werden:

- Zeitstempel pro Inferenz
- Input-Hash (kein PII-Klartext, aber reproducierbare Referenz)
- Modellversion
- Output (Risiko-Score + Klasse)
- Confidence
- Nutzer-Quittierung (accepted/overridden)

**Retention:** mindestens 6 Monate (Art. 19) — wir implementieren 24 Monate für PMCF.

## 8. Konformitätsbewertung

- Integriert mit MDR-Konformitätsbewertung (Art. 43(3) AI Act): **gleiche Benannte Stelle**.
- Annex IX MDR + AI-Act-Module werden gemeinsam bewertet.

## 9. Registrierung (Art. 49 + Art. 71)

Eintrag in EU-Datenbank für Hochrisiko-KI (separat oder integriert mit EUDAMED — folgt Implementierungs-Akten der Kommission).

## 10. Post-Market Monitoring + Serious Incident Reporting (Art. 72 + 73)

- Systematisches Monitoring (integriert mit PMCF, Dok. 04).
- Serious Incidents binnen **15 Tagen** an zuständige nationale Behörde + Kommission (kürzere Frist bei breitem Schaden: 48h / unverzüglich).

## 11. Fundamental Rights Impact Assessment (FRIA — Art. 27)

Da CareAI von **öffentlichen Einrichtungen** (z.B. städtische Pflegeheime) genutzt werden kann, erstellen wir als **Anbieter** eine **FRIA-Vorlage**, die Betreiber nutzen können. Inhalte:

- Welche Grundrechte berührt (Menschenwürde, Privatsphäre, Nicht-Diskriminierung, Recht auf Gesundheit)
- Betroffene Personengruppen
- Minderungsmaßnahmen
- Human-Oversight-Setup
- Beschwerdeweg

## 12. AI Literacy (Art. 4)

CareAI stellt **Schulungsmaterial** für Betreiber bereit (E-Learning, 30 Min), damit Nutzer:innen ausreichende KI-Kompetenz entwickeln. Completion-Tracking möglich.

## 13. Prohibited Practices (Art. 5)

CareAI betreibt **keine** verbotenen Praktiken:
- Kein Social Scoring
- Keine Manipulation/Dark-Patterns
- Keine Real-Time Remote Biometric Identification
- Keine Emotion-Recognition am Arbeitsplatz in manipulativer Art

## 14. Verzahnung mit DSGVO

- DPIA obligat (bereits durch Sonderkategorien-Verarbeitung gegeben).
- Art. 22 DSGVO (automatisierte Einzelentscheidung) — **nicht einschlägig**, da Human-in-the-Loop.
- Betroffenenrechte (Art. 15-22) vollständig umgesetzt.

## 15. Verantwortlichkeiten

| Rolle | AI-Act-Pflicht |
|-------|-----------------|
| PRRC + AI-Compliance-Officer | Einhaltung, Meldungen |
| Data-Science-Lead | Data Governance, Modell-Qualität |
| QM | Prozess-Integration mit ISO 13485/14971 |
| DPO | DSGVO-Schnittstelle |
