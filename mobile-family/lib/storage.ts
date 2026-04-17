/**
 * MMKV-basierte persistente Speicherung für die Family-App.
 * Schneller, synchroner Zugriff auf Einstellungen und Session-Token.
 */
import { MMKV } from 'react-native-mmkv';

export const storage = new MMKV({ id: 'careai-family' });

export const StorageKeys = {
  Token: 'family.token',
  TokenTs: 'family.token.ts',
  User: 'family.user',
  PendingEmail: 'family.pending.email',
  NotificationsEnabled: 'family.notifications.enabled',
  PrivacyFotos: 'family.privacy.fotos',
  ThemePref: 'family.theme',
} as const;

export function setJSON<T>(key: string, value: T) {
  storage.set(key, JSON.stringify(value));
}

export function getJSON<T>(key: string): T | null {
  const raw = storage.getString(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export function setBool(key: string, value: boolean) {
  storage.set(key, value);
}

export function getBool(key: string, fallback = false): boolean {
  const v = storage.getBoolean(key);
  return v === undefined ? fallback : v;
}

export function setString(key: string, value: string) {
  storage.set(key, value);
}

export function getString(key: string): string | null {
  return storage.getString(key) ?? null;
}

export function del(key: string) {
  storage.delete(key);
}
