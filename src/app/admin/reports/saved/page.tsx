import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db/client";
import { savedReports } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, Play, FileText } from "lucide-react";
import { ENTITY_DEFS } from "@/lib/reports/query-builder";
import { SavedReportsClient } from "./client";

export default async function SavedReportsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const rows = await db
    .select()
    .from(savedReports)
    .where(eq(savedReports.tenantId, session.user.tenantId))
    .orderBy(desc(savedReports.createdAt));

  return (
    <div className="space-y-6 p-6 lg:p-10">
      <div>
        <Link href="/admin/reports/builder">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="mr-1 h-4 w-4" /> zum Builder
          </Button>
        </Link>
        <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight">Gespeicherte Reports</h1>
        <p className="mt-1 text-muted-foreground">
          Wiederverwendbare Reports, die im Query-Builder gespeichert wurden.
        </p>
      </div>

      {rows.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">
            <FileText className="mx-auto h-8 w-8 opacity-40" />
            <p className="mt-2">Noch keine Reports gespeichert.</p>
            <Link href="/admin/reports/builder">
              <Button className="mt-4">
                <Play className="mr-2 h-4 w-4" /> Ersten Report erstellen
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <SavedReportsClient
          initial={rows.map((r) => ({
            id: r.id,
            name: r.name,
            description: r.description,
            entity: r.entity,
            entityLabel: ENTITY_DEFS[r.entity as keyof typeof ENTITY_DEFS]?.label ?? r.entity,
            filtersJson: r.filtersJson,
            columnsJson: r.columnsJson,
            sortJson: r.sortJson,
            limitRows: r.limitRows,
            createdAt: r.createdAt.toISOString(),
          }))}
        />
      )}
    </div>
  );
}
