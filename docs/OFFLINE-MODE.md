# CareAI — Offline Mode

CareAI ist als **offline-first Progressive Web App** gebaut. Pflegekräfte
können alle dokumentationskritischen Aktionen ohne aktives Netzwerk durchführen.
Änderungen werden lokal in IndexedDB zwischengespeichert und automatisch
synchronisiert, sobald die Verbindung wiederhergestellt ist.

## Was funktioniert offline?

| Aktion | Offline | Hinweise |
|---|:---:|---|
| Pflegebericht schreiben (Text + Draft) | Ja | Auto-Save alle 2s in IndexedDB-Drafts |
| Maßnahme als „erledigt" markieren | Ja | Ein-Klick, wird gequeuet |
| Vital-Werte eintragen (RR, Puls, Temp., SpO₂) | Ja | Kein Rundungsverlust |
| Medikament als „verabreicht" bestätigen | Ja | MDK-kritisch — Garantie: niemals verloren |
| Wund-Observation (Stadium, Größe, Exsudat) | Ja | inkl. Freitext-Notizen |
| Incident / Sturz melden | Ja | Sofort gequeuet, mit Severity + Ort |
| Lesen: letzte 7 Tage Berichte | Ja | Stale-While-Revalidate |
| Lesen: aktuelle Bewohner-Stammdaten | Ja | Precache beim Login |
| Exporte / Abrechnung | Nein | nur online |
| Voice-Agent Live-Transkription | Nein | benötigt Server-Verbindung |

## Architektur

```
UI Form
   │ useOfflineMutation()
   ▼
if (navigator.onLine) ───► fetch() ──► 2xx ─► done
         │                      └─ Fehler ─► enqueueMutation()
         └─ offline ─► enqueueMutation()
                          │
                          ▼
                    IndexedDB.outbox
                          │
           window online event / periodic retry
                          │
                          ▼
                     flushQueue()  ──POST──►  /api/sync  (Batch)
                          │
                          ├─ 2xx applied  ─► outboxDelete
                          ├─ 409 conflict ─► emitConflict → <ConflictDialog>
                          └─ error        ─► exp. backoff (1/5/25/125…s, max 10)
```

Dateien:

- `public/sw.js` — Service Worker mit 3 Strategien (CacheFirst für Assets,
  NetworkFirst für HTML, StaleWhileRevalidate für GET /api/*).
- `src/lib/offline/db.ts` — IndexedDB-Wrapper mit Zod-Schemas und In-Memory-Fallback.
- `src/lib/offline/sync.ts` — `enqueueMutation`, `flushQueue`, Exp. Backoff.
- `src/lib/offline/conflicts.ts` — Version-Check + Resolution (keep-mine / take-server / merge-both).
- `src/lib/offline/use-offline.ts` — React Hooks (`useOffline`, `useOfflineMutation`).
- `src/components/offline/OfflineBanner.tsx` — Sticky top banner mit 3 Zuständen.
- `src/components/offline/ConflictDialog.tsx` — globaler Merge-Dialog.
- `src/components/offline/InstallPrompt.tsx` — PWA-Install-Prompt.
- `src/app/api/sync/route.ts` — Server-Endpunkt (Batch, RBAC, Audit-Log).

## Sync-Verhalten

- **Offline-Erkennung**: `navigator.onLine` + `online`/`offline`-Events.
- **Auto-Flush**: beim `online`-Event sowie periodisch alle 10 s, solange noch
  Einträge in der Queue sind und `navigator.onLine === true`.
- **Konflikt-Resolution**: Last-Write-Wins standardmäßig (Payload gewinnt).
  Bei HTTP 409 wird ein Dialog angezeigt; merge-both fügt ein `_conflictual: true`
  Flag an, das in der UI als Warnung erscheint.
- **Retries**: exponentiell (1, 5, 25, 125, 625, 3125 s), max. 10 Versuche.
  Danach Status `failed` mit Toast-Benachrichtigung und manueller Retry-Button.

## DSGVO / Sicherheit

- IndexedDB-Daten werden nur lokal auf dem Endgerät gespeichert.
- Beim Logout wird der gesamte `careai-offline`-DB gelöscht
  (`caches` + `indexedDB.deleteDatabase`).
- Drafts werden nach erfolgreichem Sync automatisch entfernt.
- Maximale Aufbewahrung ungesynchter Daten: **7 Tage**. Danach Warnung an den
  Benutzer („Bitte sofort synchronisieren").
- Kein Klartext-Logging von Pflegeinhalten in DevTools.

## Bekannte Grenzen

- **iOS Safari**: Background-Sync-API nicht unterstützt; Sync startet erst,
  wenn die PWA wieder geöffnet wird. Der `online`-Event reicht aber in 99 % der
  Fälle aus.
- **Private-Mode**: IndexedDB kann leer sein beim App-Restart. Fallback auf
  In-Memory-Map funktioniert nur solange der Tab offen bleibt.
- **Konflikt-Merge** ist heuristisch (Feld-Union) — bei komplexen Formularen
  (z. B. SIS-Gesamteintrag) empfehlen wir „Meine Version behalten".
- **Voice-Agent**, **Live-Tranksription** und **PDF-Export** benötigen aktives
  Netzwerk und sind explizit nicht offline verfügbar.

## Tests

- `e2e/offline-mutation.spec.ts` — Chromium mit `context.setOffline(true)`,
  Bericht speichern → Outbox-Count prüfen → reconnect → drain.
- `e2e/offline-conflict.spec.ts` — Dialog-Rendering und Tastatur-Navigation
  (keep-mine / take-server / merge-both).

Ausführen:

```bash
npm run test:e2e -- offline-mutation.spec.ts offline-conflict.spec.ts
```

## Rollout-Checkliste

- [ ] Service Worker deployt (`/sw.js` erreichbar, v2-Version in Response-Header).
- [ ] Manifest wird beim PWA-Test (Chrome DevTools → Lighthouse → PWA) grün.
- [ ] IndexedDB-Schema v2 angelegt (auto-migration beim ersten Öffnen).
- [ ] Monitoring: Anzahl gequeuter Mutationen pro Tenant in Dex-Dashboard.
- [ ] Support-Runbook bei `failed`-Zustand: `retryFailed()` manuell auslösen.
