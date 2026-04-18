---
id: at-sis-erwachsene
title: Strukturierte Informationssammlung (SIS) — Erwachsene
jurisdiction: at
category: sis
applicable_to:
  - stationaer
  - ambulant
legal_reference: ÖGKV-Pflegeprozess, Strukturmodell-Adaption AT
source_url: "https://www.oegkv.at/"
version_date: 2025-01-01
---

# Strukturierte Informationssammlung (SIS)

**Bewohner:in:** {{resident.vorname}} {{resident.nachname}}, geb. {{resident.geburtsdatum}}
**Einzug am:** {{resident.einzug_datum}}
**Erstellt durch:** {{autor.name}}, {{autor.rolle}}
**Datum:** {{datum}}

## Feld A — Stammdaten & Einzugsgrund

- Aktuelle Lebenssituation: {{a_lebenssituation}}
- Einzugsgrund: {{a_einzugsgrund}}
- Wunsch und Erwartung an Pflege/Betreuung: {{a_wunsch}}

## Feld B — Was möchten Sie uns sagen? (Selbsteinschätzung)

{{b_selbsteinschaetzung}}

## Feld C1 — Themenfelder (fachliche Einschätzung)

### C1.1 Kognition & Kommunikation
- Orientierung: {{c1_1_orientierung}}
- Kommunikation: {{c1_1_kommunikation}}
- Hör-/Sehhilfen: {{c1_1_hilfsmittel}}

### C1.2 Mobilität & Beweglichkeit
- Gehfähigkeit: {{c1_2_gehen}}
- Transfer: {{c1_2_transfer}}
- Sturz-Anamnese: {{c1_2_sturz}}

### C1.3 Krankheits-/therapiebezogene Anforderungen
- Hauptdiagnosen: {{c1_3_diagnosen}}
- Medikation: {{c1_3_medikation}}
- Wunden/Schmerzen: {{c1_3_wunden_schmerzen}}

### C1.4 Selbstversorgung
- Körperpflege: {{c1_4_koerperpflege}}
- Kleidung: {{c1_4_kleidung}}
- Essen/Trinken: {{c1_4_essen}}
- Ausscheidung: {{c1_4_ausscheidung}}

### C1.5 Leben in sozialen Beziehungen
- Angehörige / Bezugspersonen: {{c1_5_angehoerige}}
- Tagesstruktur: {{c1_5_tagesstruktur}}
- Soziale Teilhabe: {{c1_5_teilhabe}}

### C1.6 Wohnen / Häuslichkeit / Tagesgestaltung
- Zimmer / Räume: {{c1_6_zimmer}}
- Hobbies / Interessen: {{c1_6_hobbies}}
- Biographie-Relevantes: {{c1_6_biographie}}

## Feld C2 — Risikomatrix

| Risiko | Relevant? | Verweis auf Expertenstandard |
|--------|-----------|-----------------------------|
| Dekubitus | {{c2_dekubitus}} | DNQP Dekubitus-Prophylaxe |
| Sturz | {{c2_sturz}} | DNQP Sturzprophylaxe |
| Schmerz | {{c2_schmerz}} | DNQP Schmerzmanagement |
| Inkontinenz | {{c2_inkontinenz}} | DNQP Kontinenzförderung |
| Ernährung | {{c2_ernaehrung}} | DNQP Ernährungsmanagement |
| sonstige: {{c2_sonstige_name}} | {{c2_sonstige_relevant}} | — |

---

**Quelle:** ÖGKV-Pflegeprozess + EinSTEP Strukturmodell
**Version:** 1.0
**Stand:** 2025-01-01
