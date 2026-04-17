import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, Users, Wallet, TrendingUp, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getPartnerSession } from "@/components/partner/session";
import { listLeadsByPartner, listCommissionsByPartner, partnerStats } from "@/components/partner/data";

export const metadata = { title: "Dashboard" };

function euro(n: number): string {
  return new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
}

export default async function PartnerDashboardPage() {
  const session = await getPartnerSession();
  if (!session) redirect("/partner/login");
  const stats = partnerStats(session.id);
  const leads = listLeadsByPartner(session.id).slice(0, 5);
  const commissions = listCommissionsByPartner(session.id).slice(0, 5);

  return (
    <div className="container max-w-6xl space-y-8 py-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Willkommen zurück,</p>
          <h1 className="font-serif text-3xl font-semibold md:text-4xl">{session.contactName}</h1>
          <div className="mt-2 flex items-center gap-2 text-sm">
            <Badge variant="outline" className="capitalize">{tierLabel(session.tier)}</Badge>
            {session.certified ? (
              <Badge className="bg-primary text-primary-foreground">Certified</Badge>
            ) : (
              <Badge variant="outline">Zertifizierung offen</Badge>
            )}
            <span className="text-muted-foreground">· {(session.commissionRate * 100).toFixed(0)} % Provision</span>
          </div>
        </div>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Users} label="Leads gesamt" value={stats.leads.toString()} sub={`${stats.openLeads} offen`} />
        <StatCard icon={TrendingUp} label="Abschlüsse (won)" value={stats.wonLeads.toString()} sub={`${euro(stats.pipelineEuro)} Pipeline`} />
        <StatCard icon={Wallet} label="Provisionen Jahr" value={euro(stats.annualCommissionEuro)} sub="über 12 Monate" />
        <StatCard icon={Clock} label="Auszahlung offen" value={euro(stats.pendingPayoutEuro)} sub="nächste Zahlung" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="font-serif text-xl font-semibold">Deine neuesten Leads</h2>
              <Link href="/partner/leads" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                Alle <ArrowRight className="size-4" />
              </Link>
            </div>
            {leads.length === 0 ? (
              <p className="text-sm text-muted-foreground">Noch keine Leads. Leg jetzt deinen ersten an.</p>
            ) : (
              <ul className="space-y-3">
                {leads.map((l) => (
                  <li key={l.id} className="flex items-center justify-between gap-2 border-b border-border pb-3 last:border-b-0 last:pb-0">
                    <div>
                      <div className="font-medium">{l.facilityName}</div>
                      <div className="text-xs text-muted-foreground">{l.places} Plätze · {euro(l.estimatedMonthlyValue)}/Monat</div>
                    </div>
                    <StatusBadge status={l.status} />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="mb-4 flex items-baseline justify-between">
              <h2 className="font-serif text-xl font-semibold">Provisionen</h2>
              <Link href="/partner/provisionen" className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                Alle <ArrowRight className="size-4" />
              </Link>
            </div>
            {commissions.length === 0 ? (
              <p className="text-sm text-muted-foreground">Noch keine Provisionen — dein erster Abschluss bringt den ersten Eintrag.</p>
            ) : (
              <ul className="space-y-3">
                {commissions.map((c) => (
                  <li key={c.id} className="flex items-center justify-between gap-2 border-b border-border pb-3 last:border-b-0 last:pb-0">
                    <div>
                      <div className="font-medium">{c.facilityName}</div>
                      <div className="text-xs text-muted-foreground">
                        {(c.rate * 100).toFixed(0)} % von {euro(c.monthlyValue * 12)} = {euro(c.annualEuro)}
                      </div>
                    </div>
                    <Badge variant={c.status === "paid" ? "outline" : "default"}>
                      {c.status === "paid" ? "ausgezahlt" : "offen"}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub }: { icon: React.ComponentType<{ className?: string }>; label: string; value: string; sub: string }) {
  return (
    <Card>
      <CardContent className="flex items-start gap-4 p-5">
        <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Icon className="size-5" aria-hidden="true" />
        </div>
        <div>
          <div className="text-xs uppercase tracking-wide text-muted-foreground">{label}</div>
          <div className="text-2xl font-semibold tabular-nums">{value}</div>
          <div className="text-xs text-muted-foreground">{sub}</div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; tone: "primary" | "accent" | "muted" | "error" }> = {
    neu: { label: "Neu", tone: "muted" },
    qualifiziert: { label: "Qualifiziert", tone: "muted" },
    demo: { label: "Demo", tone: "accent" },
    verhandlung: { label: "Verhandlung", tone: "accent" },
    won: { label: "Won", tone: "primary" },
    lost: { label: "Lost", tone: "error" },
  };
  const v = map[status] ?? { label: status, tone: "muted" as const };
  const toneClass =
    v.tone === "primary"
      ? "border-primary/30 bg-primary/10 text-primary"
      : v.tone === "accent"
      ? "border-accent/30 bg-accent/10 text-accent-foreground"
      : v.tone === "error"
      ? "border-destructive/30 bg-destructive/10 text-destructive"
      : "border-border bg-muted text-foreground";
  return <span className={"rounded-full border px-2.5 py-0.5 text-xs font-medium " + toneClass}>{v.label}</span>;
}

function tierLabel(t: string): string {
  switch (t) {
    case "reseller": return "Reseller";
    case "implementation": return "Implementation";
    case "integration": return "Integration";
    case "consulting": return "Consulting";
    default: return t;
  }
}
