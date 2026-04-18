import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import { db } from "@/db/client";
import { certifications, certificationRequirements } from "@/db/schema";
import { and, eq, asc } from "drizzle-orm";
import { CERTIFICATION_TEMPLATES, computeCertStatus } from "@/lib/certifications/templates";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, FileDown } from "lucide-react";
import { RequirementsList } from "./requirements-list";

export default async function CertDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");
  const tenantId = session.user.tenantId;

  const [cert] = await db
    .select()
    .from(certifications)
    .where(and(eq(certifications.id, id), eq(certifications.tenantId, tenantId)))
    .limit(1);
  if (!cert) notFound();

  const reqs = await db
    .select()
    .from(certificationRequirements)
    .where(eq(certificationRequirements.certificationId, id))
    .orderBy(asc(certificationRequirements.category), asc(certificationRequirements.title));

  const tmpl = CERTIFICATION_TEMPLATES[cert.certificationType];
  const status = computeCertStatus(cert.expiresDate);
  const done = reqs.filter((r) => r.status === "erledigt").length;
  const pct = reqs.length > 0 ? Math.round((done / reqs.length) * 100) : 0;

  return (
    <div className="space-y-6 p-6 lg:p-10">
      <div>
        <Link href="/admin/zertifizierungen">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="mr-1 h-4 w-4" /> zurück
          </Button>
        </Link>
        <div className="mt-2 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="font-serif text-4xl font-semibold tracking-tight">{tmpl?.label ?? cert.certificationType}</h1>
            <p className="mt-1 text-muted-foreground">
              Status: <span className="font-semibold">{status}</span>
              {cert.expiresDate && (
                <> · gültig bis {new Date(cert.expiresDate).toLocaleDateString("de-DE")}</>
              )}
            </p>
          </div>
          <Link href={`/api/certifications/${cert.id}/export`}>
            <Button variant="outline">
              <FileDown className="mr-2 h-4 w-4" /> Audit-Vorbereitung (HTML/PDF)
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-xs uppercase text-muted-foreground">Fortschritt</CardTitle></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pct}%</div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-xs uppercase text-muted-foreground">Erledigt</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{done} / {reqs.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-xs uppercase text-muted-foreground">Auditor</CardTitle></CardHeader>
          <CardContent><div className="text-lg font-semibold">{cert.auditor ?? "—"}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-xs uppercase text-muted-foreground">Zertifikats-Nr.</CardTitle></CardHeader>
          <CardContent><div className="text-lg font-mono">{cert.certificateNumber ?? "—"}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Anforderungen ({reqs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <RequirementsList certId={cert.id} initial={reqs.map((r) => JSON.parse(JSON.stringify(r)))} />
        </CardContent>
      </Card>
    </div>
  );
}
