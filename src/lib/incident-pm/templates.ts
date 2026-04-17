/**
 * 5 Postmortem-Templates fuer haeufige kritische Vorfaelle.
 */

import type { ContributingFactor, PostMortem } from "./types";

export interface PostMortemTemplate {
  key: string;
  name: string;
  description: string;
  factorSuggestions: ContributingFactor[];
  whatWentWellHints: string[];
  whatWentWrongHints: string[];
  defaultActionItems: Array<{ title: string; owner: string }>;
}

export const POSTMORTEM_TEMPLATES: PostMortemTemplate[] = [
  {
    key: "sturz_verletzung",
    name: "Sturz mit Verletzung",
    description: "Bewohner:in gestuerzt, aerztliche Versorgung noetig.",
    factorSuggestions: [
      { category: "umgebung", description: "Beleuchtung, Bodenbelag, Hindernisse?" },
      { category: "mensch", description: "Sturzrisiko bekannt/dokumentiert?" },
      { category: "system", description: "Sturzprophylaxe-Massnahmen hinterlegt?" },
      { category: "organisation", description: "Nachtdienst-Besetzung ausreichend?" },
    ],
    whatWentWellHints: [
      "Rasche Erstversorgung",
      "Dokumentation vollstaendig",
      "Angehoerige zeitnah informiert",
    ],
    whatWentWrongHints: [
      "Sturzrisiko nicht aktuell bewertet",
      "Sturzprophylaxe nicht konsequent umgesetzt",
    ],
    defaultActionItems: [
      { title: "Sturzprophylaxe-SOP ueberpruefen", owner: "Qualitaetsbeauftragte:r" },
      { title: "Sturzrisiko-Assessments re-evaluieren", owner: "PDL" },
    ],
  },
  {
    key: "medikationsfehler",
    name: "Medikationsfehler",
    description: "Falsche Dosis, falsches Praeparat, falsche:r Bewohner:in.",
    factorSuggestions: [
      { category: "mensch", description: "Uebermuedung, Unterbrechung waehrend Stellvorgang?" },
      { category: "system", description: "Doppel-Check etabliert?" },
      { category: "organisation", description: "Arbeitsbelastung in der Schicht?" },
    ],
    whatWentWellHints: [
      "Fehler rechtzeitig erkannt",
      "Arzt sofort informiert",
    ],
    whatWentWrongHints: [
      "Doppel-Check ausgefallen",
      "Stellvorgang in hektischer Umgebung",
    ],
    defaultActionItems: [
      { title: "Doppel-Check-SOP ueberarbeiten", owner: "Arzneimittel-Beauftragte:r" },
      { title: "Stell-Raum laermreduzieren", owner: "PDL" },
    ],
  },
  {
    key: "vermisst",
    name: "Vermisst-Meldung",
    description: "Bewohner:in unangekuendigt ausserhalb der Einrichtung.",
    factorSuggestions: [
      { category: "umgebung", description: "Ausgang ungesichert?" },
      { category: "organisation", description: "Abwesenheits-Rundgang zeitlich engmaschig genug?" },
      { category: "system", description: "Weglauftendenz dokumentiert?" },
    ],
    whatWentWellHints: [
      "Meldekette funktioniert",
      "Sofortige Suche eingeleitet",
    ],
    whatWentWrongHints: [
      "Letzter Sichtungs-Zeitpunkt nicht klar",
      "Weglauftendenz nicht aktuell bewertet",
    ],
    defaultActionItems: [
      { title: "Ausgang-Sicherung pruefen", owner: "Technische Leitung" },
      { title: "Weglauftendenz-Assessment standardisieren", owner: "Demenz-Beauftragte:r" },
    ],
  },
  {
    key: "verweigerte_pflege",
    name: "Verweigerte Pflege",
    description: "Wiederholte Verweigerung fuehrte zu Folgeproblem.",
    factorSuggestions: [
      { category: "mensch", description: "Kommunikations-Ansatz passend?" },
      { category: "organisation", description: "Gleiche Bezugspflege moeglich?" },
      { category: "system", description: "Ethik-Konsil einbezogen?" },
    ],
    whatWentWellHints: [
      "Autonomie respektiert",
      "Angehoerige einbezogen",
    ],
    whatWentWrongHints: [
      "Eskalationspfad unklar",
      "Ethik-Konsil zu spaet",
    ],
    defaultActionItems: [
      { title: "Ethik-Konsil-Prozess dokumentieren", owner: "Ethikberater:in" },
      { title: "Bezugspflege-Planung optimieren", owner: "WBL" },
    ],
  },
  {
    key: "systemausfall",
    name: "Systemausfall",
    description: "Technischer Ausfall beeintraechtigt Pflege-Dokumentation.",
    factorSuggestions: [
      { category: "system", description: "Backup / Failover vorhanden?" },
      { category: "organisation", description: "Papier-Fallback eingeuebt?" },
      { category: "umgebung", description: "Netzwerk / Strom stabil?" },
    ],
    whatWentWellHints: [
      "Papier-Fallback genutzt",
      "Team ruhig und strukturiert",
    ],
    whatWentWrongHints: [
      "Nachdokumentation unvollstaendig",
      "Benachrichtigungs-Kette zu langsam",
    ],
    defaultActionItems: [
      { title: "BCP-Drill pro Quartal", owner: "Qualitaetsbeauftragte:r" },
      { title: "Nachdokumentations-Template erstellen", owner: "PDL" },
    ],
  },
];

export function getTemplate(key: string): PostMortemTemplate | undefined {
  return POSTMORTEM_TEMPLATES.find((t) => t.key === key);
}

export function makePostMortemFromTemplate(
  key: string,
  incidentId: string,
  tenantId: string,
  title: string,
  createdBy: string,
): PostMortem {
  const t = getTemplate(key);
  const now = new Date().toISOString();
  return {
    id: `pm-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    tenantId,
    incidentId,
    title,
    templateKey: key,
    status: "in_bearbeitung",
    timeline: [],
    contributingFactors: t?.factorSuggestions ?? [],
    whatWentWell: [],
    whatWentWrong: [],
    actionItems:
      t?.defaultActionItems.map((a, i) => ({
        id: `ai-${Date.now()}-${i}`,
        title: a.title,
        owner: a.owner,
        status: "offen" as const,
        createdAt: now,
      })) ?? [],
    signOffs: [],
    createdAt: now,
    updatedAt: now,
    createdBy,
  };
}
