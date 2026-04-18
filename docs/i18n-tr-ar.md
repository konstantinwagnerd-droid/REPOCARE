# i18n: Tuerkisch + Arabisch fuer die Pflegekraft-UI

Viele Pflegekraefte im DACH-Raum haben einen Migrationshintergrund — ueberproportional haeufig tuerkisch oder arabisch. CareAI unterstuetzt daher diese beiden Sprachen fuer die **Pflegekraft-UI**, waehrend Admin/Owner-Bereiche und rechtliche Dokumente bewusst Deutsch bleiben (Rechtssicherheit).

## Architektur

- Provider: `src/lib/i18n/index.tsx` — `I18nProvider` mountet nur im `/app`-Layout
- Dicts: `src/locales/{de,en,tr,ar}.json`
- Switcher: `src/components/app/app-language-switcher.tsx` (im Topbar gerendert)
- Persistenz: `localStorage` Key `careai_locale`
- RTL: Setzt `document.documentElement.dir = "rtl"` fuer Arabisch

## Abdeckungs-Matrix

| Oberflaeche | DE | EN | TR | AR | Status |
|-------------|----|----|----|----|--------|
| Sidebar (Pflegekraft) | ✓ | ✓ | ✓ | ✓ | labels via `i18nKey` |
| Topbar | ✓ | ✓ | ✓ | ✓ | Emergency, Sprachwahl |
| Mobile Bottom-Nav | ✓ | ✓ | ✓ | ✓ | 5 Tabs |
| `/app` Dashboard | ✓ | ✓ | ✓ | ✓ | Grundstrings |
| `/app/residents` | ✓ | ✓ | ✓ | ✓ | Titel + Spalten |
| `/app/residents/[id]` | ✓ | — | — | — | **Inhalt ausschliesslich Deutsch** (medizinische Dokumentation) |
| `/app/voice` | ✓ | ✓ | ✓ | ✓ | Aufnahme-Steuerung |
| `/app/handover` | ✓ | ✓ | ✓ | ✓ | Schichten + Aktionen |
| `/app/fallbesprechung` | ✓ | — | — | — | Deutsch (Protokoll rechtssicher) |

## NICHT uebersetzt (bewusst)

- `/admin/*`, `/owner/*` — Administrations-UI bleibt Deutsch
- `/app/pflegegeld-antrag`, `/app/vorlagen` — rechtliche/offizielle Formulare
- `/app/residents/[id]` Akte-Inhalt — Pflegedokumentation ist nach DE-Recht auf Deutsch zu fuehren
- Blog, Marketing, Legal

## Fachbegriffe

Uebersetzungen orientieren sich an pflegewissenschaftlicher Literatur:

| Deutsch | Englisch | Tuerkisch | Arabisch |
|---------|----------|-----------|----------|
| Bewohner:innen | Residents | Sakinler | المقيمون |
| Schichtbericht | Shift Report | Vardiya Raporu | تقرير المناوبة |
| Pflegegrad | Care Level | Bakım Düzeyi | درجة الرعاية |
| Dekubitus | Pressure Ulcer | Bası yarası | قرحة الفراش |
| Sturzrisiko | Fall Risk | Düşme Riski | خطر السقوط |
| Wohlbefinden | Wellbeing | İyilik Hali | الحالة العامة |
| Spracheingabe | Voice Input | Sesli Giriş | إدخال صوتي |

## RTL-Layout-Checks

Arabisch aktiviert automatisch `dir="rtl"` auf dem `<html>`. Zu pruefen:

- [x] Sidebar bleibt links — aber Inhalte innerhalb flippen korrekt (Tailwind `ms-/me-` statt `ml-/mr-`)
- [x] Dropdown des Language-Switchers verwendet `end-0` statt `right-0`
- [ ] Feed-Items / Timeline muessen manuell auf korrekte Chevron-Richtung geprueft werden
- [ ] Charts (Recharts) werden nicht gespiegelt — X-Achse bleibt LTR (Zeit-Achse)

## Rollout

1. Merge nach `main`
2. **Review mit arabischer Muttersprachlerin** (z.B. ueber Kontakt Sprachschule Wien)
3. Review mit tuerkischer Pflegefachkraft (MdK-Auditorin oder Pflegedienstleitung mit TR-Muttersprache)
4. Schulungsvideo 5 Min: "Sprachwechsel + RTL-Modus" — auf 3 Sprachen

## Erweiterung

Neue Strings hinzufuegen:

1. Key in `de.json` anlegen (Struktur: `{domain}.{action}`)
2. Fallback in `en.json` + `tr.json` + `ar.json`
3. Im Component: `const { t } = useT(); <span>{t("key.path")}</span>`
4. Ohne Provider (z.B. Admin): `useOptionalT()` — liefert `null`

Fehlende Keys fallen automatisch auf Deutsch zurueck (`getPath(dicts.de, key)`), niemals auf leeren String.
