import { getTemplate, defaultBoilerplate, defaultContact } from "./templates";
import { runQualityChecks } from "./rules";
import type { GenerateInput, GenerateOutput } from "./types";

/**
 * Rendert ein Template zu Markdown.
 *
 * - Platzhalter {{key}} werden durch values[key] ersetzt.
 * - Fehlende Optional-Werte werden leer.
 * - boilerplate und contact haben sinnvolle Defaults.
 */
export function generatePressRelease(input: GenerateInput): GenerateOutput {
  const template = getTemplate(input.templateId);
  if (!template) {
    throw new Error(`Unbekanntes Template: ${input.templateId}`);
  }

  const merged: Record<string, string> = {
    boilerplate: defaultBoilerplate,
    contact: defaultContact,
    outlook: "",
    traction: "",
    ...input.values,
  };

  // Headline berechnen (aus defaultHeadline + values), falls nicht gesetzt
  if (!merged.headline) {
    merged.headline = replaceTokens(template.defaultHeadline, merged);
  }

  const markdown = replaceTokens(template.body, merged).trim() + "\n";
  const quality = runQualityChecks(markdown);

  return { markdown, quality };
}

function replaceTokens(tpl: string, values: Record<string, string>): string {
  return tpl.replace(/\{\{(\w+)\}\}/g, (_, key) =>
    values[key] !== undefined ? values[key] : `{{${key}}}`,
  );
}
