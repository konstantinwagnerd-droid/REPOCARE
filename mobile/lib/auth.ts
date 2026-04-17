/**
 * Auth-Layer: Token speichern in expo-secure-store.
 * Entspricht dem JWT-Flow der Next.js Web-App (/api/auth/callback/credentials).
 * Auto-Logout nach 24h.
 */
import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

const TOKEN_KEY = 'careai.token';
const TOKEN_TS_KEY = 'careai.token.ts';
const USER_KEY = 'careai.user';
const SESSION_MAX_MS = 24 * 60 * 60 * 1000; // 24h

export type User = {
  id: string;
  email: string;
  name: string;
  role: 'pdl' | 'pflege' | 'admin';
  avatar?: string;
};

export async function saveToken(token: string) {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
  await SecureStore.setItemAsync(TOKEN_TS_KEY, Date.now().toString());
}

export async function getToken(): Promise<string | null> {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  const tsRaw = await SecureStore.getItemAsync(TOKEN_TS_KEY);
  if (!token || !tsRaw) return null;
  const ts = parseInt(tsRaw, 10);
  if (Date.now() - ts > SESSION_MAX_MS) {
    await clearToken();
    return null;
  }
  return token;
}

export async function clearToken() {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
  await SecureStore.deleteItemAsync(TOKEN_TS_KEY);
  await SecureStore.deleteItemAsync(USER_KEY);
}

export async function saveUser(user: User) {
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
}

export async function getUser(): Promise<User | null> {
  const raw = await SecureStore.getItemAsync(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

/**
 * Mock-Login gegen careai.demo Domain.
 * In Prod gegen /api/auth/callback/credentials der Next.js App.
 */
export async function login(email: string, password: string): Promise<User> {
  // Mock: akzeptiert jede @careai.demo Email
  if (!email.endsWith('@careai.demo')) {
    throw new Error('Demo-Login nur mit @careai.demo Adressen möglich.');
  }
  if (password.length < 4) {
    throw new Error('Passwort zu kurz.');
  }
  const name = email.split('@')[0] ?? 'Demo';
  const user: User = {
    id: `u_${name}`,
    email,
    name: name.charAt(0).toUpperCase() + name.slice(1),
    role: email.startsWith('pdl') ? 'pdl' : 'pflege',
  };
  const fakeToken = `demo.${Buffer.from(email).toString('base64')}.${Date.now()}`;
  await saveToken(fakeToken);
  await saveUser(user);
  return user;
}

export async function logout() {
  await clearToken();
}

type AuthState = {
  user: User | null;
  loading: boolean;
  setUser: (u: User | null) => void;
  setLoading: (b: boolean) => void;
  hydrate: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  hydrate: async () => {
    const token = await getToken();
    const user = await getUser();
    set({ user: token && user ? user : null, loading: false });
  },
}));
