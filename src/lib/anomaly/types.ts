/**
 * Audit-Log Anomaly Detection – Types.
 */

export type AnomalyKind =
  | "bulk-delete"
  | "off-hours-export"
  | "role-escalation"
  | "geo-unusual"
  | "rapid-access"
  | "credential-stuffing"
  | "data-spike"
  | "permission-overuse"
  | "dormant-reactivation"
  | "after-hours-login";

export type AnomalySeverity = "low" | "medium" | "high" | "critical";

export interface AnomalyEvent {
  id: string;
  userId?: string;
  action: string;
  entityType: string;
  ts: number;
  ip?: string;
  country?: string;
  userAgent?: string;
}

export interface AnomalyRule {
  kind: AnomalyKind;
  label: string;
  description: string;
  enabled: boolean;
  threshold: number;
  windowMs: number;
  severity: AnomalySeverity;
}

export interface AnomalyFinding {
  id: string;
  kind: AnomalyKind;
  severity: AnomalySeverity;
  userId?: string;
  title: string;
  summary: string;
  zScore?: number;
  eventIds: string[];
  detectedAt: number;
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: number;
  recommendedAction: string;
}

export interface UserBaseline {
  userId: string;
  /** Durchschnittliche tägl. Events. */
  meanDaily: number;
  stdDaily: number;
  typicalHours: Set<number>;
  typicalCountries: Set<string>;
  sampleDays: number;
}
