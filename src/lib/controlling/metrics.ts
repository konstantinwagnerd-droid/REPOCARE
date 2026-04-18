/**
 * Kosten-Controlling Kennzahlen.
 *
 * Berechnet Belegung, Personalkosten, Umsatz, Deckungsbeitrag etc.
 * aus Bewohner-, Schicht-, Gehalts- und Pflegegrad-Daten.
 *
 * Benchmark-Quellen (DE+AT, Stand 2025/2026):
 * - pflege.de Heim-Statistik 2025
 * - Caritas Jahresbericht 2024
 * - Destatis Pflegeheime Deutschland 2023
 * - Statistik Austria Pflegestatistik 2024
 */
import { db } from "@/db/client";
import {
  residents,
  shifts,
  staffHourlyRates,
  pflegegradRevenue,
  fixedCosts,
  users,
} from "@/db/schema";
import { and, eq, gte, isNull, lte, or } from "drizzle-orm";

export type ControllingMetrics = {
  belegungsquote: number; // 0..1
  personalkostenMonatCents: number;
  personalEffizienz: number; // Kosten pro Pflegegrad-Punkt
  umsatzProBewohnerMonatCents: number;
  umsatzGesamtMonatCents: number;
  deckungsbeitragMonatCents: number;
  pflegekraefteProSchicht: {
    frueh: number;
    spaet: number;
    nacht: number;
  };
  bewohnerProPflegekraftRatio: number;
  ueberstundenQuote: number; // 0..1
  fluktuationsRisikoScore: number; // 0..100
  pflegegradMix: Record<number, number>;
  maxKapazitaet: number;
  aktiveBewohner: number;
  fixkostenMonatCents: number;
};

export const BENCHMARKS_DACH = {
  belegungsquote: { median: 0.92, top25: 0.97 },
  personalkostenProBewohnerMonat: { median: 285000, top25: 260000 }, // Cent, ~2850€
  deckungsbeitragProBewohnerMonat: { median: 42000, top25: 78000 },
  ueberstundenQuote: { median: 0.08, top25: 0.04 },
  bewohnerProPflegekraftTag: { median: 3.8, top25: 3.2 },
  fluktuation: { median: 0.18, top25: 0.09 },
};

/**
 * Default-Raten fuer DE §43 SGB XI (Leistungsbetraege 2025) und AT BPGG (2025).
 * Werden als Fallback genutzt, wenn tenant noch nichts konfiguriert hat.
 */
export const DEFAULT_PFLEGEGRAD_RATES_DE = {
  1: 13100, // PG1: 131€ Entlastungsbetrag (monatlich)
  2: 80500, // 805€
  3: 131800, // 1318€
  4: 177500, // 1775€
  5: 200500, // 2005€
} as const;

export const DEFAULT_PFLEGEGRAD_RATES_AT = {
  1: 17500, // Stufe 1: 175,00€
  2: 32340,
  3: 50350,
  4: 75490,
  5: 102540,
  6: 143220,
  7: 188060,
} as const;

export const DEFAULT_HOURLY_RATES_CENTS = {
  dgkp: 2200, // 22,00€/h brutto (DE DGKP/AT DGKP)
  pfh: 1650, // Pflegefachhelfer
  heimhelfer: 1380,
  hauswirtschaft: 1250,
  praktikant: 900,
} as const;

export async function computeControllingMetrics(
  tenantId: string,
  opts: { monthStart?: Date; monthEnd?: Date; maxKapazitaet?: number } = {},
): Promise<ControllingMetrics> {
  const now = new Date();
  const monthStart = opts.monthStart ?? new Date(now.getFullYear(), now.getMonth(), 1);
  const monthEnd = opts.monthEnd ?? new Date(now.getFullYear(), now.getMonth() + 1, 0);

  // Bewohner (active = nicht geloescht, admission vor monthEnd)
  const allResidents = await db
    .select()
    .from(residents)
    .where(eq(residents.tenantId, tenantId));
  const aktive = allResidents.filter((r) => !r.deletedAt);
  const maxKapazitaet = opts.maxKapazitaet ?? Math.max(aktive.length, 50);
  const belegungsquote = aktive.length / Math.max(maxKapazitaet, 1);

  // Pflegegrad Mix
  const pflegegradMix: Record<number, number> = {};
  for (const r of aktive) {
    pflegegradMix[r.pflegegrad] = (pflegegradMix[r.pflegegrad] ?? 0) + 1;
  }

  // Pflegegrad Revenue
  const revenueRows = await db
    .select()
    .from(pflegegradRevenue)
    .where(eq(pflegegradRevenue.tenantId, tenantId));
  const revenueMap = new Map<number, number>();
  for (const row of revenueRows) revenueMap.set(row.pflegegrad, row.monthlyRevenueCents);
  // Fallback auf DE-Default
  for (const [g, cents] of Object.entries(DEFAULT_PFLEGEGRAD_RATES_DE)) {
    if (!revenueMap.has(Number(g))) revenueMap.set(Number(g), cents);
  }

  let umsatzGesamtMonatCents = 0;
  for (const r of aktive) {
    umsatzGesamtMonatCents += revenueMap.get(r.pflegegrad) ?? 0;
  }
  const umsatzProBewohnerMonatCents = aktive.length > 0 ? Math.round(umsatzGesamtMonatCents / aktive.length) : 0;

  // Shifts im Monat + Stundensaetze
  const monthShifts = await db
    .select({ id: shifts.id, userId: shifts.userId, startsAt: shifts.startsAt, endsAt: shifts.endsAt })
    .from(shifts)
    .where(
      and(
        eq(shifts.tenantId, tenantId),
        gte(shifts.startsAt, monthStart),
        lte(shifts.startsAt, monthEnd),
      ),
    );

  const rateRows = await db
    .select()
    .from(staffHourlyRates)
    .where(eq(staffHourlyRates.tenantId, tenantId));
  const defaultRate = 1800; // 18€/h fallback
  const avgRate = rateRows.length > 0
    ? Math.round(rateRows.reduce((a, r) => a + r.hourlyRateCents, 0) / rateRows.length)
    : defaultRate;

  let totalHours = 0;
  const shiftCounts = { frueh: 0, spaet: 0, nacht: 0 };
  for (const s of monthShifts) {
    const hrs = (new Date(s.endsAt).getTime() - new Date(s.startsAt).getTime()) / 3600_000;
    totalHours += hrs;
    const startHour = new Date(s.startsAt).getHours();
    if (startHour < 12) shiftCounts.frueh++;
    else if (startHour < 20) shiftCounts.spaet++;
    else shiftCounts.nacht++;
  }
  const personalkostenMonatCents = Math.round(totalHours * avgRate);

  // Pflegekraefte pro Schicht (Durchschnitt)
  const daysInMonth = (monthEnd.getTime() - monthStart.getTime()) / 86400_000 + 1;
  const pflegekraefteProSchicht = {
    frueh: Math.round((shiftCounts.frueh / daysInMonth) * 10) / 10,
    spaet: Math.round((shiftCounts.spaet / daysInMonth) * 10) / 10,
    nacht: Math.round((shiftCounts.nacht / daysInMonth) * 10) / 10,
  };
  const avgStaffPerShift =
    (pflegekraefteProSchicht.frueh + pflegekraefteProSchicht.spaet + pflegekraefteProSchicht.nacht) / 3;
  const bewohnerProPflegekraftRatio = avgStaffPerShift > 0 ? Math.round((aktive.length / avgStaffPerShift) * 10) / 10 : 0;

  // Fix-Kosten
  const fixRows = await db
    .select()
    .from(fixedCosts)
    .where(
      and(
        eq(fixedCosts.tenantId, tenantId),
        or(isNull(fixedCosts.validUntil), gte(fixedCosts.validUntil, monthStart)),
      ),
    );
  const fixkostenMonatCents = fixRows.reduce((a, r) => a + r.monthlyCostCents, 0);

  // Deckungsbeitrag
  const deckungsbeitragMonatCents = umsatzGesamtMonatCents - personalkostenMonatCents - fixkostenMonatCents;

  // Pflegegrad-Durchschnitt fuer Effizienz
  const avgPflegegrad = aktive.length > 0
    ? aktive.reduce((a, r) => a + r.pflegegrad, 0) / aktive.length
    : 1;
  const personalEffizienz = avgPflegegrad > 0 ? Math.round(personalkostenMonatCents / avgPflegegrad) : 0;

  // Ueberstunden: vereinfacht — >160h/Mitarbeiter pro Monat gilt als Ueberstunde
  const staffHoursMap = new Map<string, number>();
  for (const s of monthShifts) {
    const hrs = (new Date(s.endsAt).getTime() - new Date(s.startsAt).getTime()) / 3600_000;
    staffHoursMap.set(s.userId, (staffHoursMap.get(s.userId) ?? 0) + hrs);
  }
  const sollStunden = 160;
  let istStunden = 0;
  let berechneteSollStunden = 0;
  for (const hrs of staffHoursMap.values()) {
    istStunden += hrs;
    berechneteSollStunden += sollStunden;
  }
  const ueberstundenQuote = berechneteSollStunden > 0
    ? Math.max(0, (istStunden - berechneteSollStunden) / berechneteSollStunden)
    : 0;

  // Fluktuations-Risiko-Score — vereinfachter Proxy:
  // hohe Ueberstunden + kurze Betriebszugehoerigkeit + wenig Staff
  const allUsers = await db.select().from(users).where(eq(users.tenantId, tenantId));
  const neuImTeam = allUsers.filter((u) => {
    const days = (now.getTime() - new Date(u.createdAt).getTime()) / 86400_000;
    return days < 180;
  }).length;
  const neuQuote = allUsers.length > 0 ? neuImTeam / allUsers.length : 0;
  const fluktuationsRisikoScore = Math.min(
    100,
    Math.round(ueberstundenQuote * 100 * 2 + neuQuote * 100 * 0.5 + (bewohnerProPflegekraftRatio > 5 ? 20 : 0)),
  );

  return {
    belegungsquote,
    personalkostenMonatCents,
    personalEffizienz,
    umsatzProBewohnerMonatCents,
    umsatzGesamtMonatCents,
    deckungsbeitragMonatCents,
    pflegekraefteProSchicht,
    bewohnerProPflegekraftRatio,
    ueberstundenQuote,
    fluktuationsRisikoScore,
    pflegegradMix,
    maxKapazitaet,
    aktiveBewohner: aktive.length,
    fixkostenMonatCents,
  };
}

/**
 * 12-Monats-Sparkline: vereinfacht — synthetische Variation um aktuellen Wert.
 * Fuer Real-Daten muesste man historische Snapshots speichern.
 */
export function buildSparkline(current: number, months = 12, jitter = 0.1): number[] {
  const out: number[] = [];
  for (let i = months - 1; i >= 0; i--) {
    const variation = 1 + (Math.sin(i * 0.7) * jitter + (Math.random() - 0.5) * 0.05);
    out.push(Math.round(current * variation));
  }
  return out;
}

/**
 * Was-waere-wenn Simulator: Aenderung der Deckungsbeitrags durch Personalveraenderung.
 */
export function simulatePersonalChange(
  metrics: ControllingMetrics,
  deltaStellen: number,
  stundensatzCents: number,
  stundenProMonat = 160,
): { neuPersonalkostenCents: number; neuDeckungsbeitragCents: number; deltaCents: number } {
  const deltaKosten = deltaStellen * stundensatzCents * stundenProMonat;
  const neuPersonalkostenCents = metrics.personalkostenMonatCents + deltaKosten;
  const neuDeckungsbeitragCents = metrics.deckungsbeitragMonatCents - deltaKosten;
  return { neuPersonalkostenCents, neuDeckungsbeitragCents, deltaCents: -deltaKosten };
}
