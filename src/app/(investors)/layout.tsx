import Link from "next/link";
import { InvestorGate } from "@/components/marketing/investor-gate";

export const metadata = {
  robots: { index: false, follow: false },
};

const nav = [
  { href: "/investors", label: "Uebersicht" },
  { href: "/investors/metrics", label: "Metrics" },
  { href: "/investors/traction", label: "Traction" },
  { href: "/investors/financial-model", label: "Financial Model" },
  { href: "/investors/pitch-deck", label: "Pitch Deck" },
  { href: "/investors/cap-table", label: "Cap Table" },
  { href: "/investors/team", label: "Team" },
  { href: "/investors/qa", label: "Q&A" },
  { href: "/investors/data-room-docs", label: "Dokumente" },
];

export default function InvestorsLayout({ children }: { children: React.ReactNode }) {
  return (
    <InvestorGate>
      <div className="flex min-h-screen flex-col bg-background">
        <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur">
          <div className="container flex h-14 items-center justify-between">
            <Link href="/investors" className="flex items-center gap-2 font-serif text-lg font-semibold">
              <span className="rounded bg-primary px-2 py-0.5 text-xs text-primary-foreground">DATA ROOM</span>
              CareAI
            </Link>
            <nav className="hidden items-center gap-1 md:flex">
              {nav.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  {n.label}
                </Link>
              ))}
            </nav>
          </div>
        </header>

        {/* Wasserzeichen oben */}
        <div className="border-b border-destructive/40 bg-destructive/5 py-2 text-center text-xs font-medium uppercase tracking-wider text-destructive">
          VERTRAULICH — NUR FUER AUTORISIERTE INVESTOREN
        </div>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
          <p>
            Dieses Dokument ist streng vertraulich. Jegliche Weitergabe bedarf der ausdruecklichen schriftlichen Zustimmung der
            CareAI GmbH i.Gr. · Stand: April 2026
          </p>
        </footer>
      </div>
    </InvestorGate>
  );
}
