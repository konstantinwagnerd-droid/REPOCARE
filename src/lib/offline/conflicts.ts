// CareAI Offline — Conflict Detection & Resolution
// Server responses carry `_version`. When we attempt to sync a mutation whose
// `baseVersion` is older than the current server version, we get HTTP 409.
// The user decides: keep-mine | take-server | merge-both.

import type { OutboxEntry } from "./db";

export type ConflictChoice = "keep-mine" | "take-server" | "merge-both";

export interface ConflictContext {
  entry: OutboxEntry;
  serverVersion: number;
  serverSnapshot: Record<string, unknown>;
  clientSnapshot: Record<string, unknown>;
}

export function hasVersionConflict(entry: OutboxEntry, serverVersion: number | undefined): boolean {
  if (typeof entry.baseVersion !== "number") return false;
  if (typeof serverVersion !== "number") return false;
  return serverVersion > entry.baseVersion;
}

// Simple last-write-wins merge with a "conflict" flag the UI can surface.
export function mergeLastWriteWins(
  client: Record<string, unknown>,
  server: Record<string, unknown>,
): Record<string, unknown> {
  return { ...server, ...client, _conflictual: true, _mergedAt: new Date().toISOString() };
}

export function resolve(
  ctx: ConflictContext,
  choice: ConflictChoice,
): Record<string, unknown> {
  switch (choice) {
    case "keep-mine":
      return { ...ctx.clientSnapshot, _conflictual: true };
    case "take-server":
      return { ...ctx.serverSnapshot };
    case "merge-both":
      return mergeLastWriteWins(ctx.clientSnapshot, ctx.serverSnapshot);
  }
}

// --- A lightweight pub/sub so a global dialog can react to conflicts -------

type Listener = (ctx: ConflictContext) => void;
const listeners = new Set<Listener>();

export function onConflict(listener: Listener): () => void {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}

export function emitConflict(ctx: ConflictContext): void {
  for (const l of listeners) {
    try { l(ctx); } catch { /* isolate listener errors */ }
  }
}
