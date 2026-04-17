/**
 * Sentry integration — no-op unless SENTRY_DSN is set.
 * We deliberately avoid adding @sentry/nextjs as a hard dep; load it lazily.
 * Install instruction in docs/DEPLOYMENT.md.
 */
import { logger } from "./logger";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let sentry: any | null = null;
let initialized = false;

export async function initSentry(): Promise<void> {
  if (initialized) return;
  initialized = true;
  const dsn = process.env.SENTRY_DSN;
  if (!dsn) {
    logger.debug("sentry.disabled", {});
    return;
  }
  try {
    // @ts-expect-error — optional dep; install @sentry/node for server runtime.
    sentry = await import("@sentry/node");
    sentry.init({
      dsn,
      environment: process.env.NODE_ENV,
      tracesSampleRate: Number(process.env.SENTRY_TRACES_SAMPLE_RATE ?? 0.1),
      release: process.env.APP_VERSION,
    });
    logger.info("sentry.init", { dsn: dsn.slice(0, 30) + "…" });
  } catch (e) {
    logger.warn("sentry.init.failed", { msg: String(e) });
  }
}

export function captureException(err: unknown, ctx?: Record<string, unknown>): void {
  if (!sentry) {
    logger.error("exception", { err: String(err), ctx });
    return;
  }
  sentry.captureException(err, { extra: ctx });
}

export function captureMessage(msg: string, ctx?: Record<string, unknown>): void {
  if (!sentry) {
    logger.warn(msg, ctx);
    return;
  }
  sentry.captureMessage(msg, { extra: ctx });
}
