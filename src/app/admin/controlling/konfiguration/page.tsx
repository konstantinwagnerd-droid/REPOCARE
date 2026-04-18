import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/db/client";
import { staffHourlyRates, pflegegradRevenue, fixedCosts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KonfigForms } from "./forms";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default async function KonfigurationPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const tenantId = session.user.tenantId;

  const [rates, revenues, fix] = await Promise.all([
    db.select().from(staffHourlyRates).where(eq(staffHourlyRates.tenantId, tenantId)),
    db.select().from(pflegegradRevenue).where(eq(pflegegradRevenue.tenantId, tenantId)),
    db.select().from(fixedCosts).where(eq(fixedCosts.tenantId, tenantId)),
  ]);

  return (
    <div className="space-y-6 p-6 lg:p-10">
      <div>
        <Link href="/admin/controlling">
          <Button variant="ghost" size="sm">
            <ChevronLeft className="mr-1 h-4 w-4" /> zurück
          </Button>
        </Link>
        <h1 className="mt-2 font-serif text-4xl font-semibold tracking-tight">Controlling-Konfiguration</h1>
        <p className="mt-1 text-muted-foreground">
          Stundensätze, Pflegegrad-Raten (DE §43 SGB XI / AT BPGG) und Fix-Kosten pflegen.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Stundensätze pro Rolle</CardTitle>
        </CardHeader>
        <CardContent>
          <KonfigForms.Rates initial={rates.map(serialize)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pflegegrad-Raten (monatlich)</CardTitle>
        </CardHeader>
        <CardContent>
          <KonfigForms.Revenue initial={revenues.map(serialize)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Fix-Kosten (monatlich)</CardTitle>
        </CardHeader>
        <CardContent>
          <KonfigForms.FixedCosts initial={fix.map(serialize)} />
        </CardContent>
      </Card>
    </div>
  );
}

function serialize<T extends Record<string, unknown>>(row: T): T {
  return JSON.parse(JSON.stringify(row));
}
