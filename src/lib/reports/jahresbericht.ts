import { db } from "@/db/client";
import {
  residents,
  incidents,
  wounds,
  users,
  shifts,
  careVisits,
  dnqpAssessments,
} from "@/db/schema";
import { and, eq, gte, lte, sql, isNull, or } from "drizzle-orm";

export type JahresberichtKennzahlen = {
  year: number;
  tenantId: string;
  belegung: {
    aktiv: number;
    neuAufgenommen: number;
    ausgezogen: number;
    auslastungProzent: number | null;
  };
  pflegegradVerteilung: Record<string, number>;
  incidents: {
    gesamt: number;
    nachSchwere: Record<string, number>;
    nachTyp: Record<string, number>;
    sturzInzidenzPro1000: number | null;
  };
  wunden: {
    gesamt: number;
    dekubitusInzidenzPro1000: number | null;
    verheilt: number;
    offen: number;
  };
  personal: {
    aktiv: number;
    schichtenGeleistet: number;
    fluktuationProzent: number | null;
  };
  qualitaet: {
    pflegevisiten: number;
    dnqpAssessments: number;
    durchschnittBewertung: number | null;
  };
};

/**
 * Aggregiert alle Kennzahlen fuer den Qualitaetsjahresbericht.
 * Ein Aufruf → eine Objekt-Struktur, Mandanten-gefiltert.
 */
export async function buildJahresbericht(
  tenantId: string,
  year: number,
): Promise<JahresberichtKennzahlen> {
  const jahresStart = new Date(Date.UTC(year, 0, 1, 0, 0, 0));
  const jahresEnde = new Date(Date.UTC(year, 11, 31, 23, 59, 59));

  // Bewohner (Belegung)
  const allResidents = await db
    .select({
      id: residents.id,
      pflegegrad: residents.pflegegrad,
      admissionDate: residents.admissionDate,
      deletedAt: residents.deletedAt,
    })
    .from(residents)
    .where(eq(residents.tenantId, tenantId));

  const aktivEndOfYear = allResidents.filter(
    (r) => (!r.deletedAt || r.deletedAt > jahresEnde) && r.admissionDate <= jahresEnde,
  ).length;
  const neuAufgenommen = allResidents.filter(
    (r) => r.admissionDate >= jahresStart && r.admissionDate <= jahresEnde,
  ).length;
  const ausgezogen = allResidents.filter(
    (r) => r.deletedAt && r.deletedAt >= jahresStart && r.deletedAt <= jahresEnde,
  ).length;

  const pflegegradVerteilung: Record<string, number> = {};
  for (const r of allResidents) {
    if (r.deletedAt && r.deletedAt < jahresStart) continue;
    const key = `PG${r.pflegegrad}`;
    pflegegradVerteilung[key] = (pflegegradVerteilung[key] ?? 0) + 1;
  }

  // Incidents
  const residentIds = allResidents.map((r) => r.id);
  const incidentsYear = residentIds.length
    ? await db
        .select()
        .from(incidents)
        .where(
          and(
            sql`${incidents.residentId} IN (${sql.join(residentIds.map((i) => sql`${i}`), sql`, `)})`,
            gte(incidents.occurredAt, jahresStart),
            lte(incidents.occurredAt, jahresEnde),
          ),
        )
    : [];

  const incNachSchwere: Record<string, number> = {};
  const incNachTyp: Record<string, number> = {};
  let sturzCount = 0;
  for (const i of incidentsYear) {
    incNachSchwere[i.severity] = (incNachSchwere[i.severity] ?? 0) + 1;
    incNachTyp[i.type] = (incNachTyp[i.type] ?? 0) + 1;
    if (/sturz/i.test(i.type)) sturzCount++;
  }

  // Bewohner-Tage (grob): aktive Bewohner * 365 fuer Inzidenz-Normierung
  const bewohnerTage = aktivEndOfYear * 365;
  const sturzInzidenz = bewohnerTage > 0 ? (sturzCount / bewohnerTage) * 1000 : null;

  // Wunden
  const woundsYear = residentIds.length
    ? await db
        .select()
        .from(wounds)
        .where(
          and(
            sql`${wounds.residentId} IN (${sql.join(residentIds.map((i) => sql`${i}`), sql`, `)})`,
            or(
              and(gte(wounds.openedAt, jahresStart), lte(wounds.openedAt, jahresEnde)),
              and(isNull(wounds.closedAt), lte(wounds.openedAt, jahresEnde)),
            ),
          ),
        )
    : [];
  const dekubitusCount = woundsYear.filter((w) => /dekubitus|grad_/i.test(w.stage)).length;
  const woundsVerheilt = woundsYear.filter((w) => w.stage === "verheilt" || w.closedAt).length;
  const woundsOffen = woundsYear.filter((w) => !w.closedAt).length;
  const dekubitusInzidenz = bewohnerTage > 0 ? (dekubitusCount / bewohnerTage) * 1000 : null;

  // Personal
  const allUsers = await db
    .select({ id: users.id, role: users.role })
    .from(users)
    .where(eq(users.tenantId, tenantId));
  const aktivStaff = allUsers.filter((u) => u.role === "pdl" || u.role === "pflegekraft").length;

  const shiftsYear = await db
    .select({ c: sql<number>`count(*)::int` })
    .from(shifts)
    .where(
      and(
        eq(shifts.tenantId, tenantId),
        gte(shifts.startsAt, jahresStart),
        lte(shifts.startsAt, jahresEnde),
      ),
    );
  const schichtenGeleistet = Number(shiftsYear[0]?.c ?? 0);

  // Qualitaet
  const pflegevisitenYear = residentIds.length
    ? await db
        .select({
          c: sql<number>`count(*)::int`,
          avgRating: sql<number>`avg(${careVisits.overallRating})::float`,
        })
        .from(careVisits)
        .where(
          and(
            sql`${careVisits.residentId} IN (${sql.join(residentIds.map((i) => sql`${i}`), sql`, `)})`,
            gte(careVisits.visitDate, jahresStart),
            lte(careVisits.visitDate, jahresEnde),
          ),
        )
    : [{ c: 0, avgRating: null }];

  const dnqpYear = residentIds.length
    ? await db
        .select({ c: sql<number>`count(*)::int` })
        .from(dnqpAssessments)
        .where(
          and(
            sql`${dnqpAssessments.residentId} IN (${sql.join(residentIds.map((i) => sql`${i}`), sql`, `)})`,
            gte(dnqpAssessments.assessedAt, jahresStart),
            lte(dnqpAssessments.assessedAt, jahresEnde),
          ),
        )
    : [{ c: 0 }];

  // Auslastung: falls keine Kapazitaet hinterlegt ist, null
  const auslastungProzent: number | null = null;

  return {
    year,
    tenantId,
    belegung: { aktiv: aktivEndOfYear, neuAufgenommen, ausgezogen, auslastungProzent },
    pflegegradVerteilung,
    incidents: {
      gesamt: incidentsYear.length,
      nachSchwere: incNachSchwere,
      nachTyp: incNachTyp,
      sturzInzidenzPro1000: sturzInzidenz,
    },
    wunden: {
      gesamt: woundsYear.length,
      dekubitusInzidenzPro1000: dekubitusInzidenz,
      verheilt: woundsVerheilt,
      offen: woundsOffen,
    },
    personal: {
      aktiv: aktivStaff,
      schichtenGeleistet,
      fluktuationProzent: null,
    },
    qualitaet: {
      pflegevisiten: Number(pflegevisitenYear[0]?.c ?? 0),
      dnqpAssessments: Number(dnqpYear[0]?.c ?? 0),
      durchschnittBewertung:
        pflegevisitenYear[0]?.avgRating != null ? Number(pflegevisitenYear[0].avgRating) : null,
    },
  };
}
