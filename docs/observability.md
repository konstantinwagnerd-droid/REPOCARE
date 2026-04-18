# Observability — Sentry Integration

CareAI verwendet **Sentry** für Error-Tracking und Performance-Monitoring. Weil wir Pflegedaten (PHI — GDPR Art. 9 "Gesundheitsdaten") verarbeiten, gelten verschärfte Datenschutz-Regeln.

## Setup

### 1. Pakete (bereits installiert)

```bash
npm install --save @sentry/nextjs --legacy-peer-deps
```

### 2. Env Vars (siehe `.env.example`)

| Variable | Zweck | Default |
|---|---|---|
| `SENTRY_DSN` | Server-DSN | leer = no-op |
| `NEXT_PUBLIC_SENTRY_DSN` | Client-DSN | leer = no-op |
| `SENTRY_AUTH_TOKEN` | Source-Map Upload (CI) | leer = kein Upload |
| `SENTRY_ORG`, `SENTRY_PROJECT` | Zielprojekt für Source-Maps | — |
| `SENTRY_TRACES_SAMPLE_RATE` | Server-Tracing (Anteil) | `0.1` |
| `NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE` | Client-Tracing | `0.1` |
| `APP_VERSION` / `NEXT_PUBLIC_APP_VERSION` | Release-Tag | `0.1.0` |

**Lokale Entwicklung:** DSN leer lassen → Sentry ist no-op, Fehler landen nur in `console.error` (strukturierte JSON-Logs).

### 3. Release-Tracking

Setze bei jedem Deploy `APP_VERSION` (z. B. aus Git-SHA oder `package.json`-Version). Dieser Tag erlaubt Sentry, Fehler einer bestimmten Release zuzuordnen.

```bash
APP_VERSION=$(git rev-parse --short HEAD) npm run build
```

## Architektur

```
sentry.client.config.ts  ← Browser (DSGVO: keine Replays)
sentry.server.config.ts  ← Node Runtime (API Routes)
sentry.edge.config.ts    ← Edge Runtime (Middleware)
next.config.ts           ← withSentryConfig Wrapper (hideSourceMaps, silent, disableLogger)
src/lib/observability/
  capture.ts             ← captureException/captureWarning Wrapper (nutzen statt Sentry direkt)
  scrub.ts               ← beforeSend PHI-Scrubbing
src/app/error.tsx        ← Segment-Error Boundary
src/app/global-error.tsx ← Root-Layout Error Boundary
```

## PHI-Scrubbing Policy

**Problem:** Sentry sammelt standardmäßig Request-Bodies, Breadcrumbs (Fetch/XHR), URL-Query-Strings. Das wäre ein **Datenschutzverstoß**, weil Pflege-Freitext (SIS, Berichte, Transkripte) Bewohner-identifizierende Informationen enthält.

**Lösung:** `beforeSend(event)` Hook in allen drei Sentry-Configs ruft `scrubEvent()` auf:

1. **Cookies + Auth-Header** → immer redacted (alle Events)
2. **Request-Body** → redacted für Routes die Pflegedaten berühren
3. **Breadcrumbs** (fetch-Aufrufe) → Payload wird auf `{url, method, status}` reduziert

### Whitelist (sensitive Routes)

Folgende API-Pfade gelten als PHI und werden gescrubt (`src/lib/observability/scrub.ts` → `SENSITIVE_ROUTE_PATTERNS`):

- `/api/care-reports` — Pflegeberichte (Freitext)
- `/api/sis` — Strukturierte Informationssammlung
- `/api/voice/*` — Transkripte
- `/api/wunddoku` — Wunddokumentation
- `/api/medikation` — Medikamentenlisten
- `/api/pflegediagnosen`
- `/api/fallbesprechung`
- `/api/handover`
- `/api/vitalzeichen`
- `/api/biographie`
- `/api/residents` und `/api/bewohner`

**Was an Sentry geht:** Route, HTTP-Status, Duration, Stacktrace, Fehlermeldung.
**Was NICHT an Sentry geht:** Bewohner-Namen, Transkripte, Freitext-Inhalte.

### Zusätzlicher Schutz in `capture.ts`

Die `captureException(err, ctx)`-Funktion blockiert PHI-Feldnamen direkt im Context-Objekt: `body`, `transcript`, `name`, `vorname`, `nachname`, `content`, `text`, `freitext` werden automatisch redacted, bevor sie an Sentry gesendet werden. Strings > 500 Zeichen werden gekürzt.

### Session-Replays

**Deaktiviert per Design.** `replaysSessionSampleRate: 0` und `replaysOnErrorSampleRate: 0`. Session-Replays würden Formular-Eingaben (Pflege-Freitext) aufzeichnen — Verstoß gegen DSGVO.

## Verwendung im Code

```ts
import { captureException, captureWarning } from "@/lib/observability/capture";

try {
  await saveSis(data);
} catch (e) {
  // Kein "body" oder "freitext" in ctx — die Wrapper-Funktion würde es zwar
  // redacten, aber besser gar nicht mitgeben.
  captureException(e, { route: "/api/sis", residentIdHash: hashId(data.residentId) });
  throw e;
}

captureWarning("medikation.auto_dosage_adjusted", { residentIdHash, from: "mg", to: "ml" });
```

## Testing

1. **Kein DSN gesetzt** → `npm run dev` → `console.error` zeigt strukturierte Logs. Keine Sentry-Requests im Netzwerk.
2. **Mit DSN (Staging)** → Fehler triggert Event, PHI-Routes haben `data: "[phi-redacted]"`.
3. **Scrub-Unit-Test** (optional, TODO): `src/lib/observability/scrub.test.ts`.

## Bundle-Impact

`@sentry/nextjs` fügt ~60–80 KB (gzipped) zum Client-Bundle hinzu (Core + Tracing). Replay-Module sind explizit NICHT geladen (siehe Config — keine `Sentry.replayIntegration()`).
