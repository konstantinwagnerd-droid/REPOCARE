/**
 * Elevation-Skala z1–z5 mit Color-Shadows (subtle Petrol).
 * Verwendet in Patterns und Komponenten — als `style={{ boxShadow }}` oder via CSS-Vars.
 */
export const shadows = {
  z1: "0 1px 2px rgba(15, 118, 110, 0.04), 0 1px 3px rgba(15, 118, 110, 0.06)",
  z2: "0 2px 4px rgba(15, 118, 110, 0.05), 0 4px 8px rgba(15, 118, 110, 0.08)",
  z3: "0 4px 8px rgba(15, 118, 110, 0.07), 0 8px 16px rgba(15, 118, 110, 0.10)",
  z4: "0 8px 16px rgba(15, 118, 110, 0.09), 0 16px 32px rgba(15, 118, 110, 0.12)",
  z5: "0 16px 32px rgba(15, 118, 110, 0.12), 0 32px 64px rgba(15, 118, 110, 0.16)",
  accentGlow: "0 8px 32px rgba(249, 115, 22, 0.25)",
  ringPrimary: "0 0 0 3px rgba(20, 184, 166, 0.25)",
  ringAccent: "0 0 0 3px rgba(249, 115, 22, 0.25)",
  insetSubtle: "inset 0 1px 0 rgba(255, 255, 255, 0.06)",
} as const;

export const shadowClasses = {
  z1: "shadow-[0_1px_3px_rgba(15,118,110,0.06)]",
  z2: "shadow-[0_4px_8px_rgba(15,118,110,0.08)]",
  z3: "shadow-[0_8px_16px_rgba(15,118,110,0.10)]",
  z4: "shadow-[0_16px_32px_rgba(15,118,110,0.12)]",
  z5: "shadow-[0_32px_64px_rgba(15,118,110,0.16)]",
} as const;
