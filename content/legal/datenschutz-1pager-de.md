# CareAI Datenschutz — Überblick für Einrichtungen (Deutschland)

**Version:** 1.0 | **Stand:** 2026-04-18 | **Gültig bis Widerruf / neue Version**

CareAI verarbeitet Pflegedaten ausschließlich im Rahmen eines Auftragsverarbeitungs­vertrages (AVV) nach **Art. 28 DSGVO**. Dieses 1-Pager fasst die zentralen Fakten für Pflegedienstleitungen (PDL) und Datenschutzbeauftragte (DSB) zusammen.

## 1. Verantwortliche und Auftragsverarbeiter

| Rolle | Instanz |
|---|---|
| Verantwortlicher (Art. 4 Nr. 7 DSGVO) | Pflegeeinrichtung |
| Auftragsverarbeiter (Art. 28 DSGVO) | **CareAI GmbH (in Gründung), Wien** |
| Datenschutzbeauftragter CareAI | *[extern zu benennen bei Gründung]* |
| Kontakt | **datenschutz@careai.health** |

## 2. Hosting und Datenfluss

- **Primär-Hosting:** Hetzner Online GmbH, Rechenzentrum Falkenstein (Sachsen, DE) — **ISO 27001 zertifiziert**, DSGVO-konform, ausschließlich EU.
- **Datenbank:** PostgreSQL auf Supabase EU (Frankfurt, DE), redundant.
- **Anwendungsschicht:** Vercel EU (Frankfurt, DE).
- **KI-Verarbeitung:** Anthropic EU-Endpoint (Frankfurt). Keine Datenspeicherung über den Verarbeitungsvorgang hinaus. Kein Trainieren auf Kundendaten (vertraglich ausgeschlossen).
- **Rohdaten** (Pflegedokumentation, Stammdaten Bewohner, Medikation, Vitalwerte) verlassen die EU nicht.
- **Backups:** Täglich inkrementell, wöchentlich vollständig. Verschlüsselt (AES-256). Aufbewahrung 35 Tage rollierend, Off-site in Nürnberg (DE).

## 3. Zugriff und Berechtigung

- Zugriff nur durch **authentifizierte Mitarbeiter der Einrichtung** über rollenbasierte Rechte (RBAC).
- Admin der Einrichtung hat Vollzugriff innerhalb der Einrichtung.
- **CareAI-Support** hat standardmäßig **keinen Zugriff** auf Einrichtungsdaten. Zugriff nur nach schriftlicher Freigabe der Einrichtung, zeitlich befristet, vollständig **audit-geloggt** (Impersonation-Log, unveränderbar).
- 2-Faktor-Authentifizierung (TOTP) Pflicht für alle Admin-Accounts.

## 4. Verschlüsselung

- **In-Transit:** TLS 1.3 (HSTS, HTTP/2).
- **At-Rest:** AES-256 (Postgres TDE + Block-Layer).
- **Sprachaufnahmen (Voice-Agent):** werden **nicht persistent gespeichert**. Verarbeitung in-memory, Transkript kann optional gespeichert werden (opt-in je Einrichtung).

## 5. Aufbewahrung und Löschung

- **Pflegedokumentation:** 10 Jahre (§ 113 SGB XI, § 630f BGB für Behandlungsdokumentation).
- **Dienstplan / Abrechnung:** 10 Jahre (§ 147 AO).
- **Nach Ablauf:** automatisierte, auditierbare Löschung inkl. Backup-Rotation.
- **Vertragsende:** Export aller Daten binnen 30 Tagen, anschließend Löschung mit Löschprotokoll nach **DIN 66398**.

## 6. Betroffenenrechte (Art. 15 – 22 DSGVO)

Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerspruch.
Antrag schriftlich an **datenschutz@careai.health** — Bearbeitung **binnen 30 Tagen**. In-App Self-Service-Export für Bewohner/Angehörige (Art. 20 DSGVO).

## 7. Meldepflichten (Art. 33 / 34 DSGVO)

- Data Breach: Meldung an die zuständige Aufsichtsbehörde **binnen 72 Stunden**.
- Information der Einrichtung (als Verantwortlicher): **unverzüglich**, spätestens binnen 24 h nach Kenntnis.
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

Vollständige Liste: **careai.health/datenschutz/subprocessors** (Änderungen mit 30 Tagen Vorlauf angekündigt).

## 9. Rechte der Einrichtung

- Abschluss eines **AV-Vertrages nach Art. 28 DSGVO** (Muster liegt bei).
- **Datenschutz-Folgenabschätzung (DSFA)** liegt vor (Art. 35 DSGVO).
- Jährliche **TOM-Zertifizierung** auf Anforderung.
- **Audit-Recht** nach Anmeldung (Remote oder Vor-Ort Hetzner auf Antrag).

---

**Prüfen Sie die Live-Version dieses Dokuments:**

[QR-Code-Platzhalter] → `https://repocare.vercel.app/datenschutz`

**CareAI GmbH (i.G.)** · Wien, Österreich · datenschutz@careai.health · Doc-ID: `DS-1P-DE-v1.0`

**Quellen:** BfDI-Leitfaden zu Art. 28 DSGVO (bfdi.bund.de, Abruf 2026-04-18) · DSK Kurzpapier Nr. 13 Auftragsverarbeitung (datenschutzkonferenz-online.de, Abruf 2026-04-18) · BayLDA TOM-Matrix (lda.bayern.de, Abruf 2026-04-18).
