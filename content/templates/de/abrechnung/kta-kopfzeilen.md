---
id: de-kta
title: KTA-Rückmeldung Struktur
jurisdiction: de
category: abrechnung
applicable_to:
  - ambulant
legal_reference: TA § 302 SGB V, Rückmeldedatei KOTR/KOST
source_url: "https://www.gkv-datenaustausch.de/"
version_date: 2024-08-16
---

# KTA (Kassen-Technische Anlage) — Rückmeldung verstehen

Die Kasse (Kostenträger) antwortet auf SLGA/SLLA mit **KOTR** (Bestätigung) und ggf. **KOST** (Zahlungsavis).

## Typen
- **KOTR** — Bestätigung der DTA-Übermittlung (technisch)
- **KOST** — Zahlungsavis (kaufmännisch)

## Status-Codes (KOTR)
- 00 = akzeptiert
- 01 = akzeptiert mit Hinweisen
- 02 = teil-akzeptiert
- 03 = abgelehnt

## Fehler-Typen (Auszug)
- E001 Satzart unbekannt
- E010 IK-Nummer ungültig
- E020 Versicherten-Status fehlt
- E030 Positionsnummer nicht im Katalog
- E040 Betrag stimmt nicht mit Positionen überein
- E090 Zeitraum-Überlappung mit früherer Abrechnung

## Verarbeitung in CareAI
Der **KTA-Reader** (`src/lib/abrechnung/kta-reader.ts`) parst die eingehende Datei und aktualisiert den Status der Rechnung (akzeptiert / abgelehnt / Re-Submit erforderlich).

---
**Stand:** 2024-08-16
