# 08 — Labeling & Instructions for Use (IFU)

**Dokument-ID:** CAI-REG-008
**Version:** 1.0 — Draft
**Basis:** MDR Annex I §23, EN ISO 15223-1, EN ISO 20417, MDR Art. 10(11)

## 1. Anforderungen

Da CareAI **reine Software** (keine physische Packung), erfolgt Labeling **elektronisch** (eIFU-Richtlinie — VO 207/2012 sinngemäß):

- In-App-Hilfe "Über / Geräte-Information"
- Login-Screen mit UDI + Version
- PDF-Download der IFU (mehrsprachig)
- Webseite **careai.at/ifu** mit allen Sprachversionen

## 2. Label-Elemente (Pflicht)

| Element | Quelle | In-App-Position |
|---------|--------|-----------------|
| CE-Kennzeichen + NB-Nr. (0123) | MDR Anhang V | Footer + "Über" |
| UDI-DI + UDI-PI | MDR Art. 27 | "Über"-Dialog |
| Produktname + Version | — | Header + "Über" |
| Hersteller-Name + Anschrift | MDR Anhang I §23.2(a) | "Über" |
| Verantwortliche Person (PRRC) | MDR Art. 15 | IFU §1 |
| MD-Symbol (ISO 15223-1 §5.7.7) | — | Login-Screen |
| Factory-Symbol + Datum | — | "Über" |
| "IFU elektronisch verfügbar" Symbol | ISO 15223-1 §5.4.3 | Login-Screen |
| Warnhinweise | MDR Annex I §23.4 | IFU §3 |

## 3. IFU-Struktur

### §1 Identifikation & Hersteller
Produktname, Version, Hersteller, SRN, PRRC-Kontakt, NB-Nr.

### §2 Zweckbestimmung & Indikationen
Vollständiger Intended-Use-Statement (aus Dok. 01).

### §3 Warnhinweise & Vorsichtsmaßnahmen

Pflicht-Warnhinweise, prominent platziert:

> ⚠️ **WARNUNG:** CareAI dient **ausschließlich der Entscheidungsunterstützung**. Die klinische Beurteilung und Therapieentscheidung liegt ausschließlich bei qualifiziertem Pflegepersonal bzw. der behandelnden Ärztin / dem behandelnden Arzt.
>
> ⚠️ **KONTRAINDIKATION:** Nicht für akut-stationäre Versorgung, Intensivmedizin, Notfallmedizin oder Pädiatrie zugelassen.
>
> ⚠️ **HUMAN-IN-THE-LOOP:** Alle Empfehlungen müssen von einer qualifizierten Fachkraft bewertet werden. Keine automatische Umsetzung.
>
> ⚠️ **DATENQUALITÄT:** Die Prädiktionsgüte hängt von Vollständigkeit und Aktualität der Dokumentation ab.

### §4 Systemvoraussetzungen

- Browser: Chrome ≥ 120, Edge ≥ 120, Safari ≥ 17, Firefox ≥ 120
- iOS ≥ 16, Android ≥ 12
- Netzwerk: min. 2 Mbit/s pro Nutzer
- Mindest-Auflösung: 1024×768 (Desktop), 768×1024 (Tablet)

### §5 Installation & Einrichtung

SaaS-Modell — keine lokale Installation. Einrichtung über Admin-Portal (dokumentiert).

### §6 Bedienungsanleitung (Kern-Workflows)

- Login + MFA
- SIS-Erfassung (schrittweise)
- Dekubitus-Risiko-Alert lesen und interpretieren
- Alert quittieren / Maßnahme planen
- Dokumentation exportieren (PDF)
- Incident / Technischer Fehler melden

### §7 Fehlermeldungen & Troubleshooting

Tabelle Error-Code → Beschreibung → Abhilfe → Support-Kontakt.

### §8 Wartung & Updates

Updates werden automatisch ausgeliefert. Wesentliche Änderungen (funktionell) werden angekündigt. Release-Notes verfügbar.

### §9 Vigilance & Incident-Meldung

Schwerwiegende Vorkommnisse sind unverzüglich an **vigilance@careai.at** zu melden (+ nationale Behörde BASG/BfArM/Swissmedic).

### §10 Datenschutz

Verweis auf Privacy-Policy + DPA-Template.

### §11 Cybersecurity-Hinweise

Benutzer sollten: MFA aktivieren, Passwörter nicht teilen, verdächtige Vorgänge an security@careai.at melden, Gerät nicht unbeaufsichtigt lassen.

### §12 Kontakt & Support

- Technischer Support: support@careai.at, +43 XXX
- Regulatory/Vigilance: vigilance@careai.at
- Datenschutz: dsb@careai.at

## 4. Sprachversionen

MDR Art. 10(11) + nationale Umsetzung — IFU in allen Amtssprachen der Vertriebsländer:

| Land | Sprachen | Pflicht |
|------|----------|---------|
| Österreich | Deutsch | ja |
| Deutschland | Deutsch | ja |
| Schweiz | Deutsch, Französisch, Italienisch | alle drei |
| Liechtenstein | Deutsch | ja |
| EU-Expansion Phase 3 | jeweilige Amtssprache | ja |

## 5. Versionierung

| Feld | Wert |
|------|------|
| IFU-Versionsnummer | Semantic, entkoppelt von Software-Version |
| Änderungs-Historie | in QMS |
| Änderungs-Trigger | funktionelle Änderungen, neue Warnhinweise, regulatorische Updates |
| Mitteilung an Nutzer | Login-Banner bei Major-Änderung, E-Mail an Admins |
| Archivierung alte Versionen | 10 Jahre ab letztem Inverkehrbringen |

## 6. eIFU-Validierung

- Jährliche Prüfung der Zugänglichkeit (404-Monitoring, Uptime-Monitor).
- Bei Wartungsfenstern: Cache-Version mit "letzte aktualisierte Version" sichtbar.
- Print-on-demand möglich (PDF-Download).

## 7. Änderungsprozess

IFU-Änderungen unterliegen Change-Control (SOP-12). Bei **wesentlichen Änderungen** → Information an Benannte Stelle + Anwender + ggf. EUDAMED-Update.
