"use client";

// Medikament-verabreicht-Button (offline-aware). Ein einziger Klick sendet
// ein "administered"-Event an den Server; offline wird es gequeuet.

import { useOfflineMutation } from "@/lib/offline/use-offline";
import { toast } from "sonner";
import { Check } from "lucide-react";

export interface AdministerMedicationButtonProps {
  medicationId: string;
  residentId: string;
  dose: string;
  onConfirmed?: () => void;
  label?: string;
}

export function AdministerMedicationButton({
  medicationId,
  residentId,
  dose,
  onConfirmed,
  label,
}: AdministerMedicationButtonProps) {
  const mut = useOfflineMutation<Record<string, unknown>>({
    type: "medication-administered",
    resource: "medikation",
    endpoint: "/api/reports",
    method: "POST",
    onSuccess: () => { toast.success("Gabe bestätigt"); onConfirmed?.(); },
    onQueued: () => { toast.info("Offline — Gabe wird später synchronisiert"); onConfirmed?.(); },
  });

  return (
    <button
      type="button"
      data-testid="medication-administer"
      onClick={() => void mut.mutate({
        medicationId,
        residentId,
        dose,
        administeredAt: new Date().toISOString(),
      })}
      disabled={mut.isPending}
      className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
    >
      <Check className="h-4 w-4" aria-hidden />
      {mut.isPending ? "Bestätige…" : (label ?? "Als verabreicht markieren")}
    </button>
  );
}

// Bonus: "Maßnahme erledigt"-Button (nutzt dasselbe Pattern, anderer Typ).
export function MarkMeasureDoneButton({
  measureId,
  residentId,
  onDone,
}: { measureId: string; residentId: string; onDone?: () => void }) {
  const mut = useOfflineMutation<Record<string, unknown>>({
    type: "measure-done",
    resource: "berichte",
    endpoint: "/api/reports",
    method: "POST",
    onSuccess: () => { toast.success("Erledigt"); onDone?.(); },
    onQueued: () => { toast.info("Offline — Erledigung wird später synchronisiert"); onDone?.(); },
  });
  return (
    <button
      type="button"
      data-testid="measure-done"
      onClick={() => void mut.mutate({ measureId, residentId, doneAt: new Date().toISOString() })}
      disabled={mut.isPending}
      className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-1.5 text-xs disabled:opacity-50"
    >
      <Check className="h-3 w-3" aria-hidden />
      {mut.isPending ? "…" : "Erledigt"}
    </button>
  );
}
