import type { ApiKey, Invoice, MeterEvent, UsageBucket } from "./types";

type Store = {
  apiKeys: Map<string, ApiKey>;
  events: MeterEvent[];
  buckets: Map<string, UsageBucket>;
  invoices: Map<string, Invoice>;
  rateWindows: Map<string, number[]>;
};

const TENANT = "tenant-demo";

const ENDPOINTS = [
  "/api/public/residents",
  "/api/public/care-reports",
  "/api/public/vitals",
  "/api/public/medication",
  "/api/public/handover",
];

export function seedIfEmpty(store: Store): void {
  if (store.apiKeys.size > 0) return;

  const keys: ApiKey[] = [
    {
      id: "ak_kis_hietzing",
      tenantId: TENANT,
      label: "KIS Pflegezentrum Hietzing",
      key: "sk_live_hietzing_a8f3",
      planId: "pro",
      createdAt: Date.now() - 45 * 86_400_000,
      lastUsedAt: Date.now() - 3_600_000,
      revoked: false,
      createdBy: "admin",
    },
    {
      id: "ak_apotheke",
      tenantId: TENANT,
      label: "Apotheke Zur Linde (Medikation)",
      key: "sk_live_apotheke_c91b",
      planId: "starter",
      createdAt: Date.now() - 30 * 86_400_000,
      lastUsedAt: Date.now() - 900_000,
      revoked: false,
      createdBy: "admin",
    },
    {
      id: "ak_hausarzt",
      tenantId: TENANT,
      label: "Dr. Huber Hausarztpraxis",
      key: "sk_live_huber_d4e2",
      planId: "free",
      createdAt: Date.now() - 14 * 86_400_000,
      lastUsedAt: Date.now() - 21_600_000,
      revoked: false,
      createdBy: "admin",
    },
    {
      id: "ak_mdk",
      tenantId: TENANT,
      label: "MDK-Reporting",
      key: "sk_live_mdk_9b7a",
      planId: "enterprise",
      createdAt: Date.now() - 90 * 86_400_000,
      lastUsedAt: Date.now() - 7_200_000,
      revoked: false,
      createdBy: "admin",
    },
    {
      id: "ak_dev_sandbox",
      tenantId: TENANT,
      label: "Dev Sandbox (revoked)",
      key: "sk_live_dev_11aa",
      planId: "free",
      createdAt: Date.now() - 120 * 86_400_000,
      lastUsedAt: Date.now() - 60 * 86_400_000,
      revoked: true,
      createdBy: "admin",
    },
  ];
  for (const k of keys) store.apiKeys.set(k.id, k);

  // 30 Tage Usage + Events
  const now = Date.now();
  for (const k of keys) {
    if (k.revoked) continue;
    const base =
      k.planId === "enterprise" ? 120_000 :
      k.planId === "pro" ? 18_000 :
      k.planId === "starter" ? 1_500 :
      30;
    for (let d = 29; d >= 0; d--) {
      const ts = now - d * 86_400_000;
      const day = new Date(ts).toISOString().slice(0, 10);
      const wiggle = 0.7 + Math.random() * 0.6;
      const count = Math.round(base * wiggle);
      const errors = Math.round(count * 0.01);
      store.buckets.set(`${k.id}|${day}`, {
        apiKeyId: k.id,
        day,
        count,
        bytes: count * 820,
        errors,
      });
    }
    // paar letzte Events
    for (let i = 0; i < 8; i++) {
      const ts = now - i * 300_000;
      const ep = ENDPOINTS[i % ENDPOINTS.length];
      const status = Math.random() > 0.95 ? 500 : 200;
      store.events.push({
        id: `me_seed_${k.id}_${i}`,
        apiKeyId: k.id,
        tenantId: TENANT,
        endpoint: ep,
        method: i % 3 === 0 ? "POST" : "GET",
        statusCode: status,
        latencyMs: 40 + Math.round(Math.random() * 180),
        timestamp: ts,
        meter: "api.request",
        value: 1,
        unit: "request",
      });
    }
  }

  // Mock Invoice (letzter Monat)
  const prev = new Date();
  prev.setMonth(prev.getMonth() - 1);
  const ym = prev.toISOString().slice(0, 7);
  const inv: Invoice = {
    id: "inv_2026_03_hietzing",
    tenantId: TENANT,
    apiKeyId: "ak_kis_hietzing",
    periodStart: `${ym}-01`,
    periodEnd: `${ym}-31`,
    planId: "pro",
    includedRequests: 500_000,
    usedRequests: 542_180,
    overageRequests: 42_180,
    baseFeeEUR: 249,
    overageFeeEUR: 50.62,
    totalEUR: 299.62,
    status: "paid",
    issuedAt: prev.getTime(),
  };
  store.invoices.set(inv.id, inv);
}
