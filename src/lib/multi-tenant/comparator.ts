import type { FacilityComparison, FacilityKpiSnapshot } from "./types";
import type { GroupRecord } from "./types";
import { snapshotsForGroup } from "./seed";
import { median, extractNumeric, type NumericKpiKey } from "./rollup";

/**
 * Bewertet, ob ein höherer Wert besser ist (z.B. Belegung, Doku-Quote)
 * oder schlechter (z.B. Fluktuation, Incident-Rate).
 */
const higherIsBetter: Record<NumericKpiKey, boolean> = {
  occupancyPct: true,
  avgPflegegrad: true, // höherer Pflegegrad → höhere Vergütung
  staffTurnoverPct: false,
  documentationRatePct: true,
  incidentRate: false,
  complianceQuotePct: true,
  complaints: false,
  revenueEur: true,
  ebitdaEur: true,
  mdCheckOpenFindings: false,
};

export function compareFacilities(group: GroupRecord, month: string, metric: NumericKpiKey): FacilityComparison[] {
  const snaps = snapshotsForGroup(group, month);
  const values = extractNumeric(snaps, metric);
  const m = median(values);

  const better = higherIsBetter[metric];
  const sorted = [...snaps].sort((a, b) => {
    const va = a[metric] as number;
    const vb = b[metric] as number;
    return better ? vb - va : va - vb;
  });

  const rankMap = new Map<string, number>();
  sorted.forEach((s, i) => rankMap.set(s.facilityId, i + 1));

  const n = snaps.length;

  return snaps.map((s) => {
    const value = s[metric] as number;
    const rank = rankMap.get(s.facilityId)!;
    const percentile = Math.round(((n - rank) / Math.max(1, n - 1)) * 100);
    const deviation = m === 0 ? 0 : ((value - m) / Math.abs(m)) * 100;
    const facility = group.facilities.find((f) => f.id === s.facilityId)!;

    let status: FacilityComparison["status"] = "median";
    if (rank === 1) status = "best";
    else if (rank === n) status = "worst";
    else {
      const diff = better ? value - m : m - value;
      if (diff > Math.abs(m) * 0.05) status = "above";
      else if (diff < -Math.abs(m) * 0.05) status = "below";
    }

    return {
      facilityId: s.facilityId,
      facilityName: facility.name,
      metric,
      value,
      median: m,
      deviationPct: Math.round(deviation * 10) / 10,
      rank,
      percentile,
      status,
    };
  });
}

export interface KpiRow {
  facilityId: string;
  facilityName: string;
  city: string;
  values: Record<NumericKpiKey, number>;
  medians: Record<NumericKpiKey, number>;
}

export function buildCompareMatrix(group: GroupRecord, month: string, metrics: NumericKpiKey[]): KpiRow[] {
  const snaps = snapshotsForGroup(group, month);
  const medians: Record<string, number> = {};
  for (const m of metrics) medians[m] = median(extractNumeric(snaps, m));

  return snaps.map((s) => {
    const facility = group.facilities.find((f) => f.id === s.facilityId)!;
    const values = {} as Record<NumericKpiKey, number>;
    const mds = {} as Record<NumericKpiKey, number>;
    for (const metric of metrics) {
      values[metric] = s[metric] as number;
      mds[metric] = medians[metric];
    }
    return { facilityId: s.facilityId, facilityName: facility.name, city: facility.city, values, medians: mds };
  });
}

export function cellStatus(value: number, medianValue: number, metric: NumericKpiKey): "good" | "ok" | "bad" {
  const better = higherIsBetter[metric];
  if (medianValue === 0) return "ok";
  const diff = (value - medianValue) / Math.abs(medianValue);
  const goodDir = better ? diff >= 0.03 : diff <= -0.03;
  const badDir = better ? diff <= -0.05 : diff >= 0.05;
  if (goodDir) return "good";
  if (badDir) return "bad";
  return "ok";
}

export function bestPracticeFacility(group: GroupRecord, month: string): { facilityId: string; score: number } {
  const snaps = snapshotsForGroup(group, month);
  const keys: NumericKpiKey[] = ["occupancyPct", "documentationRatePct", "complianceQuotePct", "staffTurnoverPct", "incidentRate"];
  const medians: Record<string, number> = {};
  for (const k of keys) medians[k] = median(extractNumeric(snaps, k));

  let best: { facilityId: string; score: number } = { facilityId: "", score: -Infinity };
  for (const s of snaps) {
    let score = 0;
    for (const k of keys) {
      const v = s[k] as number;
      const m = medians[k];
      const rel = m === 0 ? 0 : (v - m) / Math.abs(m);
      score += higherIsBetter[k] ? rel : -rel;
    }
    if (score > best.score) best = { facilityId: s.facilityId, score };
  }
  return best;
}
