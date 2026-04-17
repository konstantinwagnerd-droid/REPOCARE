"use client";

import { ShieldAlert, LogOut } from "lucide-react";

type Props = { adminName: string; targetName: string; targetRole: string; startedAt: number };

export function ImpersonationBannerClient({ adminName, targetName, targetRole, startedAt }: Props) {
  async function stop() {
    await fetch("/api/impersonation/stop", { method: "POST" });
    window.location.href = "/admin/impersonation";
  }
  const mins = Math.max(1, Math.round((Date.now() - startedAt) / 60000));
  return (
    <div
      role="alert"
      className="sticky top-0 z-40 flex flex-wrap items-center justify-between gap-3 border-b-2 border-amber-600 bg-amber-500 px-4 py-2 text-amber-950 shadow-md dark:bg-amber-600 dark:text-amber-50"
    >
      <div className="flex items-center gap-2 text-sm">
        <ShieldAlert className="h-4 w-4" aria-hidden />
        <span>
          <strong>Impersonation aktiv:</strong> Du ({adminName}) bist eingeloggt als{" "}
          <strong>{targetName}</strong> ({targetRole}) · seit {mins} Min
        </span>
      </div>
      <button
        onClick={stop}
        className="inline-flex items-center gap-1 rounded-lg border border-amber-800 bg-amber-600 px-3 py-1 text-xs font-semibold text-white hover:bg-amber-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-900"
      >
        <LogOut className="h-3 w-3" />Zurück zu Admin
      </button>
    </div>
  );
}
