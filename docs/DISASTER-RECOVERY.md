# CareAI — Disaster-Recovery Runbook

## Szenarien

### S1: Datenbank-Korruption (lokale Instanz)
1. **Detect** (Monitoring-Alarm oder Nutzer-Meldung).
2. **Contain:** Service in Read-Only umschalten (`?maintenance=true`).
3. **Assess:** Letzter gültiger Backup-Zeitpunkt ermitteln (`/admin/backup`).
4. **Restore:** File-Upload → Strategie `overwrite` → Confirm.
5. **Verify:** Row-Counts, kritische Bewohner-Berichte der letzten 24&nbsp;h prüfen.
6. **Communicate:** Tenant-Admin + PDL per E-Mail informieren.
7. **Post-Mortem:** Ursache in `/docs/INCIDENTS/` dokumentieren.

### S2: Totalausfall Rechenzentrum
1. Failover auf Cold-Standby (Hetzner Fallback-Region).
2. Letztes Offsite-Full-Backup einspielen.
3. DNS-Swap (TTL 60 s in Produktion).
4. RTO-Ziel: Service innerhalb **4&nbsp;h** wieder online.

### S3: Ransomware / Daten-Manipulation
1. Alle aktiven Sessions beenden, Service isolieren.
2. Forensik: Audit-Log prüfen, kompromittierte Accounts identifizieren.
3. Restore aus dem **letzten sauberen Backup** vor Kompromittierung (nicht dem jüngsten!).
4. Zwangs-Passwort-Reset für alle Users, 2FA-Re-Enrollment.
5. Incident-Report an Datenschutzbehörde innerhalb 72&nbsp;h (DSGVO Art.&nbsp;33).

### S4: Versehentliches Löschen durch Admin
1. Audit-Log prüfen (Aktion `delete`, Betroffener Datensatz).
2. Punkt-Restore: einzelne Tabelle aus letztem Full-Backup in Staging-Tenant importieren,
   betroffenen Datensatz extrahieren, manuell wiederherstellen.

## Kontakte (Muster)

| Rolle | Name | Kontakt |
|---|---|---|
| CTO | Konstantin Wagner | ki@careai.at |
| Ops-Lead | — | ops@careai.at |
| DPO | — | dpo@careai.at |
| On-Call | — | +43 1 123 45678 |

## Test-Protokoll

Pro DR-Test werden folgende Werte erfasst:

- Datum, Operator.
- Szenario (S1–S4).
- Gemessener RPO (Minuten bis zum letzten konsistenten Snapshot).
- Gemessener RTO (Minuten bis Service wiederhergestellt).
- Bestanden / Nicht bestanden + Notizen.
- Action-Items für nächsten Test.

Historie ist in `/admin/backup` Tab „Disaster-Recovery“ einsehbar.

## Compliance-Bezug

- **DSGVO Art.&nbsp;32:** Geeignete technische und organisatorische Maßnahmen — erfüllt durch Verschlüsselung, regelmäßige Tests, dokumentierte Runbooks.
- **§ 113 SGB&nbsp;XI:** Qualitätsindikatoren erfordern nachweisbare Verfügbarkeit der Dokumentation — erfüllt durch RTO-Ziel 4&nbsp;h.
- **ISO 27001 A.17:** Business Continuity — erfüllt durch dokumentierten Plan, Tests und Protokolle.
