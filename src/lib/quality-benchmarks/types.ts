/**
 * Care-Quality-Benchmarks — § 113 SGB XI / MD-Qualitätsindikatoren.
 */

export type Bundesland =
  | "Wien" | "Niederösterreich" | "Oberösterreich" | "Steiermark" | "Tirol"
  | "Bayern" | "Baden-Württemberg" | "Nordrhein-Westfalen" | "Hamburg" | "Berlin";

export type FacilitySize = "klein" | "mittel" | "gross"; // <50 / 50-150 / >150

export type TraegerType = "public" | "church" | "private" | "nonprofit";

export interface PeerGroup {
  id: string;
  label: string;
  bundesland: Bundesland;
  size: FacilitySize;
  traegerType: TraegerType;
  sampleN: number; // Anzahl Einrichtungen
}

/**
 * 10 QI nach § 113 SGB XI (verkürzt, Codes angelehnt an IGES-Methodik).
 */
export interface QualityIndicator {
  id: string;
  code: string; // z.B. "QI-1"
  label: string;
  description: string;
  unit: "percent" | "per1000" | "index";
  higherIsBetter: boolean;
  source: string;
  improvementHints: string[];
}

export interface QiValue {
  qiId: string;
  own: number;
  peerMedian: number;
  peerMean: number;
  peerSd: number;
  percentile: number; // 0..100
  ci95: [number, number]; // own ± Konfidenzintervall (Mock)
  trendDeltaPct: number; // vs. Vorperiode
  status: "green" | "yellow" | "red";
  alert: boolean;
}

export interface BenchmarkReport {
  facilityId: string;
  facilityName: string;
  peerGroup: PeerGroup;
  period: string; // z.B. "2026-Q1"
  generatedAt: string;
  values: QiValue[];
  strengths: string[]; // qiId
  handlungsfelder: string[]; // qiId
  overallScore: number; // 0..100
  rank: { position: number; outOf: number };
}

export interface TrendPoint {
  month: string;
  own: number;
  peerMedian: number;
}
