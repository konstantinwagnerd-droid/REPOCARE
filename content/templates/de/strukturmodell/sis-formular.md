---
id: de-sis
title: SIS — Strukturierte Informationssammlung (Strukturmodell DE)
jurisdiction: de
category: strukturmodell
applicable_to:
  - stationaer
  - ambulant
legal_reference: Strukturmodell Entbürokratisierung (BMG/BGW/BPA/MDS); § 113 SGB XI
source_url: "https://www.ein-step.de/"
version_date: 2024-06-01
---

# SIS — Strukturierte Informationssammlung

**Bewohner:in:** {{resident.vorname}} {{resident.nachname}}, geb. {{resident.geburtsdatum}}
**Einzug am:** {{resident.einzug_datum}}
**Erstellt durch:** {{autor.name}} ({{autor.rolle}})
**Datum:** {{datum}}

---

## Feld A — Kontaktaufnahme & Wunsch

*Wie ist die aktuelle Lebenssituation? Was ist der Anlass für die Pflege? Was ist der Wunsch / die Erwartung?*

{{a_freitext}}

---

## Feld B — Was bewegt Sie im Augenblick?

*Selbsteinschätzung Pflegebedürftige:r (bzw. Angehörige:r bei kognitiver Einschränkung)*

{{b_selbstaussage}}

---

## Feld C1 — Die sechs Themenfelder

### C1.1 Kognitive und kommunikative Fähigkeiten
{{c1_1_freitext}}

### C1.2 Mobilität und Beweglichkeit
{{c1_2_freitext}}

### C1.3 Krankheitsbezogene Anforderungen und Belastungen
{{c1_3_freitext}}

### C1.4 Selbstversorgung
{{c1_4_freitext}}

### C1.5 Leben in sozialen Beziehungen
{{c1_5_freitext}}

### C1.6 Wohnen / Häuslichkeit (ambulant) / Tagesgestaltung (stationär)
{{c1_6_freitext}}

---

## Feld C2 — Risikomatrix

Für jedes Themenfeld wird geprüft, ob pflegefachlich relevante Risiken bestehen, verknüpft mit den DNQP-Expertenstandards:

| Risiko | Thematisiert in TF | Relevanz (0=nein / 1=ja) | Maßnahme in Maßnahmenplan? |
|--------|----|---|---|
| Dekubitus | 2,3,4 | {{c2_dekubitus}} | {{m_dekubitus}} |
| Sturz | 2,3 | {{c2_sturz}} | {{m_sturz}} |
| Schmerz | 3 | {{c2_schmerz}} | {{m_schmerz}} |
| Inkontinenz | 4 | {{c2_inkontinenz}} | {{m_inkontinenz}} |
| Ernährung / Flüssigkeit | 4 | {{c2_ernaehrung}} | {{m_ernaehrung}} |
| Gewaltprävention | 5 | {{c2_gewalt}} | — |
| weiteres: {{c2_eigen_name}} | | {{c2_eigen}} | |

---

**Quelle:** [EinSTEP](https://www.ein-step.de/), [MD Hinweise](https://md-bund.de/fileadmin/dokumente/Publikationen/SPV/PV_Qualitaetspruefung/191114_-_Hinweise_Strukturmodell.pdf)
**Rechtsgrundlage:** § 113 SGB XI Expertenstandards; Pflege-QS-RL
**Stand:** 2024-06-01
