import Link from "next/link";
import { db } from "@/db/client";
import { auth } from "@/lib/auth";
import { residents } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { calcAge, initials } from "@/lib/utils";
import { Search, ArrowRight } from "lucide-react";

export default async function ResidentsPage() {
  const session = await auth();
  const list = await db
    .select()
    .from(residents)
    .where(eq(residents.tenantId, session!.user.tenantId))
    .orderBy(asc(residents.fullName));

  return (
    <div className="space-y-8 p-6 lg:p-10">
      <div>
        <h1 className="font-serif text-4xl font-semibold tracking-tight">Bewohner:innen</h1>
        <p className="mt-1 text-muted-foreground">{list.length} aktive Bewohner:innen in Ihrer Einrichtung.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Name, Zimmer, Station suchen..." className="pl-10" />
        </div>
        <select className="h-12 rounded-xl border border-input bg-background px-4 text-sm">
          <option>Alle Stationen</option>
          <option>Station A</option>
          <option>Station B</option>
          <option>Station C</option>
        </select>
        <select className="h-12 rounded-xl border border-input bg-background px-4 text-sm">
          <option>Alle Pflegegrade</option>
          {[1, 2, 3, 4, 5].map((g) => <option key={g}>Pflegegrad {g}</option>)}
        </select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {list.map((r) => (
          <Link key={r.id} href={`/app/residents/${r.id}`}>
            <Card className="transition-all hover:-translate-y-0.5 hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-5">
                <Avatar className="h-14 w-14">
                  <AvatarFallback className="text-base">{initials(r.fullName)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-lg font-semibold">{r.fullName}</h3>
                    <Badge variant={r.pflegegrad >= 4 ? "warning" : "secondary"}>PG {r.pflegegrad}</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Zimmer {r.room} · {r.station} · {calcAge(r.birthdate)} J.
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
