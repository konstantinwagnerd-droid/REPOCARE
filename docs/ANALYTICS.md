# Privacy-First Analytics

Plausible-ähnliches Measurement. Implementiert unter `src/lib/analytics/`.

## Was wir messen (Allowlist)
- `page.view` – normalisierter URL-Pfad (ohne IDs, ohne Query).
- `feature.voice.transcribe`, `feature.report.created`, `feature.export.generated`, `feature.cmd-k.opened`, `feature.notification.read`.
- `perf.web-vital` – LCP / FCP über `PerformanceObserver`.
- `error` – nur Typ-Klassifikation (keine Stack-Traces).

## Erlaubte Dimensionen
`role`, `facility`, `page`, `feature`, `metric`, `errorType`, `vitalName`. Freitext oder Custom-IDs werden verworfen.

## Was wir NICHT erfassen
- Keine IP-Adressen (werden vor Verarbeitung verworfen).
- Keine Cookies, kein `localStorage` für Tracking.
- Keine persistente User-ID. User-Agent wird pro Tag mit Secret-Salt zu einem 16-Zeichen-Hash → keine Cross-Day-Identifikation.
- Keine Query-Parameter, keine Hashes, keine Such-Inputs.
- Keine Payload-Inhalte (z. B. kein Report-Text, keine Patientendaten).

## DSGVO-Bewertung
- Art. 4 Nr. 1: Keine Verarbeitung personenbezogener Daten, da weder identifiziert noch identifizierbar (siehe EG 26).
- Art. 5 Abs. 1 lit. c: Datenminimierung durch Allowlist erzwungen.
- Art. 25: Privacy-by-Design (IP-Anonymisierung auf Eingang, tägliche Salt-Rotation).
- Keine Consent-Banner-Pflicht (§ 25 TTDSG / ePrivacy), da keine Endgeräte-Zustände gespeichert werden. Wir zeigen dennoch einen einmaligen Transparenz-Hinweis.

## Opt-Out
1. `navigator.doNotTrack === "1"` → Events werden clientseitig nicht gesendet und serverseitig verworfen.
2. Manueller Opt-Out über den Privacy-Banner → `localStorage["careai:analytics:opt-out"] = "1"`.

## Retention
In-Memory-Rollups, 90 Tage rolling. Nur aggregierte Zahlen, keine Rohdaten.

## API
- `POST /api/analytics/event` — Anonymous Ingest (rate-limited: 60/Min pro UA-Hash).
- `GET /api/analytics/summary` — Admin only, KPIs + Top-Listen.
- `GET /api/analytics/export?format=csv|json` — Admin only, CSV/JSON der Aggregate.

## Page
- `/admin/analytics` — KPIs, Trend-Charts, Top-Seiten, Top-Features, LCP-Ranking, Fehler-Typen.
