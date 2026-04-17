import Link from "next/link";
import { Sparkles } from "lucide-react";

export function MarketingFooter() {
  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="container grid gap-10 py-16 md:grid-cols-4">
        <div className="space-y-3">
          <Link href="/" className="flex items-center gap-2 font-serif text-lg font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </span>
            CareAI
          </Link>
          <p className="text-sm text-muted-foreground">
            KI-gestützte Pflegedokumentation. Entwickelt in Wien. Gehostet in Falkenstein.
          </p>
        </div>
        <div>
          <h4 className="mb-3 font-serif text-sm font-semibold uppercase tracking-wider">Produkt</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="#features" className="hover:text-foreground">Funktionen</Link></li>
            <li><Link href="#preise" className="hover:text-foreground">Preise</Link></li>
            <li><Link href="/signup" className="hover:text-foreground">Demo anfragen</Link></li>
            <li><Link href="/login" className="hover:text-foreground">Anmelden</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-serif text-sm font-semibold uppercase tracking-wider">Recht</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link href="/impressum" className="hover:text-foreground">Impressum</Link></li>
            <li><Link href="/datenschutz" className="hover:text-foreground">Datenschutz</Link></li>
            <li><Link href="/agb" className="hover:text-foreground">AGB</Link></li>
            <li><Link href="/av-vertrag" className="hover:text-foreground">AV-Vertrag</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 font-serif text-sm font-semibold uppercase tracking-wider">Kontakt</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>CareAI GmbH (i.G.)</li>
            <li>Wien, Österreich</li>
            <li><a href="mailto:hallo@careai.eu" className="hover:text-foreground">hallo@careai.eu</a></li>
            <li>+43 1 234 56 78</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <div className="container flex flex-col items-center justify-between gap-3 py-6 text-xs text-muted-foreground md:flex-row">
          <p>© {new Date().getFullYear()} CareAI GmbH. Alle Rechte vorbehalten.</p>
          <p>Konform nach DSGVO, EU AI Act, MDR. Server in Deutschland.</p>
        </div>
      </div>
    </footer>
  );
}
