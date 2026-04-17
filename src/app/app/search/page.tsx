import { db } from "@/db/client";
import { auth } from "@/lib/auth";
import { residents, careReports, carePlans } from "@/db/schema";
import { eq, ilike, or, desc } from "drizzle-orm";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Users, FileText, ClipboardList } from "lucide-react";
import Link from "next/link";
import { timeAgo } from "@/lib/utils";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const session = await auth();
  const { q } = await searchParams;
  const query = (q ?? "").trim();

  let residentHits: typeof residents.$inferSelect[] = [];
  let reportHits: typeof careReports.$inferSelect[] = [];
  let planHits: typeof carePlans.$inferSelect[] = [];

  if (query.length > 1) {
    const like = `%${query}%`;
    [residentHits, reportHits, planHits] = await Promise.all([
      db.select().from(residents).where(eq(residents.tenantId, session!.user.tenantId)).limit(20),
      db.select().from(careReports).where(ilike(careReports.content, like)).orderBy(desc(careReports.createdAt)).limit(15),
      db.select().from(carePlans).where(or(ilike(carePlans.title, like), ilike(carePlans.description, like))!).limit(10),
    ]);
    residentHits = residentHits.filter((r) => r.fullName.toLowerCase().includes(query.toLowerCase()));
  }

  return (
    <div className="space-y-8 p-6 lg:p-10">
      <div>
        <h1 className="font-serif text-4xl font-semibold tracking-tight">Suchen</h1>
        <p className="mt-1 text-muted-foreground">Finden Sie Bewohner:innen, Berichte und Maßnahmen.</p>
      </div>

      <form action="/app/search" className="relative max-w-2xl">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input name="q" defaultValue={query} placeholder="Name, Zimmer, Inhalt…" className="h-14 pl-12 text-base" autoFocus />
      </form>

      {query.length < 2 ? (
        <p className="text-sm text-muted-foreground">Geben Sie mindestens 2 Zeichen ein.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="p-5">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><Users className="h-4 w-4 text-primary" /> Bewohner:innen <Badge variant="secondary">{residentHits.length}</Badge></div>
              <ul className="space-y-2">
                {residentHits.map((r) => (
                  <li key={r.id}><Link href={`/app/residents/${r.id}`} className="block rounded-lg p-2 text-sm hover:bg-secondary">{r.fullName}<span className="ml-2 text-xs text-muted-foreground">Zi. {r.room}</span></Link></li>
                ))}
                {residentHits.length === 0 && <li className="text-sm text-muted-foreground">Keine Treffer.</li>}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><FileText className="h-4 w-4 text-primary" /> Berichte <Badge variant="secondary">{reportHits.length}</Badge></div>
              <ul className="space-y-2">
                {reportHits.map((r) => (
                  <li key={r.id} className="rounded-lg p-2 text-sm hover:bg-secondary">
                    <p className="line-clamp-2">{r.content}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{timeAgo(r.createdAt)} · {r.shift}</p>
                  </li>
                ))}
                {reportHits.length === 0 && <li className="text-sm text-muted-foreground">Keine Treffer.</li>}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold"><ClipboardList className="h-4 w-4 text-primary" /> Maßnahmen <Badge variant="secondary">{planHits.length}</Badge></div>
              <ul className="space-y-2">
                {planHits.map((p) => (
                  <li key={p.id} className="rounded-lg p-2 text-sm hover:bg-secondary">
                    <div className="font-semibold">{p.title}</div>
                    <p className="text-xs text-muted-foreground">{p.frequency}</p>
                  </li>
                ))}
                {planHits.length === 0 && <li className="text-sm text-muted-foreground">Keine Treffer.</li>}
              </ul>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
