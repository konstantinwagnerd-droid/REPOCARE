"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { FileCheck, Shuffle, Users } from "lucide-react";

type Resident = { id: string; fullName: string; room: string; pflegegrad: number; station: string };

export function MdPruefungClient({ residents }: { residents: Resident[] }) {
  const [kind, setKind] = useState<"MD" | "NQZ">("MD");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [anonymized, setAnonymized] = useState(false);
  const [auditor, setAuditor] = useState("");
  const [pending, start] = useTransition();

  const toggle = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };
  const randomPick = () => {
    const count = Math.min(6, residents.length);
    const shuffled = [...residents].sort(() => Math.random() - 0.5).slice(0, count);
    setSelected(new Set(shuffled.map((r) => r.id)));
    toast.info(`${count} Bewohner:innen zufällig ausgewählt`);
  };

  const generate = () => {
    start(async () => {
      try {
        const res = await fetch("/api/exports/md-pruefung", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kind, anonymized, auditor: auditor || undefined, residentIds: Array.from(selected) }),
        });
        if (!res.ok) throw new Error(await res.text());
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        const cd = res.headers.get("Content-Disposition") ?? "";
        const name = cd.match(/filename="([^"]+)"/)?.[1] ?? "bundle.pdf";
        a.href = url; a.download = name; a.click();
        URL.revokeObjectURL(url);
        toast.success(`${kind}-Bundle erstellt`, { description: `Mit ${selected.size || "zufällig"} Bewohner:innen.` });
      } catch (e: unknown) {
        toast.error("Fehler bei Generierung", { description: (e as Error).message });
      }
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="grid gap-4 p-6 md:grid-cols-3">
          <div>
            <label className="text-xs uppercase tracking-wide text-muted-foreground">Prüfungstyp</label>
            <div className="mt-1 flex gap-2">
              <Button variant={kind === "MD" ? "accent" : "outline"} size="sm" onClick={() => setKind("MD")}>MD (DE)</Button>
              <Button variant={kind === "NQZ" ? "accent" : "outline"} size="sm" onClick={() => setKind("NQZ")}>NQZ (AT)</Button>
            </div>
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-muted-foreground">Prüfer:in (optional)</label>
            <Input value={auditor} onChange={(e) => setAuditor(e.target.value)} placeholder="Name des Prüfers" className="mt-1" />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={anonymized} onChange={(e) => setAnonymized(e.target.checked)} className="h-4 w-4" />
              Anonymisierung (Lehre / Forschung)
            </label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> Bewohner-Stichprobe ({selected.size} ausgewählt)</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={randomPick}><Shuffle className="h-4 w-4" /> Zufallsstichprobe</Button>
            <Button variant="outline" size="sm" onClick={() => setSelected(new Set())}>Zurücksetzen</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-3">
            {residents.map((r) => (
              <label key={r.id} className={`flex items-center gap-2 rounded-xl border p-3 cursor-pointer transition-colors ${selected.has(r.id) ? "border-primary bg-primary/5" : "border-border hover:bg-muted/40"}`}>
                <input type="checkbox" checked={selected.has(r.id)} onChange={() => toggle(r.id)} className="h-4 w-4" />
                <div className="flex-1">
                  <div className="text-sm font-medium">{r.fullName}</div>
                  <div className="text-xs text-muted-foreground">Zimmer {r.room} · PG {r.pflegegrad} · {r.station}</div>
                </div>
                <Badge variant="secondary">PG {r.pflegegrad}</Badge>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={generate} disabled={pending} variant="accent" size="lg">
          <FileCheck className="h-5 w-5" /> {pending ? "Generiere Bundle…" : `${kind}-Bundle generieren`}
        </Button>
      </div>
    </div>
  );
}
