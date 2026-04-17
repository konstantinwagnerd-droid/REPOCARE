"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { FileDown, Package } from "lucide-react";

const parts = [
  { key: "stammdaten", label: "Stammdaten" },
  { key: "sis", label: "SIS" },
  { key: "plan", label: "Maßnahmenplan" },
  { key: "reports", label: "Pflegeberichte" },
  { key: "vitals", label: "Vitalwerte" },
  { key: "medication", label: "Medikation + MAR" },
  { key: "wounds", label: "Wunddoku" },
  { key: "incidents", label: "Vorfälle" },
  { key: "risks", label: "Risiko-Scores" },
] as const;

export function AkteExportDialog({ residentId }: { residentId: string }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Record<string, boolean>>(Object.fromEntries(parts.map((p) => [p.key, true])));
  const today = new Date().toISOString().slice(0, 10);
  const defaultFrom = new Date(Date.now() - 30 * 86400 * 1000).toISOString().slice(0, 10);
  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(today);
  const [recipient, setRecipient] = useState("");
  const [pending, start] = useTransition();

  const submit = () => {
    start(async () => {
      try {
        const res = await fetch(`/api/exports/bewohner/${residentId}/akte`, {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ from, to, include: selected, recipient: recipient || undefined }),
        });
        if (!res.ok) throw new Error(await res.text());
        const blob = await res.blob();
        const cd = res.headers.get("Content-Disposition") ?? "";
        const filename = cd.match(/filename="([^"]+)"/)?.[1] ?? "akte.pdf";
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
        URL.revokeObjectURL(url);
        setOpen(false);
        toast.success("Akte exportiert", { description: filename });
      } catch (e: unknown) {
        toast.error("Export fehlgeschlagen", { description: (e as Error).message });
      }
    });
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="no-print">
        <Package className="h-4 w-4" /> Akte exportieren
      </Button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-background p-6 shadow-xl">
            <h2 className="font-serif text-2xl font-semibold">Akte exportieren</h2>
            <p className="mt-1 text-sm text-muted-foreground">Wählen Sie Zeitraum, Bestandteile und optional Empfänger:in (Wasserzeichen).</p>
            <div className="mt-4 grid gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs uppercase text-muted-foreground">Von</label>
                  <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="mt-1 h-10" />
                </div>
                <div>
                  <label className="text-xs uppercase text-muted-foreground">Bis</label>
                  <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="mt-1 h-10" />
                </div>
              </div>
              <div>
                <label className="text-xs uppercase text-muted-foreground">Empfänger:in (optional, für Wasserzeichen)</label>
                <Input value={recipient} onChange={(e) => setRecipient(e.target.value)} placeholder="z.B. Hausarzt Dr. Müller" className="mt-1 h-10" />
              </div>
              <div>
                <div className="text-xs uppercase text-muted-foreground">Bestandteile</div>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  {parts.map((p) => (
                    <label key={p.key} className="flex items-center gap-2 text-sm">
                      <input type="checkbox" checked={selected[p.key]} onChange={(e) => setSelected({ ...selected, [p.key]: e.target.checked })} className="h-4 w-4" />
                      {p.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setOpen(false)} disabled={pending}>Abbrechen</Button>
              <Button variant="accent" onClick={submit} disabled={pending}>
                <FileDown className="h-4 w-4" /> {pending ? "Generiere…" : "PDF erzeugen"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
