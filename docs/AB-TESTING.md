# A/B-Testing-Framework

## Zweck

Marketing-Team soll Text-, Layout- und CTA-Varianten ohne Dev-Einbindung testen können — mit statistischer Signifikanz als Entscheidungsgrundlage.

## Architektur

```
src/lib/ab-testing/
├── types.ts          Experiment, Variant, Assignment, Metric
├── assignment.ts     FNV-1a Hash-basierte deterministische Zuweisung
├── store.ts          In-Memory-Singleton (DB-Migration TODO)
├── tracker.ts        trackImpression, trackConversion
├── analyzer.ts       Chi-Quadrat + Z-Test, Wilson-Confidence-Interval
├── reporter.ts       Human-readable Report-Generator
└── Experiment.tsx    Client-Komponente für Variant-Rendering
```

## Traffic-Splitting

Zuordnung ist deterministisch basierend auf `FNV-1a(user_hash + experiment_name)`:

1. **Enrolment-Bucket**: `FNV-1a(user + ":enrol")` → entscheidet, ob User im Experiment ist (`trafficAllocation`).
2. **Variant-Bucket**: `FNV-1a(user + experiment)` → entscheidet innerhalb der Gewichte, welche Variante.

Dadurch: gleicher User → immer dieselbe Variante, ohne State-Speicherung.

## Pre-seeded Experimente

| Name | Varianten | Traffic | Min. Sample | Max. Dauer |
|------|-----------|---------|-------------|------------|
| `hero-headline` | 3 (Mehr Zeit / Pflegedoku in 3s / SIS-KI) | 100% | 500/Var | 28 Tage |
| `pricing-presentation` | 2 (Cards / Slider) | 100% | 400/Var | 21 Tage |
| `cta-copy` | 3 (Demo / Testen / Starten) | 100% | 600/Var | 14 Tage |

## Statistische Auswertung

- **Binary-Metriken**: Z-Test (2 Varianten) bzw. Chi-Quadrat (>2 Varianten)
- **95% Wilson Score Interval** für Conversion-Rate-Bereiche
- **Signifikanz**: p < 0.05 UND Mindest-Sample-Size erreicht
- **Normal-CDF** via Abramowitz-Stegun 26.2.17 Approximation
- **Chi-Quadrat-p-Wert** via Wilson-Hilferty-Approximation

## API

| Methode | Route | Zweck |
|---------|-------|-------|
| `GET` | `/api/ab-testing/assignment/[experiment]` | Variant-Zuordnung + Impression-Tracking |
| `POST` | `/api/ab-testing/conversion` | Conversion-Event-Tracking |
| `GET` | `/api/ab-testing/results/[experiment]` | Report (Admin only) |
| `POST` | `/api/ab-testing/winner` | Gewinner deklarieren (Admin only) |

## Client-Integration

```tsx
import { Experiment, trackExperimentConversion } from "@/lib/ab-testing/Experiment";

<Experiment
  name="hero-headline"
  variants={{
    v_a: <h1>Mehr Zeit für Menschen</h1>,
    v_b: <h1>Pflegedokumentation in 3 Sekunden</h1>,
    v_c: <h1>KI-gestützte SIS-Klassifikation</h1>,
  }}
  fallback={<h1>Mehr Zeit für Menschen</h1>}
/>

// Conversion-Event:
<Button onClick={() => trackExperimentConversion("hero-headline", "m_signup")}>
  Demo anfragen
</Button>
```

## User-Hash

- **Cookie `ab_uid`** (preferred): SameSite=Lax, Max-Age=1 Jahr. TODO: in Middleware setzen.
- **Fallback**: `x-forwarded-for + User-Agent` → für nicht-gecookte Besucher noch konsistent innerhalb Session.

## Admin-UI

- `/admin/ab-testing` — Liste aller Experimente mit Status und Links
- `/admin/ab-testing/[name]` — Detail-View mit Live-Metriken, CI, p-Wert, Empfehlung
- `/admin/ab-testing/new` — Experiment-Anlage (UI — Persistenz-Hook TBD in Wave 13)

## Limits & TODOs

- Persistenz: aktuell In-Memory, Restarts = Datenverlust. DB-Migration geplant.
- Continuous-Metriken: analyzer behandelt sie aktuell wie binary. Welch-T-Test TBD.
- Sample-Ratio-Mismatch (SRM) Detection TBD.
- Bayesian-Analyse optional.
