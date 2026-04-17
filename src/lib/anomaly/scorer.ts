import type { AnomalyEvent, UserBaseline } from "./types";

/**
 * 30-Tage-Baseline pro User. Z-Score für Tagesaktivität.
 */
export function buildBaselines(events: AnomalyEvent[], now = Date.now()): Map<string, UserBaseline> {
  const cutoff = now - 30 * 86_400_000;
  const byUser = new Map<string, AnomalyEvent[]>();
  for (const e of events) {
    if (!e.userId || e.ts < cutoff) continue;
    const arr = byUser.get(e.userId) ?? [];
    arr.push(e);
    byUser.set(e.userId, arr);
  }
  const baselines = new Map<string, UserBaseline>();
  for (const [userId, arr] of byUser) {
    const perDay = new Map<string, number>();
    const hours = new Set<number>();
    const countries = new Set<string>();
    for (const e of arr) {
      const d = new Date(e.ts);
      perDay.set(d.toISOString().slice(0, 10), (perDay.get(d.toISOString().slice(0, 10)) ?? 0) + 1);
      hours.add(d.getHours());
      if (e.country) countries.add(e.country);
    }
    const counts = [...perDay.values()];
    const mean = counts.reduce((a, b) => a + b, 0) / Math.max(1, counts.length);
    const variance = counts.reduce((a, b) => a + (b - mean) ** 2, 0) / Math.max(1, counts.length);
    baselines.set(userId, {
      userId,
      meanDaily: mean,
      stdDaily: Math.sqrt(variance),
      typicalHours: hours,
      typicalCountries: countries,
      sampleDays: counts.length,
    });
  }
  return baselines;
}

export function zScore(count: number, baseline: UserBaseline): number {
  if (baseline.stdDaily === 0) return count > baseline.meanDaily * 2 ? 3 : 0;
  return (count - baseline.meanDaily) / baseline.stdDaily;
}
