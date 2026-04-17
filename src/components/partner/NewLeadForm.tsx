"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function NewLeadForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/partner/leads/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          facilityName: fd.get("facilityName"),
          contactName: fd.get("contactName"),
          email: fd.get("email"),
          phone: fd.get("phone"),
          places: Number(fd.get("places")),
          notes: fd.get("notes"),
        }),
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error || "Lead konnte nicht angelegt werden");
      (e.target as HTMLFormElement).reset();
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="nl-facility">Einrichtungsname *</Label>
          <Input id="nl-facility" name="facilityName" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="nl-contact">Ansprechpartner:in *</Label>
          <Input id="nl-contact" name="contactName" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="nl-email">E-Mail *</Label>
          <Input id="nl-email" name="email" type="email" required />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="nl-phone">Telefon</Label>
          <Input id="nl-phone" name="phone" type="tel" />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="nl-places">Plätze *</Label>
          <Input id="nl-places" name="places" type="number" min={1} max={1000} required defaultValue={60} />
        </div>
        <div className="space-y-1.5 md:col-span-2">
          <Label htmlFor="nl-notes">Notizen</Label>
          <Textarea id="nl-notes" name="notes" rows={3} />
        </div>
      </div>
      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{error}</div>
      )}
      <div className="flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : <Plus className="size-4" />}
          Lead anlegen
        </Button>
      </div>
    </form>
  );
}
