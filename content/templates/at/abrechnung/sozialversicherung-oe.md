---
id: at-abrechnung-sv
title: Abrechnungs-Leitfaden Sozialversicherung Österreich
jurisdiction: at
category: abrechnung
applicable_to:
  - stationaer
  - ambulant
legal_reference: ASVG, B-KUVG, GSVG; Landes-Pflegegesetze
source_url: "https://www.gesundheitskasse.at/cdscontent/?contentid=10007.883560"
version_date: 2025-01-01
---

# Abrechnungs-Leitfaden Österreich (SV + Land)

In Österreich erfolgt die Finanzierung einer stationären Pflege über **vier Säulen**:

1. **Bewohner-Eigenanteil** (Pension, 80% Pension + 80% Pflegegeld)
2. **Pflegegeld** (Bund / PV-Träger an Bewohner:in, anteilig an Heim)
3. **Länder-Sozialhilfe** (Restkosten-Deckung wenn Eigenanteil nicht reicht)
4. **SV-Abrechnung** für medizinisch-therapeutische Leistungen (ÖGK / BVAEB / SVS)

## SV-Abrechnung mit ÖGK

Übermittlungs-Kanäle:
- **ELDA** (Elektronischer Datenaustausch) — Standard
- **VPA-Online** (Vertragspartner-Abrechnung Web)
- **medical net / DAME** (je nach Vertragspartner-Gruppe)

Formate:
- XML-basiert, Schema der ÖGK (schema.chipkarte.at)
- Signatur: A-Trust / Handysignatur / ID Austria

## Pflegeheim-Details (Einrichtungs-Daten)

- Einrichtungs-Name: {{einrichtung.name}}
- Anschrift: {{einrichtung.adresse}}
- Vertragspartner-Nr. ÖGK: {{einrichtung.vp_nr_oegk}}
- Bankverbindung: {{einrichtung.iban}}
- Träger: {{einrichtung.traeger}}

## Abrechnungs-Rhythmus
- Monatliche Abrechnung (jeweils bis 10. des Folgemonats)
- Korrektur-Meldungen innerhalb von 3 Monaten

## Länder-Sozialhilfe — Formulare je Bundesland

| Bundesland | Zuständige Stelle | Portal |
|---|---|---|
| Wien | FSW Fonds Soziales Wien | fsw.at |
| NÖ | Sozialhilfeverbände | noe.gv.at |
| OÖ | Sozialhilfeverbände | land-oberoesterreich.gv.at |
| Stmk. | BH Sozialreferate | verwaltung.steiermark.at |
| Tirol | BH Sozialreferate | tirol.gv.at |
| Salzburg | Sozialhilfeverbände | salzburg.gv.at |
| Ktn. | Sozialhilfeverbände | ktn.gv.at |
| Bgld. | BH | burgenland.at |
| Vbg. | Sozialdienste | vorarlberg.at |

---

**Quelle:** [ÖGK VPA](https://www.gesundheitskasse.at/cdscontent/?contentid=10007.883560&portal=oegkvpportal), [ELDA](https://www.elda.at/)
**Stand:** 2025-01-01
