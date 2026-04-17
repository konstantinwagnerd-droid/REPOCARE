import { db } from "@/db/client";
import { auth } from "@/lib/auth";
import { residents, careReports } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { initials, formatDate, calcAge, timeAgo } from "@/lib/utils";
import { Heart, Image as ImageIcon, MessageSquare } from "lucide-react";

export default async function FamilyHome() {
  const session = await auth();
  // Demo: show first resident linked to this family user (or fallback to first)
  const list = await db.select().from(residents).where(eq(residents.tenantId, session!.user.tenantId)).limit(1);
  const r = list[0];
  if (!r) return <div className="p-10">Keine freigegebenen Bewohner:innen.</div>;

  const reports = await db.select().from(careReports).where(eq(careReports.residentId, r.id)).orderBy(desc(careReports.createdAt)).limit(5);

  // Family-friendly filtered summary
  const wellbeing = r.wellbeingScore ?? 7;

  return (
    <div className="space-y-8 p-6 lg:p-10">
      <Card className="overflow-hidden">
        <CardContent className="flex flex-col gap-6 bg-gradient-to-br from-primary-50 to-background p-8 md:flex-row md:items-center">
          <Avatar className="h-20 w-20"><AvatarFallback className="text-xl">{initials(r.fullName)}</AvatarFallback></Avatar>
          <div className="flex-1">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Ihre:r Angehörige:r</div>
            <h1 className="font-serif text-4xl font-semibold tracking-tight">{r.fullName}</h1>
            <p className="text-muted-foreground">{calcAge(r.birthdate)} Jahre · Zimmer {r.room} · aufgenommen {formatDate(r.admissionDate)}</p>
          </div>
          <div className="w-full md:w-64">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 font-semibold"><Heart className="h-4 w-4 text-accent" /> Wohlbefinden heute</span>
              <span className="font-serif text-lg">{wellbeing}/10</span>
            </div>
            <Progress value={wellbeing * 10} />
            <p className="mt-2 text-xs text-muted-foreground">Eingeschätzt durch das Pflegeteam um 09:00.</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Tagesübersicht</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {reports.length === 0 && <p className="text-sm text-muted-foreground">Heute noch kein Eintrag — schauen Sie später gerne wieder vorbei.</p>}
            {reports.map((r) => (
              <div key={r.id} className="rounded-xl border border-border p-4">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{r.shift}-Schicht</Badge>
                  <span className="text-xs text-muted-foreground">{timeAgo(r.createdAt)}</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed">{r.content}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><ImageIcon className="h-5 w-5 text-primary" /> Aktivitäten</CardTitle></CardHeader>
          <CardContent>
            <p className="mb-3 text-sm text-muted-foreground">Fotos werden nur mit Einwilligung geteilt.</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: "Gartenrunde", color: "from-emerald-200 to-emerald-50" },
                { label: "Singkreis", color: "from-amber-200 to-amber-50" },
                { label: "Gymnastik", color: "from-sky-200 to-sky-50" },
                { label: "Erinnerungsrunde", color: "from-rose-200 to-rose-50" },
              ].map((a) => (
                <div key={a.label} className={`flex aspect-square items-end rounded-xl bg-gradient-to-br ${a.color} p-2 text-xs font-semibold`}>
                  {a.label}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader><CardTitle className="flex items-center gap-2"><MessageSquare className="h-5 w-5 text-primary" /> Nachricht an das Pflegeteam</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-3 md:flex-row">
            <textarea className="h-24 flex-1 rounded-xl border border-input bg-background p-3 text-sm" placeholder="Ihre Nachricht…" />
            <button className="rounded-xl bg-accent px-6 py-3 font-medium text-accent-foreground hover:bg-accent-600">Senden</button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
