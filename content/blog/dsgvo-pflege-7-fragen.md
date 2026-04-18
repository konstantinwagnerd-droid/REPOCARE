---
title: "DSGVO in der Pflege: 7 Fragen, auf die du eine Antwort brauchst"
description: "AV-Vertrag, Zugriff, Speicherdauer, Kassen-Weitergabe: Die sieben DSGVO-Fragen, die bei jeder stationären Einrichtung aufschlagen — mit konkreten Rechtsgrundlagen und Handlungsempfehlungen."
publishedAt: "2026-04-18"
author: "CareAI-Team"
category: "DSGVO"
tags: ["DSGVO", "Datenschutz", "Recht", "AV-Vertrag"]
cover: "/og/blog-dsgvo-7-fragen.svg"
---

## Warum dieser Text?

DSGVO-Texte gibt es wie Sand am Meer. Die meisten sind entweder 80-seitige Leitfäden oder oberflächliche Checklisten. Dieser Text ist weder noch. Er beantwortet die sieben Fragen, die in unserer Beratungspraxis in 90% aller DSGVO-Audits aufschlagen — knapp, mit Rechtsquelle und mit einer klaren Handlungsempfehlung.

## Frage 1: Brauchen wir einen AV-Vertrag mit unserer Pflegesoftware?

**Kurz**: Ja, zwingend. Keine Ausnahme.

**Rechtsgrundlage**: Art. 28 DSGVO. Sobald ein externer Dienstleister personenbezogene Daten im Auftrag verarbeitet (und das tut jede Pflegesoftware, die in der Cloud läuft oder Support-Zugriff hat), ist ein Auftragsverarbeitungsvertrag (AVV) verpflichtend. Ohne AVV ist die Verarbeitung rechtswidrig.

**Was der AVV enthalten muss**: Gegenstand/Dauer, Art/Zweck der Verarbeitung, Betroffenenkategorien, Datenkategorien, technisch-organisatorische Maßnahmen (TOM), Sub-Auftragsverarbeiter, Rückgabe/Löschung nach Vertragsende.

**Was du konkret tun solltest**: Fordere vom Anbieter den AVV schriftlich ein. Prüfe, ob Sub-Auftragsverarbeiter (z.B. AWS, Azure, OpenAI) explizit gelistet sind. Wenn OpenAI oder Anthropic genutzt werden und Daten dorthin fließen — sehr genau prüfen, ob die Server im EU-Raum stehen.

## Frage 2: Dürfen Angehörige auf die Pflege-Akte zugreifen?

**Kurz**: Nur mit gültiger Rechtsgrundlage.

**Rechtsgrundlage**: Art. 6 Abs. 1 DSGVO. Zugriff durch Angehörige braucht entweder (a) Einwilligung der betroffenen Person (solange einwilligungsfähig), (b) Vertretungsvollmacht (Vorsorgevollmacht/gesetzliche Betreuung) mit Entscheidungsbereich "Gesundheitssorge", oder (c) nachweisbares berechtigtes Interesse der bewohnenden Person selbst, wenn sie nicht mehr einwilligungsfähig ist (mutmaßlicher Wille).

**Typischer Fehler**: "Die Tochter ist doch Tochter, die darf das sehen." — Nein, Verwandtschaft allein ist keine Rechtsgrundlage. Wir haben in Audits schon Einrichtungen gesehen, die jedem Angehörigen Vollzugriff gaben — das ist ein meldepflichtiger Datenschutzvorfall.

**Empfehlung**: Pro Bewohner ein Dokument "Wer darf was wissen" mit drei Ebenen: (1) tägliche Pflege-Updates, (2) medizinische Details, (3) Vollzugriff auf Akte. Jede Ebene wird explizit freigegeben und im System abgebildet.

## Frage 3: Wie lange müssen wir Pflege-Dokumentation aufbewahren?

**Kurz**: In Deutschland 30 Jahre für pflegerische Dokumentation, in Österreich 30 Jahre nach ÄrzteG § 51 (analog für Pflege nach GuKG).

**Rechtsgrundlage**: § 630f BGB (DE) fordert 10 Jahre für die Patientenakte; die Berufsgenossenschaft Gesundheitsdienst und BGB-Rechtsprechung fordern jedoch 30 Jahre wegen zivilrechtlicher Haftungsansprüche (Verjährung nach § 199 BGB). In Österreich ergibt sich die 30-Jahre-Frist aus der Praxis der ÖÄK und § 10 GuKG.

**Was das praktisch heißt**: Pflegedokumentation ist **nicht** nach 10 Jahren löschbar. Auch eine Löschanfrage durch die Erben scheitert an der Aufbewahrungspflicht (Art. 17 Abs. 3 lit. b DSGVO: "rechtliche Verpflichtung").

**Achtung**: Die 30 Jahre beginnen mit Beendigung des Pflegeverhältnisses — nicht mit der Entstehung des Dokuments. Ein Pflegevertrag über 8 Jahre, dann Tod → Aufbewahrung bis ~38 Jahre nach Einzug.

## Frage 4: Dürfen wir Daten an die Kranken-/Pflegekasse weitergeben?

**Kurz**: Ja, aber nur die gesetzlich geforderten.

**Rechtsgrundlage**: § 301a SGB V (Abrechnungsdaten), § 113 SGB XI (Qualitätsdaten), Art. 6 Abs. 1 lit. c DSGVO (rechtliche Verpflichtung).

**Praktischer Fallstrick**: Viele Einrichtungen übermitteln mehr, als sie müssen — aus Gewohnheit oder weil die Software eben alles exportiert. Das ist DSGVO-rechtlich ein Problem ("Datenminimierung", Art. 5 Abs. 1 lit. c DSGVO). Empfehlung: Übermittlungs-Templates pro Empfänger definieren und dokumentieren, welche Felder warum übermittelt werden.

**Besonderheit MD-Prüfung (Deutschland)**: Bei der Prüfung durch den Medizinischen Dienst hat dieser gesetzlichen Einsichtsanspruch (§ 114 SGB XI). Das heißt aber nicht "Zugriff auf die Software", sondern Einsicht in die konkret betroffenen Akten. Gute Pflegesoftware erlaubt deshalb einen zeitlich befristeten Prüfer-Zugriff mit Audit-Log.

## Frage 5: Was machen wir mit Fotos von Wunden, Tabletten, Sturzorten?

**Kurz**: Fotos gehören in die Akte, nicht aufs Privat-Handy.

**Rechtsgrundlage**: Art. 9 DSGVO (besondere Kategorien — Gesundheitsdaten). Rechtsgrundlage in der Regel Art. 9 Abs. 2 lit. h DSGVO (medizinische Versorgung).

**Das Problem**: 80% aller Pflegekräfte, die wir befragt haben, haben schon mindestens einmal ein Wundfoto mit dem Privat-Handy gemacht, "weil es schneller geht". Das ist ein klarer DSGVO-Verstoß: Das Foto landet in der Apple/Google-Cloud, oft Backups in den USA, kein AVV, kein Löschkonzept.

**Was du konkret tun musst**: Dienst-Handys oder Dienst-Tablets mit integrierter Kamera-Funktion der Pflegesoftware. Die App speichert das Foto verschlüsselt im Akten-System und gibt es **nicht** an die Geräte-Galerie. Privathandys für Pflegefotos verbieten — schriftlich, mit Unterschrift der Mitarbeitenden.

## Frage 6: Brauchen wir eine/n Datenschutzbeauftragte/n (DSB)?

**Kurz**: In Deutschland ja, ab 20 Personen mit automatisierter Verarbeitung (§ 38 BDSG). In Österreich nur bei umfangreicher Verarbeitung besonderer Kategorien (Art. 37 DSGVO). Für Pflegeeinrichtungen praktisch immer ja.

**Besonderheit Pflege**: Schon die Verarbeitung von Gesundheitsdaten (Art. 9 DSGVO) in großem Umfang macht den DSB zur Pflicht, unabhängig von der Mitarbeiterzahl. "Großer Umfang" = mehr als ca. 10-15 Bewohner in stationärer Versorgung.

**Intern oder extern?** Beides möglich. Wichtig: Unabhängigkeit. Der DSB darf nicht gleichzeitig Einrichtungsleitung oder PDL sein, weil er deren Datenschutz-Entscheidungen prüfen muss. Externe DSB kosten je nach Einrichtungsgröße 150-600 € / Monat.

## Frage 7: Was passiert bei einem Datenschutzvorfall?

**Kurz**: 72 Stunden Meldepflicht, dokumentierter Prozess, betroffene Personen informieren.

**Rechtsgrundlage**: Art. 33 DSGVO (Meldung an Aufsichtsbehörde innerhalb 72h), Art. 34 DSGVO (Benachrichtigung Betroffene "ohne unangemessene Verzögerung", wenn hohes Risiko).

**Typische Vorfälle in der Pflege**: (1) verlorenes USB-Stick / Laptop mit Bewohnerdaten, (2) E-Mail mit Pflege-Bericht an falschen Empfänger, (3) Ransomware-Angriff auf Server, (4) Pflegekraft postet Foto mit Bewohner auf privatem Social-Media.

**Was du vorbereitet haben musst**:
1. Meldekette: Wer informiert wen in welcher Reihenfolge?
2. Vorlage für die Behörden-Meldung (Inhalt: Was ist passiert, wie viele Betroffene, welche Daten, Risikoeinschätzung, Gegenmaßnahmen)
3. Vorlage für die Betroffenen-Benachrichtigung
4. Ansprechpartner: DSB-Mobilnummer, Anwalt (falls vorhanden), IT-Forensik

**Aufsichtsbehörden**:
- Deutschland: Je nach Bundesland (z.B. LDI NRW, BayLDA)
- Österreich: Datenschutzbehörde (DSB), dsb.gv.at

## Die unbequeme Wahrheit

DSGVO ist keine einmalige Aufgabe, sondern ein Prozess. Wer sie als "Checkliste abarbeiten und dann ruhe" versteht, wird bei der nächsten Prüfung oder beim nächsten Vorfall überrascht. Die erfolgreichen Einrichtungen, die wir betreuen, machen zweimal im Jahr einen internen DSGVO-Check (2 Stunden pro Station mit dem DSB), dokumentieren Änderungen und aktualisieren ihre Verfahrensverzeichnisse.

Das klingt nach Mehrarbeit. Ist es auch. Aber es ist weniger Mehrarbeit als ein behördliches Prüfverfahren oder eine Schadenersatzklage nach einem Datenschutzvorfall.

<div class="cta-box">

**Willst du das in der Praxis sehen?** CareAI ist DSGVO-by-design: AVV ready, EU-Server, granulare Zugriffsrechte, Audit-Trail. [Demo anfragen](/demo-anfrage)

</div>

*Quellen: DSGVO, BDSG, SGB V § 301a, SGB XI § 113 / § 114, BGB § 630f, GuKG § 10, ÖÄK-Empfehlung zur Aufbewahrungsdauer. Stand: April 2026.*
