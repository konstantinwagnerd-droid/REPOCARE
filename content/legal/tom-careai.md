# Technische und Organisatorische Maßnahmen (TOM) — CareAI

**Version:** 1.0 | **Stand:** 2026-04-18 | **Gültig:** 12 Monate, danach Review.
**Rechtsgrundlage:** Art. 32 DSGVO, § 64 BDSG, § 14 öDSG. Struktur nach BayLDA-TOM-Matrix in der Fassung 2023.

Dieses Dokument beschreibt die technischen und organisatorischen Maßnahmen, die CareAI als Auftragsverarbeiter zur Gewährleistung eines dem Risiko angemessenen Schutzniveaus implementiert hat.

---

## 1. Zutrittskontrolle

**Ziel:** Unbefugten den physischen Zutritt zu Datenverarbeitungsanlagen verwehren.

**CareAI-Büro (Wien):**
- Zutritt mit personalisiertem Transponder, Log aller Zutritte
- Besucher nur mit Begleitung, Besuchsprotokoll
- Serverraum existiert nicht am CareAI-Standort — gesamte Verarbeitung in Hetzner-RZ

**Hetzner-Rechenzentrum Falkenstein (Primär-Hosting):**
- Biometrische Zutrittskontrolle (Iris-Scan, Fingerabdruck)
- Mantrap / Vereinzelungsanlage am Eingang
- Videoüberwachung 24/7, Aufbewahrung 90 Tage
- Sicherheitspersonal 24/7 vor Ort
- Mehrstufige Sicherheits­perimeter, umschließende Zaunanlage mit Bewegungsmeldern
- Zutritt zu Serverschränken nur für benannte Techniker
- ISO 27001, TÜV-geprüft

**Supabase / Vercel (Sub-Processors):**
- Hosting auf AWS Frankfurt (eu-central-1) / Google Cloud Frankfurt — SOC 2 Type II, ISO 27001, ISO 27017, ISO 27018 für RZ-Physik.

---

## 2. Zugangskontrolle

**Ziel:** Verhindern, dass Datenverarbeitungssysteme von Unbefugten genutzt werden.

- **Authentifizierung:** Username + Passwort + **2-Faktor (TOTP)** Pflicht für alle Admin-Rollen; empfohlen für alle Nutzer
- **Passwort-Policy:** min. 12 Zeichen, Zxcvbn-Score ≥ 3, keine kompromittierten Passwörter (HIBP-Check)
- **Account-Lockout:** nach 5 Fehlversuchen, progressive Delays
- **Session-Management:** Timeout nach 30 Minuten Inaktivität, 8h absolutes Maximum; Session-Rotation bei Privileg-Wechsel
- **SSO:** SAML 2.0 / OIDC optional für Einrichtungen
- **Device-Binding:** optional für sensitive Rollen
- **Passwortloses Login:** WebAuthn / Passkeys unterstützt
- **Admin-Zugriff zum Backend:** nur über VPN + 2FA + Jumphost, IP-Whitelisting
- **Brute-Force-Schutz:** Cloudflare Rate-Limiting + Turnstile-Challenges

---

## 3. Zugriffskontrolle

**Ziel:** Gewährleisten, dass zur Nutzung Berechtigte ausschließlich auf die ihrer Berechtigung unterliegenden Daten zugreifen können.

- **Rollenbasierte Zugriffskontrolle (RBAC)** mit granularen Rechten (ca. 60 Permissions)
- **Minimalprinzip:** jeder Nutzer erhält nur die minimal notwendigen Rechte
- **Segregation of Duties:** z.B. Medikations-Freigabe ≠ Erstellung
- **Vierteljährliche Berechtigungs-Reviews** durch Einrichtungs-Admin, automatisierter Report
- **Impersonation-Log:** Support-Zugriff erzeugt unveränderbaren Audit-Eintrag (append-only)
- **Datenbank-Zugriff:** nur über Application-Layer (niemals Direct-DB für Endnutzer), Admin-DB-Zugriff über bastion+read-only-replica für Analytics
- **API-Token:** zeitlich befristet, pro Zweck (Least-Privilege), rotierbar, widerrufbar
- **Mobile Apps:** Biometric-Unlock, Local-Encryption, Remote-Wipe bei Verlust
- **Kiosk-Modus:** Shared-Device-Nutzung mit Personal-PIN + automatisches Logout

---

## 4. Trennungskontrolle

**Ziel:** Gewährleisten, dass zu unterschiedlichen Zwecken erhobene Daten getrennt verarbeitet werden.

- **Multi-Tenancy** mit **Row-Level-Security** (Postgres RLS) je Einrichtung
- **Separate Datenbank-Schemas** für Produktion / Staging / Entwicklung
- **Keine Produktivdaten in Non-Prod-Umgebungen** — synthetische / anonymisierte Testdaten
- **Separate Backup-Encryption-Keys** je Einrichtung (Envelope-Encryption mit HSM-verwalteten Master-Keys)
- **Logische Trennung** Bewohner- / Mitarbeiter- / Abrechnungsdaten auf Applikations­ebene
- **Cross-Tenant-Zugriff** technisch verhindert (SQL-Policies + Integrationstests)

---

## 5. Pseudonymisierung (Art. 32 Abs. 1 lit. a DSGVO)

- Bewohner- und Mitarbeiter-IDs sind UUIDs, nicht ableitbar
- **Analytics / Telemetry:** keine Klardaten, nur aggregierte Kennzahlen
- **KI-Logging:** Prompts und Ausgaben werden pseudonymisiert zur Qualitätssicherung gespeichert (optional, opt-in Einrichtung)
- **Support-Tickets:** können ohne Klardaten erstellt werden (Einrichtungen ermuntern das)
- **Externe Referenzen** (z.B. Abrechnung): Token statt Versichertennummer in Analytics-Pfaden

---

## 6. Verschlüsselung (Art. 32 Abs. 1 lit. a DSGVO)

**In-Transit:**
- TLS 1.3, Mindest-Ciphers: AEAD-Familie, Perfect Forward Secrecy
- HSTS mit preload
- HTTP/2 + HTTP/3 (QUIC)
- Certificate Pinning für Mobile Apps
- Interne Service-to-Service: mTLS

**At-Rest:**
- **AES-256** (GCM für DB-Inhalte, CBC für Filestorage)
- Postgres **TDE** + LUKS auf Block-Layer
- Backups: verschlüsselt vor Auslagerung, separate Keys
- Voice-Files: in-memory, wenn persistiert dann AES-256

**Key-Management:**
- **HSM-verwaltete** Master-Keys (Hetzner Key-Management / AWS KMS für Sub-Processor-Layer)
- Key-Rotation: 12 Monate planmäßig, ad-hoc bei Verdacht auf Kompromittierung
- Getrennte Keys für Tenants (Envelope-Encryption)

---

## 7. Integrität

**Ziel:** Personenbezogene Daten bleiben während der Verarbeitung unversehrt, vollständig und aktuell.

- **Hash-Chain** für Pflegedokumentation: jeder Eintrag referenziert den Hash des Vorgängers (append-only, Merkle-Struktur)
- **Append-only Audit-Log** (separates Storage, technisch nicht überschreibbar, WORM-ähnlich)
- **PDF-Exports** mit **SHA-256-Hash** im Footer + QR-Code zur Online-Verifikation
- **Edit-Tracking** für alle Änderungen mit Benutzer, Zeitstempel und Grund
- **Digitale Signaturen** für Freigaben (Medikation, Dienstplan, Abschlüsse)
- **Checksummen** für Datei-Uploads
- **Integritätschecks** Backups: nach jeder Sicherung Verifikations-Restore auf Sandbox
- **Anti-Replay-Schutz** für APIs (Nonce + Timestamp)

---

## 8. Verfügbarkeit und Belastbarkeit (Art. 32 Abs. 1 lit. b + c DSGVO)

**SLA und Zielwerte:**
- Verfügbarkeit SLA **99,9 %** (entspricht ≤ 8,77h Downtime / Jahr)
- **RPO** (Recovery Point Objective): **≤ 1 Stunde**
- **RTO** (Recovery Time Objective): **≤ 4 Stunden**

**Infrastruktur:**
- Multi-AZ-Deployment
- Datenbank-Replikation (synchron primary/secondary, asynchron reporting-replica)
- Automatic Failover ≤ 60 Sekunden
- Load-Balancer mit Health-Checks
- Auto-Scaling bei Last

**Backups:**
- **Täglich inkrementell**, **wöchentlich voll**
- Aufbewahrung **35 Tage rollierend**
- Off-site zweites Rechenzentrum (Nürnberg)
- Verschlüsselt, separat verwaltete Keys
- Point-in-Time-Recovery (PITR) für Postgres (letzte 7 Tage)

**Disaster Recovery:**
- DR-Plan dokumentiert
- **Jährlicher DR-Test** mit dokumentiertem Ergebnis
- Runbooks für Standard-Incidents (DB-Ausfall, Region-Ausfall, Ransomware)

**Resilienz (Belastbarkeit):**
- DDoS-Schutz über Cloudflare
- Rate-Limiting auf API-Ebene
- Graceful Degradation: Offline-First für Mobile-App, Sync-Queue bei Netzausfall
- **Strompuffer / USV** im Hetzner-RZ: 72 Stunden Autarkie, Diesel-Generatoren
- **Brandschutz** Hetzner: Argon-Inergen-Löschanlage
- **Redundante Netzanbindungen** (mehrere Carrier)

---

## 9. Verfahren zur regelmäßigen Überprüfung (Art. 32 Abs. 1 lit. d DSGVO)

- **Jährliche Penetrationstests** durch unabhängigen Dienstleister
- **Vierteljährliche interne Sicherheits-Reviews**
- **Dependency-Scanning** (tägl., automatisiert) mit Auto-PR bei kritischen CVEs
- **SAST / DAST** in CI/CD-Pipeline
- **Code-Review-Pflicht** für alle Änderungen (4-Augen-Prinzip)
- **Incident-Response-Übungen** halbjährlich
- **DSFA-Review** jährlich oder bei wesentlichen Änderungen
- **TOM-Review** jährlich (nächste Review: 2027-04-18)

---

## 10. Incident-Response und Meldeprozess

- **Runbook** für Security-Incidents dokumentiert (Alert → Triage → Containment → Eradication → Recovery → Lessons Learned)
- **24h-Erreichbarkeit** für kritische Meldungen (security@careai.health)
- **72h-Meldeweg an Aufsichtsbehörde** (Art. 33 DSGVO) — CareAI unterstützt den Verantwortlichen
- **24h-Information** an Verantwortlichen nach Kenntnis
- **Incident-Register** (intern), Nachweiserbringung auf Anforderung

---

## 11. Auftragskontrolle (Zusammenarbeit mit Verantwortlichen)

- AV-Vertrag Art. 28 DSGVO (Muster liegt vor)
- Dokumentierte Weisungen nur schriftlich / in Textform
- Support-Zugriff auf Kundendaten **nur mit schriftlicher Freigabe**, zeitlich befristet, vollständig auditiert
- Sub-Processor-Liste öffentlich, 30-Tage-Vorlauf bei Änderungen

---

## 12. Besondere Maßnahmen für KI-Verarbeitung

- **Zweckbindung:** Kundendaten werden **nicht zum Training** von KI-Modellen verwendet (vertraglich mit Anthropic, technisch ausgeschlossen)
- **Human-in-the-loop** für medizinisch relevante Ausgaben
- **KI-Ausgaben als Vorschlag** gekennzeichnet, nicht als Entscheidung
- **Edit-Tracking** dokumentiert jede manuelle Korrektur
- **EU-AI-Act Konformität:** System wird als Hoch-Risiko-System (Annex III Nr. 5 — Zugang zu essenziellen Diensten) eingestuft; Konformitäts­bewertung bis 2027 geplant
- **Prompt- und Response-Logging** pseudonymisiert, nur zur Qualitätssicherung, opt-in je Einrichtung

---

## 13. Tabu-Zonen (interne Architektur-Entkopplung)

Folgende Komponenten bleiben strikt vom Datenschutz-Workflow entkoppelt:
- Voice-Agent: in-memory Processing, keine Default-Persistenz
- Template-Agent (Abrechnung): keine Klardaten in Templates
- Offline-Agent: Local-Encryption auf Device
- Edit-Tracking-Agent: nur append, nie modify

---

**Dokument-ID:** `TOM-CAREAI-v1.0` · **Nächste Review:** 2027-04-18

**Quellen:**
- BayLDA TOM-Matrix (lda.bayern.de, Abruf 2026-04-18)
- BSI IT-Grundschutz-Kompendium 2023 (bsi.bund.de, Abruf 2026-04-18)
- ISO/IEC 27001:2022 — Information Security Management
- DSB Österreich Muster-TOM (dsb.gv.at, Abruf 2026-04-18)
- ENISA — Guidelines for SMEs on the security of personal data processing, Abruf 2026-04-18
