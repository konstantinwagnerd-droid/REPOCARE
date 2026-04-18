"use client";

// Vital-Werte-Formular (offline-aware). Blutdruck, Puls, Temperatur, SpO2.

import { useState } from "react";
import { useOfflineMutation } from "@/lib/offline/use-offline";
import { toast } from "sonner";

export interface VitalEntryFormProps {
  residentId: string;
  onSaved?: () => void;
}

export function VitalEntryForm({ residentId, onSaved }: VitalEntryFormProps) {
  const [bpSys, setBpSys] = useState("");
  const [bpDia, setBpDia] = useState("");
  const [pulse, setPulse] = useState("");
  const [temp, setTemp] = useState("");
  const [spo2, setSpo2] = useState("");

  const mut = useOfflineMutation<Record<string, unknown>>({
    type: "vital",
    resource: "vitalwerte",
    endpoint: "/api/reports",
    method: "POST",
    onSuccess: () => { toast.success("Vital-Werte gespeichert"); onSaved?.(); },
    onQueued: () => { toast.info("Offline — Vital-Werte werden später synchronisiert"); onSaved?.(); },
  });

  return (
    <form
      data-testid="vital-entry-form"
      onSubmit={async (e) => {
        e.preventDefault();
        await mut.mutate({
          residentId,
          recordedAt: new Date().toISOString(),
          bpSystolic: Number(bpSys) || null,
          bpDiastolic: Number(bpDia) || null,
          pulse: Number(pulse) || null,
          temperatureC: Number(temp) || null,
          spo2: Number(spo2) || null,
        });
        setBpSys(""); setBpDia(""); setPulse(""); setTemp(""); setSpo2("");
      }}
      className="grid grid-cols-2 gap-3"
    >
      <label className="text-sm">RR sys<input data-testid="vital-bp-sys" type="number" value={bpSys} onChange={(e) => setBpSys(e.target.value)} className="mt-1 w-full rounded-md border border-border px-2 py-1" /></label>
      <label className="text-sm">RR dia<input data-testid="vital-bp-dia" type="number" value={bpDia} onChange={(e) => setBpDia(e.target.value)} className="mt-1 w-full rounded-md border border-border px-2 py-1" /></label>
      <label className="text-sm">Puls<input data-testid="vital-pulse" type="number" value={pulse} onChange={(e) => setPulse(e.target.value)} className="mt-1 w-full rounded-md border border-border px-2 py-1" /></label>
      <label className="text-sm">Temp. °C<input data-testid="vital-temp" type="number" step="0.1" value={temp} onChange={(e) => setTemp(e.target.value)} className="mt-1 w-full rounded-md border border-border px-2 py-1" /></label>
      <label className="text-sm col-span-2">SpO₂ %<input data-testid="vital-spo2" type="number" value={spo2} onChange={(e) => setSpo2(e.target.value)} className="mt-1 w-full rounded-md border border-border px-2 py-1" /></label>
      <button
        type="submit"
        disabled={mut.isPending}
        data-testid="vital-submit"
        className="col-span-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
      >
        {mut.isPending ? "Speichere…" : "Vital-Werte speichern"}
      </button>
    </form>
  );
}
