# CareAI 1-Command-Installer (Windows PowerShell)
# Idempotent. Usage: .\install.ps1 [-Help] [-NonInteractive]

[CmdletBinding()]
param(
    [switch]$Help,
    [switch]$NonInteractive,
    [switch]$SkipDocker,
    [string]$ConfigFile,
    [switch]$Version
)

$ErrorActionPreference = "Stop"
$LogFile = if ($env:LOG_FILE) { $env:LOG_FILE } else { "$PSScriptRoot\careai-install.log" }

function Write-Log($msg) {
    $ts = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    $line = "[$ts] $msg"
    Write-Host $line
    Add-Content -Path $LogFile -Value $line
}

function Write-Err($msg) {
    Write-Host "[FEHLER] $msg" -ForegroundColor Red
    Write-Log "FEHLER: $msg"
    exit 1
}

if ($Help) {
    @"
CareAI Installer (Windows) - Richtet CareAI in unter 10 Minuten ein.

Usage:
  .\install.ps1 [OPTIONS]

Optionen:
  -Help              Hilfe anzeigen
  -NonInteractive    Keine Fragen stellen (ENV-Vars erforderlich)
  -SkipDocker        Docker-Schritt ueberspringen
  -ConfigFile FILE   Config-Datei laden
  -Version           Version anzeigen

ENV-Variablen:
  CAREAI_EINRICHTUNG, CAREAI_ADMIN_EMAIL, CAREAI_DOMAIN

Log-Datei: $LogFile
"@
    exit 0
}

if ($Version) { Write-Host "CareAI Installer 1.0.0"; exit 0 }

Write-Log "=== CareAI Installer (Windows) gestartet ==="

# Node check
try { $nodeVer = node -v } catch { Write-Err "Node.js nicht gefunden. https://nodejs.org" }
$major = [int]($nodeVer -replace 'v','' -split '\.')[0]
if ($major -lt 20) { Write-Err "Node $nodeVer ist zu alt. Node >= 20 erforderlich." }
Write-Log "Node.js OK: $nodeVer"

# npm check
try { $npmVer = npm -v } catch { Write-Err "npm nicht gefunden." }
Write-Log "npm OK: $npmVer"

# Docker check
if (-not $SkipDocker) {
    try { docker --version | Out-Null } catch { Write-Err "Docker nicht gefunden. https://docs.docker.com/desktop/install/windows-install/" }
    try { docker info | Out-Null } catch { Write-Err "Docker laeuft nicht. Docker Desktop starten." }
    Write-Log "Docker OK"
}

# Config
if ($ConfigFile -and (Test-Path $ConfigFile)) {
    Write-Log "Lade Config: $ConfigFile"
    Get-Content $ConfigFile | ForEach-Object {
        if ($_ -match '^\s*([^#][^=]+)=(.*)$') {
            Set-Variable -Name $Matches[1].Trim() -Value $Matches[2].Trim() -Scope Script
        }
    }
}

function Ask($prompt, $varName, $default) {
    $current = Get-Variable -Name $varName -Scope Script -ErrorAction SilentlyContinue
    if ($current -and $current.Value) { return }
    if ($NonInteractive) {
        if (-not $default) { Write-Err "$varName fehlt (NonInteractive)" }
        Set-Variable -Name $varName -Value $default -Scope Script
        return
    }
    $answer = Read-Host "$prompt [$default]"
    if (-not $answer) { $answer = $default }
    Set-Variable -Name $varName -Value $answer -Scope Script
}

$CAREAI_EINRICHTUNG = $env:CAREAI_EINRICHTUNG
$CAREAI_ADMIN_EMAIL = $env:CAREAI_ADMIN_EMAIL
$CAREAI_DOMAIN = $env:CAREAI_DOMAIN

Write-Host "`n=== CareAI Konfiguration ===" -ForegroundColor Cyan
Ask "Name der Einrichtung" "CAREAI_EINRICHTUNG" "Pflegeheim Muster"
Ask "Admin-Email" "CAREAI_ADMIN_EMAIL" "admin@localhost"
Ask "Domain" "CAREAI_DOMAIN" "localhost:3000"

# Secret gen via .NET RNG
function New-Secret($bytes) {
    $b = New-Object byte[] $bytes
    [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($b)
    [Convert]::ToBase64String($b)
}

Write-Log "Generiere Secrets..."
$authSecret = New-Secret 48
$csrfSecret = New-Secret 32
$dbPassword = (New-Secret 24) -replace '[=+/]','' | ForEach-Object { $_.Substring(0, [Math]::Min(24, $_.Length)) }
$adminPw = (New-Secret 18) -replace '[=+/]','' | ForEach-Object { $_.Substring(0, [Math]::Min(16, $_.Length)) }

# .env (idempotent)
$envFile = ".env"
if (Test-Path $envFile) {
    Copy-Item $envFile "$envFile.bak" -Force
    $existing = Get-Content $envFile | Where-Object { $_ -match '^AUTH_SECRET=' }
    if ($existing) {
        $authSecret = ($existing -split '=',2)[1]
        Write-Log "Bestehendes AUTH_SECRET beibehalten"
    }
}

@"
# CareAI Environment - generiert $(Get-Date)
NODE_ENV=production
CAREAI_EINRICHTUNG="$CAREAI_EINRICHTUNG"
CAREAI_DOMAIN="$CAREAI_DOMAIN"
AUTH_SECRET=$authSecret
CSRF_SECRET=$csrfSecret
NEXTAUTH_URL=https://$CAREAI_DOMAIN
DATABASE_URL=postgresql://careai:$dbPassword@localhost:5432/careai
POSTGRES_PASSWORD=$dbPassword
POSTGRES_USER=careai
POSTGRES_DB=careai
ADMIN_EMAIL=$CAREAI_ADMIN_EMAIL
ADMIN_INITIAL_PASSWORD=$adminPw
ENABLE_VOICE=false
ENABLE_AI=false
"@ | Set-Content -Path $envFile -Encoding UTF8

Write-Log ".env geschrieben"

if (-not $SkipDocker) {
    Write-Log "Starte Docker-Stack..."
    docker compose up -d 2>&1 | Tee-Object -Append -FilePath $LogFile

    Write-Log "Warte auf Postgres..."
    for ($i=0; $i -lt 30; $i++) {
        $ready = docker compose exec -T postgres pg_isready -U careai 2>$null
        if ($LASTEXITCODE -eq 0) { Write-Log "Postgres bereit"; break }
        Start-Sleep -Seconds 2
    }
}

Write-Log "npm install..."
try { npm ci --silent } catch { npm install --silent }

Write-Log "DB-Migration..."
try { npm run db:push } catch { Write-Log "WARN db:push fehlgeschlagen" }
try { npm run db:seed } catch { Write-Log "WARN db:seed nicht vorhanden" }

Write-Host @"

==========================================================
  CareAI Installation abgeschlossen!
==========================================================

  Login-URL:       https://$CAREAI_DOMAIN
  Admin-Email:     $CAREAI_ADMIN_EMAIL
  Admin-Passwort:  $adminPw

  WICHTIG: Passwort bei Erst-Login aendern!
  Log-Datei:       $LogFile

==========================================================

"@ -ForegroundColor Green

Write-Log "=== Installation erfolgreich ==="
