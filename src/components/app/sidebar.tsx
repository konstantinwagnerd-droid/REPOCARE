"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, Users, FileText, Mic, Search, LogOut, Sparkles, Settings, Shield, Plug, LayoutGrid, Database, Bell, BarChart3, Radar, Receipt, Flag, UserCheck, Clock, GraduationCap, Award, Activity, Palette, Network, ArrowLeftRight, Download, Command, FlaskConical, Zap, CloudCog, Menu, X } from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import type { Role } from "@/db/schema";
import { useOptionalT } from "@/lib/i18n";

const pflegeNav = [
  { href: "/app", label: "Übersicht", i18nKey: "nav.overview", icon: LayoutDashboard, tour: "dashboard" },
  { href: "/app/residents", label: "Bewohner:innen", i18nKey: "nav.residents", icon: Users, tour: "nav-bewohner" },
  { href: "/app/handover", label: "Schichtbericht", i18nKey: "nav.handover", icon: FileText, tour: "nav-handover" },
  { href: "/app/voice", label: "Spracheingabe", i18nKey: "nav.voice", icon: Mic, tour: "nav-voice" },
  { href: "/app/voice-commands", label: "Voice-Commands", i18nKey: "nav.voiceCommands", icon: Command },
  { href: "/app/search", label: "Suchen", i18nKey: "nav.search", icon: Search },
  { href: "/app/zeiterfassung", label: "Zeiterfassung", i18nKey: "nav.timeTracking", icon: Clock },
  { href: "/app/fallbesprechung", label: "Fallbesprechung", i18nKey: "nav.caseConference", icon: FileText },
  { href: "/app/notifications", label: "Benachrichtigungen", i18nKey: "nav.notifications", icon: Bell },
];

const adminNav = [
  { href: "/admin", label: "Übersicht", icon: LayoutDashboard, group: "Allgemein" },
  { href: "/admin/residents", label: "Bewohnende", icon: Users, group: "Allgemein" },
  { href: "/admin/staff", label: "Mitarbeitende", icon: Users, group: "Allgemein", tour: "admin-users" },
  { href: "/admin/schedule", label: "Dienstplan", icon: FileText, group: "Allgemein" },
  { href: "/admin/zeiterfassung", label: "Zeiterfassung", icon: Clock, group: "Allgemein" },

  { href: "/admin/analytics", label: "Analytics", icon: BarChart3, group: "Auswertung", tour: "admin-analytics" },
  { href: "/admin/reports", label: "Reports", icon: FileText, group: "Auswertung" },
  { href: "/admin/report-builder", label: "Report-Builder", icon: LayoutGrid, group: "Auswertung" },
  { href: "/admin/anomaly", label: "Anomalien", icon: Radar, group: "Auswertung" },
  { href: "/admin/benchmarks", label: "Benchmarks", icon: Activity, group: "Auswertung" },
  { href: "/admin/exports", label: "Exporte", icon: Download, group: "Auswertung" },

  { href: "/admin/audit", label: "Audit-Log", icon: Shield, group: "Compliance", tour: "admin-audit" },
  { href: "/admin/backup", label: "Backup", icon: Database, group: "Compliance" },
  { href: "/admin/dsgvo", label: "DSGVO", icon: Shield, group: "Compliance" },
  { href: "/admin/lms", label: "Lernplattform", icon: GraduationCap, group: "Compliance" },
  { href: "/admin/badges", label: "Badges", icon: Award, group: "Compliance" },

  { href: "/admin/webhooks", label: "Webhooks", icon: Plug, group: "Integrationen" },
  { href: "/admin/notifications", label: "Notifications", icon: Bell, group: "Integrationen" },
  { href: "/admin/whatsapp", label: "WhatsApp", icon: Bell, group: "Integrationen" },
  { href: "/admin/billing", label: "API-Billing", icon: Receipt, group: "Integrationen", tour: "admin-billing" },
  { href: "/admin/migration", label: "Migration", icon: ArrowLeftRight, group: "Integrationen", tour: "admin-migration" },
  { href: "/admin/knowledge-graph", label: "Knowledge-Graph", icon: Network, group: "Integrationen" },
  { href: "/admin/crm-sync", label: "CRM-Sync", icon: CloudCog, group: "Integrationen" },

  { href: "/admin/ab-testing", label: "A/B-Testing", icon: FlaskConical, group: "Marketing" },
  { href: "/admin/marketing-automation", label: "Marketing-Automation", icon: Zap, group: "Marketing" },

  { href: "/admin/feature-flags", label: "Feature-Flags", icon: Flag, group: "System", tour: "admin-flags" },
  { href: "/admin/whitelabel", label: "Whitelabel", icon: Palette, group: "System", tour: "admin-whitelabel" },
  { href: "/admin/tours", label: "Tour-Demo", icon: Sparkles, group: "System" },
  { href: "/admin/impersonation", label: "Impersonation", icon: UserCheck, group: "System" },
  { href: "/admin/settings", label: "Einstellungen", icon: Settings, group: "System" },
];

const familyNav = [
  { href: "/family", label: "Übersicht", icon: LayoutDashboard, tour: "family-home" },
  { href: "/family/messages", label: "Nachrichten", icon: FileText, tour: "family-messages" },
];

export function Sidebar({ role, userName, base = "app" }: { role: Role; userName: string; base?: "app" | "admin" | "family" }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav = base === "admin" ? adminNav : base === "family" ? familyNav : pflegeNav;

  // Admin- und Family-Layer brauchen eine Mobile-Nav (App-Layer hat MobileBottomNav).
  const showMobileTrigger = base === "admin" || base === "family";

  return (
    <>
      {showMobileTrigger && (
        <>
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Navigation öffnen"
            aria-expanded={mobileOpen}
            aria-controls="primary-sidebar"
            className="fixed left-3 top-3 z-30 flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-background/95 shadow-sm backdrop-blur lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          {mobileOpen && (
            <div className="fixed inset-0 z-40 lg:hidden" role="dialog" aria-modal="true" aria-label="Hauptnavigation">
              <button
                type="button"
                aria-label="Navigation schließen"
                onClick={() => setMobileOpen(false)}
                className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
              />
              <div
                id="primary-sidebar"
                className="absolute inset-y-0 left-0 flex w-[min(280px,85vw)] flex-col border-r border-border bg-background pt-[env(safe-area-inset-top)] shadow-2xl"
                onClick={(e) => {
                  // Navigation bei Link-Klick schließen
                  const target = e.target as HTMLElement;
                  if (target.closest("a")) setMobileOpen(false);
                }}
              >
                <div className="flex h-14 items-center justify-between border-b border-border px-4">
                  <div className="flex items-center gap-2 font-serif text-lg font-semibold">
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <Sparkles className="h-4 w-4" />
                    </span>
                    CareAI
                  </div>
                  <button
                    type="button"
                    onClick={() => setMobileOpen(false)}
                    aria-label="Schließen"
                    className="flex h-11 w-11 items-center justify-center rounded-xl border border-border hover:bg-secondary"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <SidebarNavBody nav={nav} pathname={pathname} role={role} base={base} />
                <SidebarFooter userName={userName} role={role} />
              </div>
            </div>
          )}
        </>
      )}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-muted/30 lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-border px-6 font-serif text-lg font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </span>
          CareAI
        </div>
        <SidebarNavBody nav={nav} pathname={pathname} role={role} base={base} />
        <SidebarFooter userName={userName} role={role} />
      </aside>
    </>
  );
}

type NavItem = {
  href: string;
  label: string;
  i18nKey?: string;
  icon: React.ComponentType<{ className?: string }>;
  tour?: string;
  group?: string;
};

function SidebarNavBody({
  nav,
  pathname,
  role,
  base,
}: {
  nav: readonly NavItem[];
  pathname: string;
  role: Role;
  base: "app" | "admin" | "family";
}) {
  let lastGroup: string | undefined;
  const i18n = useOptionalT();
  return (
    <nav className="flex-1 space-y-1 overflow-y-auto p-3">
      {nav.map((item) => {
        const active =
          pathname === item.href ||
          (item.href !== "/app" && item.href !== "/admin" && pathname.startsWith(item.href));
        const itemGroup = item.group;
        const showHeading = itemGroup && itemGroup !== lastGroup;
        if (itemGroup) lastGroup = itemGroup;
        return (
          <div key={item.href}>
            {showHeading && (
              <div className="mb-1 mt-3 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 first:mt-0">
                {itemGroup}
              </div>
            )}
            <Link
              href={item.href}
              data-tour={item.tour}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {i18n && item.i18nKey ? i18n.t(item.i18nKey, item.label) : item.label}
            </Link>
          </div>
        );
      })}
      {(role === "admin" || role === "pdl") && base !== "admin" && (
        <Link
          href="/admin"
          className="mt-4 flex min-h-[44px] items-center gap-3 rounded-xl border border-dashed border-border px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary"
        >
          <Shield className="h-4 w-4" /> Admin öffnen
        </Link>
      )}
    </nav>
  );
}

function SidebarFooter({ userName, role }: { userName: string; role: Role }) {
  const i18n = useOptionalT();
  const signOutLabel = i18n?.t("nav.signOut", "Abmelden") ?? "Abmelden";
  return (
    <div className="border-t border-border p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
      <div className="rounded-xl bg-background p-3">
        <div className="text-sm font-semibold">{userName}</div>
        <div className="text-xs capitalize text-muted-foreground">{role}</div>
      </div>
      <button
        onClick={() => signOut({ callbackUrl: "/" })}
        className="mt-2 flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
      >
        <LogOut className="h-4 w-4" /> {signOutLabel}
      </button>
    </div>
  );
}
