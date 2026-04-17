export type PlanTier = "free" | "starter" | "pro" | "enterprise";

export type Plan = {
  id: PlanTier;
  name: string;
  monthlyPriceEUR: number;
  includedRequests: number; // pro Monat inkludiert
  overagePerThousandEUR: number; // Preis pro 1.000 Requests Overage
  rateLimitRpm: number; // requests per minute
  features: string[];
};

export type ApiKey = {
  id: string;
  tenantId: string;
  label: string;
  key: string; // sk_live_xxx (Mock)
  planId: PlanTier;
  createdAt: number;
  lastUsedAt: number | null;
  revoked: boolean;
  createdBy: string;
};

export type MeterEvent = {
  id: string;
  apiKeyId: string;
  tenantId: string;
  endpoint: string;
  method: string;
  statusCode: number;
  latencyMs: number;
  timestamp: number;
  // RFC-8594 style meter
  meter: "api.request";
  value: 1;
  unit: "request";
};

export type UsageBucket = {
  apiKeyId: string;
  day: string; // YYYY-MM-DD
  count: number;
  bytes: number;
  errors: number;
};

export type Invoice = {
  id: string;
  tenantId: string;
  apiKeyId: string;
  periodStart: string; // YYYY-MM
  periodEnd: string;
  planId: PlanTier;
  includedRequests: number;
  usedRequests: number;
  overageRequests: number;
  baseFeeEUR: number;
  overageFeeEUR: number;
  totalEUR: number;
  status: "draft" | "issued" | "paid";
  issuedAt: number;
};
