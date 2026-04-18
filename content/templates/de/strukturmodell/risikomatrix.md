---
id: de-risikomatrix
title: Risikomatrix nach Strukturmodell
jurisdiction: de
category: strukturmodell
applicable_to:
  - stationaer
  - ambulant
legal_reference: Strukturmodell C2-Element
source_url: "https://www.ein-step.de/strukturen"
version_date: 2024-06-01
---

# Risikomatrix (C2 der SIS)

Bewohner:in: {{resident.name}}  |  Datum: {{datum}}

| Pflegerisiko | Relevant? | Quelle Standard | Bereits erfasst (Assessment) | Im Maßnahmenplan |
|---|---|---|---|---|
| Dekubitus | {{dekubitus}} | DNQP 1 | Braden-Skala: {{braden}} | {{mp_dekubitus}} |
| Sturz | {{sturz}} | DNQP 2 | Tinetti: {{tinetti}} | {{mp_sturz}} |
| Schmerz | {{schmerz}} | DNQP 3 | NRS: {{nrs}} | {{mp_schmerz}} |
| Ernährung | {{ernaehrung}} | DNQP 4 | MNA: {{mna}}, BMI: {{bmi}} | {{mp_ernaehrung}} |
| Inkontinenz | {{inkontinenz}} | DNQP 5 | Miktionsprotokoll: {{miktion}} | {{mp_inkontinenz}} |
| Chron. Wunde | {{wunde}} | DNQP 6 | TIME: {{time}} | {{mp_wunde}} |
| Entlassung | {{entlassung}} | DNQP 7 | Überleitungsbogen | {{mp_entlassung}} |
| Mobilität | {{mobilitaet}} | DNQP 8 | Barthel: {{barthel}} | {{mp_mobilitaet}} |
| Demenz | {{demenz}} | DNQP 9 | MMST: {{mmst}} | {{mp_demenz}} |
| Eigen-Risiko: {{eigen_name}} | {{eigen}} | — | | {{mp_eigen}} |

---
**Rechtsgrundlage:** Strukturmodell DE + DNQP Expertenstandards
**Stand:** 2024-06-01
