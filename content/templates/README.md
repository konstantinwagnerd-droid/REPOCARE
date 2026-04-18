# CareAI Pflegedokument-Templates

Bibliothek offizieller Pflegedokumente für Deutschland und Österreich. Alle Templates basieren auf den echten, in der Praxis verwendeten Formularen der zuständigen Behörden und Fachverbände.

## Aufbau jedes Templates

Jede Datei ist ein Markdown-Dokument mit YAML-Frontmatter:

```yaml
---
id: eindeutige-id
title: Anzeige-Titel
jurisdiction: at | de | shared
category: pflegegeld | sis | einzug | nqz | abrechnung | strukturmodell | expertenstandards | md-pruefung | gefaehrdungsbeurteilung
applicable_to:
  - stationaer
  - ambulant
legal_reference: § ...
source_url: https://...
version_date: YYYY-MM-DD
---
```

Der Body enthält den eigentlichen Formular-Inhalt in Markdown, mit Platzhaltern `{{feld}}` für Variablen, die beim Ausfüllen durch CareAI aus der Bewohner-Akte vorab-befüllt werden.

## Katalog

Siehe `src/lib/templates/catalog.ts` für den maschinen-lesbaren Index.

## Mitarbeit

Neue offizielle Vorlagen gerne als PR. Bitte immer mit `source_url` und `legal_reference` belegen. Keine inoffiziellen/privaten Formulare — CareAI ist bewusst eine Bibliothek der **gesetzlich / behördlich anerkannten** Dokumente.
