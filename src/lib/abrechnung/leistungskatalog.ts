/**
 * Offizieller Leistungskatalog der häuslichen Krankenpflege (HKP, § 302 SGB V)
 * + häufige SGB-XI-Leistungskomplexe.
 *
 * Quelle: GKV-Spitzenverband, Positionsnummernverzeichnis HKP vom 16.08.2024.
 * https://www.gkv-datenaustausch.de/media/dokumente/leistungserbringer_1/sonstige_leistungserbringer/positionsnummernverzeichnisse/Haeusliche-Krankenpflege_20240816.pdf
 *
 * Preise sind Richtwerte aus Rahmenvereinbarungen (variieren je Bundesland).
 */

import type { Leistungskatalog_Eintrag } from "./types";

export const LEISTUNGSKATALOG_HKP: Leistungskatalog_Eintrag[] = [
  {
    positionsNr: "10000",
    kurzBezeichnung: "Erstbesuch HKP",
    beschreibung: "Erstmaliger Besuch zur Pflege-Anamnese, Erstellung Pflegeplan, Anleitung Angehöriger",
    abrechnungsBasis: "pauschale",
    standardPreisCent: 4200,
    gueltigAb: "2024-01-01",
  },
  {
    positionsNr: "20000",
    kurzBezeichnung: "Folgebesuch HKP",
    beschreibung: "Regulärer Einsatz nach Erstbesuch",
    abrechnungsBasis: "pauschale",
    standardPreisCent: 3800,
    gueltigAb: "2024-01-01",
  },
  {
    positionsNr: "31000",
    kurzBezeichnung: "Injektion s.c.",
    beschreibung: "Subkutane Injektion (z.B. Insulin, Heparin)",
    abrechnungsBasis: "je_leistung",
    standardPreisCent: 410,
    gueltigAb: "2024-01-01",
    careaiTrigger: ["medication.route=subcutaneous"],
  },
  {
    positionsNr: "31001",
    kurzBezeichnung: "Injektion i.m.",
    beschreibung: "Intramuskuläre Injektion",
    abrechnungsBasis: "je_leistung",
    standardPreisCent: 450,
    gueltigAb: "2024-01-01",
    careaiTrigger: ["medication.route=intramuscular"],
  },
  {
    positionsNr: "31002",
    kurzBezeichnung: "Injektion i.v.",
    beschreibung: "Intravenöse Injektion",
    abrechnungsBasis: "je_leistung",
    standardPreisCent: 780,
    gueltigAb: "2024-01-01",
    careaiTrigger: ["medication.route=intravenous"],
  },
  {
    positionsNr: "31100",
    kurzBezeichnung: "BZ-/RR-Messung",
    beschreibung: "Blutzucker- und/oder Blutdruckmessung mit Dokumentation",
    abrechnungsBasis: "je_leistung",
    standardPreisCent: 240,
    gueltigAb: "2024-01-01",
    careaiTrigger: ["vitalSigns.type=heartRate", "vitalSigns.type=bloodPressureSystolic", "vitalSigns.type=bloodGlucose"],
  },
  {
    positionsNr: "31200",
    kurzBezeichnung: "Dekubitusbehandlung",
    beschreibung: "Therapeutische Wundbehandlung Dekubitus",
    abrechnungsBasis: "je_leistung",
    standardPreisCent: 1250,
    gueltigAb: "2024-01-01",
    careaiTrigger: ["wound.type=dekubitus"],
  },
  {
    positionsNr: "31300",
    kurzBezeichnung: "Wundversorgung klein",
    beschreibung: "Versorgung kleiner Wunden (≤ 10 cm², Verbandwechsel)",
    abrechnungsBasis: "je_leistung",
    standardPreisCent: 750,
    gueltigAb: "2024-01-01",
    careaiTrigger: ["wound.size=small"],
  },
  {
    positionsNr: "31301",
    kurzBezeichnung: "Wundversorgung groß",
    beschreibung: "Versorgung großer Wunden (> 10 cm² oder mit aseptischer Technik)",
    abrechnungsBasis: "je_leistung",
    standardPreisCent: 1380,
    gueltigAb: "2024-01-01",
    careaiTrigger: ["wound.size=large"],
  },
  {
    positionsNr: "31500",
    kurzBezeichnung: "Kompressionsverband",
    beschreibung: "Anlegen/Abnehmen Kompressionsverband",
    abrechnungsBasis: "je_leistung",
    standardPreisCent: 980,
    gueltigAb: "2024-01-01",
  },
  {
    positionsNr: "31501",
    kurzBezeichnung: "Thromboseprophylaxe-Strümpfe",
    beschreibung: "An-/Ausziehen med. Thromboseprophylaxe-Strümpfe",
    abrechnungsBasis: "je_tag",
    standardPreisCent: 450,
    gueltigAb: "2024-01-01",
  },
  {
    positionsNr: "32000",
    kurzBezeichnung: "Medikamenten-Gabe",
    beschreibung: "Einzelgabe (orale, rektale, topische Arzneimittel) incl. Kontrolle",
    abrechnungsBasis: "je_leistung",
    standardPreisCent: 320,
    gueltigAb: "2024-01-01",
    careaiTrigger: ["medicationAdministration"],
  },
  {
    positionsNr: "32100",
    kurzBezeichnung: "Medikamenten-Richten (Woche)",
    beschreibung: "Wöchentliches Stellen einer Medikamenten-Dispenserbox",
    abrechnungsBasis: "je_woche",
    standardPreisCent: 1600,
    gueltigAb: "2024-01-01",
  },
  {
    positionsNr: "32200",
    kurzBezeichnung: "Augentropfen verabreichen",
    beschreibung: "Verabreichung von Augentropfen je Tag",
    abrechnungsBasis: "je_tag",
    standardPreisCent: 280,
    gueltigAb: "2024-01-01",
  },
  {
    positionsNr: "33000",
    kurzBezeichnung: "PEG-Sonde Versorgung",
    beschreibung: "Pflege Stomawechsel PEG inkl. Verbandwechsel",
    abrechnungsBasis: "je_leistung",
    standardPreisCent: 1450,
    gueltigAb: "2024-01-01",
  },
  {
    positionsNr: "33100",
    kurzBezeichnung: "Blasenkatheter-Pflege",
    beschreibung: "Pflege/Wechsel transurethraler Dauerkatheter",
    abrechnungsBasis: "je_leistung",
    standardPreisCent: 1380,
    gueltigAb: "2024-01-01",
  },
  {
    positionsNr: "33200",
    kurzBezeichnung: "Absaugen Atemwege",
    beschreibung: "Pharyngeales/tracheales Absaugen",
    abrechnungsBasis: "je_leistung",
    standardPreisCent: 620,
    gueltigAb: "2024-01-01",
  },
  {
    positionsNr: "36000",
    kurzBezeichnung: "Anleitung Angehörige",
    beschreibung: "Anleitung pflegender Angehöriger zur Pflege (einmalig je Thema)",
    abrechnungsBasis: "pauschale",
    standardPreisCent: 2800,
    gueltigAb: "2024-01-01",
  },
];

/**
 * Findet Positions-Nr zu einem CareAI-Event-Typ (für Auto-Abrechnung).
 */
export function findPositionsByTrigger(trigger: string): Leistungskatalog_Eintrag[] {
  return LEISTUNGSKATALOG_HKP.filter((eintrag) =>
    eintrag.careaiTrigger?.some((t) => trigger === t || trigger.startsWith(t + "=")),
  );
}

/**
 * Abfrage Katalog-Eintrag nach exakter Positionsnummer.
 */
export function getLeistung(positionsNr: string): Leistungskatalog_Eintrag | undefined {
  return LEISTUNGSKATALOG_HKP.find((e) => e.positionsNr === positionsNr);
}
