// Offline-Sync — Typen.

export type SyncStatus = "online" | "offline" | "syncing" | "error";

export type OperationKind = "create" | "update" | "delete";

export interface SyncOperation {
  id: string;          // ULID/UUID Client-Side
  resource: string;    // z.B. "berichte", "vitalwerte"
  kind: OperationKind;
  payload: Record<string, unknown>;
  baseVersion?: string;
  createdAt: string;
  retries: number;
  lastError?: string;
}

export type ConflictStrategy = "client-wins" | "server-wins" | "manual";

export interface ConflictResolution {
  operationId: string;
  strategy: ConflictStrategy;
  resolvedAt: string;
}

export interface SyncReport {
  pushed: number;
  failed: number;
  conflicts: number;
  durationMs: number;
}
