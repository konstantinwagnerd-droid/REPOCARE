import type { WidgetType } from "./types";

export interface WidgetMeta {
  type: WidgetType;
  label: string;
  description: string;
  defaultW: number;
  defaultH: number;
  iconName: string;
}

export const WIDGET_REGISTRY: Record<WidgetType, WidgetMeta> = {
  "stat-card": {
    type: "stat-card",
    label: "Stat-Card",
    description: "Große Kennzahl mit Delta",
    defaultW: 3,
    defaultH: 2,
    iconName: "Hash",
  },
  "kpi-tile": {
    type: "kpi-tile",
    label: "KPI-Kachel",
    description: "Kompakte Kachel mit Ziel",
    defaultW: 3,
    defaultH: 2,
    iconName: "Gauge",
  },
  "line-chart": {
    type: "line-chart",
    label: "Liniendiagramm",
    description: "Zeitliche Entwicklung",
    defaultW: 6,
    defaultH: 4,
    iconName: "LineChart",
  },
  "bar-chart": {
    type: "bar-chart",
    label: "Balkendiagramm",
    description: "Vergleich von Kategorien",
    defaultW: 6,
    defaultH: 4,
    iconName: "BarChart3",
  },
  "pie-chart": {
    type: "pie-chart",
    label: "Kreisdiagramm",
    description: "Verteilung als Anteile",
    defaultW: 4,
    defaultH: 4,
    iconName: "PieChart",
  },
  table: {
    type: "table",
    label: "Tabelle",
    description: "Detaillierte Datenliste",
    defaultW: 6,
    defaultH: 4,
    iconName: "Table",
  },
  heatmap: {
    type: "heatmap",
    label: "Heatmap",
    description: "Farbcodierte Matrix",
    defaultW: 6,
    defaultH: 4,
    iconName: "Grid3x3",
  },
  sparkline: {
    type: "sparkline",
    label: "Sparkline",
    description: "Mini-Trendlinie",
    defaultW: 3,
    defaultH: 2,
    iconName: "Activity",
  },
  "trend-indicator": {
    type: "trend-indicator",
    label: "Trend-Indikator",
    description: "Pfeil mit Delta",
    defaultW: 2,
    defaultH: 2,
    iconName: "TrendingUp",
  },
};
