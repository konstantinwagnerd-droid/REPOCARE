/**
 * Template-Bibliothek — liest Markdown-Dateien aus content/templates/
 * (mit YAML-Frontmatter) ein und stellt sie dem Katalog zur Verfügung.
 *
 * Im Next.js-Build (vercel/edge) ist filesystem-Zugriff eingeschränkt —
 * deshalb wird der Katalog zur Build-Zeit gelesen und als statische Daten
 * exportiert. Dynamisches Laden im Runtime per Server-Components möglich,
 * da die Dateien im Repo + in der Deploy-Artifact sind.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

export interface TemplateMeta {
  id: string;
  title: string;
  jurisdiction: "at" | "de" | "shared";
  category: string;
  applicable_to: string[];
  legal_reference: string;
  source_url: string;
  version_date: string;
  /** Vollständiger Pfad relativ zu content/templates, ohne .md */
  slug: string;
  assessment_tool?: string;
}

export interface Template extends TemplateMeta {
  body: string;
}

const TEMPLATES_ROOT = join(process.cwd(), "content", "templates");

function parseFrontmatter(raw: string): { meta: Record<string, unknown>; body: string } {
  const match = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/.exec(raw);
  if (!match) return { meta: {}, body: raw };
  const fm = match[1];
  const body = match[2];

  const meta: Record<string, unknown> = {};
  const lines = fm.split("\n");
  let currentKey: string | null = null;
  let arrayAcc: string[] | null = null;

  for (const line of lines) {
    if (!line.trim()) continue;
    // Array-Item "  - xxx"
    if (/^\s*-\s+(.+)/.test(line) && arrayAcc && currentKey) {
      const val = /^\s*-\s+(.+)/.exec(line)![1].trim();
      arrayAcc.push(val.replace(/^["']|["']$/g, ""));
      continue;
    }
    // Key:
    const kv = /^([a-z_]+):\s*(.*)$/i.exec(line);
    if (kv) {
      currentKey = kv[1];
      const raw = kv[2].trim();
      if (!raw) {
        arrayAcc = [];
        meta[currentKey] = arrayAcc;
      } else {
        arrayAcc = null;
        const val = raw.replace(/^["']|["']$/g, "");
        meta[currentKey] = val;
      }
    }
  }

  return { meta, body };
}

function walkMd(dir: string, prefix = ""): Array<{ slug: string; abs: string }> {
  const out: Array<{ slug: string; abs: string }> = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    const abs = join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...walkMd(abs, rel));
    } else if (entry.isFile() && entry.name.endsWith(".md") && entry.name !== "README.md") {
      out.push({ slug: rel.replace(/\.md$/, ""), abs });
    }
  }
  return out;
}

let _cache: Template[] | null = null;

export function loadAllTemplates(): Template[] {
  if (_cache) return _cache;
  const entries = walkMd(TEMPLATES_ROOT);
  const tpls: Template[] = [];
  for (const e of entries) {
    const raw = readFileSync(e.abs, "utf8");
    const { meta, body } = parseFrontmatter(raw);
    if (!meta.id) continue;
    tpls.push({
      id: String(meta.id),
      title: String(meta.title ?? meta.id),
      jurisdiction: (meta.jurisdiction ?? "shared") as TemplateMeta["jurisdiction"],
      category: String(meta.category ?? "other"),
      applicable_to: Array.isArray(meta.applicable_to) ? (meta.applicable_to as string[]) : [],
      legal_reference: String(meta.legal_reference ?? ""),
      source_url: String(meta.source_url ?? ""),
      version_date: String(meta.version_date ?? ""),
      assessment_tool: meta.assessment_tool ? String(meta.assessment_tool) : undefined,
      slug: e.slug,
      body,
    });
  }
  _cache = tpls.sort((a, b) => a.title.localeCompare(b.title, "de"));
  return _cache;
}

export function getTemplate(slug: string): Template | undefined {
  return loadAllTemplates().find((t) => t.slug === slug);
}

export function filterTemplates(opts: {
  jurisdiction?: string;
  category?: string;
  applicableTo?: string;
  search?: string;
}): Template[] {
  const all = loadAllTemplates();
  return all.filter((t) => {
    if (opts.jurisdiction && opts.jurisdiction !== "all" && t.jurisdiction !== opts.jurisdiction) return false;
    if (opts.category && opts.category !== "all" && t.category !== opts.category) return false;
    if (opts.applicableTo && !t.applicable_to.includes(opts.applicableTo)) return false;
    if (opts.search) {
      const s = opts.search.toLowerCase();
      if (!t.title.toLowerCase().includes(s) && !t.body.toLowerCase().includes(s)) return false;
    }
    return true;
  });
}

export function uniqueCategories(): string[] {
  return Array.from(new Set(loadAllTemplates().map((t) => t.category))).sort();
}

/** Ersetzt {{feld}}-Placeholder durch bereitgestellte Werte. Unbefüllte Platzhalter bleiben sichtbar. */
export function fillTemplate(body: string, values: Record<string, string | number | null | undefined>): string {
  return body.replace(/\{\{([a-zA-Z0-9_.]+)\}\}/g, (match, key) => {
    const v = values[key];
    if (v === null || v === undefined || v === "") return `__${key}__`;
    return String(v);
  });
}

/** Extrahiert alle {{feld}}-Platzhalter aus einem Template-Body. */
export function extractPlaceholders(body: string): string[] {
  const set = new Set<string>();
  for (const m of body.matchAll(/\{\{([a-zA-Z0-9_.]+)\}\}/g)) {
    set.add(m[1]);
  }
  return Array.from(set).sort();
}
