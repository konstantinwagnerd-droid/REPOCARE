/**
 * FORTA — Fit fOR The Aged (Wehling, Version 2023).
 *
 * Klassifikation je Indikation:
 *   A = absolutely (klar nutzbringend)
 *   B = beneficial (nutzbringend)
 *   C = careful (kritisch, nur mit Vorsicht)
 *   D = don't (vermeiden)
 *
 * Quelle: FORTA-Liste 2021/2023 (Wehling et al.).
 * Auswahl der häufigsten Indikationen + Medikamente im Pflegeheim-Kontext.
 */

export type FortaKlasse = "A" | "B" | "C" | "D";

export interface FortaEintrag {
  wirkstoff: string;
  indikation: string; // z.B. "Hypertonie", "Schmerz", "Depression"
  forta_klasse: FortaKlasse;
  begruendung: string;
}

export const FORTA_LISTE: FortaEintrag[] = [
  // ═══════════ Hypertonie ═══════════
  { wirkstoff: "Amlodipin", indikation: "Hypertonie", forta_klasse: "A", begruendung: "Gute Verträglichkeit, einmal täglich, Ödem-NW tolerierbar." },
  { wirkstoff: "Ramipril", indikation: "Hypertonie", forta_klasse: "A", begruendung: "Organprotektiv, gute Datenlage bei Älteren." },
  { wirkstoff: "Lisinopril", indikation: "Hypertonie", forta_klasse: "A", begruendung: "Evidenz bei Herzinsuffizienz + Niereninsuffizienz." },
  { wirkstoff: "Candesartan", indikation: "Hypertonie", forta_klasse: "A", begruendung: "ARB gut verträglich, bei ACE-Hemmer-Husten." },
  { wirkstoff: "Hydrochlorothiazid", indikation: "Hypertonie", forta_klasse: "B", begruendung: "Wirksam, aber Elektrolyt-/Hyponatriämierisiko." },
  { wirkstoff: "Metoprolol", indikation: "Hypertonie", forta_klasse: "B", begruendung: "Gute Evidenz bei KHK; Bisoprolol bei HI bevorzugen." },
  { wirkstoff: "Bisoprolol", indikation: "Hypertonie", forta_klasse: "A", begruendung: "Selektiv, gut steuerbar." },
  { wirkstoff: "Clonidin", indikation: "Hypertonie", forta_klasse: "D", begruendung: "Orthostase, Sedierung, Rebound." },
  { wirkstoff: "Methyldopa", indikation: "Hypertonie", forta_klasse: "D", begruendung: "Sedierung, Depression." },
  { wirkstoff: "Doxazosin", indikation: "Hypertonie", forta_klasse: "C", begruendung: "Sturzrisiko durch Orthostase." },

  // ═══════════ Herzinsuffizienz ═══════════
  { wirkstoff: "Ramipril", indikation: "Herzinsuffizienz", forta_klasse: "A", begruendung: "Prognose-verbessernd bei HFrEF." },
  { wirkstoff: "Bisoprolol", indikation: "Herzinsuffizienz", forta_klasse: "A", begruendung: "Prognose-verbessernd; einschleichen." },
  { wirkstoff: "Spironolacton", indikation: "Herzinsuffizienz", forta_klasse: "B", begruendung: "Prognose-verbessernd; Hyperkaliämie und Niere überwachen." },
  { wirkstoff: "Empagliflozin", indikation: "Herzinsuffizienz", forta_klasse: "A", begruendung: "SGLT2-Inhibitor, auch ohne Diabetes wirksam." },
  { wirkstoff: "Digoxin", indikation: "Herzinsuffizienz", forta_klasse: "C", begruendung: "Nur bei refraktärer VHF + HI; enge TB." },
  { wirkstoff: "Furosemid", indikation: "Herzinsuffizienz", forta_klasse: "A", begruendung: "Symptomlinderung; niedrigst wirksame Dosis." },

  // ═══════════ Vorhofflimmern / Antikoagulation ═══════════
  { wirkstoff: "Apixaban", indikation: "VHF-Antikoagulation", forta_klasse: "A", begruendung: "Beste Evidenz bei Älteren, geringstes Blutungsrisiko unter DOAK." },
  { wirkstoff: "Edoxaban", indikation: "VHF-Antikoagulation", forta_klasse: "A", begruendung: "Einmal täglich, gute Daten bei Älteren." },
  { wirkstoff: "Dabigatran", indikation: "VHF-Antikoagulation", forta_klasse: "B", begruendung: "Renal eliminiert, GI-NW." },
  { wirkstoff: "Rivaroxaban", indikation: "VHF-Antikoagulation", forta_klasse: "B", begruendung: "Einmal täglich, mit Nahrung." },
  { wirkstoff: "Phenprocoumon", indikation: "VHF-Antikoagulation", forta_klasse: "C", begruendung: "INR-Monitoring nötig, viele Interaktionen." },
  { wirkstoff: "Warfarin", indikation: "VHF-Antikoagulation", forta_klasse: "C", begruendung: "INR-Monitoring, viele Interaktionen." },

  // ═══════════ Schmerz ═══════════
  { wirkstoff: "Paracetamol", indikation: "Schmerz", forta_klasse: "A", begruendung: "Basistherapie, max. 3g/d; bei Leberschädigung anpassen." },
  { wirkstoff: "Metamizol", indikation: "Schmerz", forta_klasse: "B", begruendung: "Gut wirksam; Agranulozytose-Risiko selten aber beachten." },
  { wirkstoff: "Morphin", indikation: "Schmerz (stark)", forta_klasse: "B", begruendung: "Standard bei starkem Schmerz; Dosisfindung." },
  { wirkstoff: "Hydromorphon", indikation: "Schmerz (stark)", forta_klasse: "A", begruendung: "Keine aktiven Metaboliten, auch bei Nierenschwäche." },
  { wirkstoff: "Oxycodon", indikation: "Schmerz (stark)", forta_klasse: "B", begruendung: "Alternative zu Morphin." },
  { wirkstoff: "Buprenorphin (TTS)", indikation: "Schmerz", forta_klasse: "A", begruendung: "Sichere Pharmakokinetik, auch bei Niereninsuffizienz." },
  { wirkstoff: "Tilidin", indikation: "Schmerz", forta_klasse: "B", begruendung: "Schwaches Opioid; Naloxon-Kombi anti-abusiv." },
  { wirkstoff: "Tramadol", indikation: "Schmerz", forta_klasse: "C", begruendung: "Serotonin-Syndrom mit SSRI/MAO, Krampfschwelle." },
  { wirkstoff: "Ibuprofen", indikation: "Schmerz", forta_klasse: "C", begruendung: "GI, renal, kardio. Kurz + PPI + niedrigst wirksam." },
  { wirkstoff: "Diclofenac", indikation: "Schmerz", forta_klasse: "D", begruendung: "Kardiovaskuläres Risiko erhöht." },
  { wirkstoff: "Indomethacin", indikation: "Schmerz", forta_klasse: "D", begruendung: "ZNS-NW, GI, kardial." },
  { wirkstoff: "Pethidin", indikation: "Schmerz", forta_klasse: "D", begruendung: "Toxische Metaboliten, Krämpfe." },

  // ═══════════ Depression ═══════════
  { wirkstoff: "Sertralin", indikation: "Depression", forta_klasse: "A", begruendung: "Gut verträglich, wenige Interaktionen." },
  { wirkstoff: "Citalopram", indikation: "Depression", forta_klasse: "B", begruendung: "Max. 20mg bei >=65 J. wegen QT." },
  { wirkstoff: "Escitalopram", indikation: "Depression", forta_klasse: "B", begruendung: "Max. 10mg bei >=65 J." },
  { wirkstoff: "Mirtazapin", indikation: "Depression", forta_klasse: "A", begruendung: "Schlafanstoßend, appetitsteigernd — nützlich bei frailty." },
  { wirkstoff: "Venlafaxin", indikation: "Depression", forta_klasse: "C", begruendung: "RR-Anstieg, Absetzsymptomatik." },
  { wirkstoff: "Duloxetin", indikation: "Depression", forta_klasse: "B", begruendung: "Auch bei neuropathischem Schmerz." },
  { wirkstoff: "Amitriptylin", indikation: "Depression", forta_klasse: "D", begruendung: "Anticholinerg, Sturz, QT." },
  { wirkstoff: "Doxepin", indikation: "Depression", forta_klasse: "D", begruendung: "Stark sedierend, anticholinerg." },

  // ═══════════ Demenz ═══════════
  { wirkstoff: "Donepezil", indikation: "Demenz (Alzheimer)", forta_klasse: "B", begruendung: "Symptomatische Besserung; bradykarde NW." },
  { wirkstoff: "Rivastigmin", indikation: "Demenz (Alzheimer)", forta_klasse: "B", begruendung: "Als Pflaster GI-verträglicher." },
  { wirkstoff: "Memantin", indikation: "Demenz (moderat/schwer)", forta_klasse: "B", begruendung: "Bei moderat-schwerer Alzheimer-Demenz." },
  { wirkstoff: "Ginkgo biloba", indikation: "Demenz", forta_klasse: "C", begruendung: "Schwache Evidenz." },

  // ═══════════ Schlaf ═══════════
  { wirkstoff: "Melatonin (retard)", indikation: "Schlaf", forta_klasse: "B", begruendung: "Erste Wahl bei Älteren, keine Abhängigkeit." },
  { wirkstoff: "Mirtazapin (niedrig)", indikation: "Schlaf", forta_klasse: "B", begruendung: "Off-label 7.5–15mg, bei komorbider Depression." },
  { wirkstoff: "Zolpidem", indikation: "Schlaf", forta_klasse: "C", begruendung: "Max. 4 Wochen, Sturz." },
  { wirkstoff: "Zopiclon", indikation: "Schlaf", forta_klasse: "C", begruendung: "Max. 4 Wochen, Abhängigkeit." },
  { wirkstoff: "Diazepam", indikation: "Schlaf", forta_klasse: "D", begruendung: "Lang, kumuliert, Sturz." },
  { wirkstoff: "Flurazepam", indikation: "Schlaf", forta_klasse: "D", begruendung: "Hang-over, Sturz." },
  { wirkstoff: "Diphenhydramin", indikation: "Schlaf", forta_klasse: "D", begruendung: "Anticholinerg, Delir." },

  // ═══════════ Diabetes ═══════════
  { wirkstoff: "Metformin", indikation: "Diabetes Typ 2", forta_klasse: "A", begruendung: "Erste Wahl; GFR >=30 beachten." },
  { wirkstoff: "Empagliflozin", indikation: "Diabetes Typ 2", forta_klasse: "A", begruendung: "Kardio- und nephroprotektiv." },
  { wirkstoff: "Sitagliptin", indikation: "Diabetes Typ 2", forta_klasse: "A", begruendung: "Gewichts-neutral, kein Hypo." },
  { wirkstoff: "Gliclazid", indikation: "Diabetes Typ 2", forta_klasse: "B", begruendung: "Wenn SH, dann diese — geringeres Hyporisiko als Glibenclamid." },
  { wirkstoff: "Glibenclamid", indikation: "Diabetes Typ 2", forta_klasse: "D", begruendung: "Hohes Hypoglykämierisiko." },
  { wirkstoff: "Pioglitazon", indikation: "Diabetes Typ 2", forta_klasse: "C", begruendung: "Herzinsuffizienz, Frakturrisiko." },
  { wirkstoff: "Insulin glargin", indikation: "Diabetes Typ 2", forta_klasse: "B", begruendung: "Wenn Insulin, dann langwirksam bevorzugen." },

  // ═══════════ Obstipation ═══════════
  { wirkstoff: "Macrogol", indikation: "Obstipation", forta_klasse: "A", begruendung: "Erste Wahl, osmotisch, keine Gewöhnung." },
  { wirkstoff: "Lactulose", indikation: "Obstipation", forta_klasse: "B", begruendung: "Blähungen." },
  { wirkstoff: "Bisacodyl", indikation: "Obstipation", forta_klasse: "B", begruendung: "Stimulativ, kurzfristig." },
  { wirkstoff: "Natriumpicosulfat", indikation: "Obstipation", forta_klasse: "B", begruendung: "Kurzfristig, gut steuerbar." },

  // ═══════════ Gastroösophageale Refluxkrankheit ═══════════
  { wirkstoff: "Pantoprazol", indikation: "GERD", forta_klasse: "A", begruendung: "Standard-PPI; Langzeit: B12, Mg, Frakturrisiko beachten." },
  { wirkstoff: "Omeprazol", indikation: "GERD", forta_klasse: "B", begruendung: "CYP-Interaktionen (Clopidogrel)." },

  // ═══════════ Osteoporose ═══════════
  { wirkstoff: "Vitamin D3", indikation: "Osteoporose", forta_klasse: "A", begruendung: "Basis; Bluttest-Monitoring." },
  { wirkstoff: "Calcium", indikation: "Osteoporose", forta_klasse: "B", begruendung: "Mit Vitamin D; Obstipation." },
  { wirkstoff: "Alendronat", indikation: "Osteoporose", forta_klasse: "A", begruendung: "Bisphosphonat der Wahl; GFR >=30." },
  { wirkstoff: "Denosumab", indikation: "Osteoporose", forta_klasse: "A", begruendung: "Bei eingeschränkter Nierenfunktion." },
];

/**
 * Sucht alle FORTA-Einträge für einen Wirkstoff (kann mehrere Indikationen haben).
 */
export function lookupForta(wirkstoff: string): FortaEintrag[] {
  const needle = wirkstoff.toLowerCase().trim();
  return FORTA_LISTE.filter((e) => {
    const name = e.wirkstoff.toLowerCase().split(" ")[0];
    return needle.includes(name) || name.includes(needle);
  });
}

/**
 * Schlimmste FORTA-Klasse für einen Wirkstoff (D > C > B > A).
 */
export function worstFortaKlasse(wirkstoff: string): FortaKlasse | undefined {
  const entries = lookupForta(wirkstoff);
  if (entries.length === 0) return undefined;
  const order: FortaKlasse[] = ["D", "C", "B", "A"];
  return order.find((k) => entries.some((e) => e.forta_klasse === k));
}
