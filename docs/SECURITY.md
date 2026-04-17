# Security & Compliance — CareAI

## DSGVO (Art. 5, 25, 32)

| Prinzip | Umsetzung |
|---|---|
| Rechtmäßigkeit | Auftragsverarbeitungsvertrag nach Art. 28 DSGVO |
| Zweckbindung | Strikt auf Pflegedokumentation begrenzt |
| Datenminimierung | Nur Pflichtfelder laut MDK-Qualitätsprüfung |
| Richtigkeit | Berichtigungsrecht Art. 16, Audit-Trail |
| Speicherbegrenzung | Aufbewahrung gem. §630f BGB, dann automatisierte Anonymisierung |
| Integrität | AES-256 at rest, TLS 1.3 in transit |
| Rechenschaft | Vollständiges Audit-Log, revisionsfest |

## EU AI Act

CareAI ist ein **Hochrisiko-KI-System** nach Anhang III Nr. 5 (Zugang zu wesentlichen öffentlichen Diensten, Gesundheit).

- Art. 9: Risikomanagement-System dokumentiert
- Art. 10: Daten-Governance (Trainingsdaten nur mit Einwilligung, validiert)
- Art. 12: Logging sämtlicher Inferenzen (wer, was, wann, Modell-Version)
- Art. 13: Transparenz — jede KI-Aussage als Vorschlag markiert, nie autoritativ
- Art. 14: Menschliche Aufsicht — Pflegekraft bestätigt jeden KI-Output
- Art. 15: Genauigkeit/Robustheit — Validierungs-Metriken im Monitoring

## Audit-Log (§630f BGB, ÖGSG §5)

- Unveränderliche Einträge (INSERT only)
- Enthält: user_id, entity, action, before/after JSON, IP, UA, timestamp
- 10 Jahre Aufbewahrung minimum, anschließend Auskunftsverweigerung

## Verschlüsselung

- **At rest:** Postgres TDE (Hetzner Disk Encryption) + Column-Level für Klartext-Pflegeinhalt (geplant: pgcrypto)
- **In transit:** TLS 1.3 erzwungen, HSTS 1 Jahr
- **Secrets:** AUTH_SECRET, DATABASE_URL ausschließlich in Environment (nie im Code)

## Authentifizierung

- Passwort-Hash: bcrypt cost 10
- JWT Session (stateless), Expiry 24h
- Rate-Limit an Login-Endpoint (Middleware-Hook, TODO prod)
- 2FA via TOTP (Enterprise-Option, TODO)

## Hosting

- Hetzner Falkenstein, ISO 27001
- Backup: täglich verschlüsselt, 30 Tage Retention
- Disaster Recovery: zweiter Standort (Nürnberg), RTO 4h / RPO 1h

## Incident Response

- Datenschutzvorfall: Meldung an DSB innerhalb 72h (Art. 33)
- Kontakt: `datenschutz@careai.eu`

## Application Security (Production Hardening)

### HTTP Security Headers
Gesetzt in `src/middleware.ts` über `src/lib/security/headers.ts`:
- `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy` (Kamera/Mikro: nur `self`, alles andere deaktiviert)
- `Cross-Origin-Opener-Policy: same-origin`
- `Cross-Origin-Resource-Policy: same-origin`

### Content-Security-Policy
Nonce-basiert mit `strict-dynamic` — siehe `src/lib/security/csp.ts`.
Jeder Request erhält einen frischen Nonce in `x-csp-nonce` Header,
verwendet in `<Script nonce={...}>`-Tags.

### Rate Limits
Sliding-Window, in-memory (Redis-ready). Konfiguriert in
`src/lib/security/rate-limit.ts`:
- `/api/auth/*`: 10 req/min pro IP
- `/api/voice/*`: 30 req/min pro IP
- `/api/exports/*`: 5 req/min pro IP
- Öffentliche Formulare: 3 req / 5 min

### Account Lockout
`src/lib/security/audit-security.ts`: Nach **5 fehlgeschlagenen Logins**
wird der Account für **15 Minuten** gesperrt. Erfolgreicher Login resettet
den Zähler.

### Passwort-Policy
- Mindestens 10 Zeichen
- Groß- + Kleinbuchstaben + Ziffer + Sonderzeichen
- Gesperrt: Top-Liste geläufiger Passwörter
- bcrypt mit 12 Runden (`src/lib/security/password.ts`)

### CSRF-Schutz
HMAC-basierte Tokens, gebunden an Session-ID und Zeitstempel
(`src/lib/security/session.ts`). Alle state-changing Requests
benötigen einen gültigen `x-csrf-token` Header.

### Honeypot
Öffentliche Formulare (Kontakt, Demo-Anfrage) haben ein verstecktes
`website`-Feld (`src/lib/security/honeypot.ts`). Ist es gefüllt, wird
der Request still verworfen (200 OK ohne Verarbeitung).

### Request Tracing
Jeder Request bekommt in `src/middleware.ts` eine UUIDv4 `x-request-id`
mitgegeben — im Fehler-UI (`src/app/error.tsx`) als Fehler-ID anzeigbar.
