# CareAI Datenschutz — Überblick für Einrichtungen (Österreich)

**Version:** 1.0 | **Stand:** 2026-04-18 | **Gültig bis Widerruf / neue Version**

CareAI verarbeitet Pflegedaten ausschließlich als **Auftragsverarbeiter nach Art. 28 DSGVO** in Verbindung mit dem österreichischen **Datenschutzgesetz (DSG)** sowie dem **Gesundheitstelematikgesetz (GTelG 2012)**. Dieses 1-Pager fasst die zentralen Fakten für Pflegedienstleitungen (PDL) und Heimleitungen in Österreich zusammen.

## 1. Verantwortliche und Auftragsverarbeiter

| Rolle | Instanz |
|---|---|
| Verantwortlicher | Pflegeeinrichtung (Träger) |
| Auftragsverarbeiter | **CareAI GmbH (in Gründung), Wien** |
| Datenschutzbeauftragter CareAI | *[extern zu benennen bei Gründung]* |
| Aufsichtsbehörde | Österreichische Datenschutzbehörde (DSB), Barichgasse 40–42, 1030 Wien |
| Kontakt | **datenschutz@careai.health** |

## 2. Hosting und Datenfluss (Datenlokation: EU)

- **Primär-Hosting:** Hetzner Online GmbH, Rechenzentrum Falkenstein (Deutschland) — **ISO 27001 zertifiziert**, DSGVO-konform.
- **Datenbank:** PostgreSQL auf Supabase EU (Frankfurt), redundant.
- **Anwendungsschicht:** Vercel EU (Frankfurt).
- **KI-Verarbeitung:** Anthropic EU-Endpoint (Frankfurt). Keine Speicherung über den Verarbeitungsvorgang hinaus. Kein Training auf Kundendaten (vertraglich ausgeschlossen).
- **Gesundheitsdaten** (Art. 9 DSGVO, § 4 Z 2 DSG) verlassen die EU nicht.
- **Backups:** Täglich inkrementell, wöchentlich voll. AES-256. Off-site Nürnberg (DE). Aufbewahrung 35 Tage rollierend.

## 3. Zugriff und Berechtigung

- Zugriff nur durch **authentifiziertes Pflegepersonal** der Einrichtung über rollenbasierte Rechte (RBAC).
- Heimleitung bzw. Einrichtungs-Admin hat Vollzugriff innerhalb der Einrichtung.
- **CareAI-Support** hat standardmäßig **keinen Zugriff**. Zugriff nur nach schriftlicher Freigabe der Einrichtung, zeitlich befristet, **audit-geloggt** (unveränderbar).
- 2-Faktor-Authentifizierung (TOTP) Pflicht für alle Admin-Accounts.

## 4. Verschlüsselung

- **In-Transit:** TLS 1.3.
- **At-Rest:** AES-256.
- **Sprachaufnahmen:** nicht persistent, Transkripte nur opt-in.

## 5. Aufbewahrung und Löschung

- **Pflegedokumentation:** 10 Jahre nach § 5 Abs. 2 GuKG (Gesundheits- und Krankenpflegegesetz) sowie § 51 ÄrzteG (für ärztlich angeordnete Dokumentation).
- **Abrechnungsunterlagen:** 7 Jahre (§ 132 BAO).
- **Nach Ablauf:** auditierbare Löschung inkl. Backup-Rotation.
- **Vertragsende:** Export aller Daten binnen 30 Tagen, anschließend Löschung mit Löschprotokoll nach DIN 66398.

## 6. Betroffenenrechte (Art. 15 – 22 DSGVO, §§ 24 ff. DSG)

Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerspruch.
Antrag schriftlich an **datenschutz@careai.health** — Bearbeitung **binnen 30 Tagen**. Self-Service-Export in-App.

## 7. Meldepflichten (Art. 33 / 34 DSGVO)

- Data Breach: Meldung an die **Österreichische Datenschutzbehörde** binnen **72 Stunden**.
- Information der Einrichtung: unverzüglich, spätestens binnen 24 h.
- Incident-Runbook vorhanden (siehe TOM-Dokument §8).

## 8. Unter-Auftragsverarbeiter (Sub-Processors)

| Anbieter | Zweck | Standort | AVV |
|---|---|---|---|
| Hetzner Online GmbH | Hosting, Backups | Falkenstein, DE | ja |
| Anthropic PBC | LLM-Inferenz | EU (Frankfurt) | ja |
| Supabase, Inc. | Postgres DBaaS | Frankfurt, DE | ja |
| Vercel, Inc. | Application Hosting | Frankfurt, DE | ja |
| Resend | Transaktionsmail | EU (Irland) | ja |
| Cloudflare | CDN / WAF | EU-first | ja |

Vollständige Liste: **careai.health/datenschutz/subprocessors** (30 Tage Vorlauf bei Änderungen).

## 9. Rechte der Einrichtung

- **AV-Vertrag** nach Art. 28 DSGVO (Muster liegt bei).
- **DSFA** liegt vor (Art. 35 DSGVO).
- Jährliche **TOM-Zertifizierung**.
- **Audit-Recht** nach Anmeldung.

## 10. Österreich-spezifische Besonderheiten

- **ELGA-Schnittstelle:** CareAI bietet optional Anbindung an die Elektronische Gesundheitsakte (ELGA) gemäß GTelG 2012. Betrieb ausschließlich über den nationalen ELGA-Gateway.
- **SV-Abrechnung:** Export im ÖGK-Format für Sozialversicherungs-Abrechnung (siehe Abrechnungs-1-Pager).
- **Meldepflicht:** bei schwerwiegenden Vorfällen zusätzlich an die zuständige Heimaufsicht (Länderkompetenz).

---

[QR-Code-Platzhalter] → `https://repocare.vercel.app/datenschutz`

**CareAI GmbH (i.G.)** · Wien, Österreich · datenschutz@careai.health · Doc-ID: `DS-1P-AT-v1.0`

**Quellen:** DSB Österreich, Leitfaden Auftragsverarbeitung (dsb.gv.at, Abruf 2026-04-18) · BMSGPK, GTelG 2012 idgF (ris.bka.gv.at, Abruf 2026-04-18) · ÖGK Technischer Leitfaden Datenträgeraustausch (gesundheitskasse.at, Abruf 2026-04-18).
