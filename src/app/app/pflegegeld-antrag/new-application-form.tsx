"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function NewApplicationForm({
  residents,
}: {
  residents: Array<{ id: string; fullName: string; room: string }>;
}) {
  const router = useRouter();
  const [residentId, setResidentId] = useState("");
  const [applicationType, setApplicationType] = useState<"de-sgb-xi" | "at-bpgg">("de-sgb-xi");
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!residentId) {
      setError("Bitte eine:n Bewohner:in wählen.");
      return;
    }
    startTransition(async () => {
      const res = await fetch("/api/pension-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ residentId, applicationType }),
      });
      if (!res.ok) {
        setError(`Fehler: ${res.status} ${await res.text()}`);
        return;
      }
      const data = await res.json();
      router.push(`/app/pflegegeld-antrag/${data.id}`);
    });
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 md:grid-cols-3">
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">Bewohner:in</span>
        <select
          required
          value={residentId}
          onChange={(e) => setResidentId(e.target.value)}
          className="rounded-md border bg-background px-3 py-2"
        >
          <option value="">— wählen —</option>
          {residents.map((r) => (
            <option key={r.id} value={r.id}>
              {r.fullName} · Zi. {r.room}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-1 text-sm">
        <span className="font-medium">Antragsart</span>
        <select
          required
          value={applicationType}
          onChange={(e) => setApplicationType(e.target.value as "de-sgb-xi" | "at-bpgg")}
          className="rounded-md border bg-background px-3 py-2"
        >
          <option value="de-sgb-xi">Deutschland · SGB XI (NBA)</option>
          <option value="at-bpgg">Österreich · BPGG</option>
        </select>
      </label>
      <div className="flex items-end">
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Wird erstellt…" : "Antrag aus Bewohner-Daten erstellen"}
        </Button>
      </div>
      {error ? <p className="col-span-full text-sm text-destructive">{error}</p> : null}
    </form>
  );
}
