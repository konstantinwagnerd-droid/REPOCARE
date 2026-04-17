"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Award, BookOpen, Calendar, Home, Library, Shield, Sparkles, Users, BarChart3, ClipboardList, FileBarChart } from "lucide-react";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string; icon: React.ComponentType<{ className?: string }> };

const learnerNav: NavItem[] = [
  { href: "/lms", label: "Übersicht", icon: Home },
  { href: "/lms/katalog", label: "Kurs-Katalog", icon: Library },
  { href: "/lms/zertifikate", label: "Zertifikate", icon: Award },
  { href: "/lms/kalender", label: "Fristen-Kalender", icon: Calendar },
];

const adminNav: NavItem[] = [
  { href: "/admin/lms", label: "Übersicht", icon: Home },
  { href: "/admin/lms/kurse", label: "Kurse", icon: BookOpen },
  { href: "/admin/lms/zuweisungen", label: "Zuweisungen", icon: ClipboardList },
  { href: "/admin/lms/compliance", label: "Compliance", icon: Shield },
  { href: "/admin/lms/reports", label: "Reports", icon: FileBarChart },
];

export function LmsShell({
  children,
  role,
  userName,
  facility,
  mode = "learner",
}: {
  children: React.ReactNode;
  role: string;
  userName: string;
  facility: string;
  mode?: "learner" | "admin";
}) {
  const pathname = usePathname();
  const nav = mode === "admin" ? adminNav : learnerNav;
  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-border bg-muted/30 lg:flex">
        <div className="flex h-16 items-center gap-2 border-b border-border px-6 font-serif text-lg font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </span>
          CareAI <span className="text-muted-foreground">Learning</span>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map((item) => {
            const active = pathname === item.href || (item.href !== "/lms" && item.href !== "/admin/lms" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
          {mode === "learner" && (role === "admin" || role === "pdl") && (
            <Link
              href="/admin/lms"
              className="mt-4 flex items-center gap-3 rounded-xl border border-dashed border-border px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary"
            >
              <Users className="h-4 w-4" /> Training-Admin
            </Link>
          )}
          {mode === "admin" && (
            <Link
              href="/lms"
              className="mt-4 flex items-center gap-3 rounded-xl border border-dashed border-border px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary"
            >
              <BookOpen className="h-4 w-4" /> Zur Lernansicht
            </Link>
          )}
          <Link
            href="/app"
            className="mt-1 flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs text-muted-foreground hover:bg-secondary"
          >
            <BarChart3 className="h-4 w-4" /> Zurück zu CareAI
          </Link>
        </nav>
        <div className="border-t border-border p-3">
          <div className="rounded-xl bg-background p-3">
            <div className="text-sm font-semibold">{userName}</div>
            <div className="text-xs text-muted-foreground capitalize">{role}</div>
          </div>
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center gap-4 border-b border-border bg-background px-6">
          <div className="flex-1">
            <div className="font-serif text-sm font-semibold">CareAI Learning</div>
            <div className="text-xs text-muted-foreground">{facility}</div>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {mode === "admin" ? "Training-Admin" : "Lernender"}
          </span>
        </header>
        <main className="flex-1 bg-muted/10">{children}</main>
      </div>
    </div>
  );
}
