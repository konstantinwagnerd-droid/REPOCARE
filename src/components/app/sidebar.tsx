"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, FileText, Mic, Search, LogOut, Sparkles, Settings, Shield, FileCheck, ClipboardCheck, Plug, LayoutGrid, Database, Bell, BarChart3, Radar, Receipt, Flag, UserCheck, Clock } from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import type { Role } from "@/db/schema";

const pflegeNav = [
  { href: "/app", label: "Übersicht", icon: LayoutDashboard },
  { href: "/app/residents", label: "Bewohner:innen", icon: Users },
  { href: "/app/handover", label: "Schichtbericht", icon: FileText },
  { href: "/app/voice", label: "Spracheingabe", icon: Mic },
  { href: "/app/search", label: "Suchen", icon: Search },
  { href: "/app/zeiterfassung", label: "Zeiterfassung", icon: Clock },
  { href: "/app/notifications", label: "Benachrichtigungen", icon: Bell },
];

const adminNav = [
  { href: "/admin", label: "Übersicht", icon: LayoutDashboard },
  { href: "/admin/residents", label: "Bewohnende", icon: Users },
  { href: "/admin/staff", label: "Mitarbeitende", icon: Users },
  { href: "/admin/schedule", label: "Dienstplan", icon: FileText },
  { href: "/admin/audit", label: "Audit-Log", icon: Shield },
  { href: "/admin/reports", label: "Reports", icon: FileText },
  { href: "/admin/report-builder", label: "Dashboard-Builder", icon: LayoutGrid },
  { href: "/admin/webhooks", label: "Webhooks", icon: Plug },
  { href: "/admin/backup", label: "Backup", icon: Database },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/anomaly", label: "Anomalien", icon: Radar },
  { href: "/admin/zeiterfassung", label: "Zeiterfassung", icon: Clock },
  { href: "/admin/billing", label: "API-Billing", icon: Receipt },
  { href: "/admin/feature-flags", label: "Feature-Flags", icon: Flag },
  { href: "/admin/impersonation", label: "Impersonation", icon: UserCheck },
  { href: "/admin/settings", label: "Einstellungen", icon: Settings },
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
      <nav className="flex-1 space-y-1 p-3">
        {nav.map((item) => {
          const active = pathname === item.href || (item.href !== "/app" && item.href !== "/admin" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
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
