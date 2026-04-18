/**
 * AMTS (Arzneimittel-Therapie-Sicherheit) — High-Level API.
 *
 * Gibt eine konsolidierte Bewertung für eine Medikationsliste zurück:
 * - PRISCUS-Flags (DE 2023, bei ≥65 J.)
 * - FORTA-Klassen (A/B/C/D je Indikation)
 * - Interaktionen (>30 Paare)
 * - Beers (Zweitmeinung)
 */
import { PRISCUS_LISTE, lookupPriscus, type PriscusEintrag } from "./priscus-liste";
import { lookupForta, worstFortaKlasse, type FortaEintrag, type FortaKlasse } from "./forta-liste";
import { checkInteractions, type InteractionFinding, type Severity } from "./interactions";
import { lookupBeers, type BeersEintrag } from "./beers-list-de";

export { PRISCUS_LISTE, lookupPriscus } from "./priscus-liste";
export { FORTA_LISTE, lookupForta, worstFortaKlasse } from "./forta-liste";
export { INTERACTIONS, checkInteractions } from "./interactions";
export { BEERS_LISTE, lookupBeers } from "./beers-list-de";
export type { PriscusEintrag, PriscusBewertung } from "./priscus-liste";
export type { FortaEintrag, FortaKlasse } from "./forta-liste";
export type { InteractionFinding, Severity, InteractionDefinition } from "./interactions";
export type { BeersEintrag, BeersEmpfehlung } from "./beers-list-de";

export interface AmtsReview {
  priscus: Array<{ wirkstoff: string; eintrag: PriscusEintrag }>;
  forta: Array<{ wirkstoff: string; eintraege: FortaEintrag[]; worst: FortaKlasse | undefined }>;
  interactions: InteractionFinding[];
  beers: Array<{ wirkstoff: string; eintrag: BeersEintrag }>;
  worstSeverity: Severity | "keine";
  countByType: {
    priscus_vermeiden: number;
    forta_d: number;
    forta_c: number;
    interactions_hoch: number;
    interactions_mittel: number;
  };
}

/**
 * Zentrale AMTS-Prüfung für eine Medikamenten-Liste (Wirkstoff-Namen).
 */
export function reviewMedications(wirkstoffe: string[]): AmtsReview {
  const cleaned = wirkstoffe.map((w) => w.trim()).filter(Boolean);

  const priscus = cleaned
    .map((w) => {
      const e = lookupPriscus(w);
      return e ? { wirkstoff: w, eintrag: e } : null;
    })
    .filter((x): x is { wirkstoff: string; eintrag: PriscusEintrag } => x !== null);

  const forta = cleaned
    .map((w) => {
      const eintraege = lookupForta(w);
      return eintraege.length
        ? { wirkstoff: w, eintraege, worst: worstFortaKlasse(w) }
        : null;
    })
    .filter((x): x is { wirkstoff: string; eintraege: FortaEintrag[]; worst: FortaKlasse | undefined } => x !== null);

  const interactions = checkInteractions(cleaned);

  const beers = cleaned
    .map((w) => {
      const e = lookupBeers(w);
      return e ? { wirkstoff: w, eintrag: e } : null;
    })
    .filter((x): x is { wirkstoff: string; eintrag: BeersEintrag } => x !== null);

  const countByType = {
    priscus_vermeiden: priscus.filter((p) => p.eintrag.priscus_bewertung === "vermeiden").length,
    forta_d: forta.filter((f) => f.worst === "D").length,
    forta_c: forta.filter((f) => f.worst === "C").length,
    interactions_hoch: interactions.filter((i) => i.severity === "hoch").length,
    interactions_mittel: interactions.filter((i) => i.severity === "mittel").length,
  };

  let worstSeverity: Severity | "keine" = "keine";
  if (countByType.interactions_hoch > 0 || countByType.priscus_vermeiden > 0 || countByType.forta_d > 0) {
    worstSeverity = "hoch";
  } else if (countByType.interactions_mittel > 0 || countByType.forta_c > 0 || priscus.length > 0) {
    worstSeverity = "mittel";
  } else if (forta.length > 0) {
    worstSeverity = "niedrig";
  }

  return { priscus, forta, interactions, beers, worstSeverity, countByType };
}
