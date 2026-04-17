import type { Plan, PlanTier } from "./types";

export const PLANS: Record<PlanTier, Plan> = {
  free: {
    id: "free",
    name: "Free",
    monthlyPriceEUR: 0,
    includedRequests: 1_000,
    overagePerThousandEUR: 0, // keine Overage, 429 bei Limit
    rateLimitRpm: 30,
    features: [
      "1.000 API-Requests / Monat",
      "30 Requests / Minute",
      "Community-Support",
      "OpenAPI-Dokumentation",
    ],
  },
  starter: {
    id: "starter",
    name: "Starter",
    monthlyPriceEUR: 49,
    includedRequests: 50_000,
    overagePerThousandEUR: 2.5,
    rateLimitRpm: 300,
    features: [
      "50.000 API-Requests / Monat",
      "300 Requests / Minute",
      "2,50 € pro 1.000 Overage",
      "E-Mail-Support",
    ],
  },
  pro: {
    id: "pro",
    name: "Pro",
    monthlyPriceEUR: 249,
    includedRequests: 500_000,
    overagePerThousandEUR: 1.2,
    rateLimitRpm: 1_500,
    features: [
      "500.000 API-Requests / Monat",
      "1.500 Requests / Minute",
      "1,20 € pro 1.000 Overage",
      "Priorisierter Support",
      "Webhooks & Audit-Export",
    ],
  },
  enterprise: {
    id: "enterprise",
    name: "Enterprise",
    monthlyPriceEUR: 1_499,
    includedRequests: 5_000_000,
    overagePerThousandEUR: 0.6,
    rateLimitRpm: 10_000,
    features: [
      "5 Mio. API-Requests / Monat",
      "10.000 Requests / Minute",
      "0,60 € pro 1.000 Overage",
      "SLA 99,95 %",
      "Dedicated Account Manager",
      "On-Premise-Option",
    ],
  },
};

export function getPlan(id: PlanTier): Plan {
  return PLANS[id];
}

export const PLAN_LIST: Plan[] = Object.values(PLANS);
