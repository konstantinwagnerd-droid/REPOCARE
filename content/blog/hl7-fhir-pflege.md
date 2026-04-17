---
title: "HL7 FHIR fuer Pflegeeinrichtungen: Wann es sich lohnt"
description: "FHIR ist der moderne Standard fuer Gesundheitsdaten-Austausch. Fuer welche Pflegeeinrichtungen lohnt er sich, was kostet Integration, und wo sind die Grenzen?"
publishedAt: "2026-04-11"
updatedAt: "2026-04-14"
author: "Marcus Weiss"
category: "Technik"
tags: ["FHIR", "Interoperabilitaet", "HL7", "Integration"]
cover: "/og/blog-fhir.svg"
---

## FHIR in drei Saetzen

FHIR (Fast Healthcare Interoperability Resources) ist der internationale Standard fuer den Austausch von Gesundheitsdaten. Er basiert auf REST und JSON, ist deshalb fuer Entwickler deutlich zugaenglicher als HL7 V2. Seit 2019 ist FHIR R4 stabil, R5 kam 2023, deutsche Profile (KBV, gematik) sind produktiv nutzbar.

Die Frage fuer Pflegeeinrichtungen: **Brauche ich das?** Antwort: Kommt darauf an.

## Wo FHIR wirklich hilft

**Szenario 1: Krankenhaus-Pflegeheim-Uebergaenge.** Ein Bewohner kommt zurueck aus der Akutklinik. Medikation, Diagnosen, Vitalzeichen — alles in FHIR-Resources formuliert — koennten in 30 Sekunden ins Pflegeheim-System importiert werden. Realitaet heute: Entlassbrief in Papier oder PDF, manuelle Uebertragung, Fehlerquote ~15%.

**Szenario 2: Telematikinfrastruktur (TI).** Die deutsche gematik-TI erwartet zunehmend FHIR-Konformitaet. eArztbrief, eMedikationsplan, ePflegeakte — alles FHIR-basiert.

**Szenario 3: ELGA-Anbindung (Oesterreich).** ELGA nutzt CDA-Dokumente, aber die Bewegung zu FHIR hat begonnen. Pflegeeinrichtungen in AT werden mittelfristig FHIR-Konnektoren brauchen.

**Szenario 4: Forschung und Qualitaetssicherung.** QI-Daten in FHIR-Format sind maschinenlesbar, interoperabel, international vergleichbar.

## Wo FHIR noch **nicht** lohnt

- Kleinstheime mit rein analoger Kommunikation — hier ist FHIR overkill.
- Einrichtungen ohne digitale Pflegeakte — zuerst das Grundproblem loesen.
- Spezialgebiete ohne FHIR-Profile (z.B. Palliativ-spezifische Dokumentation) — Standards sind noch in Entwicklung.

## Die wichtigsten FHIR-Resources fuer Pflege

- **Patient**: Stammdaten Bewohner
- **Encounter**: Aufenthalte, Besuche, Schichten
- **Observation**: Vitalzeichen, Messwerte, Assessments
- **Condition**: Diagnosen
- **MedicationStatement** / **MedicationAdministration**: Medikation
- **Procedure**: Durchgefuehrte Massnahmen
- **CarePlan**: Pflegeplan
- **Goal**: Pflegeziele
- **AllergyIntolerance**: Allergien
- **DocumentReference**: Befund-Dokumente

## Die deutschen Profile

Die KBV und gematik haben deutsche FHIR-Profile entwickelt. Relevant fuer Pflege:

- **ISIK (Informationstechnische Systeme in Krankenhaeusern)**: Stufe 1-5
- **MIO Pflegeueberleitungsbogen**: seit 2023 produktiv
- **MIO Zahnbonusheft, Mutterpass** etc. — nicht pflegerelevant
- **MIO Patientenkurzakte**: ab 2025 verpflichtend fuer ePA

Fuer Pflegeeinrichtungen ist der Pflegeueberleitungsbogen das **wichtigste** Profil — er ist Pflicht beim Wechsel zwischen Sektoren.

## Was Integration wirklich kostet

Aus unseren Projekten (indikativ fuer ein Heim mit 120 Betten):

- **Basiskonformitaet** (Patient, Encounter, Observation lesen/schreiben): 15.000-25.000 EUR
- **Pflegeueberleitungsbogen (MIO)**: 8.000-12.000 EUR zusaetzlich
- **Telematikinfrastruktur-Anbindung** (Konnektor, Karten, Zertifikate): 3.000-6.000 EUR Einrichtung + 200-300 EUR/Monat laufend
- **eArztbrief-Empfang und -Senden**: 5.000-8.000 EUR
- **Gesamt realistisch**: 30.000-50.000 EUR Einrichtung, 3.000-5.000 EUR/Jahr Betrieb

Foerderungen moeglich: Krankenhauszukunftsfonds (KHZF) und in AT manche Landesfoerderungen.

## Die Alternative: CSV/PDF reicht oft

Fuer viele kleinere Einrichtungen ist FHIR 2026 noch nicht realistisch. Alternativen:

- Strukturierte PDFs mit definiertem Template
- CSV-Export/Import mit festen Spalten
- E-Mail mit standardisierten Anhaengen

Das ist nicht elegant, aber funktional. Wichtig: Auch hier **DSGVO-konform** verschluesseln und Zweckbindung einhalten.

## Was CareAI anbietet

Unsere FHIR-Roadmap (Stand 2026):

- **Q2/2026**: Basiskonformitaet Patient, Encounter, Observation
- **Q3/2026**: MIO Pflegeueberleitungsbogen (Senden + Empfangen)
- **Q4/2026**: eMedikationsplan, eArztbrief-Empfang
- **2027**: ELGA-Konnektor (Oesterreich)

Kleinere Heime koennen die Module einzeln aktivieren. Grosse Traeger bekommen die komplette FHIR-Suite.

## Die kommenden Pflichten

Pflegeeinrichtungen sollten bedenken:

- Ab 2026 ist die **ePA** in DE fuer alle gesetzlich Versicherten automatisch (Opt-out). Pflege-Relevante Dokumente werden zunehmend dort erwartet.
- Die **Telematik-Anbindung** wird fuer ambulante Pflegedienste schrittweise verpflichtend, stationaere folgen.
- Der **MIO-Pflegeueberleitungsbogen** ist bei Wechsel zwischen Sektoren de-facto Standard.

## Fazit

FHIR lohnt sich fuer Einrichtungen, die viel mit Krankenhaeusern arbeiten, die TI-Anbindung brauchen, oder die Teil eines grossen Traegers sind. Fuer kleinere Heime ist die sauberste interne Dokumentation und ein standardisierter PDF-Uebergabebogen oft die bessere Investition — bis die Pflichten greifen. Dann hilft eine Software, die FHIR schon "mitbringt".

---

**Quellen**: HL7 FHIR R4 Spezifikation; gematik MIO Pflegeueberleitungsbogen 2023; KHZF Foerderrichtlinien 2024.
