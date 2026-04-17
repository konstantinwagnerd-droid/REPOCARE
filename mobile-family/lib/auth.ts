/**
 * Magic-Link Auth-Flow für Angehörige.
 *
 * Flow:
 *   1) E-Mail eingeben  → requestMagicLink()  (Code wird "per Mail" verschickt, Mock)
 *   2) 6-stelligen Code → verifyMagicLink()   → Session-Token + User
 *
 * Session-Länge: 30 Tage (Angehörige loggen sich selten ein).
 */
import { create } from 'zustand';
import { StorageKeys, del, getJSON, getString, setJSON, setString, storage } from './storage';

const SESSION_MAX_MS = 30 * 24 * 60 * 60 * 1000;

export type FamilyUser = {
  id: string;
  email: string;
  name: string;
  residentId: string;
  residentName: string;
  relation: 'tochter' | 'sohn' | 'ehepartner' | 'enkel' | 'geschwister' | 'sonstige';
};

/**
 * Deterministischer 6-stelliger Code auf Basis der E-Mail und einer Halbstunde.
 * So funktioniert der Demo-Flow offline und reproduzierbar.
 */
export function generateCodeForEmail(email: string, now = Date.now()): string {
  const bucket = Math.floor(now / (30 * 60 * 1000));
  let hash = 0;
  const str = `${email.toLowerCase()}:${bucket}`;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) >>> 0;
  }
  const code = hash % 1_000_000;
  return code.toString().padStart(6, '0');
}

export async function requestMagicLink(email: string): Promise<{ sent: true; hint: string }> {
  if (!email.includes('@')) throw new Error('Bitte gültige E-Mail-Adresse eingeben.');
  setString(StorageKeys.PendingEmail, email.toLowerCase());
  // In Demo: Code ist aus E-Mail ableitbar. In Prod: Backend verschickt echten Code.
  const code = generateCodeForEmail(email);
  return { sent: true, hint: `Demo-Code: ${code}` };
}

export async function verifyMagicLink(code: string): Promise<FamilyUser> {
  const email = getString(StorageKeys.PendingEmail);
  if (!email) throw new Error('Kein ausstehender Anmelde-Versuch gefunden.');
  const expected = generateCodeForEmail(email);
  if (code.trim() !== expected) {
    throw new Error('Code ungültig oder abgelaufen.');
  }
  const namePart = email.split('@')[0] ?? 'Angehörige';
  const user: FamilyUser = {
    id: `f_${namePart}`,
    email,
    name: namePart.charAt(0).toUpperCase() + namePart.slice(1),
    residentId: 'res_demo_1',
    residentName: 'Frau Huber',
    relation: 'tochter',
  };
  const fakeToken = `fam.${btoaSafe(email)}.${Date.now()}`;
  storage.set(StorageKeys.Token, fakeToken);
  storage.set(StorageKeys.TokenTs, Date.now().toString());
  setJSON(StorageKeys.User, user);
  del(StorageKeys.PendingEmail);
  return user;
}

function btoaSafe(s: string): string {
  try {
    // React-Native 0.76 liefert globales btoa über Hermes
    return (globalThis as { btoa?: (s: string) => string }).btoa?.(s) ?? s;
  } catch {
    return s;
  }
}

export function getCurrentUser(): FamilyUser | null {
  const token = storage.getString(StorageKeys.Token);
  const tsRaw = storage.getString(StorageKeys.TokenTs);
  if (!token || !tsRaw) return null;
  if (Date.now() - parseInt(tsRaw, 10) > SESSION_MAX_MS) {
    logout();
    return null;
  }
  return getJSON<FamilyUser>(StorageKeys.User);
}

export function logout() {
  del(StorageKeys.Token);
  del(StorageKeys.TokenTs);
  del(StorageKeys.User);
}

type AuthState = {
  user: FamilyUser | null;
  loading: boolean;
  setUser: (u: FamilyUser | null) => void;
  hydrate: () => void;
  signOut: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  hydrate: () => set({ user: getCurrentUser(), loading: false }),
  signOut: () => {
    logout();
    set({ user: null });
  },
}));
