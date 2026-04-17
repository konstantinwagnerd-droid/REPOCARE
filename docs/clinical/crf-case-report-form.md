# Case Report Form (CRF) — CAREAI-VAL-01

**Studie:** CAREAI-VAL-01
**Version:** 1.0
**System:** REDCap / OpenClinica

Pseudonymisierte Erfassung pro Teilnehmer:in über 6 Monate. Jede Seite auditier­bar, Datum + Benutzer protokolliert.

## 1. Baseline (bei Einschluss)

### 1.1 Identifikation
- Studien-ID (pseudonym): `CAI-__-___` (Standort-Nr. + fortlaufend)
- Einschluss-Datum: __.__.____
- Einrichtung: [Wien | München | Düsseldorf]

### 1.2 Demographie
- Geburtsjahr: ____ (kein Tagesdatum)
- Geschlecht: ☐ m ☐ w ☐ divers
- Sprache primär: ☐ Deutsch ☐ andere: ____

### 1.3 Pflegegrad / Pflegestufe
- Land: ☐ AT ☐ DE
- Stufe/Grad: 1 2 3 4 5

### 1.4 Komorbiditäten (Charlson-Index)
[ICD-10 Mehrfachauswahl]: Demenz, Diabetes, Herzinsuffizienz, COPD, CKD, Krebs, Schlaganfall, Frakturen-Hx, Depression, …

### 1.5 Medikation
- Anzahl Dauermedikamente: __
- Hochrisiko-Substanzen (Antipsychotika, Sedativa, Anti­koagulantien): ☐ keine ☐ ja: ____

### 1.6 Mobilität (Norton-Subscale)
- Transfer selbst: ☐ selbständig ☐ mit Hilfe ☐ unmöglich
- Gehen: ☐ ohne Hilfe ☐ Gehhilfe ☐ Rollstuhl ☐ bettlägerig

### 1.7 Baseline-Scores
- Braden-Gesamtscore: __ / 23
- MUST-Score: __ (0-2+)
- Morse-Fall-Scale: __
- CAM (Confusion Assessment Method): ☐ negativ ☐ positiv

### 1.8 Ernährung
- Gewicht: __ kg (keine Kommastelle)
- Größe: __ cm
- BMI: __
- Ungewollter Gewichtsverlust in 3 Mon: __ %

## 2. Alle 14 Tage — Folgebesuch

- Assessment-Datum: __.__.____
- Assessor-ID: ____ (verblindet gegenüber CareAI-Output)
- Braden: __ / 23
- MUST: __
- Morse: __
- CAM: ☐ neg ☐ pos
- Gewicht: __ kg
- Neue Diagnose oder Akut-Transport? ☐ nein ☐ ja → AE-Formular
- Medikations-Änderung? ☐ nein ☐ ja: ____
- **Dekubitus-Inspektion** (EPUAP Grad 0-4), Lokalisation: ____

## 3. Event-Formulare (bei Bedarf)

### 3.1 Dekubitus (neu)
- Datum Erstauftreten: __.__.____
- EPUAP-Grad: 1 2 3 4 DTI
- Lokalisation: Steiß / Sakrum / Ferse / Trochanter / Schulter / Ohr / andere: ____
- Kausalitäts-Einschätzung: ☐ Präventions-Lücke ☐ Akut-Erkrankung ☐ unklar
- CareAI hatte für diesen Zeitraum Warnung gegeben? (aus Shadow-Log auszuwerten, nicht vom Assessor)

### 3.2 Sturz
- Datum: __.__.____ Uhrzeit: __:__
- Ort: ____
- Umstände kurz: ____
- Verletzung: ☐ keine ☐ leicht ☐ mittel ☐ schwer (Fraktur) ☐ Tod
- Hospitalisation nötig: ☐ nein ☐ ja

### 3.3 Delir
- Datum Erkennung: __.__.____
- CAM-Ergebnis: ____
- Wahrscheinlicher Trigger: ____
- Dauer (Tage): __

### 3.4 Mangelernährung / Dehydratation
- Gewichtsverlust > 5% in 30d: ☐ nein ☐ ja
- Klinische Zeichen: ____
- Intervention eingeleitet: ____

### 3.5 (Serious) Adverse Event — (S)AE
- Typ: ____
- Beginn: __.__.____
- Schweregrad (CTCAE): 1 2 3 4 5
- Kausalitäts-Einschätzung zu CareAI: unrelated / unlikely / possible / probable / definitive
- Maßnahmen: ____
- Outcome: ☐ resolved ☐ resolved with sequelae ☐ ongoing ☐ fatal

## 4. Monats-Reports

- Dokumentationszeit-Stichprobe (5 zufällige Einträge, in Minuten): ____
- Nutzer-Feedback (freier Text): ____

## 5. Study-End

- Datum End of Observation: __.__.____
- Grund: ☐ planmäßig abgeschlossen ☐ Widerruf ☐ Auszug ☐ Todesfall ☐ anders: ____
- Abschluss-Assessments: Braden, MUST, Morse, CAM

## 6. Post-Study Nutzer-Survey (nur Personal)

- System Usability Scale (SUS): 10 Items, 1-5 Likert
- NPS: "Würden Sie CareAI weiterempfehlen?" 0-10
- Freitext: 3 Top-Pro, 3 Top-Con

## 7. Source Documents

CRF-Einträge sind **sekundäre Aufzeichnungen**. Primärquelle bleibt die Pflege­dokumentation der Einrichtung. Monitor prüft stichprobenartig Source-CRF-Abgleich.

## 8. Qualitätskontrolle

- **Edit-Checks** im CRF-System (Plausi, Bereich, Pflichtfelder).
- **Double-Data-Entry** für Primary-Endpoint-Variablen.
- **Central Monitoring:** statistische Ausreißer-Erkennung.
- **On-Site-Monitoring:** mindestens 3× pro Standort über Laufzeit.

## 9. Audit-Trail

Jede CRF-Änderung protokolliert mit: Datum, Uhrzeit, User-ID, Feld, Alter Wert, Neuer Wert, Grund.

## 10. Archivierung

Nach Studienende: CRF-System gesperrt (Database Lock), Export als signiertes CSV + PDF, Archivierung 10 Jahre.
