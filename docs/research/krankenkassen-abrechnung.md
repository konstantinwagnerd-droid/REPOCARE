# Krankenkassen-Direktabrechnung § 302 SGB V — Technisches Dossier

**Zweck:** Detaillierte Ausführungs-Grundlage für `src/lib/abrechnung/`. Dokumentiert wie Wettbewerber (Medifox, Vivendi, Senso, Godo, DAN produkte, etc.) mit Krankenkassen direkt elektronisch abrechnen und wie CareAI das nachbaut.

**Stand:** 2026-04-18

---

## 1. Rechtsgrundlage

| Norm | Inhalt |
|---|---|
| § 302 SGB V | Abrechnung der **sonstigen Leistungserbringer** (u.a. Pflegedienste) mit Krankenkassen — elektronisch verpflichtend |
| § 303 SGB V | Rechnungskürzung bis zu **5%** bei Verstoß gegen elektronische Abrechnungspflicht |
| § 105 SGB XI | Abrechnung ambulante Pflegeleistungen mit **Pflegekassen** (parallel zu § 302 für Krankenkassen-Leistungen) |
| § 132a Abs. 4 SGB V | Rahmenempfehlungen zur häuslichen Krankenpflege |

---

## 2. Technische Anlagen (TA)

Der **GKV-Spitzenverband** veröffentlicht die sog. **Technischen Anlagen** auf https://www.gkv-datenaustausch.de/. Verbindlich für alle Krankenkassen + deren Leistungserbringer.

**Kernel-Dokumente für Pflegedienste (SGB V):**
- **TA § 302** (aktuelle Fassung)
- **Anlage 1** — technische Parameter (Zeichensatz ISO-8859-15, CR+LF, Dateinamens-Konvention)
- **Anlage 2** — Richtlinien zur Verschlüsselung und Signatur (PKCS#7 / S/MIME)
- **Anlage 3** — bundeseinheitliches **Positionsnummern-Verzeichnis HKP + Haushaltshilfe**
- **Anlage 4** — Schlüsselverzeichnis (Kostenträger-IK, Versicherten-Status, Tarife)

**Kernel-Dokumente für Pflegekasse (SGB XI):**
- **Anlage Pflege (IA 105)** — analog zu TA § 302 für SGB XI-Leistungen

---

## 3. Nachrichten-Typen (EDIFACT-Syntax)

§ 302 SGB V / Sonstige Leistungserbringer:

| Nachrichtentyp | Zweck | Richtung |
|---|---|---|
| **SLGA** | Sonstiger-Leistungserbringer-Gesamt-Aufstellung (Rechnungsdeckblatt) | Pflege → Kasse |
| **SLLA** | Sonstiger-Leistungserbringer-Leistungs-Aufstellung (Einzelpositionen) | Pflege → Kasse |
| **KOTR** | Kostenträger-Rückmeldung (Abrechnungsbestätigung) | Kasse → Pflege |
| **KOST** | Kosten-Statistik (Zahlungsavis) | Kasse → Pflege |

§ 105 SGB XI / Pflegekasse:

| Nachrichtentyp | Zweck |
|---|---|
| **PLGA** | Pflege-Gesamt-Aufstellung |
| **PLAA** | Pflege-Abrechnungs-Aufstellung (Einzelposten) |
| **DTA-Pflege** | Rückmeldungs-Datensatz Pflegekasse |

---

## 4. Dateistruktur DTA

### 4.1 Dateinamens-Konvention

Format: `TYP{LfdNr}.{Sender-IK-letzte-3-Stellen}`

Beispiel: `SLGA0001.123` = erste Sendung SLGA eines Pflegedienstes mit IK xxxxxx123.

Gepaart kommt `SLLA0001.123` als Einzelposten-Datei.

### 4.2 Segment-Aufbau (vereinfacht)

Eine DTA-Datei besteht aus **Segmenten** mit 3-stelligen Kurzbezeichnungen:

```
UNB  Interchange Header (Absender, Empfänger, Datum)
UNH  Nachrichten-Kopf (z.B. SLGA)
FKT  Funktionsgruppe (01=Erstrechnung, 03=Gutschrift, ...)
REC  Rechnungsdaten (Rechnungs-Nr, Rechnungsbetrag)
INV  Rechnungspositionen (bei SLLA: je Leistung)
NAD  Name/Anschrift Versicherte:r
EHR  Einzel-Heilmittel-Rezept (bei Verordnung nach Muster 12)
BES  Besondere Vereinbarungen
ZHT  Zahlungs- und Hinweistext
UNT  Nachrichten-Ende
UNZ  Interchange-Ende
```

Segmente getrennt durch **`+`** (Datenelemente), Komponenten durch **`:`**, Segment-Ende = **`'`**.

### 4.3 Minimal-Beispiel SLGA

```
UNB+UNOC:3+123456789:30+999999999:30+260418:1530+00000001'
UNH+0001+SLGA:12:0:0'
FKT+01++123456789+999999999'
REC+1:1+2604180001:260418+R2026040001'
INV+260401:260430+1:1+150,75'
GES+150,75'
UNT+7+0001'
UNZ+1+00000001'
```

(IK-Nummern fiktiv; "260418" = YYMMDD 2026-04-18; alle Beträge mit Komma als Dezimal-Trenner.)

---

## 5. IK-Nummer (Institutionskennzeichen)

- **9-stellig** numerisch
- Vergeben durch **ARGE-IK** (Arbeitsgemeinschaft Institutionskennzeichen, Essen)
- Struktur: `KK Klassifikation (2) | Bundesland (3) | lfd. Nr (3) | Prüfziffer (1)`
- Pflichtangabe in UNB-Segment
- Prüfziffer nach Modulo-10-Verfahren (Luhn-artig)

CareAI validiert IK-Nummern im `validator.ts`.

---

## 6. Übermittlungs-Kanäle

| Kanal | Beschreibung | Verbreitung |
|---|---|---|
| **E-Mail mit PKCS#7-Signatur** | häufigster Weg, an Datenannahmestelle der Kasse | ~70% |
| **SFTP / FTP-S** | größere Leistungserbringer, Datenannahmestellen | ~15% |
| **Abrechnungs-Zentrum** | DMRZ, AZH, opta data, Noventi — übernimmt komplette DTA-Erzeugung gegen Prozent-Gebühr (1-3%) | ~15% |

**CareAI-Strategie:** Phase-1 Download-File zum manuellen Upload, Phase-2 direkte E-Mail-Versand-Integration + Abrechnungszentren-API.

---

## 7. Positionsnummern (Leistungs-Katalog)

Bundesweit einheitliches Positionsnummern-Verzeichnis des GKV-Spitzenverbands, aktualisiert ca. 2x/Jahr.

**Aufbau Positionsnummer (HKP):**
```
XX   YY   Z
│    │    └── Kennzeichen Doppelverordnung (0–9)
│    └─────── Leistung innerhalb der Gruppe
└──────────── Leistungsgruppe (10=Grundpflege, 20=Behandlungspflege, 30=Haushalt, ...)
```

**Beispiele (Stand 2024):**

| Pos-Nr | Leistung | Abrechnungsbasis |
|---|---|---|
| 10000 | Erstbesuch HKP | Pauschale |
| 20000 | Folgebesuch HKP | Pauschale |
| 31000 | Injektion s.c. | je Leistung |
| 31001 | Injektion i.m. | je Leistung |
| 31100 | Blutzucker-Messung | je Leistung |
| 31300 | Wundversorgung klein | je Leistung |
| 31301 | Wundversorgung groß | je Leistung |
| 31500 | Kompressionsverband an/ausziehen | je Leistung |
| 32000 | Medikamenten-Gabe | je Gabe |
| 32100 | Medikamenten-Richten (Wochenration) | je Woche |
| 36000 | Anleitung Pflege (einmalig) | Pauschale |

Quelle: https://www.gkv-datenaustausch.de/media/dokumente/leistungserbringer_1/sonstige_leistungserbringer/positionsnummernverzeichnisse/Haeusliche-Krankenpflege_20240816.pdf

(CareAI importiert die Datei als JSON in `src/lib/abrechnung/leistungskatalog.ts`.)

---

## 8. Wie Wettbewerber das machen

| Anbieter | DTA-Eigenerzeugung? | Abrechnungszentrum? | Besonderheit |
|---|---|---|---|
| **Medifox DAN** | Ja | Partner opta data | Großmarkt-Standard |
| **Vivendi** | Ja | – | Connext, stationär-Fokus |
| **Senso** | Nein | DMRZ-Integration | webbasiert |
| **Godo Systems** | Ja | – | KI-Assistenz |
| **DAN Produkte** | Ja | – | Ältester Anbieter, 40+J |
| **MyoPlus** | Nein | DMRZ | klein, günstig |

**CareAI-Mehrwert:** Moderner Tech-Stack, UI aus 2026er-Dekade, Kopplung Dokumentation ↔ Abrechnung automatisch (z.B. wenn Wundversorgung dokumentiert → automatischer Abrechnungs-Vorschlag).

---

## 9. CareAI-Umsetzungs-Plan (Phase 4)

1. **`types.ts`** — `InvoicePosition`, `DtaRecord`, `KtaHeader`, `IkNumber` (branded type).
2. **`leistungskatalog.ts`** — JSON-Import der HKP-Positionsnummern (Stand 2024, als Start-Set).
3. **`dta-generator.ts`** — baut SLGA+SLLA aus CareAI `serviceRecords`. Zeichensatz ISO-8859-15, CRLF, Festbreiten-Formatierung.
4. **`kta-reader.ts`** — parst KOTR/KOST-Rückmeldungen, mapt auf CareAI-Rechnungen, updated Status (akzeptiert/abgelehnt/teil-akzeptiert).
5. **`validator.ts`** — prüft IK-Prüfziffer, Pflicht-Segmente, Summen-Konsistenz (Σ SLLA == SLGA Total), Zeichensatz-Konformität.

Phase-1 Scope: korrekte DTA-Datei generieren als Download. Phase-2: E-Mail-Transport + KOTR-Import.

---

## 10. Testdaten / Sandbox

- **Test-IK** der GKV-Datenaustausch: `999999999` (fiktiv, nie produktiv)
- **Test-Kostenträger**: IK `109999999`
- **Prüftool**: TA-Validator gibt's bei ITSG mbH (für ITSG-Teilnehmer)

---

## 11. Quellen-Bündel

- § 302 SGB V Text: https://www.sozialgesetzbuch-sgb.de/sgbv/302.html
- Wikipedia DTA § 302: https://de.wikipedia.org/wiki/Datenaustausch_nach_%C2%A7_302_SGB_V
- GKV-Datenaustausch Sonstige LE: https://www.gkv-datenaustausch.de/leistungserbringer/sonstige_leistungserbringer/sonstige_leistungserbringer.jsp
- Positionsnummern HKP 2024: https://www.gkv-datenaustausch.de/media/dokumente/leistungserbringer_1/sonstige_leistungserbringer/positionsnummernverzeichnisse/Haeusliche-Krankenpflege_20240816.pdf
- Rahmenempfehlungen § 132a (2023-12-18): https://www.gkv-spitzenverband.de/media/dokumente/krankenversicherung_1/ambulante_leistungen/haeusliche_krankenpflege/20231218_Rahmenempfehlungen_132a_Abs.1_SGB_V_zur_Versorgung_mit_haeuslicher_Krankenpflege.pdf
- AOK BW DTA-Leitfaden: https://www.aok.de/gp/fileadmin/user_upload/Hilfsmittel/Abrechnung/bw_dta_leitfaden.pdf
- Haufe-Kommentar § 132a DTA: https://www.haufe.de/id/kommentar/sommer-sgbv-132a-versorgung-mit-haeuslicher-krankenpflege-235-abrechnung-und-datentraegeraustausch-dta-HI11447028.html
- GKV-Spitzenverband HKP: https://www.gkv-spitzenverband.de/krankenversicherung/ambulante_leistungen/haeusliche_krankenpflege/haeusliche_krankenpflege_1.jsp
- DMRZ Ratgeber DTA: https://www.dmrz.de/wissen/ratgeber/als-leistungserbringer-elektronisch-abrechnen-per-datenaustausch
