"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

type Template = {
  id: string;
  label: string;
  validityMonths: number;
  requirements: { title: string; description: string; category: string }[];
};

export function NewCertDialog({ templates }: { templates: Template[] }) {
  const [open, setOpen] = useState(false);
  const [typeId, setTypeId] = useState(templates[0]?.id ?? "iso-27001");
  const [auditor, setAuditor] = useState("");
  const [certNumber, setCertNumber] = useState("");
  const [awardedDate, setAwardedDate] = useState(new Date().toISOString().slice(0, 10));
  const [useTemplate, setUseTemplate] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function create() {
    setSaving(true);
    const res = await fetch("/api/certifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        certificationType: typeId,
        awardedDate,
        auditor: auditor || null,
        certificateNumber: certNumber || null,
        useTemplate,
      }),
    });
    setSaving(false);
    if (res.ok) {
      setOpen(false);
      router.refresh();
    }
  }

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" /> Neues Zertifikat
      </Button>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-40 bg-foreground/50" onClick={() => setOpen(false)} />
      <div className="fixed left-1/2 top-1/2 z-50 w-[min(560px,90vw)] -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-background p-6 shadow-2xl">
        <h2 className="font-serif text-2xl font-semibold">Neues Zertifikat</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Wähle ein Template — Anforderungen werden automatisch vorbefüllt.
        </p>
        <div className="mt-4 space-y-3">
          <div>
            <Label htmlFor="cert-type">Typ</Label>
            <select
              id="cert-type"
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={typeId}
              onChange={(e) => setTypeId(e.target.value)}
            >
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label} ({t.requirements.length} Anforderungen)
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <Label htmlFor="auditor">Auditor:in</Label>
              <Input id="auditor" value={auditor} onChange={(e) => setAuditor(e.target.value)} placeholder="z.B. TÜV Süd" />
            </div>
            <div>
              <Label htmlFor="cert-number">Zertifikats-Nr.</Label>
              <Input id="cert-number" value={certNumber} onChange={(e) => setCertNumber(e.target.value)} />
            </div>
          </div>
          <div>
            <Label htmlFor="awarded">Ausstellungsdatum</Label>
            <Input id="awarded" type="date" value={awardedDate} onChange={(e) => setAwardedDate(e.target.value)} />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={useTemplate} onChange={(e) => setUseTemplate(e.target.checked)} />
            Template übernehmen (Anforderungs-Liste automatisch erstellen)
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Abbrechen
          </Button>
          <Button onClick={create} disabled={saving}>
            {saving ? "Speichere…" : "Anlegen"}
          </Button>
        </div>
      </div>
    </>
  );
}
