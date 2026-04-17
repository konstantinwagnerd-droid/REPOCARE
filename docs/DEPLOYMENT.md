# CareAI — Deployment-Guide (Hetzner + Docker + Traefik)

Production-Deployment auf Hetzner Cloud. Kostenschätzung: **~8 €/Monat** (CX22 + Storage Box + Object Storage).

## Infrastruktur-Überblick

| Komponente | Wo | Kosten (ca.) |
|---|---|---|
| CX22 VM (4 GB RAM, 2 vCPU, 40 GB SSD) | Hetzner Cloud (Nürnberg / Falkenstein / Helsinki) | 5 €/Monat |
| Storage Box 100 GB (Backup-Ziel) | Hetzner | 3 €/Monat |
| Object Storage (Wundfotos) | Hetzner | pay-per-use |
| Domains + SSL | DNS-Provider + Let's Encrypt | 0 € + Domain |

DSGVO: alle Daten bleiben in der EU. Hetzner ist als Auftragsverarbeiter DSGVO-konform.

---

## 1. Server aufsetzen (einmalig)

### 1.1 VM bei Hetzner erstellen

1. Hetzner Cloud Console → **"Add Server"**
2. Location: **Nürnberg** oder **Falkenstein** (beide EU)
3. Image: **Ubuntu 24.04**
4. Type: **CX22** (4 GB RAM, 2 vCPU)
5. Networking: IPv4 + IPv6
6. **User Data** (Cloud-Init): Inhalt von `scripts/deploy/cloud-init.yaml` einfügen,
   dabei `ssh-ed25519 AAAA_REPLACE_WITH_YOUR_PUBKEY` durch den eigenen Deploy-Key ersetzen.
7. SSH-Key für `root` hinzufügen (nur Notfall — normal wird `careai`-User genutzt).

Cloud-Init installiert: Docker, UFW, Fail2ban, legt User `careai` an, hardened SSH, konfiguriert Firewall (22/80/443).

### 1.2 DNS einrichten

| Record | Typ | Ziel |
|---|---|---|
| `app.careai.health` | A/AAAA | <VM-IP> |
| `status.careai.health` | A/AAAA | <VM-IP> |

### 1.3 Repo clonen

```bash
ssh careai@<vm-ip>
sudo mkdir -p /srv/careai && sudo chown careai: /srv/careai
cd /srv/careai
git clone https://github.com/<org>/careai-app.git .
cp .env.example .env
```

Jetzt `.env` editieren — kritische Werte:
- `POSTGRES_PASSWORD`, `REDIS_PASSWORD` → `openssl rand -base64 32`
- `AUTH_SECRET` → `openssl rand -base64 32`
- `STORAGE_ENCRYPTION_KEY` → `openssl rand -hex 32`
- `UNSUBSCRIBE_SECRET` → `openssl rand -hex 32`
- `ACME_EMAIL`, `APP_DOMAIN`

### 1.4 Erster Start

```bash
docker compose pull
docker compose up -d
docker compose logs -f
```

Traefik holt automatisch Let's-Encrypt-Zertifikate. Health-Check: `curl https://app.careai.health/api/health`.

---

## 2. CI/CD via GitHub Actions

Workflow: `.github/workflows/deploy.yml`. Bei jedem Push auf `main`:

1. **Test-Job:** Lint + TypeCheck + Unit-Tests.
2. **Build-Job:** Multi-Stage-Docker-Build → Push an `ghcr.io/<org>/<repo>:sha-XXXX` + `:latest`.
3. **Deploy-Job:** SSH auf VM → `scripts/deploy/deploy.sh` → Healthcheck.

### Secrets im GitHub-Repo setzen

| Secret | Inhalt |
|---|---|
| `DEPLOY_HOST` | VM-IP oder Hostname |
| `DEPLOY_USER` | `careai` |
| `DEPLOY_PORT` | `22` |
| `DEPLOY_SSH_KEY` | Private Key des Deploy-Users (ed25519) |
| `DEPLOY_DOMAIN` | `app.careai.health` |

GitHub Actions läuft in ~3-4 min von Push bis Smoke-Test.

---

## 3. Monitoring mit Uptime Kuma

Bereits in `docker-compose.yml` enthalten → läuft unter `https://status.careai.health`.

Empfohlene Checks:
- HTTP `https://app.careai.health/api/health` (60 s Intervall)
- Postgres-Container (Docker-Check)
- Disk-Usage (via Custom Script)
- Optional: Telegram/Discord-Notification bei Downtime.

---

## 4. Backups (verschlüsselt)

`scripts/deploy/backup.sh` macht `pg_dump` → `gzip` → GPG-verschlüsselt → Hetzner Storage Box.

### 4.1 GPG-Key auf VM

```bash
gpg --full-generate-key   # Typ: RSA, 4096, keine Ablauf
gpg --list-keys --keyid-format long
# Fingerprint in /etc/careai/backup.env als BACKUP_GPG_RECIPIENT
```

Private Key **sicher offline** sichern (sonst keine Restores möglich).

### 4.2 SSH-Key für Storage Box

```bash
ssh-keygen -t ed25519 -f ~/.ssh/storagebox -N ""
# Public Key im Hetzner Storage-Box-Webinterface hinterlegen
cat > /etc/careai/backup.env <<EOF
POSTGRES_CONTAINER=careai-postgres-1
POSTGRES_DB=careai
POSTGRES_USER=careai
BACKUP_GPG_RECIPIENT=<keyid>
SSH_USER=u123456
SSH_HOST=u123456.your-storagebox.de
SSH_PORT=23
SSH_KEY=/home/careai/.ssh/storagebox
ALERT_EMAIL=ops@careai.health
EOF
```

### 4.3 Cron

```bash
sudo crontab -e -u careai
# Täglich 03:00 UTC:
0 3 * * * set -a; source /etc/careai/backup.env; /srv/careai/scripts/deploy/backup.sh >> /var/log/careai-backup.log 2>&1
```

Retention: **7 daily, 4 weekly, 12 monthly** (Pruning im Script).

### 4.4 Restore testen

Monatlich: Dump auf Staging holen, entschlüsseln, `pg_restore`, Smoke-Test. Nie ungetestet lassen.

---

## 5. Sentry (optional)

```bash
npm install @sentry/node   # nur wenn SENTRY_DSN gesetzt
```

`SENTRY_DSN` in `.env` eintragen — `src/lib/monitoring/sentry.ts` lädt lazy.

Für Frontend-Errors zusätzlich `@sentry/nextjs` installieren (erfordert `sentry.client.config.ts`).

---

## 6. Skalierung (wenn's wehtut)

| Stufe | Änderung |
|---|---|
| 1–50 Pflegeheime | CX22 reicht |
| 50–200 | CX32 (8 GB RAM, 4 vCPU, 10 €/Monat) |
| 200+ | Postgres auf Managed-DB (Hetzner Cloud Postgres wenn verfügbar, sonst Railway/Neon EU), App auf 2× CX22 hinter Load-Balancer |
| Global | Separate EU-Instanzen pro Land (Datenresidenz) |

---

## 7. Disaster Recovery (SLA-Kandidat)

- **RPO (max. Datenverlust):** 24 h (letztes Backup)
- **RTO (max. Wiederherstellungs-Zeit):** 2 h (neue VM + Restore)

Runbook: `docs/RUNBOOK-DR.md` (TODO).

---

## 8. Checkliste vor Go-Live

- [ ] `.env` enthält echte Secrets (nicht Beispielwerte)
- [ ] `STORAGE_ENCRYPTION_KEY` in Passwort-Manager archiviert
- [ ] Backup-Cron läuft, erste Wiederherstellung erfolgreich getestet
- [ ] Uptime-Kuma alarmiert funktionierend
- [ ] DSGVO-AV-Vertrag mit Hetzner unterzeichnet
- [ ] GPG-Backup-Key offline gesichert
- [ ] Domain-TLS-Zertifikate gültig (Traefik → Let's-Encrypt)
- [ ] SSH-Zugang nur per Key, `PermitRootLogin no`
- [ ] Monitoring-Alerts an On-Call-Person getestet
