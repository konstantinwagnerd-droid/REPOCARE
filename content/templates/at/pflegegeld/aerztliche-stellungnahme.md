---
id: at-pflegegeld-aerztl
title: Ärztliche Sachverständigen-Stellungnahme (BPGG-Einstufung)
jurisdiction: at
category: pflegegeld
applicable_to:
  - stationaer
  - ambulant
legal_reference: § 4 BPGG, EinstV § 1–4
source_url: "https://www.sozialministerium.gv.at/Themen/Pflege/Pflegegeld.html"
version_date: 2025-01-01
---

# Ärztliche Sachverständigen-Stellungnahme — Pflegegeld-Einstufung

**Begutachtung durch:** {{gutachter.name}} ({{gutachter.qualifikation}})
**Hausbesuch am:** {{begutachtung.datum}}, {{begutachtung.uhrzeit}}
**Begutachtete Person:** {{resident.vorname}} {{resident.nachname}}, geb. {{resident.geburtsdatum}}
**Anwesende Vertrauensperson:** {{vertrauensperson.name}} ({{vertrauensperson.verhaeltnis}})

## A. Anamnese

- Hauptdiagnosen: {{diagnosen.haupt}}
- Nebendiagnosen: {{diagnosen.neben}}
- Medikation: {{medikation.liste}}
- Hilfsmittel: {{hilfsmittel}}

## B. Pflegebedarf nach Einstufungsverordnung (EinstV)

### B.1 Betreuungsleistungen (fixer Zeitwert)

| Leistung | Zeitwert | Benötigt? | Min/Tag |
|----------|----------|-----------|---------|
| An- und Auskleiden | 20 min/Tag | {{eb_an_auskleiden}} | |
| Körperpflege | 25 min/Tag | {{eb_koerperpflege}} | |
| Zubereitung von Mahlzeiten | 30 min/Tag | {{eb_zubereitung}} | |
| Einnehmen von Mahlzeiten | 30 min/Tag | {{eb_einnehmen}} | |
| Verrichtung der Notdurft | 30 min/Tag | {{eb_notdurft}} | |
| Medikamenteneinnahme | 6 min/Tag | {{eb_medikamente}} | |
| Mobilitätshilfe i.e.S. | 15 min/Tag | {{eb_mobilitaet_innen}} | |

### B.2 Hilfsverrichtungen (fixer Monatswert, je 10 h/Monat)

- [ ] Reinigung der Wohnung
- [ ] Herbeischaffen von Lebensmitteln, Medikamenten
- [ ] Pflege der Leib- und Bettwäsche
- [ ] Beheizung des Wohnraums
- [ ] Mobilitätshilfe im weiteren Sinn (Behörden, Arzt)

Gesamt-Hilfsverrichtungen: **{{hilfsverrichtungen_summe}} h/Monat**

### B.3 Erschwerniszuschlag (§ 4a EinstV)

- [ ] Schwere geistige oder schwere psychische Behinderung (+25 h/Monat)
- [ ] Schwerst-Behinderung Kind bis 15. Lj (+50 h/Monat)

## C. Summen-Berechnung

- Betreuungsbedarf Stunden/Monat: **{{betreuung_h}}**
- Hilfsverrichtungen Stunden/Monat: **{{hilfsverrichtungen_h}}**
- Erschwerniszuschlag: **{{erschwernis_h}}**
- **Gesamtpflegebedarf: {{gesamt_h}} h / Monat**

## D. Empfohlene Pflegegeldstufe

| Stufe | Stunden/Monat | Empfehlung |
|-------|--------------|-----------|
| 1 | > 65 | {{stufe_1}} |
| 2 | > 95 | {{stufe_2}} |
| 3 | > 120 | {{stufe_3}} |
| 4 | > 160 | {{stufe_4}} |
| 5 | > 180 + außergew. Pflegeaufwand | {{stufe_5}} |
| 6 | > 180 + zeitl. unkoord. + Gefährdung | {{stufe_6}} |
| 7 | > 180 + keine zielgerichteten Bewegungen | {{stufe_7}} |

**Empfohlene Stufe: {{empfohlene_stufe}}**

---

**Quelle:** BMSGPK Pflegegeld — [sozialministerium.gv.at](https://www.sozialministerium.gv.at/Themen/Pflege/Pflegegeld.html)
**Rechtsgrundlage:** BPGG § 4, EinstV
**Stand:** 2025-01-01
