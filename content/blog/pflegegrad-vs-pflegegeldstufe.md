---
title: "Pflegegrad vs. Pflegegeldstufe: DACH-Unterschiede verstehen"
description: "Deutsches NBA, oesterreichische Stundenwerte, Schweizer BESA/RAI — wie die drei DACH-Systeme Pflegebedarf einstufen, und was das fuer Einrichtungen bedeutet."
publishedAt: "2026-04-06"
updatedAt: "2026-04-14"
author: "Dr. Julia Lenhart"
category: "Grundlagen"
tags: ["Pflegegrad", "NBA", "Pflegegeld", "DACH"]
cover: "/og/blog-pflegegrad.svg"
---

## Ein Begriff, drei Systeme

"Pflegegrad" ist kein DACH-weiter Begriff. In Deutschland gibt es seit 2017 fuenf **Pflegegrade** nach dem Neuen Begutachtungsassessment (NBA). In Oesterreich gibt es sieben **Pflegegeldstufen** nach dem Bundespflegegeldgesetz 1993, basierend auf Stundenwerten. In der Schweiz gilt fuer den stationaeren Bereich meist **BESA** oder **RAI-NH**, beide punktbasiert. Die drei Systeme sind **nicht** direkt vergleichbar.

## Deutschland: Pflegegrade 1-5 (NBA)

Das NBA bewertet seit 2017 den Pflegebedarf entlang von **sechs Modulen** mit unterschiedlicher Gewichtung:

1. Mobilitaet (10%)
2. Kognitive und kommunikative Faehigkeiten (7,5%)
3. Verhaltensweisen und psychische Problemlagen (7,5%)
4. Selbstversorgung (40%)
5. Umgang mit krankheitsbezogenen Anforderungen (20%)
6. Gestaltung des Alltagslebens (15%)

Aus der Gewichtung ergibt sich ein Gesamtscore zwischen 0 und 100 Punkten. Die Einstufung:

- Pflegegrad 1: 12,5 bis <27 Punkte — geringe Beeintraechtigung
- Pflegegrad 2: 27 bis <47,5 — erhebliche Beeintraechtigung
- Pflegegrad 3: 47,5 bis <70 — schwere Beeintraechtigung
- Pflegegrad 4: 70 bis <90 — schwerste Beeintraechtigung
- Pflegegrad 5: 90 bis 100 — schwerste mit besonderen Anforderungen

**Leistungen stationaer (Stand 2026)** — Leistungen der Pflegekasse je Monat (indikativ):

- PG 2: 805 EUR
- PG 3: 1.319 EUR
- PG 4: 1.855 EUR
- PG 5: 2.096 EUR

Der Eigenanteil (EEE) wird begrenzt durch die Reformen seit 2022, die eine gestaffelte Zuschlagsregelung einfuehren.

## Oesterreich: Pflegegeldstufen 1-7 (Stundenwerte)

Oesterreich folgt einer anderen Logik. Die Einstufung basiert auf **monatlich benoetigten Pflegestunden**:

- Stufe 1: >65 Stunden — 192 EUR/Monat (Stand 2026)
- Stufe 2: >95 Stunden — 354 EUR
- Stufe 3: >120 Stunden — 551 EUR
- Stufe 4: >160 Stunden — 827 EUR
- Stufe 5: >180 Stunden bei ausserordentlichem Pflegeaufwand — 1.123 EUR
- Stufe 6: >180 Stunden bei zeitlich unkoordinierbaren Betreuungsmassnahmen — 1.568 EUR
- Stufe 7: >180 Stunden mit keinen zielgerichteten Bewegungen — 2.062 EUR

Das Pflegegeld wird direkt an die Person ausgezahlt, unabhaengig vom Einkommen. Bei stationaerer Unterbringung wird ein Teil einbehalten (70% bei Heimunterbringung, zugunsten des Sozialhilfetraegers).

## Schweiz: BESA/RAI-NH

In der Schweiz gibt es **kein Pflegegeld-System im kontinentalen Sinn**, sondern kantonale Restfinanzierung plus Krankenkassen-Beitrag. Fuer die Einstufung nutzen Heime typischerweise:

- **BESA** (in vielen Deutschschweizer Kantonen): Punkte-System, 12 Pflegestufen
- **RAI-NH** (andere Kantone): Resource Utilization Groups (RUG), 34 Kategorien

Die Finanzierung pro Pflegetag setzt sich zusammen aus:

- Patient: bis zu 23 CHF/Tag (maximal)
- Krankenversicherung: pro Pflegestufe festgelegter Beitrag
- Kanton/Gemeinde: Restfinanzierung

## Beispiel-Rechnung: Gleicher Fall, drei Laender

Frau M., 84, mittelschwere Demenz, Gehstrecke 10m mit Rollator, braucht Hilfe bei Koerperpflege, Ankleiden, Essen geschnitten werden. Orientierung zur Person, Zeit teilweise, Ort unsicher. Keine FEM, keine Kontinenz-Probleme.

- **Deutschland**: Schaetzung NBA-Score ~58 Punkte → Pflegegrad 3. Kassenleistung stationaer: 1.319 EUR/Monat.
- **Oesterreich**: Schaetzung Pflegestunden ~130/Monat → Stufe 3. Pflegegeld: 551 EUR/Monat.
- **Schweiz**: BESA-Einstufung wahrscheinlich Pflegestufe 6 von 12. KV-Beitrag: ~54 CHF/Tag = 1.620 CHF/Monat.

## Was das fuer Einrichtungen heisst

Wer in Deutschland und Oesterreich arbeitet (oder Software fuer beide Maerkte baut), muss die Systeme klar trennen:

- **Keine Begriffs-Vermischung**: "Pflegegrad 3 = Stufe 3" ist falsch.
- **Zwei Einstufungs-Workflows**: NBA in DE, Stundenwert-Einschaetzung in AT. Die Datenmodelle sind unterschiedlich.
- **Unterschiedliche Abrechnungswege**: In DE ueber SIS-basierte Abrechnung gegenueber Kassen, in AT ueber Heimvertraege und Landesfonds.

CareAI trennt die Einstufungsdaten strukturell: Pro Land ein eigenes Einstufungs-Feld mit landesspezifischen Werten und Historie. Konvertierungen zwischen Systemen werden **nicht** automatisch vorgeschlagen — sie sind fachlich nicht sauber moeglich.

## Reformen auf dem Horizont

Fuer 2026/2027 sind relevant:

- **Deutschland**: Pflegeversicherungs-Reform II — Anhebung der Leistungen um ~5% inflationsbedingt, Diskussion ueber Pflegegrad 6 als "Sonderpflegegrad" fuer Apallische.
- **Oesterreich**: Erhoehung der Pflegegeldstufen-Betraege um Inflationsanpassung ab 2026.
- **Schweiz**: Einzelne Kantone ueberpruefen die BESA-Tarife; nationale Diskussion ueber einheitliche Finanzierung.

## Fazit

Die drei DACH-Systeme sind historisch gewachsen und werden auf absehbare Zeit nebeneinander bestehen. Wer in der Pflege arbeitet, muss das akzeptieren — und wer Software baut, muss es strukturell abbilden. "Ein Begriff, drei Systeme" ist keine Schwaeche, sondern Ausdruck von Foederalismus und unterschiedlichen Sozialstaats-Traditionen.

---

**Quellen**: SGB XI (DE) Stand 01/2026; Bundespflegegeldgesetz (AT) idgF 2025; SpiKoG (CH) und kantonale Verordnungen; BMG-Pflegestatistik 2024.
