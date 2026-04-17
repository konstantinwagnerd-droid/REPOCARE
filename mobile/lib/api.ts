/**
 * HTTP-Client mit Token, Retry und Offline-Queue-Fallback.
 * Verbindet sich gegen den gleichen Backend-Endpoint wie die Web-App.
 */
import Constants from 'expo-constants';
import { getToken, clearToken } from './auth';
import { cache } from './storage';
import { enqueue } from './offline-queue';

const API_URL =
  (Constants.expoConfig?.extra?.apiUrl as string | undefined) ??
  process.env.EXPO_PUBLIC_API_URL ??
  'https://careai.demo';

export type ApiError = {
  status: number;
  message: string;
  code?: string;
};

export class HttpError extends Error {
  status: number;
  code?: string;
  constructor(e: ApiError) {
    super(e.message);
    this.status = e.status;
    this.code = e.code;
  }
}

type RequestOpts = RequestInit & {
  /** Wenn offline, Operation in Outbox legen statt Fehler zu werfen. */
  queueOnOffline?: boolean;
  /** Cache-Key für GETs. Bei Offline wird Cache zurückgegeben. */
  cacheKey?: string;
  /** Optionale Mock-Daten für Demo ohne Backend. */
  mock?: unknown;
};

async function buildHeaders(init?: HeadersInit): Promise<Headers> {
  const headers = new Headers(init);
  headers.set('Content-Type', 'application/json');
  headers.set('Accept', 'application/json');
  const token = await getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);
  return headers;
}

async function request<T>(path: string, opts: RequestOpts = {}): Promise<T> {
  const url = path.startsWith('http') ? path : `${API_URL}${path}`;
  const method = (opts.method ?? 'GET').toUpperCase();
  const headers = await buildHeaders(opts.headers);

  try {
    const res = await fetch(url, { ...opts, headers });
    if (res.status === 401) {
      await clearToken();
      throw new HttpError({ status: 401, message: 'Sitzung abgelaufen.' });
    }
    if (!res.ok) {
      const text = await res.text();
      throw new HttpError({
        status: res.status,
        message: text || res.statusText,
      });
    }
    const data = (await res.json()) as T;
    if (method === 'GET' && opts.cacheKey) cache.set(opts.cacheKey, data);
    return data;
  } catch (err) {
    // Offline/Fehler-Fallback
    if (method === 'GET' && opts.cacheKey) {
      const cached = cache.get<T>(opts.cacheKey);
      if (cached) return cached.data;
    }
    if (method !== 'GET' && opts.queueOnOffline) {
      enqueue({ method, path, body: opts.body ? String(opts.body) : undefined });
      // soft-resolve mit mock-Rückgabe
      if (opts.mock !== undefined) return opts.mock as T;
    }
    if (opts.mock !== undefined) return opts.mock as T;
    throw err;
  }
}

export const api = {
  get: <T>(path: string, opts?: RequestOpts) => request<T>(path, { ...opts, method: 'GET' }),
  post: <T>(path: string, body?: unknown, opts?: RequestOpts) =>
    request<T>(path, { ...opts, method: 'POST', body: body ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: unknown, opts?: RequestOpts) =>
    request<T>(path, { ...opts, method: 'PUT', body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string, opts?: RequestOpts) =>
    request<T>(path, { ...opts, method: 'DELETE' }),
  uploadFile: async <T>(path: string, uri: string, field = 'file'): Promise<T> => {
    const form = new FormData();
    // @ts-expect-error RN FormData type
    form.append(field, { uri, name: 'audio.m4a', type: 'audio/m4a' });
    const token = await getToken();
    const res = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: form,
    });
    if (!res.ok) throw new HttpError({ status: res.status, message: res.statusText });
    return (await res.json()) as T;
  },
};
