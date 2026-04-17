/**
 * In-Memory-Store fuer Badge-Assignments.
 */

import type { BadgeAssignment } from "./types";
import { requestBadge, verifyBadge } from "./verifier";

type Store = { assignments: Map<string, BadgeAssignment> };
const g = globalThis as unknown as { __careai_badges?: Store };

function seed(): Map<string, BadgeAssignment> {
  const m = new Map<string, BadgeAssignment>();
  const demo: Array<Partial<BadgeAssignment> & { badgeKey: string; userName: string }> = [
    { userId: "u-1", userName: "Anna Novak", badgeKey: "dgkp" },
    { userId: "u-1", userName: "Anna Novak", badgeKey: "wundexpert_icw" },
    { userId: "u-1", userName: "Anna Novak", badgeKey: "bls_aed" },
    { userId: "u-2", userName: "Markus Huber", badgeKey: "pfa" },
    { userId: "u-2", userName: "Markus Huber", badgeKey: "erste_hilfe" },
    { userId: "u-3", userName: "Sabine Leitner", badgeKey: "pdl" },
    { userId: "u-3", userName: "Sabine Leitner", badgeKey: "qm_beauftragt" },
    { userId: "u-3", userName: "Sabine Leitner", badgeKey: "hygiene_beauftragt" },
    { userId: "u-4", userName: "Peter Gruber", badgeKey: "dgkp" },
    { userId: "u-4", userName: "Peter Gruber", badgeKey: "palliativ_fk" },
  ];
  for (const d of demo) {
    const r = requestBadge({
      tenantId: "demo-tenant",
      userId: d.userId!,
      userName: d.userName,
      badgeKey: d.badgeKey,
      proofUrl: "https://example.org/nachweis.pdf",
    });
    if (r.ok && r.assignment) {
      const v = verifyBadge(r.assignment, "Sabine Leitner (PDL)");
      m.set(v.id, v);
    }
  }
  return m;
}

function getStore(): Store {
  if (!g.__careai_badges) g.__careai_badges = { assignments: seed() };
  return g.__careai_badges;
}

export function allAssignments(tenantId: string): BadgeAssignment[] {
  return Array.from(getStore().assignments.values()).filter(
    (a) => a.tenantId === tenantId || tenantId === "*",
  );
}

export function byUser(userId: string): BadgeAssignment[] {
  return Array.from(getStore().assignments.values()).filter((a) => a.userId === userId);
}

export function addAssignment(a: BadgeAssignment): void {
  getStore().assignments.set(a.id, a);
}

export function getAssignment(id: string): BadgeAssignment | undefined {
  return getStore().assignments.get(id);
}

export function updateAssignment(a: BadgeAssignment): void {
  getStore().assignments.set(a.id, a);
}
