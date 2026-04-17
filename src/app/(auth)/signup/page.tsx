import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight">Demo anfragen</h1>
        <p className="mt-2 text-muted-foreground">
          Wir rufen Sie innerhalb eines Werktages zurück und richten einen persönlichen Demo-Zugang ein.
        </p>
      </div>

      <form className="space-y-5" action="/api/demo-request" method="post">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstname">Vorname</Label>
            <Input id="firstname" name="firstname" required autoComplete="given-name" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastname">Nachname</Label>
            <Input id="lastname" name="lastname" required autoComplete="family-name" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="facility">Einrichtung</Label>
          <Input id="facility" name="facility" required placeholder="Name der Pflegeeinrichtung" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Dienstliche E-Mail</Label>
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Telefon</Label>
          <Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+43 ..." />
        </div>
        <div className="space-y-2">
          <Label htmlFor="message">Was ist Ihre größte Herausforderung?</Label>
          <Textarea id="message" name="message" rows={3} placeholder="z.B. Dokumentationszeit, MDK-Prüfung, Mitarbeiterbindung ..." />
        </div>

        <div className="rounded-xl border border-border bg-muted/40 p-4 text-sm">
          <ul className="space-y-2">
            <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> 30 Minuten, komplett unverbindlich</li>
            <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> Live-Zugriff auf echte Demo-Umgebung</li>
            <li className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> Keine Kreditkarte, keine Verpflichtung</li>
          </ul>
        </div>

        <Button type="submit" size="lg" variant="accent" className="w-full">Demo-Termin anfragen</Button>
      </form>

      <p className="text-sm text-muted-foreground">
        Schon einen Zugang?{" "}
        <Link href="/login" className="font-semibold text-primary hover:underline">Jetzt anmelden</Link>
      </p>
    </div>
  );
}
