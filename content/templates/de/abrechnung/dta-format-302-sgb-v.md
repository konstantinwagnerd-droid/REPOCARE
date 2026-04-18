---
id: de-dta-302
title: DTA-Format § 302 SGB V — Leitfaden
jurisdiction: de
category: abrechnung
applicable_to:
  - ambulant
legal_reference: § 302 SGB V + Technische Anlage
source_url: "https://www.gkv-datenaustausch.de/leistungserbringer/sonstige_leistungserbringer/sonstige_leistungserbringer.jsp"
version_date: 2024-08-16
---

# DTA-Format § 302 SGB V

**Rechtsgrundlage:** § 302 SGB V + Technische Anlage (TA) des GKV-Spitzenverbands.
**Nicht-Einhaltung:** § 303 SGB V = bis zu 5% Rechnungskürzung.

## Nachrichten-Typen (Pflegedienst → Kasse)
- **SLGA** — Sonstiger-Leistungserbringer-Gesamt-Aufstellung
- **SLLA** — Sonstiger-Leistungserbringer-Leistungs-Aufstellung

## Pflicht-Felder SLGA
| Feld | Länge | Format | Beispiel |
|------|-------|--------|----------|
| Sender-IK | 9 | numerisch | 123456789 |
| Empfänger-IK (Kostenträger) | 9 | numerisch | 109999999 |
| Datum | 6 | YYMMDD | 260418 |
| Rechnungs-Nr | max 20 | alphanumerisch | R2026040001 |
| Abrechnungs-Zeitraum | 12 | YYMMDD-YYMMDD | 260401-260430 |
| Gesamt-Betrag | 12 | 9,2 | 000000150,75 |

## Beispiel-Datei
Siehe `src/lib/abrechnung/__fixtures__/example-slga.txt`.

## Übermittlung
- Per verschlüsselter E-Mail (PKCS#7) an **Datenannahmestelle** der Kasse
- SFTP (große Leistungserbringer)
- Abrechnungszentrum (DMRZ, opta data, Noventi, AZH, etc.)

## Dateinamens-Konvention
`SLGA<LfdNr4>.<IK-letzte-3>`  z.B. `SLGA0001.789`

---
**Quelle:** [GKV-Datenaustausch Sonstige LE](https://www.gkv-datenaustausch.de/leistungserbringer/sonstige_leistungserbringer/sonstige_leistungserbringer.jsp)
**Stand:** 2024-08-16
