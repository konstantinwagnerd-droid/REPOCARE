import { randomUUID } from "crypto";
import type { Dashboard, DashboardWidget } from "./types";

const dashboards: Map<string, Dashboard> = new Map();
const shareTokens: Map<string, string> = new Map(); // token -> dashboardId

function w(id: string, type: DashboardWidget["type"], providerId: string, title: string, x: number, y: number, ww: number, h: number): DashboardWidget {
  return {
    id,
    type,
    providerId,
    title,
    layout: { i: id, x, y, w: ww, h },
    config: { timeframe: "30d", color: "primary", showTarget: false },
  };
}

function seed() {
  if (dashboards.size > 0) return;
  const now = new Date();
  const ops: Dashboard = {
    id: "dash_ops",
    tenantId: "demo",
    name: "Operative Übersicht",
    description: "Tagesgeschäft auf einen Blick",
    createdBy: "system",
    createdAt: now,
    updatedAt: now,
    widgets: [
      w("w1", "stat-card", "resident-count", "Bewohner:innen", 0, 0, 3, 2),
      w("w2", "stat-card", "bed-occupancy", "Auslastung", 3, 0, 3, 2),
      w("w3", "stat-card", "care-reports-today", "Berichte heute", 6, 0, 3, 2),
      w("w4", "stat-card", "documentation-time", "Doku-Zeit", 9, 0, 3, 2),
      w("w5", "line-chart", "documentation-time", "Doku-Zeit — 30 Tage", 0, 2, 6, 4),
      w("w6", "table", "incident-table", "Vorfälle aktuell", 6, 2, 6, 4),
    ],
  };
  const quality: Dashboard = {
    id: "dash_quality",
    tenantId: "demo",
    name: "Qualitäts-Dashboard",
    description: "§ 113 SGB XI Qualitätsindikatoren",
    createdBy: "system",
    createdAt: now,
    updatedAt: now,
    widgets: [
      w("w1", "kpi-tile", "fall-risk-avg", "Sturzrisiko", 0, 0, 3, 2),
      w("w2", "kpi-tile", "pressure-ulcers", "Dekubitus", 3, 0, 3, 2),
      w("w3", "kpi-tile", "medication-compliance", "Medi-Compliance", 6, 0, 3, 2),
      w("w4", "kpi-tile", "sis-completeness", "SIS-Vollständigkeit", 9, 0, 3, 2),
      w("w5", "line-chart", "fall-risk-avg", "Sturzrisiko-Trend", 0, 2, 12, 4),
    ],
  };
  const staff: Dashboard = {
    id: "dash_staff",
    tenantId: "demo",
    name: "Personal-Dashboard",
    description: "Krankenstand, Überstunden, Abdeckung",
    createdBy: "system",
    createdAt: now,
    updatedAt: now,
    widgets: [
      w("w1", "stat-card", "staff-headcount", "Pflegekräfte", 0, 0, 3, 2),
      w("w2", "stat-card", "sick-leave", "Krankenstand", 3, 0, 3, 2),
      w("w3", "stat-card", "overtime-hours", "Überstunden", 6, 0, 3, 2),
      w("w4", "stat-card", "staff-nps", "NPS", 9, 0, 3, 2),
      w("w5", "bar-chart", "overtime-hours", "Überstunden pro Woche", 0, 2, 6, 4),
      w("w6", "line-chart", "sick-leave", "Krankenstand-Trend", 6, 2, 6, 4),
    ],
  };
  const finance: Dashboard = {
    id: "dash_finance",
    tenantId: "demo",
    name: "Finanz-Dashboard",
    description: "Umsatz, Kostendeckung, Abrechnung",
    createdBy: "system",
    createdAt: now,
    updatedAt: now,
    widgets: [
      w("w1", "kpi-tile", "revenue-per-resident", "Umsatz/Bewohner", 0, 0, 4, 2),
      w("w2", "kpi-tile", "cost-coverage", "Kostendeckung", 4, 0, 4, 2),
      w("w3", "kpi-tile", "billing-rate", "Abrechnungs-Quote", 8, 0, 4, 2),
      w("w4", "line-chart", "revenue-per-resident", "Umsatz-Entwicklung", 0, 2, 8, 4),
      w("w5", "pie-chart", "billing-rate", "Abrechnungs-Mix", 8, 2, 4, 4),
    ],
  };
  [ops, quality, staff, finance].forEach((d) => dashboards.set(d.id, d));
}

export function listDashboards(tenantId: string): Dashboard[] {
  seed();
  return [...dashboards.values()].filter((d) => d.tenantId === tenantId || d.tenantId === "demo");
}

export function getDashboard(id: string): Dashboard | undefined {
  seed();
  return dashboards.get(id);
}

export function getByShareToken(token: string): Dashboard | undefined {
  seed();
  const id = shareTokens.get(token);
  return id ? dashboards.get(id) : undefined;
}

export function saveDashboard(input: Omit<Dashboard, "id" | "createdAt" | "updatedAt"> & { id?: string }): Dashboard {
  seed();
  const now = new Date();
  if (input.id && dashboards.has(input.id)) {
    const existing = dashboards.get(input.id)!;
    const next: Dashboard = { ...existing, ...input, id: existing.id, updatedAt: now };
    dashboards.set(existing.id, next);
    return next;
  }
  const id = `dash_${randomUUID().slice(0, 10)}`;
  const dash: Dashboard = { ...input, id, createdAt: now, updatedAt: now };
  dashboards.set(id, dash);
  return dash;
}

export function createShareToken(dashboardId: string): string {
  const token = `shr_${randomUUID().replace(/-/g, "").slice(0, 24)}`;
  shareTokens.set(token, dashboardId);
  const d = dashboards.get(dashboardId);
  if (d) dashboards.set(dashboardId, { ...d, shareToken: token });
  return token;
}
