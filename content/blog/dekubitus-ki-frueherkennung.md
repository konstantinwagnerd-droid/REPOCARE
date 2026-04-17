---
title: "Dekubitusprophylaxe digital: Ab wann KI-Frueherkennung sinnvoll ist"
description: "Algorithmische Dekubitus-Risikobewertung — Evidenz, Grenzen und wie sie sich mit der Bradenskala und dem Expertenstandard vertraegt."
publishedAt: "2026-04-12"
updatedAt: "2026-04-15"
author: "Dr. Julia Lenhart"
category: "Qualitaet"
tags: ["Dekubitus", "Praevention", "KI", "Expertenstandard"]
cover: "/og/blog-dekubitus.svg"
---

## Dekubitus ist vermeidbar — und trotzdem haeufig

Der Expertenstandard Dekubitusprophylaxe 2017 ist eindeutig: Nahezu alle Dekubiti bei wachen, mobilen Bewohnern sind durch konsequente Prophylaxe vermeidbar. Trotzdem zeigen die QI-Daten 2024: Im Bundesdurchschnitt entstehen in 3,1% der Faelle pro Halbjahr neue Dekubiti ab Grad 2.

Wo koennte KI helfen? Und wo waere sie Gefahr statt Hilfe?

## Was KI heute wirklich kann

Drei Einsatzfelder haben reale Evidenz:

**1. Texterkennung in Wunddokumentationen.** NLP-Modelle erkennen Dekubitus-Beschreibungen in Freitext zuverlaessig. Genauigkeit: >95% bei deutschem Pflegekontext (CareAI intern, 2025).

**2. Bild-basierte Wundklassifikation.** Computer-Vision-Modelle koennen auf standardisierten Wundfotos die Grade 1-4 mit ~87% Sensitivitaet und 92% Spezifitaet einschaetzen (Fleck et al. 2023). Aber: **nur bei guten Fotos**, und nur als **Unterstuetzung**, nicht als Ersatz.

**3. Risikopraediktion aus Verlaufsdaten.** Modelle, die aus der Kombination von Mobilitaet, Ernaehrung, Kontinenz, Hautzustand ein Risiko vorhersagen, erreichen AUC-Werte von 0,79-0,84 (Gupta 2024). Das ist besser als die Bradenskala allein (AUC ~0,74).

## Was KI **nicht** kann

- **Die klinische Einschaetzung ersetzen**. Der Blick der erfahrenen Pflegekraft auf die Haut ist weiter Goldstandard.
- **Ohne gute Inputs zuverlaessig arbeiten**. Schlecht fotografierte Wunde = schlechter Output. Luechenhafte Dokumentation = falsche Risikoeinschaetzung.
- **Individuelle Biographie einbeziehen**. Eine Person mit Demenz, die staendig ihre Position aendert, weil sie unruhig ist, hat anderes Risiko als ein Modell es berechnet.

## Der praktische Einsatz: Drei Stufen

**Stufe 1: Dokumentations-Assistenz (heute schon sinnvoll).**
KI strukturiert Wundbeschreibungen, schlaegt fehlende Dokumentationspunkte vor, erkennt fehlende Verlaufskontrollen. **Niedriges Risiko**, **hoher Nutzen**.

**Stufe 2: Risiko-Fruehhinweis (heute mit Einschraenkung moeglich).**
KI markiert Bewohner mit deutlichem Risiko-Anstieg (z.B. mobile Bewohnerin, die 5 Tage in Folge aufs Bett begrenzt war). Fachkraft entscheidet ueber Interventionen. **Mittleres Risiko**, hoher Nutzen mit guter UX.

**Stufe 3: Bild-basierte Grad-Vorklassifikation (heute mit Vorsicht).**
KI gibt einen Vorschlag zur Gradeinstufung auf Basis eines standardisierten Fotos. Fachkraft bestaetigt. **Mittleres Risiko** (EU AI Act High Risk wahrscheinlich), Nutzen nur bei sehr konsistenter Foto-Hygiene.

## Was das fuer die Prozessgestaltung heisst

Einbettung muss stimmen:

- **Bradenskala bleibt**: Der Expertenstandard verlangt sie, die MD-Pruefung kontrolliert sie, die Fachlichkeit braucht sie. KI ist **Ergaenzung**, nicht Ersatz.
- **14-taeglich** Fachkraft-Review: Jede KI-Einstufung wird mit der Fachkraft abgeglichen.
- **Transparenz**: Der Vorschlag zeigt die Gruende ("mobil nur 1x in letzten 3 Tagen, Gewicht -2kg in 14 Tagen, Kontinenz verschlechtert").
- **Auditierbarkeit**: Jede KI-Empfehlung wird geloggt, jede Bestaetigung oder Ablehnung ebenfalls.

## Der EU-AI-Act-Blick

Dekubitus-Risikopraediktion mit direkter Konsequenz fuer Pflegeplanung ist mit hoher Wahrscheinlichkeit **Hochrisiko-System**. Das heisst: CE-Konformitaet, technische Dokumentation, Human Oversight, Logging.

Dokumentations-Assistenz ohne algorithmische Bewertung ist **Limited Risk**, nur Transparenzpflichten.

## Datenschutz-Aspekte

Wundfotos sind Gesundheitsdaten nach Art. 9 DSGVO. Spezifische Anforderungen:

- **Einwilligung der Bewohnerin** (oder Betreuung) zur Anfertigung und Speicherung
- **Begrenzter Zugriff** — nicht jede Pflegekraft sieht alle Fotos
- **Aufbewahrungsfrist** — 30 Jahre analog Behandlungsakte
- **Kein Upload zu externen Diensten** ohne AVV + EU-Hosting

## Wann Einrichtungen profitieren

Realistisch: Einrichtungen mit >60 Betten, digitaler Pflegeakte und standardisiertem Wundmanagement-Prozess profitieren heute. Kleineres Setup: fokussieren Sie auf saubere Bradenskala und konsequente Dokumentation — das ist der groessere Hebel.

## Unsere Position bei CareAI

Wir bieten:

- **Stufe 1 aktiv** seit 2024: NLP-Assistenz in der Wunddokumentation
- **Stufe 2 in Beta** seit Q3/2025: Risiko-Fruehhinweise, 18 Pilot-Einrichtungen
- **Stufe 3 geplant** fuer 2027: Bild-Klassifikation, aber nur mit CE-Kennzeichnung und separatem Modul

Wir sind bewusst konservativ. Lieber ein bisschen spaeter am Markt als mit einem Produkt, das Fehl-Diagnosen triggert.

## Fazit

KI kann bei der Dekubitusprophylaxe helfen, aber sie ersetzt **nicht** die Fachlichkeit. Der grosse Hebel bleibt menschlich: konsequentes Umlagern, Ernaehrung, Hautpflege, Braden-Skala. Digitale Systeme unterstuetzen dort, wo sie Zeit sparen — nicht dort, wo sie Entscheidungen uebernehmen.

---

**Quellen**: Expertenstandard Dekubitusprophylaxe DNQP 2017; Fleck et al. 2023 Wound Management; Gupta 2024 Journal of Nursing Research; eigene Auswertungen 2025/2026.
