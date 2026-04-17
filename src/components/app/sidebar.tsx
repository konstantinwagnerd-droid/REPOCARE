"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, FileText, Mic, Search, LogOut, Sparkles, Settings, Shield, FileCheck, ClipboardCheck, Plug, LayoutGrid, Database, Bell, BarChart3, Radar, Receipt, Flag, UserCheck, Clock, GraduationCap, Award, Activity, Palette, Network, ArrowLeftRight, Download, Command, Stethoscope, Monitor } from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import type { Role } from "@/db/schema";

const pflegeNav = [
  { href: "/app", label: "Übersicht", icon: LayoutDashboard },
  { href: "/app/residents", label: "Bewohner:innen", icon: Users },
  { href: "/app/handover", label: "Schichtbericht", icon: FileText },
  { href: "/app/voice", label: "Spracheingabe", icon: Mic },
  { href: "/app/voice-commands", label: "Voice-Commands", icon: Command },
  { href: "/app/search", label: "Suchen", icon: Search },
  { href: "/app/zeiterfassung", label: "Zeiterfassung", icon: Clock },
  { href: "/app/notifications", label: "Benachrichtigungen", icon: Bell },
];

const adminNav = [
  { href: "/admin", label: "Übersicht", icon: LayoutDashboard, group: "Allgemein" },
  { href: "/admin/residents", label: "Bewohnende", icon: Users, group: "Allgemein" },
  { href: "/admin/staff", label: "Mitarbeitende", icon: Users, group: "Allgemein" },
  { href: "/admin/schedule", label: "Dienstplan", icon: FileText, group: "Allgemein" },
  { href: "/admin/zeiterfassung", label: "Zeiterfassung", icon: Clock, group: "Allgemein" },

  { href: "/admin/analytics", label: "Analytics", icon: BarChart3, group: "Auswertung" },
  { href: "/admin/reports", label: "Reports", icon: FileText, group: "Auswertung" },
  { href: "/admin/report-builder", label: "Report-Builder", icon: LayoutGrid, group: "Auswertung" },
  { href: "/admin/anomaly", label: "Anomalien", icon: Radar, group: "Auswertung" },
  { href: "/admin/benchmarks", label: "Benchmarks", icon: Activity, group: "Auswertung" },
  { href: "/admin/exports", label: "Exporte", icon: Download, group: "Auswertung" },

  { href: "/admin/audit", label: "Audit-Log", icon: Shield, group: "Compliance" },
  { href: "/admin/backup", label: "Backup", icon: Database, group: "Compliance" },
  { href: "/admin/dsgvo", label: "DSGVO", icon: Shield, group: "Compliance" },
  { href: "/admin/lms", label: "Lernplattform", icon: GraduationCap, group: "Compliance" },
  { href: "/admin/badges", label: "Badges", icon: Award, group: "Compliance" },

  { href: "/admin/webhooks", label: "Webhooks", icon: Plug, group: "Integrationen" },
  { href: "/admin/notifications", label: "Notifications", icon: Bell, group: "Integrationen" },
  { href: "/admin/billing", label: "API-Billing", icon: Receipt, group: "Integrationen" },
  { href: "/admin/migration", label: "Migration", icon: ArrowLeftRight, group: "Integrationen" },
  { href: "/admin/knowledge-graph", label: "Knowledge-Graph", icon: Network, group: "Integrationen" },

  { href: "/admin/feature-flags", label: "Feature-Flags", icon: Flag, group: "System" },
  { href: "/admin/whitelabel", label: "Whitelabel", icon: Palette, group: "System" },
  { href: "/admin/impersonation", label: "Impersonation", icon: UserCheck, group: "System" },
  { href: "/admin/settings", label: "Einstellungen", icon: Settings, group: "System" },
];

const familyNav = [
  { href: "/family", label: "Übersicht", icon: LayoutDashboard },
  { href: "/family/messages", label: "Nachrichten", icon: FileText },
];

export function Sidebar({ role, userName, base = "app" }: { role: Role; userName: string; base?: "app" | "admin" | "family" }) {
  const pathname = usePathname();
  const nav = base === "admin" ? adminNav : base === "family" ? familyNav : pflegeNav;

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-muted/30 lg:flex">
      <div className="flex h-16 items-center gap-2 border-b border-border px-6 font-serif text-lg font-semibold">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Sparkles className="h-4 w-4" />
        </span>
        CareAI
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {(() => {
          let lastGroup: string | undefined;
          return nav.map((item) => {
            const active = pathname === item.href || (item.href !== "/app" && item.href !== "/admin" && pathname.startsWith(item.href));
            const itemGroup = (item as { group?: string }).group;
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
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                    active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </div>
            );
          });
        })()}
        {(role === "admin" || role === "pdl") && base !== "admin" && (
          <Link href="/admin" className="mt-4 flex items-center gap-3 rounded-xl border border-dashed border-border px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary">
            <Shield className="h-4 w-4" /> Admin öffnen
          </Link>
        )}
      </nav>
      <div className="border-t border-border p-3">
        <div className="rounded-xl bg-background p-3">
          <div className="text-sm font-semibold">{userName}</div>
          <div className="text-xs text-muted-foreground capitalize">{role}</div>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
        >
          <LogOut className="h-4 w-4" /> Abmelden
        </button>
      </div>
    </aside>
  );
}
