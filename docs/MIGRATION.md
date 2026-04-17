# CareAI — Migrations-Handbuch

Import von Bewohner:innen-Stammdaten aus den gängigen DACH-Pflege-Systemen.
Dieses Dokument beschreibt Architektur, Formate, Mapping-Logik, Rollback und Betrieb.

## Unterstützte Quellen

| ID             | System                        | Format          | Status       |
|----------------|-------------------------------|-----------------|--------------|
| `medifox`      | Medifox / Connext             | CSV (;) UTF-8   | Produktiv    |
| `dan`          | DAN GES.SYS / PflegePlus      | XML oder TSV    | Produktiv    |
| `vivendi`      | Vivendi PD (Connext)          | XML             | Produktiv    |
| `senso`        | SenSo / Sensopflege           | CSV (;)         | Produktiv    |
| `csv-generic`  | beliebige CSV/Excel-Exporte   | CSV (`,`/`;`/TAB) | Produktiv  |

Neue Quellen können durch Hinzufügen eines Parsers in `src/lib/migration/parsers/`
und Registrierung in `src/lib/migration/index.ts → parseBySource()` ergänzt werden.

## Architektur (Pipeline)

```
Upload (Admin-UI)
    ↓
POST /api/migration/parse       → Format-Parser   (CSV/XML)
    ↓                             (parsers/*.ts)
POST /api/migration/validate    → Mapper          (mapper.ts)
    ↓                           → Validator       (validator.ts)
POST /api/migration/import      → Loader          (loader.ts)
    ↓
Report (reporter.ts)
```

**Keine Schema-Änderung.** Der Loader nimmt optionale Deps (`findExisting`,
`insertResident`, `updateResident`) entgegen. Bis diese aus dem DB-Modul
durchgereicht werden, läuft der Import im Dry-Run — liefert aber volle
Validierung und Report.

## Mapping-Logik

Jede Quelle hat ein **Default-Mapping** (`parsers/*.ts → *DefaultMapping`).
Der Mapper:

1. wendet die konfigurierten Regeln je Datensatz an,
2. führt Transformationen aus (Datum DE → ISO, Pflegegrad-Int, Gender-Norm),
3. sammelt Validierungsfehler.

### Transformations-Typen

- `date-de` — `12.03.1938` → `1938-03-12`
- `date-iso` — strikt `YYYY-MM-DD`
- `care-level-int` — parst Ziffer, Range 1–5
- `uppercase`/`lowercase`/`trim`
- _default_ — Heuristik abhängig vom Zielfeld

### Auto-Detection

`suggestMapping()` in `mapper.ts` vergleicht Quell-Feldnamen mit den Default-Tabellen
(case-insensitive, alphanumerisch-normalisiert).

## Validierung

| Code                | Bedeutung                                 |
|---------------------|-------------------------------------------|
| `REQUIRED_MISSING`  | Pflichtfeld (First/LastName) fehlt        |
| `REQUIRED_LASTNAME` | Nachname leer                             |
| `INVALID_DATE_DE`   | Datum im DE-Format nicht parsbar          |
| `INVALID_DATE_ISO`  | ISO-Datum nicht parsbar                   |
| `CARE_LEVEL_RANGE`  | Pflegegrad außerhalb 1–5                  |
| `DATE_FUTURE`       | Geburtsdatum in der Zukunft               |
| `DATE_TOO_OLD`      | Geburtsdatum vor 1900 (Warnung)           |
| `DUPLICATE`         | Duplikat (LastName+FirstName+DOB)         |

## Konflikt-Strategien

- `skip` — Bewohner existiert bereits → ignorieren (Default)
- `overwrite` — alle Werte aus Import ersetzen
- `merge` — leere CareAI-Felder ergänzen, volle bleiben

## Rollback

Jeder Import erhält eine `batchId`. Wird sie in das Resident-Schema als
`migrated_batch_id` geschrieben, lässt sich der gesamte Batch soft-deleten:

```sql
UPDATE residents
   SET deleted_at = NOW()
 WHERE migrated_batch_id = 'mig_abc123';
```

Der Report enthält diese SQL-Zeile als Text.

## Größen-Limits

- 50 MB pro Upload (`/api/migration/parse`)
- 10.000 Datensätze in Einzel-Batch empfohlen
- Für größere Migrationen: mehrere Batches mit unterschiedlichen `batchId`

## Best Practices

1. **Immer erst Dry-Run.** Der Wizard führt standardmäßig einen Simulationslauf durch.
2. **Mapping-Preset speichern** — spart Zeit bei wiederholten Migrationen.
3. **Export auf Wochenende legen**, wenn Quell-System eingefroren ist.
4. **Vorher Backup** der CareAI-DB ziehen (das ist in Produktion sowieso automatisiert).
5. **Stichproben kontrollieren** — nach dem Import 5 % der Datensätze händisch prüfen.

## Preset-Store

`src/lib/migration/preset-store.ts` ist aktuell in-memory. System-Presets
werden beim ersten Call automatisch geseedet. **TODO** (eigenes Feature-Ticket):
Persistenz über eigene Tabelle `migration_presets` — sobald DB-Layer freigeschaltet.

## Typische Probleme

| Symptom                       | Ursache                                       | Abhilfe                                    |
|-------------------------------|-----------------------------------------------|--------------------------------------------|
| Umlaute als `?` oder `�`      | Falsches Encoding (Windows-1252 statt UTF-8)  | Datei in Editor als UTF-8 speichern        |
| Pflegegrad „Pflegegrad 3"     | Text statt Ziffer                             | Spalte in Excel bereinigen                 |
| Datum als `44562`             | Excel-Serial                                  | Spalte als Text/Datum formatieren          |
| Spalten verrutscht            | Zeilenumbruch in Notiz-Feld                   | XML-Export nutzen (DAN/Vivendi)            |
| Viele Duplikate               | Historische Einträge mit gleichem Namen       | `skip` lassen, dann gezielt `merge`        |

## API-Referenz

```
POST /api/migration/parse
  body: { source, content }
  → { ok, parse, suggestedMapping }

POST /api/migration/validate
  body: { source, content, rules[] }
  → { ok, summary, validation, preview }

POST /api/migration/import
  body: { source, content, rules[], conflictStrategy, dryRun? }
  → { ok, report }

GET  /api/migration/presets
POST /api/migration/presets
POST /api/migration/presets/save
```
