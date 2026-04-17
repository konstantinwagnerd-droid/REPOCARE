# Monitoring & Observability

CareAI liefert einen optionalen Observability-Stack (Grafana + Prometheus + Loki)
als Docker-Compose-Addon. Der Stack ist **opt-in** — die Basis-Plattform laeuft
auch ohne ihn.

## Komponenten

| Dienst | Zweck |
|--------|-------|
| **Prometheus** | Metriken (Scrape-Intervall 15 s, Retention 30 d) |
| **Loki** | Zentrale Log-Aggregation (Retention 30 d) |
| **Grafana** | 6 vorprovisionierte Dashboards, Alerting-UI |
| **Promtail** | Docker-Log-Shipper |
| **Node-Exporter** | Host-Metriken (CPU/RAM/Disk) |
| **cAdvisor** | Container-Metriken |
| **Postgres-Exporter** | DB-Metriken |

## Start

```bash
# .env ergaenzen:
# GRAFANA_ADMIN_PASSWORD=<strong>
# POSTGRES_READONLY_PASSWORD=<strong>
# METRICS_BEARER_TOKEN=<random>
# DOMAIN=your-domain.de

docker compose \
  -f docker-compose.yml \
  -f docker/grafana/docker-compose.grafana.yml \
  up -d
```

Grafana ist danach erreichbar unter `https://grafana.<DOMAIN>` (Login:
`admin` / `${GRAFANA_ADMIN_PASSWORD}`).

## Dashboards (6)

Alle Dashboards liegen in `docker/grafana/dashboards/` und werden beim Start
automatisch provisioniert.

| Dashboard | UID | Inhalt |
|-----------|-----|--------|
| Overview | `careai-overview` | Service-Health, Req-Rate, Error-Rate, P95, Active-Users, DB-Pool |
| Pflege | `careai-pflege` | Berichte/h, Voice-Requests, Exporte, Bewohner, Handover, Anomalien |
| Admin | `careai-admin` | Audit-Events/min, Logins, Failed-Logins, Feature-Flags, Impersonation, Webhooks |
| LLM | `careai-llm` | Tokens, Cost (EUR/h), Latency P95, Error %, Budget-Verbrauch |
| Infrastructure | `careai-infra` | CPU/RAM/Disk/Net pro Container, Load-Avg |
| Compliance | `careai-compliance` | DSGVO-Queue, Backup-Rate, Cert-Expiry, Anomalien, Audit-Retention |

### Neue Dashboards hinzufuegen

1. Dashboard in Grafana erstellen (Admin-UI).
2. Export als JSON (Share → Export → Save to file).
3. JSON in `docker/grafana/dashboards/` ablegen.
4. `docker compose restart grafana` — fertig. Der File-Provisioner erkennt neue
   Dateien ohne Container-Neustart nach `updateIntervalSeconds: 30`.

## Alerts (15 Rules)

Definiert in `docker/prometheus/alerts.yml`, gruppiert nach Thema:

### Verfuegbarkeit
- `AppDown` — App-Instance > 2 min nicht erreichbar (**critical**)
- `PostgresDown` — DB down (**critical**)

### Performance
- `HighErrorRate` — 5xx > 1 % (5 min) (warning)
- `SlowResponses` — P95 > 2 s (10 min) (warning)
- `DBPoolExhausted` — Pool > 85 % (warning)

### Infrastruktur
- `HighDiskUsage` — Disk > 80 % (warning)
- `HighMemoryUsage` — RAM > 90 % (warning)
- `ContainerRestartLoop` — > 3 Restarts in 15 min (warning)

### Compliance
- `CertExpiringSoon` — TLS < 30 Tage (warning)
- `BackupFailed` — Backup-Fehler in 24 h (**critical**)
- `AuditLogStalled` — Audit-Log schreibt > 10 min nicht (**critical**)
- `DSGVOQueueGrowing` — > 10 offene Anfragen (warning)

### LLM
- `LLMBudgetExceeded` — > 90 % Monatsbudget (warning)
- `LLMHighErrorRate` — > 5 % Fehlerquote (warning)

## Alert-Routing

Alerts werden von Prometheus an einen Alertmanager geschickt (optionales Addon).
Empfohlene Routen:

| Severity | Kanal | Reaktion |
|----------|-------|----------|
| `critical` | Slack `#careai-incidents` + E-Mail `oncall@careai.at` + Telegram | Sofort, 24/7 |
| `warning` | Slack `#careai-alerts` + E-Mail `eng@careai.at` | Innerhalb 4 h (Werktag) |
| `info` | Slack `#careai-noise` | Best effort |

Beispiel-Route (alertmanager.yml):

```yaml
route:
  receiver: slack-alerts
  group_by: [alertname, severity]
  routes:
    - matchers: [severity="critical"]
      receiver: pagerduty
      continue: true
    - matchers: [severity="critical"]
      receiver: telegram
```

## Runbooks

Jeder Alert enthaelt in den Labels einen `runbook`-Link. Runbooks liegen in
[`docs/runbooks/`](runbooks/) und folgen dem Schema:

```
# Runbook — <alert-name>

## Symptom
## Impact (User / Business)
## Diagnose-Schritte
## Mitigation (sofort)
## Root-Cause-Analyse
## Follow-up-Actions
```

Siehe z. B. `docs/runbooks/app-down.md`, `docs/runbooks/backup-failed.md`,
`docs/runbooks/cert-renewal.md`.

## Applikations-Metriken

Die App exponiert ueber `GET /api/metrics` (Bearer-geschuetzt) Prometheus-Text:

- Standard HTTP-Histograms (`http_request_duration_seconds_bucket`, `_count`, `_sum`)
- Business-Metriken (`careai_care_reports_created_total`, `careai_voice_requests_total`, …)
- LLM-Metriken (`careai_llm_tokens_total{provider,direction}`, `careai_llm_cost_eur_total`, …)
- Compliance-Metriken (`careai_audit_events_total{action}`, `careai_backup_success_total`, …)

Siehe `src/lib/metrics.ts` fuer die komplette Liste.

## Logs

- App-Logs: strukturiertes JSON auf `stdout` (Pino). Werden von Promtail
  aufgefangen und nach Loki geshippt.
- Audit-Logs: **nicht** in Loki — separate Tabelle `audit_log` in Postgres
  (revisionssicher, WORM-aehnlich ueber Trigger).
- Zugriff in Grafana: **Explore → Loki → `{job="docker", container_name="careai-app"}`**

## Troubleshooting

| Problem | Check |
|---------|-------|
| Dashboard zeigt „No data“ | `curl http://prometheus:9090/api/v1/targets` — sind Jobs `up`? |
| Grafana startet nicht | Logs `docker logs careai-grafana`; Volume-Permissions? |
| Alerts feuern nicht | `/etc/prometheus/alerts.yml` in Container vorhanden? `promtool check rules` |
| Loki voll | `retention_period` in `docker/loki/config.yml` reduzieren |
