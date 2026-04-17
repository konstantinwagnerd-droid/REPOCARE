"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle2 } from "lucide-react";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSent(true);
  };

  if (sent) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <CheckCircle2 className="h-7 w-7" />
          </span>
          <h3 className="font-serif text-2xl font-semibold">Danke — wir melden uns.</h3>
          <p className="max-w-md text-muted-foreground">
            Ihre Nachricht ist angekommen. Eine Antwort erhalten Sie werktags innerhalb von 24 Stunden an Ihre E-Mail.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-7">
        <h2 className="font-serif text-2xl font-semibold">Nachricht senden</h2>
        <form onSubmit={onSubmit} className="mt-6 space-y-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="name">Ihr Name</Label>
              <Input id="name" name="name" required className="mt-2" autoComplete="name" />
            </div>
            <div>
              <Label htmlFor="organisation">Einrichtung / Organisation</Label>
              <Input id="organisation" name="organisation" className="mt-2" autoComplete="organization" />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="email">E-Mail</Label>
              <Input id="email" name="email" type="email" required className="mt-2" autoComplete="email" />
            </div>
            <div>
              <Label htmlFor="phone">Telefon (optional)</Label>
              <Input id="phone" name="phone" type="tel" className="mt-2" autoComplete="tel" />
            </div>
          </div>
          <div>
            <Label htmlFor="topic">Thema</Label>
            <select
              id="topic"
              name="topic"
              className="mt-2 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              defaultValue="Allgemeine Anfrage"
            >
              <option>Allgemeine Anfrage</option>
              <option>Demo vereinbaren</option>
              <option>Preise und Vertrag</option>
              <option>Security / Compliance</option>
              <option>Presse</option>
              <option>Partnerschaft</option>
            </select>
          </div>
          <div>
            <Label htmlFor="message">Ihre Nachricht</Label>
            <Textarea id="message" name="message" rows={6} required className="mt-2" />
          </div>
          <label className="flex items-start gap-3 text-sm text-muted-foreground">
            <input type="checkbox" required className="mt-1" />
            <span>
              Ich stimme der{" "}
              <a href="/datenschutz" className="text-primary hover:underline">
                Datenschutzerklaerung
              </a>{" "}
              zu. Meine Daten werden nur zur Bearbeitung der Anfrage verwendet.
            </span>
          </label>
          <Button type="submit" variant="accent" size="lg" disabled={loading}>
            {loading ? "Wird gesendet …" : "Nachricht senden"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
