/**
 * Capture Wrapper — unified error/warning capture for CareAI.
 *
 * Wraps Sentry + console.* so we can:
 *   1. Pre-scrub PHI-sensitive context before it goes to Sentry
 *   2. Fall back to structured console logging when no DSN is set (local dev)
 *   3. Centralize: all app code calls captureException/captureWarning from here
 *
 * Usage:
 *   import { captureException, captureWarning } from "@/lib/observability/capture";
 *   try { ... } catch (e) { captureException(e, { route: "/api/sis", residentId: "hashed" }); }
 */
import * as Sentry from "@sentry/nextjs";

type Ctx = Record<string, unknown>;

function sanitizeCtx(ctx?: Ctx): Ctx | undefined {
  if (!ctx) return undefined;
  const out: Ctx = {};
  for (const [k, v] of Object.entries(ctx)) {
    // Block obvious PHI field names at the source.
    if (/body|transcript|name|vorname|nachname|content|text|freitext/i.test(k)) {
      out[k] = "[redacted]";
      continue;
    }
    if (typeof v === "string" && v.length > 500) {
      out[k] = v.slice(0, 500) + "…[truncated]";
      continue;
    }
    out[k] = v;
  }
  return out;
}

export function captureException(err: unknown, ctx?: Ctx): void {
  const safe = sanitizeCtx(ctx);
  // Structured log always.
  // eslint-disable-next-line no-console
  console.error(
    JSON.stringify({
      level: "error",
      msg: "exception",
      err: err instanceof Error ? err.message : String(err),
      ctx: safe,
    })
  );
  try {
    Sentry.captureException(err, safe ? { extra: safe } : undefined);
  } catch {
    // Sentry not initialized (no DSN) — console.error above is sufficient.
  }
}

export function captureWarning(message: string, ctx?: Ctx): void {
  const safe = sanitizeCtx(ctx);
  // eslint-disable-next-line no-console
  console.warn(JSON.stringify({ level: "warn", msg: message, ctx: safe }));
  try {
    Sentry.captureMessage(message, {
      level: "warning",
      ...(safe ? { extra: safe } : {}),
    });
  } catch {
    // No-op when DSN missing.
  }
}

export function captureInfo(message: string, ctx?: Ctx): void {
  const safe = sanitizeCtx(ctx);
  // eslint-disable-next-line no-console
  console.info(JSON.stringify({ level: "info", msg: message, ctx: safe }));
  try {
    Sentry.captureMessage(message, {
      level: "info",
      ...(safe ? { extra: safe } : {}),
    });
  } catch {
    // No-op.
  }
}
