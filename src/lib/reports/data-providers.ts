import type { WidgetData } from "./types";

export interface DataProvider {
  id: string;
  label: string;
  category: "Operativ" | "Qualität" | "Personal" | "Finanzen" | "Vergleich";
  unit?: string;
  goodDirection?: "up" | "down";
  compatibleWidgets: string[];
  getData: (timeframe?: string) => WidgetData;
}

function days(n: number, base: number, variance = 0.1) {
  return Array.from({ length: n }, (_, i) => ({
    label: `T${i + 1}`,
    value: Math.round(base * (1 + (Math.sin(i / 2) - 0.5) * variance) * 100) / 100,
  }));
}

export const DATA_PROVIDERS: DataProvider[] = [
  {
    id: "resident-count",
    label: "Bewohner:innen (aktiv)",
    category: "Operativ",
    unit: "",
    compatibleWidgets: ["stat-card", "kpi-tile", "line-chart"],
    getData: () => ({ current: 82, delta: +2, series: days(30, 82, 0.04) }),
  },
  {
    id: "bed-occupancy",
    label: "Bettenauslastung",
    category: "Operativ",
    unit: "%",
    goodDirection: "up",
    compatibleWidgets: ["stat-card", "kpi-tile", "sparkline", "trend-indicator"],
    getData: () => ({ current: 96.5, unit: "%", delta: +1.2, goodDirection: "up", series: days(14, 96) }),
  },
  {
    id: "documentation-time",
    label: "Dokumentationszeit pro Schicht (Ø)",
    category: "Operativ",
    unit: "Min",
    goodDirection: "down",
    compatibleWidgets: ["stat-card", "line-chart", "trend-indicator"],
    getData: () => ({ current: 42, unit: "Min", delta: -67, goodDirection: "down", series: days(30, 55, 0.3) }),
  },
  {
    id: "care-reports-today",
    label: "Pflegeberichte heute",
    category: "Operativ",
    unit: "",
    compatibleWidgets: ["stat-card", "kpi-tile", "bar-chart"],
    getData: () => ({ current: 128, delta: +14, series: days(14, 120, 0.15) }),
  },
  {
    id: "fall-risk-avg",
    label: "Sturzrisiko (Ø-Score)",
    category: "Qualität",
    unit: "",
    goodDirection: "down",
    compatibleWidgets: ["stat-card", "line-chart", "trend-indicator"],
    getData: () => ({ current: 2.4, delta: -0.3, goodDirection: "down", series: days(30, 2.6, 0.15) }),
  },
  {
    id: "pressure-ulcers",
    label: "Dekubitus-Inzidenz",
    category: "Qualität",
    unit: "%",
    goodDirection: "down",
    compatibleWidgets: ["stat-card", "line-chart", "trend-indicator"],
    getData: () => ({ current: 1.8, unit: "%", delta: -0.4, goodDirection: "down", series: days(30, 2.1) }),
  },
  {
    id: "medication-compliance",
    label: "Medikamenten-Compliance",
    category: "Qualität",
    unit: "%",
    goodDirection: "up",
    compatibleWidgets: ["stat-card", "kpi-tile", "pie-chart"],
    getData: () => ({
      current: 98.7,
      unit: "%",
      delta: +0.5,
      goodDirection: "up",
      series: [
        { label: "On-time", value: 98.7 },
        { label: "Verspätet", value: 1.1 },
        { label: "Ausgelassen", value: 0.2 },
      ],
    }),
  },
  {
    id: "sis-completeness",
    label: "SIS-Vollständigkeit",
    category: "Qualität",
    unit: "%",
    goodDirection: "up",
    compatibleWidgets: ["stat-card", "kpi-tile", "trend-indicator"],
    getData: () => ({ current: 98, unit: "%", delta: +4, goodDirection: "up", series: days(30, 96) }),
  },
  {
    id: "audit-mdk-readiness",
    label: "MDK-konforme Einträge",
    category: "Qualität",
    unit: "%",
    goodDirection: "up",
    compatibleWidgets: ["stat-card", "kpi-tile"],
    getData: () => ({ current: 100, unit: "%", delta: 0, goodDirection: "up" }),
  },
  {
    id: "staff-headcount",
    label: "Pflegekräfte gesamt",
    category: "Personal",
    compatibleWidgets: ["stat-card", "kpi-tile"],
    getData: () => ({ current: 46, delta: +2, series: days(12, 45, 0.05) }),
  },
  {
    id: "sick-leave",
    label: "Krankenstand",
    category: "Personal",
    unit: "%",
    goodDirection: "down",
    compatibleWidgets: ["stat-card", "line-chart", "trend-indicator"],
    getData: () => ({ current: 4.8, unit: "%", delta: -0.6, goodDirection: "down", series: days(12, 5.4) }),
  },
  {
    id: "overtime-hours",
    label: "Überstunden (Woche)",
    category: "Personal",
    unit: "h",
    goodDirection: "down",
    compatibleWidgets: ["stat-card", "bar-chart", "sparkline"],
    getData: () => ({ current: 82, unit: "h", delta: -18, goodDirection: "down", series: days(8, 92) }),
  },
  {
    id: "shift-coverage",
    label: "Schichten-Abdeckung",
    category: "Personal",
    unit: "%",
    goodDirection: "up",
    compatibleWidgets: ["stat-card", "heatmap"],
    getData: () => ({ current: 99.2, unit: "%", delta: +0.8, goodDirection: "up", series: days(14, 98.5) }),
  },
  {
    id: "staff-nps",
    label: "Mitarbeiter-NPS",
    category: "Personal",
    unit: "",
    goodDirection: "up",
    compatibleWidgets: ["stat-card", "kpi-tile", "trend-indicator"],
    getData: () => ({ current: 62, delta: +12, goodDirection: "up" }),
  },
  {
    id: "revenue-per-resident",
    label: "Umsatz pro Bewohner:in (Monat)",
    category: "Finanzen",
    unit: "€",
    goodDirection: "up",
    compatibleWidgets: ["stat-card", "kpi-tile", "bar-chart"],
    getData: () => ({ current: 4820, unit: "€", delta: +120, goodDirection: "up", series: days(12, 4750, 0.04) }),
  },
  {
    id: "cost-coverage",
    label: "Kostendeckungsgrad",
    category: "Finanzen",
    unit: "%",
    goodDirection: "up",
    compatibleWidgets: ["stat-card", "kpi-tile", "trend-indicator"],
    getData: () => ({ current: 108.4, unit: "%", delta: +2.1, goodDirection: "up" }),
  },
  {
    id: "billing-rate",
    label: "Abrechnungs-Quote",
    category: "Finanzen",
    unit: "%",
    goodDirection: "up",
    compatibleWidgets: ["stat-card", "kpi-tile", "pie-chart"],
    getData: () => ({
      current: 97.3,
      unit: "%",
      delta: +1.5,
      goodDirection: "up",
      series: [
        { label: "Abgerechnet", value: 97.3 },
        { label: "Offen", value: 2.4 },
        { label: "Abgelehnt", value: 0.3 },
      ],
    }),
  },
  {
    id: "incident-table",
    label: "Vorfälle (Tabelle)",
    category: "Operativ",
    compatibleWidgets: ["table"],
    getData: () => ({
      current: 7,
      headers: ["Datum", "Bewohner:in", "Art", "Schwere"],
      rows: [
        ["15.04.", "Huber, Anna", "Sturz", "leicht"],
        ["14.04.", "Müller, Karl", "Medikation", "moderat"],
        ["13.04.", "Novak, Ida", "Sturz", "leicht"],
        ["12.04.", "Wagner, Franz", "Aggression", "leicht"],
      ],
    }),
  },
];

export function getProvider(id: string): DataProvider | undefined {
  return DATA_PROVIDERS.find((p) => p.id === id);
}
