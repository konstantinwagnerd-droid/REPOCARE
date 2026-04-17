import Link from "next/link";
import { Compass, ArrowLeft, LayoutDashboard } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center gap-6 p-8 text-center">
      <div aria-hidden className="relative">
        <div className="absolute inset-0 -z-10 rounded-full bg-primary/10 blur-2xl" />
        <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/15 to-accent/15 text-primary motion-safe:animate-[pulse_3s_ease-in-out_infinite]">
          <Compass className="h-12 w-12" strokeWidth={1.5} />
        </div>
      </div>
      <div aria-hidden className="font-serif text-7xl font-bold tracking-tighter text-primary/80">404</div>
      <h1 className="font-serif text-3xl font-semibold tracking-tight">Seite nicht gefunden</h1>
      <p className="max-w-md text-base text-muted-foreground">
        Diese Seite existiert nicht oder wurde verschoben. Vielleicht hilft die Suche oder der Weg zum Dashboard.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link href="/app" className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90">
          <LayoutDashboard className="h-4 w-4" /> Zum Dashboard
        </Link>
        <Link href="/" className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-secondary">
          <ArrowLeft className="h-4 w-4" /> Zur Startseite
        </Link>
        <Link href="/kontakt" className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-secondary">
          Kontakt
        </Link>
      </div>
    </div>
  );
}
