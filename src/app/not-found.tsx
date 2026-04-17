import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 p-8 text-center">
      <div aria-hidden className="text-7xl font-bold tracking-tighter text-primary/80">404</div>
      <h1 className="text-2xl font-semibold">Seite nicht gefunden</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        Die gesuchte Seite existiert nicht oder wurde verschoben. Prüfen Sie die Adresse oder kehren Sie zur Startseite zurück.
      </p>
      <div className="flex gap-3">
        <Link href="/" className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
          Zur Startseite
        </Link>
        <Link href="/kontakt" className="rounded-md border px-4 py-2 text-sm font-medium">
          Kontakt
        </Link>
      </div>
    </div>
  );
}
