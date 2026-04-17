# API — CareAI

Die vollständige, interaktive API-Referenz steht unter
[/api-docs.html](/api-docs.html) (Swagger-UI) zur Verfügung. Die Spezifikation
liegt maschinenlesbar als [/openapi.yaml](/openapi.yaml) vor.

## Schnellübersicht

| Endpoint | Methode | Zweck |
|----------|---------|-------|
| `/api/health` | GET | Liveness (200 OK wenn Prozess läuft) |
| `/api/health/ready` | GET | Readiness — prüft DB-Verbindung |
| `/api/metrics` | GET | Prometheus-Metrics (Bearer-Token) |
| `/api/auth/signin` | POST | Login |
| `/api/auth/signout` | POST | Logout |
| `/api/demo-request` | POST | Öffentliche Demo-Anfrage |
| `/api/care-reports` | GET/POST | Pflegeberichte |
| `/api/voice/transcribe` | POST | Audio → Text |
| `/api/handover` | POST | Schichtbericht generieren |
| `/api/exports/resident/:id` | GET | Bewohner-Akte als PDF/ZIP |
| `/api/dsgvo/export` | POST | Art.-15-Auskunfts-Export |
| `/api/admin/flags/:key` | POST | Feature-Flag umschalten |
| `/api/admin/impersonate` | POST | User-Impersonation (Super-Admin) |

## Auth

Alle nicht-öffentlichen Endpoints erwarten ein gültiges
Session-Cookie (`next-auth.session-token`). Rollen-basierte Zugriffe
werden über `src/lib/rbac.ts` geprüft.

## Rate Limits

Siehe `docs/SECURITY.md` → Abschnitt **Rate Limits**.

## Fehler-Format

```json
{ "error": "Message", "requestId": "c7a...-..." }
```

Der `requestId` wird an den Client per `x-request-id` Header
zurückgegeben und taucht in allen Log-Einträgen auf — ideal für
Kunden-Support-Tickets.
