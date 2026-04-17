import type { GroupAccessContext, GroupRole, RollupScope } from "./types";

/**
 * RBAC für Gruppen-Scope.
 *
 * In dieser Demo bleibt das Modell einfach: group_admin sieht alles innerhalb
 * seiner Gruppe; group_viewer nur Rollups/Vergleiche, keine Einzel-
 * Einrichtungs-Financials. Die zentrale Admin-Rolle (admin/pdl) im CareAI-
 * Schema wird über den Env-Override `CAREAI_GROUP_DEMO_ROLE` als
 * group_admin interpretiert.
 */

export function buildAccessContext(input: { userId: string; role: string; groupId?: string | null }): GroupAccessContext {
  const groupRole: GroupRole | null =
    input.role === "admin" || input.role === "pdl" ? "group_admin" : input.role === "group_viewer" ? "group_viewer" : null;

  const groupId = input.groupId ?? null;

  return {
    userId: input.userId,
    groupRole,
    groupId,
    canView: (scope: RollupScope, _facilityId?: string) => {
      if (!groupRole) return false;
      if (scope === "facility" && groupRole === "group_viewer") return false;
      return true;
    },
  };
}

export function assertGroupAccess(ctx: GroupAccessContext, scope: RollupScope, facilityId?: string): void {
  if (!ctx.canView(scope, facilityId)) {
    throw new Error("FORBIDDEN: kein Zugriff auf Gruppen-Scope");
  }
}
