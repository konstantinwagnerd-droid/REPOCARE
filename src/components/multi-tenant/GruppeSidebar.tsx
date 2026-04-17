"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Building2, ScaleIcon as Scale, ShieldCheck, Banknote, Settings, Network } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/gruppe", label: "Übersicht", icon: LayoutDashboard },
  { href: "/gruppe/einrichtungen", label: "Einrichtungen", icon: Building2 },
  { href: "/gruppe/kpi-vergleich", label: "KPI-Vergleich", icon: Scale },
  { href: "/gruppe/compliance", label: "Compliance", icon: ShieldCheck },
  { href: "/gruppe/finanzen", label: "Finanzen", icon: Banknote },
  { href: "/gruppe/einstellungen", label: "Einstellungen", icon: Settings },
];

export function GruppeSidebar({ groupName, logoText, facilityCount }: { groupName: string; logoText: string; facilityCount: number }) {
  const pathname = usePathname();
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-muted/30 lg:flex">
      <div className="flex h-16 items-center gap-3 border-b border-border px-6">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground font-serif text-sm font-bold">
          {logoText}
        </span>
        <div className="min-w-0">
          <div className="truncate font-serif text-sm font-semibold leading-tight">{groupName}</div>
          <div className="text-[11px] uppercase tracking-wide text-muted-foreground">{facilityCount} Einrichtungen</div>
        </div>
      </div>
      <div className="flex items-center gap-2 border-b border-border px-6 py-2 text-xs text-muted-foreground">
        <Network className="h-3.5 w-3.5" /> Gruppen-Ebene
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {nav.map((item) => {
          const active = pathname === item.href || (item.href !== "/gruppe" && pathname.startsWith(item.href));
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
        <Link
          href="/admin"
          className="mt-4 flex items-center gap-3 rounded-xl border border-dashed border-border px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary"
        >
          <ShieldCheck className="h-4 w-4" /> Admin einer Einrichtung
        </Link>
      </nav>
      <div className="border-t border-border p-4 text-xs text-muted-foreground">
        <div>Rolle: <span className="font-semibold text-foreground">Group Admin</span></div>
        <div className="mt-1 text-[11px]">Daten aggregiert über alle Häuser · DSGVO-konform</div>
      </div>
    </aside>
  );
}
