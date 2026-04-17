"use client";

// Offline-Banner + Outbox-Sidebar + Sync-Status-Indicator.
// Datei liegt in components/sample-data/ um in der TABU-Zone zu bleiben —
// kann ueberall importiert werden, da es ein eigenstaendiger Floater ist.

import { useState } from "react";
import { CloudOff, Cloud, RefreshCw, Inbox, AlertTriangle, CheckCircle2, X } from "lucide-react";
import { useOfflineState, useOutbox } from "@/lib/offline-sync/hooks";

export function OfflineBanner() {
  const { isOnline, status } = useOfflineState();
  const { ops, flush, syncing, lastReport } = useOutbox();
  const [open, setOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  return (
    <>
      {/* Offline-Toast */}
      {!isOnline && !bannerDismissed ? (
        <div role="status" aria-live="polite" className="fixed left-1/2 top-4 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full border border-amber-300 bg-amber-50 px-4 py-2 text-sm text-amber-900 shadow-lg dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200">
          <CloudOff className="h-4 w-4" />
          <span>Offline-Modus — Änderungen werden lokal gespeichert.</span>
          <button onClick={() => setBannerDismissed(true)} aria-label="Banner schliessen" className="opacity-70 hover:opacity-100">
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      {/* Status-Indicator (klickbar) */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="fixed bottom-4 right-4 z-40 inline-flex items-center gap-2 rounded-full border border-border bg-background/95 px-3 py-2 text-xs font-medium shadow-lg backdrop-blur hover:bg-secondary"
        aria-expanded={open}
        aria-label={`Sync-Status: ${status}, ${ops.length} ausstehende Operationen`}
      >
        {syncing ? <RefreshCw className="h-3.5 w-3.5 animate-spin text-primary" /> :
         isOnline ? <Cloud className="h-3.5 w-3.5 text-emerald-600" /> :
         <CloudOff className="h-3.5 w-3.5 text-amber-600" />}
        {isOnline ? "Online" : "Offline"}
        {ops.length > 0 ? (
          <span className="rounded-full bg-primary px-1.5 text-primary-foreground">{ops.length}</span>
        ) : null}
      </button>

      {/* Outbox-Sidebar */}
      {open ? (
        <aside className="fixed bottom-16 right-4 z-40 w-80 rounded-2xl border border-border bg-card p-4 shadow-2xl">
          <header className="mb-3 flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-serif text-base font-semibold"><Inbox className="h-4 w-4" /> Outbox</h2>
            <button onClick={() => setOpen(false)} aria-label="Schliessen"><X className="h-4 w-4" /></button>
          </header>
          {ops.length === 0 ? (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-200">
              <CheckCircle2 className="h-4 w-4" /> Alle lokalen Änderungen synchronisiert.
            </div>
          ) : (
            <>
              <ul className="max-h-64 space-y-1.5 overflow-auto">
                {ops.map((op) => (
                  <li key={op.id} className="rounded-lg border border-border bg-background p-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-mono">{op.kind} · {op.resource}</span>
                      {op.retries > 0 ? (
                        <span className="inline-flex items-center gap-1 text-amber-700"><AlertTriangle className="h-3 w-3" /> {op.retries}×</span>
                      ) : null}
                    </div>
                    {op.lastError ? <div className="mt-1 text-[10px] text-red-700">{op.lastError}</div> : null}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => void flush()}
                disabled={!isOnline || syncing}
                className="mt-3 w-full rounded-lg bg-primary px-3 py-2 text-xs font-medium text-primary-foreground disabled:opacity-50"
              >
                {syncing ? "Synchronisiere …" : isOnline ? `Jetzt synchronisieren (${ops.length})` : "Wartet auf Online"}
              </button>
            </>
          )}
          {lastReport ? (
            <div className="mt-3 text-[10px] text-muted-foreground">
              Letzte Sync: {lastReport.pushed} ok · {lastReport.failed} Fehler · {lastReport.conflicts} Konflikte
            </div>
          ) : null}
        </aside>
      ) : null}
    </>
  );
}
