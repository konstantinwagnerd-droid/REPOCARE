import { db } from "@/db/client";
import { auth } from "@/lib/auth";
import { residents } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";

export default async function ReportsPage() {
  const session = await auth();
  const list = await db.select().from(residents).where(eq(residents.tenantId, session!.user.tenantId));
  const byGrade = list.reduce<Record<number, number>>((acc, r) => { acc[r.pflegegrad] = (acc[r.pflegegrad] ?? 0) + 1; return acc; }, {});

  return (
    <div className="space-y-8 p-6 lg:p-10">
      <div>
        <h1 className="font-serif text-4xl font-semibold tracking-tight">Reports & Exporte</h1>
        <p className="mt-1 text-muted-foreground">MDK-Paket, Pflegegrad-Übersicht, Kennzahlen.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Pflegegrad-Übersicht</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {[1, 2, 3, 4, 5].map((g) => (
              <div key={g} className="flex items-center gap-3">
                <span className="w-16 text-sm font-semibold">PG {g}</span>
                <div className="h-3 flex-1 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-primary" style={{ width: `${((byGrade[g] ?? 0) / list.length) * 100}%` }} />
                </div>
                <span className="w-8 text-right text-sm font-mono">{byGrade[g] ?? 0}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Exporte</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              "MDK-Qualitätsprüfung Komplett-Export",
              "Pflegegrad-Report (CSV)",
              "Medikationsnachweis (PDF)",
              "Audit-Log aktueller Monat",
              "Sturz- und Dekubitus-Protokolle",
            ].map((r) => (
              <div key={r} className="flex items-center justify-between rounded-xl border border-border p-3">
                <span className="text-sm">{r}</span>
                <Button variant="outline" size="sm"><FileDown className="h-4 w-4" /> Export</Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
