# Performance — CareAI

## Zielbudget (Marketing-Home, Mobile)

| Metrik              | Ziel     | Aktueller Stand   |
|---------------------|----------|-------------------|
| Lighthouse Perf     | ≥ 95     | s. `lighthouse.json` |
| LCP                 | < 1.5 s  | —                 |
| CLS                 | < 0.05   | —                 |
| TBT                 | < 100 ms | —                 |
| JS-Bundle (initial) | < 180 KB gz | —             |

## Implementierte Optimierungen

### Next.js-Konfiguration (`next.config.ts`)
- `experimental.optimizePackageImports`: `lucide-react`, `date-fns`, `recharts`, `framer-motion` → automatisches Tree-Shaking
- `images.formats: ['image/avif', 'image/webp']`
- `generateEtags: true`
- `poweredByHeader: false`
- `compress: true`
- `productionBrowserSourceMaps: false`
- `headers()`: `public, max-age=31536000, immutable` für `/_next/static/*`, `/fonts/*`, `/og-images/*`
- `headers()`: `no-store` für alle `/api/*` — keine Gefahr veralteter Responses

### Bundle-Analyse
```bash
npm run analyze   # ANALYZE=true next build
```
Gesteuert über `src/lib/performance/bundle-analyzer.config.ts`.

### Caching
- `src/lib/performance/cache.ts` — In-Memory mit Tag-Invalidation
- Für Next.js-RSC: `nextCache()` Wrapper um `unstable_cache`
- Beispiel:
  ```ts
  const residents = await nextCache(
    cacheKey("residents", { tenantId }),
    () => db.select().from(residents).where(...),
    { tags: [tenantId], revalidate: 60 }
  );
  ```

### Image-Loader
`src/lib/performance/image-loader.ts` — fügt `w` + `q` Query-Params hinzu
für CDN-seitiges On-the-fly-Resizing.

### Middleware
- Edge-Runtime für `src/middleware.ts` — niedriger Overhead
- Routen-Matcher schließt statische Assets aus (`_next/static`, `favicon`, …)

## Monitoring

Metrics-Endpoint (`/api/metrics`) sammelt:
- `api_latency_ms{route}` — Histogram
- `login_total{result}` — Counter
- `export_total{kind}` — Counter
- `voice_transcribe_ms` — Histogram

Integrierbar mit Prometheus + Grafana oder OpenTelemetry Collector.

## Performance-Regressionen vermeiden
1. Neue Abhängigkeiten: **vorher** Bundle-Impact prüfen (`npm run analyze`)
2. Grosse Libraries lazy laden (`next/dynamic` mit `ssr: false`)
3. Lighthouse-Smoke-Test (`npm run test:lighthouse`) lokal vor PR
4. `docs/lighthouse.json` committen, damit Regressionen sichtbar werden
