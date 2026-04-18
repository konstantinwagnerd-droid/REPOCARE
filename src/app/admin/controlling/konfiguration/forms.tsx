"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";

type Rate = {
  id?: string;
  role: string;
  qualification: string | null;
  hourlyRateCents: number;
  validFrom: string | Date;
};

type Revenue = {
  id?: string;
  pflegegrad: number;
  monthlyRevenueCents: number;
  country: string;
  validFrom: string | Date;
};

type Fix = {
  id?: string;
  category: string;
  label: string;
  monthlyCostCents: number;
  validFrom: string | Date;
};

function toDateStr(v: string | Date | null | undefined): string {
  if (!v) return DEFAULT_DATE;
  if (typeof v === "string") return v.slice(0, 10);
  return v.toISOString().slice(0, 10);
}

const DEFAULT_DATE = new Date().toISOString().slice(0, 10);

function RatesForm({ initial }: { initial: Rate[] }) {
  const [rows, setRows] = useState<Rate[]>(
    initial.length > 0
      ? initial
      : [
          { role: "examiniert", qualification: "dgkp", hourlyRateCents: 2200, validFrom: DEFAULT_DATE },
          { role: "helfer", qualification: "pfh", hourlyRateCents: 1650, validFrom: DEFAULT_DATE },
          { role: "hauswirtschaft", qualification: "", hourlyRateCents: 1250, validFrom: DEFAULT_DATE },
        ],
  );
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const router = useRouter();

  async function save() {
    setSaving(true);
    setMsg("");
    const res = await fetch("/api/controlling/rates", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rows }),
    });
    setSaving(false);
    if (res.ok) {
      setMsg("Gespeichert.");
      router.refresh();
    } else {
      setMsg("Fehler beim Speichern.");
    }
  }

  return (
    <div className="space-y-3">
      {rows.map((r, i) => (
        <div key={i} className="grid gap-2 md:grid-cols-[1.2fr_1fr_0.8fr_0.8fr_auto]">
          <div>
            <Label className="text-xs">Rolle</Label>
            <Input
              value={r.role}
              onChange={(e) => setRows((s) => s.map((x, j) => (j === i ? { ...x, role: e.target.value } : x)))}
              placeholder="examiniert"
            />
          </div>
          <div>
            <Label className="text-xs">Qualifikation</Label>
            <Input
              value={r.qualification ?? ""}
              onChange={(e) => setRows((s) => s.map((x, j) => (j === i ? { ...x, qualification: e.target.value } : x)))}
              placeholder="dgkp"
            />
          </div>
          <div>
            <Label className="text-xs">€/h (Cent)</Label>
            <Input
              type="number"
              value={r.hourlyRateCents}
              onChange={(e) =>
                setRows((s) => s.map((x, j) => (j === i ? { ...x, hourlyRateCents: Number(e.target.value) } : x)))
              }
            />
          </div>
          <div>
            <Label className="text-xs">Gültig ab</Label>
            <Input
              type="date"
              value={toDateStr(r.validFrom)}
              onChange={(e) => setRows((s) => s.map((x, j) => (j === i ? { ...x, validFrom: e.target.value } : x)))}
            />
          </div>
          <div className="flex items-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setRows((s) => s.filter((_, j) => j !== i))}
              aria-label="entfernen"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setRows((s) => [...s, { role: "", qualification: "", hourlyRateCents: 1800, validFrom: DEFAULT_DATE }])
          }
        >
          <Plus className="mr-1 h-4 w-4" /> Zeile
        </Button>
        <div className="flex items-center gap-3">
          {msg && <span className="text-sm text-muted-foreground">{msg}</span>}
          <Button onClick={save} disabled={saving}>
            {saving ? "Speichere…" : "Speichern"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function RevenueForm({ initial }: { initial: Revenue[] }) {
  const [rows, setRows] = useState<Revenue[]>(
    initial.length > 0
      ? initial
      : [
          { pflegegrad: 1, monthlyRevenueCents: 13100, country: "DE", validFrom: DEFAULT_DATE },
          { pflegegrad: 2, monthlyRevenueCents: 80500, country: "DE", validFrom: DEFAULT_DATE },
          { pflegegrad: 3, monthlyRevenueCents: 131800, country: "DE", validFrom: DEFAULT_DATE },
          { pflegegrad: 4, monthlyRevenueCents: 177500, country: "DE", validFrom: DEFAULT_DATE },
          { pflegegrad: 5, monthlyRevenueCents: 200500, country: "DE", validFrom: DEFAULT_DATE },
        ],
  );
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const router = useRouter();

  async function save() {
    setSaving(true);
    setMsg("");
    const res = await fetch("/api/controlling/revenue", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rows }),
    });
    setSaving(false);
    if (res.ok) {
      setMsg("Gespeichert.");
      router.refresh();
    } else {
      setMsg("Fehler.");
    }
  }

  return (
    <div className="space-y-3">
      {rows.map((r, i) => (
        <div key={i} className="grid gap-2 md:grid-cols-[0.6fr_1fr_0.6fr_0.8fr_auto]">
          <div>
            <Label className="text-xs">Pflegegrad</Label>
            <Input
              type="number"
              value={r.pflegegrad}
              onChange={(e) =>
                setRows((s) => s.map((x, j) => (j === i ? { ...x, pflegegrad: Number(e.target.value) } : x)))
              }
            />
          </div>
          <div>
            <Label className="text-xs">€/Monat (Cent)</Label>
            <Input
              type="number"
              value={r.monthlyRevenueCents}
              onChange={(e) =>
                setRows((s) => s.map((x, j) => (j === i ? { ...x, monthlyRevenueCents: Number(e.target.value) } : x)))
              }
            />
          </div>
          <div>
            <Label className="text-xs">Land</Label>
            <select
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
              value={r.country}
              onChange={(e) => setRows((s) => s.map((x, j) => (j === i ? { ...x, country: e.target.value } : x)))}
            >
              <option value="DE">DE</option>
              <option value="AT">AT</option>
            </select>
          </div>
          <div>
            <Label className="text-xs">Gültig ab</Label>
            <Input
              type="date"
              value={toDateStr(r.validFrom)}
              onChange={(e) => setRows((s) => s.map((x, j) => (j === i ? { ...x, validFrom: e.target.value } : x)))}
            />
          </div>
          <div className="flex items-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setRows((s) => s.filter((_, j) => j !== i))}
              aria-label="entfernen"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setRows((s) => [...s, { pflegegrad: 1, monthlyRevenueCents: 0, country: "DE", validFrom: DEFAULT_DATE }])
          }
        >
          <Plus className="mr-1 h-4 w-4" /> Zeile
        </Button>
        <div className="flex items-center gap-3">
          {msg && <span className="text-sm text-muted-foreground">{msg}</span>}
          <Button onClick={save} disabled={saving}>
            {saving ? "Speichere…" : "Speichern"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function FixedCostsForm({ initial }: { initial: Fix[] }) {
  const [rows, setRows] = useState<Fix[]>(
    initial.length > 0
      ? initial
      : [
          { category: "miete", label: "Gebäude-Miete", monthlyCostCents: 2500000, validFrom: DEFAULT_DATE },
          { category: "strom", label: "Strom & Heizung", monthlyCostCents: 450000, validFrom: DEFAULT_DATE },
          { category: "lebensmittel", label: "Lebensmittel", monthlyCostCents: 850000, validFrom: DEFAULT_DATE },
        ],
  );
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const router = useRouter();

  async function save() {
    setSaving(true);
    setMsg("");
    const res = await fetch("/api/controlling/fixed-costs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rows }),
    });
    setSaving(false);
    if (res.ok) {
      setMsg("Gespeichert.");
      router.refresh();
    } else {
      setMsg("Fehler.");
    }
  }

  return (
    <div className="space-y-3">
      {rows.map((r, i) => (
        <div key={i} className="grid gap-2 md:grid-cols-[1fr_1.2fr_0.8fr_0.8fr_auto]">
          <div>
            <Label className="text-xs">Kategorie</Label>
            <Input
              value={r.category}
              onChange={(e) => setRows((s) => s.map((x, j) => (j === i ? { ...x, category: e.target.value } : x)))}
            />
          </div>
          <div>
            <Label className="text-xs">Bezeichnung</Label>
            <Input
              value={r.label}
              onChange={(e) => setRows((s) => s.map((x, j) => (j === i ? { ...x, label: e.target.value } : x)))}
            />
          </div>
          <div>
            <Label className="text-xs">€/Monat (Cent)</Label>
            <Input
              type="number"
              value={r.monthlyCostCents}
              onChange={(e) =>
                setRows((s) => s.map((x, j) => (j === i ? { ...x, monthlyCostCents: Number(e.target.value) } : x)))
              }
            />
          </div>
          <div>
            <Label className="text-xs">Gültig ab</Label>
            <Input
              type="date"
              value={toDateStr(r.validFrom)}
              onChange={(e) => setRows((s) => s.map((x, j) => (j === i ? { ...x, validFrom: e.target.value } : x)))}
            />
          </div>
          <div className="flex items-end">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setRows((s) => s.filter((_, j) => j !== i))}
              aria-label="entfernen"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setRows((s) => [...s, { category: "sonstiges", label: "", monthlyCostCents: 0, validFrom: DEFAULT_DATE }])
          }
        >
          <Plus className="mr-1 h-4 w-4" /> Zeile
        </Button>
        <div className="flex items-center gap-3">
          {msg && <span className="text-sm text-muted-foreground">{msg}</span>}
          <Button onClick={save} disabled={saving}>
            {saving ? "Speichere…" : "Speichern"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export const KonfigForms = { Rates: RatesForm, Revenue: RevenueForm, FixedCosts: FixedCostsForm };
