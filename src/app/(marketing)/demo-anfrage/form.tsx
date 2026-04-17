"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Calendar as CalIcon } from "lucide-react";

/** Naechste 10 Werktage, 2 Slots pro Tag */
function nextSlots(n = 10) {
  const result: { dateIso: string; label: string; times: string[] }[] = [];
  const d = new Date();
  while (result.length < n) {
    d.setDate(d.getDate() + 1);
    const day = d.getDay();
    if (day === 0 || day === 6) continue;
    result.push({
      dateIso: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("de-AT", { weekday: "short", day: "2-digit", month: "short" }),
      times: ["10:00", "14:00", "16:30"],
    });
  }
  return result;
}

export function DemoForm() {
  const params = useSearchParams();
  const prefillBeds = params.get("beds");
  const prefillDocHours = params.get("docHours");
  const slots = useMemo(() => nextSlots(8), []);
  const [selected, setSelected] = useState<{ date: string; time: string } | null>(null);
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selected && slots[0]) setSelected({ date: slots[0].dateIso, time: slots[0].times[0] });
  }, [slots, selected]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setLoading(false);
    setSent(true);
  };

  if (sent) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <CheckCircle2 className="h-7 w-7" />
          </span>
          <h3 className="font-serif text-2xl font-semibold">Danke! Termin vorgemerkt.</h3>
          <p className="max-w-md text-muted-foreground">
            Wir haben Ihre Anfrage erhalten und bestaetigen den Termin per E-Mail. Sie erhalten eine Kalender-Einladung
            mit Video-Link.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="lg:col-span-3">
        <CardContent className="p-7">
          <h2 className="font-serif text-2xl font-semibold">Termin waehlen</h2>
          <p className="mt-2 text-sm text-muted-foreground">30 Minuten, via Teams oder Google Meet.</p>

          <div className="mt-6 overflow-x-auto">
            <div className="flex gap-2">
              {slots.map((s) => {
                const active = selected?.date === s.dateIso;
                return (
                  <button
                    key={s.dateIso}
                    type="button"
                    onClick={() => setSelected({ date: s.dateIso, time: s.times[0] })}
                    aria-pressed={active}
                    className={`flex min-w-[90px] flex-col rounded-xl border p-3 text-center text-sm transition ${
                      active
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border hover:border-primary/40 hover:bg-secondary"
                    }`}
                  >
                    <CalIcon className="mx-auto h-4 w-4" />
                    <span className="mt-1 font-medium">{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {selected && (
            <div className="mt-6">
              <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Uhrzeit</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {slots.find((s) => s.dateIso === selected.date)?.times.map((t) => {
                  const active = selected.time === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setSelected({ ...selected, time: t })}
                      aria-pressed={active}
                      className={`rounded-lg border px-4 py-2 text-sm transition ${
                        active
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/40 hover:bg-secondary"
                      }`}
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required className="mt-2" />
              </div>
              <div>
                <Label htmlFor="email">E-Mail</Label>
                <Input id="email" name="email" type="email" required className="mt-2" />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="facility">Einrichtung</Label>
                <Input id="facility" name="facility" required className="mt-2" />
              </div>
              <div>
                <Label htmlFor="beds">Anzahl Betten</Label>
                <Input id="beds" name="beds" type="number" defaultValue={prefillBeds ?? ""} className="mt-2" />
              </div>
            </div>
            {prefillBeds && prefillDocHours && (
              <div className="rounded-xl bg-primary/5 p-4 text-sm">
                <strong>Aus ROI-Rechner uebernommen:</strong> {prefillBeds} Betten, {prefillDocHours} h Doku/Schicht. Wir
                bereiten die Demo auf Ihre Werte vor.
              </div>
            )}
            <Button type="submit" variant="accent" size="lg" disabled={loading}>
              {loading ? "Anfrage wird gesendet …" : "Termin anfragen"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4 lg:col-span-2">
        <Card className="bg-gradient-to-br from-primary-700 to-primary-900 text-primary-foreground">
          <CardContent className="p-6">
            <h3 className="font-serif text-xl font-semibold">Was Sie in der Demo erwartet</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {[
                "Live-Diktat auf Deutsch mit SIS-Zuordnung",
                "Audit-Log und MD-Export in Aktion",
                "Risiko-Matrix R1–R7 mit Trend",
                "Angehoerigen-Portal aus Nutzersicht",
                "Migrationsweg aus Ihrem Altsystem",
              ].map((p) => (
                <li key={p} className="flex gap-2">
                  <span className="mt-0.5 text-accent">✓</span>
                  {p}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <h4 className="font-serif text-lg font-semibold">Lieber zuerst lesen?</h4>
            <p className="mt-2 text-sm text-muted-foreground">
              Werfen Sie einen Blick ins Trust Center oder die Fallstudien — vielleicht klaeren sich die Fragen schon.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
