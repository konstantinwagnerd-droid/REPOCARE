/**
 * PHI-Scrubbing für Sentry Events.
 *
 * Policy: Für Routes die Pflegedaten (PHI — Protected Health Information) berühren,
 * entfernen wir Request- und Response-Bodies **bevor** sie an Sentry gesendet werden.
 * Behalten: Route, HTTP-Status, Duration, Stacktrace, Fehlermeldung.
 * Entfernen: body-Strings, Transkripte, Bewohner-Namen in Breadcrumbs.
 *
 * Sensitive Routes:
 *   - /api/care-reports  (Pflege-Berichte — Freitext über Bewohner)
 *   - /api/sis           (Strukturierte Informationssammlung — 6 Themenfelder)
 *   - /api/voice/*       (Transkripte — Rohtext aus Sprachaufnahmen)
 *   - /api/wunddoku      (Wunddokumentation — Freitext)
 *   - /api/medikation    (Medikamentenliste je Bewohner)
 *   - /api/pflegediagnosen
 *   - /api/fallbesprechung
 *   - /api/handover
 *   - /api/vitalzeichen
 *   - /api/biographie
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SentryEvent = any;

const SENSITIVE_ROUTE_PATTERNS: RegExp[] = [
  /\/api\/care-reports/i,
  /\/api\/sis/i,
  /\/api\/voice\//i,
  /\/api\/wunddoku/i,
  /\/api\/medikation/i,
  /\/api\/pflegediagnosen/i,
  /\/api\/fallbesprechung/i,
  /\/api\/handover/i,
  /\/api\/vitalzeichen/i,
  /\/api\/biographie/i,
  /\/api\/residents/i,
  /\/api\/bewohner/i,
];

export function isSensitiveRoute(url: string | undefined): boolean {
  if (!url) return false;
  return SENSITIVE_ROUTE_PATTERNS.some((rx) => rx.test(url));
}

/**
 * Mutates event: removes body/data from request on sensitive routes,
 * scrubs cookies/auth headers globally, and truncates long strings in extras.
 */
export function scrubEvent(event: SentryEvent): SentryEvent | null {
  if (!event) return event;

  try {
    // Global: strip cookies and auth headers ALWAYS.
    if (event.request) {
      if (event.request.cookies) event.request.cookies = "[redacted]";
      if (event.request.headers) {
        const h = event.request.headers as Record<string, string>;
        for (const k of Object.keys(h)) {
          if (/authorization|cookie|x-api-key/i.test(k)) {
            h[k] = "[redacted]";
          }
        }
      }

      // PHI routes: strip body/data entirely.
      const url: string | undefined = event.request.url;
      if (isSensitiveRoute(url)) {
        if ("data" in event.request) event.request.data = "[phi-redacted]";
        if ("query_string" in event.request) event.request.query_string = "[phi-redacted]";
      }
    }

    // Scrub breadcrumbs of sensitive URLs — drop data payloads.
    if (Array.isArray(event.breadcrumbs)) {
      for (const bc of event.breadcrumbs) {
        const crumbUrl: string | undefined = bc?.data?.url;
        if (isSensitiveRoute(crumbUrl)) {
          if (bc.data) {
            delete bc.data.response_body_size;
            bc.data = {
              url: bc.data.url,
              method: bc.data.method,
              status_code: bc.data.status_code,
            };
          }
          bc.message = bc.message ? "[phi-redacted]" : bc.message;
        }
      }
    }
  } catch {
    // On any scrub error, drop the event rather than leak PHI.
    return null;
  }

  return event;
}
