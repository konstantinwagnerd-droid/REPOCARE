/**
 * CareAI Brand Tokens — React Native ready.
 * Quelle: docs/DESIGN-SYSTEM.md im Hauptprojekt.
 */

export const palette = {
  brand: {
    50: '#F0FDFA',
    100: '#CCFBF1',
    200: '#99F6E4',
    300: '#5EEAD4',
    400: '#2DD4BF',
    500: '#14B8A6',
    600: '#0D9488',
    700: '#0F766E', // Primärfarbe Petrol-Teal
    800: '#115E59',
    900: '#134E4A',
  },
  accent: {
    400: '#FB923C',
    500: '#F97316', // Warm Orange
    600: '#EA580C',
  },
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
    950: '#030712',
  },
  danger: '#DC2626',
  success: '#16A34A',
  warning: '#D97706',
  info: '#2563EB',
} as const;

export const lightTheme = {
  mode: 'light' as const,
  background: '#FFFFFF',
  surface: palette.gray[50],
  surfaceElevated: '#FFFFFF',
  border: palette.gray[200],
  text: palette.gray[900],
  textMuted: palette.gray[600],
  primary: palette.brand[700],
  primaryText: '#FFFFFF',
  accent: palette.accent[500],
  danger: palette.danger,
  success: palette.success,
  warning: palette.warning,
};

export const darkTheme = {
  mode: 'dark' as const,
  background: palette.gray[950],
  surface: palette.gray[900],
  surfaceElevated: palette.gray[800],
  border: palette.gray[700],
  text: palette.gray[50],
  textMuted: palette.gray[400],
  primary: palette.brand[400],
  primaryText: palette.gray[950],
  accent: palette.accent[400],
  danger: '#F87171',
  success: '#4ADE80',
  warning: '#FBBF24',
};

export type Theme = typeof lightTheme;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
};

export const radii = {
  button: 10,
  card: 14,
  pill: 999,
};

export const touchTarget = {
  min: 48, // mind. 48dp — Tablet/Mobil mit Handschuhen
  comfortable: 56,
};
