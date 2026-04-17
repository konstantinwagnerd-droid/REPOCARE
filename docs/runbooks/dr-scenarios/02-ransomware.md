# Szenario 2 — Ransomware-Angriff

**RTO:** 24h  | **RPO:** 4h.
**Tabletop-Dauer:** 3h.

## Trigger-Signal
- Datei-Integritäts-Monitoring (`osquery` / `wazuh`) meldet massenhafte Dateiänderungen mit neuen Extensions (`.locked`, `.encrypted`).
- Ransom-Note in `README_DECRYPT.txt` auf Volumes.
- Abfallende Disk-I/O-Performance + CPU-Spike auf Backup-Servern.
- Kunden melden verschlüsselte Dokumente im Export-Download.

## Rollen (Tabletop)
- **IC** (CTO oder Stellvertretung)
- **Tech-Lead** (SRE + SecOps)
- **Comms-Lead**
- **Legal/DPO** (MUSS dabei sein — Meldepflicht-Prüfung)
- **Law-Enforcement-Liaison** (Pre-Contact mit BKA Cyber-Dezernat aufbauen)
- **Externe Incident-Response-Firma** (Retainer vorhanden)

## Erste-Reaktions-Schritte

| Zeit | Aktion | Verantwortlich |
|------|--------|----------------|
| T+0  | Alert → PagerDuty Sev1, alle Services in Read-Only-Mode | On-Call-SRE |
| T+5  | **NICHT** Systeme einfach neu starten (Forensik-Beweise) | Tech-Lead |
| T+10 | Netzwerk-Segmentierung: befallene Subnetze isolieren | Tech-Lead |
| T+15 | Externes IR-Team anrufen (SLA: 1h on-site Remote) | IC |
| T+30 | Legal/DPO aktiviert: 72h-Uhr startet (Art. 33 DSGVO) | DPO |
| T+45 | Backups offline-isoliert verifizieren (Air-Gap-Check) | Tech-Lead |
| T+60 | Leadership + Investoren-Briefing | IC |

## Technische Recovery-Schritte

1. **Containment:** Alle Netzwerk-Flows zu infizierten Hosts stoppen. SSH-Keys rotieren.
2. **Forensik-Snapshot:** Vollimage der verschlüsselten Volumes für Ermittlungen.
3. **Backup-Integrität:** Letztes Backup vor Infektionszeitpunkt identifizieren (WAL-Log-Analyse).
4. **Clean Rebuild:** Neue Infrastruktur aus Terraform-IaC (nicht aus alten Images).
5. **Restore:** Datenbank aus verifiziertem Backup, Files aus S3-Object-Lock-Bucket.
6. **Creds-Rotation:** ALLE Credentials: DB-Passwörter, API-Keys, JWT-Secrets, OAuth-Tokens.
7. **Validation:** Clean-Room-Test eines Test-Kunden bevor Production-Cutover.
8. **Cutover:** DNS auf neue Infrastruktur umstellen, alte endgültig zerstören.

## Kommunikations-Plan

- **KEINE Lösegeldzahlung** — Policy-Entscheidung.
- **Intern (sofort):** Leadership, Board, Rechtsabteilung.
- **Kund:innen (binnen 24h):** Klarer Brief: was passiert, was tun wir, welche Daten sind potenziell betroffen.
- **Aufsichtsbehörde (binnen 72h):** Datenschutzbehörde (Österreich: DSB) nach Art. 33 DSGVO.
- **Betroffene (binnen 72h):** Falls hohes Risiko für Betroffene → individuelle Info nach Art. 34.
- **Medien:** Nur über Comms-Lead, vorab abgestimmt mit Legal.
- **Behörden:** BKA-Cybercrime-Kompetenzzentrum (C4), ggf. CERT.at.

## Tabletop-Injects

| Zeit | Inject | Erwartete Reaktion |
|------|--------|-------------------|
| T+0   | "Wazuh: 50.000 Dateiänderungen in 3 Min" | Isolation, IR-Call |
| T+30  | "Erpresser fordert 2M€ Bitcoin, Frist 48h" | Policy: Nein. PR-Line vorbereiten. |
| T+60  | "Journalist ruft an, fragt nach Gerüchten" | Hold-Statement, kein Confirm ohne Fakten |
| T+120 | "Kunde droht mit Kündigung und DSGVO-Klage" | Empathische Begleitung, Legal briefen |
| T+180 | "Backup von letzter Nacht ist auch verschlüsselt" | Air-Gap-Tier (wöchentlich offline) prüfen |

## Abschluss-Debrief

- War Air-Gap-Backup wirklich isoliert?
- Wie lang war der Attacker unentdeckt in Systemen?
- Was hätte MFA / Least-Privilege verhindert?
