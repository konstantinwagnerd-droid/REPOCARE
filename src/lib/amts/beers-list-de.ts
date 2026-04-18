/**
 * Beers-Kriterien 2023 (AGS — American Geriatrics Society) — Auswahl für DE/AT Kontext.
 * Genutzt als Zweitmeinung ergänzend zu PRISCUS 2.0.
 *
 * Quelle: AGS Beers Criteria® 2023 Update. Nur paraphrasierte Auswahl.
 */

export type BeersEmpfehlung = "avoid" | "use_with_caution" | "avoid_in_condition";

export interface BeersEintrag {
  wirkstoff: string;
  empfehlung: BeersEmpfehlung;
  bedingung?: string; // z.B. "Herzinsuffizienz", "Demenz", "Sturzanamnese"
  begruendung: string;
}

export const BEERS_LISTE: BeersEintrag[] = [
  { wirkstoff: "Diphenhydramin", empfehlung: "avoid", begruendung: "Stark anticholinerg, Clearance reduziert, Toleranz als Schlafmittel." },
  { wirkstoff: "Doxylamin", empfehlung: "avoid", begruendung: "Hoch anticholinerg." },
  { wirkstoff: "Oxybutynin (oral)", empfehlung: "avoid", begruendung: "Anticholinerg; ZNS-Nebenwirkungen." },
  { wirkstoff: "Amitriptylin", empfehlung: "avoid", begruendung: "Stark anticholinerg, sedierend, Orthostase." },
  { wirkstoff: "Amiodaron", empfehlung: "use_with_caution", bedingung: "Vorhofflimmern als First-Line",
    begruendung: "Hohe Toxizität; bei VHF nur wenn andere Optionen versagt haben." },
  { wirkstoff: "Digoxin (>0.125mg/d)", empfehlung: "avoid",
    begruendung: "Höhere Dosen ohne zusätzlichen Nutzen, toxisch." },
  { wirkstoff: "Nifedipin (kurzwirksam)", empfehlung: "avoid",
    begruendung: "Hypotonie, Myokardinfarkt-Risiko." },
  { wirkstoff: "Glibenclamid", empfehlung: "avoid",
    begruendung: "Protrahierte Hypoglykämie." },
  { wirkstoff: "Meperidin (Pethidin)", empfehlung: "avoid",
    begruendung: "Neurotoxisch, nicht analgetisch wirksamer als andere Opioide." },
  { wirkstoff: "NSAR (nicht-COX2, chronisch)", empfehlung: "avoid",
    begruendung: "GI-Blutung, PUD — besonders bei >=75 J." },
  { wirkstoff: "Benzodiazepine", empfehlung: "avoid",
    begruendung: "Erhöhtes Risiko für kognitive Beeinträchtigung, Delir, Stürze." },
  { wirkstoff: "Antipsychotika", empfehlung: "avoid_in_condition", bedingung: "Demenz",
    begruendung: "Erhöhte Schlaganfall- und Mortalitätsrate — nur bei ausgeprägter Fremd-/Eigengefährdung." },
  { wirkstoff: "PPI (>8 Wochen Dauertherapie)", empfehlung: "use_with_caution",
    begruendung: "C. difficile, Frakturen, B12-Mangel; regelmäßige Re-Evaluation." },
  { wirkstoff: "Tramadol", empfehlung: "use_with_caution", bedingung: "mit SSRI/SNRI",
    begruendung: "Serotonin-Syndrom, Hyponatriämie, Krampfschwelle." },
];

export function lookupBeers(wirkstoff: string): BeersEintrag | undefined {
  const needle = wirkstoff.toLowerCase();
  return BEERS_LISTE.find((e) => {
    const name = e.wirkstoff.toLowerCase().split(" ")[0];
    return needle.includes(name) || name.includes(needle);
  });
}
