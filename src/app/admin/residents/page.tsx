import { db } from "@/db/client";
import { auth } from "@/lib/auth";
import { residents } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate, calcAge } from "@/lib/utils";
import { Plus } from "lucide-react";

export default async function AdminResidentsPage() {
  const session = await auth();
  const list = await db.select().from(residents).where(eq(residents.tenantId, session!.user.tenantId)).orderBy(asc(residents.room));

  return (
    <div className="space-y-8 p-6 lg:p-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-4xl font-semibold tracking-tight">Bewohnende verwalten</h1>
          <p className="mt-1 text-muted-foreground">Aufnahme, Entlassung, Stammdaten.</p>
        </div>
        <Button variant="accent" size="lg"><Plus className="h-4 w-4" /> Aufnahme</Button>
      </div>
      <Card>
        <CardContent className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-left text-xs uppercase text-muted-foreground">
              <tr><th className="p-3">Name</th><th>Zimmer</th><th>Station</th><th>Alter</th><th>Pflegegrad</th><th>Aufnahme</th><th></th></tr>
            </thead>
            <tbody className="divide-y divide-border">
              {list.map((r) => (
                <tr key={r.id} className="hover:bg-muted/30">
                  <td className="p-3 font-semibold">{r.fullName}</td>
                  <td>{r.room}</td>
                  <td>{r.station}</td>
                  <td>{calcAge(r.birthdate)}</td>
                  <td><Badge variant={r.pflegegrad >= 4 ? "warning" : "secondary"}>PG {r.pflegegrad}</Badge></td>
                  <td>{formatDate(r.admissionDate)}</td>
                  <td><Button variant="ghost" size="sm">Bearbeiten</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
