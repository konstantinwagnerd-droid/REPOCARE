# Datenschutz-Folgenabschätzung (DSFA) — CareAI Pflege-Plattform

**Version:** 1.0 | **Stand:** 2026-04-18 | **Verantwortlich:** CareAI GmbH (i.G.), Wien
**Geltungsbereich:** SaaS-Plattform CareAI (Pflegedokumentation, Dienstplan, KI-Assistenz, Abrechnung, Angehörigen-Portal)

Diese DSFA wurde erstellt gemäß **Art. 35 DSGVO** unter Berücksichtigung der Leitlinien des Europäischen Datenschutzausschusses (**WP 248 rev.01**), der Muster-DSFA der **DSK (Kurzpapier Nr. 5)** und der österreichischen **DSB-Verordnung DSFA-V**. Da Gesundheitsdaten nach Art. 9 DSGVO systematisch und in großem Umfang verarbeitet werden, ist eine DSFA verpflichtend (Art. 35 Abs. 3 lit. b DSGVO; vgl. DSB-Blacklist Z. 1).

---

## 1. Beschreibung der geplanten Verarbeitung

### 1.1 Verarbeitungsvorgänge
- **Pflegedokumentation** (digital, strukturiert, SIS®-kompatibel)
- **Medikationsmanagement** (Stellplan, Anforderungen, MD-Prüfungen)
- **Dienstplanung** mit Qualifikations-Matching und Regelcheck
- **Sprach-KI** für diktierte Pflegeberichte (Voice-Agent, EU-endpoint)
- **KI-Auswertung** für Qualitätsindikatoren (aggregiert)
- **Abrechnungs­vorbereitung** (Export in Clearing-Formate nach § 302 SGB V / ÖGK)
- **Angehörigen-Kommunikation** (Messaging, Kalender, Dokumente)
- **Reporting / Audit-Exporte** (PDF mit Hash + QR-Verifizierung)

### 1.2 Art, Umfang, Umstände, Zwecke
- **Art:** KI-gestützte SaaS-Verarbeitung; Cloud-basiert auf EU-Infrastruktur.
- **Umfang:** je Einrichtung typ. 80–300 Bewohner, 50–150 Mitarbeiter, ca. 10–30 Datenpunkte pro Pflegeeintrag.
- **Umstände:** stationäre und ambulante Pflege; Schichtbetrieb; Angehörigen-Zugriff opt-in.
- **Zwecke:** Vertragserfüllung Pflegevertrag (Art. 6 Abs. 1 lit. b DSGVO) sowie gesetzliche Dokumentationspflicht (Art. 6 Abs. 1 lit. c i.V.m. § 113 SGB XI / § 5 GuKG), Gesundheitsdaten auf Grundlage von Art. 9 Abs. 2 lit. h DSGVO i.V.m. § 22 BDSG / § 9 öDSG.

### 1.3 Datenarten und Betroffene
- Gesundheitsdaten (Art. 9), Stammdaten, Kontakt, Abrechnung, Mitarbeiterdaten, Voice-Transkripte.
- Betroffene: Bewohner/Klienten, Angehörige, Personal, Ärzte, Behörden.

### 1.4 Empfänger
- Einrichtung selbst (Verantwortlicher), Kranken-/Pflegekassen (über Clearing), Heimaufsicht auf Anforderung, MDK/MD bei Prüfungen (auf Weisung Verantwortlicher).

### 1.5 Speicherdauer
- 10 Jahre Pflegedokumentation (§ 113 SGB XI / § 5 GuKG), 7–10 Jahre Abrechnung (BAO/AO).

---

## 2. Notwendigkeits- und Verhältnismäßigkeitsprüfung

### 2.1 Notwendigkeit
Die Verarbeitung ist zur Erfüllung des Pflegevertrages und gesetzlicher Dokumentationspflichten erforderlich. Ohne digitale Verarbeitung können die geforderten Qualitätsindikatoren (QPR, indikatorengestützte Qualitätsdarstellung) nicht geliefert werden.

### 2.2 Verhältnismäßigkeit
- **Datenminimierung (Art. 5 Abs. 1 lit. c):** Nur für die Pflege notwendige Felder; KI-Features sind opt-in.
- **Zweckbindung:** keine Sekundärnutzung; KI-Training auf Kundendaten ist vertraglich ausgeschlossen.
- **Speicherbegrenzung:** automatisierte Löschung nach Ablauf gesetzlicher Fristen.
- **Richtigkeit:** Edit-Tracking mit Versionshistorie; Korrekturrecht in-App.
- **Transparenz:** Datenschutz-Hinweise für Bewohner in einfacher Sprache verfügbar.

### 2.3 Rechtsgrundlagen
| Zweck | DSGVO-Rechtsgrundlage | nationale Ergänzung |
|---|---|---|
| Pflegevertrags­erfüllung | Art. 6 Abs. 1 lit. b | — |
| Dokumentationspflicht | Art. 6 Abs. 1 lit. c | § 113 SGB XI / § 5 GuKG |
| Gesundheitsdaten | Art. 9 Abs. 2 lit. h | § 22 BDSG / § 9 öDSG |
| Abrechnung | Art. 6 Abs. 1 lit. c | § 302 SGB V / ASVG |
| KI-Assistenz (optional) | Art. 9 Abs. 2 lit. a (Einwilligung) | ggf. separate Einwilligung |

---

## 3. Risikobewertung für die Rechte und Freiheiten betroffener Personen

Bewertungsraster: Eintrittswahrscheinlichkeit × Schwere (jeweils niedrig / mittel / hoch).

### 3.1 Risikoinventar

| # | Risiko | Wahrsch. | Schwere | Gesamt |
|---|---|---|---|---|
| R1 | Unbefugter Zugriff durch Dritte (externe Angreifer) | mittel | hoch | **hoch** |
| R2 | Unbefugter Zugriff durch CareAI-Personal | niedrig | hoch | mittel |
| R3 | Unbefugter Zugriff durch interne Einrichtungs­mitarbeiter (nicht autorisiert) | mittel | mittel | mittel |
| R4 | Datenverlust (technischer Ausfall) | niedrig | hoch | mittel |
| R5 | Fehlerhafte KI-Ausgabe → medizinische Fehlentscheidung | mittel | hoch | **hoch** |
| R6 | Unbefugte Offenlegung via Sub-Processor | niedrig | hoch | mittel |
| R7 | Datenübermittlung in Drittland (US-Zugriff) | niedrig | hoch | mittel |
| R8 | Identitäts- / Rollenverwechslung (Impersonation) | niedrig | mittel | niedrig |
| R9 | Verarbeitung zu nicht-autorisierten Zwecken (KI-Training) | sehr niedrig | hoch | niedrig |
| R10 | Übermäßige Aufbewahrung / verzögerte Löschung | mittel | niedrig | niedrig |
| R11 | Angehörigen-Portal: Zugriff durch Unbefugte im Familienkreis | mittel | mittel | mittel |
| R12 | Voice-Agent: unbeabsichtigte Aufnahme Dritter | mittel | mittel | mittel |

### 3.2 Rechte, die betroffen sein könnten
Vertraulichkeit (Art. 5 Abs. 1 lit. f), Selbstbestimmung über Gesundheitsdaten (Art. 9), Diskriminierungsschutz, Recht auf Berichtigung, Recht auf Auskunft.

---

## 4. Abhilfemaßnahmen

### 4.1 Zu R1 (externe Angreifer)
- TLS 1.3, AES-256, HSTS, CSP, SRI, WAF (Cloudflare)
- Penetrationstests jährlich + nach Major-Releases
- SOC-Monitoring, anomaly-detection auf Audit-Logs
- Bug-Bounty (geplant Q4/2026)

### 4.2 Zu R2 (CareAI-Personal)
- Null-Zugriff-Default: Support sieht keine Kundendaten
- Impersonation nur nach schriftlicher Kundenfreigabe, zeitlich befristet, vollständig auditiert
- Strafbewehrte Vertraulichkeitsvereinbarung; Hintergrund­überprüfung Schlüsselpersonal

### 4.3 Zu R3 (interne Einrichtungs­mitarbeiter)
- Rollenmodell mit Minimalprinzip
- Vierteljährliche Berechtigungs-Review
- Audit-Log einsehbar für Einrichtungs-Admin

### 4.4 Zu R4 (Datenverlust)
- Multi-AZ-Betrieb, DB-Replikation, tägliche verschlüsselte Backups
- RPO ≤ 1h, RTO ≤ 4h; jährlicher DR-Test

### 4.5 Zu R5 (KI-Fehlausgabe)
- **Human-in-the-loop Pflicht** für medizinisch relevante Ausgaben
- KI-Ausgaben sind als Vorschlag gekennzeichnet, nicht als Entscheidung
- Edit-Tracking dokumentiert jede Korrektur
- EU-AI-Act: System ist nach Art. 6 Abs. 1 lit. a (Health) als **Hoch-Risiko** einzustufen; Konformitäts­bewertung wird bis Anwendungsbeginn (August 2027) abgeschlossen; Risiko­management-System (Art. 9 AI-Act) eingeführt

### 4.6 Zu R6 (Sub-Processor)
- AV-Verträge mit allen Sub-Processors, SCCs wo erforderlich
- 30-Tage-Vorlauf bei Änderungen, Widerspruchsrecht für Verantwortliche

### 4.7 Zu R7 (Drittlandtransfer)
- Ausschließlich EU-Regionen für Datenverarbeitung
- Anthropic EU-Endpoint, Supabase EU, Vercel EU
- SCCs + zusätzliche Maßnahmen (Verschlüsselung, strikte Zweckbindung)

### 4.8 Zu R8 (Impersonation)
- 2FA Pflicht, Geräte-Binding für sensitive Rollen
- Impersonation-Log, PDFs mit Signatur des handelnden Users

### 4.9 Zu R9 (Zweckbindung)
- Vertragliches Verbot KI-Training mit Kundendaten (Anthropic-Enterprise-Terms)
- Technisch: kein Export an Trainings-Pipelines; Datenfluss auditiert

### 4.10 Zu R10 (Aufbewahrung)
- Automatisierte Löschroutine mit Protokoll
- Sperrung statt sofortiger Löschung bei laufenden Rechtsstreitigkeiten

### 4.11 Zu R11 (Angehörigen-Portal)
- Einladung per E-Mail + Einmal-Code, 2FA optional
- Zugriff nur auf explizit freigegebene Inhalte
- Widerruf jederzeit durch Bewohner/Betreuer

### 4.12 Zu R12 (Voice-Agent)
- Hinweis-Signal vor Aufnahme
- Keine persistente Speicherung, Transkript opt-in
- Hinweis- und Einwilligungspflicht an Mitarbeitende und Bewohner

### 4.13 Restrisiko
Nach Umsetzung der Maßnahmen verbleibt ein **mittleres Restrisiko für R1 und R5**. Eine **Konsultation der Aufsichts­behörde nach Art. 36 DSGVO ist nicht erforderlich**, da die Restrisiken durch organisatorische (Human-in-the-loop) und technische Maßnahmen auf ein vertretbares Maß reduziert sind.

---

## 5. Nachweis der Einhaltung

### 5.1 Dokumentation
- Dieses DSFA-Dokument (turnusmäßige Review 12-monatlich oder bei wesentlichen Änderungen)
- AV-Vertrag (Art. 28 DSGVO)
- TOM-Dokument (Art. 32)
- Verzeichnis von Verarbeitungstätigkeiten (Art. 30) — intern geführt
- Incident-Register

### 5.2 Governance
- Datenschutzbeauftragter (extern, Benennung binnen 30 Tagen nach Gründung)
- DSFA-Review jährlich + ad-hoc bei Änderungen
- Freigabe durch Geschäftsführung dokumentiert

### 5.3 Beteiligung des DSB und betroffener Personen
- DSB-Stellungnahme (ausstehend, wird in Version 1.1 integriert)
- Feedback der Pilot-Einrichtungen wird in turnusmäßige Reviews einbezogen

---

## 6. Freigabe

| Rolle | Name | Datum | Unterschrift |
|---|---|---|---|
| Geschäftsführung | {{GESCHAEFTSFUEHRUNG}} | {{DATUM}} | |
| Datenschutzbeauftragter | {{DSB_NAME}} | {{DATUM}} | |
| Pflegefachliche Leitung | {{PFL_NAME}} | {{DATUM}} | |

---

**Dokument-ID:** `DSFA-CAREAI-v1.0` · **Nächste Review:** 2027-04-18

**Quellen:**
- EDSA (Art. 29 WP) — Leitlinien zur DSFA (WP 248 rev.01), edpb.europa.eu, Abruf 2026-04-18
- DSK — Kurzpapier Nr. 5 „Datenschutz-Folgenabschätzung nach Art. 35 DSGVO" (datenschutzkonferenz-online.de), Abruf 2026-04-18
- BayLDA — Muster zur DSFA (lda.bayern.de), Abruf 2026-04-18
- DSB Österreich — DSFA-Verordnung BGBl. II Nr. 278/2018 (ris.bka.gv.at), Abruf 2026-04-18
- VO (EU) 2024/1689 (AI-Act) — Kapitel III (Hoch-Risiko-KI), Abruf 2026-04-18
