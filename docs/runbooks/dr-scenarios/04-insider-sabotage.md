# Szenario 4 — Sabotage durch internen User

**RTO:** 4h  | **RPO:** 1h.
**Tabletop-Dauer:** 2h.

## Trigger-Signal
- Ungewöhnliches Löschvolumen durch Admin-Account (Anomalie-Detection).
- Git-Force-Push auf `main` ausserhalb Business-Hours ohne CI.
- Mass-DELETE-Statement im SQL-Audit-Log.
- Plötzliche Änderungen an IAM-Policies, Key-Rotations ohne Ticket.
- HR meldet fristlose Kündigung mit potenziell unfreundlichem Übergang.

## Rollen
- **IC** (CTO, nicht der potenzielle Täter)
- **Tech-Lead** (SRE, nicht im Verdacht)
- **HR-Lead** (essentiell — arbeitsrechtliche Themen)
- **Legal/DPO**
- **Comms-Lead**

## Erste-Reaktions-Schritte (0–30 Min)

| Zeit | Aktion | Verantwortlich |
|------|--------|----------------|
| T+0  | Verdachts-User-Accounts sperren (ALLE — SSH, SSO, VPN, Hardware) | Tech-Lead |
| T+5  | Git-Repository einfrieren, Force-Push verbieten | Tech-Lead |
| T+10 | Forensik-Image aller zugewiesenen Devices | SecOps |
| T+15 | Physischen Gebäudezugang sperren | Office-Mgmt |
| T+20 | HR informiert (Beweissicherung, Betriebsratsbeteiligung) | HR |
| T+30 | Datenverlust scopen: was wurde gelöscht, überschrieben, exfiltriert? | Tech-Lead |

## Technische Recovery-Schritte

1. **Blast-Radius bestimmen:** Audit-Logs aller Systeme für Täter-User-ID.
2. **Git-Revert:** Problematische Commits identifizieren, Reflog zur Rettung, Force-Reset auf sauberen State.
3. **DB-Recovery:** Point-in-Time-Recovery vor dem Schadensereignis (T-10 Min).
4. **IAM-Säuberung:** Alle vom Täter erstellten/modifizierten Policies prüfen, Backdoors suchen.
5. **Dependency-Check:** Keine bösartigen Package-Versionen eingecheckt? `npm audit`, Lockfile-Diff.
6. **Secrets-Rotation:** Alles worauf der Täter Zugriff hatte.

## Kommunikations-Plan

- **Intern eng:** Kreis klein halten (Leak-Gefahr innerhalb Firma). Leadership + HR + Legal + 1–2 SRE.
- **Team (sobald Containment):** Sachlich, keine Details zur Person. "Personelle Veränderung, Systeme gehärtet."
- **Kund:innen:** Nur wenn Daten abgeflossen → Szenario 3 anwenden.
- **Strafverfolgung:** Bei Vorsatz-Sachschaden (§126a StGB Österreich) Anzeige.
- **Cyber-Versicherung:** Meldung binnen 48h (je nach Police).

## Tabletop-Injects

| Zeit | Inject | Erwartete Reaktion |
|------|--------|-------------------|
| T+0  | "Force-Push auf main 23:42 Uhr, 2.400 Zeilen gelöscht" | Git-Freeze, Account sperren |
| T+15 | "Täter hat noch VPN-Session aktiv" | Session kill, Endpoint isolieren |
| T+30 | "Täter hat 1Password-Vault-Export gemacht letzte Woche" | Alle Secrets rotieren |
| T+60 | "Pressesprecher von Ex-Mitarbeiter droht mit Blog-Post" | Legal-Brief, Comms-Statement vorbereiten |
| T+90 | "Zweiter Mitarbeiter war möglicherweise Komplize" | Zugriffe zweite Person reviewen |

## Abschluss-Debrief

- War unser Least-Privilege-Prinzip wirklich gelebt?
- Haben wir Two-Person-Rules für kritische Aktionen?
- Wie lang wäre unentdeckte Aktivität möglich gewesen?
- HR-Offboarding-Checkliste vollständig?
