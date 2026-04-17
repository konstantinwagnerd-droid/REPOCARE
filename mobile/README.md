# CareAI Mobile

Mobile Companion-App für CareAI — gebaut mit Expo SDK 52+, Expo Router, NativeWind und TypeScript strict.

## Was drin ist

- **Authentifizierung** — Mock-Login gegen `@careai.demo`, biometrisches Entsperren (Face ID / Touch ID / Fingerabdruck) via `expo-local-authentication`.
- **Dashboard** — Schicht-Überblick, Schnell-Aktionen, meine Bewohner:innen.
- **Bewohner-Liste + Detail** — Suche, Filter nach Station, horizontal scrollbare Tabs (Übersicht · SIS · Maßnahmen · Berichte · Vitalwerte · Medikation · Wunden).
- **Pflegebericht schreiben** — Auto-Save alle 5s in MMKV, SIS-Tag-Chips, Offline-Queue.
- **Spracheingabe** — Native Aufnahme (M4A/AAC 64kbps mono), `VoiceRecorder`-Komponente mit Wellen-Pulse, Transkription + Strukturierung über `/api/voice/transcribe` + `/api/voice/structure`.
- **Offline** — MMKV-Cache pro GET, Outbox-Queue für Mutations, automatischer Flush bei Online.
- **Push** — `expo-notifications`, Permissions-Flow, Events `incident` / `medication-due` / `handover-reminder` / `alert-critical`.
- **Notfall** — Roter FAB global sichtbar (auch im Login), Typ + Bewohner:in + Freitext → PDL-Notification (mocked).
- **Darkmode** — System-Default + manueller Switch.
- **Settings** — Konto, Benachrichtigungen, Nachtruhe, Datenschutz, Impressum, Logout, App-Version.

## Setup

```bash
cd mobile
npm install           # (einmalig lokal)
cp .env.example .env
npm run start         # Expo Dev Server
npm run ios           # iOS Simulator
npm run android       # Android Emulator
npm run web           # Web
```

Expo Go öffnen, QR-Code aus `npm run start` scannen.

## Demo-Login

| E-Mail | Passwort | Rolle |
|---|---|---|
| `demo@careai.demo` | `demo2026` | Pflege |
| `pdl@careai.demo` | `demo2026` | PDL |

Jede Adresse `@careai.demo` funktioniert. Mindest-PW 4 Zeichen.

## Scripts

| Script | Zweck |
|---|---|
| `npm run start` | Expo Dev Server |
| `npm run ios` / `android` / `web` | Platform starten |
| `npm run prebuild` | Native Projekte generieren (ios/ + android/) |
| `npm run typecheck` | TypeScript strict check |
| `npm run test` | Jest Unit-Tests |

## Release (EAS)

```bash
eas login
eas build --profile preview --platform all   # TestFlight / Internal Testing
eas build --profile production --platform all
eas submit --platform ios
eas submit --platform android
```

EAS-Projekt-ID in `app.json → extra.eas.projectId` hinterlegen.

## Figma

Brand-Tokens stimmen 1:1 mit `/docs/DESIGN-SYSTEM.md` der Web-App überein. Figma-Datei: *(Link einfügen)*.

## Architektur-Highlights

- **`lib/api.ts`** — HTTP-Client mit Token-Refresh, Cache-Fallback, Queue-Integration, Mock-Modus.
- **`lib/offline-queue.ts`** — Outbox-Pattern, Retry-Zähler, sequenzielles Flush.
- **`lib/auth.ts`** — SecureStore für Token, 24h Auto-Logout, Zustand-Store.
- **`lib/voice.ts`** — expo-av Recorder-Klasse + Transkript/Structure-Client.
- **`lib/biometric.ts`** — Face ID / Touch ID / Iris mit Typen-Erkennung.
- **`lib/theme.ts`** — Brand-Tokens (Petrol-Teal + Warm Orange) für RN.

## Quality Bar

- TypeScript strict (`noUncheckedIndexedAccess` an)
- Alle UI-Strings auf Deutsch
- Min. 48dp Touch-Targets
- VoiceOver/TalkBack-Labels auf allen interaktiven Elementen
- Keine Platzhalter oder TODOs
- Expo Prebuild-kompatibel
