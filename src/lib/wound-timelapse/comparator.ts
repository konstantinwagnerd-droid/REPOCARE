// Vergleicht zwei Snapshots und ermittelt Trend.

import type { WoundComparison, WoundSnapshot } from "./types";

function diffDays(a: string, b: string): number {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000);
}

export function compare(von: WoundSnapshot, bis: WoundSnapshot): WoundComparison {
  const delta = {
    laengeMm: bis.laengeMm - von.laengeMm,
    breiteMm: bis.breiteMm - von.breiteMm,
    tiefeMm: bis.tiefeMm - von.tiefeMm,
    flaecheMm2: bis.flaecheMm2 - von.flaecheMm2,
    grade: bis.grade - von.grade,
  };
  let trend: WoundComparison["trend"] = "stabil";
  if (delta.flaecheMm2 < -10 || delta.grade < 0) trend = "heilend";
  else if (delta.flaecheMm2 > 15 || delta.grade > 0) trend = "verschlechtert";
  return { von, bis, tageDifferenz: diffDays(von.date, bis.date), delta, trend };
}
