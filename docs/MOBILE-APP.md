# Mobile App — Architektur

Die Mobile-App lebt in `mobile/` und ist komplett von der Next.js-Web-App isoliert — eigenes `package.json`, eigener Build, eigene Assets.

## Stack

| Layer | Technologie |
|---|---|
| Framework | Expo SDK 52, React Native 0.76, New Architecture aktiv |
| Routing | Expo Router v4 (file-based, typed routes) |
| UI | NativeWind 4 (Tailwind für RN), eigene `components/ui/` |
| State | Zustand (Auth, Theme) + TanStack Query (Server-Cache) |
| Forms | react-hook-form + zod |
| Storage | `react-native-mmkv` (sync, kein AsyncStorage-Overhead) |
| Secure | `expo-secure-store` für Tokens |
| Biometrie | `expo-local-authentication` |
| Audio | `expo-av` (M4A/AAC 64kbps mono — identisch Web) |
| Icons | `lucide-react-native` |
| Charts | eigene SVG-Komponente über `react-native-svg` (statt Victory Native — ~80KB ersparrt) |

## Datenfluss

```
UI Component
   │
   ├─ useQuery ── api.get(path, { cacheKey, mock })
   │                    │
   │                    ├─ fetch → ok → cache.set + return
   │                    ├─ fetch → fail → cache.get → return (stale)
   │                    └─ mock fallback (Demo ohne Backend)
   │
   └─ mutation ── api.post(path, body, { queueOnOffline })
                       │
                       ├─ fetch → ok → return
                       └─ fetch → fail → enqueue(outbox) → soft return

Netzwerk online → useOffline hook → flush(outbox) sequenziell
```

## Offline-Queue-Semantik

- **Storage:** separater MMKV-Store (`careai-queue`), damit Queue nicht mit Cache/Settings kollidiert.
- **Item-Format:** `{ id, method, path, body, createdAt, retries, lastError }`.
- **Flush:** sequenziell, stopp bei erstem Fehler; Retries werden im Item hochgezählt aber nie verworfen (User-kritische Daten — Pflegeberichte, Notfälle).
- **Dedup:** nicht automatisch — der Mutation-Caller muss idempotente Endpoints verwenden oder eigene Request-IDs senden.

## Security

| Bereich | Umsetzung |
|---|---|
| Tokens | `expo-secure-store` (Keychain iOS / Keystore Android). Niemals MMKV. |
| Session | 24h Lifetime, danach auto-clear und Redirect auf `/(auth)/login`. |
| Biometrie | nur lokal — `LocalAuthentication` liefert nur Boolean-Erfolg, keine Rohdaten. |
| Transport | TLS-only (Expo network-security defaults), `Authorization: Bearer` Header. |
| Mock-Modus | Nur im Dev-Flow aktiv — Prod-Build schaltet `mock` Defaults aus durch leere `extra.apiUrl`. |

## Push-Notifications

- Channels (Android): `alerts` mit `MAX` Importance.
- Handler zeigt Banner + Liste + Badge.
- Quiet Hours (22–06 Uhr default, konfigurierbar) — serverseitig zu respektieren: Client ignoriert lokal geplante Notifs während der Ruhezeit, Server drosselt entsprechend.

## Konflikte mit der Web-App

- **Null.** Alle Mobile-Dateien liegen ausschließlich unter `mobile/`.
- Eigene `node_modules/`, eigenes `package.json`, eigenes `tsconfig.json`.
- Shared nur logisch: API-Endpoints (gleiche Kontrakte), SIS-Themenfelder-Keys, Design-Tokens (konzeptuell — hart kopiert, nicht importiert).

## Build-Pipeline

- **Dev:** `expo start` — Expo Go kompatibel für schnelle Iteration.
- **Native Prebuild:** `npm run prebuild` generiert `ios/` und `android/` Ordner (gitignored) für native Anpassungen.
- **Staging:** `eas build --profile preview` → TestFlight / Internal Testing.
- **Prod:** `eas build --profile production` → App Store / Play Store. Auto-Increment von `buildNumber` / `versionCode`.

## Bekannte Einschränkungen

- Keine echte Net-Detection ohne `@react-native-community/netinfo` — wir pingen alle 15s `/api/health`. In Produktion NetInfo ergänzen.
- `victory-native` bewusst nicht installiert → komplexe Multi-Serien-Charts müssten nachgerüstet werden.
- `icon.png`/`splash.png` sind solide Brand-Farb-Platzhalter — finale Gestaltung aus dem SVG rendern (`assets/README.md`).
- Push-Events werden empfangen + angezeigt, aber der Deep-Link-Handler routet aktuell nur auf Basis von `event` — für `reportId`/`residentId` fehlt der Server-Side-Context im Mock.
