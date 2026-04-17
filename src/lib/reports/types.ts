export const WIDGET_TYPES = [
  "stat-card",
  "line-chart",
  "bar-chart",
  "pie-chart",
  "table",
  "heatmap",
  "sparkline",
  "kpi-tile",
  "trend-indicator",
] as const;

export type WidgetType = (typeof WIDGET_TYPES)[number];

export const WIDGET_CATEGORIES = ["Operativ", "Qualität", "Personal", "Finanzen", "Vergleich"] as const;
export type WidgetCategory = (typeof WIDGET_CATEGORIES)[number];

export interface WidgetLayout {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface WidgetConfig {
  timeframe?: "7d" | "30d" | "90d" | "365d";
  color?: "primary" | "accent" | "emerald" | "amber" | "rose";
  filter?: string;
  showTarget?: boolean;
}

export interface DashboardWidget {
  id: string;
  type: WidgetType;
  providerId: string;
  title: string;
  subtitle?: string;
  layout: WidgetLayout;
  config: WidgetConfig;
}

export interface Dashboard {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  widgets: DashboardWidget[];
  shareToken?: string;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface WidgetDataPoint {
  label: string;
  value: number;
  target?: number;
  delta?: number;
}

export interface WidgetData {
  current: number | string;
  unit?: string;
  delta?: number;
  goodDirection?: "up" | "down";
  series?: WidgetDataPoint[];
  headers?: string[];
  rows?: (string | number)[][];
}
