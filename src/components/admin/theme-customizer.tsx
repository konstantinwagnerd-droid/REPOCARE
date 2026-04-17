"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sparkles, Check } from "lucide-react";

/**
 * Tenant-Theme-Customizer.
 * Wird vom Enterprise-Agent in /admin/settings/theme eingebettet.
 * Benoetigt DB-Spalte tenants.theme_json (siehe src/db/patches/002-theme.sql).
 *
 * API (Stub):
 *   GET  /api/tenant/theme    -> { primary, accent, logoUrl }
 *   POST /api/tenant/theme    -> akzeptiert { primary, accent, logoUrl }
 */

const presets = [
  { name: "Petrol (Standard)", primary: "#0F766E", accent: "#F97316" },
  { name: "Tief-Blau", primary: "#1D4ED8", accent: "#F59E0B" },
  { name: "Waldgruen", primary: "#166534", accent: "#B45309" },
  { name: "Bordeaux", primary: "#9F1239", accent: "#D97706" },
  { name: "Aubergine", primary: "#6B21A8", accent: "#F97316" },
];

export function ThemeCustomizer() {
  const [primary, setPrimary] = useState(presets[0].primary);
  const [accent, setAccent] = useState(presets[0].accent);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  // Live-Preview via CSS-Variablen auf :root[data-tenant-preview]
  useEffect(() => {
    const root = document.documentElement;
    root.dataset.tenantPreview = "true";
    root.style.setProperty("--tenant-primary", primary);
    root.style.setProperty("--tenant-accent", accent);
    return () => {
      delete root.dataset.tenantPreview;
      root.style.removeProperty("--tenant-primary");
      root.style.removeProperty("--tenant-accent");
    };
  }, [primary, accent]);

  const save = async () => {
    setSaving(true);
    try {
      await fetch("/api/tenant/theme", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ primary, accent }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardContent className="p-6">
          <h2 className="font-serif text-xl font-semibold">Farbschema</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Aendert sich live — wird erst gespeichert, wenn Sie &quot;Uebernehmen&quot; klicken.
          </p>

          <div className="mt-6">
            <Label>Presets</Label>
            <div className="mt-2 grid gap-2 md:grid-cols-2 lg:grid-cols-3">
              {presets.map((p) => {
                const active = p.primary === primary && p.accent === accent;
                return (
                  <button
                    key={p.name}
                    onClick={() => {
                      setPrimary(p.primary);
                      setAccent(p.accent);
                    }}
                    className={`flex items-center gap-3 rounded-xl border p-3 text-left ${
                      active ? "border-primary bg-primary/5" : "border-border hover:bg-secondary"
                    }`}
                  >
                    <div className="flex h-8 w-14 overflow-hidden rounded-md border border-border/40">
                      <span className="flex-1" style={{ background: p.primary }} />
                      <span className="flex-1" style={{ background: p.accent }} />
                    </div>
                    <span className="text-sm font-medium">{p.name}</span>
                    {active && <Check className="ml-auto h-4 w-4 text-primary" />}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="primary">Primaerfarbe</Label>
              <div className="mt-2 flex items-center gap-3">
                <input
                  id="primary"
                  type="color"
                  value={primary}
                  onChange={(e) => setPrimary(e.target.value)}
                  className="h-10 w-14 cursor-pointer rounded"
                />
                <code className="rounded bg-muted px-2 py-1 text-sm">{primary}</code>
              </div>
            </div>
            <div>
              <Label htmlFor="accent">Akzentfarbe</Label>
              <div className="mt-2 flex items-center gap-3">
                <input
                  id="accent"
                  type="color"
                  value={accent}
                  onChange={(e) => setAccent(e.target.value)}
                  className="h-10 w-14 cursor-pointer rounded"
                />
                <code className="rounded bg-muted px-2 py-1 text-sm">{accent}</code>
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-3">
            <Button variant="accent" onClick={save} disabled={saving}>
              {saving ? "Wird gespeichert …" : saved ? "Gespeichert" : "Uebernehmen"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setPrimary(presets[0].primary);
                setAccent(presets[0].accent);
              }}
            >
              Zuruecksetzen
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <h3 className="font-serif text-lg font-semibold">Vorschau</h3>
          <div className="mt-4 space-y-4">
            <div
              className="flex items-center gap-3 rounded-xl p-4 text-white"
              style={{ background: primary }}
            >
              <Sparkles className="h-5 w-5" />
              <span className="font-serif text-lg font-semibold">Header</span>
            </div>
            <button
              className="w-full rounded-lg py-3 text-white"
              style={{ background: accent }}
            >
              Aktions-Button
            </button>
            <div
              className="rounded-xl border p-4"
              style={{ borderColor: primary, background: `${primary}10` }}
            >
              <div className="text-xs font-medium uppercase tracking-wider" style={{ color: primary }}>
                Badge
              </div>
              <p className="mt-1 text-sm text-muted-foreground">Beispiel-Inhalt mit Tenant-Theme.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
