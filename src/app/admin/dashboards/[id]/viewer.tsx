"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { Dashboard } from "@/lib/reports/types";
import { getProvider } from "@/lib/reports/data-providers";
import { WidgetRenderer } from "../../report-builder/widget-renderer";
import { Button } from "@/components/ui/button";
import { Printer, Expand, RefreshCcw, Moon, Sun, ArrowLeft } from "lucide-react";

const GRID_COLS = 12;
const ROW_HEIGHT = 100;

export function DashboardViewer({ dashboard, theme: initialTheme }: { dashboard: Dashboard; theme: "light" | "dark" }) {
  const [refresh, setRefresh] = useState(0);
  const [interval, setIntervalMin] = useState<0 | 1 | 5 | 15 | 60>(0);
  const [theme, setTheme] = useState<"light" | "dark">(initialTheme);
  const [fullscreen, setFullscreen] = useState(false);

  useEffect(() => {
    if (interval === 0) return;
    const id = setInterval(() => setRefresh((r) => r + 1), interval * 60_000);
    return () => clearInterval(id);
  }, [interval]);

  async function toggleFullscreen() {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else {
      await document.exitFullscreen();
      setFullscreen(false);
    }
  }

  const bg = theme === "dark" ? "bg-[#0c1524] text-white" : "bg-muted/30 text-foreground";
  const cardBg = theme === "dark" ? "bg-[#101d33] border-white/10" : "bg-background border-border";

  return (
    <div className={`min-h-[calc(100vh-4rem)] ${bg} print:bg-white print:text-black`}>
      <header className={`flex flex-wrap items-center justify-between gap-3 border-b p-4 print:hidden ${theme === "dark" ? "border-white/10" : "border-border"}`}>
        <div className="flex items-center gap-3">
          <Button size="sm" variant="ghost" asChild>
            <Link href="/admin/report-builder">
              <ArrowLeft className="h-4 w-4" /> Builder
            </Link>
          </Button>
          <div>
            <h1 className="font-serif text-2xl font-semibold">{dashboard.name}</h1>
            <p className="text-xs opacity-70">{dashboard.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select
            className={`h-9 rounded-lg border px-2 text-sm ${theme === "dark" ? "border-white/20 bg-[#0c1524]" : "border-border bg-background"}`}
            value={interval}
            onChange={(e) => setIntervalMin(Number(e.target.value) as 0 | 1 | 5 | 15 | 60)}
          >
            <option value={0}>Manuell</option>
            <option value={1}>Auto 1&nbsp;Min</option>
            <option value={5}>Auto 5&nbsp;Min</option>
            <option value={15}>Auto 15&nbsp;Min</option>
            <option value={60}>Auto 60&nbsp;Min</option>
          </select>
          <Button size="sm" variant="outline" onClick={() => setRefresh((r) => r + 1)}>
            <RefreshCcw className="h-4 w-4" /> Refresh
          </Button>
          <Button size="sm" variant="outline" onClick={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}>
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {theme === "dark" ? "Hell" : "Wall-Screen"}
          </Button>
          <Button size="sm" variant="outline" onClick={toggleFullscreen}>
            <Expand className="h-4 w-4" /> {fullscreen ? "Beenden" : "Fullscreen"}
          </Button>
          <Button size="sm" variant="outline" onClick={() => window.print()}>
            <Printer className="h-4 w-4" /> Drucken
          </Button>
        </div>
      </header>

      <div
        className="p-6 print:p-2"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
          gridAutoRows: `${ROW_HEIGHT}px`,
          gap: "0.75rem",
        }}
      >
        {dashboard.widgets.map((w) => {
          const provider = getProvider(w.providerId);
          const data = provider?.getData(w.config.timeframe);
          return (
            <div
              key={`${w.id}-${refresh}`}
              className={`overflow-hidden rounded-xl border p-4 shadow-sm ${cardBg}`}
              style={{
                gridColumn: `${w.layout.x + 1} / span ${w.layout.w}`,
                gridRow: `${w.layout.y + 1} / span ${w.layout.h}`,
              }}
            >
              <WidgetRenderer widget={w} data={data} providerLabel={provider?.label ?? ""} />
            </div>
          );
        })}
      </div>

      <footer className={`px-6 pb-6 text-xs opacity-60 print:text-black ${theme === "dark" ? "text-white" : ""}`}>
        CareAI · Aktualisiert {new Date().toLocaleString("de-AT")}
      </footer>
      <style>{`@media print { @page { size: A3 landscape; margin: 8mm; } }`}</style>
    </div>
  );
}
