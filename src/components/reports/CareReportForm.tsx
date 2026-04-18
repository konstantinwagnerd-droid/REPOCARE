"use client";

// Pflegebericht-Formular (offline-aware).
// Speichert den Text als Draft im IndexedDB-Store, schickt bei "Speichern" an
// /api/care-reports (wenn online) oder queued ihn (wenn offline).

import { useEffect, useState } from "react";
import { useOfflineMutation } from "@/lib/offline/use-offline";
import { toast } from "sonner";

export interface CareReportFormProps {
  residentId: string;
  shiftId?: string;
  onSaved?: () => void;
}

export function CareReportForm({ residentId, shiftId, onSaved }: CareReportFormProps) {
  const [text, setText] = useState("");
  const [loaded, setLoaded] = useState(false);

  const mut = useOfflineMutation<{ residentId: string; shiftId?: string; text: string }>({
    type: "care-report",
    resource: "berichte",
    endpoint: "/api/care-reports",
    method: "POST",
    draftKey: `care-report:${residentId}`,
    onSuccess: () => { toast.success("Bericht gespeichert"); onSaved?.(); },
    onQueued: () => { toast.info("Offline — Bericht wird synchronisiert, sobald du online bist"); onSaved?.(); },
  });

  // Load existing draft
  useEffect(() => {
    void mut.loadDraft().then((d) => {
      if (d && typeof d.text === "string") setText(d.text);
      setLoaded(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-save draft every 2s while typing
  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(() => { void mut.saveDraft({ residentId, shiftId, text }); }, 2000);
    return () => clearTimeout(t);
  }, [text, loaded, residentId, shiftId, mut]);

  return (
    <form
      data-testid="care-report-form"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        await mut.mutate({ residentId, shiftId, text });
        setText("");
      }}
      className="flex flex-col gap-3"
    >
      <label htmlFor="care-report-text" className="text-sm font-medium">
        Pflegebericht
      </label>
      <textarea
        id="care-report-text"
        data-testid="care-report-text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={6}
        className="rounded-lg border border-border bg-card px-3 py-2 text-sm"
        placeholder="Wohlbefinden, Beobachtungen, Auffälligkeiten…"
        required
      />
      <button
        type="submit"
        disabled={mut.isPending || !text.trim()}
        data-testid="care-report-submit"
        className="self-end rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
      >
        {mut.isPending ? "Speichere…" : "Speichern"}
      </button>
    </form>
  );
}
