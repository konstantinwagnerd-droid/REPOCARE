/**
 * Minimaler Markdown → HTML Renderer.
 * Vermeidet externe Abhaengigkeiten, deckt die fuer Blog/Glossar benoetigten
 * Elemente ab: Ueberschriften (H2/H3/H4), Absaetze, Listen, Links, Inline-Code,
 * Fett/Kursiv, Blockquotes, horizontale Linien.
 *
 * Extrahiert ausserdem Ueberschriften fuer ein automatisches Inhaltsverzeichnis.
 */

export type TocEntry = { id: string; level: 2 | 3; text: string };

function slugify(s: string): string {
  return s
    .toLowerCase()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function renderInline(s: string): string {
  let out = escapeHtml(s);
  // Inline-Code
  out = out.replace(/`([^`]+)`/g, '<code class="rounded bg-secondary px-1.5 py-0.5 font-mono text-[0.9em]">$1</code>');
  // Links [text](url)
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary underline-offset-4 hover:underline">$1</a>');
  // Fett **text**
  out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  // Kursiv *text*
  out = out.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  return out;
}

export function renderMarkdown(md: string): { html: string; toc: TocEntry[] } {
  const lines = md.replace(/\r\n/g, "\n").split("\n");
  const toc: TocEntry[] = [];
  const htmlParts: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Leerzeile
    if (!line.trim()) {
      i++;
      continue;
    }

    // Horizontale Linie
    if (/^---+$/.test(line.trim())) {
      htmlParts.push('<hr class="my-8 border-border" />');
      i++;
      continue;
    }

    // Ueberschriften
    const h = /^(#{2,4})\s+(.*)$/.exec(line);
    if (h) {
      const level = h[1].length as 2 | 3 | 4;
      const text = h[2].trim();
      const id = slugify(text);
      if (level === 2 || level === 3) toc.push({ id, level, text });
      const cls =
        level === 2
          ? "mt-10 mb-4 font-serif text-2xl font-semibold tracking-tight md:text-3xl"
          : level === 3
            ? "mt-8 mb-3 font-serif text-xl font-semibold tracking-tight"
            : "mt-6 mb-2 font-semibold";
      htmlParts.push(`<h${level} id="${id}" class="${cls}">${renderInline(text)}</h${level}>`);
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      const buf: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        buf.push(lines[i].slice(2));
        i++;
      }
      htmlParts.push(
        `<blockquote class="my-6 border-l-4 border-primary bg-primary/5 px-5 py-3 italic text-muted-foreground">${renderInline(buf.join(" "))}</blockquote>`,
      );
      continue;
    }

    // Ungeordnete Liste
    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        items.push(`<li>${renderInline(lines[i].replace(/^[-*]\s+/, ""))}</li>`);
        i++;
      }
      htmlParts.push(`<ul class="my-4 list-disc space-y-2 pl-6">${items.join("")}</ul>`);
      continue;
    }

    // Geordnete Liste
    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(`<li>${renderInline(lines[i].replace(/^\d+\.\s+/, ""))}</li>`);
        i++;
      }
      htmlParts.push(`<ol class="my-4 list-decimal space-y-2 pl-6">${items.join("")}</ol>`);
      continue;
    }

    // Absatz (Zeilen bis Leerzeile sammeln)
    const buf: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^#{2,4}\s+/.test(lines[i]) &&
      !/^[-*]\s+/.test(lines[i]) &&
      !/^\d+\.\s+/.test(lines[i]) &&
      !lines[i].startsWith("> ") &&
      !/^---+$/.test(lines[i].trim())
    ) {
      buf.push(lines[i]);
      i++;
    }
    if (buf.length > 0) {
      htmlParts.push(`<p class="my-4 leading-relaxed text-muted-foreground">${renderInline(buf.join(" "))}</p>`);
    }
  }

  return { html: htmlParts.join("\n"), toc };
}

export function estimateReadingMinutes(md: string): number {
  const words = md.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export function countWords(md: string): number {
  return md.split(/\s+/).filter(Boolean).length;
}
