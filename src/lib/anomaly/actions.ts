import type { AnomalyFinding } from "./types";
import { dispatch } from "@/lib/notifications/router";

/**
 * Auto-Actions nach Detection: Notification an Admin + Empfehlungen.
 * Echte Session-Invalidation wird nicht durchgeführt (braucht DB – tabu).
 */
export async function handleFinding(finding: AnomalyFinding, tenantId: string): Promise<void> {
  await dispatch({
    event: "audit.anomaly",
    tenantId,
    audience: { scope: "role", value: "admin" },
    vars: {
      kind: finding.kind,
      severity: finding.severity,
      user: finding.userId ?? "n/a",
    },
    href: `/admin/anomaly?id=${finding.id}`,
  });
}

export function shouldBlockExport(finding: AnomalyFinding): boolean {
  return finding.severity === "critical" || finding.kind === "off-hours-export" || finding.kind === "bulk-delete";
}

export function shouldRecommendSessionInvalidation(finding: AnomalyFinding): boolean {
  return finding.severity === "critical" || finding.kind === "credential-stuffing" || finding.kind === "role-escalation";
}
