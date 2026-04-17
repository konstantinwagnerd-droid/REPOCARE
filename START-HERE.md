# 🚀 CareAI — START HERE

Du öffnest das Projekt gerade in VS Code oder Cursor. Alles ist vorkonfiguriert. So kommst du in 5 Minuten auf eine laufende Demo.

## Schnellstart (3 Schritte)

### Schritt 1 — Extensions ✅
VS Code fragt beim Öffnen: **"Diesem Workspace empfohlene Erweiterungen installieren?"** → **Ja**.
(Falls kein Pop-up: `Strg+Shift+P` → `Extensions: Show Recommended Extensions` → alle mit "Install Workspace Recommended")

### Schritt 2 — Setup mit einem Tastendruck
`Strg + Shift + B` → **`CareAI · Komplett-Setup`** auswählen
→ macht automatisch: `npm install` → `db:push` → `db:seed` → `dev`
→ am Ende läuft http://localhost:3000

### Schritt 3 — Einloggen
Im Browser → `/login`:
- **Admin:** `admin@careai.demo` / `Demo2026!`
- **PDL:** `pdl@careai.demo` / `Demo2026!`
- **Pflegekraft:** `pflege@careai.demo` / `Demo2026!`
- **Angehörige:** `familie@careai.demo` / `Demo2026!`

---

## Die wichtigsten Tastenkürzel (nach Setup)

| Aktion | Kürzel |
|---|---|
| Command Palette in App | `Strg + K` (in der App, nicht in VS Code) |
| VS Code Command Palette | `Strg + Shift + P` |
| Task starten | `Strg + Shift + P` → "Run Task" |
| Build starten | `Strg + Shift + B` |
| Debug Full-Stack | `F5` → "Next.js: full stack" |
| Suchen | `Strg + Shift + F` |
| Zur Datei springen | `Strg + P` |
| Zur Symbol | `Strg + Shift + O` |
| Terminal öffnen | `Strg + ö` (DE Layout) / `Strg + J` |

## App-interne Tastenkürzel (im Browser, nach Login)

| Aktion | Kürzel |
|---|---|
| Command Palette | `Strg + K` |
| Zu Dashboard | `g` dann `d` |
| Zu Bewohner-Liste | `g` dann `b` |
| Neuer Pflegebericht | `n` |
| Suche fokussieren | `/` |
| Shortcut-Hilfe | `?` |

---

## Was du dir in der Demo zeigen lassen kannst

### Als Pflegekraft (`pflege@careai.demo`)
1. **Dashboard** — Heute-Übersicht, kritische Werte, offene Aufgaben
2. **Bewohner** → auf eine Person klicken → **8 Tabs**:
   - Übersicht mit Stammdaten
   - SIS (6 Themenfelder + Risikomatrix)
   - Maßnahmenplan
   - Tagesberichte
   - Vitalwerte (mit Charts)
   - Medikation + MAR-Tabelle
   - Wunddoku
   - Risiko-Scores
3. **Spracheingabe** (`/app/voice`) — Mikrofon drücken → Mock-Transkript → KI-Strukturierung → SIS-Zuordnung als Vorschlag
4. **Schichtbericht** (`/app/handover`) — KI-generiert aus letzten 24h DB-Daten
5. **Cmd+K** → globale Suche + Aktionen

### Als PDL (`pdl@careai.demo`)
- Wochen-Dienstplan
- MDK-Reports
- Übersicht aller Bewohner:innen + Risiko-Ampel

### Als Admin (`admin@careai.demo`)
- **Audit-Log-Viewer** — wer hat wann was geändert (gesetzlich verpflichtend)
- User-/Staff-Verwaltung
- Bewohner-CRUD inkl. Aufnahme/Entlassung
- PDF-Exporte: Pflegebericht, Bewohner-Akte, MD-Prüfungs-Bundle, DSGVO-Auskunft
- DSGVO-Anfragen (Art. 15, 17, 18)

### Als Angehörige (`familie@careai.demo`)
- Read-only Tagesübersicht
- Wohlbefindens-Score
- Nachrichten an Team

---

## Wenn etwas nicht klappt

### `npm install` schlägt fehl
→ Node-Version prüfen: `node --version` → muss ≥ 20 sein (empfohlen 24, siehe `.nvmrc`)

### DB-Seed schlägt fehl
→ `local.db/` Ordner löschen, dann nochmal `db:push` + `db:seed`

### Port 3000 belegt
→ `PORT=3001 npm run dev` oder andere Prozesse mit `Strg+C` beenden

### TypeScript zeigt Fehler die nicht echt sind
→ `Strg+Shift+P` → "TypeScript: Restart TS Server"

---

## Features die die Jury beeindrucken werden

- **Revisionssichere Pflegeberichte** mit SHA-256-Signatur + QR-Code
- **MD-Prüfungs-Bundle** in einem Klick (Strukturmodell-konform)
- **DSGVO Art. 15 Auskunft** als ZIP mit PDF + JSON + Audit-Auszug
- **Audit-Log** automatisch für jede Änderung (gesetzlich mandatory)
- **10 Jahre Aufbewahrungsfrist** (GuKG § 5 / SGB XI) korrekt abgebildet
- **EU AI Act** konform: CareAI Phase 1 = kein Medizinprodukt (Human-in-the-Loop bei jeder KI-Suggestion)
- **Pflegegrad DE** (1-5, NBA 6 Module) + **Pflegegeldstufen AT** (1-7) korrekt hinterlegt
- **Hetzner Falkenstein** Hosting = 100% Ökostrom
- **Ab 299 €** auch für kleine Sozialträger leistbar

---

## Dateien die du zuerst lesen solltest

1. `README.md` — technische Übersicht
2. `docs/DEMO-SCRIPT.md` — 8-Minuten-Pitch-Walkthrough
3. `docs/SECURITY.md` — DSGVO + EU AI Act + Audit
4. `docs/ARCHITECTURE.md` — Tech-Entscheidungen
5. `RESEARCH-SPEC.md` — komplette rechtliche + funktionale Recherche (DACH-Pflegerecht)
6. `.vscode/README.md` — was die Editor-Configs machen

---

## Weiterentwickeln mit Cursor

Cmd+L (oder Strg+L) → Cursor Chat fragen z.B.:
- "Wo wird das Audit-Log geschrieben?"
- "Erkläre mir die SIS-Struktur im Schema"
- "Füge einen Export für die Angehörigen-Einwilligung hinzu"
- "Wie funktioniert die Spracheingabe? Welche API-Route?"

Cursor hat die ganze Codebase indiziert und gibt präzise Antworten mit File-Links.
