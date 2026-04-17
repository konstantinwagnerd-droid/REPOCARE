import fs from "node:fs";
import path from "node:path";
import { RULES } from "./rules";
import type { AuditResult, Violation } from "./types";

const RECOMMENDATIONS: Record<string, { rec: string; effort: Violation["fixEffort"] }> = {
  "img-alt": { rec: "Add alt=\"...\" describing the image purpose, or alt=\"\" if decorative.", effort: "trivial" },
  "button-name": { rec: "Provide visible text child or aria-label.", effort: "trivial" },
  "link-name": { rec: "Add link text or aria-label describing destination.", effort: "trivial" },
  "label-for-input": { rec: "Associate <label htmlFor={id}> or use aria-label.", effort: "low" },
  "html-lang": { rec: "Set <html lang=\"de\"> (or locale).", effort: "trivial" },
  "heading-order": { rec: "Use sequential h1→h2→h3. Restructure if needed.", effort: "medium" },
  "landmark-main": { rec: "Wrap content in <main>...</main>.", effort: "trivial" },
  "aria-role-valid": { rec: "Use a valid ARIA role from the spec.", effort: "trivial" },
  "contrast-low-risk": { rec: "Verify contrast ratio is ≥ 4.5:1 for normal text, ≥ 3:1 for large.", effort: "low" },
  "touch-target-size": { rec: "Use size=\"sm\" or larger on interactive elements, or add min-w/h-[44px].", effort: "low" },
  "focus-visible": { rec: "Replace outline-none with focus-visible:ring-2.", effort: "low" },
  "autocomplete-personal": { rec: "Add autoComplete=\"name\"/\"email\"/\"tel\" as appropriate.", effort: "trivial" },
  "video-captions": { rec: "Add <track kind=\"captions\" src=\"...\" srcLang=\"de\" default />.", effort: "medium" },
  "iframe-title": { rec: "Add title=\"...\" attribute describing iframe content.", effort: "trivial" },
  "dialog-label": { rec: "Include <DialogTitle> or aria-label on Dialog root.", effort: "trivial" },
  "no-positive-tabindex": { rec: "Use tabIndex={0} or {-1}; avoid positive values.", effort: "low" },
  "lang-mixed-content": { rec: "Tag foreign-language spans with lang attribute.", effort: "low" },
  "skip-link": { rec: "Add <a href=\"#main\" className=\"sr-only focus:not-sr-only\">Zum Inhalt springen</a>.", effort: "trivial" },
  "aria-hidden-interactive": { rec: "Remove aria-hidden from interactive container, or hide via CSS display:none.", effort: "low" },
  "table-headers": { rec: "Add <thead><tr><th scope=\"col\">...</th></tr></thead>.", effort: "low" },
};

export interface RunOptions {
  /** Base directory to scan. */
  root?: string;
  /** Subdirectories to include (relative to root). Default: src/app */
  include?: string[];
  /** File extensions. Default: .tsx */
  extensions?: string[];
  /** Maximum files (safety cap). */
  maxFiles?: number;
}

export function walk(dir: string, exts: string[]): string[] {
  const out: string[] = [];
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
      out.push(...walk(full, exts));
    } else if (exts.some((e) => entry.name.endsWith(e))) {
      out.push(full);
    }
  }
  return out;
}

export function runAudit(opts: RunOptions = {}): AuditResult {
  const started = Date.now();
  const root = opts.root ?? process.cwd();
  const includes = opts.include ?? ["src/app", "src/components"];
  const exts = opts.extensions ?? [".tsx"];
  const maxFiles = opts.maxFiles ?? 2000;

  const files: string[] = [];
  for (const inc of includes) files.push(...walk(path.join(root, inc), exts));
  const sliced = files.slice(0, maxFiles);

  const violations: Violation[] = [];
  const filesWithViolations = new Set<string>();

  for (const file of sliced) {
    let source: string;
    try { source = fs.readFileSync(file, "utf8"); } catch { continue; }
    for (const rule of RULES) {
      const matches = rule.check(source, file);
      for (const m of matches) {
        if (!m.message) continue;
        const rel = path.relative(root, file).replace(/\\/g, "/");
        const rec = RECOMMENDATIONS[rule.id] ?? { rec: "Review against WCAG guideline.", effort: "low" as const };
        violations.push({
          ruleId: rule.id, wcag: rule.wcag, level: rule.level, severity: rule.severity,
          title: rule.title, file: rel, line: m.line, snippet: m.snippet,
          message: m.message, recommendation: rec.rec, fixEffort: rec.effort,
        });
        filesWithViolations.add(rel);
      }
    }
  }

  const summary = {
    critical: violations.filter((v) => v.severity === "critical").length,
    serious: violations.filter((v) => v.severity === "serious").length,
    moderate: violations.filter((v) => v.severity === "moderate").length,
    minor: violations.filter((v) => v.severity === "minor").length,
    total: violations.length,
    passRate: sliced.length === 0 ? 1 : (sliced.length - filesWithViolations.size) / sliced.length,
  };

  return {
    timestamp: new Date().toISOString(),
    filesScanned: sliced.length,
    rulesEvaluated: RULES.length,
    violations,
    summary,
    durationMs: Date.now() - started,
  };
}
