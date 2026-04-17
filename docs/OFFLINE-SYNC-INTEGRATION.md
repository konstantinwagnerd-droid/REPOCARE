# Offline-Sync — Integration

Dieses Dokument beschreibt, wie die Offline-Engine (`src/lib/offline-sync/`) mit dem neuen
Outbox-Endpoint (`/api/sync`) und dem Service Worker (`public/sw.js`) zusammenarbeitet.

## Architektur-Flow

```
 +-----------+     Write      +--------------------+
 | UI (PWA)  | -------------> | IndexedDB Outbox   |
 +-----------+                +---------+----------+
      |                                 |
      | online?  (navigator.onLine)     |
      v                                 |
 +-----------+   POST /api/sync   +-----v----------+
 | Sync-     | -----------------> | Next.js Route  |
 | Engine    | <----------------- | (Session+Audit)|
 +-----------+  {applied,         +-----+----------+
                 conflicts}             |
                                        v
                                 +----------------+
                                 | Audit-Log (DB) |
                                 +----------------+
```

1. **Client-Write**: UI schreibt Mutation in die IndexedDB-Outbox ueber `useOutbox()`.
2. **Online-Event**: `useOfflineState()` beobachtet `navigator.onLine` und triggert `flush()`.
3. **POST /api/sync**: Batch (≤ 100 Ops) wird an den Server geschickt.
4. **Server**: Session-Check -> pro Mutation ein Audit-Log-Eintrag -> Antwort `{applied, conflicts}`.
5. **Client**: entfernt `applied`-IDs aus der Outbox, markiert `conflicts` mit Retry / manueller Aufloesung.

## Service Worker

Die Datei `public/sw.js` stellt eine Basis-Offline-Shell bereit:

- **Static Assets** (`/_next/static/*`, Bilder, Fonts) — cache-first
- **HTML Navigation** — network-first mit Cache-Fallback
- **/api/*** — uebersprungen (Mutations laufen ueber die Outbox, nicht ueber SW-Caching)

Registrierung erfolgt beim Laden der App (falls noch nicht vorhanden, kann z. B. in einem
Client-Provider eingehaengt werden):

```ts
if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}
```

Version-Bump via `SW_VERSION`-Konstante in `public/sw.js` — beim Deployen erhoehen, dann
raeumt der `activate`-Handler alte Caches auf.

## OfflineBanner

`src/components/sample-data/OfflineBanner.tsx` ist ein Floating-Widget mit:

- Offline-Toast am oberen Rand
- Status-Indicator unten rechts (klickbar)
- Outbox-Sidebar mit Liste der pendenten Ops und manuellem Sync-Button

Der Banner ist in `src/app/app/layout.tsx` eingehaengt (nach `PrivacyBanner`).
Das Family-Layout kann ihn analog einbinden.

## Endpoint-Contract: `POST /api/sync`

### Request

```json
{
  "ops": [
    {
      "id": "01HX...",
      "resource": "berichte",
      "kind": "create",
      "payload": { "residentId": "...", "text": "..." },
      "baseVersion": "v17",
      "createdAt": "2026-04-17T10:00:00Z"
    }
  ]
}
```

- `ops[].resource` muss in der Whitelist sein: `berichte`, `vitalwerte`, `medikation`, `sis`, `handover`, `incidents`.
- Maximal `100` Ops pro Batch (413 bei Ueberschreitung).
- Session Pflicht (401 sonst).

### Response

```json
{
  "applied":   [{ "id": "01HX...", "status": "applied" }],
  "conflicts": [{ "id": "01HY...", "reason": "version-mismatch" }],
  "serverTime": "2026-04-17T10:00:01.123Z"
}
```

### Konflikt-Gruende

| reason                | Bedeutung                                                           |
|-----------------------|---------------------------------------------------------------------|
| `invalid-shape`       | id/resource/kind fehlt oder hat falschen Typ                        |
| `resource-not-allowed:<x>` | Ressource steht nicht in der Whitelist                         |
| `kind-invalid:<x>`    | kind ist nicht `create` \| `update` \| `delete`                     |
| `version-mismatch`    | baseVersion stimmt nicht mit Server-Version ueberein                |
| `audit-failed:<msg>`  | Audit-Schreibvorgang fehlgeschlagen                                 |

## Test-Szenarien

1. **Happy-Path** — 3 Create-Ops offline angelegt, Online-Event loest Flush aus, alle 3 landen
   im Audit-Log, Outbox ist leer.
2. **Batch-Limit** — 101 Ops im Flush. Client erhaelt 413 und muss chunked flushen.
3. **Konflikt-Simulation** — Payload enthaelt `__simulateConflict: true` → Response markiert Op als `version-mismatch`.
4. **Unbekannte Resource** — `resource: "unknown"` → Konflikt `resource-not-allowed:unknown`.
5. **Session abgelaufen** — 401 → Outbox behaelt alle Ops, Sync-Engine setzt auf `error`.

## Bekannte Einschraenkungen (Stand Wave 7)

- **Kein echter DB-Write**: Der Endpoint schreibt aktuell nur Audit-Eintraege. Domain-Tabellen
  werden in einer spaeteren Wave gemutet (Transaktion pro Resource + Versionscheck).
- **Keine 3-Way-Merge**: Konflikte werden als `version-mismatch` zurueckgegeben; die Client-Seite
  muss manuell aufloesen. Auto-Merge (z. B. fuer Freitext-Felder) steht aus.
- **SW nicht auto-registriert**: Die Registrierung muss von der App selbst angestossen werden
  (siehe Snippet oben). Kein automatischer Mount im Root-Layout, um die TABU-Zonen zu respektieren.
- **IndexedDB-Quota** wird nicht aktiv ueberwacht — bei > ~50 MB lokalen Daten kann der Browser
  Evictions ausloesen.

## CI

- Der Endpoint wird in `e2e/db-integration.spec.ts` nicht direkt geprueft (Session-gebunden);
  ein separater Contract-Test sollte im Unit-/Integration-Layer folgen.
- Smoke-Test via `curl http://localhost:3000/api/sync` (GET) liefert Endpoint-Metadaten.
