"use client";

// CareAI Offline — React hooks
// useOffline(): returns { isOnline, pendingCount, lastSyncAt, retry }
// useOfflineMutation<T>(key, mutationFn): wraps a mutation so that it falls
//   back to the outbox on network failure or while offline.

import { useCallback, useEffect, useRef, useState } from "react";
import { enqueueMutation, flushQueue, getPendingCount, onQueueChanged, retryFailed, startAutoSync } from "./sync";
import type { EnqueueInput } from "./sync";
import { draftGet, draftPut, draftDelete } from "./db";

export interface OfflineState {
  isOnline: boolean;
  pendingCount: number;
  lastSyncAt: string | null;
  syncing: boolean;
  retry: () => Promise<void>;
  flush: () => Promise<void>;
}

export function useOffline(): OfflineState {
  const [isOnline, setIsOnline] = useState<boolean>(() =>
    typeof navigator === "undefined" ? true : navigator.onLine,
  );
  const [pendingCount, setPendingCount] = useState(0);
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  const refreshCount = useCallback(async () => {
    setPendingCount(await getPendingCount());
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const on = () => {
      setIsOnline(true);
      setSyncing(true);
      flushQueue()
        .then(() => setLastSyncAt(new Date().toISOString()))
        .finally(() => { setSyncing(false); void refreshCount(); });
    };
    const off = () => setIsOnline(false);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    const stop = startAutoSync();
    const unsub = onQueueChanged(() => { void refreshCount(); });
    void refreshCount();
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
      stop();
      unsub();
    };
  }, [refreshCount]);

  const flush = useCallback(async () => {
    setSyncing(true);
    try {
      await flushQueue();
      setLastSyncAt(new Date().toISOString());
    } finally {
      setSyncing(false);
      await refreshCount();
    }
  }, [refreshCount]);

  const retry = useCallback(async () => {
    await retryFailed();
    await flush();
  }, [flush]);

  return { isOnline, pendingCount, lastSyncAt, syncing, retry, flush };
}

// ---------- useOfflineMutation -------------------------------------------

export interface OfflineMutationOptions<TPayload> {
  type: EnqueueInput["type"];
  resource: EnqueueInput["resource"];
  endpoint: EnqueueInput["endpoint"];
  method?: EnqueueInput["method"];
  /** Transform the form payload into the wire payload. Default: identity. */
  serialize?: (input: TPayload) => Record<string, unknown>;
  /** Optional draft key (enables auto-save). */
  draftKey?: string;
  onSuccess?: (response: unknown) => void;
  onQueued?: () => void;
  onError?: (err: unknown) => void;
}

export interface OfflineMutationState<TPayload> {
  mutate: (input: TPayload) => Promise<{ queued: boolean; response?: unknown }>;
  saveDraft: (input: TPayload) => Promise<void>;
  loadDraft: () => Promise<TPayload | undefined>;
  clearDraft: () => Promise<void>;
  isPending: boolean;
  lastQueued: boolean | null;
}

export function useOfflineMutation<TPayload extends Record<string, unknown>>(
  opts: OfflineMutationOptions<TPayload>,
): OfflineMutationState<TPayload> {
  const [isPending, setIsPending] = useState(false);
  const [lastQueued, setLastQueued] = useState<boolean | null>(null);
  const serializeRef = useRef(opts.serialize ?? ((p: TPayload) => p));

  const mutate = useCallback<OfflineMutationState<TPayload>["mutate"]>(async (input) => {
    setIsPending(true);
    setLastQueued(null);
    const payload = serializeRef.current(input);
    try {
      if (typeof navigator === "undefined" || navigator.onLine) {
        try {
          const res = await fetch(opts.endpoint, {
            method: opts.method ?? "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (res.ok) {
            const body = await res.json().catch(() => undefined);
            opts.onSuccess?.(body);
            setLastQueued(false);
            if (opts.draftKey) await draftDelete(opts.draftKey);
            return { queued: false, response: body };
          }
          // Non-OK — fall through to enqueue
          throw new Error(`HTTP ${res.status}`);
        } catch (err) {
          // Network error or non-2xx → queue it
          await enqueueMutation({
            type: opts.type,
            resource: opts.resource,
            endpoint: opts.endpoint,
            method: opts.method,
            payload,
          });
          opts.onQueued?.();
          setLastQueued(true);
          if (opts.draftKey) await draftDelete(opts.draftKey);
          return { queued: true };
        }
      } else {
        await enqueueMutation({
          type: opts.type,
          resource: opts.resource,
          endpoint: opts.endpoint,
          method: opts.method,
          payload,
        });
        opts.onQueued?.();
        setLastQueued(true);
        if (opts.draftKey) await draftDelete(opts.draftKey);
        return { queued: true };
      }
    } catch (err) {
      opts.onError?.(err);
      throw err;
    } finally {
      setIsPending(false);
    }
  }, [opts]);

  const saveDraft = useCallback(async (input: TPayload) => {
    if (!opts.draftKey) return;
    await draftPut({
      key: opts.draftKey,
      type: opts.type,
      payload: input,
      updatedAt: new Date().toISOString(),
    });
  }, [opts.draftKey, opts.type]);

  const loadDraft = useCallback(async (): Promise<TPayload | undefined> => {
    if (!opts.draftKey) return undefined;
    const d = await draftGet(opts.draftKey);
    return d?.payload as TPayload | undefined;
  }, [opts.draftKey]);

  const clearDraft = useCallback(async () => {
    if (!opts.draftKey) return;
    await draftDelete(opts.draftKey);
  }, [opts.draftKey]);

  return { mutate, saveDraft, loadDraft, clearDraft, isPending, lastQueued };
}
