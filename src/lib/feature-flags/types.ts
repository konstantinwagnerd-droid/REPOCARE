export type FlagKind = "boolean" | "percentage" | "multivariate";

export type Role = "admin" | "pdl" | "pflegekraft" | "angehoeriger";

export type TargetingRule = {
  id: string;
  description: string;
  // Match-Bedingungen (AND-verknüpft)
  tenantIds?: string[];
  userIds?: string[];
  roles?: Role[];
  emailContains?: string;
  // Rollout-Percentage (0–100) für diese Rule
  rolloutPercent?: number;
  // Variant für multivariate
  variant?: string;
  enabled: boolean;
};

export type FeatureFlag = {
  key: string;
  name: string;
  description: string;
  kind: FlagKind;
  enabled: boolean; // Master-Schalter (kill switch)
  defaultValue: boolean | string;
  variants?: string[]; // multivariate
  rules: TargetingRule[];
  owner: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
};

export type EvaluationContext = {
  userId?: string;
  tenantId?: string;
  role?: Role;
  email?: string;
};

export type EvaluationResult = {
  key: string;
  value: boolean | string;
  matchedRuleId: string | null;
  reason: "disabled" | "rule-match" | "default" | "percentage-out";
};
