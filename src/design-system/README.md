# CareAI Design-System

**Brand:** Petrol-Teal + Warm Orange, Fraunces (Serif) + Geist (Sans).
**Ziel:** Konsistenz ohne Verwaltungsaufwand — ein Ort fuer Tokens, wiederverwendbare Patterns, Illustrationen.

## Struktur

```
src/design-system/
├── tokens.ts              Brand, Typography, Radius, Spacing, Durations, Easings
├── motion.ts              Framer-Motion-Presets (fadeIn, stagger, spring, ...)
├── gradients.ts           Mesh, Linear, Radial, animierte Gradients
├── shadows.ts             Elevation z1–z5 + Color-Shadows
├── illustrations/index.tsx   12 SVG-Illustrations (inline React)
└── patterns/
    ├── index.tsx          StatCard, QuoteCard, TimelineItem, MetricTile, SectionHeader
    └── Skeletons.tsx      Loading Skeletons + EmptyState
```

## Tokens verwenden

```ts
import { brand, typography, radius } from "@/design-system/tokens";

<div style={{ color: brand.primary[700], fontFamily: typography.fontFamily.serif }}>...</div>
```

Wenn moeglich: Tailwind-Klassen bevorzugen (`text-primary-700`, `font-serif`). Tokens direkt importieren nur fuer berechnete Styles (z. B. dynamische Brand-Farbe pro Tenant).

## Motion-Presets

Alle respektieren `prefers-reduced-motion` automatisch (Framer Motion-Standard + Provider).

```tsx
import { motion } from "framer-motion";
import { fadeInUp, staggerChildren, staggerItem } from "@/design-system/motion";

<motion.div {...fadeInUp}>...</motion.div>

<motion.ul variants={staggerChildren} initial="initial" animate="animate">
  {items.map((i) => <motion.li key={i} variants={staggerItem}>...</motion.li>)}
</motion.ul>
```

## Illustrationen

12 markante, 2-farbige SVG-Illustrationen.

```tsx
import { PflegeTeam, SpracheingabeHero } from "@/design-system/illustrations";

<PflegeTeam className="h-64 w-64" />
```

Alle nutzen `currentColor` + Tailwind-Klassen — passen sich Dark-Mode automatisch an.

## Patterns

```tsx
import { StatCard, QuoteCard, SectionHeader, TimelineItem } from "@/design-system/patterns";
import { SkeletonDashboardCard, EmptyState } from "@/design-system/patterns/Skeletons";
```

## Regeln

- Neue Brand-Farben → nur hier. Niemals hardcoded in Komponenten.
- Neue Pattern? Zuerst pruefen ob bestehendes reicht.
- A11y: alle Illustrationen haben `title` oder sind dekorativ (role=presentation).
- Dark Mode: Klassen-basiert via `dark:` — Tokens bleiben identisch.
