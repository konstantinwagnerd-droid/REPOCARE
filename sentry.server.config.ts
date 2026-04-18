/**
 * Sentry Server Config — Node runtime.
 *
 * PHI-Scrubbing: beforeSend entfernt Request-Bodies von sensitiven Routes.
 */
import * as Sentry from "@sentry/nextjs";
import { scrubEvent } from "@/lib/observability/scrub";

const dsn = process.env.SENTRY_DSN;

if (dsn) {
  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV,
    release: process.env.APP_VERSION,
    tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? 0.1),
    beforeSend(event) {
      return scrubEvent(event);
    },
    // Do not send breadcrumbs with raw bodies
    maxBreadcrumbs: 20,
  });
}
