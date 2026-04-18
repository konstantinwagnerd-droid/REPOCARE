// CareAI Offline — Sync Engine
// - enqueueMutation(): store a pending op in the outbox (fire-and-forget)
// - flushQueue(): push the outbox to the server, honoring exponential backoff
// - Auto-flush on `online` event
// - Exp. backoff: 1s, 5s, 25s, 125s … up to 10 retries before "failed"

import {
  outboxAll,
  outboxPut,
  outboxDelete,
  type OutboxEntry,
  type MutationType,
  type MutationKind,
  uid,
} from "./db";
import { emitConflict, hasVersionConflict } from "./conflicts";

const MAX_RETRIES = 10;
const BACKOFF_BASE_MS = 1000;
const SYNC_ENDPOINT = "/api/sync";

// ---------- Enqueue -------------------------------------------------------

export interface EnqueueInput {
  type: MutationType;
  kind?: MutationKind;
  resource: string;
  endpoint: string;
  method?: "POST" | "PUT" | "PATCH" | "DELETE";
  payload: Record<string, unknown>;
  baseVersion?: number;
}

export async function enqueueMutation(input: EnqueueInput): Promise<OutboxEntry> {
  const now = new Date().toISOString();
  const entry: OutboxEntry = {
    id: uid("mut"),
    type: input.type,
    kind: input.kind ?? "create",
    resource: input.resource,
    endpoint: input.endpoint,
    method: input.method ?? "POST",
    payload: input.payload,
    baseVersion: input.baseVersion,
    createdAt: now,
    updatedAt: now,
    retries: 0,
    status: "pending",
  };
  await outboxPut(entry);
  notifyQueueChanged();
  return entry;
}

export async function getPendingCount(): Promise<number> {
  const all = await outboxAll();
  return all.filter((e) => e.status !== "failed").length;
}

export async function getFailedOps(): Promise<OutboxEntry[]> {
  const all = await outboxAll();
  return all.filter((e) => e.status === "failed");
}

// ---------- Queue-change pub/sub -----------------------------------------

type QueueListener = () => void;
const queueListeners = new Set<QueueListener>();
export function onQueueChanged(cb: QueueListener): () => void {
  queueListeners.add(cb);
  return () => { queueListeners.delete(cb); };
}
function notifyQueueChanged() { for (const l of queueListeners) { try { l(); } catch { /**/ } } }

// ---------- Flush ---------------------------------------------------------

export interface FlushResult {
  pushed: number;
  failed: number;
  conflicts: number;
  skipped: number;
  durationMs: number;
}

function backoffMs(retries: number): number {
  // 1s * 5^retries → 1, 5, 25, 125, 625, 3125, ...
  return BACKOFF_BASE_MS * Math.pow(5, Math.min(retries, 5));
}

function isDue(entry: OutboxEntry, now: number): boolean {
  if (!entry.nextAttemptAt) return true;
  return new Date(entry.nextAttemptAt).getTime() <= now;
}

export async function flushQueue(): Promise<FlushResult> {
  const start = Date.now();
  const now = start;
  const all = await outboxAll();
  const due = all.filter((e) => e.status !== "failed" && e.status !== "conflict" && isDue(e, now));

  if (due.length === 0) {
    return { pushed: 0, failed: 0, conflicts: 0, skipped: all.length, durationMs: 0 };
  }

  // Mark as syncing
  for (const e of due) {
    await outboxPut({ ...e, status: "syncing" });
  }

  let pushed = 0, failed = 0, conflicts = 0;

  // Batch POST to /api/sync with { ops: [...] }
  try {
    const res = await fetch(SYNC_ENDPOINT, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ops: due.map((e) => ({
          id: e.id,
          resource: e.resource,
          kind: e.kind,
          payload: e.payload,
          baseVersion: e.baseVersion?.toString(),
          createdAt: e.createdAt,
        })),
      }),
    });

    if (!res.ok) {
      // Network-level or server error: backoff all
      for (const e of due) {
        const retries = e.retries + 1;
        if (retries >= MAX_RETRIES) {
          await outboxPut({ ...e, status: "failed", retries, lastError: `HTTP ${res.status}`, updatedAt: new Date().toISOString() });
          failed++;
        } else {
          await outboxPut({
            ...e,
            status: "pending",
            retries,
            lastError: `HTTP ${res.status}`,
            nextAttemptAt: new Date(now + backoffMs(retries)).toISOString(),
            updatedAt: new Date().toISOString(),
          });
          failed++;
        }
      }
    } else {
      const data = (await res.json()) as {
        applied: Array<{ id: string; status: string }>;
        conflicts: Array<{ id: string; reason: string; serverVersion?: number; serverSnapshot?: Record<string, unknown> }>;
      };

      const appliedIds = new Set(data.applied.map((a) => a.id));
      for (const e of due) {
        if (appliedIds.has(e.id)) {
          await outboxDelete(e.id);
          pushed++;
        }
      }
      for (const c of data.conflicts) {
        const entry = due.find((e) => e.id === c.id);
        if (!entry) continue;
        if (hasVersionConflict(entry, c.serverVersion)) {
          await outboxPut({
            ...entry,
            status: "conflict",
            lastError: c.reason,
            conflictSnapshot: c.serverSnapshot,
            updatedAt: new Date().toISOString(),
          });
          emitConflict({
            entry,
            serverVersion: c.serverVersion ?? 0,
            serverSnapshot: c.serverSnapshot ?? {},
            clientSnapshot: entry.payload,
          });
          conflicts++;
        } else {
          // server rejected for another reason (validation etc.) — give up
          const retries = entry.retries + 1;
          if (retries >= MAX_RETRIES) {
            await outboxPut({ ...entry, status: "failed", retries, lastError: c.reason, updatedAt: new Date().toISOString() });
            failed++;
          } else {
            await outboxPut({
              ...entry,
              status: "pending",
              retries,
              lastError: c.reason,
              nextAttemptAt: new Date(now + backoffMs(retries)).toISOString(),
              updatedAt: new Date().toISOString(),
            });
            failed++;
          }
        }
      }
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "network-error";
    for (const e of due) {
      const retries = e.retries + 1;
      if (retries >= MAX_RETRIES) {
        await outboxPut({ ...e, status: "failed", retries, lastError: msg, updatedAt: new Date().toISOString() });
        failed++;
      } else {
        await outboxPut({
          ...e,
          status: "pending",
          retries,
          lastError: msg,
          nextAttemptAt: new Date(now + backoffMs(retries)).toISOString(),
          updatedAt: new Date().toISOString(),
        });
        failed++;
      }
    }
  }

  notifyQueueChanged();
  return { pushed, failed, conflicts, skipped: all.length - due.length, durationMs: Date.now() - start };
}

// ---------- Retry of failed items ----------------------------------------

export async function retryFailed(): Promise<number> {
  const all = await outboxAll();
  let count = 0;
  for (const e of all) {
    if (e.status === "failed" || e.status === "conflict") {
      await outboxPut({ ...e, status: "pending", retries: 0, nextAttemptAt: undefined, updatedAt: new Date().toISOString() });
      count++;
    }
  }
  notifyQueueChanged();
  return count;
}

// ---------- Auto-sync on online event ------------------------------------

let autoSyncStarted = false;
export function startAutoSync(): () => void {
  if (typeof window === "undefined") return () => {};
  if (autoSyncStarted) return () => {};
  autoSyncStarted = true;
  const handler = () => { void flushQueue(); };
  window.addEventListener("online", handler);
  // Periodic retry while online, to pick up backoff-scheduled ops
  const interval = window.setInterval(() => {
    if (navigator.onLine) void flushQueue();
  }, 10_000);
  return () => {
    window.removeEventListener("online", handler);
    window.clearInterval(interval);
    autoSyncStarted = false;
  };
}
