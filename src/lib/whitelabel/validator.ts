import type { BrandColors, ContrastCheckResult } from "./types";

/** Konvertiert #rrggbb nach relativer Leuchtdichte (WCAG 2.1). */
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full.slice(0, 6), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function luminance([r, g, b]: [number, number, number]): number {
  const toLin = (c: number) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLin(r) + 0.7152 * toLin(g) + 0.0722 * toLin(b);
}

export function contrastRatio(fg: string, bg: string): number {
  const l1 = luminance(hexToRgb(fg));
  const l2 = luminance(hexToRgb(bg));
  const [a, b] = [Math.max(l1, l2), Math.min(l1, l2)];
  return (a + 0.05) / (b + 0.05);
}

export function checkContrast(fg: string, bg: string): ContrastCheckResult {
  const ratio = Math.round(contrastRatio(fg, bg) * 100) / 100;
  return {
    ratio,
    wcagAA: ratio >= 4.5,
    wcagAAA: ratio >= 7,
    note: ratio >= 7 ? "Ausgezeichnet (AAA)" : ratio >= 4.5 ? "Gut (AA)" : ratio >= 3 ? "Nur für Großtext zulässig" : "Unzureichend — nicht lesbar",
  };
}

export function validateHex(hex: string): boolean {
  return /^#[0-9a-fA-F]{6}$/.test(hex);
}

export function validateColors(c: BrandColors): { ok: boolean; errors: string[] } {
  const errors: string[] = [];
  for (const [k, v] of Object.entries(c)) {
    if (!validateHex(v)) errors.push(`Ungültiger HEX bei ${k}: ${v}`);
  }
  if (errors.length === 0) {
    const primaryOnWhite = contrastRatio(c.primary, "#ffffff");
    if (primaryOnWhite < 3) errors.push(`Primärfarbe auf Weiß zu kontrastarm (${primaryOnWhite.toFixed(2)}:1)`);
  }
  return { ok: errors.length === 0, errors };
}

/** Hex → OKLCH-Näherung (display-perzeptuell). */
export function hexToOklchApprox(hex: string): string {
  const [r, g, b] = hexToRgb(hex).map((c) => c / 255);
  const L = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const C = (max - min) * 0.5;
  let H = 0;
  if (max !== min) {
    const d = max - min;
    if (max === r) H = ((g - b) / d) * 60;
    else if (max === g) H = ((b - r) / d) * 60 + 120;
    else H = ((r - g) / d) * 60 + 240;
    if (H < 0) H += 360;
  }
  return `oklch(${L.toFixed(3)} ${C.toFixed(3)} ${H.toFixed(1)})`;
}

/** 10-Stufen-Skala aus einer Primärfarbe (heller→dunkler). */
export function scaleFromHex(hex: string): string[] {
  const [r, g, b] = hexToRgb(hex);
  const steps = [0.92, 0.82, 0.7, 0.55, 0.4, 0.25, 0.12, 0, -0.15, -0.3];
  return steps.map((t) => {
    const mix = (c: number) => {
      if (t >= 0) return Math.round(c + (255 - c) * t);
      return Math.round(c * (1 + t));
    };
    const toHex = (v: number) => v.toString(16).padStart(2, "0");
    return `#${toHex(mix(r))}${toHex(mix(g))}${toHex(mix(b))}`;
  });
}
