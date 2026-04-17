"use client";

import { useMemo } from "react";
import { ArrowRight, X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CareAITargetField, MappingRule } from "@/lib/migration/types";

const TARGET_FIELDS: Array<{ id: CareAITargetField; label: string; required?: boolean }> = [
  { id: "firstName", label: "Vorname", required: true },
  { id: "lastName", label: "Nachname", required: true },
  { id: "dateOfBirth", label: "Geburtsdatum" },
  { id: "gender", label: "Geschlecht" },
  { id: "careLevel", label: "Pflegegrad (1–5)" },
  { id: "room", label: "Zimmer" },
  { id: "admissionDate", label: "Einzugsdatum" },
  { id: "dischargeDate", label: "Austrittsdatum" },
  { id: "insuranceNumber", label: "Versicherungsnummer" },
  { id: "diagnosis", label: "Diagnose" },
  { id: "allergies", label: "Allergien" },
  { id: "medication", label: "Medikation" },
  { id: "emergencyContact", label: "Notfallkontakt" },
  { id: "emergencyPhone", label: "Notfall-Telefon" },
  { id: "legalGuardian", label: "Betreuer / Vormund" },
  { id: "notes", label: "Notizen" },
];

export function MappingEditor({
  sourceFields,
  rules,
  onChange,
}: {
  sourceFields: string[];
  rules: MappingRule[];
  onChange: (rules: MappingRule[]) => void;
}) {
  const usedTargets = useMemo(() => new Set(rules.map((r) => r.targetField)), [rules]);

  const updateRule = (idx: number, patch: Partial<MappingRule>) => {
    const copy = [...rules];
    copy[idx] = { ...copy[idx], ...patch };
    onChange(copy);
  };

  const removeRule = (idx: number) => {
    onChange(rules.filter((_, i) => i !== idx));
  };

  const addRule = () => {
    const firstFreeTarget = TARGET_FIELDS.find((t) => !usedTargets.has(t.id))?.id ?? "notes";
    const firstSource = sourceFields[0] ?? "";
    onChange([
      ...rules,
      { sourceField: firstSource, targetField: firstFreeTarget, required: false },
    ]);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-[1fr_auto_1fr_auto] gap-3 text-xs font-semibold uppercase text-muted-foreground">
        <div>Quelle</div>
        <div aria-hidden="true" />
        <div>Ziel (CareAI)</div>
        <div />
      </div>

      {rules.length === 0 && (
        <p className="rounded-xl border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
          Noch keine Mappings. Füge eins hinzu oder nutze die automatischen Vorschläge.
        </p>
      )}

      {rules.map((rule, idx) => (
        <div
          key={`${rule.targetField}-${idx}`}
          className="grid grid-cols-[1fr_auto_1fr_auto] items-center gap-3 rounded-xl border border-border bg-background p-3"
        >
          <select
            aria-label={`Quell-Feld für ${rule.targetField}`}
            value={rule.sourceField}
            onChange={(e) => updateRule(idx, { sourceField: e.target.value })}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
          >
            {sourceFields.map((f) => (
              <option key={f} value={f}>{f}</option>
            ))}
          </select>
          <ArrowRight className="size-4 text-muted-foreground" aria-hidden="true" />
          <select
            aria-label={`Ziel-Feld für ${rule.sourceField}`}
            value={rule.targetField}
            onChange={(e) => updateRule(idx, { targetField: e.target.value as CareAITargetField })}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm"
          >
            {TARGET_FIELDS.map((t) => (
              <option key={t.id} value={t.id} disabled={usedTargets.has(t.id) && t.id !== rule.targetField}>
                {t.label}{t.required ? " *" : ""}
              </option>
            ))}
          </select>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeRule(idx)}
            aria-label="Mapping entfernen"
          >
            <X className="size-4" />
          </Button>
        </div>
      ))}

      <Button type="button" variant="outline" size="sm" onClick={addRule}>
        <Plus className="size-4" /> Mapping hinzufügen
      </Button>
    </div>
  );
}
