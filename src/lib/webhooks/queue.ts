import { randomUUID } from "crypto";
import type { Webhook, WebhookEvent, DeliveryLog } from "./types";
import { generateSecret } from "./signature";
import { dispatch } from "./dispatch";
import { appendLog } from "./logger";

const webhooks: Map<string, Webhook> = new Map();

function seed() {
  if (webhooks.size > 0) return;
  const now = new Date();
  const demos: Webhook[] = [
    {
      id: "wh_demo_kis",
      tenantId: "demo",
      name: "Krankenhaus-Informationssystem (KIS)",
      url: "https://kis.hietzing.example.at/api/careai/events",
      secret: generateSecret(),
      events: ["resident.admitted", "resident.discharged", "incident.reported"],
      headers: { "X-Tenant": "hietzing" },
      status: "disabled",
      createdAt: new Date(now.getTime() - 14 * 24 * 3600_000),
      lastDeliveryAt: new Date(now.getTime() - 2 * 3600_000),
      successCount: 128,
      failureCount: 3,
    },
    {
      id: "wh_demo_insurance",
      tenantId: "demo",
      name: "Versicherungs-Portal (ÖGK)",
      url: "https://portal.oegk.example.at/webhooks/careai",
      secret: generateSecret(),
      events: ["report.signed", "medication.administered"],
      headers: {},
      status: "disabled",
      createdAt: new Date(now.getTime() - 30 * 24 * 3600_000),
      lastDeliveryAt: new Date(now.getTime() - 26 * 3600_000),
      successCount: 412,
      failureCount: 0,
    },
    {
      id: "wh_demo_time",
      tenantId: "demo",
      name: "Zeit-Erfassung (Personio)",
      url: "https://api.personio.de/webhooks/shift-handover",
      secret: generateSecret(),
      events: ["handover.completed", "user.created"],
      headers: {},
      status: "disabled",
      createdAt: new Date(now.getTime() - 7 * 24 * 3600_000),
      lastDeliveryAt: new Date(now.getTime() - 45 * 60_000),
      successCount: 58,
      failureCount: 1,
    },
  ];
  demos.forEach((w) => webhooks.set(w.id, w));
  // seed delivery logs
  const sampleEvents: WebhookEvent[] = [
    "resident.admitted", "report.signed", "incident.reported", "medication.administered",
    "handover.completed", "vital.recorded", "wound.updated", "user.created",
  ];
  for (let i = 0; i < 20; i++) {
    const wh = demos[i % demos.length];
    const ev = sampleEvents[i % sampleEvents.length];
    const ok = i % 7 !== 3;
    const log: DeliveryLog = {
      id: randomUUID(),
      webhookId: wh.id,
      event: ev,
      url: wh.url,
      payload: { id: randomUUID(), event: ev, createdAt: new Date().toISOString(), tenantId: "demo", data: { sample: true } },
      status: ok ? "success" : "failed",
      statusCode: ok ? 200 : 502,
      responseBody: ok ? '{"ok":true}' : "Bad Gateway",
      attemptCount: ok ? 1 : 5,
      durationMs: 120 + (i * 23) % 600,
      error: ok ? null : "HTTP 502",
      createdAt: new Date(now.getTime() - i * 47 * 60_000),
      nextRetryAt: null,
    };
    appendLog(log);
  }
}

export function listWebhooks(tenantId: string): Webhook[] {
  seed();
  return [...webhooks.values()].filter((w) => w.tenantId === tenantId);
}

export function getWebhook(id: string): Webhook | undefined {
  seed();
  return webhooks.get(id);
}

export function createWebhook(input: {
  tenantId: string;
  name: string;
  url: string;
  events: WebhookEvent[];
  headers?: Record<string, string>;
}): Webhook {
  seed();
  const wh: Webhook = {
    id: `wh_${randomUUID().slice(0, 12)}`,
    tenantId: input.tenantId,
    name: input.name,
    url: input.url,
    secret: generateSecret(),
    events: input.events,
    headers: input.headers ?? {},
    status: "active",
    createdAt: new Date(),
    lastDeliveryAt: null,
    successCount: 0,
    failureCount: 0,
  };
  webhooks.set(wh.id, wh);
  return wh;
}

export function updateWebhook(id: string, patch: Partial<Webhook>): Webhook | undefined {
  const wh = webhooks.get(id);
  if (!wh) return undefined;
  const next = { ...wh, ...patch };
  webhooks.set(id, next);
  return next;
}

export function deleteWebhook(id: string): boolean {
  return webhooks.delete(id);
}

export async function emit(tenantId: string, event: WebhookEvent, data: unknown): Promise<void> {
  seed();
  const targets = [...webhooks.values()].filter(
    (w) => w.tenantId === tenantId && w.status === "active" && w.events.includes(event),
  );
  await Promise.all(targets.map((w) => dispatch(w, event, data)));
}
