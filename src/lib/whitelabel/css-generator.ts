import type { BrandConfig } from "./types";
import { scaleFromHex } from "./validator";

/**
 * Generiert CSS-Variablen als String, der in ein <style>-Tag
 * injiziert werden kann. Keine Style-Mutation zur Laufzeit auf dem Client —
 * SSR-kompatibel.
 */
export function generateBrandCss(cfg: BrandConfig): string {
  const primScale = scaleFromHex(cfg.colors.primary);
  const accScale = scaleFromHex(cfg.colors.accent);
  const headline = cfg.typography.headline;
  const body = cfg.typography.body;

  const rules: string[] = [];
  rules.push(":root[data-whitelabel=\"on\"] {");
  rules.push(`  --wl-primary: ${cfg.colors.primary};`);
  rules.push(`  --wl-accent: ${cfg.colors.accent};`);
  rules.push(`  --wl-gradient-from: ${cfg.colors.gradientFrom};`);
  rules.push(`  --wl-gradient-to: ${cfg.colors.gradientTo};`);
  rules.push(`  --wl-font-headline: "${headline}", ui-serif, Georgia, serif;`);
  rules.push(`  --wl-font-body: "${body}", ui-sans-serif, system-ui, sans-serif;`);
  primScale.forEach((c, i) => rules.push(`  --wl-primary-${(i + 1) * 100}: ${c};`));
  accScale.forEach((c, i) => rules.push(`  --wl-accent-${(i + 1) * 100}: ${c};`));
  rules.push("}");

  rules.push(":root[data-whitelabel=\"on\"] .wl-brand { color: var(--wl-primary); }");
  rules.push(":root[data-whitelabel=\"on\"] .wl-brand-bg { background: var(--wl-primary); color: white; }");
  rules.push(":root[data-whitelabel=\"on\"] .wl-gradient { background: linear-gradient(135deg, var(--wl-gradient-from), var(--wl-gradient-to)); }");
  rules.push(":root[data-whitelabel=\"on\"] .wl-headline { font-family: var(--wl-font-headline); }");
  rules.push(":root[data-whitelabel=\"on\"] .wl-body { font-family: var(--wl-font-body); }");

  return rules.join("\n");
}

export function brandFontLinks(cfg: BrandConfig): string[] {
  const headlineFamily = encodeURIComponent(cfg.typography.headline);
  const bodyFamily = encodeURIComponent(cfg.typography.body);
  return [
    `https://fonts.googleapis.com/css2?family=${headlineFamily}:wght@400;600;700&display=swap`,
    `https://fonts.googleapis.com/css2?family=${bodyFamily}:wght@400;500;600&display=swap`,
  ];
}
