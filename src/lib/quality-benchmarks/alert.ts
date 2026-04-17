/**
 * Alert-Schwelle: Warnung bei > 1 SD unter Median (schlechter als 16% Perzentil).
 */
export function shouldAlert(own: number, peerMean: number, peerSd: number, higherIsBetter: boolean): boolean {
  if (peerSd === 0) return false;
  const z = (own - peerMean) / peerSd;
  const badZ = higherIsBetter ? z : -z;
  return badZ <= -1;
}

export function alertSeverity(own: number, peerMean: number, peerSd: number, higherIsBetter: boolean): "none" | "warn" | "critical" {
  if (peerSd === 0) return "none";
  const z = (own - peerMean) / peerSd;
  const badZ = higherIsBetter ? z : -z;
  if (badZ <= -2) return "critical";
  if (badZ <= -1) return "warn";
  return "none";
}
