# CareAI Design-System

Siehe auch: `src/design-system/README.md`.

## Wo alles liegt

- **Tokens** (Farben, Typo, Radius, Spacing): `src/design-system/tokens.ts`
- **Motion** (Framer-Presets): `src/design-system/motion.ts`
- **Gradients**: `src/design-system/gradients.ts`
- **Shadows** (Elevation z1–z5): `src/design-system/shadows.ts`
- **Illustrations** (12 SVG-Reacts): `src/design-system/illustrations/index.tsx`
- **Patterns** (StatCard, QuoteCard, TimelineItem, MetricTile, SectionHeader): `src/design-system/patterns/index.tsx`
- **Skeletons + EmptyState**: `src/design-system/patterns/Skeletons.tsx`

## Farbpalette

Primary (Petrol-Teal) 50–900. Accent (Warm Orange) 50–900. Neutral (Stone warm) 50–900.
Tailwind-Aliases: `text-primary-700`, `bg-accent-500`, etc. Raw Werte in `tokens.ts`.

## Typografie

- **Serif (Headlines):** Fraunces — `font-serif`
- **Sans (Body):** Geist — `font-sans`
- **Mono:** Geist Mono — `font-mono`

Skala: `text-xs (12)` bis `text-4xl (72)`. Leadings: `tight (1.1)`, `snug (1.3)`, `normal (1.6)`.

## Illustrationen

Alle 12 SVGs: 2-farbig (Petrol + Orange), organisch, `currentColor`-basiert:
`PflegeTeam, Dokumentation, SpracheingabeHero, Sicherheit, EuRegion, Zeitersparnis, HumanInTheLoop, Notfall, Angehoerige, Integration, Qualitaet, Barrierefreiheit`.

Dark-Mode: automatisch durch Tailwind `dark:*` in der Wrapper-Klasse.

## Motion

- Respektiert `prefers-reduced-motion` (Framer-Default)
- Presets: `fadeIn, fadeInUp, slideInLeft, slideInRight, scaleIn, bounce, pulse, staggerChildren, staggerItem, drawPath, spring`

## Patterns

```tsx
import { StatCard, QuoteCard, SectionHeader, TimelineItem } from "@/design-system/patterns";
import { SkeletonDashboardCard, EmptyState, SkeletonList } from "@/design-system/patterns/Skeletons";
```

## Shadow-Skala

- `z1`: subtle card
- `z2`: default card
- `z3`: hovered card
- `z4`: modal
- `z5`: popover / dialog

## Konventionen

- **Farben neu?** → `tokens.ts` + Tailwind-Config ergaenzen.
- **Gradients neu?** → `gradients.ts`, nicht im Komponenten-Code.
- **Schatten neu?** → `shadows.ts`.
- **A11y:** jede Illustration hat title/aria; decorative SVGs mit `role="presentation"`.
- **Dark Mode:** Class-basiert. Tokens sind Tenant-unabhaengig; Tenant-Theme ueberschreibt via CSS-Vars.
