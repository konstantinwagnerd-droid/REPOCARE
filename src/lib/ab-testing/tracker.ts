import { abStore } from "./store";
import { assignVariant } from "./assignment";
import type { ConversionEvent } from "./types";

/**
 * Track an impression for a user/experiment. Returns the assigned variant id
 * (or null if the user is not enrolled).
 */
export function trackImpression(experimentName: string, userHash: string): string | null {
  const exp = abStore.getByName(experimentName);
  if (!exp) return null;
  const variant = assignVariant(exp, userHash);
  if (!variant) return null;
  abStore.recordImpression(exp.id, variant.id);
  abStore.recordAssignment({
    experimentId: exp.id,
    experimentName: exp.name,
    variantId: variant.id,
    userHash,
    assignedAt: new Date().toISOString(),
  });
  return variant.id;
}

/** Track a conversion event against the user's previously-assigned variant */
export function trackConversion(
  experimentName: string,
  userHash: string,
  metricId: string,
  value?: number
): ConversionEvent | null {
  const exp = abStore.getByName(experimentName);
  if (!exp) return null;
  const assignment = abStore.getAssignment(experimentName, userHash);
  // If never seen before, assign lazily
  const variantId = assignment?.variantId ?? assignVariant(exp, userHash)?.id;
  if (!variantId) return null;
  const ev: ConversionEvent = {
    experimentId: exp.id,
    variantId,
    userHash,
    metricId,
    value,
    occurredAt: new Date().toISOString(),
  };
  abStore.recordConversion(ev);
  return ev;
}
