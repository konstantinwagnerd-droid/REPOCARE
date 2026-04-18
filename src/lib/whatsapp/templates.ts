/**
 * WhatsApp-Text-Templates fuer Angehoerigen-Kommunikation.
 * Bewusst kurz gehalten, DSGVO-konform (kein Medikamenten-Detail im Text).
 * Details landen im CareAI-Portal — nie im Messenger.
 */

export type TemplateName =
  | "incident_critical"
  | "wellbeing_weekly"
  | "visit_reminder"
  | "daily_photo"
  | "consent_confirm";

export interface TemplateDef {
  name: TemplateName;
  label: string;
  description: string;
  requiredVars: string[];
  scope: "all" | "critical" | "daily";
  render: (vars: Record<string, string>) => string;
}

const need = (vars: Record<string, string>, keys: string[]) => {
  for (const k of keys) if (!vars[k]) throw new Error(`Template var missing: ${k}`);
};

export const templates: Record<TemplateName, TemplateDef> = {
  incident_critical: {
    name: "incident_critical",
    label: "Vorkommnis (kritisch)",
    description: "Benachrichtigung bei kritischem Vorkommnis (Sturz, Verschlechterung).",
    requiredVars: ["name", "resident_name"],
    scope: "critical",
    render: (v) => {
      need(v, ["name", "resident_name"]);
      return (
        `Hallo ${v.name}, es gab heute ein Vorkommnis bei ${v.resident_name}. ` +
        `Die Pflegekraefte sind informiert und es geht ihm/ihr stabil. ` +
        `Details findest du sicher verschluesselt im CareAI-Portal: https://repocare.vercel.app/family`
      );
    },
  },
  wellbeing_weekly: {
    name: "wellbeing_weekly",
    label: "Wohlbefinden (woechentlich)",
    description: "Wochenzusammenfassung mit Wohlbefindens-Score und kurzer Notiz.",
    requiredVars: ["name", "resident_name", "score", "note"],
    scope: "daily",
    render: (v) => {
      need(v, ["name", "resident_name", "score"]);
      const note = v.note ? `\n${v.note}` : "";
      return (
        `Hallo ${v.name}, kurzer Wochencheck fuer ${v.resident_name}: ` +
        `Wohlbefinden ${v.score}/10.${note}\nMehr im Portal.`
      );
    },
  },
  visit_reminder: {
    name: "visit_reminder",
    label: "Besuchs-Erinnerung",
    description: "Erinnerung an eingetragenen Besuchstermin.",
    requiredVars: ["name", "datetime"],
    scope: "all",
    render: (v) => {
      need(v, ["name", "datetime"]);
      return `Hallo ${v.name}, Erinnerung: du hast einen Besuch am ${v.datetime} eingetragen. Bis bald!`;
    },
  },
  daily_photo: {
    name: "daily_photo",
    label: "Foto des Tages",
    description: "Freigegebenes Foto aus dem Pflegealltag.",
    requiredVars: ["name", "resident_name", "photo_url"],
    scope: "daily",
    render: (v) => {
      need(v, ["name", "resident_name"]);
      return (
        `Hallo ${v.name}, ein Foto des Tages fuer ${v.resident_name}: ${v.photo_url ?? "im Portal ansehen"}`
      );
    },
  },
  consent_confirm: {
    name: "consent_confirm",
    label: "Einwilligung bestaetigen",
    description: "Initiale Opt-In-Anfrage nach Portal-Anmeldung.",
    requiredVars: ["name", "facility"],
    scope: "critical",
    render: (v) => {
      need(v, ["name", "facility"]);
      return (
        `Hallo ${v.name}, willkommen im CareAI-Angehoerigen-Portal der ${v.facility}. ` +
        `Moechtest du WhatsApp-Benachrichtigungen erhalten? Antworte JA (kritisch) oder ALLES (inkl. taegliche Updates). ` +
        `Du kannst jederzeit STOP senden.`
      );
    },
  },
};

export function listTemplates(): TemplateDef[] {
  return Object.values(templates);
}

export function renderTemplate(name: TemplateName, vars: Record<string, string>): string {
  const tpl = templates[name];
  if (!tpl) throw new Error(`Unknown template: ${name}`);
  return tpl.render(vars);
}
