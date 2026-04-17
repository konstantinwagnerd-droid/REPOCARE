"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Status = "idle" | "loading" | "success" | "error";

export function PresseContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    const fd = new FormData(e.currentTarget);
    // Lokale Validierung
    const email = String(fd.get("email") ?? "");
    if (!/.+@.+\..+/.test(email)) {
      setStatus("error");
      setError("Bitte gib eine gültige E-Mail-Adresse an.");
      return;
    }
    // Simulierter Submit — eingebundene Lead-Endpoints sind bewusst nicht hier
    // (TABU: emails/, src/lib/notifications/). Sobald Presse-Endpoint freigeschaltet
    // ist, hier einfach POST nach /api/contact/presse umschalten.
    await new Promise((r) => setTimeout(r, 700));
    setStatus("success");
  }

  if (status === "success") {
    return (
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="flex items-start gap-3 p-6">
          <CheckCircle2 className="mt-1 size-5 shrink-0 text-primary" aria-hidden="true" />
          <div>
            <h2 className="font-serif text-lg font-semibold">Anfrage eingegangen</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Danke! Konstantin meldet sich innerhalb von 24 Stunden werktags.
              Bei tagesaktuellen Deadlines bitte zusätzlich kurz per E-Mail
              unter <a className="text-primary hover:underline" href="mailto:presse@careai.health">presse@careai.health</a> markieren.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={onSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="pr-name">Name *</Label>
              <Input id="pr-name" name="name" required autoComplete="name" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pr-outlet">Medium / Redaktion</Label>
              <Input id="pr-outlet" name="outlet" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="pr-email">E-Mail *</Label>
              <Input id="pr-email" name="email" type="email" required autoComplete="email" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pr-phone">Telefon</Label>
              <Input id="pr-phone" name="phone" type="tel" autoComplete="tel" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pr-topic">Thema</Label>
            <select
              id="pr-topic"
              name="topic"
              className="flex h-11 w-full rounded-xl border border-border bg-background px-3 text-sm"
              defaultValue="interview"
            >
              <option value="interview">Interview-Anfrage</option>
              <option value="feature">Feature / Reportage</option>
              <option value="podcast">Podcast</option>
              <option value="tv">TV / Video</option>
              <option value="award">Award / Nominierung</option>
              <option value="conference">Konferenz-Speaker</option>
              <option value="background">Hintergrundgespräch</option>
              <option value="other">Sonstiges</option>
            </select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pr-deadline">Deadline (optional)</Label>
            <Input id="pr-deadline" name="deadline" type="date" />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pr-message">Worum geht es? *</Label>
            <Textarea id="pr-message" name="message" required rows={5} />
          </div>
          {error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              Deine Anfrage wird nur für die Beantwortung genutzt. Keine Newsletter, keine Weitergabe.
            </p>
            <Button type="submit" disabled={status === "loading"}>
              {status === "loading" ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              Senden
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
