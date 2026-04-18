/**
 * Pflegegeld-Antragsgenerator — Übersicht + Neu-Antrag.
 * Listet bestehende Anträge des Tenants, erlaubt Neuanlage pro Bewohner.
 */
import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { pensionApplications, residents } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NewApplicationForm } from "./new-application-form";

export const metadata = {
  title: "Pflegegeld-Antrag — CareAI",
};

function statusLabel(s: string) {
  const map: Record<string, string> = {
    draft: "Entwurf",
    submitted: "Eingereicht",
    approved: "Bewilligt",
    rejected: "Abgelehnt",
  };
  return map[s] ?? s;
}

function statusColor(s: string): "default" | "secondary" | "success" | "danger" | "outline" {
  if (s === "approved") return "success";
  if (s === "rejected") return "danger";
  if (s === "submitted") return "secondary";
  return "outline";
}

function typeLabel(t: string) {
  return t === "de-sgb-xi" ? "DE · SGB XI (Pflegegrad)" : "AT · BPGG (Pflegegeld)";
}

export default async function PflegegeldAntragPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const tenantId = session.user.tenantId as string | undefined;
  if (!tenantId) redirect("/login");

  const [apps, residentList] = await Promise.all([
    db
      .select({
        id: pensionApplications.id,
        applicationType: pensionApplications.applicationType,
        status: pensionApplications.status,
        residentId: pensionApplications.residentId,
        createdAt: pensionApplications.createdAt,
        submittedAt: pensionApplications.submittedAt,
        assignedGrade: pensionApplications.assignedGrade,
        residentName: residents.fullName,
      })
      .from(pensionApplications)
      .leftJoin(residents, eq(pensionApplications.residentId, residents.id))
      .where(eq(pensionApplications.tenantId, tenantId))
      .orderBy(desc(pensionApplications.createdAt)),
    db
      .select({ id: residents.id, fullName: residents.fullName, room: residents.room })
      .from(residents)
      .where(and(eq(residents.tenantId, tenantId)))
      .orderBy(residents.fullName),
  ]);

  return (
    <div className="container mx-auto max-w-6xl space-y-8 py-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-semibold">Pflegegeld-Antrag</h1>
        <p className="text-muted-foreground">
          Deutschland: SGB XI (NBA, Pflegegrade 1-5) · Österreich: BPGG (Stufen 1-7).
          Anträge werden aus Bewohner-Daten auto-befüllt, fehlende Felder werden markiert.
        </p>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Neuen Antrag anlegen</CardTitle>
        </CardHeader>
        <CardContent>
          <NewApplicationForm residents={residentList} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Laufende und abgeschlossene Anträge</CardTitle>
        </CardHeader>
        <CardContent>
          {apps.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Noch keine Anträge angelegt. Oben einen neuen Antrag starten.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                  <tr className="border-b">
                    <th className="py-2">Bewohner:in</th>
                    <th className="py-2">Typ</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Erstellt</th>
                    <th className="py-2">Eingereicht</th>
                    <th className="py-2">Stufe/Grad</th>
                    <th className="py-2 text-right">Aktionen</th>
                  </tr>
                </thead>
                <tbody>
                  {apps.map((a) => (
                    <tr key={a.id} className="border-b">
                      <td className="py-3">{a.residentName ?? "(entfernt)"}</td>
                      <td className="py-3">{typeLabel(a.applicationType)}</td>
                      <td className="py-3">
                        <Badge variant={statusColor(a.status)}>{statusLabel(a.status)}</Badge>
                      </td>
                      <td className="py-3">
                        {new Date(a.createdAt).toLocaleDateString("de-DE")}
                      </td>
                      <td className="py-3">
                        {a.submittedAt
                          ? new Date(a.submittedAt).toLocaleDateString("de-DE")
                          : "—"}
                      </td>
                      <td className="py-3">{a.assignedGrade ?? "—"}</td>
                      <td className="py-3 text-right">
                        <Link
                          href={`/app/pflegegeld-antrag/${a.id}`}
                          className="text-primary underline-offset-4 hover:underline"
                        >
                          Bearbeiten
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

