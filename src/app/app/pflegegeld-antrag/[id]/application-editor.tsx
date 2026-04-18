"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import type {
  PensionApplicationData,
  PensionJurisdiction,
} from "@/lib/pdf/pflegegeld-antrag";
import { missingFields, completenessScore } from "@/lib/pension/autofill";

type Status = "draft" | "submitted" | "approved" | "rejected";

export function ApplicationEditor({
  id,
  jurisdiction,
  initialData,
  initialStatus,
}: {
  id: string;
  jurisdiction: PensionJurisdiction;
  initialData: PensionApplicationData;
  initialStatus: Status;
}) {
  const [data, setData] = useState<PensionApplicationData>(initialData);
  const [status, setStatus] = useState<Status>(initialStatus);
  const [saving, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const missing = missingFields(data);
  const completeness = completenessScore(data);

  function update<K extends keyof PensionApplicationData>(
    key: K,
    value: PensionApplicationData[K],
  ) {
    setData((prev) => ({ ...prev, [key]: value }));
  }

  async function save() {
    setMessage(null);
    startTransition(async () => {
      const res = await fetch(`/api/pension-applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData: data }),
      });
      if (!res.ok) {
        setMessage(`Speichern fehlgeschlagen: ${res.status}`);
        return;
      }
      setMessage("Gespeichert.");
    });
  }

  async function submit() {
    setMessage(null);
    startTransition(async () => {
      await fetch(`/api/pension-applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formData: data, status: "submitted" }),
      });
      setStatus("submitted");
      setMessage("Als eingereicht markiert.");
    });
  }

  async function generatePdf() {
    const res = await fetch(`/api/pension-applications/${id}/pdf`, { method: "POST" });
    if (!res.ok) {
      setMessage(`PDF-Generierung fehlgeschlagen: ${res.status}`);
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    window.open(url, "_blank");
  }

  const yellowIfMissing = (field: string) =>
    missing.includes(field)
      ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-950"
      : "";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between rounded-md border bg-muted/40 p-3 text-sm">
        <div>
          <strong>{completeness}% befüllt</strong>
          {missing.length > 0 ? (
            <span className="text-muted-foreground">
              {" "}
              · {missing.length} Feld{missing.length === 1 ? "" : "er"} fehlen
            </span>
          ) : (
            <span className="text-green-600"> · alle Pflichtfelder befüllt</span>
          )}
        </div>
        <span className="text-xs uppercase tracking-wide text-muted-foreground">
          Status: {status}
        </span>
      </div>

      <section className="grid gap-4 md:grid-cols-2">
        <Field label={jurisdiction === "at-bpgg" ? "SV-Nummer" : "Versichertennummer"}>
          <input
            className={`w-full rounded-md border bg-background px-3 py-2 ${yellowIfMissing("insuranceNumber")}`}
            value={data.insuranceNumber ?? ""}
            onChange={(e) => update("insuranceNumber", e.target.value)}
          />
        </Field>
        <Field label="Adresse">
          <input
            className={`w-full rounded-md border bg-background px-3 py-2 ${yellowIfMissing("address")}`}
            value={data.address ?? ""}
            onChange={(e) => update("address", e.target.value)}
          />
        </Field>

        {jurisdiction === "de-sgb-xi" ? (
          <Field label="Pflegekasse">
            <input
              className={`w-full rounded-md border bg-background px-3 py-2 ${yellowIfMissing("pflegekasse")}`}
              value={data.pflegekasse ?? ""}
              onChange={(e) => update("pflegekasse", e.target.value)}
            />
          </Field>
        ) : (
          <>
            <Field label="Versicherungsträger (PVA/SVS/BVAEB/Land)">
              <input
                className={`w-full rounded-md border bg-background px-3 py-2 ${yellowIfMissing("versicherungstraeger")}`}
                value={data.versicherungstraeger ?? ""}
                onChange={(e) => update("versicherungstraeger", e.target.value)}
              />
            </Field>
            <Field label="Pflegebedarf geschätzt (Stunden/Monat)">
              <input
                type="number"
                className={`w-full rounded-md border bg-background px-3 py-2 ${yellowIfMissing("monthlyHoursEstimate")}`}
                value={data.monthlyHoursEstimate ?? ""}
                onChange={(e) =>
                  update(
                    "monthlyHoursEstimate",
                    e.target.value ? Number(e.target.value) : undefined,
                  )
                }
              />
            </Field>
          </>
        )}
      </section>

      <section className="space-y-4">
        <h3 className="text-lg font-semibold">Pflegebedarfs-Beschreibung</h3>

        <Field label="Mobilität &amp; Bewegung">
          <textarea
            rows={3}
            className={`w-full rounded-md border bg-background px-3 py-2 ${yellowIfMissing("mobilityDescription")}`}
            value={data.mobilityDescription ?? ""}
            onChange={(e) => update("mobilityDescription", e.target.value)}
          />
        </Field>

        <Field label="Kognition &amp; Kommunikation">
          <textarea
            rows={3}
            className={`w-full rounded-md border bg-background px-3 py-2 ${yellowIfMissing("cognitionDescription")}`}
            value={data.cognitionDescription ?? ""}
            onChange={(e) => update("cognitionDescription", e.target.value)}
          />
        </Field>

        <Field label="Selbstversorgung (Körperpflege, Essen, Ausscheidung)">
          <textarea
            rows={3}
            className={`w-full rounded-md border bg-background px-3 py-2 ${yellowIfMissing("selfCareDescription")}`}
            value={data.selfCareDescription ?? ""}
            onChange={(e) => update("selfCareDescription", e.target.value)}
          />
        </Field>

        <Field label="Therapie / Medizinische Anforderungen">
          <textarea
            rows={3}
            className={`w-full rounded-md border bg-background px-3 py-2 ${yellowIfMissing("therapyDescription")}`}
            value={data.therapyDescription ?? ""}
            onChange={(e) => update("therapyDescription", e.target.value)}
          />
        </Field>

        <Field label="Alltag / Soziale Kontakte">
          <textarea
            rows={3}
            className={`w-full rounded-md border bg-background px-3 py-2 ${yellowIfMissing("socialDescription")}`}
            value={data.socialDescription ?? ""}
            onChange={(e) => update("socialDescription", e.target.value)}
          />
        </Field>

        <Field label="Ergänzende Notizen / Begründung">
          <textarea
            rows={3}
            className="w-full rounded-md border bg-background px-3 py-2"
            value={data.notes ?? ""}
            onChange={(e) => update("notes", e.target.value)}
          />
        </Field>
      </section>

      <div className="flex flex-wrap items-center gap-3 border-t pt-4">
        <Button onClick={save} disabled={saving}>
          {saving ? "Speichert…" : "Als Draft speichern"}
        </Button>
        <Button variant="secondary" onClick={generatePdf} disabled={saving}>
          PDF generieren
        </Button>
        {status === "draft" ? (
          <Button variant="outline" onClick={submit} disabled={saving}>
            Als eingereicht markieren
          </Button>
        ) : null}
        {message ? <span className="text-sm text-muted-foreground">{message}</span> : null}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="font-medium" dangerouslySetInnerHTML={{ __html: label }} />
      {children}
    </label>
  );
}
