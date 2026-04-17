import type { AnalyticsEventName, RawEvent } from "./types";
import { normalizePage, sanitizeFacility, sanitizeFeature, sanitizeRole } from "./dimensions";
import { analyticsStore } from "./store";

/**
 * Server-Side Tracker.
 * - IP wird vor Verarbeitung verworfen (wir nehmen sie nie entgegen).
 * - UA wird tageweise mit einem Secret-Salt gehasht → kein Cross-Day-Matching.
 * - Rate-Limiting pro UA-Hash: 60 Events / Minute.
 */

const DAY_SALT = ((): string => {
  const base = process.env.ANALYTICS_SALT ?? "careai-analytics-dev-salt";
  const day = new Date().toISOString().slice(0, 10);
  return `${base}:${day}`;
})();

async function hash(input: string): Promise<string> {
  // Web Crypto in Node 18+ und Edge Runtime verfügbar
  const data = new TextEncoder().encode(input);
  const buf = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
    .slice(0, 16);
}

export interface IngestInput {
  name: string;
  page?: string;
  feature?: string;
  role?: string;
  facility?: string;
  metric?: string;
  errorType?: string;
  vitalName?: string;
  value?: number;
  userAgent?: string;
  doNotTrack?: boolean;
}

export async function ingestEvent(input: IngestInput): Promise<{ accepted: boolean; reason?: string }> {
  if (input.doNotTrack) return { accepted: false, reason: "dnt" };
  const allowed: AnalyticsEventName[] = [
    "page.view",
    "feature.voice.transcribe",
    "feature.report.created",
    "feature.export.generated",
    "feature.cmd-k.opened",
    "feature.notification.read",
    "perf.web-vital",
    "error",
  ];
  if (!allowed.includes(input.name as AnalyticsEventName)) return { accepted: false, reason: "unknown-event" };

  const uaHash = input.userAgent ? await hash(input.userAgent + "::" + DAY_SALT) : "anon";
  if (!analyticsStore.rateLimit(uaHash)) return { accepted: false, reason: "rate-limited" };

  const evt: RawEvent = {
    name: input.name as AnalyticsEventName,
    page: input.page ? normalizePage(input.page) : undefined,
    feature: sanitizeFeature(input.feature),
    role: sanitizeRole(input.role),
    facility: sanitizeFacility(input.facility),
    metric: sanitizeFeature(input.metric),
    errorType: sanitizeFeature(input.errorType),
    vitalName: sanitizeFeature(input.vitalName),
    value: typeof input.value === "number" && Number.isFinite(input.value) ? input.value : undefined,
    ts: Date.now(),
  };

  analyticsStore.record(evt, uaHash);
  return { accepted: true };
}
