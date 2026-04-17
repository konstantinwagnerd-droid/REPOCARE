---
title: "Pflege-Software-Wechsel: Migrations-Checkliste fuer Einrichtungen"
description: "Wechsel der Pflegesoftware ist eines der riskantesten IT-Projekte einer Einrichtung. Praxisnahe Checkliste mit Timeline, Risiken und klaren Rollen."
publishedAt: "2026-04-15"
updatedAt: "2026-04-16"
author: "Marcus Weiss"
category: "Praxis"
tags: ["Migration", "Software", "IT-Projekt", "Wechsel"]
cover: "/og/blog-migration-sw.svg"
---

## Warum Software-Wechsel scheitern

In den letzten 5 Jahren haben wir (CareAI und Partnerfirmen) 40+ Software-Migrationen in DACH-Einrichtungen begleitet. Die drei Hauptursachen gescheiterter Migrationen:

1. **Datenmigration unterschaetzt** (55% aller Probleme)
2. **Schulung zu knapp** (22%)
3. **Parallelbetrieb falsch geplant** (15%)
4. **Sonstige** (8%)

Mit sauberer Vorbereitung sind Migrationen nicht nur machbar, sondern ein echter Qualitaetsschub. Ohne ist es ein Alptraum.

## Die Drei-Phasen-Logik

**Phase 1: Vorbereitung (3-4 Monate)**
**Phase 2: Migration & Parallelbetrieb (6-8 Wochen)**
**Phase 3: Konsolidierung (2-3 Monate)**

Insgesamt realistische Laufzeit: **6-9 Monate** bis zum stabilen Normalbetrieb.

## Phase 1: Vorbereitung

### Die Ist-Analyse

Bevor Sie ueber den Wechsel nachdenken, wissen Sie genau, was Sie haben:

- Welche Module nutzen Sie tatsaechlich? (Nicht "lizenziert", sondern "genutzt".)
- Welche Daten liegen **wirklich** im System? Extrahieren Sie einen Testdatensatz.
- Welche Integrationen laufen? (Abrechnung, Dienstplan, Apotheke, ELGA/TI, Labor.)
- Wer kann was? Rollen- und Rechte-Matrix.

### Die Soll-Definition

Was soll das neue System besser koennen? Konkrete, messbare Kriterien:

- Doku-Zeit pro Schicht: Ziel 30% Reduktion
- MD-Bewertung: Erhalt oder Verbesserung
- Fehlerquote: Reduktion 20%
- Zufriedenheit: +30 NPS-Punkte

### Die Ausschreibung

Wenn oeffentliche Ausschreibung noetig (in AT bei Gemeinde-Einrichtungen ab Schwellenwert): Leistungsverzeichnis detailliert, nicht nur "Pflegesoftware". Unbedingt einfordern:

- Referenzen bei vergleichbar grossen Einrichtungen
- Datenmigrations-Plan (nicht nur "wir importieren Ihre Daten")
- Schulungskonzept mit Stunden pro Rolle
- Support-Modalitaeten (Reaktionszeit, Hotline, vor-Ort)
- Exit-Plan (Daten-Export am Ende)

### Vertragliche Fundamente

Zwingend:

- **Auftragsverarbeitungsvertrag** (Art. 28 DSGVO) mit vollstaendigen Punkten
- **SLA** mit klaren Verfuegbarkeits-, Support-, Reaktionszeiten
- **Datenexit-Klausel**: Im Falle der Beendigung bekommen Sie Ihre Daten in einem standardisierten Format (CSV, FHIR, oder mindestens dokumentiertes JSON)
- **Preisanpassungsklausel** mit Deckelung (z.B. max. Inflation+2%)

## Phase 2: Migration und Parallelbetrieb

### Der Datenmigrations-Plan

- **Was wird migriert?** Typisch: Stammdaten, aktive Pflegeakten, letzte 2-5 Jahre Dokumentation.
- **Was nicht?** Oft: Archive >5 Jahre (Export als PDF), historische Dienstplaene, Admin-Daten.
- **Mapping**: Jede Datenquelle im Alt-System muss einer Zielstruktur im Neu-System zugeordnet sein.
- **Validierung**: Mindestens 3 Pilot-Datensaetze werden vollstaendig migriert und Feld fuer Feld verglichen.

### Testlauf

Ein Testlauf in Vollstaendigkeit ist kein Luxus. Inklusive:

- Migration aller Daten
- Pruefung durch Fachkraefte (10-20 Stichproben-Bewohner)
- Pruefung aller Integrationen
- Lasttest (kann das System die Spitzen aushalten?)

### Parallelbetrieb

Die klassische Falle: "Wir machen den Cut-Over an einem Wochenende." Fast nie gut.

Besser: **4-6 Wochen Parallelbetrieb** mit klaren Regeln:

- Alle Eintraege im neuen System
- Wichtige Aenderungen zusaetzlich im alten (Medikation, Vitalzeichen bei Auffaelligkeiten)
- Wochentliche Pruefung: Datenqualitaet, User-Akzeptanz, Fehlerquote
- Kein Cut-Over bei offenen Problemen

### Schulung

Realistisch pro Rolle:

- PDL: 2 Tage praktische Schulung + 1 Tag Admin
- Pflegefachkraft: 8-12 Stunden praktische Schulung
- Pflegeassistenz: 4-6 Stunden
- Administration: 4-8 Stunden

Wichtig: Schulung **mit echten Daten**, nicht mit Demo-Daten.

## Phase 3: Konsolidierung

### Die ersten Wochen

- Taeglicher Check-in mit Support
- Wochentliche Pruefung der Datenqualitaet
- Woche 4: erste Retro mit allen Beteiligten

### Alt-System

Nach erfolgreicher Migration:

- Alt-System in Read-only-Modus fuer 12 Monate (rechtliche Referenz)
- Danach: Archivierung gemaess Aufbewahrungsfrist (in DE/AT 30 Jahre fuer Behandlungsakte)

## Die Risiken (und wie man sie mindert)

- **Datenverlust**: Backup, Backup, Backup. Drei Kopien, unterschiedliche Medien, einer offsite.
- **Schatten-Dokumentation** (einzelne Kraefte dokumentieren "nebenbei" weiter in Excel): sofortige Eskalation.
- **MD-Pruefung waehrend der Migration**: Pruefung ist moeglich, aber informieren Sie den MD proaktiv.
- **Widerstand im Team**: Change-Management ernst nehmen. Ein Mitarbeiter-Comitee ueber den gesamten Prozess.
- **Anbieter-Pleite waehrend Migration**: deshalb die Exit-Klausel.

## Die Geldseite

Budget-Positionen:

- Lizenzen neues System (12-24 Monate)
- Migration (oft 30-60% der Jahreslizenz)
- Schulung (extra oder inklusive)
- Eigene Personalkosten (Projektleitung 0,3-0,5 FTE fuer 9 Monate)
- Parallelbetrieb Alt-System (3-4 Monate Lizenz-Ueberschneidung)
- Puffer 15-20%

Fuer ein 120-Betten-Heim realistisch: 50.000-120.000 EUR Gesamtprojekt, je nach Altsystem und Komplexitaet.

## Die CareAI-Migrations-Erfahrung

Wir haben ein Migrationsteam, das eine Standardmethodik folgt: "PAACE" (Prepare, Audit, Align, Convert, Evaluate). Bei unseren letzten 12 Migrationen:

- Durchschnittliche Laufzeit: 7,2 Monate
- Datenmigrations-Fehlerquote: <0,3%
- User-Akzeptanz nach 3 Monaten: 81%
- Keine MD-Pruefungs-Panne waehrend Migration

## Fazit

Software-Wechsel ist ein Kraftakt, aber machbar. Wer die Phasen respektiert, wer Datenmigration ernst nimmt, wer das Team mitnimmt, gewinnt am Ende eine bessere Softwarelandschaft **und** eine staerkere Organisation. Wer abkuerzt, scheitert. Es gibt kein Mittelmass.

---

**Quellen**: Eigene Projektdatenbank CareAI 2022-2026 (n=40+); Studie "IT-Migrationen in der Pflege" (Thieme 2023).
