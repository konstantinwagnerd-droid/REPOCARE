import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { db } from "@/db/client";
import { pensionApplications, residents } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ApplicationEditor } from "./application-editor";
import type { PensionApplicationData } from "@/lib/pdf/pflegegeld-antrag";

export default async function PensionApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const tenantId = session.user.tenantId as string | undefined;
  if (!tenantId) redirect("/login");

  const { id } = await params;
  const [app] = await db
    .select()
    .from(pensionApplications)
    .where(and(eq(pensionApplications.id, id), eq(pensionApplications.tenantId, tenantId)))
    .limit(1);
  if (!app) notFound();

  const [resident] = await db
    .select()
    .from(residents)
    .where(eq(residents.id, app.residentId))
    .limit(1);

  const formData = app.formData as unknown as PensionApplicationData;

  return (
    <div className="container mx-auto max-w-4xl space-y-6 py-8">
      <header className="flex items-start justify-between">
        <div>
          <Link
            href="/app/pflegegeld-antrag"
            className="text-sm text-muted-foreground hover:underline"
          >
            ← Zur Übersicht
          </Link>
          <h1 className="mt-2 text-3xl font-semibold">
            {app.applicationType === "de-sgb-xi"
              ? "SGB XI — Pflegegrad-Antrag"
              : "BPGG — Pflegegeld-Antrag"}
          </h1>
          <p className="text-muted-foreground">
            {resident?.fullName ?? "(Bewohner:in entfernt)"} · Status{" "}
            <span className="font-medium">{app.status}</span>
          </p>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Antragsfelder</CardTitle>
        </CardHeader>
        <CardContent>
          <ApplicationEditor
            id={app.id}
            jurisdiction={app.applicationType}
            initialData={formData}
            initialStatus={app.status}
          />
        </CardContent>
      </Card>
    </div>
  );
}
