"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles } from "lucide-react";

function fmtEur(cents: number): string {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" }).format(cents / 100);
}

export function ControllingSimulator({
  personalkostenCents,
  deckungsbeitragCents,
}: {
  personalkostenCents: number;
  deckungsbeitragCents: number;
}) {
  const [deltaStellen, setDeltaStellen] = useState(0);
  const [stundenSatz, setStundenSatz] = useState(2200); // in cents
  const stundenProMonat = 160;
  const deltaKosten = deltaStellen * stundenSatz * stundenProMonat;
  const neuPersonalkosten = personalkostenCents + deltaKosten;
  const neuDeckungsbeitrag = deckungsbeitragCents - deltaKosten;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" /> Was-wäre-wenn Simulator
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-muted-foreground">
          Ändere Personal-Stellen und Stundensatz, um Auswirkung auf Deckungsbeitrag zu sehen.
        </p>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="delta-stellen">Stellen-Änderung (−5 bis +5)</Label>
            <Input
              id="delta-stellen"
              type="number"
              min={-5}
              max={5}
              step={1}
              value={deltaStellen}
              onChange={(e) => setDeltaStellen(Number(e.target.value))}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              Positiv = Stelle dazu, negativ = Stelle weniger.
            </p>
          </div>
          <div>
            <Label htmlFor="stundensatz">Stundensatz (Cent brutto/h)</Label>
            <Input
              id="stundensatz"
              type="number"
              min={500}
              max={5000}
              step={50}
              value={stundenSatz}
              onChange={(e) => setStundenSatz(Number(e.target.value))}
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {fmtEur(stundenSatz)} / Stunde · 160 h/Monat
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 rounded-xl border border-border bg-muted/30 p-4 md:grid-cols-3">
          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Personalkosten neu</div>
            <div className="mt-1 text-xl font-semibold">{fmtEur(neuPersonalkosten)}</div>
            <div className="text-xs text-muted-foreground">
              {deltaKosten >= 0 ? "+" : ""}
              {fmtEur(deltaKosten)}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Deckungsbeitrag neu</div>
            <div
              className={`mt-1 text-xl font-semibold ${
                neuDeckungsbeitrag >= deckungsbeitragCents ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {fmtEur(neuDeckungsbeitrag)}
            </div>
            <div className="text-xs text-muted-foreground">
              {-deltaKosten >= 0 ? "+" : ""}
              {fmtEur(-deltaKosten)}
            </div>
          </div>
          <div>
            <div className="text-xs uppercase tracking-wide text-muted-foreground">Auswirkung / Jahr</div>
            <div
              className={`mt-1 text-xl font-semibold ${
                -deltaKosten >= 0 ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {-deltaKosten >= 0 ? "+" : ""}
              {fmtEur(-deltaKosten * 12)}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
