import type { BenchmarkReport, PeerGroup, QiValue, TrendPoint } from "./types";
import { QIS, referenceFor } from "./reference-data";
import { percentileRank, confidenceInterval95 } from "./percentile";
import { shouldAlert } from "./alert";

/**
 * Mock-Berechnung eigener QI-Werte. In Produktion würde hier ein
 * Aggregat auf den audit_log / care_reports / incidents Tabellen
 * laufen. Wir nutzen deterministische Pseudowerte, die stabil je
 * Einrichtung + Zeitraum sind.
 */
function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h) / 0xffffffff;
}

function ownValue(facilityId: string, period: string, qiId: string, median: number, sd: number, _higherIsBetter: boolean): number {
  const h = hash(`${facilityId}:${period}:${qiId}`);
  // bias so dass Hälfte über/unter Median liegt
  const deviation = (h - 0.5) * 3 * sd;
  const v = median + deviation;
  return Math.max(0, Math.round(v * 10) / 10);
}

function statusFor(percentile: number, higherIsBetter: boolean, own: number, mean: number, sd: number): QiValue["status"] {
  const z = sd === 0 ? 0 : (own - mean) / sd;
  const zGood = higherIsBetter ? z : -z;
  if (zGood >= 0.5) return "green";
  if (zGood >= -1) return "yellow";
  return "red";
}

export function calculateBenchmark(
  facilityId: string,
  facilityName: string,
  period: string,
  peerGroup: PeerGroup,
): BenchmarkReport {
  const values: QiValue[] = QIS.map((q) => {
    const ref = referenceFor(q.id, peerGroup.bundesland, peerGroup.size, peerGroup.traegerType);
    const own = ownValue(facilityId, period, q.id, ref.median, ref.sd, q.higherIsBetter);
    const percentile = percentileRank(own, ref.mean, ref.sd, q.higherIsBetter);
    const ci95 = confidenceInterval95(own, ref.sd, 80); // n=80 Bewohner als Stichprobengröße
    // Trend vs. Vorperiode: leichte Variation
    const prev = ownValue(facilityId, prevPeriod(period), q.id, ref.median, ref.sd, q.higherIsBetter);
    const trendDeltaPct = prev === 0 ? 0 : Math.round(((own - prev) / prev) * 1000) / 10;
    const status = statusFor(percentile, q.higherIsBetter, own, ref.mean, ref.sd);
    return {
      qiId: q.id, own, peerMedian: Math.round(ref.median * 10) / 10,
      peerMean: Math.round(ref.mean * 10) / 10, peerSd: ref.sd,
      percentile, ci95, trendDeltaPct, status,
      alert: shouldAlert(own, ref.mean, ref.sd, q.higherIsBetter),
    };
  });

  const greenCount = values.filter((v) => v.status === "green").length;
  const redCount = values.filter((v) => v.status === "red").length;
  const overallScore = Math.round(Math.max(0, Math.min(100, 55 + (greenCount - redCount) * 6 + values.reduce((s, v) => s + (v.percentile - 50) * 0.2, 0))));

  const strengths = [...values]
    .sort((a, b) => b.percentile - a.percentile).slice(0, 3).map((v) => v.qiId);
  const handlungsfelder = [...values]
    .sort((a, b) => a.percentile - b.percentile).slice(0, 3).map((v) => v.qiId);

  return {
    facilityId, facilityName, peerGroup, period,
    generatedAt: new Date().toISOString(),
    values, strengths, handlungsfelder, overallScore,
    rank: rankIn(peerGroup.sampleN, overallScore),
  };
}

function rankIn(sampleN: number, score: number): { position: number; outOf: number } {
  const position = Math.max(1, Math.round(sampleN * (1 - score / 100)) + 1);
  return { position: Math.min(position, sampleN), outOf: sampleN };
}

function prevPeriod(period: string): string {
  // supports "YYYY-MM" or "YYYY-Qn"
  if (/^\d{4}-Q\d$/.test(period)) {
    const [y, q] = period.split("-Q").map((x) => parseInt(x));
    const pq = q === 1 ? 4 : q - 1;
    const py = q === 1 ? y - 1 : y;
    return `${py}-Q${pq}`;
  }
  const [y, m] = period.split("-").map((x) => parseInt(x));
  const d = new Date(Date.UTC(y, m - 1, 1));
  d.setUTCMonth(d.getUTCMonth() - 1);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function calculateTrend(
  facilityId: string,
  qiId: string,
  peerGroup: PeerGroup,
  months: string[],
): TrendPoint[] {
  const qi = QIS.find((q) => q.id === qiId)!;
  return months.map((m) => {
    const ref = referenceFor(qiId, peerGroup.bundesland, peerGroup.size, peerGroup.traegerType);
    const own = ownValue(facilityId, m, qiId, ref.median, ref.sd, qi.higherIsBetter);
    return { month: m, own, peerMedian: Math.round(ref.median * 10) / 10 };
  });
}

export function qiById(qiId: string) {
  return QIS.find((q) => q.id === qiId);
}
