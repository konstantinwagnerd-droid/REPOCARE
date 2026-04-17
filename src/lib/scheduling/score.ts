import { DEFAULT_WEIGHTS, type Violation, type Weights } from "./types";

/**
 * Penalty-basiertes Scoring — geringer = besser.
 * 0 = perfekter Plan (keine Hard-Violations, keine Soft-Penalties).
 */
export function score(
  violations: Violation[],
  unfilled: number,
  sollStundenDeviation: number,
  weights: Weights = DEFAULT_WEIGHTS,
): number {
  let penalty = 0;
  for (const v of violations) {
    if (v.severity === "hard") {
      penalty += weights.hardViolation;
      if (v.kind === "vacation") penalty += weights.vacationOnDuty;
      if (v.kind === "overtime") penalty += weights.overtime;
    } else {
      if (v.kind === "undesired-shift") penalty += weights.undesiredShift;
    }
  }
  penalty += unfilled * weights.hardViolation;
  penalty += sollStundenDeviation * weights.sollStundenDeviation;
  return penalty;
}

export function sollStundenDeviation(
  hoursByStaff: Record<string, number>,
  staff: { id: string; sollStunden: number }[],
  weeks: number,
): number {
  let total = 0;
  for (const s of staff) {
    const actual = hoursByStaff[s.id] ?? 0;
    const target = s.sollStunden * weeks;
    total += Math.abs(actual - target);
  }
  return total;
}
