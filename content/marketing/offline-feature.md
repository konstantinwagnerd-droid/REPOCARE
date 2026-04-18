# Ja, CareAI funktioniert auch bei schlechtem Heim-WLAN.

**Für Pflegedienstleitung, IT-Leitung und Einrichtungsleitung.**

Pflegeheime haben oft nur stellenweise WLAN. Flur? Geht. Bewohner-Zimmer 23 im
Nordflügel? Drei Balken weniger. Im Keller beim Wäschelager? Null. Unsere
Antwort: **CareAI arbeitet offline weiter und synchronisiert automatisch**,
sobald wieder Verbindung da ist. Keine verlorene Doku. Kein „Moment, ich tippe
das später nochmal ein".

## Was geht offline?

Alle **sechs dokumentationskritischen Aktionen**:

1. **Pflegebericht schreiben** — Text wird während dem Tippen alle 2 s als
   Draft gesichert. Kein Datenverlust beim Reload.
2. **Maßnahme als „erledigt" markieren** — Ein Klick, lokal vorgemerkt.
3. **Vital-Werte eintragen** — Blutdruck, Puls, Temperatur, SpO₂.
4. **Medikament als „verabreicht" bestätigen** — MDK-kritisch, niemals verloren.
5. **Wund-Observation dokumentieren** — Stadium, Größe in cm², Exsudat, Notizen.
6. **Incident / Sturz melden** — Sofort lokal gespeichert, Severity + Ort.

## Was synchronisiert wann?

| Trigger | Was passiert |
|---|---|
| Gerät geht online (`online`-Event) | Alle gequeuten Mutationen werden in einem Batch an `/api/sync` geschickt. |
| Alle 10 s bei aktiver Verbindung | Automatischer Re-Try für noch nicht durchgelaufene Einträge. |
| Bei Fehler | Exponentielles Backoff: 1 s → 5 s → 25 s → 125 s, max. 10 Versuche. |
| Konflikt (Server hat neuere Version) | Dialog erscheint: **Meine Version behalten** / **Server übernehmen** / **Kollaborativ mergen**. |

Die Pflegekraft merkt davon nichts Störendes — oben am Bildschirm erscheint
nur ein kleiner Balken: „**3 Änderungen werden synchronisiert**".

## DSGVO & Datenschutz

- Offline-Daten liegen ausschließlich **lokal auf dem Endgerät** in der
  Browser-eigenen IndexedDB. Kein Dritt-Server ist involviert.
- Nach erfolgreichem Sync werden Drafts automatisch gelöscht.
- Bei Logout wird die komplette lokale Datenbank **geleert**.
- **Maximale Vorhaltedauer ungesynchter Daten: 7 Tage**. Danach erhält der
  Benutzer eine Warnung mit Aufforderung zur manuellen Synchronisation.
- Die lokale IndexedDB ist browser-seitig durch das Tenant-Cookie geschützt;
  bei Multi-User-Geräten (Tablet im Stützpunkt) empfehlen wir die
  Kiosk-Mode-Variante mit automatischer Session-Rotation.

## Was wir nicht offline anbieten (und warum)

- **Voice-Agent** und **Live-Transkription** — benötigen Echtzeit-Audioprocessing.
- **PDF-Exporte** und **Abrechnung** — nutzen serverseitige Templates.
- **Telemedizin-Konferenz** — WebRTC benötigt Netzwerk.

## Für die IT-Leitung: Technisch auf einen Blick

- **PWA** mit Service Worker v2 (CacheFirst für Assets, NetworkFirst für HTML,
  StaleWhileRevalidate für GET-APIs).
- **IndexedDB** v2 mit Zod-Schema-Validierung, In-Memory-Fallback für
  Private-Mode.
- **Batch-Sync-Endpunkt** `/api/sync` mit RBAC, Tenant-Isolation und Audit-Log
  pro Mutation.
- **Konflikt-Detection** via `baseVersion` ↔ Server-Version.
- **Keine externen Dependencies** für das Offline-Layer — 100 % im selben
  Datenkreis wie der Rest der App.

---

**Ready for POC?** Wir liefern Ihnen binnen einer Woche eine Pilot-Instanz mit
aktiviertem Offline-Modus und begleiten die erste Schicht live per Remote-Support.
Kontakt: ki@gvs.at · [repocare.vercel.app](https://repocare.vercel.app)
