/**
 * CareAI Brand Tokens
 * Einziger Ort fuer Brand-Konstanten. Komponenten konsumieren diese.
 * Aenderungen hier kaskadieren in gradients.ts, shadows.ts, patterns/*.
 */

export const brand = {
  primary: {
    50: "#F0FDFB",
    100: "#CCFBF1",
    200: "#99F6E4",
    300: "#5EEAD4",
    400: "#2DD4BF",
    500: "#14B8A6",
    600: "#0D9488",
    700: "#0F766E",
    800: "#115E59",
    900: "#064E4A",
  },
  accent: {
    50: "#FFF7ED",
    100: "#FFEDD5",
    200: "#FED7AA",
    300: "#FDBA74",
    400: "#FB923C",
    500: "#F97316",
    600: "#EA580C",
    700: "#C2410C",
    800: "#9A3412",
    900: "#7C2D12",
  },
  neutral: {
    50: "#FAFAF9",
    100: "#F5F5F4",
    200: "#E7E5E4",
    300: "#D6D3D1",
    400: "#A8A29E",
    500: "#78716C",
    600: "#57534E",
    700: "#44403C",
    800: "#292524",
    900: "#1C1917",
  },
  semantic: {
    success: "#16A34A",
    warning: "#CA8A04",
    danger: "#DC2626",
    info: "#2563EB",
  },
} as const;

export const typography = {
  fontFamily: {
    serif: "var(--font-fraunces), ui-serif, Georgia, serif",
    sans: "var(--font-geist), ui-sans-serif, system-ui, sans-serif",
    mono: "var(--font-geist-mono), ui-monospace, monospace",
  },
  scale: {
    xs: "0.75rem",
    sm: "0.875rem",
    base: "1rem",
    lg: "1.125rem",
    xl: "1.5rem",
    "2xl": "2rem",
    "3xl": "3rem",
    "4xl": "4.5rem",
    "5xl": "6rem",
  },
  leading: {
    tight: 1.1,
    snug: 1.3,
    normal: 1.6,
    relaxed: 1.75,
  },
  tracking: {
    tighter: "-0.04em",
    tight: "-0.02em",
    normal: "0",
    wide: "0.02em",
    wider: "0.08em",
  },
  weight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
} as const;

export const radius = {
  none: "0",
  sm: "0.375rem",
  md: "0.625rem",
  lg: "0.875rem",
  xl: "1.125rem",
  "2xl": "1.5rem",
  "3xl": "2rem",
  full: "9999px",
} as const;

export const spacing = {
  0: "0",
  1: "0.25rem",
  2: "0.5rem",
  3: "0.75rem",
  4: "1rem",
  6: "1.5rem",
  8: "2rem",
  12: "3rem",
  16: "4rem",
  24: "6rem",
  32: "8rem",
} as const;

export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1400px",
} as const;

export const durations = {
  instant: 0,
  fast: 150,
  base: 250,
  slow: 400,
  slower: 600,
} as const;

export const easings = {
  standard: [0.22, 0.61, 0.36, 1] as const,
  emphasized: [0.32, 0.72, 0, 1] as const,
  entrance: [0, 0.55, 0.45, 1] as const,
  exit: [0.55, 0, 1, 0.45] as const,
} as const;

export type Brand = typeof brand;
export type Typography = typeof typography;
