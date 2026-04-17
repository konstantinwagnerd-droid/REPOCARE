// Anonymisierungs-Strategien. Pure Funktionen, eine pro Technik.

import type { AnonymizedRecord, StrategyConfig } from "./types";

// --- pseudonymize-names ----------------------------------------------------
// Tauscht "vorname"/"nachname" durch "Bewohner:in 001" etc., konsistent ueber index.
function pseudoNamesApply(rows: AnonymizedRecord[]): AnonymizedRecord[] {
  return rows.map((r, i) => {
    const out = { ...r };
    if ("vorname" in r || "nachname" in r) {
      out.vorname = "Bewohner:in";
      out.nachname = String(i + 1).padStart(3, "0");
    }
    if ("name" in r) out.name = `Bewohner:in ${String(i + 1).padStart(3, "0")}`;
    if ("autor" in r) out.autor = `Mitarbeiter:in ${((i % 12) + 1).toString().padStart(2, "0")}`;
    return out;
  });
}

// --- shift-dates -----------------------------------------------------------
// Verschiebt alle Datumsfelder um konstanten Offset (Default: -42 Tage).
function shiftDatesApply(rows: AnonymizedRecord[], offsetDays: number): AnonymizedRecord[] {
  return rows.map((r) => {
    const out = { ...r };
    for (const k of Object.keys(out)) {
      const v = out[k];
      if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}/.test(v)) {
        const d = new Date(v);
        if (!Number.isNaN(d.getTime())) {
          d.setDate(d.getDate() + offsetDays);
          out[k] = d.toISOString().slice(0, v.length === 10 ? 10 : v.length);
        }
      }
    }
    return out;
  });
}

// --- generalize-age --------------------------------------------------------
// Numerisches Alter -> "80-89".
function generalizeAgeApply(rows: AnonymizedRecord[]): AnonymizedRecord[] {
  return rows.map((r) => {
    const out = { ...r };
    if (typeof out.alter === "number") {
      const a = out.alter;
      const lower = Math.floor(a / 10) * 10;
      out.alter = `${lower}-${lower + 9}`;
    }
    return out;
  });
}

// --- truncate-text ---------------------------------------------------------
// Kürzt Freitext-Felder (text, notiz, beschreibung, kommentar) auf max N Zeichen.
function truncateTextApply(rows: AnonymizedRecord[], maxChars: number): AnonymizedRecord[] {
  const FELDER = ["text", "notiz", "beschreibung", "kommentar", "details"];
  return rows.map((r) => {
    const out = { ...r };
    for (const f of FELDER) {
      const v = out[f];
      if (typeof v === "string" && v.length > maxChars) out[f] = v.slice(0, maxChars) + "…";
    }
    return out;
  });
}

// --- hash-ids --------------------------------------------------------------
// Ersetzt id-Felder durch deterministischen kurzen Hash.
function djb2(s: string): string {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  return h.toString(16).padStart(8, "0");
}
function hashIdsApply(rows: AnonymizedRecord[]): AnonymizedRecord[] {
  return rows.map((r) => {
    const out = { ...r };
    for (const k of Object.keys(out)) {
      if (k === "id" || k.endsWith("Id") || k.endsWith("_id")) {
        const v = out[k];
        if (typeof v === "string" || typeof v === "number") out[k] = `anon_${djb2(String(v))}`;
      }
    }
    return out;
  });
}

// --- k-anonymity (Stufe 3) -------------------------------------------------
// Prueft, ob jede Kombination der Quasi-Identifier (zimmer, geschlecht, alter)
// mindestens k-mal vorkommt; reduziert sonst Granularitaet.
function kAnonymityApply(rows: AnonymizedRecord[], k: number): AnonymizedRecord[] {
  if (rows.length === 0) return rows;
  const out = rows.map((r) => ({ ...r }));
  // Generalisiere Zimmer auf Station (Buchstaben-Praefix)
  for (const r of out) {
    if (typeof r.zimmer === "string") {
      const m = r.zimmer.match(/^([A-Z]+)/);
      r.zimmer = m ? `Station ${m[1]}` : r.zimmer;
    }
  }
  // Pruefe Buckets
  const key = (r: AnonymizedRecord) => `${r.zimmer}|${r.geschlecht}|${r.alter}|${r.pflegegrad}`;
  const counts: Record<string, number> = {};
  for (const r of out) counts[key(r)] = (counts[key(r)] ?? 0) + 1;
  // Felder mit Buckets < k weiter generalisieren: Pflegegrad weglassen, Geschlecht „divers" als „andere"
  for (const r of out) {
    if (counts[key(r)] < k) {
      r.pflegegrad = "PG ≥3";
      if (r.geschlecht === "divers") r.geschlecht = "andere";
    }
  }
  return out;
}

// --- Registry --------------------------------------------------------------
export const STRATEGY_DEFS: { id: StrategyConfig["id"]; label: string; description: string; defaultParams?: Record<string, string | number | boolean> }[] = [
  { id: "pseudonymize-names", label: "Namen pseudonymisieren", description: "Vorname/Nachname → \"Bewohner:in 001\"" },
  { id: "shift-dates", label: "Datums-Offset", description: "Alle Datumsfelder verschieben (Default −42 Tage).", defaultParams: { offsetDays: -42 } },
  { id: "generalize-age", label: "Alter generalisieren", description: "Alter → Altersgruppe (80-89)." },
  { id: "truncate-text", label: "Freitext kürzen", description: "Texte auf max N Zeichen.", defaultParams: { maxChars: 50 } },
  { id: "hash-ids", label: "IDs hashen", description: "Alle ID-Felder durch deterministischen Hash ersetzen." },
  { id: "k-anonymity", label: "k-Anonymität (k=3)", description: "Quasi-Identifier-Buckets <k werden generalisiert.", defaultParams: { k: 3 } },
];

export function applyStrategy(rows: AnonymizedRecord[], cfg: StrategyConfig): AnonymizedRecord[] {
  if (!cfg.enabled) return rows;
  switch (cfg.id) {
    case "pseudonymize-names": return pseudoNamesApply(rows);
    case "shift-dates": return shiftDatesApply(rows, Number(cfg.params?.offsetDays ?? -42));
    case "generalize-age": return generalizeAgeApply(rows);
    case "truncate-text": return truncateTextApply(rows, Number(cfg.params?.maxChars ?? 50));
    case "hash-ids": return hashIdsApply(rows);
    case "k-anonymity": return kAnonymityApply(rows, Number(cfg.params?.k ?? 3));
    default: return rows;
  }
}
