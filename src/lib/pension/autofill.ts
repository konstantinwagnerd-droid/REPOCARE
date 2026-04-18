/**
 * Autofill-Helper fuer Pflegegeld-Antraege (DE SGB XI und AT BPGG).
 *
 * Nimmt Bewohner-Daten + SIS/Biografie/Diagnosen aus der DB und produziert
 * initialen formData-Stand. Lueckenhafte Felder werden als null markiert,
 * damit das UI sie als "bitte ergaenzen" anzeigen kann.
 *
 * Keine externen LLM-Calls — reine Feld-Mapping-Logik.
 */
import type { PensionApplicationData, PensionJurisdiction } from "@/lib/pdf/pflegegeld-antrag";
import type { Resident, Biography } from "@/db/schema";

export interface AutofillInput {
  jurisdiction: PensionJurisdiction;
  resident: Resident;
  biography?: Biography | null;
  tenant?: { name: string; address?: string | null } | null;
}

/** DE-Pflegegrad → empfohlene NBA-Module-Notizen */
function germanModuleNotes(resident: Resident) {
  return [
    { name: "Modul 1 — Mobilität (10%)", note: "Auto-Befüllung aus SIS Themenfeld 2 empfohlen" },
    { name: "Module 2+3 — Kognition/Verhalten (15%)", note: "Auto aus SIS TF 1 + DNQP-Assessments" },
    { name: "Modul 4 — Selbstversorgung (40%)", note: "Auto aus SIS TF 4 (wichtigster Hebel)" },
    { name: "Modul 5 — Therapie (20%)", note: `Aktuelle Diagnosen: ${(resident.diagnoses ?? []).slice(0, 3).join(", ") || "—"}` },
    { name: "Modul 6 — Alltag/Sozial (15%)", note: "Auto aus SIS TF 5" },
  ];
}

/** AT-Stunden-Schätzung je Pflegegrad (grobe Richtwerte für Antrag; endgültige Einstufung durch Gutachter) */
function estimateAustrianMonthlyHours(pflegegrad?: number | null): number | undefined {
  if (!pflegegrad) return undefined;
  const table: Record<number, number> = {
    1: 75,
    2: 100,
    3: 130,
    4: 170,
    5: 185,
    6: 200,
    7: 220,
  };
  return table[pflegegrad];
}

export function buildAutofillFormData(input: AutofillInput): PensionApplicationData {
  const { jurisdiction, resident, biography, tenant } = input;

  // Grundlegende Stammdaten
  const base: PensionApplicationData = {
    jurisdiction,
    resident: {
      fullName: resident.fullName,
      birthdate: resident.birthdate,
      pflegegrad: resident.pflegegrad,
      room: resident.room,
      admissionDate: resident.admissionDate,
    },
    address: undefined, // muss PDL ergänzen (Bewohner-Adresse vor Einzug)
    diagnoses: resident.diagnoses ?? [],
    facility: tenant
      ? {
          name: tenant.name,
          address: tenant.address ?? undefined,
          admissionDate: resident.admissionDate,
        }
      : undefined,
    residentCanSign: true,
  };

  // Biografie-basierte Soft-Felder (wo vorhanden)
  const chapters = biography?.chapters as Record<string, { text: string }> | undefined;
  const socialText = chapters?.["familie_partnerschaft"]?.text || chapters?.["freizeit_hobbys"]?.text;

  if (jurisdiction === "de-sgb-xi") {
    return {
      ...base,
      pflegekasse: undefined,
      mobilityDescription: undefined, // PDL füllt aus SIS TF 2
      cognitionDescription: undefined, // SIS TF 1 + DNQP
      selfCareDescription: undefined, // SIS TF 4
      therapyDescription:
        (resident.diagnoses?.length ?? 0) > 0
          ? `Laufende ärztlich verordnete Therapien bei: ${(resident.diagnoses ?? []).join(", ")}.`
          : undefined,
      socialDescription: socialText || undefined,
      modules: germanModuleNotes(resident),
    };
  }

  // AT-BPGG
  return {
    ...base,
    versicherungstraeger: undefined, // PVA/SVS/BVAEB — muss PDL angeben
    mobilityDescription: undefined,
    cognitionDescription: undefined,
    selfCareDescription: undefined,
    therapyDescription:
      (resident.diagnoses?.length ?? 0) > 0
        ? `Laufende Therapien / medizinische Anforderungen bei: ${(resident.diagnoses ?? []).join(", ")}.`
        : undefined,
    socialDescription: socialText || undefined,
    monthlyHoursEstimate: estimateAustrianMonthlyHours(resident.pflegegrad),
  };
}

/**
 * Berechnet die Vollständigkeits-Quote. UI kann "Antrag zu X% befüllt" anzeigen.
 */
export function completenessScore(data: PensionApplicationData): number {
  const required: unknown[] = [
    data.resident.fullName,
    data.resident.birthdate,
    data.insuranceNumber,
    data.address,
    (data.diagnoses?.length ?? 0) > 0,
    data.mobilityDescription,
    data.cognitionDescription,
    data.selfCareDescription,
    data.therapyDescription,
    data.socialDescription,
  ];
  if (data.jurisdiction === "de-sgb-xi") {
    required.push(data.pflegekasse);
  } else {
    required.push(data.versicherungstraeger);
    required.push(data.monthlyHoursEstimate);
  }
  const filled = required.filter(Boolean).length;
  return Math.round((filled / required.length) * 100);
}

/**
 * Liste fehlender Felder für UI-Anzeige (gelb markieren).
 */
export function missingFields(data: PensionApplicationData): string[] {
  const missing: string[] = [];
  if (!data.insuranceNumber) missing.push("insuranceNumber");
  if (!data.address) missing.push("address");
  if (!data.diagnoses?.length) missing.push("diagnoses");
  if (!data.mobilityDescription) missing.push("mobilityDescription");
  if (!data.cognitionDescription) missing.push("cognitionDescription");
  if (!data.selfCareDescription) missing.push("selfCareDescription");
  if (!data.therapyDescription) missing.push("therapyDescription");
  if (!data.socialDescription) missing.push("socialDescription");
  if (data.jurisdiction === "de-sgb-xi" && !data.pflegekasse) missing.push("pflegekasse");
  if (data.jurisdiction === "at-bpgg" && !data.versicherungstraeger) missing.push("versicherungstraeger");
  if (data.jurisdiction === "at-bpgg" && !data.monthlyHoursEstimate) missing.push("monthlyHoursEstimate");
  return missing;
}
