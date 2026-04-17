/**
 * Privacy-First Analytics – Types.
 * Keine PII. Keine Cookies. Keine Cross-Day-Identifikation.
 */

export type AnalyticsEventName =
  | "page.view"
  | "feature.voice.transcribe"
  | "feature.report.created"
  | "feature.export.generated"
  | "feature.cmd-k.opened"
  | "feature.notification.read"
  | "perf.web-vital"
  | "error";

export type AllowedDimension = "role" | "facility" | "page" | "feature" | "metric" | "errorType" | "vitalName";

export interface RawEvent {
  name: AnalyticsEventName;
  page?: string;
  feature?: string;
  role?: string;
  facility?: string;
  metric?: string;
  errorType?: string;
  vitalName?: string;
  value?: number;
  ts: number;
}

export interface DailyRollup {
  day: string; // YYYY-MM-DD
  name: AnalyticsEventName;
  page?: string;
  feature?: string;
  role?: string;
  facility?: string;
  errorType?: string;
  count: number;
  valueSum?: number;
  valueCount?: number;
  uniqHashes: Set<string>; // tageweise pro user-hash
}

export interface AnalyticsSummary {
  today: {
    activeUsers: number;
    pageViews: number;
    featureEvents: number;
    errorRate: number;
  };
  week: { activeUsers: number; pageViews: number };
  topPages: Array<{ page: string; count: number }>;
  topFeatures: Array<{ feature: string; count: number }>;
  slowestPages: Array<{ page: string; avgMs: number }>;
  errors: Array<{ type: string; count: number }>;
  trend: Array<{ day: string; pageViews: number; featureEvents: number }>;
}
