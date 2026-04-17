# CareAI Load-Testing

## Zielsetzung

Vor dem Rollout an ein reales Pflegeheim **nachweisen**, dass die App unter den erwarteten Lasten stabil bleibt.

## Last-Modell Pflegeheim

Typische Einrichtung:
- **120 Bewohner** (Zimmer-Kapazitaet)
- **30 Mitarbeiter** (3 Schichten a 10 Personen)
- **Peak:** Schichtwechsel morgens (06:00-06:30) - praktisch alle Mitarbeiter gleichzeitig aktiv
- **Normal:** 10-15 aktive User uebers Schicht-Intervall, 1 API-Call/User alle ~15s

### Ableitung: 200 VUs ausreichend

```
30 Mitarbeiter + Anmeldung fruehere Schicht + Admin + Angehoerigen-Portal
= ~40 echte User parallel bei Peak
x 5 Sicherheitspuffer (Request-Bursts beim Rendering, Prefetches)
= 200 VUs in k6
```

k6-VUs simulieren aktiv Anfragen (deutlich aggressiver als echte User, die auch lesen und pausieren). **200 VUs = ca. 500-800 RPS realer Gegenwert.**

## Szenarien

| Datei | VUs | Dauer | Ziel |
|---|---|---|---|
| `load-baseline.js` | 10 | 1min | Smoke-ish: laeuft App ueberhaupt? |
| `load-normal.js` | 50 | 5min | Realistic workflow: Login -> Dash -> 3 Bewohner -> Schreiben -> Logout |
| `load-peak.js` | 200 | 2min | Schichtwechsel-Burst |
| `load-api-stress.js` | 500 RPS | 2min | API-Hotpath gegen Lese-Endpoints |
| `load-voice.js` | 20 | 2min | Voice-Transkription-Endpoint |

## Thresholds (Quality Gates)

| Metrik | Grenze | Begruendung |
|---|---|---|
| `http_req_duration{type:read}` p95 | **< 500ms** | Pflegekraft wartet nicht >500ms auf Daten |
| `http_req_duration{type:write}` p95 | **< 1500ms** | Schreiboperationen duerfen DB-Roundtrip haben |
| `http_req_failed` rate | **< 0.1%** | Fehlerquote im Produktiv-Alltag |
| p99 unter Peak | < 2000ms | Kurze Spikes toleriert |

Thresholds sind in den k6-Scripts codiert. **Threshold-Fail = CI-Fail.**

## Ausfuehrung

### Installation k6
- **macOS:** `brew install k6`
- **Linux:** `sudo apt install k6` (nach Grafana-Apt-Repo-Setup)
- **Windows:** `winget install k6 --source winget`

### Einzeln
```bash
bash scripts/load/run-load.sh --scenario normal --base-url http://localhost:3000
```

### Alle
```bash
bash scripts/load/run-load.sh --scenario all --base-url https://stage.careai.health
```

### Mit Prometheus-Export
```bash
bash scripts/load/run-load.sh --scenario normal \
  --prometheus http://prom.internal:9090/api/v1/write
```

## Eigene Load-Tests schreiben

```js
import http from 'k6/http';
import { check, sleep, group } from 'k6';

const BASE = __ENV.BASE_URL || 'http://localhost:3000';

export const options = {
  vus: 10, duration: '30s',
  thresholds: { http_req_duration: ['p(95)<500'] },
};

export default function () {
  group('Mein-Feature', () => {
    const r = http.get(`${BASE}/mein-endpoint`);
    check(r, { '200': (x) => x.status === 200 });
  });
  sleep(1);
}
```

**Tipps:**
- Immer `group()` fuer Abschnitte - erleichtert Report-Lesen
- Immer `check()` + `threshold` fuer Fail-Bedingungen
- `tags: { type: 'read'|'write' }` fuer separate p95-Gates

## Interpretation

- **`http_req_duration` p95** = 95% der Requests schneller als X
- **`http_req_failed`** = Rate der !=2xx/3xx (in Smoke: <0.1%)
- **`http_req_blocked`** hoch = DNS- oder TCP-Handshake-Probleme (nicht App)
- **`http_req_waiting`** hoch = Server braucht lange zum Antworten = App/DB-Bottleneck
- **`vus_max`** erreicht Limit = k6 Ressource-Grenze

Reports liegen in `load-report/*-summary.json` und im k6-Terminal-Output.

## CI-Integration (optional)

`.github/workflows/nightly-load.yml` kann normal+peak naechtlich gegen Stage laufen lassen. Fail = Alert an Ops.
