import type { FacilityKpiSnapshot, GroupKpiRollup, GroupRecord } from "./types";
import { snapshotsForGroup } from "./seed";

export function median(values: number[]): number {
  if (values.length === 0) return 0;
  const s = [...values].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 === 0 ? (s[m - 1] + s[m]) / 2 : s[m];
}

export function avg(values: number[]): number {
  if (values.length === 0) return 0;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

export function sum(values: number[]): number {
  return values.reduce((a, b) => a + b, 0);
}

export function roundTo(x: number, digits = 1): number {
  const f = Math.pow(10, digits);
  return Math.round(x * f) / f;
}

export function rollupGroup(group: GroupRecord, month: string): GroupKpiRollup {
  const snaps = snapshotsForGroup(group, month);
  const beds = sum(group.facilities.map((f) => f.beds));
  const staff = sum(group.facilities.map((f) => f.staff));

  return {
    scope: "group",
    groupId: group.id,
    month,
    totals: {
      beds,
      staff,
      facilities: group.facilities.length,
      revenueEur: sum(snaps.map((s) => s.revenueEur)),
      costEur: sum(snaps.map((s) => s.costEur)),
      ebitdaEur: sum(snaps.map((s) => s.ebitdaEur)),
    },
    averages: {
      occupancyPct: roundTo(avg(snaps.map((s) => s.occupancyPct))),
      avgPflegegrad: roundTo(avg(snaps.map((s) => s.avgPflegegrad)), 2),
      staffTurnoverPct: roundTo(avg(snaps.map((s) => s.staffTurnoverPct))),
      documentationRatePct: roundTo(avg(snaps.map((s) => s.documentationRatePct))),
      incidentRate: roundTo(avg(snaps.map((s) => s.incidentRate)), 2),
      complianceQuotePct: roundTo(avg(snaps.map((s) => s.complianceQuotePct))),
    },
    medians: {
      occupancyPct: roundTo(median(snaps.map((s) => s.occupancyPct))),
      incidentRate: roundTo(median(snaps.map((s) => s.incidentRate)), 2),
    },
    totalsAdditional: {
      complaints: sum(snaps.map((s) => s.complaints)),
      mdCheckOpenFindings: sum(snaps.map((s) => s.mdCheckOpenFindings)),
      dsgvoRequestsOpen: sum(snaps.map((s) => s.dsgvoRequestsOpen)),
    },
  };
}

export function rollupTrend(group: GroupRecord, months: string[]): Array<{ month: string; occupancy: number; incidents: number; revenue: number; ebitda: number }> {
  return months.map((m) => {
    const snaps = snapshotsForGroup(group, m);
    return {
      month: m,
      occupancy: roundTo(avg(snaps.map((s) => s.occupancyPct))),
      incidents: roundTo(avg(snaps.map((s) => s.incidentRate)), 2),
      revenue: sum(snaps.map((s) => s.revenueEur)),
      ebitda: sum(snaps.map((s) => s.ebitdaEur)),
    };
  });
}

export type NumericKpiKey =
  | "occupancyPct"
  | "avgPflegegrad"
  | "staffTurnoverPct"
  | "documentationRatePct"
  | "incidentRate"
  | "complianceQuotePct"
  | "complaints"
  | "revenueEur"
  | "ebitdaEur"
  | "mdCheckOpenFindings";

export function extractNumeric(snaps: FacilityKpiSnapshot[], key: NumericKpiKey): number[] {
  return snaps.map((s) => s[key] as number);
}
