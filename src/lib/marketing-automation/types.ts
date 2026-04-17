export type TriggerType =
  | "demo-requested"
  | "whitepaper-downloaded"
  | "trial-signup"
  | "stale-lead"
  | "customer-onboarded";

export type ConditionType =
  | "email-opened"
  | "link-clicked"
  | "demo-attended"
  | "trial-activated"
  | "none";

export interface Condition {
  type: ConditionType;
  /** Link path or email-subject substring for link/email conditions */
  matches?: string;
}

export interface FlowStep {
  id: string;
  /** Number of days after trigger (0 = immediately) */
  delayDays: number;
  /** Email template name (resolved by the email transport layer) */
  template: string;
  /** Optional subject override (may contain {{placeholders}}) */
  subjectOverride?: string;
  /** Steps only sent when this condition holds. Omit = always sent. */
  condition?: Condition;
  /** A/B subject test via ab-testing module (experiment name) */
  subjectExperiment?: string;
}

export interface Flow {
  id: string;
  name: string;
  description: string;
  trigger: TriggerType;
  durationDays: number;
  steps: FlowStep[];
  /** Running status */
  active: boolean;
}

export interface Lead {
  id: string;
  email: string;
  name?: string;
  flowId: string;
  stepIndex: number;
  enrolledAt: string;
  lastActionAt: string;
  /** Flow completed / opted out */
  completed: boolean;
  events: Array<{ at: string; kind: string; meta?: Record<string, unknown> }>;
}

export interface FlowStats {
  flowId: string;
  activeLeads: number;
  completedLeads: number;
  totalEnrolled: number;
  openRate: number;
  clickRate: number;
}
