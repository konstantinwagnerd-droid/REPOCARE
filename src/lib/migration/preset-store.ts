/**
 * In-Memory-Preset-Store für Mapping-Presets.
 * Persistenz über DB würde eine Schema-Änderung erfordern (TABU für diesen Agent).
 * Für Demo und Session-Persistenz ausreichend — gespeicherte Presets überstehen
 * den Server-Prozess jedoch nicht. TODO in docs/MIGRATION.md dokumentiert.
 */

import type { MappingPreset, MappingRule, MigrationSource } from "./types";

const _store = new Map<string, MappingPreset>();

// Vordefinierte System-Presets aus den parsern (nur lesen).
import { medifoxDefaultMapping } from "./parsers/medifox";
import { danDefaultMapping } from "./parsers/dan";
import { vivendiDefaultMapping } from "./parsers/vivendi";
import { sensoDefaultMapping } from "./parsers/senso";

function rulesFromDefault(
  defs: Array<{ source: string; target: string }>,
): MappingRule[] {
  return defs.map((d) => ({
    sourceField: d.source,
    targetField: d.target as MappingRule["targetField"],
    required: d.target === "lastName" || d.target === "firstName",
  }));
}

function seed() {
  if (_store.size > 0) return;
  const base: Array<[MigrationSource, string, ReturnType<typeof rulesFromDefault>]> = [
    ["medifox", "Medifox Standard", rulesFromDefault(medifoxDefaultMapping)],
    ["dan", "DAN Standard", rulesFromDefault(danDefaultMapping)],
    ["vivendi", "Vivendi Standard", rulesFromDefault(vivendiDefaultMapping)],
    ["senso", "SenSo Standard", rulesFromDefault(sensoDefaultMapping)],
  ];
  const now = new Date().toISOString();
  base.forEach(([source, name, rules], i) => {
    const id = `sys_${source}_${i}`;
    _store.set(id, {
      id,
      name,
      source,
      rules,
      createdAt: now,
      updatedAt: now,
    });
  });
}

export function listPresets(): MappingPreset[] {
  seed();
  return Array.from(_store.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export function getPreset(id: string): MappingPreset | undefined {
  seed();
  return _store.get(id);
}

export function savePreset(input: Omit<MappingPreset, "id" | "createdAt" | "updatedAt"> & { id?: string }): MappingPreset {
  seed();
  const now = new Date().toISOString();
  const id = input.id ?? `usr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
  const existing = _store.get(id);
  const preset: MappingPreset = {
    id,
    name: input.name,
    source: input.source,
    rules: input.rules,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };
  _store.set(id, preset);
  return preset;
}

export function deletePreset(id: string): boolean {
  seed();
  // System-Presets nicht löschen
  if (id.startsWith("sys_")) return false;
  return _store.delete(id);
}
