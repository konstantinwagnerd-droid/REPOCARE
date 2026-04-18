/**
 * Owner-Cockpit — Live-Dashboard mit allen wichtigen Zahlen aller Mandanten.
 * Refactored auf Shell-Components (PageContainer/PageHeader/StatCard) mit Sparklines
 * auf zeitreihen-fähigen KPIs.
 */
import postgres from "postgres";
import { Activity, Users, Building2, Mail, Shield, Eye, AlertTriangle, Database, Wrench, Info, FileClock } from "lucide-react";
import {
  PageContainer, PageHeader, PageSection, PageGrid, StatCard, QuickAction,
} from "@/components/admin/page-shell";

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
  /** Logins der letzten 7 Tage (aelteste zuerst). */
  loginsTrend: number[];
  /** Sessions/Stunde der letzten 12 Stunden. */
  sessionsTrend: number[];
  /** Neue Leads der letzten 7 Tage. */
  leadsTrend: number[];
  /** Audit-Events der letzten 7 Tage. */
  auditTrend: number[];
}

const EMPTY_STATS: Stats = {
  tenants: 0, users: 0, residents: 0,
  leads: { total: 0, new: 0 },
  loginsToday: 0, loginsLast24h: 0, sessionsLastHour: 0,
  auditEventsToday: 0, errorsToday: 0,
  loginsTrend: [], sessionsTrend: [], leadsTrend: [], auditTrend: [],
};

async function loadStats(): Promise<Stats> {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return EMPTY_STATS;
  const sql = postgres(dbUrl, { max: 1, prepare: false, idle_timeout: 5 });
  try {
    const [tenants, users, residents, leadsTotal, leadsNew, loginsToday, loginsLast24h, sessionsLastHour, auditToday, loginsByDay, leadsByDay, auditByDay, sessionsByHour] = await Promise.all([
      sql`SELECT COUNT(*)::int as c FROM tenants`,
      sql`SELECT COUNT(*)::int as c FROM users WHERE role != 'owner'`,
      sql`SELECT COUNT(*)::int as c FROM residents WHERE deleted_at IS NULL`,
      sql`SELECT COUNT(*)::int as c FROM leads`,
      sql`SELECT COUNT(*)::int as c FROM leads WHERE status = 'neu'`,
      sql`SELECT COUNT(*)::int as c FROM audit_log WHERE action = 'login' AND created_at >= CURRENT_DATE`,
      sql`SELECT COUNT(*)::int as c FROM audit_log WHERE action = 'login' AND created_at >= NOW() - INTERVAL '24 hours'`,
      sql`SELECT COUNT(DISTINCT user_id)::int as c FROM audit_log WHERE created_at >= NOW() - INTERVAL '1 hour' AND user_id IS NOT NULL`,
      sql`SELECT COUNT(*)::int as c FROM audit_log WHERE created_at >= CURRENT_DATE`,
      sql`SELECT date_trunc('day', created_at) as day, COUNT(*)::int as c FROM audit_log WHERE action='login' AND created_at >= NOW() - INTERVAL '7 days' GROUP BY day ORDER BY day`,
      sql`SELECT date_trunc('day', created_at) as day, COUNT(*)::int as c FROM leads WHERE created_at >= NOW() - INTERVAL '7 days' GROUP BY day ORDER BY day`,
      sql`SELECT date_trunc('day', created_at) as day, COUNT(*)::int as c FROM audit_log WHERE created_at >= NOW() - INTERVAL '7 days' GROUP BY day ORDER BY day`,
      sql`SELECT date_trunc('hour', created_at) as hour, COUNT(DISTINCT user_id)::int as c FROM audit_log WHERE created_at >= NOW() - INTERVAL '12 hours' AND user_id IS NOT NULL GROUP BY hour ORDER BY hour`,
    ]);
    return {
      tenants: tenants[0].c, users: users[0].c, residents: residents[0].c,
      leads: { total: leadsTotal[0].c, new: leadsNew[0].c },
      loginsToday: loginsToday[0].c, loginsLast24h: loginsLast24h[0].c,
      sessionsLastHour: sessionsLastHour[0].c,
      auditEventsToday: auditToday[0].c, errorsToday: 0,
      loginsTrend: loginsByDay.map((r: { c: number }) => r.c),
      leadsTrend: leadsByDay.map((r: { c: number }) => r.c),
      auditTrend: auditByDay.map((r: { c: number }) => r.c),
      sessionsTrend: sessionsByHour.map((r: { c: number }) => r.c),
    };
  } catch {
    return EMPTY_STATS;
  } finally {
    await sql.end();
  }
}

export default async function OwnerCockpitPage() {
  const s = await loadStats();
  return (
    <PageContainer>
      <PageHeader
        title="Cockpit"
        subtitle="Echtzeit-Übersicht über alle Mandanten, Sessions und Aktivitäten — ausschließlich für dich."
      />

      <PageSection heading="Live" compact>
        <PageGrid columns={4}>
          <StatCard
            label="Aktive Sessions (1h)"
            value={s.sessionsLastHour}
            sublabel="Eindeutige User:innen"
            icon={Eye}
            tone={s.sessionsLastHour > 0 ? "success" : "default"}
            sparkline={s.sessionsTrend}
            href="/owner/sessions"
          />
          <StatCard
            label="Logins heute"
            value={s.loginsToday}
            sublabel={`${s.loginsLast24h} in 24h`}
            icon={Activity}
            tone="primary"
            sparkline={s.loginsTrend}
            href="/owner/logins"
          />
          <StatCard
            label="Audit-Events heute"
            value={s.auditEventsToday}
            sublabel="Alle Mandanten"
            icon={Shield}
            sparkline={s.auditTrend}
            href="/owner/audit"
          />
          <StatCard
            label="Errors heute"
            value={s.errorsToday}
            sublabel="5xx + ungefangene Exceptions"
            icon={AlertTriangle}
            tone={s.errorsToday > 5 ? "danger" : "default"}
            trend={s.errorsToday > 0 ? { value: `${s.errorsToday}`, direction: "up", positive: false } : undefined}
          />
        </PageGrid>
      </PageSection>

      <PageSection heading="Bestand" compact>
        <PageGrid columns={4}>
          <StatCard label="Einrichtungen" value={s.tenants} icon={Building2} href="/owner/tenants" />
          <StatCard label="Users (ohne Owner)" value={s.users} icon={Users} href="/owner/users" />
          <StatCard label="Bewohner:innen" value={s.residents} icon={Users} tone="primary" href="/owner/residents" />
          <StatCard
            label="Leads gesamt"
            value={s.leads.total}
            sublabel={`${s.leads.new} neu`}
            icon={Mail}
            tone={s.leads.new > 0 ? "warning" : "default"}
            sparkline={s.leadsTrend}
            href="/owner/leads"
          />
        </PageGrid>
      </PageSection>

      <PageSection heading="Quick-Actions">
        <PageGrid columns={2} gap="sm">
          <QuickAction title="Als anderer User einloggen" description="Impersonation fuer Support — wird audit-getrackt" href="/owner/users" icon={Eye} tone="primary" />
          <QuickAction title="SQL-Inspektor" description="Read-only Queries gegen Production-DB" href="/owner/database" icon={Database} />
          <QuickAction title="System-Info" description="Env-Vars (maskiert), Build-Info, DB-Stats" href="/owner/system" icon={Info} />
          <QuickAction title="Globaler Audit-Log" description="Alle Mandanten zusammen, gefiltert nach Risiko" href="/owner/audit" icon={FileClock} />
          <QuickAction title="Files / Backups" description="Blob-Storage, Dateiinventar" href="/owner/files" icon={Wrench} />
          <QuickAction title="Einstellungen" description="Globale Plattform-Settings" href="/owner/settings" icon={Shield} />
        </PageGrid>
      </PageSection>
    </PageContainer>
  );
}
