/**
 * Perzentil-Rechnung gegen eine Normalverteilung (Peer-Gruppe:
 * mean + sd). Für Demo-Zwecke ausreichend.
 */

export function normalCdf(z: number): number {
  // Abramowitz & Stegun Näherung
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989422804014327 * Math.exp((-z * z) / 2);
  const p = d * t * (0.31938153 + t * (-0.356563782 + t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  return z > 0 ? 1 - p : p;
}

export function zScore(value: number, mean: number, sd: number): number {
  if (sd === 0) return 0;
  return (value - mean) / sd;
}

export function percentileRank(value: number, mean: number, sd: number, higherIsBetter: boolean): number {
  const z = zScore(value, mean, sd);
  const p = normalCdf(z) * 100;
  return Math.round((higherIsBetter ? p : 100 - p) * 10) / 10;
}

/** 95%-Konfidenzintervall ±1.96·SEM. SEM = sd/√N. */
export function confidenceInterval95(value: number, sd: number, n: number): [number, number] {
  if (n <= 0) return [value, value];
  const sem = sd / Math.sqrt(n);
  const half = 1.96 * sem;
  return [Math.max(0, Math.round((value - half) * 10) / 10), Math.round((value + half) * 10) / 10];
}
