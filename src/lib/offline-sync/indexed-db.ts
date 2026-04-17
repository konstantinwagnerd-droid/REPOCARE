// Schmaler IndexedDB-Wrapper als Key/Value-Store + Outbox.
// Falls IndexedDB nicht verfuegbar (SSR oder Privatmodus), fallback auf in-memory Map.

const DB_NAME = "careai-offline";
const DB_VERSION = 1;
const STORE_KV = "kv";
const STORE_OUTBOX = "outbox";

let memFallback: { kv: Map<string, unknown>; outbox: Map<string, unknown> } | null = null;
function getMem() {
  if (!memFallback) memFallback = { kv: new Map(), outbox: new Map() };
  return memFallback;
}

function hasIDB(): boolean {
  return typeof indexedDB !== "undefined";
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_KV)) db.createObjectStore(STORE_KV);
      if (!db.objectStoreNames.contains(STORE_OUTBOX)) db.createObjectStore(STORE_OUTBOX);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function withStore<T>(name: string, mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T> | Promise<T>): Promise<T> {
  const db = await openDB();
  return new Promise<T>((resolve, reject) => {
    const tx = db.transaction(name, mode);
    const store = tx.objectStore(name);
    const r = fn(store);
    if (r instanceof Promise) {
      r.then(resolve, reject);
    } else {
      r.onsuccess = () => resolve(r.result);
      r.onerror = () => reject(r.error);
    }
  });
}

// ---- KV Store -------------------------------------------------------------
export async function kvGet<T = unknown>(key: string): Promise<T | undefined> {
  if (!hasIDB()) return getMem().kv.get(key) as T | undefined;
  return withStore<T | undefined>(STORE_KV, "readonly", (s) => s.get(key) as IDBRequest<T | undefined>);
}
export async function kvSet<T>(key: string, value: T): Promise<void> {
  if (!hasIDB()) { getMem().kv.set(key, value); return; }
  await withStore(STORE_KV, "readwrite", (s) => s.put(value as unknown as object, key));
}
export async function kvDelete(key: string): Promise<void> {
  if (!hasIDB()) { getMem().kv.delete(key); return; }
  await withStore(STORE_KV, "readwrite", (s) => s.delete(key));
}

// ---- Outbox --------------------------------------------------------------
export async function outboxAdd<T extends { id: string }>(op: T): Promise<void> {
  if (!hasIDB()) { getMem().outbox.set(op.id, op); return; }
  await withStore(STORE_OUTBOX, "readwrite", (s) => s.put(op as unknown as object, op.id));
}
export async function outboxRemove(id: string): Promise<void> {
  if (!hasIDB()) { getMem().outbox.delete(id); return; }
  await withStore(STORE_OUTBOX, "readwrite", (s) => s.delete(id));
}
export async function outboxList<T = unknown>(): Promise<T[]> {
  if (!hasIDB()) return Array.from(getMem().outbox.values()) as T[];
  return new Promise<T[]>((resolve, reject) => {
    openDB().then((db) => {
      const tx = db.transaction(STORE_OUTBOX, "readonly");
      const store = tx.objectStore(STORE_OUTBOX);
      const out: T[] = [];
      const cursor = store.openCursor();
      cursor.onsuccess = () => {
        const c = cursor.result;
        if (c) { out.push(c.value as T); c.continue(); } else { resolve(out); }
      };
      cursor.onerror = () => reject(cursor.error);
    }).catch(reject);
  });
}
