/**
 * Multi-Tenant / Gruppen-Rollup Typen
 *
 * Model:
 *  - Group: Trägerverbund (z.B. Caritas Wien Gruppe)
 *  - Facility: einzelne Einrichtung (Pflegeheim) innerhalb einer Gruppe
 *  - Member: Verknüpfung User ↔ Group mit Rolle
 */

export type GroupRole = "group_admin" | "group_viewer";

export type RollupScope = "group" | "region" | "facility";

export type AggregationKind = "sum" | "avg" | "median" | "min" | "max";

export interface FacilityRef {
  id: string;
  name: string;
  city: string;
  region: string; // Bundesland
  country: "AT" | "DE";
  beds: number;
  staff: number;
  traegerType: "public" | "private" | "church" | "nonprofit";
  status: "active" | "paused" | "audit-review";
  lat: number;
  lng: number;
  lastAuditAt?: string; // ISO
}

export interface GroupRecord {
  id: string;
  name: string;
  slug: string;
  logoText: string; // Kurzform für Logo-Kachel
  traegerType: FacilityRef["traegerType"];
  country: "AT" | "DE";
  foundedYear: number;
  facilities: FacilityRef[];
}

export interface FacilityKpiSnapshot {
  facilityId: string;
  month: string; // YYYY-MM
  occupancyPct: number; // 0..100
  avgPflegegrad: number; // 1..5
  staffTurnoverPct: number;
  documentationRatePct: number;
  incidentRate: number; // pro 1000 Belegtage
  complaints: number; // absolut/Monat
  revenueEur: number;
  costEur: number;
  ebitdaEur: number;
  complianceQuotePct: number;
  mdCheckOpenFindings: number;
  dsgvoRequestsOpen: number;
}

export interface GroupKpiRollup {
  scope: RollupScope;
  groupId: string;
  month: string;
  totals: {
    beds: number;
    staff: number;
    facilities: number;
    revenueEur: number;
    costEur: number;
    ebitdaEur: number;
  };
  averages: {
    occupancyPct: number;
    avgPflegegrad: number;
    staffTurnoverPct: number;
    documentationRatePct: number;
    incidentRate: number;
    complianceQuotePct: number;
  };
  medians: {
    occupancyPct: number;
    incidentRate: number;
  };
  totalsAdditional: {
    complaints: number;
    mdCheckOpenFindings: number;
    dsgvoRequestsOpen: number;
  };
}

export interface FacilityComparison {
  facilityId: string;
  facilityName: string;
  metric: keyof FacilityKpiSnapshot;
  value: number;
  median: number;
  deviationPct: number; // (value-median)/median*100
  rank: number; // 1 = best
  percentile: number; // 0..100
  status: "best" | "above" | "median" | "below" | "worst";
}

export interface GroupAccessContext {
  userId: string;
  groupRole: GroupRole | null;
  groupId: string | null;
  canView: (scope: RollupScope, facilityId?: string) => boolean;
}
