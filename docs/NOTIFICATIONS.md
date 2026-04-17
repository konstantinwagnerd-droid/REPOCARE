# Notification-Center

Event-getriebene In-App-, Push-, E-Mail-Benachrichtigungen. Implementiert unter `src/lib/notifications/`.

## Events (15)

| Event | Kind | Default Empfänger |
|---|---|---|
| `incident.reported` | critical | pdl, hausarzt |
| `medication.administered` | info | responsible-nurse |
| `wound.worsened` | warning | pdl |
| `vital.out-of-range` | warning | shift-lead |
| `care-plan.updated` | info | team |
| `report.signed` | info | audit |
| `handover.completed` | info | next-shift |
| `family-message.received` | info | bezugspflege |
| `export.ready` | success | requester |
| `backup.failed` | critical | admin |
| `audit.anomaly` | critical | admin |
| `quality.benchmark-hit` | success | pdl |
| `shift.understaffed` | warning | pdl |
| `schedule.published` | info | affected-staff |
| `training.due` | warning | affected-staff |

## Template-Variablen
Platzhalter `{var}` werden zur Laufzeit ersetzt. Beispiele je Template siehe `src/lib/notifications/templates.ts`.

## Channel-Strategie
1. `in-app` — immer, persistiert im Inbox-Store (letzte 500 Einträge pro User).
2. `push` — Web-Push, Opt-In via `SubscriptionManager`. Während Nachtruhe nur `critical`.
3. `email` — transactional (Stub in Demo).
4. `sms-stub` — Twilio-kompatible Schnittstelle, nicht aktiv in Demo.

## Nachtruhe
Default 22:00 – 06:00 lokal. Betrifft Push für alle Nicht-Critical-Events. In-App-Einträge werden weiter erstellt.

## Web-Push in Produktion
1. `npx web-push generate-vapid-keys` → `NEXT_PUBLIC_VAPID_PUBLIC_KEY`, `VAPID_PRIVATE_KEY` setzen.
2. ServiceWorker `public/sw.js` registrieren (reagiert auf `push`-Event).
3. `web-push`-Paket auf dem Server nutzen, um tatsächlich zu senden.
4. Payload immer minimal halten (Titel + Deep-Link), keine Patientendaten.

## API-Endpunkte
- `POST /api/notifications/create` (Admin/PDL): neue Notification erzeugen.
- `GET /api/notifications/inbox?filter=all|unread|critical`: Inbox des aktuellen Users.
- `POST /api/notifications/mark-read`: `{ ids }` oder `{ all: true }`.
- `GET/POST /api/notifications/preferences/save`: Preferences lesen/schreiben.
- `POST /api/notifications/push/subscribe|unsubscribe`: Push-Abo verwalten.
- `POST /api/notifications/test` (Admin/PDL): Testversand.

## Pages
- `/app/notifications` — Inbox, Filter, Einstellungen, Browser-Push-Verwaltung.
- `/admin/notifications` — Templates, Regeln, Test-Versand, Delivery-Statistik.
