# Szenario 1 — Datenbank-Ausfall (PostgreSQL-Primary down)

**RTO:** 2h  | **RPO:** 15 Min (Continuous Archiving + WAL-Streaming).
**Tabletop-Dauer:** 90 Min.

## Trigger-Signal
- Alert aus Grafana: `pg_up == 0` über 2 Min ODER Replication-Lag > 60s.
- Fehlerflut in Sentry: `ECONNREFUSED` / `could not connect to server`.
- App-Healthcheck `/api/health/db` schlägt 3x in Folge fehl.

## Rollen (Tabletop)
- **Incident-Commander** (IC): koordiniert, entscheidet.
- **Tech-Lead**: führt Recovery aus.
- **Comms-Lead**: informiert Kund:innen, Statuspage.
- **Legal/DPO**: bewertet DSGVO-Relevanz (Availability ist ein Schutzziel).
- **Produkt-Lead**: priorisiert Features während Degradation.

## Erste-Reaktions-Schritte (0–15 Min)

| Zeit | Aktion | Verantwortlich |
|------|--------|----------------|
| T+0  | PagerDuty-Alert empfangen, ACK innerhalb 5 Min | On-Call-SRE |
| T+3  | War-Room-Kanal `#inc-YYYYMMDD-db` aufmachen | On-Call-SRE |
| T+5  | IC benennen, Severity setzen (Default Sev1) | On-Call-SRE |
| T+10 | Kund:innen-Kommunikation: Statuspage auf "Identified" | Comms-Lead |
| T+15 | Tech-Lead startet Failover-Prozedur | Tech-Lead |

## Technische Recovery-Schritte

1. **Replika-Status prüfen:** `SELECT pg_last_wal_replay_lsn();` auf Secondary.
2. **Promote Secondary:** `pg_ctl promote -D /var/lib/postgresql/data` oder Patroni `patronictl failover`.
3. **DNS/Service-Discovery umstellen:** Update `db-primary.careai.internal` → neuer Host.
4. **App-Reconnects verifizieren:** `kubectl rollout restart deploy/api` falls Connection-Pool hängt.
5. **Smoke-Test:** `curl /api/health/db` → 200 OK; Testlogin für 3 Testmandanten.
6. **Alte Primary isolieren:** Netzwerk-Regel setzen, damit kein Split-Brain.
7. **Backup-Integrität bestätigen:** `wal-g backup-list` zeigt konsistentes letztes Backup.

## Kommunikations-Plan

- **Intern (sofort):** Slack `#incident-war-room`, Telegram-Broadcast an Leadership.
- **Kund:innen (T+15):** Statuspage "Investigating", E-Mail an Primärkontakt pro Kunde ab Sev1.
- **Kund:innen (T+60):** Update "Identified / Monitoring".
- **Behörden:** Nur wenn Datenverlust > RPO ODER Verdacht auf Breach → siehe Szenario 3.
- **Nach Recovery:** Statuspage "Resolved" mit Kurzfassung; Post-Mortem binnen 5 Tagen veröffentlicht.

## Tabletop-Injects (15-Min-Takt)

| Zeit | Inject | Erwartete Reaktion |
|------|--------|-------------------|
| T+0  | "Grafana meldet pg_up=0" | ACK + War-Room |
| T+15 | "Kunde Pflegeheim Rosenhof ruft an, kann nicht dokumentieren" | Comms-Lead routet, Statuspage |
| T+30 | "Secondary hat 45s Replication-Lag → RPO-Risiko" | IC entscheidet: Failover mit akzeptiertem Datenverlust? |
| T+45 | "Promote läuft, aber App-Pods crashen mit Timeout" | Rollout restart, Connection-Pool-Config prüfen |
| T+60 | "MD-Prüfung bei Kunde in 2h — kann er drucken?" | Produkt-Lead: degradierter Modus / PDF-Export |
| T+75 | "Post-Mortem wer schreibt wann?" | IC benennt Autor:in |

## Abschluss-Debrief (15 Min)

- Was lief schneller als erwartet?
- Wo haben wir unnötig gezögert?
- Welche Tool-Lücken sind aufgefallen?
- Action-Items mit Owner + Due Date.
