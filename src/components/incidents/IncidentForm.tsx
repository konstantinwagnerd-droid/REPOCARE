"use client";

// Incident/Sturz-Formular (offline-aware). Zeit, Ort, Art, Beschreibung.
// Besonders wichtig: Stürze dürfen NIE verloren gehen — kritisch für MDK.

import { useState } from "react";
import { useOfflineMutation } from "@/lib/offline/use-offline";
import { toast } from "sonner";

export interface IncidentFormProps {
  residentId: string;
  onSaved?: () => void;
}

export function IncidentForm({ residentId, onSaved }: IncidentFormProps) {
  const [kind, setKind] = useState<"sturz" | "medikation" | "verhalten" | "anderes">("sturz");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState<"leicht" | "mittel" | "schwer">("mittel");

  const mut = useOfflineMutation<Record<string, unknown>>({
    type: "incident",
    resource: "incidents",
    endpoint: "/api/incidents/list",
    method: "POST",
    onSuccess: () => { toast.success("Vorfall dokumentiert"); onSaved?.(); },
    onQueued: () => { toast.info("Offline — Vorfall ist lokal gespeichert und wird synchronisiert"); onSaved?.(); },
  });

  return (
    <form
      data-testid="incident-form"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!description.trim()) return;
        await mut.mutate({
          residentId, kind, location, description, severity,
          occurredAt: new Date().toISOString(),
        });
        setLocation(""); setDescription("");
      }}
      className="flex flex-col gap-3"
    >
      <label className="text-sm">Art
        <select data-testid="incident-kind" value={kind} onChange={(e) => setKind(e.target.value as "sturz" | "medikation" | "verhalten" | "anderes")} className="mt-1 w-full rounded-md border border-border px-2 py-1">
          <option value="sturz">Sturz</option>
          <option value="medikation">Medikations-Fehler</option>
          <option value="verhalten">Verhaltens-Auffälligkeit</option>
          <option value="anderes">Anderes</option>
        </select>
      </label>
      <label className="text-sm">Schweregrad
        <select data-testid="incident-severity" value={severity} onChange={(e) => setSeverity(e.target.value as "leicht" | "mittel" | "schwer")} className="mt-1 w-full rounded-md border border-border px-2 py-1">
          <option value="leicht">leicht</option>
          <option value="mittel">mittel</option>
          <option value="schwer">schwer</option>
        </select>
      </label>
      <label className="text-sm">Ort
        <input data-testid="incident-location" value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1 w-full rounded-md border border-border px-2 py-1" />
      </label>
      <label className="text-sm">Beschreibung
        <textarea data-testid="incident-description" value={description} onChange={(e) => setDescription(e.target.value)} rows={4} required className="mt-1 w-full rounded-md border border-border px-2 py-1" />
      </label>
      <button type="submit" disabled={mut.isPending || !description.trim()} data-testid="incident-submit" className="self-end rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
        {mut.isPending ? "Speichere…" : "Vorfall melden"}
      </button>
    </form>
  );
}
