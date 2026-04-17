import type { QualityReport } from "./types";

/**
 * Qualitäts-Checks für Presseaussendungen.
 *
 * Keine harte Regel — nur Hinweise für Redakteur:innen.
 * Score = Anzahl bestandener Checks / Gesamt.
 */
export function runQualityChecks(markdown: string): QualityReport {
  const plain = markdown.replace(/[#*>_`-]/g, " ");
  const words = plain.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const checks: QualityReport["checks"] = [];

  checks.push({
    id: "length",
    label: "Länge 250–500 Wörter",
    pass: wordCount >= 250 && wordCount <= 500,
    hint:
      wordCount < 250
        ? `Nur ${wordCount} Wörter — zu kurz für eine klassische PM.`
        : wordCount > 500
          ? `${wordCount} Wörter — für PM tendenziell zu lang.`
          : undefined,
  });

  checks.push({
    id: "quote",
    label: "Enthält mindestens ein Zitat",
    pass: /"[^"]{10,}"/.test(markdown) || />\s+"[^"]{10,}/.test(markdown),
    hint: "Ein persönliches Zitat der Geschäftsführung erhöht die Zitatquote massiv.",
  });

  checks.push({
    id: "dateline",
    label: "Datum im ISO-Format (YYYY-MM-DD)",
    pass: /\b\d{4}-\d{2}-\d{2}\b/.test(markdown),
    hint: "Redaktionen erwarten klar erkennbares Datum in der Dateline.",
  });

  checks.push({
    id: "contact",
    label: "Pressekontakt mit E-Mail",
    pass: /[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(markdown),
    hint: "Ohne Kontakt-Mail ist die PM für Journalist:innen unbrauchbar.",
  });

  checks.push({
    id: "boilerplate",
    label: "Über-CareAI-Abschnitt vorhanden",
    pass: /Über CareAI/i.test(markdown),
  });

  checks.push({
    id: "headline",
    label: "Headline < 90 Zeichen",
    pass: (() => {
      const m = markdown.match(/^#\s+(.+)$/m);
      return m ? m[1].length <= 90 && m[1].length >= 10 : false;
    })(),
    hint: "Headlines über 90 Zeichen werden in Suchergebnissen abgeschnitten.",
  });

  checks.push({
    id: "nofiller",
    label: "Keine Platzhalter ({{...}}) mehr enthalten",
    pass: !/\{\{[^}]+\}\}/.test(markdown),
    hint: "Ungefüllte Platzhalter weisen auf fehlende Eingaben hin.",
  });

  const passed = checks.filter((c) => c.pass).length;
  const score = Math.round((passed / checks.length) * 100);

  return { wordCount, score, checks };
}
