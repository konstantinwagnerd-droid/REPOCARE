/**
 * Offline-Queue (Outbox-Pattern).
 * Mutations werden bei fehlender Verbindung persistiert und
 * beim nächsten Online-Event sequenziell gesendet.
 */
import { queueStorage } from './storage';

const QUEUE_KEY = 'outbox.queue';

export type QueueItem = {
  id: string;
  method: string;
  path: string;
  body?: string;
  createdAt: number;
  retries: number;
  lastError?: string;
};

function read(): QueueItem[] {
  const raw = queueStorage.getString(QUEUE_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as QueueItem[];
  } catch {
    return [];
  }
}

function write(items: QueueItem[]) {
  queueStorage.set(QUEUE_KEY, JSON.stringify(items));
}

export function enqueue(item: Omit<QueueItem, 'id' | 'createdAt' | 'retries'>): QueueItem {
  const items = read();
  const newItem: QueueItem = {
    ...item,
    id: `q_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: Date.now(),
    retries: 0,
  };
  items.push(newItem);
  write(items);
  return newItem;
}

export function list(): QueueItem[] {
  return read();
}

export function remove(id: string) {
  write(read().filter((i) => i.id !== id));
}

export function size(): number {
  return read().length;
}

export function clear() {
  queueStorage.delete(QUEUE_KEY);
}

/**
 * Versucht alle Items sequenziell zu senden. Stopp bei Netz-Fehler.
 * Wird durch den OfflineBanner / NetInfo-Listener ausgelöst.
 */
export async function flush(fetcher: (i: QueueItem) => Promise<void>): Promise<{
  sent: number;
  failed: number;
}> {
  const items = read();
  let sent = 0;
  let failed = 0;
  for (const item of items) {
    try {
      await fetcher(item);
      remove(item.id);
      sent++;
    } catch (err) {
      failed++;
      const all = read();
      const idx = all.findIndex((i) => i.id === item.id);
      if (idx >= 0) {
        const target = all[idx]!;
        target.retries = (target.retries ?? 0) + 1;
        target.lastError = err instanceof Error ? err.message : String(err);
        all[idx] = target;
        write(all);
      }
      break;
    }
  }
  return { sent, failed };
}
