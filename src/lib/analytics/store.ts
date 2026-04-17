import type { AnalyticsEventName, AnalyticsSummary, DailyRollup, RawEvent } from "./types";

/**
 * In-Memory aggregate store. Keine Rohdaten, nur tageweise Rollups.
 * Retention: 90 Tage.
 */

const RETENTION_DAYS = 90;
const rollups = new Map<string, DailyRollup>(); // key = day|name|page|feature|role|facility

function dayOf(ts: number): string {
  return new Date(ts).toISOString().slice(0, 10);
}

function keyOf(r: Pick<DailyRollup, "day" | "name" | "page" | "feature" | "role" | "facility" | "errorType">): string {
  return [r.day, r.name, r.page ?? "", r.feature ?? "", r.role ?? "", r.facility ?? "", r.errorType ?? ""].join("|");
}

function prune() {
  const cutoff = new Date(Date.now() - RETENTION_DAYS * 86_400_000).toISOString().slice(0, 10);
  for (const [k, r] of rollups) if (r.day < cutoff) rollups.delete(k);
}

// Rate limit buckets: uaHash -> { min, count }
const rate = new Map<string, { min: number; count: number }>();

export const analyticsStore = {
  rateLimit(uaHash: string, limit = 60): boolean {
    const min = Math.floor(Date.now() / 60_000);
    const entry = rate.get(uaHash);
    if (!entry || entry.min !== min) {
      rate.set(uaHash, { min, count: 1 });
      return true;
    }
    if (entry.count >= limit) return false;
    entry.count++;
    return true;
  },

  record(evt: RawEvent, uaHash: string): void {
    prune();
    const day = dayOf(evt.ts);
    const base: Pick<DailyRollup, "day" | "name" | "page" | "feature" | "role" | "facility" | "errorType"> = {
      day,
      name: evt.name,
      page: evt.page,
      feature: evt.feature,
      role: evt.role,
      facility: evt.facility,
      errorType: evt.errorType,
    };
    const key = keyOf(base);
    let r = rollups.get(key);
    if (!r) {
      r = { ...base, count: 0, valueSum: 0, valueCount: 0, uniqHashes: new Set() };
      rollups.set(key, r);
    }
    r.count++;
    if (typeof evt.value === "number") {
      r.valueSum = (r.valueSum ?? 0) + evt.value;
      r.valueCount = (r.valueCount ?? 0) + 1;
    }
    r.uniqHashes.add(uaHash);
  },

  summary(): AnalyticsSummary {
    const today = new Date().toISOString().slice(0, 10);
    const weekCutoff = new Date(Date.now() - 7 * 86_400_000).toISOString().slice(0, 10);

    let pageViewsToday = 0;
    let featureEventsToday = 0;
    let errorsToday = 0;
    const dailyUnique = new Set<string>();
    const weeklyUnique = new Set<string>();
    let pageViewsWeek = 0;
    const topPages = new Map<string, number>();
    const topFeatures = new Map<string, number>();
    const pageTiming = new Map<string, { sum: number; count: number }>();
    const errorTypes = new Map<string, number>();
    const trendMap = new Map<string, { pageViews: number; featureEvents: number }>();

    for (const r of rollups.values()) {
      if (r.day === today) {
        if (r.name === "page.view") pageViewsToday += r.count;
        else if (r.name.startsWith("feature.")) featureEventsToday += r.count;
        else if (r.name === "error") errorsToday += r.count;
        for (const h of r.uniqHashes) dailyUnique.add(h);
      }
      if (r.day >= weekCutoff) {
        for (const h of r.uniqHashes) weeklyUnique.add(h);
        if (r.name === "page.view") pageViewsWeek += r.count;
        const t = trendMap.get(r.day) ?? { pageViews: 0, featureEvents: 0 };
        if (r.name === "page.view") t.pageViews += r.count;
        else if (r.name.startsWith("feature.")) t.featureEvents += r.count;
        trendMap.set(r.day, t);
      }
      if (r.name === "page.view" && r.page) topPages.set(r.page, (topPages.get(r.page) ?? 0) + r.count);
      if (r.name.startsWith("feature.") && r.feature) topFeatures.set(r.feature, (topFeatures.get(r.feature) ?? 0) + r.count);
      if (r.name === "perf.web-vital" && r.page && r.valueSum && r.valueCount) {
        const p = pageTiming.get(r.page) ?? { sum: 0, count: 0 };
        p.sum += r.valueSum;
        p.count += r.valueCount;
        pageTiming.set(r.page, p);
      }
      if (r.name === "error" && r.errorType) errorTypes.set(r.errorType, (errorTypes.get(r.errorType) ?? 0) + r.count);
    }

    const totalToday = pageViewsToday + featureEventsToday + errorsToday;
    const errorRate = totalToday > 0 ? Math.round((errorsToday / totalToday) * 1000) / 10 : 0;

    return {
      today: {
        activeUsers: dailyUnique.size,
        pageViews: pageViewsToday,
        featureEvents: featureEventsToday,
        errorRate,
      },
      week: { activeUsers: weeklyUnique.size, pageViews: pageViewsWeek },
      topPages: [...topPages.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([page, count]) => ({ page, count })),
      topFeatures: [...topFeatures.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([feature, count]) => ({ feature, count })),
      slowestPages: [...pageTiming.entries()]
        .map(([page, v]) => ({ page, avgMs: Math.round(v.sum / Math.max(1, v.count)) }))
        .sort((a, b) => b.avgMs - a.avgMs)
        .slice(0, 10),
      errors: [...errorTypes.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([type, count]) => ({ type, count })),
      trend: [...trendMap.entries()]
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([day, v]) => ({ day, ...v })),
    };
  },

  all(): DailyRollup[] {
    return [...rollups.values()];
  },

  _reset(): void {
    rollups.clear();
    rate.clear();
  },
};
