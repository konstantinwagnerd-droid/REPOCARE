import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Handshake, LayoutDashboard, Users, Wallet, BookOpen,
  GraduationCap, Calculator, Megaphone, LifeBuoy,
} from "lucide-react";
import { getPartnerSession } from "@/components/partner/session";
import { PartnerLogoutButton } from "@/components/partner/PartnerLogoutButton";

const NAV = [
  { href: "/partner/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/partner/leads", label: "Leads", icon: Users },
  { href: "/partner/provisionen", label: "Provisionen", icon: Wallet },
  { href: "/partner/ressourcen", label: "Ressourcen", icon: BookOpen },
  { href: "/partner/schulungen", label: "Schulungen", icon: GraduationCap },
  { href: "/partner/rechner", label: "Provisions-Rechner", icon: Calculator },
  { href: "/partner/co-marketing", label: "Co-Marketing", icon: Megaphone },
  { href: "/partner/support", label: "Support", icon: LifeBuoy },
];

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const session = await getPartnerSession();
  if (!session) redirect("/partner/login");

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 border-r border-border bg-background md:block">
        <div className="sticky top-0 flex h-screen flex-col">
          <Link href="/partner/dashboard" className="flex items-center gap-3 border-b border-border p-5">
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <Handshake className="size-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block font-serif text-base font-semibold">Partner-Portal</span>
              <span className="block text-xs text-muted-foreground">{session.companyName}</span>
            </span>
          </Link>
          <nav className="flex-1 space-y-1 p-3" aria-label="Partner-Navigation">
            {NAV.map((n) => {
              const Icon = n.icon;
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className="flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
                  {n.label}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-border p-3">
            <PartnerLogoutButton />
          </div>
        </div>
      </aside>
      <main className="flex-1">{children}</main>
    </div>
  );
}
