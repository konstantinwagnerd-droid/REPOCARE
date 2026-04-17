/**
 * Verifikations-Workflow: Antragstellung + Freigabe durch PDL.
 */

import type { BadgeAssignment } from "./types";
import { getBadgeDef } from "./catalog";
import { computeExpiresAt } from "./expiry";

export interface VerifyResult {
  ok: boolean;
  error?: string;
  assignment?: BadgeAssignment;
}

export function requestBadge(input: {
  tenantId: string;
  userId: string;
  userName?: string;
  badgeKey: string;
  proofUrl?: string;
  note?: string;
}): VerifyResult {
  const def = getBadgeDef(input.badgeKey);
  if (!def) return { ok: false, error: "Badge nicht im Katalog" };
  if (def.requiresProof && !input.proofUrl) {
    return { ok: false, error: "Dieses Badge erfordert einen Nachweis (proofUrl)" };
  }
  const now = new Date().toISOString();
  const a: BadgeAssignment = {
    id: `ba-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    tenantId: input.tenantId,
    userId: input.userId,
    userName: input.userName,
    badgeKey: input.badgeKey,
    status: "beantragt",
    issuedAt: now,
    expiresAt: computeExpiresAt(now, def),
    proofUrl: input.proofUrl,
    note: input.note,
  };
  return { ok: true, assignment: a };
}

export function verifyBadge(a: BadgeAssignment, verifierName: string): BadgeAssignment {
  return { ...a, status: "verifiziert", verifiedBy: verifierName, verifiedAt: new Date().toISOString() };
}

export function revokeBadge(a: BadgeAssignment, reason?: string): BadgeAssignment {
  return { ...a, status: "widerrufen", note: reason ?? a.note };
}
