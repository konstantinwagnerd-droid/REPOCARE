# 09 — EUDAMED-Registrierung

**Dokument-ID:** CAI-REG-009
**Version:** 1.0 — Draft

## 1. Zweck

EUDAMED (European Database on Medical Devices) ist die zentrale EU-Datenbank nach MDR Art. 33. Registrierung ist für Hersteller, Bevollmächtigte, Importeure und **für jedes Produkt** Pflicht.

## 2. Stand der Module (2027)

Module-Status (prüfen bei Submission, da gestaffelter Rollout):

| Modul | Pflicht seit | Status 2027 |
|-------|--------------|-------------|
| Actor Registration | Dez 2020 | Live |
| UDI / Device Registration | 2022-2023 | Live |
| Notified Bodies & Certificates | 2021-2022 | Live |
| Clinical Investigations | 2024 | Live |
| Vigilance & PMS | 2024 | Live |
| Market Surveillance | 2024 | Live |

**Regel:** Alle verpflichtend ab Moment, in dem EUDAMED voll funktionsfähig erklärt wird.

## 3. Registrierungs-Schritte

### 3.1 Actor-Registration (Hersteller)

1. Lokale Authentifizierung via **EU Login** der zuständigen Person.
2. Antrag auf SRN (Single Registration Number) bei zuständiger Behörde (AT: BASG).
3. Nach Validierung durch Behörde: **SRN** wird vergeben.
4. Alle Rollen (Manufacturer, Authorized Representative falls non-EU, Importer, Distributor) einzeln registriert.

### 3.2 Device-Registration (UDI)

Nach Erhalt der SRN und vor Inverkehrbringen:

- **UDI-DI (Basic)** zuweisen via GS1 oder HIBC (Entscheidung: GS1 empfohlen).
- UDI-PI basierend auf Software-Version (Semantic Version als PI).
- Registrierung in EUDAMED UDI-Modul:
  - Basic UDI-DI
  - UDI-DI (Primary)
  - EMDN-Code (J0203)
  - Risikoklasse IIa
  - Zweckbestimmung (Kurz)
  - Hersteller-SRN
  - Verweis auf NB + Zertifikat
  - CMR/Endocrine-Disruptor-Relevanz (nicht anwendbar für Software)
  - Reusable / Sterile (nicht anwendbar)

### 3.3 Zertifikat-Referenz

Benannte Stelle lädt ausgestelltes Zertifikat in EUDAMED hoch. Hersteller verknüpft seine Device-Registration damit.

### 3.4 Clinical-Investigation-Modul

- Vor Beginn der klinischen Validierungsstudie (siehe `docs/clinical/`): Registrierung.
- Upload: CIP, Ethik-Votum, Studien-Protokoll.
- Status-Updates: Start, Abschluss, Publikation.

### 3.5 Vigilance-Modul

- Schwerwiegende Vorkommnisse (Serious Incidents) werden über EUDAMED gemeldet.
- Field Safety Corrective Actions (FSCA) ebenfalls.
- Trend-Reports gemäß MDR Art. 88.
- PSUR (Periodic Safety Update Report) — jährlich für Klasse IIa.

## 4. Datenqualität

- Jährliche Review aller EUDAMED-Einträge (Teil Management-Review).
- Änderungen am Produkt → UDI-PI-Update, ggf. neue UDI-DI.
- Statuswechsel (z.B. Obsolete) sofort pflegen.

## 5. Übergangsregelung

Falls EUDAMED-Modul zum Zeitpunkt des Markteintritts noch nicht bindend — Rückfall auf **nationale Registrierungs-Systeme**:

| Land | System |
|------|--------|
| AT | BASG-Herstellermeldung |
| DE | DIMDI/BfArM (MPAMIV) |
| CH | Swissmedic (nicht EU — separater Prozess, MEPV) |

## 6. Verantwortlichkeiten

| Aufgabe | Verantwortlich |
|---------|-----------------|
| SRN-Beantragung | PRRC |
| UDI-Vergabe | QM + Development |
| EUDAMED-Upload | Regulatory Affairs |
| Vigilance-Meldungen | PRRC (≤ 15 Tage) |
| Jährliche Review | Regulatory Affairs |

## 7. Checkliste Pre-Launch

- [ ] SRN vorhanden
- [ ] UDI-DI vergeben
- [ ] EMDN/GMDN zugewiesen
- [ ] IFU mehrsprachig online
- [ ] Zertifikat von NB ausgestellt
- [ ] EUDAMED-Device-Eintrag angelegt
- [ ] PMS-Plan aktiv
- [ ] Vigilance-Meldeweg dokumentiert + getestet
- [ ] Nationale Zusatz-Registrierungen (BASG, BfArM, Swissmedic)
