// Background-Sync. Auf reconnect: arbeitet die Outbox ab.
// Konflikt-Auflösung default "client-wins", konfigurierbar.

import { outboxAdd, outboxList, outboxRemove } from "./indexed-db";
import type { ConflictStrategy, OperationKind, SyncOperation, SyncReport } from "./types";

export interface PushOptions {
  endpoint?: string;
  conflictStrategy?: ConflictStrategy;
  signal?: AbortSignal;
}

function uid(): string {
  return `op_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export async function enqueue(input: { resource: string; kind: OperationKind; payload: Record<string, unknown>; baseVersion?: string }): Promise<SyncOperation> {
  const op: SyncOperation = {
    id: uid(),
    resource: input.resource,
    kind: input.kind,
    payload: input.payload,
    baseVersion: input.baseVersion,
    createdAt: new Date().toISOString(),
    retries: 0,
  };
  await outboxAdd(op);
  return op;
}

export async function getOutbox(): Promise<SyncOperation[]> {
  return await outboxList<SyncOperation>();
}

// Pusht alle Operationen sequentiell. Bei 409 (Conflict) wird die Strategie angewandt.
export async function pushAll(opts: PushOptions = {}): Promise<SyncReport> {
  const start = Date.now();
  const ops = await getOutbox();
  let pushed = 0, failed = 0, conflicts = 0;
  const endpoint = opts.endpoint ?? "/api/sync";
  const strategy = opts.conflictStrategy ?? "client-wins";

  for (const op of ops) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json", "x-sync-strategy": strategy },
        body: JSON.stringify(op),
        signal: opts.signal,
      });
      if (res.status === 409) {
        conflicts++;
        if (strategy === "server-wins") { await outboxRemove(op.id); continue; }
        if (strategy === "client-wins") {
          const force = await fetch(endpoint, {
            method: "POST",
            headers: { "content-type": "application/json", "x-sync-force": "1" },
            body: JSON.stringify(op),
            signal: opts.signal,
          });
          if (force.ok) { await outboxRemove(op.id); pushed++; continue; }
        }
        op.retries++; op.lastError = "Conflict, manual resolution required";
        await outboxAdd(op);
      } else if (res.ok) {
        await outboxRemove(op.id);
        pushed++;
      } else {
        failed++;
        op.retries++; op.lastError = `HTTP ${res.status}`;
        await outboxAdd(op);
      }
    } catch (e) {
      failed++;
      op.retries++; op.lastError = e instanceof Error ? e.message : "Network error";
      await outboxAdd(op);
    }
  }
  return { pushed, failed, conflicts, durationMs: Date.now() - start };
}

export function startAutoSync(opts: PushOptions = {}): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = () => { void pushAll(opts); };
  window.addEventListener("online", handler);
  return () => window.removeEventListener("online", handler);
}
