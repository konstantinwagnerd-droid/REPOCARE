# CareAI Installer - Handbuch

**Zeit bis zum Login: < 10 Minuten.**

## Voraussetzungen

| Komponente | Mindestversion | Hinweis |
|---|---|---|
| Betriebssystem | Linux (Ubuntu 22+, Debian 12+), macOS 13+, Windows 11 | Alle anderen nicht getestet |
| Node.js | 20.x | https://nodejs.org/en/download |
| Docker | 24+ mit Compose v2 | Production-Install |
| OpenSSL | beliebig | Meist vorinstalliert |
| Freier RAM | 4 GB | 8 GB empfohlen |
| Freier Speicher | 10 GB | fuer DB + Docker-Images |

## Schnellstart - Production

### Linux / macOS

```bash
curl -fsSL https://careai.health/install.sh | bash
# ODER lokal:
cd CareAI-App
bash scripts/install/install.sh
```

### Windows

```powershell
# PowerShell als Administrator
cd C:\pfad\zu\CareAI-App
.\scripts\install\install.ps1
```

Der Installer fragt interaktiv:
- Name der Einrichtung (z.B. "Pflegeheim Sonnenhof")
- Admin-Email (fuer Erst-Login)
- Domain (z.B. `pflege.sonnenhof.de` oder `localhost:3000` fuer Test)

Danach laeuft automatisch:
1. OS- und Tool-Check
2. Secret-Generierung (AUTH_SECRET, CSRF_SECRET, DB-Passwort via `openssl rand`)
3. `.env` Schreibung (chmod 600)
4. `docker compose up -d` (Postgres + App)
5. DB-Migration (`npm run db:push`)
6. Seed (`npm run db:seed`)
7. Health-Check

Am Ende wird **Admin-URL + Passwort** angezeigt.

**[Screenshot-Platzhalter: Installer-Abschluss mit Credentials-Anzeige]**

## Dev-Install (ohne Docker)

```bash
bash scripts/install/install-dev.sh
npm run dev
```

Nutzt PGLite statt Postgres - keine Docker-Abhaengigkeit.

## Non-Interactive / CI

```bash
export CAREAI_EINRICHTUNG="Testheim"
export CAREAI_ADMIN_EMAIL="admin@test.local"
export CAREAI_DOMAIN="localhost:3000"
bash scripts/install/install.sh --non-interactive
```

Oder per Config-Datei:
```bash
bash scripts/install/install.sh --config myconfig.env
```

## Troubleshooting

### "Port 3000 belegt"
```bash
lsof -i :3000               # Linux/macOS - finde Prozess
netstat -ano | findstr 3000  # Windows
# Entweder Prozess killen oder PORT in .env aendern
```

### "Permission denied" beim Log
Der Installer schreibt nach `/var/log/careai-install.log`. Falls ohne Root-Rechte:
```bash
LOG_FILE=./install.log bash scripts/install/install.sh
```

### "Docker daemon not running"
- **Linux:** `sudo systemctl start docker`
- **macOS:** Docker Desktop starten
- **Windows:** Docker Desktop starten, WSL2 aktivieren

### "Node.js zu alt"
Siehe https://nodejs.org oder nutze `nvm install 20`.

### "Migration schlug fehl"
```bash
docker compose logs postgres   # Pruefe Postgres-Logs
npm run db:push -- --verbose   # Details der Migration
```

### ".env existiert bereits"
Der Installer ist idempotent: bestehendes `AUTH_SECRET` wird beibehalten (sonst werden alle User ausgeloggt). Ein `.env.bak` wird angelegt.

## Uninstall

```bash
# Docker-Stack stoppen + Volumes loeschen (!! DB-Daten weg !!)
docker compose down -v

# .env und node_modules entfernen
rm -rf .env node_modules local.db

# Log-Datei
rm -f /var/log/careai-install.log
```

**Warnung:** `docker compose down -v` loescht auch persistierte Bewohner-Daten. Vorher Backup!

## CLI-Referenz

```
install.sh --help              Hilfe
install.sh --version           Version
install.sh --non-interactive   Keine Fragen (ENV noetig)
install.sh --skip-docker       Nur Node-Teil
install.sh --config FILE       Config-Datei laden
```

## Sicherheit

- `.env` wird mit `chmod 600` angelegt - nur User-Lesbar
- Alle Secrets via `openssl rand -base64` (48 byte Entropie fuer AUTH)
- Admin-Initial-Passwort nur EINMAL beim Install gezeigt - danach `$ADMIN_INITIAL_PASSWORD` aus `.env` loeschen
- Log-Datei enthaelt KEINE Secrets (nur Referenzen)
