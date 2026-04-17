import type { Experiment, Variant } from "./types";

/** FNV-1a 32-bit hash — matches feature-flags module */
export function fnv1a(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h >>> 0;
}

/** Returns a deterministic float in [0, 1) for a given user/experiment pair */
export function bucketOf(userId: string, experimentName: string): number {
  const h = fnv1a(`ab:${experimentName}:${userId}`);
  return h / 0xffffffff;
}

/**
 * Deterministic variant assignment. Returns null if user is NOT in experiment
 * (outside trafficAllocation, or experiment not running).
 */
export function assignVariant(exp: Experiment, userId: string): Variant | null {
  if (exp.status !== "running") return null;
  const enrolBucket = bucketOf(userId, `${exp.name}:enrol`);
  if (enrolBucket >= exp.trafficAllocation) return null;

  const bucket = bucketOf(userId, exp.name);
  let cumulative = 0;
  for (const v of exp.variants) {
    cumulative += v.weight;
    if (bucket < cumulative) return v;
  }
  // Fallback: last variant (handles floating-point imprecision)
  return exp.variants[exp.variants.length - 1] ?? null;
}
