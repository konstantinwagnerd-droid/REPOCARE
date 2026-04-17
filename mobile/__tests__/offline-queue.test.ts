/**
 * Unit-Test für die Offline-Queue.
 * Läuft gegen einen In-Memory-Mock der MMKV-Storage.
 */
jest.mock('react-native-mmkv', () => {
  const stores = new Map<string, Map<string, string>>();
  class MMKV {
    private store: Map<string, string>;
    constructor(cfg: { id: string }) {
      if (!stores.has(cfg.id)) stores.set(cfg.id, new Map());
      this.store = stores.get(cfg.id)!;
    }
    set(k: string, v: unknown) {
      this.store.set(k, String(v));
    }
    getString(k: string) {
      return this.store.get(k);
    }
    delete(k: string) {
      this.store.delete(k);
    }
    clearAll() {
      this.store.clear();
    }
    getBoolean(k: string) {
      const v = this.store.get(k);
      return v === 'true';
    }
  }
  return { MMKV };
});

import { enqueue, flush, list, size, clear } from '../lib/offline-queue';

describe('offline-queue', () => {
  beforeEach(() => clear());

  it('legt Items an und zählt korrekt', () => {
    enqueue({ method: 'POST', path: '/api/reports', body: '{"text":"a"}' });
    enqueue({ method: 'POST', path: '/api/emergencies', body: '{}' });
    expect(size()).toBe(2);
    expect(list()[0]?.path).toBe('/api/reports');
  });

  it('flusht Items bei Erfolg und entfernt sie', async () => {
    enqueue({ method: 'POST', path: '/api/a' });
    enqueue({ method: 'POST', path: '/api/b' });
    const res = await flush(async () => undefined);
    expect(res.sent).toBe(2);
    expect(size()).toBe(0);
  });

  it('stoppt bei erstem Fehler und inkrementiert retries', async () => {
    enqueue({ method: 'POST', path: '/api/x' });
    enqueue({ method: 'POST', path: '/api/y' });
    const res = await flush(async () => {
      throw new Error('offline');
    });
    expect(res.sent).toBe(0);
    expect(res.failed).toBe(1);
    expect(size()).toBe(2);
    expect(list()[0]?.retries).toBe(1);
  });
});
