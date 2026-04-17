# Internationalisation

CareAI ships with full DACH (de-DE) marketing and product surfaces by default. English (`/en`) is shipped as a sub-path locale for international prospects.

## Current coverage

| Locale | Path | Status |
|--------|------|--------|
| German | `/` (root) | Primary — all surfaces |
| English | `/en` | Marketing only (Home, Trust, Integrations, ROI, Case Studies, Blog, About, Careers, Contact) |

## Strategy

- **Sub-path over sub-domain.** `careai.at/en` instead of `en.careai.at` — one domain for SEO equity, simpler cert/DNS.
- **Shared components.** Marketing layout, Nav, Footer are reused. Locale-specific copy lives in the page files under `src/app/(marketing)/en/**`.
- **No ICU / i18n runtime yet.** Translations are authored directly per route because marketing content is highly brand-tuned and rarely regenerates. When the product surfaces are internationalised (post Q3 2026), we will migrate to `next-intl`.

## URL map (DE ↔ EN)

| German | English |
|--------|---------|
| `/` | `/en` |
| `/trust` | `/en/trust` |
| `/integrations` | `/en/integrations` |
| `/roi-rechner` | `/en/roi-calculator` |
| `/case-studies` | `/en/case-studies` |
| `/blog` | `/en/blog` |
| `/blog/[slug]` | `/en/blog/[slug]` (separate content corpus under `content/blog-en/`) |
| `/ueber-uns` | `/en/about` |
| `/karriere` | `/en/careers` |
| `/kontakt` | `/en/contact` |

## hreflang

Each page exports `metadata.alternates.languages` mapping `de-DE` and `en-US` counterparts plus `x-default` pointing at the German root. Next.js renders `<link rel="alternate" hreflang="..." />` automatically from this.

Example:

```ts
export const metadata = {
  alternates: {
    canonical: "/en/trust",
    languages: { "de-DE": "/trust", "en-US": "/en/trust" },
  },
};
```

## Language switcher

The marketing nav includes a DE/EN toggle. The toggle swaps the URL segment (`/kontakt` ↔ `/en/contact`) per the map above. Unknown routes fall back to the language root (`/` or `/en`).

## Adding a new locale (e.g. French)

1. Create `src/app/(marketing)/fr/**` mirroring the `en/**` tree.
2. Author content under `content/blog-fr/`.
3. Extend the nav language switcher and URL map.
4. Add `fr-FR` to every `alternates.languages` on shared pages.
5. Generate `sitemap.xml` entries via `src/app/sitemap.ts` (already respects alternates).
6. Update `docs/INTERNATIONAL.md` with the new column.

## Content authoring rules

- Keep English tone direct, short sentences, no German idioms literally translated.
- Use `Caregiver` not `Nurse` — reflects Pflegekraft scope (includes DGKP, PFA, DGKP-S).
- Use EUR, metric units, DD Month YYYY in English.
- CTAs: "Book a demo", "Open live demo", "Talk to sales".
- Brand names stay German: `SIS`, `Maßnahmenplan` may be glossed but retain the German term where it is a regulatory artefact.

## SEO considerations

- Every `/en/*` page sets `<html lang="en">` via the `EnLayout` wrapper (div with `lang`).
- `metadata.openGraph.locale` should be set where OG tags are shipped.
- `robots.ts` / `sitemap.ts` emit both language variants.
- Canonical URLs avoid trailing slashes consistently.

## Testing

- `npm run build` validates all routes render for both locales.
- A11y audit covers both language trees (`src/app/**`).
- Manual smoke: toggle language on each top-level page; confirm counterpart route exists.
