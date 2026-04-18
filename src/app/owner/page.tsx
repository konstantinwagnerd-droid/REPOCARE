/**
 * Owner-Cockpit — Live-Dashboard mit allen wichtigen Zahlen aller Mandanten.
 */
import postgres from "postgres";
import Link from "next/link";
import { Activity, Users, Building2, Mail, Shield, Eye, AlertTriangle } from "lucide-react";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Stats {
  tenants: number;
  users: number;
  residents: number;
  leads: { total: number; new: number };
  loginsToday: number;
  loginsLast24h: number;
  sessionsLastHour: number;
  auditEventsToday: number;
  errorsToday: number;
}

async function loadStats(): Promise<Stats> {
  const dbUrl = process.env.DATABASE_URL;
  const empty: Stats = {
    tenants: 0, users: 0, residents: 0,
    leads: { total: 0, new: 0 },
    loginsToday: 0, loginsLast24h: 0, sessionsLastHour: 0,
    auditEventsToday: 0, errorsToday: 0,
  };
  if (!dbUrl) return empty;

  const sql = postgres(dbUrl, { max: 1, prepare: false, idle_timeout: 5 });
  try {
    const [tenants, users, residents, leadsTotal, leadsNew, loginsToday, loginsLast24h, sessionsLastHour, auditToday] = await Promise.all([
      sql`SELECT COUNT(*)::int as c FROM tenants`,
      sql`SELECT COUNT(*)::int as c FROM users WHERE role != 'owner'`,
      sql`SELECT COUNT(*)::int as c FROM residents WHERE deleted_at IS NULL`,
      sql`SELECT COUNT(*)::int as c FROM leads`,
      sql`SELECT COUNT(*)::int as c FROM leads WHERE status = 'neu'`,
      sql`SELECT COUNT(*)::int as c FROM audit_log WHERE action = 'login' AND created_at >= CURRENT_DATE`,
      sql`SELECT COUNT(*)::int as c FROM audit_log WHERE action = 'login' AND created_at >= NOW() - INTERVAL '24 hours'`,
      sql`SELECT COUNT(DISTINCT user_id)::int as c FROM audit_log WHERE created_at >= NOW() - INTERVAL '1 hour' AND user_id IS NOT NULL`,
      sql`SELECT COUNT(*)::int as c FROM audit_log WHERE created_at >= CURRENT_DATE`,
    ]);
    return {
      tenants: tenants[0].c, users: users[0].c, residents: residents[0].c,
      leads: { total: leadsTotal[0].c, new: leadsNew[0].c },
      loginsToday: loginsToday[0].c, loginsLast24h: loginsLast24h[0].c,
      sessionsLastHour: sessionsLastHour[0].c,
      auditEventsToday: auditToday[0].c, errorsToday: 0,
    };
  } catch {
    return empty;
  } finally {
    await sql.end();
  }
}

function Tile({ label, value, sub, icon: Icon, href, tone = "default" }: {
  label: string; value: number | string; sub?: string;
  icon: typeof Activity; href?: string;
  tone?: "default" | "success" | "warning" | "danger";
}) {
  const toneClass = {
    default: "border-border",
    success: "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900/40 dark:bg-emerald-950/20",
    warning: "border-amber-200 bg-amber-50/50 dark:border-amber-900/40 dark:bg-amber-950/20",
    danger: "border-rose-200 bg-rose-50/50 dark:border-rose-900/40 dark:bg-rose-950/20",
  }[tone];
  const inner = (
    <div className={`rounded-xl border bg-background p-5 transition hover:shadow-md ${toneClass}`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="mt-1 font-serif text-3xl font-semibold tracking-tight">{value}</div>
          {sub ? <div className="mt-1 text-xs text-muted-foreground">{sub}</div> : null}
        </div>
        <Icon size={20} className="text-muted-foreground" aria-hidden />
      </div>
    </div>
  );
  return href ? <Link href={href} className="block">{inner}</Link> : inner;
}

export default async function OwnerCockpitPage() {
  const stats = await loadStats();
  return (
    <div className="space-y-6 p-6 lg:p-10">
      <header>
        <h1 className="font-serif text-3xl font-semibold tracking-tight">Cockpit</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Echtzeit-Übersicht über alle Mandanten, Sessions und Aktivitäten — ausschließlich für dich.
        </p>
      </header>

      <section>
        <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Live</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <Tile label="Aktive Sessions (1h)" value={stats.sessionsLastHour} icon={Eye} href="/owner/sessions" tone={stats.sessionsLastHour > 0 ? "success" : "default"} />
          <Tile label="Logins heute" value={stats.loginsToday} sub={`${stats.loginsLast24h} in 24h`} icon={Activity} href="/owner/logins" />
          <Tile label="Audit-Events heute" value={stats.auditEventsToday} icon={Shield} href="/owner/audit" />
          <Tile label="Errors heute" value={stats.errorsToday} icon={AlertTriangle} tone={stats.errorsToday > 5 ? "danger" : "default"} />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">Bestand</h2>
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <Tile label="Einrichtungen" value={stats.tenants} icon={Building2} href="/owner/tenants" />
          <Tile label="Users (ohne Owner)" value={stats.users} icon={Users} href="/owner/users" />
          <Tile label="Bewohner:innen" value={stats.residents} icon={Users} href="/owner/residents" />
          <Tile label="Leads gesamt" value={stats.leads.total} sub={`${stats.leads.new} neu`} icon={Mail} href="/owner/leads" tone={stats.leads.new > 0 ? "warning" : "default"} />
        </div>
      </section>

      <section className="rounded-xl border border-border bg-background p-6">
        <h2 className="font-serif text-xl font-semibold tracking-tight">Quick-Actions</h2>
        <div className="mt-4 grid gap-2 md:grid-cols-2">
          <Link href="/owner/users" className="rounded-lg border border-border p-3 text-sm hover:bg-muted">
            <div className="font-medium">Als anderer User einloggen</div>
            <div className="text-xs text-muted-foreground">Impersonation für Support — wird audit-getrackt</div>
          </Link>
          <Link href="/owner/database" className="rounded-lg border border-border p-3 text-sm hover:bg-muted">
            <div className="font-medium">SQL-Inspektor</div>
            <div className="text-xs text-muted-foreground">Read-only Queries gegen Production-DB</div>
          </Link>
          <Link href="/owner/system" className="rounded-lg border border-border p-3 text-sm hover:bg-muted">
            <div className="font-medium">System-Info</div>
            <div className="text-xs text-muted-foreground">Env-Vars (maskiert), Build-Info, DB-Stats</div>
          </Link>
          <Link href="/owner/audit" className="rounded-lg border border-border p-3 text-sm hover:bg-muted">
            <div className="font-medium">Globaler Audit-Log</div>
            <div className="text-xs text-muted-foreground">Alle Mandanten zusammen, gefiltert nach Risiko</div>
          </Link>
        </div>
      </section>
    </div>
  );
}
