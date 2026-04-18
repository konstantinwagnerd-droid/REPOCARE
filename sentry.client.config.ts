/**
 * Sentry Client Config — loaded in the browser.
 *
 * DSGVO: KEINE Session-Replays. Pflegedaten sind besonders schutzwürdig (GDPR Art. 9
 * "Gesundheitsdaten"). Deshalb replaysSessionSampleRate = 0 und replaysOnErrorSampleRate = 0.
 *
 * PHI-Scrubbing: siehe beforeSend — Request-Bodies von Care/SIS/Voice-Routes werden entfernt.
 */
import * as Sentry from "@sentry/nextjs";
import { scrubEvent } from "@/lib/observability/scrub";

const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV,
    release: process.env.NEXT_PUBLIC_APP_VERSION,
    tracesSampleRate: Number(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE ?? 0.1),
    // DSGVO — KEINE Session-Replays auf Pflegedaten.
    replaysSessionSampleRate: 0,
    replaysOnErrorSampleRate: 0,
    // PHI-Scrubbing für alle Events.
    beforeSend(event) {
      return scrubEvent(event);
    },
    // Reduziert Default-Breadcrumbs (keine URL-Query-Params, keine DOM-Text-Inhalte).
    maxBreadcrumbs: 20,
    // Ignoriere browser-noise.
    ignoreErrors: [
      "ResizeObserver loop limit exceeded",
      "Non-Error promise rejection captured",
      "Network request failed",
    ],
  });
}
