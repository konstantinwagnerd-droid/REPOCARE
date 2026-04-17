# Knowledge Graph

## Zweck
Ein Property-Graph, der die unsichtbaren Beziehungen in einer Pflege­einrichtung
sichtbar macht: Bezugspflege, Angehörige, Medikationen, Wechselwirkungen,
Diagnosen, Maßnahmen, Expertenstandards, QIs, Zimmer-Cluster, Schichten.

## Zonen
- `src/lib/knowledge-graph/` — reine Domänenlogik
- `src/app/admin/knowledge-graph/**` — interaktive Admin-UI
- `src/app/api/knowledge-graph/**` — REST-API

## Node-Typen
| Typ | Bedeutung |
|-----|----------|
| `resident` | Bewohner:in |
| `staff` | Pflegekraft / PDL |
| `family` | Angehörige:r |
| `medication` | Arzneimittel (inkl. ATC) |
| `diagnosis` | ICD-10 Diagnose |
| `measure` | Pflege-Maßnahme |
| `expert-standard` | DNQP-Expertenstandard |
| `quality-indicator` | Qualitätsindikator (QI) |
| `room` | Zimmer |
| `shift` | Schicht-Dienstplan |

## Edge-Typen
| Typ | Domäne → Bereich | Bedeutung |
|-----|------------------|-----------|
| `bezugspflege` | staff → resident | primäre Bezugspflege |
| `angehoeriger-von` | family → resident | Angehörige:r von |
| `nimmt-medikament` | resident → medication | aktuelle Dauermedikation |
| `hat-diagnose` | resident → diagnosis | aktive Diagnose |
| `interagiert-mit` | medication → medication | Wechselwirkung (mild/mittel/schwer) |
| `adressiert` | measure → diagnosis | Maßnahme wirkt auf Diagnose |
| `gehoert-zu` | measure → expert-standard | Standard, zu dem die Maßnahme gehört |
| `misst` | quality-indicator → expert-standard | QI misst diesen Standard |
| `wohnt-in` | resident → room | Zimmer-Zuordnung |
| `arbeitet-in-schicht` | staff → shift | Dienstplan-Zuordnung |

## Architektur

```
   ┌────────────────────┐
   │  In-Memory Stores  │  (residents, staff, meds, diagnoses ...)
   └────────┬───────────┘
            │
            ▼
   ┌────────────────────┐
   │   builder.ts       │  deterministisch, SEED-basiert
   └────────┬───────────┘
            │ Graph
            ▼
   ┌────────────────────┐     ┌──────────────────┐
   │   query.ts         │◄────┤   insights.ts    │  10 vordefinierte
   │  (traverse, neigh) │     │   (run → result) │  Analysen
   └────────┬───────────┘     └────────┬─────────┘
            │                          │
            ▼                          ▼
   ┌────────────────────┐     ┌──────────────────┐
   │   viz.ts           │     │  API /insights   │
   │   force-directed   │     └──────────────────┘
   │   SVG-Renderer     │
   └────────────────────┘
```

## Insights (10)
1. **Gemeinsame Bezugspflege** — Welche Bewohner:innen teilen sich eine Pflegekraft?
2. **Medikamenten-Wechselwirkungen** — Wer hat ein interaktionskritisches Paar?
3. **Soziale Isolation** — Wer hat keine Bezugspflege und/oder keine Angehörigen?
4. **Medikations-Cluster** — Welche Medikamente werden oft zusammen verordnet?
5. **Diagnose → Maßnahme-Abdeckung** — Wo fehlen Maßnahmen?
6. **Expertenstandard-Umsetzung** — Standards mit Lücken (ohne Maßnahmen oder QIs)
7. **Polypharmazie-Screening** — Bewohner:innen mit ≥3 Dauermedikamenten
8. **Netzwerk-Zentralität** — Key-Person-Risiko bei Mitarbeiter:innen
9. **Zimmer-Cluster** — Sektor-weise Pflege-Dominanz
10. **Angehörigen-Reichweite** — Anbindungsgrad an die Familie

## API
| Methode | Pfad | Zweck |
|---------|------|-------|
| GET | `/api/knowledge-graph/graph?nodeTypes=resident,staff` | Graph-Daten (gefiltert) |
| GET | `/api/knowledge-graph/insights` | Liste aller Insights |
| GET | `/api/knowledge-graph/insights?id=isolated-residents` | Ergebnis einer Insight |
| GET | `/api/knowledge-graph/export` | Export als JSON |

## Visualisierung
`viz.ts` implementiert ein minimal-abhängiges force-directed Layout
(Coulomb-Abstoßung + Federn, 180 Iterationen). Der Renderer emittiert reines
SVG — das ermöglicht Server-Rendering **und** Print-Export ohne Client-Library.

Highlighting: wird eine Insight ausgeführt, markiert sie Nodes/Edges; die
Visualisierung dimmt alle übrigen auf 25% Opacity.

## Erweiterung
Weitere Insights: einfach ein Objekt in `INSIGHTS` ergänzen. Jede Insight
liefert `{ summary, rows, highlight? }` — keine weiteren UI-Änderungen nötig.

Weitere Node-/Edge-Typen: in `types.ts` erweitern, in `builder.ts` befüllen,
Farben in `viz.ts` ergänzen.
