import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db/client";
import { certifications, certificationRequirements } from "@/db/schema";
import { eq, sql as dsql } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Award, Plus, Calendar, AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { CERTIFICATION_TEMPLATES, computeCertStatus } from "@/lib/certifications/templates";
import { NewCertDialog } from "./new-cert-dialog";

function daysUntil(d: Date | string | null): number | null {
  if (!d) return null;
  const date = typeof d === "string" ? new Date(d) : d;
  return Math.floor((date.getTime() - Date.now()) / 86400_000);
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    aktiv: "bg-emerald-100 text-emerald-700",
    "läuft-ab": "bg-rose-100 text-rose-700",
    "erneuerung-anstehend": "bg-amber-100 text-amber-700",
    abgelaufen: "bg-rose-200 text-rose-900",
    "in-vorbereitung": "bg-blue-100 text-blue-700",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${colors[status] ?? "bg-muted"}`}>
      {status}
    </span>
  );
}

export default async function ZertifizierungenPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const tenantId = session.user.tenantId;

  const rows = await db.select().from(certifications).where(eq(certifications.tenantId, tenantId));

  // Requirement-Counts
  const reqCounts = await db
    .select({
      certId: certificationRequirements.certificationId,
      total: dsql<number>`count(*)::int`,
      done: dsql<number>`sum(case when status = 'erledigt' then 1 else 0 end)::int`,
    })
    .from(certificationRequirements)
    .groupBy(certificationRequirements.certificationId);
  const reqMap = new Map(reqCounts.map((r) => [r.certId, { total: r.total, done: r.done }]));

  // Upcoming audits
  const upcoming = rows
    .filter((r) => r.nextAuditDate || r.expiresDate)
    .map((r) => ({ cert: r, days: daysUntil(r.nextAuditDate ?? r.expiresDate) }))
    .filter((x) => x.days !== null && x.days >= 0)
    .sort((a, b) => (a.days ?? 0) - (b.days ?? 0))
    .slice(0, 5);

  const templates = Object.values(CERTIFICATION_TEMPLATES);

  return (
    <div className="space-y-6 p-6 lg:p-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-4xl font-semibold tracking-tight">Zertifizierungen</h1>
          <p className="mt-1 text-muted-foreground">
            ISO 27001, KTQ, NQZ, Diakonie, Caritas, MDK — zentrale Verwaltung mit Audit-Vorbereitung.
          </p>
        </div>
        <NewCertDialog templates={templates} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Aktive Zertifikate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {rows.filter((r) => computeCertStatus(r.expiresDate) === "aktiv").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-rose-600" /> Läuft in &lt;3 Mon. ab
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {rows.filter((r) => computeCertStatus(r.expiresDate) === "läuft-ab").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-amber-600" /> In Vorbereitung
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {rows.filter((r) => computeCertStatus(r.expiresDate) === "in-vorbereitung").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {upcoming.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-4 w-4" /> Nächste Termine
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {upcoming.map(({ cert, days }) => (
                <div key={cert.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div>
                    <div className="font-medium">
                      {CERTIFICATION_TEMPLATES[cert.certificationType]?.label ?? cert.certificationType}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {cert.nextAuditDate
                        ? `Audit: ${new Date(cert.nextAuditDate).toLocaleDateString("de-DE")}`
                        : `Ablauf: ${cert.expiresDate ? new Date(cert.expiresDate).toLocaleDateString("de-DE") : "—"}`}
                    </div>
                  </div>
                  <div
                    className={`text-sm font-semibold ${
                      (days ?? 0) < 30 ? "text-rose-600" : (days ?? 0) < 90 ? "text-amber-600" : "text-muted-foreground"
                    }`}
                  >
                    in {days} Tagen
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-4 w-4" /> Alle Zertifikate
          </CardTitle>
        </CardHeader>
        <CardContent>
          {rows.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <p>Noch keine Zertifikate angelegt.</p>
              <p className="mt-1 text-xs">Klicke oben rechts auf &quot;Neu&quot; und wähle ein Template.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {rows.map((cert) => {
                const status = computeCertStatus(cert.expiresDate);
                const rq = reqMap.get(cert.id) ?? { total: 0, done: 0 };
                const tmpl = CERTIFICATION_TEMPLATES[cert.certificationType];
                return (
                  <Link
                    key={cert.id}
                    href={`/admin/zertifizierungen/${cert.id}`}
                    className="flex items-center justify-between rounded-lg border border-border p-4 transition hover:bg-muted/50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{tmpl?.label ?? cert.certificationType}</span>
                        <StatusBadge status={status} />
                      </div>
                      <div className="mt-1 text-xs text-muted-foreground">
                        {cert.certificateNumber && <span>Nr. {cert.certificateNumber} · </span>}
                        {cert.auditor && <span>Auditor: {cert.auditor} · </span>}
                        {cert.expiresDate && (
                          <span>gültig bis {new Date(cert.expiresDate).toLocaleDateString("de-DE")}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="font-mono">
                        {rq.done} / {rq.total}
                      </div>
                      <div className="text-xs text-muted-foreground">Anforderungen</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
