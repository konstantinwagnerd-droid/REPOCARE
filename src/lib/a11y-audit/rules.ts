import type { A11yRule, RuleMatch } from "./types";

function findMatches(source: string, regex: RegExp, message: (m: RegExpExecArray) => string): RuleMatch[] {
  const out: RuleMatch[] = [];
  const re = new RegExp(regex.source, regex.flags.includes("g") ? regex.flags : regex.flags + "g");
  let m: RegExpExecArray | null;
  while ((m = re.exec(source)) !== null) {
    const before = source.slice(0, m.index);
    const line = before.split("\n").length;
    const snippet = m[0].slice(0, 120).replace(/\s+/g, " ");
    out.push({ line, snippet, message: message(m) });
    if (m.index === re.lastIndex) re.lastIndex++;
  }
  return out;
}

export const RULES: A11yRule[] = [
  {
    id: "img-alt",
    wcag: "1.1.1", level: "A", severity: "serious",
    title: "Images must have alt text",
    description: "Non-decorative <img> elements require an alt attribute.",
    check: (src) => findMatches(src, /<img\b(?![^>]*\balt\s*=)[^>]*>/g, () => "Missing alt attribute on <img>"),
  },
  {
    id: "button-name",
    wcag: "4.1.2", level: "A", severity: "serious",
    title: "Buttons must have accessible name",
    description: "<button> elements need visible text, aria-label, or aria-labelledby.",
    check: (src) => findMatches(src, /<button\b(?![^>]*\b(aria-label|aria-labelledby)\s*=)[^>]*>\s*<\/button>/g, () => "Empty <button> without aria-label"),
  },
  {
    id: "link-name",
    wcag: "2.4.4", level: "A", severity: "serious",
    title: "Links must have discernible text",
    description: "Anchor tags must contain text or an aria-label.",
    check: (src) => findMatches(src, /<a\b(?![^>]*\b(aria-label|aria-labelledby)\s*=)[^>]*>\s*<\/a>/g, () => "Empty <a> without aria-label"),
  },
  {
    id: "label-for-input",
    wcag: "3.3.2", level: "A", severity: "serious",
    title: "Form inputs must be labelled",
    description: "Input elements need an associated <label> or aria-label.",
    check: (src) => findMatches(src, /<input\b(?![^>]*\b(aria-label|aria-labelledby|id)\s*=)[^>]*\/?>/g, () => "<input> without id, aria-label or aria-labelledby"),
  },
  {
    id: "html-lang",
    wcag: "3.1.1", level: "A", severity: "moderate",
    title: "Page should declare language",
    description: "Root HTML/layout should set a lang attribute.",
    check: (src, file) => file.endsWith("layout.tsx") && !/\blang\s*=/.test(src) ? [{ line: 1, snippet: "layout.tsx", message: "Root layout missing lang attribute" }] : [],
  },
  {
    id: "heading-order",
    wcag: "1.3.1", level: "A", severity: "moderate",
    title: "Heading order should be logical",
    description: "Do not skip heading levels (e.g., h1 → h3).",
    check: (src) => {
      const out: RuleMatch[] = [];
      const headings = [...src.matchAll(/<h([1-6])\b/g)];
      let prev = 0;
      for (const m of headings) {
        const lvl = +m[1];
        if (prev && lvl > prev + 1) {
          const line = src.slice(0, m.index!).split("\n").length;
          out.push({ line, snippet: m[0], message: `Heading jumps from h${prev} to h${lvl}` });
        }
        prev = lvl;
      }
      return out;
    },
  },
  {
    id: "landmark-main",
    wcag: "1.3.1", level: "A", severity: "moderate",
    title: "Pages should have a main landmark",
    description: "Every page or layout should include a <main> element.",
    check: (src, file) => {
      if (!file.endsWith("layout.tsx") && !file.endsWith("page.tsx")) return [];
      if (file.endsWith("page.tsx")) return []; // layout responsibility
      return /<main\b/.test(src) ? [] : [{ line: 1, snippet: "layout.tsx", message: "<main> landmark missing" }];
    },
  },
  {
    id: "aria-role-valid",
    wcag: "4.1.2", level: "A", severity: "moderate",
    title: "role attributes must be valid",
    description: "Custom role must be one of the ARIA roles.",
    check: (src) => findMatches(src, /role=["']([a-zA-Z-]+)["']/g, (m) => {
      const valid = ["button", "link", "navigation", "main", "complementary", "banner", "contentinfo", "region", "dialog", "alert", "status", "tab", "tablist", "tabpanel", "menu", "menuitem", "list", "listitem", "heading", "img", "presentation", "none", "form", "search", "group", "row", "cell", "columnheader", "rowheader", "table", "grid", "gridcell", "separator", "switch", "checkbox", "radio", "radiogroup", "combobox", "listbox", "option", "progressbar", "slider", "spinbutton", "textbox", "tooltip", "feed", "article", "document"];
      return valid.includes(m[1]) ? "" : `Invalid ARIA role: ${m[1]}`;
    }).filter((m) => m.message),
  },
  {
    id: "contrast-low-risk",
    wcag: "1.4.3", level: "AA", severity: "moderate",
    title: "Avoid low-contrast utility classes",
    description: "text-muted-foreground on muted backgrounds may fall below 4.5:1. Verify with dev tools.",
    check: (src) => findMatches(src, /text-muted-foreground[^"']*bg-muted/g, () => "Potential low-contrast combination: text-muted-foreground on bg-muted"),
  },
  {
    id: "touch-target-size",
    wcag: "2.5.8", level: "AA", severity: "moderate",
    title: "Touch targets should be at least 24×24 CSS px (WCAG 2.2)",
    description: "Avoid tiny tap targets. Size presets below size=\"sm\" on interactive elements warrant review.",
    check: (src) => findMatches(src, /size=["']xs["']/g, () => "size=\"xs\" on interactive element — verify 24×24px minimum"),
  },
  {
    id: "focus-visible",
    wcag: "2.4.7", level: "AA", severity: "serious",
    title: "Do not disable focus outlines",
    description: "outline-none without focus-visible replacement breaks keyboard UX.",
    check: (src) => findMatches(src, /\boutline-none\b(?![^"'<>]*focus-visible)/g, () => "outline-none without focus-visible fallback"),
  },
  {
    id: "autocomplete-personal",
    wcag: "1.3.5", level: "AA", severity: "minor",
    title: "Personal fields should use autocomplete",
    description: "Inputs for name/email should declare autocomplete.",
    check: (src) => findMatches(src, /<input\b[^>]*type=["'](email|tel|text)["'][^>]*name=["'](email|name|phone|firstName|lastName)["'](?![^>]*autocomplete)[^>]*>/g, () => "Personal input missing autocomplete attribute"),
  },
  {
    id: "video-captions",
    wcag: "1.2.2", level: "A", severity: "serious",
    title: "Videos should have captions",
    description: "<video> must include a <track kind=\"captions\"> element.",
    check: (src) => findMatches(src, /<video\b(?![^>]*<track)[\s\S]*?<\/video>/g, () => "<video> without <track kind=\"captions\">"),
  },
  {
    id: "iframe-title",
    wcag: "4.1.2", level: "A", severity: "moderate",
    title: "iframes need a title",
    description: "<iframe> elements must have a title attribute.",
    check: (src) => findMatches(src, /<iframe\b(?![^>]*\btitle\s*=)[^>]*>/g, () => "<iframe> missing title attribute"),
  },
  {
    id: "dialog-label",
    wcag: "4.1.2", level: "A", severity: "moderate",
    title: "Dialogs need accessible name",
    description: "Dialog components should have aria-label or DialogTitle.",
    check: (src) => findMatches(src, /<Dialog\b(?![^>]*\baria-label\s*=)[^>]*>(?![\s\S]*?<DialogTitle)/g, () => "<Dialog> without aria-label or DialogTitle"),
  },
  {
    id: "no-positive-tabindex",
    wcag: "2.4.3", level: "A", severity: "moderate",
    title: "Avoid positive tabindex",
    description: "tabindex > 0 disrupts natural tab order.",
    check: (src) => findMatches(src, /tabindex=["']([1-9]\d*)["']/g, (m) => `Positive tabindex="${m[1]}" disrupts tab order`),
  },
  {
    id: "lang-mixed-content",
    wcag: "3.1.2", level: "AA", severity: "minor",
    title: "Foreign-language passages should be tagged",
    description: "Use lang attribute on elements containing a different language than the page.",
    check: () => [],
  },
  {
    id: "skip-link",
    wcag: "2.4.1", level: "A", severity: "moderate",
    title: "Layouts should provide a skip link",
    description: "Root layout should include a 'Skip to main content' link.",
    check: (src, file) => {
      if (!file.endsWith("layout.tsx")) return [];
      return /skip[- ]to[- ]main|skip[- ]link/i.test(src) ? [] : [{ line: 1, snippet: "layout.tsx", message: "No skip link found in root layout" }];
    },
  },
  {
    id: "aria-hidden-interactive",
    wcag: "4.1.2", level: "A", severity: "serious",
    title: "aria-hidden must not wrap interactive elements",
    description: "aria-hidden on containers with buttons/links makes them invisible to AT.",
    check: (src) => findMatches(src, /aria-hidden=["']true["'][^>]*>\s*<(?:button|a|input|select|textarea)\b/g, () => "Interactive element inside aria-hidden container"),
  },
  {
    id: "table-headers",
    wcag: "1.3.1", level: "A", severity: "moderate",
    title: "Data tables need headers",
    description: "<table> without <th> is likely untagged data.",
    check: (src) => findMatches(src, /<table\b(?![\s\S]*?<th\b)[\s\S]*?<\/table>/g, () => "<table> without <th> elements"),
  },
];

export function getRuleById(id: string): A11yRule | undefined {
  return RULES.find((r) => r.id === id);
}
