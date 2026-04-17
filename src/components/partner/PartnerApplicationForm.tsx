"use client";

import { useState } from "react";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type Status = "idle" | "loading" | "success" | "error";

export function PartnerApplicationForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError(null);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/partner/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: fd.get("companyName"),
          contactName: fd.get("contactName"),
          email: fd.get("email"),
          tier: fd.get("tier"),
          message: fd.get("message"),
        }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Fehler bei der Übermittlung");
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setError((err as Error).message);
    }
  }

  if (status === "success") {
    return (
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="flex items-start gap-3 p-6">
          <CheckCircle2 className="mt-1 size-5 shrink-0 text-primary" aria-hidden="true" />
          <div>
            <h2 className="font-serif text-lg font-semibold">Bewerbung eingegangen</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Danke für dein Interesse! Wir prüfen die Bewerbung und melden uns innerhalb
              von zwei Arbeitstagen per E-Mail mit den nächsten Schritten (Onboarding,
              Zertifizierung, Portalzugang).
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
              <Label htmlFor="pa-company">Firma *</Label>
              <Input id="pa-company" name="companyName" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pa-contact">Ansprechpartner:in *</Label>
              <Input id="pa-contact" name="contactName" required />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="pa-email">E-Mail *</Label>
              <Input id="pa-email" name="email" type="email" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pa-tier">Partner-Typ *</Label>
              <select
                id="pa-tier"
                name="tier"
                required
                defaultValue="reseller"
                className="flex h-11 w-full rounded-xl border border-border bg-background px-3 text-sm"
              >
                <option value="reseller">Reseller</option>
                <option value="implementation">Implementation-Partner</option>
                <option value="integration">Integration / Softwarehaus</option>
                <option value="consulting">Consulting / Verband</option>
              </select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pa-message">Warum passt ihr zu CareAI? *</Label>
            <Textarea
              id="pa-message"
              name="message"
              required
              rows={5}
              placeholder="Bestehende Kund:innen in der Pflege, Fokus-Regionen, Team-Größe, …"
            />
          </div>
          {error && (
            <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              Wir prüfen jede Bewerbung einzeln. Antwort binnen 2 Arbeitstagen.
            </p>
            <Button type="submit" disabled={status === "loading"}>
              {status === "loading" ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
              Bewerbung senden
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
