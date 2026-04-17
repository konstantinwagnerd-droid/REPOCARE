---
title: "DSGVO Art. 9 in der Pflege: Gesundheitsdaten sicher verwalten"
description: "Besondere Kategorien personenbezogener Daten in der Pflege — was Art. 9 DSGVO verlangt, welche Rechtsgrundlagen greifen, und wie Einwilligung, Aufbewahrung und Loeschung praktisch funktionieren."
publishedAt: "2026-03-23"
updatedAt: "2026-04-01"
author: "Fatima Al-Khatib"
category: "Recht & Compliance"
tags: ["DSGVO", "Datenschutz", "Art. 9", "Gesundheitsdaten"]
cover: "/og/blog-dsgvo.svg"
---

## Gesundheitsdaten sind keine normalen Daten

Pflege ist Datenverarbeitung im Hochrisiko-Bereich. Jeder Eintrag ins Berichteverlauf, jede Medikations-Notiz, jede Sturzbeobachtung — das sind Daten, die nach Art. 9 DSGVO zu den **besonderen Kategorien personenbezogener Daten** gehoeren. Die Verarbeitung dieser Daten ist grundsaetzlich **verboten**, es sei denn, eine der zehn Ausnahmen des Art. 9 Abs. 2 greift.

Fuer die Pflege sind in der Regel relevant:

- **Art. 9 Abs. 2 lit. a**: Ausdrueckliche Einwilligung
- **Art. 9 Abs. 2 lit. b**: Arbeitsrecht und Sozialschutz
- **Art. 9 Abs. 2 lit. c**: Schutz lebenswichtiger Interessen
- **Art. 9 Abs. 2 lit. h**: Gesundheitsversorgung

Die meisten Pflegeheime stuetzen ihre Kern-Verarbeitung auf lit. h — die medizinische und pflegerische Versorgung. Einwilligung (lit. a) ist nur erforderlich, wenn die Verarbeitung **ueber** die Kern-Versorgung hinausgeht (Fotos, Video-Angehoerigenkommunikation, KI-Analysen).

## Die vier Saeulen der Compliance

**1. Zweckbindung.** Gesundheitsdaten duerfen nur zu den Zwecken verwendet werden, fuer die sie erhoben wurden. Die Medikationsdaten einer Bewohnerin duerfen **nicht** fuer Marketing oder fuer KI-Training verwendet werden, ohne dass eine neue Rechtsgrundlage vorliegt.

**2. Datenminimierung.** Nur die Daten, die wirklich benoetigt werden. Eine typische Falle: Dokumentationssysteme, die "pro Schicht alle Vitalzeichen" erfassen, auch wenn medizinisch nicht indiziert. Das ist 2026 nicht nur ueberfluessig (Entbuerokratisierungsgesetz Pflege II), sondern DSGVO-problematisch.

**3. Integritaet und Vertraulichkeit.** Verschluesselung, Zugangskontrolle, rollenbasierte Rechte (RBAC), Audit-Logs. Wer auf Medikation zugreift, darf nicht automatisch die Biographie sehen. Wer die Biographie sieht, darf nicht automatisch loeschen.

**4. Speicherbegrenzung.** Wie lange? In Deutschland gelten fuer Pflegeeinrichtungen 30 Jahre Aufbewahrung fuer Behandlungsdokumentation (analog § 630f BGB), fuer bestimmte Verwaltungsdaten kuerzer. In Oesterreich: ebenfalls typisch 30 Jahre.

## Die Einwilligung: Sieben Qualitaetsmerkmale

Wenn Sie **doch** Einwilligung brauchen (Fotos, Portal-Zugang fuer Angehoerige, Sprachdaten-Nutzung fuer KI-Training):

1. **Freiwillig** — keine Koppelung an die Aufnahme
2. **Informiert** — Zweck, Empfaenger, Dauer, Widerrufsrecht muessen genannt sein
3. **Unmissverstaendlich** — "Ich willige ein" statt "Ich habe zur Kenntnis genommen"
4. **Granular** — pro Zweck eine eigene Checkbox, nicht alles in einem Block
5. **Widerrufbar** — und zwar jederzeit, in gleicher Form wie erteilt
6. **Dokumentiert** — mit Zeitpunkt, Version der Information, Form
7. **Bei Einwilligungsunfaehigkeit**: gesetzliche Vertretung, Patientenverfuegung, mutmasslicher Wille

## Was bedeutet das fuer Pflege-Software?

Eine saubere Pflege-Software muss:

- **Zweckgebundene Datenhaltung**: Fotos nur in einem getrennten Modul mit eigener Rechtsgrundlage. Sprachaufnahmen nur fuer die Dauer der Transkription.
- **Rollen-basierte Rechte**: Nicht jeder User sieht alles. Die Haushaltshilfe sieht nicht die Medikation.
- **Audit-Log**: Jeder Zugriff auf Gesundheitsdaten ist logged, nicht nur Aenderungen.
- **Loeschkonzept**: Regelmaessige Pruefung, welche Daten gemaess Aufbewahrungsfrist geloescht werden koennen.
- **Datenexport**: Art. 20 DSGVO (Datenuebertragbarkeit) verlangt Portabilitaet — oft in Pflegesoftware schlecht umgesetzt.

## Auftragsverarbeitung: Wo Sie als Einrichtung die Kontrolle behalten

Wenn Sie eine externe Software nutzen (SaaS), ist der Anbieter **Auftragsverarbeiter** nach Art. 28 DSGVO. Das heisst: Sie bleiben Verantwortliche im Sinne der DSGVO, der Anbieter verarbeitet **in Ihrem Auftrag**. Zwingend ist ein **Auftragsverarbeitungsvertrag (AVV)**, der mindestens regelt:

- Gegenstand, Dauer, Art und Zweck der Verarbeitung
- Betroffene Datenkategorien und Personengruppen
- Pflichten und Rechte des Verantwortlichen
- Weisungsbindung des Anbieters
- Verschwiegenheit
- Technisch-organisatorische Massnahmen (TOM)
- Unterauftragsverarbeiter (mit Genehmigung)
- Unterstuetzung bei Betroffenenrechten
- Loeschung/Rueckgabe nach Vertragsende
- Pruefungsrechte

Ein AVV, der diese Punkte nicht abbildet, ist **unvollstaendig** und im Zweifel ein Verstoss gegen Art. 28.

## DSFA: Die Datenschutz-Folgenabschaetzung

Pflichtgemaess, wenn die Verarbeitung wahrscheinlich ein hohes Risiko fuer Rechte und Freiheiten darstellt. In der Pflege nahezu **immer** erforderlich, wenn KI eingesetzt wird. Inhalte:

- Systematische Beschreibung der Verarbeitungsvorgaenge
- Bewertung der Notwendigkeit und Verhaeltnismaessigkeit
- Bewertung der Risiken fuer die Rechte Betroffener
- Abhilfemassnahmen, Garantien, Sicherheitsvorkehrungen

## Drittland-Uebermittlung: Das US-Problem

Viele grosse Plattformen haben US-Mutterkonzerne. Seit Schrems II und der Neufassung des Datenschutzrahmens EU-US (Adequacy Decision 2023) ist Uebermittlung in die USA grundsaetzlich moeglich — aber **nur**, wenn der Anbieter am Data Privacy Framework teilnimmt oder SCC plus zusaetzliche Garantien nachweisen kann.

Fuer Pflegedaten ist die klare Empfehlung: **EU-Hosting, EU-Unternehmen, EU-Subunternehmer.** Alles andere ist riskant. CareAI arbeitet deshalb ausschliesslich mit Hetzner (Falkenstein, DE und Helsinki, FI) und europaeischen Unterauftragsverarbeitern.

## Fazit

DSGVO Art. 9 ist kein Feind der Digitalisierung, sondern ihr Rahmen. Wer die vier Saeulen (Zweck, Minimierung, Sicherheit, Dauer) beherrscht, wer einen sauberen AVV mit seinem Software-Anbieter hat, wer die DSFA aktuell haelt und wer die Einwilligungen granular fuehrt, hat die rechtliche Seite im Griff. Der Rest ist Pflege-Alltag.

---

**Quellen**: DSGVO Verordnung (EU) 2016/679; BfDI Kurzpapier Nr. 5 Einwilligung; LfDI Baden-Wuerttemberg — Pflege-Leitfaden 2024.
