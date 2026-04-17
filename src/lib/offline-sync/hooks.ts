"use client";

import { useEffect, useState, useCallback } from "react";
import { getOutbox, pushAll, startAutoSync } from "./sync-engine";
import type { SyncOperation, SyncStatus } from "./types";

export function useOfflineState(): { status: SyncStatus; isOnline: boolean } {
  const [status, setStatus] = useState<SyncStatus>(() =>
    typeof navigator !== "undefined" && navigator.onLine ? "online" : "offline",
  );
  useEffect(() => {
    if (typeof window === "undefined") return;
    const on = () => setStatus("online");
    const off = () => setStatus("offline");
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);
  return { status, isOnline: status === "online" };
}

export function useOutbox(): {
  ops: SyncOperation[];
  refresh: () => Promise<void>;
  flush: () => Promise<void>;
  syncing: boolean;
  lastReport: { pushed: number; failed: number; conflicts: number } | null;
} {
  const [ops, setOps] = useState<SyncOperation[]>([]);
  const [syncing, setSyncing] = useState(false);
  const [lastReport, setLastReport] = useState<{ pushed: number; failed: number; conflicts: number } | null>(null);

  const refresh = useCallback(async () => {
    setOps(await getOutbox());
  }, []);

  const flush = useCallback(async () => {
    setSyncing(true);
    try {
      const report = await pushAll();
      setLastReport({ pushed: report.pushed, failed: report.failed, conflicts: report.conflicts });
      await refresh();
    } finally {
      setSyncing(false);
    }
  }, [refresh]);

  useEffect(() => {
    void refresh();
    const stop = startAutoSync();
    const id = setInterval(refresh, 5000);
    return () => { stop(); clearInterval(id); };
  }, [refresh]);

  return { ops, refresh, flush, syncing, lastReport };
}
