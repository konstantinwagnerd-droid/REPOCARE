import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = { title: "Neues Experiment" };

export default function NewExperimentPage() {
  return (
    <div className="container py-10 max-w-3xl">
      <Link href="/admin/ab-testing" className="text-sm text-muted-foreground hover:text-primary">← Zurück</Link>
      <Badge variant="outline" className="mt-3 mb-2">Neues Experiment</Badge>
      <h1 className="font-serif text-3xl font-semibold">Experiment anlegen</h1>
      <p className="mt-1 text-muted-foreground">Definiere Varianten, Traffic-Split, Metrik und Erfolgskriterien.</p>

      <Card className="mt-6"><CardContent className="p-6 space-y-6">
        <form className="space-y-5">
          <div>
            <label className="text-sm font-medium">Name (URL-Slug)</label>
            <input className="mt-1 block w-full rounded-md border px-3 py-2 text-sm" placeholder="z.B. hero-headline" />
          </div>
          <div>
            <label className="text-sm font-medium">Beschreibung</label>
            <textarea className="mt-1 block w-full rounded-md border px-3 py-2 text-sm" rows={2} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Traffic (%)</label>
              <input type="number" defaultValue={100} min={0} max={100} className="mt-1 block w-full rounded-md border px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="text-sm font-medium">Min. Sample pro Variante</label>
              <input type="number" defaultValue={500} className="mt-1 block w-full rounded-md border px-3 py-2 text-sm" />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium">Max. Dauer (Tage)</label>
            <input type="number" defaultValue={28} className="mt-1 block w-full rounded-md border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="text-sm font-medium">Varianten (je Zeile)</label>
            <textarea rows={3} className="mt-1 block w-full rounded-md border px-3 py-2 text-sm" placeholder="Control&#10;Variante B&#10;Variante C" />
          </div>
          <div>
            <label className="text-sm font-medium">Metrik / Conversion-Event</label>
            <input className="mt-1 block w-full rounded-md border px-3 py-2 text-sm" placeholder="signup, demo-request, cta-click" />
          </div>
        </form>
        <div className="flex gap-3 pt-2">
          <Button variant="accent">Als Entwurf speichern</Button>
          <Button variant="outline">Jetzt starten</Button>
          <Button asChild variant="ghost"><Link href="/admin/ab-testing">Abbrechen</Link></Button>
        </div>
        <p className="text-xs text-muted-foreground">Hinweis: Persistenz & Start-Logik werden in der nächsten Iteration mit DB-Migration verknüpft. Derzeit Seed-basiert (siehe <code>store.ts</code>).</p>
      </CardContent></Card>
    </div>
  );
}
