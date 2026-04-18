"use client";

// Wund-Observations-Formular (offline-aware). Stadium (I-IV), Größe in cm,
// Exsudat, Geruch, Schmerzen, Maßnahme.

import { useState } from "react";
import { useOfflineMutation } from "@/lib/offline/use-offline";
import { toast } from "sonner";

export interface WoundObservationFormProps {
  residentId: string;
  woundId: string;
  onSaved?: () => void;
}

export function WoundObservationForm({ residentId, woundId, onSaved }: WoundObservationFormProps) {
  const [stage, setStage] = useState<"I" | "II" | "III" | "IV">("II");
  const [sizeCm, setSizeCm] = useState("");
  const [exudate, setExudate] = useState("gering");
  const [notes, setNotes] = useState("");

  const mut = useOfflineMutation<Record<string, unknown>>({
    type: "wound-observation",
    resource: "berichte",
    endpoint: "/api/reports",
    method: "POST",
    onSuccess: () => { toast.success("Wundbeobachtung gespeichert"); onSaved?.(); },
    onQueued: () => { toast.info("Offline — wird später synchronisiert"); onSaved?.(); },
  });

  return (
    <form
      data-testid="wound-observation-form"
      onSubmit={async (e) => {
        e.preventDefault();
        await mut.mutate({
          residentId, woundId, stage,
          sizeCm: Number(sizeCm) || null,
          exudate, notes,
          observedAt: new Date().toISOString(),
        });
        setSizeCm(""); setNotes("");
      }}
      className="flex flex-col gap-3"
    >
      <label className="text-sm">Stadium
        <select data-testid="wound-stage" value={stage} onChange={(e) => setStage(e.target.value as "I" | "II" | "III" | "IV")} className="mt-1 w-full rounded-md border border-border px-2 py-1">
          <option value="I">I – Hautrötung</option>
          <option value="II">II – Teilverlust</option>
          <option value="III">III – Tiefer Hautdefekt</option>
          <option value="IV">IV – Knochenbeteiligung</option>
        </select>
      </label>
      <label className="text-sm">Größe (cm²)
        <input data-testid="wound-size" type="number" step="0.1" value={sizeCm} onChange={(e) => setSizeCm(e.target.value)} className="mt-1 w-full rounded-md border border-border px-2 py-1" />
      </label>
      <label className="text-sm">Exsudat
        <select data-testid="wound-exudate" value={exudate} onChange={(e) => setExudate(e.target.value)} className="mt-1 w-full rounded-md border border-border px-2 py-1">
          <option value="keines">keines</option>
          <option value="gering">gering</option>
          <option value="mäßig">mäßig</option>
          <option value="stark">stark</option>
        </select>
      </label>
      <label className="text-sm">Notizen
        <textarea data-testid="wound-notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="mt-1 w-full rounded-md border border-border px-2 py-1" />
      </label>
      <button type="submit" disabled={mut.isPending} data-testid="wound-submit" className="self-end rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50">
        {mut.isPending ? "Speichere…" : "Speichern"}
      </button>
    </form>
  );
}
