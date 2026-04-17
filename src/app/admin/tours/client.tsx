"use client";

import { useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TourProvider, useTour } from "@/components/tour/TourProvider";
import { getAllTours } from "@/lib/tour/registry";
import { resetAllTours, resetTour } from "@/lib/tour/store";

function DemoList() {
  const { startTour } = useTour();
  const tours = getAllTours();
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <div className="mt-8 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl font-semibold">Verfuegbare Touren ({tours.length})</h2>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            resetAllTours();
            setMsg("Alle Tour-Fortschritte zurueckgesetzt.");
            setTimeout(() => setMsg(null), 3000);
          }}
        >
          <RotateCcw className="mr-2 h-4 w-4" /> Alle zuruecksetzen
        </Button>
      </div>
      {msg && <div className="rounded border border-primary/30 bg-primary/5 p-2 text-sm text-primary">{msg}</div>}

      <ul className="grid gap-3 md:grid-cols-2">
        {tours.map((t) => (
          <li key={t.id} className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="text-xs uppercase tracking-wide text-muted-foreground">{t.role}</div>
                <h3 className="mt-1 font-medium">{t.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>
                <p className="mt-2 text-xs text-muted-foreground">{t.steps.length} Schritte</p>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <Button
                type="button"
                variant="accent"
                size="sm"
                onClick={() => {
                  resetTour(t.id);
                  startTour(t.id);
                }}
              >
                <Play className="mr-2 h-4 w-4" /> Starten
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ToursDemoClient() {
  return (
    <TourProvider disableAutoStart>
      <DemoList />
    </TourProvider>
  );
}
