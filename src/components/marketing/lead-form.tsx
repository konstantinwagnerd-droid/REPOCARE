"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Check } from "lucide-react";

export function LeadForm({ resourceSlug }: { resourceSlug: string }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [org, setOrg] = useState("");
  const [consent, setConsent] = useState(false);
  const [sent, setSent] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !consent) return;
    // In Produktion: POST /api/leads — hier lokaler Confirm-State
    setSent(true);
  }

  if (sent) {
    return (
      <div className="mt-4 rounded-xl border border-primary/20 bg-primary/5 p-5">
        <div className="mb-2 flex items-center gap-2">
          <Check className="h-5 w-5 text-primary" />
          <p className="font-serif text-lg font-semibold">Download-Link unterwegs</p>
        </div>
        <p className="text-sm text-muted-foreground">
          Pruefen Sie Ihr Postfach — in der Regel innerhalb weniger Minuten. Falls Sie nichts sehen, schauen Sie in den Spam-Ordner.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-4">
      <div>
        <Label htmlFor="lead-name">Name</Label>
        <Input id="lead-name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <Label htmlFor="lead-org">Einrichtung</Label>
        <Input id="lead-org" value={org} onChange={(e) => setOrg(e.target.value)} />
      </div>
      <div>
        <Label htmlFor="lead-email">E-Mail *</Label>
        <Input id="lead-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <label className="flex items-start gap-2 text-xs text-muted-foreground">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5"
          required
        />
        <span>
          Ich willige ein, dass CareAI mir den Download-Link zu &quot;{resourceSlug}&quot; per E-Mail zusendet. Meine Daten werden nicht
          an Dritte weitergegeben. Ich kann die Einwilligung jederzeit widerrufen.
        </span>
      </label>
      <Button type="submit" variant="accent" size="sm" disabled={!email || !consent}>
        Download-Link anfordern
      </Button>
    </form>
  );
}
