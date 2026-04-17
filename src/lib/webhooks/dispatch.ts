import { randomUUID } from "crypto";
import type { Webhook, WebhookEvent, WebhookPayload, DeliveryLog } from "./types";
import { sign } from "./signature";
import { appendLog, updateLog } from "./logger";

const TIMEOUT_MS = 10_000;
const MAX_ATTEMPTS = 5;

function backoffMs(attempt: number): number {
  // exponential: 5s, 15s, 45s, 2.25min, 6.75min
  return Math.min(5_000 * Math.pow(3, attempt - 1), 30 * 60_000);
}

export async function dispatch<T>(
  webhook: Webhook,
  event: WebhookEvent,
  data: T,
): Promise<DeliveryLog> {
  const payload: WebhookPayload<T> = {
    id: randomUUID(),
    event,
    createdAt: new Date().toISOString(),
    tenantId: webhook.tenantId,
    data,
  };
  const log: DeliveryLog = {
    id: randomUUID(),
    webhookId: webhook.id,
    event,
    url: webhook.url,
    payload,
    status: "pending",
    statusCode: null,
    responseBody: null,
    attemptCount: 0,
    durationMs: 0,
    error: null,
    createdAt: new Date(),
    nextRetryAt: null,
  };
  appendLog(log);
  void deliverWithRetry(webhook, log);
  return log;
}

async function deliverWithRetry(webhook: Webhook, log: DeliveryLog): Promise<void> {
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    updateLog(log.id, { attemptCount: attempt, status: attempt === 1 ? "pending" : "retrying" });
    const start = Date.now();
    try {
      const body = JSON.stringify(log.payload);
      const ts = Math.floor(Date.now() / 1000);
      const signature = sign(webhook.secret, ts, body);
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
      const res = await fetch(webhook.url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": "CareAI-Webhooks/1.0",
          "X-CareAI-Signature": signature,
          "X-CareAI-Event": log.event,
          "X-CareAI-Delivery-Id": log.id,
          ...webhook.headers,
        },
        body,
        signal: ctrl.signal,
      });
      clearTimeout(timer);
      const text = await res.text().catch(() => "");
      const durationMs = Date.now() - start;
      if (res.ok) {
        updateLog(log.id, {
          status: "success",
          statusCode: res.status,
          responseBody: text.slice(0, 500),
          durationMs,
          error: null,
          nextRetryAt: null,
        });
        return;
      }
      updateLog(log.id, {
        statusCode: res.status,
        responseBody: text.slice(0, 500),
        durationMs,
        error: `HTTP ${res.status}`,
      });
    } catch (err) {
      const durationMs = Date.now() - start;
      updateLog(log.id, {
        durationMs,
        error: err instanceof Error ? err.message : String(err),
      });
    }
    if (attempt < MAX_ATTEMPTS) {
      const waitMs = backoffMs(attempt);
      updateLog(log.id, { nextRetryAt: new Date(Date.now() + waitMs) });
      await new Promise((r) => setTimeout(r, waitMs));
    }
  }
  updateLog(log.id, { status: "failed", nextRetryAt: null });
}

export async function redispatch(webhook: Webhook, log: DeliveryLog): Promise<DeliveryLog> {
  return dispatch(webhook, log.event, (log.payload as WebhookPayload).data);
}
