/**
 * MMKV Wrapper — synchroner persistenter Key-Value-Store.
 * Wird für Cache, Settings, Offline-Queue genutzt.
 * Sensible Tokens sollen in `auth.ts` per SecureStore gespeichert werden.
 */
import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({
  id: 'careai-default',
});

export const cacheStorage = new MMKV({
  id: 'careai-cache',
});

export const queueStorage = new MMKV({
  id: 'careai-queue',
});

export const kv = {
  getString: (key: string) => storage.getString(key),
  setString: (key: string, value: string) => storage.set(key, value),
  getJSON: <T>(key: string): T | null => {
    const raw = storage.getString(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },
  setJSON: (key: string, value: unknown) => storage.set(key, JSON.stringify(value)),
  getBool: (key: string) => storage.getBoolean(key),
  setBool: (key: string, value: boolean) => storage.set(key, value),
  delete: (key: string) => storage.delete(key),
  clearAll: () => storage.clearAll(),
};

export const cache = {
  get: <T>(key: string): { data: T; ts: number } | null => {
    const raw = cacheStorage.getString(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as { data: T; ts: number };
    } catch {
      return null;
    }
  },
  set: <T>(key: string, data: T) => {
    cacheStorage.set(key, JSON.stringify({ data, ts: Date.now() }));
  },
  delete: (key: string) => cacheStorage.delete(key),
  clear: () => cacheStorage.clearAll(),
};
