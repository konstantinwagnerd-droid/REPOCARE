/**
 * Gueltigkeits-Tracking und Erneuerungs-Fristen.
 */

import type { BadgeAssignment, BadgeDef } from "./types";
import { getBadgeDef } from "./catalog";

export type ExpiryStatus = "valid" | "warning" | "critical" | "expired" | "no_expiry";

const DAY_MS = 86_400_000;

export function computeExpiryStatus(a: BadgeAssignment): ExpiryStatus {
  if (!a.expiresAt) return "no_expiry";
  const remaining = new Date(a.expiresAt).getTime() - Date.now();
  if (remaining < 0) return "expired";
  const days = remaining / DAY_MS;
  if (days <= 14) return "critical";
  if (days <= 60) return "warning";
  return "valid";
}

export function daysUntilExpiry(a: BadgeAssignment): number | null {
  if (!a.expiresAt) return null;
  return Math.round((new Date(a.expiresAt).getTime() - Date.now()) / DAY_MS);
}

export function computeExpiresAt(issuedAtIso: string, def: BadgeDef): string | undefined {
  if (def.validityMonths === null) return undefined;
  const d = new Date(issuedAtIso);
  d.setMonth(d.getMonth() + def.validityMonths);
  return d.toISOString();
}

export function expiringSoon(assignments: BadgeAssignment[], days = 60): BadgeAssignment[] {
  return assignments.filter((a) => {
    const s = computeExpiryStatus(a);
    if (s === "no_expiry" || s === "valid") return false;
    if (s === "expired") return true;
    const left = daysUntilExpiry(a);
    return left !== null && left <= days;
  });
}

export function withDefs(
  assignments: BadgeAssignment[],
): Array<Omit<BadgeAssignment, "status"> & { def?: BadgeDef; status: ExpiryStatus; daysLeft: number | null; assignmentStatus: BadgeAssignment["status"] }> {
  return assignments.map((a) => {
    const { status: assignmentStatus, ...rest } = a;
    return {
      ...rest,
      assignmentStatus,
      def: getBadgeDef(a.badgeKey),
      status: computeExpiryStatus(a),
      daysLeft: daysUntilExpiry(a),
    };
  });
}
