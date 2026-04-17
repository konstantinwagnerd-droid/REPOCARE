# CareAI — Partner-Programm

Dokumentation der Programm-Logik, Provisionsmodell, Onboarding und Zertifizierung.
Zielgruppe: CareAI-Sales, Partner-Manager, Legal.

## Partner-Typen

| Tier            | Zielgruppe                          | Provision | Leistungen Partner                          |
|-----------------|-------------------------------------|-----------|---------------------------------------------|
| Reseller        | Systemhäuser                        | 20 %      | Verkauf, Lizenz auf eigenem Namen           |
| Implementation  | Schulungsdienstleister              | 15 %      | Onboarding, Datenmigration, Go-Live         |
| Integration     | Softwarehäuser                      | 10 %      | API-Anbindungen, Third-Party-Integrationen  |
| Consulting      | Berater:innen, Verbände             | 15 %      | Strategische Empfehlung                     |

## Provisionsmodell

- Rate abhängig vom Tier (siehe Tabelle)
- Laufzeit: **12 Monate ab Go-Live** des jeweiligen Deals
- Basis: monatliche Lizenzgebühr (Starter €299, Professional €599, Enterprise €999)
- Auszahlung: monatlich, 1. Werktag
- Zahlungsweg: SEPA, Reverse Charge bei B2B-EU

### Beispiel

Deal: 60-Plätze-Heim → Professional → €599/Monat
Reseller-Partner: 20 %
→ €119,80 / Monat × 12 = **€1.437,60 Jahresertrag**

## Protected Deals

- Jeder registrierte Lead ist **6 Monate geschützt** vor Überschneidung mit anderen Partnern
- Registrierung per Dashboard → Status "Neu" aktiviert den Schutz
- Erneute Verlängerung bei Statuswechsel auf "Demo" oder höher

## Onboarding-Prozess

1. **Bewerbung** (Formular auf `/partner#bewerbung`)
2. **Gespräch** — Video/Telefon, 30 Min Fit-Check
3. **Onboarding + Zertifizierung**
   - 6 Module online, selbstbestimmt
   - Gesamtdauer ~3–4 Stunden über 2 Wochen
   - Abschluss-Quiz, Bestehensgrenze 80 %
4. **Go-Live** — Partner-Portal wird freigeschaltet, 3 Demo-Slots

## Zertifizierung

| Modul | Titel                              | Dauer  |
|-------|-----------------------------------|--------|
| 1     | Produkt-Grundlagen                | 35 min |
| 2     | Zielgruppen & Personas            | 25 min |
| 3     | Preise & Lizenz-Modell            | 20 min |
| 4     | DSGVO & EU AI Act für Sales       | 40 min |
| 5     | Einwand-Behandlung                | 30 min |
| 6     | Abschluss-Prüfung (Quiz)          | 15 min |

- Zertifikat-Laufzeit: 12 Monate, dann Auffrischung (2 Module + Quiz)
- Nur zertifizierte Partner dürfen CareAI offiziell verkaufen
- Zertifikat als PDF im Dashboard → nachweisbar gegenüber Kund:innen

## Demo-Accounts

Im Demo-Layer (in-memory Store) sind drei Accounts vorgefertigt:

| E-Mail                   | Passwort  | Firma                              | Tier           | Rate |
|--------------------------|-----------|-------------------------------------|----------------|------|
| partner@muellertech.de   | demo2026  | Müller IT-Systemhaus GmbH          | Reseller       | 20 % |
| ops@pflegenetz.at        | demo2026  | Pflegenetz Consulting Austria      | Consulting     | 15 % |
| sales@digihaus.de        | demo2026  | DigiHaus Integrationen             | Integration    | 10 % |

> **Produktion:** Partner-Accounts gehören in eine eigene DB-Tabelle (`partners`, `partner_leads`, `partner_commissions`).
> Der aktuelle Demo-Layer (`src/components/partner/data.ts`) ist in-memory und session-persistent.

## Rolle & Auth

- **Keine Schema-Änderung** am bestehenden `users.role`-Feld
- Eigener Cookie `careai_partner` (httpOnly, 8h)
- Route-Group `/partner/(portal)/*` prüft in `layout.tsx` die Partner-Session
- Marketing-Seite `/partner` und Login `/partner/login` sind öffentlich

## API-Referenz

```
POST /api/partner/login          — { email, password }
POST /api/partner/logout
POST /api/partner/register       — Bewerbungs-Formular
GET  /api/partner/leads          — eigene Leads auflisten
POST /api/partner/leads/create   — neuen Lead anlegen
POST /api/partner/leads/:id/update — Status/Notizen ändern
GET  /api/partner/commissions    — eigene Provisionen
```

## Lead-Lifecycle

```
Neu → Qualifiziert → Demo → Verhandlung → Won   (Provision wird automatisch erzeugt)
                                        └─ Lost (Deal geschlossen, keine Provision)
```

## KPIs für Partner-Manager

- Aktivierungs-Rate: % Partner mit erstem Lead binnen 30 Tagen nach Go-Live
- Deal-Velocity: durchschnittliche Tage von "Neu" bis "Won"
- Win-Rate: Won / (Won + Lost)
- Partner-Umsatz: Summe aller Provisionen, annualisiert
- Churn-Risk: Partner ohne Aktivität > 60 Tage

## Häufige Fragen

**Kann ein Partner mehrere Tiers haben?**
Ja — Implementation + Reseller wird kombiniert. Die Provision gilt pro Deal.

**Was passiert wenn ein Kunde kündigt?**
Provision endet mit letztem Zahlungsmonat des Kunden. Keine Rückforderung bei vorher ausgezahlter Provision.

**Gibt es Gebietsschutz?**
Nein, CareAI ist transparent offen. Protected Deals lösen das Problem effizienter.
