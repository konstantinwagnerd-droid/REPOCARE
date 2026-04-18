"use client";

/**
 * MobileBottomNav — Primäre Navigation für Pflegekräfte auf kleinen Tablets/Phones.
 *
 * Sichtbar unter lg-Breakpoint (< 1024px), wo die Sidebar nicht gerendert wird.
 * 5 Haupt-Tabs (Home, Bewohner, Voice-Center, Schicht, Mehr). "Mehr" öffnet ein
 * Sheet-Drawer mit der Komplett-Navigation.
 *
 * Design:
 *  - 64px hoch (bleibt über Android-Gestenleiste)
 *  - safe-area-inset-bottom respektiert (iPhone-Notch unten)
 *  - min-height 56px pro Touch-Target (Pflegekraft mit Handschuhen)
 *  - Active-Indicator oben, Icon + Label
 *  - role="navigation", aria-label
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, Users, Mic, FileText, Menu, X, Search, Clock, Bell, Command, LogOut, Shield } from "lucide-react";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

type Tab = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  accent?: boolean;
};

const TABS: readonly Tab[] = [
  { href: "/app", label: "Start", icon: LayoutDashboard },
  { href: "/app/residents", label: "Bewohner", icon: Users },
  { href: "/app/voice", label: "Voice", icon: Mic, accent: true },
  { href: "/app/handover", label: "Schicht", icon: FileText },
];

const MORE_LINKS = [
  { href: "/app/search", label: "Suchen", icon: Search },
  { href: "/app/voice-commands", label: "Voice-Commands", icon: Command },
  { href: "/app/zeiterfassung", label: "Zeiterfassung", icon: Clock },
  { href: "/app/notifications", label: "Benachrichtigungen", icon: Bell },
] as const;

export function MobileBottomNav({ role, userName }: { role?: string; userName?: string }) {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/app") return pathname === "/app";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {/* Spacer damit Content nicht hinter der Nav verschwindet */}
      <div className="h-20 lg:hidden" aria-hidden />

      <nav
        aria-label="Hauptnavigation"
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur",
          "pb-[env(safe-area-inset-bottom)] lg:hidden",
        )}
      >
        <ul className="grid grid-cols-5 gap-0.5 px-1 pt-1">
          {TABS.map((tab) => {
            const active = isActive(tab.href);
            return (
              <li key={tab.href}>
                <Link
                  href={tab.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex h-14 flex-col items-center justify-center gap-0.5 rounded-xl px-1 text-[11px] font-medium transition-colors",
                    "min-h-[56px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    active
                      ? tab.accent
                        ? "bg-accent/10 text-accent"
                        : "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  <tab.icon className="h-5 w-5" aria-hidden />
                  <span className="leading-none">{tab.label}</span>
                </Link>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={() => setMoreOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={moreOpen}
              className="flex h-14 w-full min-h-[56px] flex-col items-center justify-center gap-0.5 rounded-xl px-1 text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Menu className="h-5 w-5" aria-hidden />
              <span className="leading-none">Mehr</span>
            </button>
          </li>
        </ul>
      </nav>

      {/* Sheet-Drawer "Mehr" */}
      {moreOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Weitere Navigation"
        >
          <button
            type="button"
            aria-label="Schließen"
            onClick={() => setMoreOpen(false)}
            className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
          />
          <div className="absolute inset-x-0 bottom-0 rounded-t-3xl border-t border-border bg-background p-4 pb-[calc(env(safe-area-inset-bottom)+1rem)] shadow-2xl">
            <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-muted" aria-hidden />
            <div className="mb-3 flex items-center justify-between">
              <div>
                <div className="font-serif text-lg font-semibold">Mehr</div>
                {userName && <div className="text-xs text-muted-foreground">{userName} · {role}</div>}
              </div>
              <button
                type="button"
                onClick={() => setMoreOpen(false)}
                aria-label="Schließen"
                className="flex h-11 w-11 items-center justify-center rounded-xl border border-border hover:bg-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <ul className="grid grid-cols-2 gap-2" role="list">
              {MORE_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setMoreOpen(false)}
                    className="flex min-h-[56px] items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium transition-colors hover:bg-secondary"
                  >
                    <l.icon className="h-5 w-5 text-primary" aria-hidden />
                    {l.label}
                  </Link>
                </li>
              ))}
              {(role === "admin" || role === "pdl") && (
                <li className="col-span-2">
                  <Link
                    href="/admin"
                    onClick={() => setMoreOpen(false)}
                    className="flex min-h-[56px] items-center gap-3 rounded-xl border border-dashed border-border bg-card px-4 py-3 text-sm font-medium transition-colors hover:bg-secondary"
                  >
                    <Shield className="h-5 w-5 text-primary" aria-hidden />
                    Admin-Bereich öffnen
                  </Link>
                </li>
              )}
            </ul>

            <button
              type="button"
              onClick={() => {
                setMoreOpen(false);
                signOut({ callbackUrl: "/" });
              }}
              className="mt-4 flex w-full min-h-[48px] items-center justify-center gap-2 rounded-xl border border-border px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <LogOut className="h-4 w-4" aria-hidden />
              Abmelden
            </button>
          </div>
        </div>
      )}
    </>
  );
}
