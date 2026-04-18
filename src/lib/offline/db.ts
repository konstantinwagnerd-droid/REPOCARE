// CareAI Offline — IndexedDB Wrapper
// Stores: outbox (pending mutations), cache (GET responses), drafts (autosaves)
// SSR-safe: IndexedDB is only accessed lazily in the browser.
// Fallback: when IndexedDB is unavailable (private mode, SSR), an in-memory
// Map is used so unit tests and server render do not crash.

import { z } from "zod";

const DB_NAME = "careai-offline";
const DB_VERSION = 2;

export const STORE_OUTBOX = "outbox";
export const STORE_CACHE = "cache";
export const STORE_DRAFTS = "drafts";

// ---------- Zod schemas ----------------------------------------------------

export const MutationKindSchema = z.enum(["create", "update", "delete"]);
export type MutationKind = z.infer<typeof MutationKindSchema>;

export const MutationTypeSchema = z.enum([
  "care-report",
  "measure-done",
  "vital",
  "medication-administered",
  "wound-observation",
  "incident",
]);
export type MutationType = z.infer<typeof MutationTypeSchema>;

export const OutboxEntrySchema = z.object({
  id: z.string(),
  type: MutationTypeSchema,
  kind: MutationKindSchema.default("create"),
  resource: z.string(), // e.g. "berichte", "vitalwerte"
  endpoint: z.string(), // e.g. "/api/care-reports"
  method: z.enum(["POST", "PUT", "PATCH", "DELETE"]).default("POST"),
  payload: z.record(z.unknown()),
  baseVersion: z.number().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  retries: z.number().default(0),
  nextAttemptAt: z.string().optional(),
  status: z.enum(["pending", "syncing", "failed", "conflict"]).default("pending"),
  lastError: z.string().optional(),
  conflictSnapshot: z.record(z.unknown()).optional(),
});
export type OutboxEntry = z.infer<typeof OutboxEntrySchema>;

export const CacheEntrySchema = z.object({
  key: z.string(), // URL
  body: z.unknown(),
  etag: z.string().optional(),
  version: z.number().optional(),
  cachedAt: z.string(),
});
export type CacheEntry = z.infer<typeof CacheEntrySchema>;

export const DraftEntrySchema = z.object({
  key: z.string(), // e.g. "care-report:bewohner-42"
  type: MutationTypeSchema,
  payload: z.record(z.unknown()),
  updatedAt: z.string(),
});
export type DraftEntry = z.infer<typeof DraftEntrySchema>;

// ---------- In-memory fallback --------------------------------------------

type Mem = { [store: string]: Map<string, unknown> };
let mem: Mem | null = null;
function getMem(): Mem {
  if (!mem) mem = { [STORE_OUTBOX]: new Map(), [STORE_CACHE]: new Map(), [STORE_DRAFTS]: new Map() };
  return mem;
}

function hasIDB(): boolean {
  return typeof indexedDB !== "undefined";
}

// ---------- IDB plumbing --------------------------------------------------

let dbPromise: Promise<IDBDatabase> | null = null;

function openDB(): Promise<IDBDatabase> {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise<IDBDatabase>((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_OUTBOX)) db.createObjectStore(STORE_OUTBOX, { keyPath: "id" });
      if (!db.objectStoreNames.contains(STORE_CACHE)) db.createObjectStore(STORE_CACHE, { keyPath: "key" });
      if (!db.objectStoreNames.contains(STORE_DRAFTS)) db.createObjectStore(STORE_DRAFTS, { keyPath: "key" });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
  return dbPromise;
}

async function tx<T>(
  store: string,
  mode: IDBTransactionMode,
  fn: (s: IDBObjectStore) => IDBRequest<T> | void,
): Promise<T | undefined> {
  const db = await openDB();
  return new Promise<T | undefined>((resolve, reject) => {
    const t = db.transaction(store, mode);
    const s = t.objectStore(store);
    const r = fn(s);
    if (r === undefined) {
      t.oncomplete = () => resolve(undefined);
      t.onerror = () => reject(t.error);
      return;
    }
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}

// ---------- Outbox --------------------------------------------------------

export async function outboxPut(entry: OutboxEntry): Promise<void> {
  const parsed = OutboxEntrySchema.parse(entry);
  if (!hasIDB()) { getMem()[STORE_OUTBOX].set(parsed.id, parsed); return; }
  await tx(STORE_OUTBOX, "readwrite", (s) => s.put(parsed));
}

export async function outboxDelete(id: string): Promise<void> {
  if (!hasIDB()) { getMem()[STORE_OUTBOX].delete(id); return; }
  await tx(STORE_OUTBOX, "readwrite", (s) => s.delete(id));
}

export async function outboxAll(): Promise<OutboxEntry[]> {
  if (!hasIDB()) return Array.from(getMem()[STORE_OUTBOX].values()) as OutboxEntry[];
  const db = await openDB();
  return new Promise<OutboxEntry[]>((resolve, reject) => {
    const t = db.transaction(STORE_OUTBOX, "readonly");
    const req = t.objectStore(STORE_OUTBOX).getAll();
    req.onsuccess = () => resolve((req.result as OutboxEntry[]) ?? []);
    req.onerror = () => reject(req.error);
  });
}

export async function outboxCount(): Promise<number> {
  if (!hasIDB()) return getMem()[STORE_OUTBOX].size;
  const db = await openDB();
  return new Promise<number>((resolve, reject) => {
    const req = db.transaction(STORE_OUTBOX, "readonly").objectStore(STORE_OUTBOX).count();
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

// ---------- Cache (GET responses) -----------------------------------------

export async function cachePut(entry: CacheEntry): Promise<void> {
  const parsed = CacheEntrySchema.parse(entry);
  if (!hasIDB()) { getMem()[STORE_CACHE].set(parsed.key, parsed); return; }
  await tx(STORE_CACHE, "readwrite", (s) => s.put(parsed));
}

export async function cacheGet(key: string): Promise<CacheEntry | undefined> {
  if (!hasIDB()) return getMem()[STORE_CACHE].get(key) as CacheEntry | undefined;
  return tx<CacheEntry>(STORE_CACHE, "readonly", (s) => s.get(key) as IDBRequest<CacheEntry>);
}

// ---------- Drafts --------------------------------------------------------

export async function draftPut(entry: DraftEntry): Promise<void> {
  const parsed = DraftEntrySchema.parse(entry);
  if (!hasIDB()) { getMem()[STORE_DRAFTS].set(parsed.key, parsed); return; }
  await tx(STORE_DRAFTS, "readwrite", (s) => s.put(parsed));
}

export async function draftGet(key: string): Promise<DraftEntry | undefined> {
  if (!hasIDB()) return getMem()[STORE_DRAFTS].get(key) as DraftEntry | undefined;
  return tx<DraftEntry>(STORE_DRAFTS, "readonly", (s) => s.get(key) as IDBRequest<DraftEntry>);
}

export async function draftDelete(key: string): Promise<void> {
  if (!hasIDB()) { getMem()[STORE_DRAFTS].delete(key); return; }
  await tx(STORE_DRAFTS, "readwrite", (s) => s.delete(key));
}

// ---------- Utils ---------------------------------------------------------

export function uid(prefix = "op"): string {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 10)}`;
}
