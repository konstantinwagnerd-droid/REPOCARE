"use client";

// Sticky banner at the top of the viewport. Only visible when offline or when
// there are pending mutations. Matches the CareAI design system palette.

import { useOffline } from "@/lib/offline/use-offline";
import { AlertTriangle, CloudOff, RefreshCw } from "lucide-react";

export function OfflineBanner() {
  const { isOnline, pendingCount, syncing, retry } = useOffline();

  const visible = !isOnline || pendingCount > 0 || syncing;
  if (!visible) return null;

  let tone: "red" | "blue" | "amber" = "blue";
  let label = "";
  let Icon = CloudOff;

  if (!isOnline) {
    tone = "red";
    Icon = CloudOff;
    label = pendingCount > 0
      ? `Du bist offline — ${pendingCount} Änderung${pendingCount === 1 ? "" : "en"} werden lokal gespeichert`
      : "Du bist offline — alle Änderungen werden lokal gespeichert";
  } else if (syncing) {
    tone = "blue";
    Icon = RefreshCw;
    label = `Synchronisiere… (${pendingCount})`;
  } else if (pendingCount > 0) {
    tone = "amber";
    Icon = AlertTriangle;
    label = `${pendingCount} Änderung${pendingCount === 1 ? "" : "en"} nicht synchronisiert`;
  }

  const bg =
    tone === "red" ? "bg-red-600 text-white"
    : tone === "blue" ? "bg-blue-600 text-white"
    : "bg-amber-500 text-black";

  return (
    <div
      role="status"
      aria-live="polite"
      data-testid="offline-banner"
      data-tone={tone}
      className={`sticky top-0 z-[60] flex items-center justify-between gap-3 px-4 py-2 text-sm ${bg}`}
    >
      <span className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} aria-hidden />
        <span>{label}</span>
      </span>
      {tone !== "blue" && (
        <button
          type="button"
          onClick={() => void retry()}
          className="rounded-md bg-white/20 px-2 py-1 text-xs font-medium hover:bg-white/30"
          data-testid="offline-retry"
        >
          Jetzt synchronisieren
        </button>
      )}
    </div>
  );
}
