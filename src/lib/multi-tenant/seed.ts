import type { FacilityKpiSnapshot, FacilityRef, GroupRecord } from "./types";

/**
 * In-Memory-Seed für 3 Demo-Trägerverbünde.
 * WICHTIG: kein Schema-Change — dient ausschließlich zur Visualisierung
 * in der Group-Level-UI. In Produktion würden diese aus der DB kommen.
 */

const mkFacility = (
  id: string,
  name: string,
  city: string,
  region: string,
  country: "AT" | "DE",
  beds: number,
  staff: number,
  traegerType: FacilityRef["traegerType"],
  lat: number,
  lng: number,
  status: FacilityRef["status"] = "active",
  lastAuditAt?: string,
): FacilityRef => ({ id, name, city, region, country, beds, staff, traegerType, lat, lng, status, lastAuditAt });

export const GROUPS: GroupRecord[] = [
  {
    id: "grp-caritas-wien",
    slug: "caritas-wien",
    name: "Caritas Wien Gruppe",
    logoText: "CW",
    traegerType: "church",
    country: "AT",
    foundedYear: 1922,
    facilities: [
      mkFacility("cw-01", "Haus Albrechtskreithgasse", "Wien", "Wien", "AT", 132, 98, "church", 48.217, 16.318, "active", "2026-02-14"),
      mkFacility("cw-02", "Haus Peter Jordan", "Wien", "Wien", "AT", 84, 67, "church", 48.235, 16.335, "active", "2026-01-08"),
      mkFacility("cw-03", "Haus Hietzing", "Wien", "Wien", "AT", 156, 118, "church", 48.186, 16.306, "active", "2025-11-22"),
      mkFacility("cw-04", "Haus Leopoldau", "Wien", "Wien", "AT", 98, 74, "church", 48.281, 16.452, "active", "2026-03-03"),
      mkFacility("cw-05", "Haus St. Barbara", "Wien", "Wien", "AT", 72, 54, "church", 48.198, 16.371, "audit-review", "2026-03-27"),
      mkFacility("cw-06", "Haus Wieden", "Wien", "Wien", "AT", 64, 48, "church", 48.194, 16.37, "active", "2025-12-12"),
      mkFacility("cw-07", "Haus Döbling", "Wien", "Wien", "AT", 108, 82, "church", 48.251, 16.356, "active", "2026-02-02"),
      mkFacility("cw-08", "Haus Favoriten", "Wien", "Wien", "AT", 144, 108, "church", 48.171, 16.379, "active", "2026-01-19"),
    ],
  },
  {
    id: "grp-awo-bayern",
    slug: "awo-bayern-sued",
    name: "AWO Bayern Süd",
    logoText: "AB",
    traegerType: "nonprofit",
    country: "DE",
    foundedYear: 1946,
    facilities: [
      mkFacility("ab-01", "AWO Seniorenheim München-Ost", "München", "Bayern", "DE", 148, 112, "nonprofit", 48.135, 11.63, "active", "2026-02-10"),
      mkFacility("ab-02", "AWO Haus Giesing", "München", "Bayern", "DE", 96, 72, "nonprofit", 48.12, 11.58, "active", "2025-10-05"),
      mkFacility("ab-03", "AWO Pflege Laim", "München", "Bayern", "DE", 84, 64, "nonprofit", 48.14, 11.51, "active", "2026-01-28"),
      mkFacility("ab-04", "AWO Augsburg Pfersee", "Augsburg", "Bayern", "DE", 126, 94, "nonprofit", 48.367, 10.86, "active", "2026-02-19"),
      mkFacility("ab-05", "AWO Ingolstadt-Mitte", "Ingolstadt", "Bayern", "DE", 102, 78, "nonprofit", 48.76, 11.42, "active", "2025-12-01"),
      mkFacility("ab-06", "AWO Landshut-Süd", "Landshut", "Bayern", "DE", 72, 56, "nonprofit", 48.54, 12.15, "audit-review", "2026-03-14"),
      mkFacility("ab-07", "AWO Regensburg Kumpfmühl", "Regensburg", "Bayern", "DE", 88, 68, "nonprofit", 49.0, 12.1, "active", "2026-01-12"),
      mkFacility("ab-08", "AWO Passau", "Passau", "Bayern", "DE", 64, 48, "nonprofit", 48.57, 13.46, "active", "2025-11-08"),
      mkFacility("ab-09", "AWO Rosenheim Zentrum", "Rosenheim", "Bayern", "DE", 110, 84, "nonprofit", 47.85, 12.12, "active", "2026-02-24"),
      mkFacility("ab-10", "AWO Bad Reichenhall", "Bad Reichenhall", "Bayern", "DE", 58, 44, "nonprofit", 47.72, 12.87, "active", "2025-12-18"),
      mkFacility("ab-11", "AWO Kempten Allgäu", "Kempten", "Bayern", "DE", 96, 74, "nonprofit", 47.73, 10.32, "active", "2026-03-04"),
      mkFacility("ab-12", "AWO Memmingen", "Memmingen", "Bayern", "DE", 72, 54, "nonprofit", 47.98, 10.18, "paused", "2025-09-22"),
      mkFacility("ab-13", "AWO Nürnberg Süd", "Nürnberg", "Bayern", "DE", 138, 104, "nonprofit", 49.44, 11.08, "active", "2026-01-02"),
      mkFacility("ab-14", "AWO Würzburg Heidingsfeld", "Würzburg", "Bayern", "DE", 84, 66, "nonprofit", 49.76, 9.92, "active", "2026-02-28"),
      mkFacility("ab-15", "AWO Bamberg-Ost", "Bamberg", "Bayern", "DE", 78, 60, "nonprofit", 49.89, 10.9, "active", "2025-11-30"),
    ],
  },
  {
    id: "grp-diakonie-hh",
    slug: "diakonie-hamburg-nord",
    name: "Diakonie Hamburg-Nord",
    logoText: "DH",
    traegerType: "church",
    country: "DE",
    foundedYear: 1954,
    facilities: [
      mkFacility("dh-01", "Diakonie Haus Alstertal", "Hamburg", "Hamburg", "DE", 122, 92, "church", 53.65, 10.11, "active", "2026-02-07"),
      mkFacility("dh-02", "Diakonie Haus Eppendorf", "Hamburg", "Hamburg", "DE", 88, 68, "church", 53.59, 9.98, "active", "2026-01-22"),
      mkFacility("dh-03", "Diakonie Haus Winterhude", "Hamburg", "Hamburg", "DE", 96, 74, "church", 53.6, 10.02, "active", "2025-12-09"),
      mkFacility("dh-04", "Diakonie Haus Bergedorf", "Hamburg", "Hamburg", "DE", 74, 58, "church", 53.49, 10.21, "audit-review", "2026-03-19"),
    ],
  },
];

/**
 * Deterministischer PRNG, damit KPIs stabil zwischen Renders sind.
 */
function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h) / 0xffffffff;
}

export function snapshotFor(facility: FacilityRef, month: string): FacilityKpiSnapshot {
  const r = (key: string, min: number, max: number) => {
    const h = hash(`${facility.id}:${month}:${key}`);
    return min + h * (max - min);
  };
  const occupancyPct = Math.round(r("occ", 82, 99) * 10) / 10;
  const beds = facility.beds;
  const revenuePerBedPerMonth = 3500 + r("rev", -200, 600);
  const revenueEur = Math.round(beds * (occupancyPct / 100) * revenuePerBedPerMonth);
  const costEur = Math.round(revenueEur * (0.78 + r("cost", -0.05, 0.07)));
  return {
    facilityId: facility.id,
    month,
    occupancyPct,
    avgPflegegrad: Math.round(r("pg", 2.8, 4.2) * 10) / 10,
    staffTurnoverPct: Math.round(r("turn", 6, 22) * 10) / 10,
    documentationRatePct: Math.round(r("doc", 78, 99) * 10) / 10,
    incidentRate: Math.round(r("inc", 1.2, 6.8) * 10) / 10,
    complaints: Math.floor(r("com", 0, 6)),
    revenueEur,
    costEur,
    ebitdaEur: revenueEur - costEur,
    complianceQuotePct: Math.round(r("cmp", 72, 99) * 10) / 10,
    mdCheckOpenFindings: Math.floor(r("mdf", 0, 5)),
    dsgvoRequestsOpen: Math.floor(r("dsg", 0, 3)),
  };
}

export function snapshotsForGroup(group: GroupRecord, month: string): FacilityKpiSnapshot[] {
  return group.facilities.map((f) => snapshotFor(f, month));
}

export function last12Months(refDate = new Date()): string[] {
  const out: string[] = [];
  const d = new Date(refDate);
  d.setDate(1);
  for (let i = 11; i >= 0; i--) {
    const dd = new Date(d);
    dd.setMonth(d.getMonth() - i);
    out.push(`${dd.getFullYear()}-${String(dd.getMonth() + 1).padStart(2, "0")}`);
  }
  return out;
}

export function getGroupBySlug(slug: string): GroupRecord | undefined {
  return GROUPS.find((g) => g.slug === slug);
}

export function getGroupById(id: string): GroupRecord | undefined {
  return GROUPS.find((g) => g.id === id);
}

export const DEFAULT_GROUP_SLUG = "caritas-wien";
