# CareAI Kiosk-Modus

Kiosk-Mode fuer Tablets an der Wand in Pflegeeinrichtungen. Kein Login, read-only, auto-refresh, branded.

## Zielgruppen & Use-Cases

| Modus | Zielgruppe | Aufstellung |
|---|---|---|
| Tagesuebersicht | Mitarbeitende, Bewohner | Flur, Pausenraum |
| Angehoerigen-Info | Angehoerige, Besucher | Eingangsbereich |
| Aktivitaeten | Bewohner | Gemeinschaftsraum |
| Medikamenten-Runde | Pflegekraft | Pflegekraft-Tablet auf Rollwagen |
| Notfall | alle | immer verfuegbar, permanent sichtbar |

## Routen

Alle unter Route-Group `(kiosk)` — keine Auth, kein App-Chrome, kein i18n-Overhead.

- `/kiosk` — Landing, PIN-Gate, Modus-Auswahl
- `/kiosk/tagesuebersicht` — Uhr + Aktivitaeten + Speiseplan + Geburtstage + News, Auto-Rotation 30s
- `/kiosk/angehoerige` — Events + QR-Code + Ansprechpartner
- `/kiosk/aktivitaeten` — Wochenplan mit Kacheln
- `/kiosk/medikamenten-runde` — MAR-Eintraege, nach Zimmer gruppiert, Abhaken via PIN
- `/kiosk/notfall` — Notrufnummern, Erste-Hilfe-Guides (Reanimation, Sturz, Ersticken, Schlaganfall), Evakuierungsplan-SVG

## Technik

- **Wake Lock API** — Bildschirm bleibt an (`navigator.wakeLock.request("screen")`).
- **Auto-Reload** alle 15 min — Fallback bei haengender UI.
- **Screensaver** nach 5 min Inaktivitaet — grosse Uhr, beruehren reaktiviert.
- **PIN-Schutz** — 4-stellig, default `1234`, ueberschreibbar via `NEXT_PUBLIC_KIOSK_PIN` oder pro Tenant in Settings.
- **Navigation-Schutz** — ESC/Backspace fordert PIN.
- **Offline-faehig** — Service-Worker-Cache der letzten 3 Tage (TODO: SW-Registrierung im naechsten Schritt).
- **Grossschrift** — min. 32px, hoher Kontrast, dunkler Hintergrund fuer Abend-Modus.
- **A11y** — ARIA-Labels, Fokusringe, Tastatur-bedienbar trotz Touch-first.

## Hardware-Empfehlungen

| Einsatz | Geraet | Halterung |
|---|---|---|
| Flur / Gemeinschaftsraum | Samsung Galaxy Tab A9+ 11" oder iPad 10. Gen | Wandhalterung mit Strom-Permanenz |
| Pflegekraft | iPad Mini 8.3" oder ruggedized Android | Rollwagen-Halterung |
| Eingangsbereich | 22" Touch-Display (IIYAMA ProLite) | Standfuss oder Wand |

Alle Geraete: Kiosk-App (Android: Fully Kiosk Browser, iOS: Managed Device Guided Access), Dauer-Strom,
WLAN mit priorisiertem SSID.

## Deployment

- Einrichtung legt in Settings -> Kiosk 4-stelligen PIN fest.
- Tablet oeffnet `https://[tenant].careai.app/kiosk` im Kiosk-Browser.
- Ein PIN entsperrt — danach waehlt der Aufsteller den gewuenschten Modus.
- Branding (Logo, Primaerfarbe) kommt aus Tenant-Config.

## Roadmap

- Service-Worker + IndexedDB-Cache fuer echte Offline-Faehigkeit
- Tenant-Konfigurierbare PINs pro Modus
- Screensaver mit rotierenden Einrichtungs-Fotos
- Touch-Gesten-Navigation (Swipe zwischen Panels)
