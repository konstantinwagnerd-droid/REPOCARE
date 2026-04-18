/**
 * Owner-Center Layout — versteckter Super-Admin-Bereich.
 * NUR fuer role='owner' (Konstantin). Andere User: 404.
 */
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { Activity, Users, Building2, FileText, Shield, Database, Mail, Eye, Settings, KeyRound, Globe } from "lucide-react";

export const dynamic = "force-dynamic";

const NAV = [
  { href: "/owner", label: "Cockpit", icon: Activity },
  { href: "/owner/sessions", label: "Live-Sessions", icon: Eye },
  { href: "/owner/logins", label: "Login-Historie", icon: KeyRound },
  { href: "/owner/users", label: "Alle Users", icon: Users },
  { href: "/owner/tenants", label: "Alle Einrichtungen", icon: Building2 },
  { href: "/owner/residents", label: "Alle Bewohner:innen", icon: Users },
  { href: "/owner/audit", label: "Audit-Log (global)", icon: Shield },
  { href: "/owner/leads", label: "Leads & Demo-Anfragen", icon: Mail },
  { href: "/owner/database", label: "Datenbank-Inspektor", icon: Database },
  { href: "/owner/files", label: "Dateien & Exports", icon: FileText },
  { href: "/owner/system", label: "System-Info", icon: Globe },
  { href: "/owner/settings", label: "Owner-Settings", icon: Settings },
];

export default async function OwnerLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login?next=/owner");

  // Strikte Role-Pruefung — nur 'owner' darf rein. Alle anderen: 404 (Versteckung).
  const role = (session.user as { role?: string }).role;
  if (role !== "owner") notFound();

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      {/* Owner-Banner — schwarzer Streifen oben damit immer klar ist wo du bist */}
      <div className="bg-black text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs">
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-amber-400" />
            <span className="font-medium tracking-wide">OWNER-MODUS — Vollzugriff auf alle Mandanten</span>
          </div>
          <div className="text-stone-300">
            Eingeloggt als <strong>{session.user.email}</strong>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-[1600px]">
        {/* Sidebar */}
        <aside className="w-64 shrink-0 border-r border-border bg-background p-4">
          <Link href="/owner" className="mb-6 block">
            <div className="font-serif text-lg font-semibold tracking-tight">Owner-Center</div>
            <div className="text-xs text-muted-foreground">Versteckter Bereich</div>
          </Link>
          <nav className="space-y-0.5">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted"
              >
                <item.icon size={16} aria-hidden />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="mt-8 rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-900/40 dark:bg-amber-950/40 dark:text-amber-200">
            <strong>Hinweis:</strong> Alles was du hier tust wird im global Audit-Log mit
            <br />
            <code className="mt-1 inline-block rounded bg-black/10 px-1 dark:bg-white/10">actor=owner</code>
            {" "}getaggt.
          </div>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
