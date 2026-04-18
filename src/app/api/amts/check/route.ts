/**
 * POST /api/amts/check
 * Body: { residentId: string }
 * Returns: AmtsReview (PRISCUS + FORTA + Interactions + Beers) für alle aktiven Medikamente.
 *
 * Speichert Warnungen in amts_flags für QM/Dashboard.
 */
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { residents, medications, amtsFlags } from "@/db/schema";
import { eq, and, isNull } from "drizzle-orm";
import { reviewMedications } from "@/lib/amts";
import { logger } from "@/lib/monitoring/logger";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const residentId: string | undefined = body?.residentId;
  if (!residentId) return NextResponse.json({ error: "residentId_missing" }, { status: 400 });

  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const [r] = await db.select().from(residents).where(eq(residents.id, residentId)).limit(1);
  if (!r) return NextResponse.json({ error: "resident_not_found" }, { status: 404 });

  const meds = await db.select().from(medications).where(
    and(eq(medications.residentId, residentId), isNull(medications.endDate)),
  );

  const age = Math.floor((Date.now() - new Date(r.birthdate).getTime()) / (365.25 * 24 * 3600 * 1000));

  if (age < 65) {
    return NextResponse.json({
      hinweis: "PRISCUS/FORTA primär bei >=65 J. relevant — Prüfung durchgeführt, ggf. reduzierte Relevanz.",
      age,
      ...reviewMedications(meds.map((m) => m.name)),
      medications: meds,
    });
  }

  const wirkstoffe = meds.map((m) => m.name);
  const review = reviewMedications(wirkstoffe);

  // Flags persistieren (nur neue; bestehende werden nicht doppelt geschrieben).
  try {
    const rows: Array<typeof amtsFlags.$inferInsert> = [];
    for (const p of review.priscus) {
      const med = meds.find((m) => p.wirkstoff === m.name);
      rows.push({
        residentId,
        medicationId: med?.id,
        flagType: "priscus",
        severity: p.eintrag.priscus_bewertung === "vermeiden" ? "hoch" : "mittel",
        detailsJson: { ...p, source: "PRISCUS 2.0" },
      });
    }
    for (const f of review.forta) {
      if (f.worst === "D" || f.worst === "C") {
        const med = meds.find((m) => f.wirkstoff === m.name);
        rows.push({
          residentId,
          medicationId: med?.id,
          flagType: f.worst === "D" ? "forta-d" : "forta-c",
          severity: f.worst === "D" ? "hoch" : "mittel",
          detailsJson: { ...f, source: "FORTA 2023" },
        });
      }
    }
    for (const i of review.interactions) {
      rows.push({
        residentId,
        flagType: "interaction",
        severity: i.severity,
        detailsJson: { ...i, source: "AMTS Interactions" },
      });
    }
    if (rows.length) {
      await db.insert(amtsFlags).values(rows);
    }
  } catch (e) {
    logger.warn("amts.check.persist_failed", { err: String(e) });
  }

  return NextResponse.json({ ...review, age, medications: meds });
}
