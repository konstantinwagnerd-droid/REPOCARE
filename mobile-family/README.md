# CareAI Family

Begleit-App für Angehörige. Eigenes, fokussiertes Expo-Projekt, unabhängig vom `mobile/`-Projekt der Pflegekräfte.

## Stack
- Expo SDK 52, expo-router 4, React Native 0.76
- NativeWind, MMKV, expo-notifications, Zustand, React-Hook-Form, Zod

## Setup
```bash
cd mobile-family
npm install
npm start
```

## Features
- Magic-Link Login (E-Mail + 6-stelliger Code, deterministisch für Demo)
- Home: Wohlbefindens-Score, heutige Aktivitäten, Fotos (Consent-gesteuert)
- Nachrichten: Threads mit Pflegeteam
- Termine: Besuche planen, Video-Call anfragen
- Dokumente: Berichte mit Consent-Gate
- Einstellungen: Push-Opt-in, Privacy, Logout

## Push-Events
- `mood-up`, `mood-down`, `new-message`, `new-photo` via `scheduleDemoEvent()`.
