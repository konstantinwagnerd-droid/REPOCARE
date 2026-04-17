import type { Condition, Lead } from "./types";

/**
 * Check whether a lead satisfies a given condition.
 * Conditions inspect the lead's event stream.
 */
export function conditionHolds(lead: Lead, cond?: Condition): boolean {
  if (!cond || cond.type === "none") return true;
  const events = lead.events;
  switch (cond.type) {
    case "email-opened":
      return events.some((e) => e.kind === "email-opened" && (!cond.matches || String(e.meta?.subject ?? "").includes(cond.matches)));
    case "link-clicked":
      return events.some((e) => e.kind === "link-clicked" && (!cond.matches || String(e.meta?.href ?? "").includes(cond.matches)));
    case "demo-attended":
      return events.some((e) => e.kind === "demo-attended");
    case "trial-activated":
      return events.some((e) => e.kind === "trial-activated");
    default:
      return false;
  }
}
