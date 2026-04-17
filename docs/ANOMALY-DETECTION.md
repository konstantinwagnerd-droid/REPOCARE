# Audit-Log Anomaly Detection

Automatische Erkennung ungewöhnlicher Muster im Audit-Log. Implementiert unter `src/lib/anomaly/`.

## Regeln (10)

| Kind | Schwelle | Fenster | Severity |
|---|---|---|---|
| `bulk-delete` | 50 Deletes | 5 Min | high |
| `off-hours-export` | 1 Export | 1 Min (22:00 – 06:00) | high |
| `role-escalation` | 1 Änderung auf `user-role` | 1 Min | critical |
| `geo-unusual` | 1 Login aus unbekanntem Land | 1 Min | medium |
| `rapid-access` | 100 Reads auf Bewohnerakten | 5 Min | medium |
| `credential-stuffing` | 10 fehlgeschlagene Logins pro IP | 5 Min | high |
| `data-spike` | Z-Score > 3 (tageswert) | 24 h | medium |
| `permission-overuse` | 200 verschiedene Entities | 60 Min | medium |
| `dormant-reactivation` | Login nach >30 Tagen | – | low |
| `after-hours-login` | Login außerhalb der typischen Stunden | 1 Min | low |

Alle Schwellen sind im Admin-UI editierbar (`/admin/anomaly → Regeln`).

## Methodik
- **Heuristische Regeln** für Muster mit klaren Grenzen (Counts, Zeitfenster, Rollen-Events).
- **Z-Score** gegen eine User-spezifische 30-Tage-Baseline (Mean/Std tägl. Events, typische Stunden, typische Länder). Eventueller Baseline-Reset im UI.
- Findings werden als `low/medium/high/critical` kategorisiert und mit einer empfohlenen Action versehen (Sessions invalidieren, Export blockieren, Rollen-Review).

## False-Positive-Management
- Manuelles „Als geklärt markieren" setzt `acknowledged=true` mit `acknowledgedBy/At`.
- Regeln können pro Kind deaktiviert werden.
- Baseline wächst fortlaufend; > 30 Tage Daten → robustere Z-Scores.

## Auto-Actions
Nach jedem Fund:
1. `audit.anomaly`-Notification an Admin-Rolle.
2. Empfehlung zur Session-Invalidation bei `critical`, `credential-stuffing`, `role-escalation`.
3. Empfehlung zur Export-Blockade bei `bulk-delete`, `off-hours-export`, `critical`.

## Compliance-Bezug
- **ISO 27001 A.12.4** Logging & Monitoring — Audit-Log-Auswertung + Nachvollziehbarkeit der Reaktion.
- **DSGVO Art. 32** Integrität/Vertraulichkeit — technische Maßnahmen zur Erkennung unautorisierter Verarbeitung.
- **BSI IT-Grundschutz ORP.4.A23** — regelmäßige Auswertung protokollierter Ereignisse.

## API
- `POST /api/anomaly/scan` — Admin/PDL, startet Scan, triggert Notifications.
- `GET /api/anomaly/list` — Admin/PDL, liefert Findings + Regeln.
- `POST /api/anomaly/[id]/acknowledge` — Admin/PDL, markiert als geklärt.
- `POST /api/anomaly/rules/save` — Admin, speichert geänderte Regeln.
- `GET /api/anomaly/export` — Admin/PDL, CSV-Export aller Findings.

## Page
- `/admin/anomaly` — Dashboard, Detail-Panel, Regel-Editor, CSV-Export.
