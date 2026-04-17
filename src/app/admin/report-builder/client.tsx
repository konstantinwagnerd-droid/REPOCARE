"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Save,
  Share2,
  Download,
  Trash2,
  Plus,
  Search,
  LayoutGrid,
  ExternalLink,
  Hash,
  Gauge,
  Activity,
  TrendingUp,
  LineChart as LineIcon,
  BarChart3,
  PieChart as PieIcon,
  Table as TableIcon,
  Grid3x3,
} from "lucide-react";
import type { Dashboard, DashboardWidget, WidgetType } from "@/lib/reports/types";
import type { WidgetMeta } from "@/lib/reports/widgets";
import { WidgetRenderer } from "./widget-renderer";
import { toast } from "sonner";
import { DATA_PROVIDERS, getProvider } from "@/lib/reports/data-providers";

const IconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Hash, Gauge, Activity, TrendingUp, LineChart: LineIcon, BarChart3, PieChart: PieIcon, Table: TableIcon, Grid3x3,
};

type ProviderSummary = {
  id: string;
  label: string;
  category: string;
  unit?: string;
  compatibleWidgets: string[];
};

type Props = {
  initialDashboards: Dashboard[];
  providers: ProviderSummary[];
  widgetRegistry: Record<WidgetType, WidgetMeta>;
};

const GRID_COLS = 12;
const ROW_HEIGHT = 80;

export function BuilderClient({ initialDashboards, providers, widgetRegistry }: Props) {
  const [dashboards, setDashboards] = useState(initialDashboards);
  const [activeId, setActiveId] = useState(initialDashboards[0]?.id ?? "");
  const active = dashboards.find((d) => d.id === activeId) ?? dashboards[0];

  const [name, setName] = useState(active?.name ?? "Neues Dashboard");
  const [description, setDescription] = useState(active?.description ?? "");
  const [widgets, setWidgets] = useState<DashboardWidget[]>(active?.widgets ?? []);
  const [selectedWidget, setSelectedWidget] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("alle");

  function selectDashboard(d: Dashboard) {
    setActiveId(d.id);
    setName(d.name);
    setDescription(d.description ?? "");
    setWidgets(d.widgets);
    setSelectedWidget(null);
  }

  function newDashboard() {
    setActiveId("");
    setName("Neues Dashboard");
    setDescription("");
    setWidgets([]);
    setSelectedWidget(null);
  }

  async function save() {
    const res = await fetch("/api/reports/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: activeId || undefined, name, description, widgets }),
    });
    const json = await res.json();
    if (json.dashboard) {
      toast.success("Dashboard gespeichert");
      setActiveId(json.dashboard.id);
      setDashboards((prev) => {
        const exists = prev.some((d) => d.id === json.dashboard.id);
        return exists ? prev.map((d) => (d.id === json.dashboard.id ? json.dashboard : d)) : [...prev, json.dashboard];
      });
    } else {
      toast.error("Fehler beim Speichern");
    }
  }

  async function share() {
    if (!activeId) {
      toast.error("Bitte erst speichern");
      return;
    }
    const res = await fetch(`/api/reports/${activeId}/share-link`);
    const json = await res.json();
    if (json.url) {
      await navigator.clipboard.writeText(json.url);
      toast.success("Share-Link in Zwischenablage");
    }
  }

  function addWidget(type: WidgetType, providerId: string) {
    const meta = widgetRegistry[type];
    const provider = providers.find((p) => p.id === providerId);
    if (!provider) return;
    const id = `w_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 5)}`;
    const placedY = widgets.reduce((max, w) => Math.max(max, w.layout.y + w.layout.h), 0);
    const widget: DashboardWidget = {
      id,
      type,
      providerId,
      title: provider.label,
      layout: { i: id, x: 0, y: placedY, w: meta.defaultW, h: meta.defaultH },
      config: { timeframe: "30d", color: "primary" },
    };
    setWidgets((prev) => [...prev, widget]);
    setSelectedWidget(id);
  }

  function removeWidget(id: string) {
    setWidgets((prev) => prev.filter((w) => w.id !== id));
    if (selectedWidget === id) setSelectedWidget(null);
  }

  function updateWidget(id: string, patch: Partial<DashboardWidget>) {
    setWidgets((prev) => prev.map((w) => (w.id === id ? { ...w, ...patch, config: { ...w.config, ...(patch.config ?? {}) } } : w)));
  }

  function moveWidget(id: string, dx: number, dy: number) {
    setWidgets((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w;
        const nx = Math.max(0, Math.min(GRID_COLS - w.layout.w, w.layout.x + dx));
        const ny = Math.max(0, w.layout.y + dy);
        return { ...w, layout: { ...w.layout, x: nx, y: ny } };
      }),
    );
  }

  function resizeWidget(id: string, dw: number, dh: number) {
    setWidgets((prev) =>
      prev.map((w) => {
        if (w.id !== id) return w;
        const nw = Math.max(2, Math.min(GRID_COLS - w.layout.x, w.layout.w + dw));
        const nh = Math.max(2, w.layout.h + dh);
        return { ...w, layout: { ...w.layout, w: nw, h: nh } };
      }),
    );
  }

  const selected = widgets.find((w) => w.id === selectedWidget) ?? null;

  const filteredProviders = useMemo(
    () =>
      providers.filter((p) => {
        if (category !== "alle" && p.category !== category) return false;
        if (search && !p.label.toLowerCase().includes(search.toLowerCase())) return false;
        return true;
      }),
    [providers, category, search],
  );

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-background px-6 py-4">
        <div className="flex items-center gap-3">
          <LayoutGrid className="h-5 w-5 text-primary" />
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-9 w-[260px] text-base font-medium"
          />
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Beschreibung"
            className="h-9 w-[280px] text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            className="h-9 rounded-lg border border-border bg-background px-3 text-sm"
            value={activeId}
            onChange={(e) => {
              const d = dashboards.find((x) => x.id === e.target.value);
              if (d) selectDashboard(d);
            }}
          >
            <option value="">— Neues Dashboard —</option>
            {dashboards.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
          <Button size="sm" variant="outline" onClick={newDashboard}>
            <Plus className="h-4 w-4" /> Neu
          </Button>
          <Button size="sm" variant="outline" onClick={share}>
            <Share2 className="h-4 w-4" /> Teilen
          </Button>
          <Button size="sm" variant="outline" asChild>
            <Link href={activeId ? `/admin/dashboards/${activeId}` : "#"} target="_blank">
              <ExternalLink className="h-4 w-4" /> Ansicht
            </Link>
          </Button>
          {activeId && (
            <Button size="sm" variant="outline" asChild>
              <a href={`/api/reports/${activeId}/export/pdf`} target="_blank" rel="noopener">
                <Download className="h-4 w-4" /> Export
              </a>
            </Button>
          )}
          <Button size="sm" onClick={save}>
            <Save className="h-4 w-4" /> Speichern
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left — widget palette */}
        <aside className="flex w-80 shrink-0 flex-col border-r border-border bg-muted/20">
          <div className="border-b border-border p-4 space-y-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Widget suchen …"
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-1">
              {["alle", "Operativ", "Qualität", "Personal", "Finanzen"].map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`rounded-full px-2 py-0.5 text-[11px] ${category === c ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {filteredProviders.map((p) => (
              <div key={p.id} className="rounded-lg border border-border bg-background p-3">
                <div className="mb-2 flex items-start justify-between gap-2">
                  <div>
                    <div className="text-sm font-semibold">{p.label}</div>
                    <div className="text-[11px] text-muted-foreground">{p.category}{p.unit ? ` · ${p.unit}` : ""}</div>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1">
                  {p.compatibleWidgets.map((wt) => {
                    const meta = widgetRegistry[wt as WidgetType];
                    const Icon = IconMap[meta.iconName] ?? Hash;
                    return (
                      <button
                        key={wt}
                        onClick={() => addWidget(wt as WidgetType, p.id)}
                        className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-[11px] hover:bg-secondary"
                        title={`${meta.label} hinzufügen`}
                      >
                        <Icon className="h-3 w-3" /> {meta.label}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Center — canvas */}
        <main className="flex-1 overflow-auto bg-muted/30 p-6">
          {widgets.length === 0 ? (
            <div className="flex h-full items-center justify-center">
              <div className="text-center text-muted-foreground">
                <LayoutGrid className="mx-auto h-12 w-12 opacity-30" />
                <p className="mt-2">Wähle Widgets aus der Palette links.</p>
              </div>
            </div>
          ) : (
            <div
              className="relative rounded-2xl bg-background p-3 shadow-sm"
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
                gridAutoRows: `${ROW_HEIGHT}px`,
                gap: "0.75rem",
                minHeight: `${ROW_HEIGHT * 8 + 120}px`,
              }}
            >
              {widgets.map((w) => {
                const provider = providers.find((p) => p.id === w.providerId);
                const data = getProvider(w.providerId)?.getData(w.config.timeframe);
                const isSelected = selectedWidget === w.id;
                return (
                  <div
                    key={w.id}
                    onClick={() => setSelectedWidget(w.id)}
                    className={`group relative cursor-pointer overflow-hidden rounded-xl border bg-background p-4 transition ${
                      isSelected ? "border-primary ring-2 ring-primary/40" : "border-border hover:border-primary/40"
                    }`}
                    style={{
                      gridColumn: `${w.layout.x + 1} / span ${w.layout.w}`,
                      gridRow: `${w.layout.y + 1} / span ${w.layout.h}`,
                    }}
                  >
                    <WidgetRenderer widget={w} data={data} providerLabel={provider?.label ?? ""} />
                    <div className="absolute right-1 top-1 hidden gap-1 group-hover:flex">
                      <button onClick={(e) => { e.stopPropagation(); moveWidget(w.id, -1, 0); }} className="rounded bg-background/80 px-1 text-xs hover:bg-secondary">◀</button>
                      <button onClick={(e) => { e.stopPropagation(); moveWidget(w.id, +1, 0); }} className="rounded bg-background/80 px-1 text-xs hover:bg-secondary">▶</button>
                      <button onClick={(e) => { e.stopPropagation(); moveWidget(w.id, 0, -1); }} className="rounded bg-background/80 px-1 text-xs hover:bg-secondary">▲</button>
                      <button onClick={(e) => { e.stopPropagation(); moveWidget(w.id, 0, +1); }} className="rounded bg-background/80 px-1 text-xs hover:bg-secondary">▼</button>
                      <button onClick={(e) => { e.stopPropagation(); resizeWidget(w.id, +1, 0); }} className="rounded bg-background/80 px-1 text-xs hover:bg-secondary" title="breiter">W+</button>
                      <button onClick={(e) => { e.stopPropagation(); resizeWidget(w.id, -1, 0); }} className="rounded bg-background/80 px-1 text-xs hover:bg-secondary" title="schmaler">W−</button>
                      <button onClick={(e) => { e.stopPropagation(); resizeWidget(w.id, 0, +1); }} className="rounded bg-background/80 px-1 text-xs hover:bg-secondary" title="höher">H+</button>
                      <button onClick={(e) => { e.stopPropagation(); resizeWidget(w.id, 0, -1); }} className="rounded bg-background/80 px-1 text-xs hover:bg-secondary" title="niedriger">H−</button>
                      <button onClick={(e) => { e.stopPropagation(); removeWidget(w.id); }} className="rounded bg-destructive/10 px-1 text-xs text-destructive hover:bg-destructive/20">
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>

        {/* Right — widget config */}
        <aside className="w-80 shrink-0 border-l border-border bg-muted/20 p-4">
          <Tabs defaultValue="config">
            <TabsList>
              <TabsTrigger value="config">Konfiguration</TabsTrigger>
              <TabsTrigger value="dashboards">Meine</TabsTrigger>
            </TabsList>
            <TabsContent value="config">
              {!selected ? (
                <p className="mt-6 text-sm text-muted-foreground">Widget auswählen zur Konfiguration.</p>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="w-title">Titel</Label>
                    <Input
                      id="w-title"
                      value={selected.title}
                      onChange={(e) => updateWidget(selected.id, { title: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Zeitraum</Label>
                    <div className="mt-1 flex gap-1">
                      {(["7d", "30d", "90d", "365d"] as const).map((tf) => (
                        <button
                          key={tf}
                          onClick={() => updateWidget(selected.id, { config: { ...selected.config, timeframe: tf } })}
                          className={`rounded-md border px-3 py-1 text-xs ${selected.config.timeframe === tf ? "border-primary bg-primary/10 text-primary" : "border-border"}`}
                        >
                          {tf}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Farbe</Label>
                    <div className="mt-1 flex gap-2">
                      {(["primary", "accent", "emerald", "amber", "rose"] as const).map((c) => (
                        <button
                          key={c}
                          onClick={() => updateWidget(selected.id, { config: { ...selected.config, color: c } })}
                          className={`h-8 w-8 rounded-full border-2 ${selected.config.color === c ? "border-foreground" : "border-transparent"}`}
                          style={{
                            backgroundColor: {
                              primary: "#0d7377",
                              accent: "#ff6a3d",
                              emerald: "#059669",
                              amber: "#d97706",
                              rose: "#e11d48",
                            }[c],
                          }}
                          aria-label={`Farbe ${c}`}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label>Datenquelle</Label>
                    <select
                      className="mt-1 w-full rounded-lg border border-border bg-background p-2 text-sm"
                      value={selected.providerId}
                      onChange={(e) => updateWidget(selected.id, { providerId: e.target.value })}
                    >
                      {DATA_PROVIDERS.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
                    </select>
                  </div>
                  <Button size="sm" variant="destructive" onClick={() => removeWidget(selected.id)}>
                    <Trash2 className="h-4 w-4" /> Widget entfernen
                  </Button>
                </div>
              )}
            </TabsContent>
            <TabsContent value="dashboards">
              <div className="space-y-2">
                {dashboards.map((d) => (
                  <Card key={d.id} className={activeId === d.id ? "ring-2 ring-primary/40" : ""}>
                    <CardContent className="p-3">
                      <button onClick={() => selectDashboard(d)} className="block text-left">
                        <div className="text-sm font-semibold">{d.name}</div>
                        <div className="text-xs text-muted-foreground">{d.widgets.length} Widgets</div>
                        {d.description && <div className="mt-1 text-[11px] text-muted-foreground">{d.description}</div>}
                      </button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </aside>
      </div>
    </div>
  );
}
