import type { ApiKey, Invoice, MeterEvent, PlanTier, UsageBucket } from "./types";
import { PLANS } from "./plans";
import { seedIfEmpty } from "./seed";

// In-Memory Store (Mock für Demo). Persistenz über tenantId-Key.
type Store = {
  apiKeys: Map<string, ApiKey>;
  events: MeterEvent[];
  buckets: Map<string, UsageBucket>; // key = apiKeyId|day
  invoices: Map<string, Invoice>;
  rateWindows: Map<string, number[]>; // apiKeyId -> list of timestamps (last 60s)
};

const globalAny = globalThis as unknown as { __careai_billing_store?: Store };

function getStore(): Store {
  if (!globalAny.__careai_billing_store) {
    globalAny.__careai_billing_store = {
      apiKeys: new Map(),
      events: [],
      buckets: new Map(),
      invoices: new Map(),
      rateWindows: new Map(),
    };
    seedIfEmpty(globalAny.__careai_billing_store);
  }
  return globalAny.__careai_billing_store;
}

function dayKey(ts: number): string {
  const d = new Date(ts);
  return d.toISOString().slice(0, 10);
}

export function listApiKeys(tenantId: string): ApiKey[] {
  const s = getStore();
  return Array.from(s.apiKeys.values())
    .filter((k) => k.tenantId === tenantId)
    .sort((a, b) => b.createdAt - a.createdAt);
}

export function getApiKey(id: string): ApiKey | undefined {
  return getStore().apiKeys.get(id);
}

export function getApiKeyByKey(key: string): ApiKey | undefined {
  const s = getStore();
  for (const k of s.apiKeys.values()) if (k.key === key) return k;
  return undefined;
}

export function createApiKey(input: {
  tenantId: string;
  label: string;
  planId: PlanTier;
  createdBy: string;
}): ApiKey {
  const s = getStore();
  const id = `ak_${Math.random().toString(36).slice(2, 10)}`;
  const key = `sk_live_${Math.random().toString(36).slice(2, 8)}${Math.random().toString(36).slice(2, 10)}`;
  const apiKey: ApiKey = {
    id,
    key,
    tenantId: input.tenantId,
    label: input.label,
    planId: input.planId,
    createdAt: Date.now(),
    lastUsedAt: null,
    revoked: false,
    createdBy: input.createdBy,
  };
  s.apiKeys.set(id, apiKey);
  return apiKey;
}

export function updateApiKeyPlan(id: string, planId: PlanTier): ApiKey | undefined {
  const s = getStore();
  const k = s.apiKeys.get(id);
  if (!k) return undefined;
  k.planId = planId;
  s.apiKeys.set(id, k);
  return k;
}

export function revokeApiKey(id: string): boolean {
  const s = getStore();
  const k = s.apiKeys.get(id);
  if (!k) return false;
  k.revoked = true;
  s.apiKeys.set(id, k);
  return true;
}

export function recordMeterEvent(e: Omit<MeterEvent, "id" | "meter" | "value" | "unit">): MeterEvent {
  const s = getStore();
  const event: MeterEvent = {
    ...e,
    id: `me_${Math.random().toString(36).slice(2, 12)}`,
    meter: "api.request",
    value: 1,
    unit: "request",
  };
  s.events.push(event);
  if (s.events.length > 10_000) s.events.shift();
  const bucketKey = `${e.apiKeyId}|${dayKey(e.timestamp)}`;
  const b = s.buckets.get(bucketKey) ?? {
    apiKeyId: e.apiKeyId,
    day: dayKey(e.timestamp),
    count: 0,
    bytes: 0,
    errors: 0,
  };
  b.count += 1;
  if (e.statusCode >= 400) b.errors += 1;
  s.buckets.set(bucketKey, b);
  const k = s.apiKeys.get(e.apiKeyId);
  if (k) {
    k.lastUsedAt = e.timestamp;
    s.apiKeys.set(e.apiKeyId, k);
  }
  return event;
}

export function getUsageForApiKey(apiKeyId: string, days = 30): UsageBucket[] {
  const s = getStore();
  const cutoff = Date.now() - days * 86_400_000;
  return Array.from(s.buckets.values())
    .filter((b) => b.apiKeyId === apiKeyId && new Date(b.day).getTime() >= cutoff - 86_400_000)
    .sort((a, b) => (a.day < b.day ? -1 : 1));
}

export function getRecentEvents(tenantId: string, limit = 50): MeterEvent[] {
  const s = getStore();
  return s.events
    .filter((e) => e.tenantId === tenantId)
    .slice(-limit)
    .reverse();
}

export function getTenantUsage(tenantId: string, days = 30): UsageBucket[] {
  const s = getStore();
  const keyIds = new Set(
    Array.from(s.apiKeys.values())
      .filter((k) => k.tenantId === tenantId)
      .map((k) => k.id),
  );
  const cutoff = Date.now() - days * 86_400_000;
  return Array.from(s.buckets.values())
    .filter((b) => keyIds.has(b.apiKeyId) && new Date(b.day).getTime() >= cutoff - 86_400_000)
    .sort((a, b) => (a.day < b.day ? -1 : 1));
}

export function listInvoices(tenantId: string): Invoice[] {
  const s = getStore();
  return Array.from(s.invoices.values())
    .filter((i) => i.tenantId === tenantId)
    .sort((a, b) => b.issuedAt - a.issuedAt);
}

export function generateInvoice(apiKeyId: string, periodYm: string): Invoice | undefined {
  const s = getStore();
  const key = s.apiKeys.get(apiKeyId);
  if (!key) return undefined;
  const plan = PLANS[key.planId];
  const buckets = Array.from(s.buckets.values()).filter(
    (b) => b.apiKeyId === apiKeyId && b.day.startsWith(periodYm),
  );
  const used = buckets.reduce((acc, b) => acc + b.count, 0);
  const overage = Math.max(0, used - plan.includedRequests);
  const overageFee = Math.round((overage / 1000) * plan.overagePerThousandEUR * 100) / 100;
  const inv: Invoice = {
    id: `inv_${Math.random().toString(36).slice(2, 10)}`,
    tenantId: key.tenantId,
    apiKeyId,
    periodStart: `${periodYm}-01`,
    periodEnd: `${periodYm}-31`,
    planId: key.planId,
    includedRequests: plan.includedRequests,
    usedRequests: used,
    overageRequests: overage,
    baseFeeEUR: plan.monthlyPriceEUR,
    overageFeeEUR: overageFee,
    totalEUR: Math.round((plan.monthlyPriceEUR + overageFee) * 100) / 100,
    status: "issued",
    issuedAt: Date.now(),
  };
  s.invoices.set(inv.id, inv);
  return inv;
}

export function checkRateLimit(apiKeyId: string, rpm: number): { ok: boolean; remaining: number } {
  const s = getStore();
  const now = Date.now();
  const windowStart = now - 60_000;
  const existing = (s.rateWindows.get(apiKeyId) ?? []).filter((t) => t > windowStart);
  if (existing.length >= rpm) {
    s.rateWindows.set(apiKeyId, existing);
    return { ok: false, remaining: 0 };
  }
  existing.push(now);
  s.rateWindows.set(apiKeyId, existing);
  return { ok: true, remaining: rpm - existing.length };
}
