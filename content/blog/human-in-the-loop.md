---
title: "Human-in-the-Loop: Warum KI in der Pflege nie allein entscheiden darf"
description: "EU AI Act, Ethik und Praxis — weshalb Pflege-KI ohne menschliche Kontrolle nicht nur rechtlich, sondern auch pflegefachlich falsch ist."
publishedAt: "2026-04-10"
updatedAt: "2026-04-15"
author: "Fatima Al-Khatib"
category: "Ethik & KI"
tags: ["KI", "EU AI Act", "Ethik", "Human-in-the-Loop"]
cover: "/og/blog-human-in-the-loop.svg"
---

## Drei Ebenen, eine Antwort

Warum soll Pflege-KI nie allein entscheiden? Es gibt drei Ebenen:

- **Rechtlich**: EU AI Act Art. 14 fordert menschliche Aufsicht bei Hochrisiko-Systemen. § 630f BGB verlangt, dass die verantwortliche Person erkennbar ist.
- **Fachlich**: Pflegediagnosen sind Einzelfallentscheidungen in komplexen, ambigen Kontexten. Kein Modell hat das ganze Bild.
- **Ethisch**: Wer die Verantwortung traegt, muss entscheiden koennen. KI kann nicht Verantwortung tragen.

## Was Human-in-the-Loop konkret bedeutet

Drei Auspraegungen:

**1. Human-in-the-Loop (HITL)** — Die KI macht einen Vorschlag, der Mensch bestaetigt oder korrigiert **vor** der Wirkung. Goldstandard fuer sensible Entscheidungen.

**2. Human-on-the-Loop (HOTL)** — Die KI entscheidet autonom, der Mensch ueberwacht und kann jederzeit eingreifen. Akzeptabel fuer niedrigrisikante, reversible Entscheidungen.

**3. Human-out-of-the-Loop (HOOTL)** — Vollautonome KI ohne menschliche Kontrolle. In der Pflege **nicht akzeptabel**.

## Was das fuer Pflegesoftware heisst

Einige Faustregeln:

- **Dokumentations-Vorschlaege** (z.B. SIS-Struktur, Berichtstext): HITL
- **Risiko-Frueherkennung** (z.B. Dekubitus, Sturz): HITL — Hinweis, keine automatische Massnahme
- **Medikations-Vorschlaege**: HITL — Arzt entscheidet
- **Terminplanung, Dienstplan**: HOTL akzeptabel, solange Konflikte sichtbar
- **Stimmungs-Analyse, Biographie-Analyse**: HITL plus explizite Einwilligung

## Die fuenf Qualitaetsmerkmale guter HITL-Implementierung

1. **Vorschlag ist transparent**: Nicht "das System schlaegt X vor", sondern "weil A, B, C → X vorgeschlagen".
2. **Ablehnung ist gleichwertig wie Bestaetigung**: Kein Friction-Bias Richtung "OK klicken".
3. **Korrektur ist einfach**: Not nur "ablehnen", sondern "anpassen".
4. **Lernen aus Ablehnungen**: Das System verbessert sich durch Nein.
5. **Audit-Trail**: Wer hat wann was bestaetigt/abgelehnt, warum?

## Der Anti-Pattern: "Confirmation-Bias-UI"

Eine schlecht gestaltete HITL-UI kann das Gegenteil bewirken: Wenn die Pflegekraft 200x am Tag "OK" klickt, ohne zu pruefen, ist aus HITL faktisch HOOTL geworden. Das nennt man **Automation Bias**, und es ist einer der am besten dokumentierten Fehler in KI-Implementierungen.

Gegenmassnahmen:

- Vorschlag mit klarer Begruendung, nicht nur Ergebnis
- Bei Abweichungen vom Standard: explizite Aufmerksamkeit (Farbe, Ton)
- Stichprobenartige "Pruef-Prompt": "Warum haben Sie diesen Vorschlag bestaetigt?"
- Regelmaessige Reports: Wie hoch ist die Bestaetigungsquote pro Anwender?

## Was EU AI Act Art. 14 konkret fordert

Artikel 14 listet bei Hochrisiko-Systemen diese Anforderungen:

- Menschliche Aufsicht muss **verstehen** koennen, wie das System arbeitet
- Verschiedene Entscheidungsszenarien muessen **abbildbar** sein
- Die Aufsichtsperson muss das System **aussetzen** oder **stoppen** koennen
- Schwellenwerte fuer menschliche Eskalation sind **festzulegen**

In der Praxis heisst das: Die Pflegekraft muss jederzeit die KI umgehen koennen, ohne Zustimmungsprozesse.

## Die ethische Dimension

KI in der Pflege ist ein hochsensibler Bereich. Hier geht es um Menschen, die sich nicht immer selbst vertreten koennen. Die ethischen Leitlinien der Bundesaerztekammer (2021) sind klar:

- Keine Delegation **kategorialer Entscheidungen** an KI
- **Diskriminierungsfreiheit** algorithmischer Empfehlungen
- **Reversibilitaet** — jede KI-getriggerte Massnahme muss rueckgaengig gemacht werden koennen
- **Nachvollziehbarkeit** gegenueber Betroffenen

Wer diese Leitlinien ernst nimmt, baut keine autonomen Pflege-Systeme.

## Die wirtschaftliche Versuchung

Startups geraten unter Druck, "mehr Automatisierung" zu versprechen. Investoren wollen "AI-first"-Pitches. Kunden vergleichen Feature-Listen. In diesem Umfeld ist die Versuchung gross, Human-in-the-Loop zu schwaechen.

Unsere Position: **Nein**. Wer heute schwaecht, wird morgen Datenschutz-Pannen, Haftungsfragen und Vertrauensverlust haben. Der langfristige Wert eines Pflege-KI-Systems steht und faellt mit der Qualitaet seiner HITL-Architektur.

## Praktische Implementation bei CareAI

Unsere Architektur-Entscheidungen:

- **Jede KI-gestuetzte Dokumentation** wird vor Speicherung explizit bestaetigt
- **Keine "Auto-Submit"-Timer** — kein "nach 10 Sekunden automatisch speichern"
- **Visuelle Hervorhebung** des KI-Anteils vs. menschlicher Anteil
- **Begruendungen** bei jedem Vorschlag ("weil letzte Wundaufnahme vor 14 Tagen...")
- **Ablehnungsfeedback** — bei "Nein" fragen wir: "Was war unpassend?"
- **Monatliches Report** an die Einrichtungsleitung: HITL-Metriken

## Fazit

Human-in-the-Loop ist kein Compliance-Theater. Es ist das **definierende Prinzip** verantwortlicher Pflege-KI. Wer es ernst nimmt, baut Software, die ueber Jahrzehnte Vertrauen verdient. Wer es aufweicht, baut Software, die den ersten Skandal nicht ueberlebt.

---

**Quellen**: Verordnung (EU) 2024/1689, Art. 14; BAEK Ethik-Leitlinien KI 2021; Parasuraman/Riley 1997 "Humans and Automation"; eigene Pilot-Auswertung CareAI 2025/2026.
