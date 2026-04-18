# Novatec Care (novatec.at)

**Stand:** 2026-04-18
**Quellen:** novatec.at, novatec-care.com
**Marktposition:** Österreichischer Spezialist, ~200 Einrichtungen AT

## Hauptprodukt

- **noviCare** — Pflegedokumentation AT
- **noviPlan** — Dienstplan
- **noviAbr** — Abrechnung AT-Pflegegeld / Landesrecht

## Hauptmodule

- **AT-spezifische Pflegedoku:** nach LQK (Landes-Qualitäts-Kriterien) + BQK (Bundes-Qualitäts-Kriterien)
- **Pflegegeld AT:** 7 Stufen, Pflegegeld-Antrag-Vorbereitung, PG-Einstufungs-Assistent
- **ELGA:** Anbindung an Österreichische Gesundheitsakte
- **Abrechnung:** Landesabgeltungen Wien/NÖ/OÖ/Stmk unterschiedlich, Regressprüfung

## AT-Spezifika

- **Pflegeassistent (PA) / Pflegefachassistent (PFA) / DGKP** — Rollen-Matrix
- **Leistungskatalog AT:** abweichend von SGB XI (DE)
- **ÖQZ 24** (Österreichisches Qualitätszertifikat 24h-Betreuung)
- **HEIMaufG** (Heimaufenthaltsgesetz) + **UbG** (Unterbringungsgesetz) Freiheitsbeschränkungen

## Integrationen

- **ELGA e-Medikation**
- **ELGA e-Befund**
- **BBU** (Betreuungsbeitrag Auszahlung)

## CareAI-relevante Gaps

CareAI ist in Wien (Konstantin) — AT-Markt MUSS abgedeckt werden:
- **Pflegegeld-Stufen 1-7** statt Pflegegrad 1-5 — bereits `pflegegrad` int in Schema, muss AT-Modus haben
- **HEIMaufG-Meldung** bei Freiheitsbeschränkung (Gurt, Bettgitter, Medikation) — Pflicht an Bewohnervertretung
- **ÖQZ-Audit-Export**
- **ELGA-Connector**
