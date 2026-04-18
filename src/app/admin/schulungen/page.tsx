import { db } from "@/db/client";
import {
  trainingModules,
  trainingAttempts,
  users,
  trainingCertificates,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { and, desc, eq, sql } from "drizzle-orm";

export const metadata = { title: "Schulungen · Admin · CareAI" };

export default async function AdminSchulungenPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const tenantId = (session.user as { tenantId?: string }).tenantId;
  if (!tenantId) return <div className="p-6">Kein Tenant.</div>;

  const modules = await db
    .select({
      id: trainingModules.id,
      title: trainingModules.title,
      category: trainingModules.category,
      isMandatory: trainingModules.isMandatory,
      validityMonths: trainingModules.validityMonths,
      passingScore: trainingModules.passingScore,
      questionCount: sql<number>`(SELECT count(*)::int FROM training_questions q WHERE q.module_id = ${trainingModules.id})`,
      totalAttempts: sql<number>`(SELECT count(*)::int FROM training_attempts a WHERE a.module_id = ${trainingModules.id})`,
      passedAttempts: sql<number>`(SELECT count(*)::int FROM training_attempts a WHERE a.module_id = ${trainingModules.id} AND a.passed = true)`,
    })
    .from(trainingModules)
    .where(eq(trainingModules.tenantId, tenantId))
    .orderBy(desc(trainingModules.isMandatory), trainingModules.title);

  // Ueberfaellige User: haben Pflichtmodul nicht in validityMonths bestanden
  const staffRows = await db
    .select({ id: users.id, name: users.fullName, email: users.email, role: users.role })
    .from(users)
    .where(and(eq(users.tenantId, tenantId)));

  const attempts = await db
    .select({
      userId: trainingAttempts.userId,
      moduleId: trainingAttempts.moduleId,
      lastPassedAt: sql<Date | null>`max(CASE WHEN passed = true THEN completed_at ELSE NULL END)`,
    })
    .from(trainingAttempts)
    .where(eq(trainingAttempts.tenantId, tenantId))
    .groupBy(trainingAttempts.userId, trainingAttempts.moduleId);

  const now = Date.now();
  const overdue: { userId: string; name: string; email: string; moduleTitle: string; dueInDays: number }[] = [];
  const mandatoryModules = modules.filter((m) => m.isMandatory);
  for (const staff of staffRows.filter((s) => s.role === "pflegekraft" || s.role === "pdl")) {
    for (const mod of mandatoryModules) {
      const a = attempts.find((x) => x.userId === staff.id && x.moduleId === mod.id);
      if (!a || !a.lastPassedAt) {
        overdue.push({ userId: staff.id, name: staff.name, email: staff.email, moduleTitle: mod.title, dueInDays: -999 });
        continue;
      }
      const due = new Date(a.lastPassedAt);
      due.setMonth(due.getMonth() + mod.validityMonths);
      const days = Math.floor((due.getTime() - now) / (1000 * 60 * 60 * 24));
      if (days < 30) {
        overdue.push({ userId: staff.id, name: staff.name, email: staff.email, moduleTitle: mod.title, dueInDays: days });
      }
    }
  }
  overdue.sort((a, b) => a.dueInDays - b.dueInDays);

  const certs = await db
    .select({
      id: trainingCertificates.id,
      userName: users.fullName,
      moduleTitle: trainingModules.title,
      issuedAt: trainingCertificates.issuedAt,
      expiresAt: trainingCertificates.expiresAt,
    })
    .from(trainingCertificates)
    .innerJoin(users, eq(users.id, trainingCertificates.userId))
    .innerJoin(trainingModules, eq(trainingModules.id, trainingCertificates.moduleId))
    .where(eq(trainingCertificates.tenantId, tenantId))
    .orderBy(desc(trainingCertificates.issuedAt))
    .limit(50);

  return (
    <div className="mx-auto max-w-6xl p-6">
      <header className="mb-6">
        <h1 className="font-serif text-3xl font-semibold tracking-tight">Schulungen</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pflichtmodule, Ergebnisse und Faelligkeits-Tracking fuer MDK/NQZ/KTQ-Audits.
        </p>
      </header>

      <section className="mb-8">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-semibold">Module ({modules.length})</h2>
          <a href="/api/training/seed?token=careai-setup-2026" className="text-xs text-emerald-700 hover:underline">
            Pflicht-Module seeden
          </a>
        </div>
        <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="p-3">Titel</th>
                <th className="p-3">Kategorie</th>
                <th className="p-3">Pflicht</th>
                <th className="p-3">Fragen</th>
                <th className="p-3">Versuche</th>
                <th className="p-3">Bestanden</th>
                <th className="p-3">Bestehensgrenze</th>
                <th className="p-3">Gueltigkeit</th>
              </tr>
            </thead>
            <tbody>
              {modules.map((m) => (
                <tr key={m.id} className="border-t">
                  <td className="p-3 font-medium">{m.title}</td>
                  <td className="p-3">{m.category}</td>
                  <td className="p-3">{m.isMandatory ? "Ja" : "Nein"}</td>
                  <td className="p-3">{m.questionCount}</td>
                  <td className="p-3">{m.totalAttempts}</td>
                  <td className="p-3">{m.passedAttempts}</td>
                  <td className="p-3">{m.passingScore}%</td>
                  <td className="p-3">{m.validityMonths} Mo.</td>
                </tr>
              ))}
              {modules.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-6 text-center text-muted-foreground">
                    Noch keine Module. Klicken Sie "Pflicht-Module seeden" oben rechts.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-2 text-right">
          <a href="/api/admin/training/export?format=csv" className="text-xs text-slate-500 hover:underline">
            CSV-Export aller Versuche
          </a>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="mb-2 font-semibold">Faelligkeits-Tabelle (ueberfaellig oder &lt; 30 Tage)</h2>
        <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="p-3">Mitarbeitende/r</th>
                <th className="p-3">E-Mail</th>
                <th className="p-3">Modul</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {overdue.map((row, i) => (
                <tr key={i} className="border-t">
                  <td className="p-3">{row.name}</td>
                  <td className="p-3 text-xs text-slate-500">{row.email}</td>
                  <td className="p-3">{row.moduleTitle}</td>
                  <td className="p-3">
                    {row.dueInDays === -999 ? (
                      <span className="rounded bg-rose-100 px-2 py-0.5 text-xs text-rose-900">Nicht absolviert</span>
                    ) : row.dueInDays < 0 ? (
                      <span className="rounded bg-rose-100 px-2 py-0.5 text-xs text-rose-900">
                        Ueberfaellig seit {-row.dueInDays} T.
                      </span>
                    ) : (
                      <span className="rounded bg-amber-100 px-2 py-0.5 text-xs text-amber-900">
                        Faellig in {row.dueInDays} T.
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {overdue.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-emerald-700">
                    Keine ueberfaelligen Pflichtschulungen. Alles im gruenen Bereich.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className="mb-2 font-semibold">Ausgestellte Zertifikate (letzte 50)</h2>
        <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-xs uppercase text-slate-500">
              <tr>
                <th className="p-3">Mitarbeitende/r</th>
                <th className="p-3">Modul</th>
                <th className="p-3">Ausgestellt</th>
                <th className="p-3">Gueltig bis</th>
                <th className="p-3">Link</th>
              </tr>
            </thead>
            <tbody>
              {certs.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="p-3">{c.userName}</td>
                  <td className="p-3">{c.moduleTitle}</td>
                  <td className="p-3 text-xs">{new Date(c.issuedAt).toLocaleDateString("de-AT")}</td>
                  <td className="p-3 text-xs">{c.expiresAt ? new Date(c.expiresAt).toLocaleDateString("de-AT") : "-"}</td>
                  <td className="p-3">
                    <a href={`/app/schulungen/zertifikat/${c.id}`} className="text-xs text-emerald-700 hover:underline">
                      Oeffnen
                    </a>
                  </td>
                </tr>
              ))}
              {certs.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-muted-foreground">Noch keine Zertifikate.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
