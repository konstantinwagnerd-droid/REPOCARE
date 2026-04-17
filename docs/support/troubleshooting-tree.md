# Troubleshooting-Tree — CareAI Support

Entscheidungsbäume für L1 & L2. Ziel: in 90 Sekunden von Symptom → konkrete Aktion.

---

## Baum 1: "App startet nicht / lädt ewig"

```
Start: App lädt ewig
│
├─ Web-App (Browser) oder Mobile-App?
│   │
│   ├─ Web-App
│   │   ├─ Welcher Browser? → Chrome/Firefox/Safari/Edge empfohlen (IE nicht supported)
│   │   ├─ Andere Tabs gehen? → ja → Cache leeren (Strg+Shift+R); nein → Netzwerk-Problem
│   │   └─ Cookies/LocalStorage blockiert? → Whitelist *.careai.at
│   │
│   └─ Mobile-App
│       ├─ App-Version aktuell? → Store prüfen, ggf. Update
│       ├─ OS-Version? → iOS ≥ 15, Android ≥ 10
│       ├─ Freier Speicher < 500 MB? → Cache-Löschen-Anleitung senden
│       └─ VPN aktiv? → temporär deaktivieren und testen
│
└─ Wenn weiterhin: Status-Page prüfen (status.careai.at)
    ├─ Incident sichtbar → Info an Kund:in, abwarten
    └─ Kein Incident → an L2: App-Logs + Netzwerk-Trace anfordern
```

**Diagnose-Kommandos L2:**
- Browser-DevTools: Network-Tab, Console-Errors → Screenshot an Eng.
- Mobile: Settings → CareAI → "Log senden" → Ticket-ID.

---

## Baum 2: "Spracheingabe funktioniert nicht"

```
Start: Voice-to-Text funktioniert nicht
│
├─ Mikrofon-Symbol aktiv (leuchtet rot/pulsiert)?
│   ├─ Nein → Berechtigungen prüfen (Settings → Apps → CareAI → Mikrofon)
│   └─ Ja, pulsiert
│       ├─ Text erscheint nicht
│       │   ├─ Internet aktiv? → status-Icon oben rechts
│       │   ├─ Offline-Modus aktiviert? → dann dauert's bis zu 15s
│       │   └─ Fallback: Testaufnahme in Einstellungen → "Mikro-Test"
│       │
│       └─ Text erscheint, aber falsch
│           ├─ Dialekt? → persönliches Wörterbuch befüllen
│           ├─ Fachbegriffe? → Kurz-Training via "Lernen"-Button
│           └─ Rauschen? → Headset empfehlen oder leiseren Raum
│
└─ Wenn weiterhin: L2 mit Sample-Audio (Kund:in kann per DSGVO-Einwilligung sample senden)
```

**Diagnose L2:**
- Audio-Sample durchspielen, mit Backend-Processing matchen.
- Model-Version prüfen (`/api/debug/voice-model`).

---

## Baum 3: "Daten synchronisieren nicht / fehlen nach Schicht"

```
Start: Daten fehlen
│
├─ Offline-Modus aktiv während Dokumentation?
│   ├─ Ja → Sync-Status prüfen (Wolken-Symbol oben)
│   │   ├─ Rot/durchgestrichen → manuell "Synchronisieren" tappen
│   │   └─ Gelb (in Arbeit) → 1 Min warten, wird aktuell hochgeladen
│   │
│   └─ Nein → war Gerät zwischendurch offline?
│       ├─ Ja → gleiche Diagnose wie oben
│       └─ Nein → weiter:
│
├─ Falscher Mandant/Einrichtung ausgewählt?
│   ├─ Check: oben links Einrichtungs-Dropdown
│   └─ Mehrere Einrichtungen? Eintrag evtl. im anderen
│
├─ Filter aktiv (Datum, Bewohner, Kategorie)?
│   └─ "Alle Filter zurücksetzen" ausprobieren
│
└─ Nichts greift → L2:
    - User-ID + Bewohner-ID + ungefährer Zeitstempel → Audit-Log-Check
    - "Niemals-verloren"-Policy: wir finden's, solange es geschrieben wurde.
```

**Diagnose L2:**
- SQL: `SELECT * FROM care_entries WHERE created_by = X AND created_at BETWEEN Y AND Z`
- Sync-Queue der Mobile-App abfragen (`/api/debug/sync-queue?user=X`).

---

## Baum 4: "Export/Druck funktioniert nicht"

```
Start: Export/PDF geht nicht
│
├─ Welches Format?
│   ├─ PDF → Pop-Up-Blocker? → Whitelist *.careai.at
│   ├─ CSV → Excel öffnet falsch? → CSV mit "Daten → Aus Text" importieren, UTF-8
│   └─ MD-Paket → dauert bis zu 2 Min bei 100+ Bewohnern, Fortschrittsbalken beachten
│
├─ Download startet, Datei leer?
│   ├─ Filter zu eng → Zeitraum erweitern
│   └─ Berechtigung eingeschränkt (z.B. Hilfskraft ohne Export-Recht) → PDL fragt admin
│
└─ "Export steckt bei 99%"
    └─ L2: Job-Queue prüfen, ggf. neu triggern.
```

---

## Baum 5: "Zugriffsverweigerung / Berechtigungs-Fehler"

```
Start: "Sie haben keine Berechtigung"
│
├─ Welche Aktion? (z.B. Bearbeiten, Löschen, Export)
│   │
│   ├─ Neuer:r User? → Rollen-Zuordnung in Benutzer-Verwaltung prüfen
│   │   (Admin / PDL / Pflegekraft / Hilfskraft / Azubi)
│   │
│   ├─ Funktionierte früher?
│   │   ├─ Rolle wurde geändert? → Admin fragen
│   │   └─ Wohnbereich gewechselt? → Zugriff evtl. nicht migriert
│   │
│   └─ Wirklich keine Berechtigung intendiert?
│       → Policy-Dokumentation an Kund:in senden: welche Rolle darf was
│
└─ Wenn Kund:in sicher ist, dass es ein Bug ist:
    → L2: SELECT auf rbac_audit, letzte 24h für User-ID
```

---

## Eskalations-Kriterien zu L2

Eskaliere an L2, wenn:
- Decision-Tree fertig, Problem nicht gelöst.
- Kund:in meldet ungewöhnliches Verhalten, das nicht zu dokumentierten Mustern passt.
- Verdacht auf Bug (reproduzierbar an mehreren Accounts).
- Performance-Problem (z.B. Seite > 10s Ladezeit).
- Datenverlust-Hinweis — IMMER sofort zu L2, unabhängig von anderen Kriterien.

## Eskalations-Kriterien zu L3

Eskaliere an L3, wenn:
- L2 bestätigt Bug und Code-Fix ist nötig.
- Sev1-Incident (Service down, DB-Probleme, Sicherheits-Risiko).
- Kein Workaround verfügbar und Impact > 1 Kunde.
