"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

type Req = {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  status: string;
  dueDate: string | null;
};

const STATUS_OPTS = ["offen", "in-bearbeitung", "erledigt", "nicht-anwendbar"];

export function RequirementsList({ certId, initial }: { certId: string; initial: Req[] }) {
  const [reqs, setReqs] = useState<Req[]>(initial);
  const [newTitle, setNewTitle] = useState("");
  const [newCat, setNewCat] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const router = useRouter();

  async function updateStatus(id: string, status: string) {
    setReqs((s) => s.map((r) => (r.id === id ? { ...r, status } : r)));
    await fetch(`/api/certifications/${certId}/requirements`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    router.refresh();
  }

  async function addReq() {
    if (!newTitle.trim()) return;
    const res = await fetch(`/api/certifications/${certId}/requirements`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newTitle, category: newCat, description: newDesc }),
    });
    if (res.ok) {
      const { requirement } = (await res.json()) as { requirement: Req };
      setReqs((s) => [...s, requirement]);
      setNewTitle("");
      setNewCat("");
      setNewDesc("");
      router.refresh();
    }
  }

  // Grouped by category
  const grouped: Record<string, Req[]> = {};
  for (const r of reqs) {
    const cat = r.category ?? "Sonstiges";
    (grouped[cat] ??= []).push(r);
  }

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([cat, items]) => (
        <div key={cat}>
          <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">{cat}</h3>
          <div className="space-y-2">
            {items.map((r) => (
              <div key={r.id} className="flex items-start gap-3 rounded-lg border border-border p-3">
                <div className="flex-1">
                  <div className="font-medium">{r.title}</div>
                  {r.description && <div className="mt-1 text-sm text-muted-foreground">{r.description}</div>}
                </div>
                <select
                  value={r.status}
                  onChange={(e) => updateStatus(r.id, e.target.value)}
                  className={`h-8 rounded-md border px-2 text-xs font-semibold ${
                    r.status === "erledigt"
                      ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                      : r.status === "in-bearbeitung"
                        ? "border-amber-300 bg-amber-50 text-amber-700"
                        : "border-input bg-background"
                  }`}
                >
                  {STATUS_OPTS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="rounded-lg border border-dashed border-border p-4">
        <div className="mb-2 text-sm font-semibold">Neue Anforderung</div>
        <div className="grid gap-2 md:grid-cols-[1fr_1.6fr]">
          <Input value={newCat} onChange={(e) => setNewCat(e.target.value)} placeholder="Kategorie" />
          <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Titel" />
        </div>
        <Textarea
          value={newDesc}
          onChange={(e) => setNewDesc(e.target.value)}
          placeholder="Beschreibung (optional)"
          className="mt-2"
        />
        <div className="mt-2 flex justify-end">
          <Button onClick={addReq} size="sm">
            <Plus className="mr-1 h-4 w-4" /> Hinzufügen
          </Button>
        </div>
      </div>
    </div>
  );
}
