# WhatsApp-Integration (Evolution API)

CareAI nutzt [Evolution API](https://github.com/EvolutionAPI/evolution-api) als Self-Hosted WhatsApp-Gateway fuer Angehoerigen-Benachrichtigungen. Dadurch bleiben wir unabhaengig von Meta-Business-API-Approvals und behalten volle DSGVO-Kontrolle ueber Inhalte und Speicherort.

## Setup (Docker)

```yaml
# docker-compose.yml
version: "3.9"
services:
  evolution:
    image: atendai/evolution-api:latest
    restart: always
    ports:
      - "8080:8080"
    environment:
      - AUTHENTICATION_API_KEY=REPLACE_WITH_STRONG_KEY
      - SERVER_URL=https://evo.example.com
      - DATABASE_ENABLED=true
      - DATABASE_CONNECTION_URI=postgres://user:pass@db:5432/evolution
      - CACHE_REDIS_ENABLED=true
      - CACHE_REDIS_URI=redis://redis:6379
    depends_on:
      - db
      - redis
```

Nach dem Start:

1. Instance anlegen: `POST /instance/create` mit `{"instanceName":"careai"}`
2. QR-Code scannen: `GET /instance/connect/careai`
3. Instance ist jetzt bereit — Senden/Empfangen moeglich

## Env-Variablen (CareAI)

```
EVOLUTION_API_URL=https://evo.example.com
EVOLUTION_API_KEY=<AUTHENTICATION_API_KEY>
EVOLUTION_INSTANCE=careai
```

Ohne diese Variablen sind alle Sende-Operationen No-Ops und `/admin/whatsapp` zeigt den Hinweis "API nicht konfiguriert".

## Consent-Flow (DSGVO)

1. Angehoerige:r meldet sich im Family-Portal an
2. System schlaegt Opt-in vor — `consent_confirm`-Template wird versendet (oder manuell durch Admin)
3. Kontakt bestaetigt JA/ALLES/STOP
4. PDL/Admin setzt `consent_given_at` + `consent_scope` via `/admin/whatsapp`
5. Opt-out ist jederzeit moeglich (Kontakt loeschen oder `consent_given_at = NULL`)

### Scope-Abstufungen

| Scope | Beinhaltet |
|-------|------------|
| `critical` | Nur kritische Vorkommnisse (Sturz, Verschlechterung, Notfall) |
| `daily` | Kritische + taegliche Updates (Wohlbefinden, Foto des Tages) |
| `all` | Alles inkl. Erinnerungen, Reports, Newsletter |

### Quiet-Hours

Standard 22:00–07:00. `critical` ignoriert Ruhezeiten, alle anderen Scopes werden dann uebersprungen (Log: `reason=quiet`).

## Templates

Definiert in `src/lib/whatsapp/templates.ts`:

- `incident_critical` — kritisches Vorkommnis, Detail ins Portal
- `wellbeing_weekly` — Wochen-Update mit Score
- `visit_reminder` — Besuchs-Erinnerung
- `daily_photo` — Foto des Tages
- `consent_confirm` — initiale Opt-In-Anfrage

Templates sind rein textbasiert. Evolution-Community unterstuetzt keine nativen WhatsApp-Business-Templates (24h-Fenster-Pflicht!). Bei Rollout auf WABA Cloud API muessen die Templates bei Meta approved werden — siehe folgender Abschnitt.

### Template-Approval (WABA Cloud API)

Falls spaeter auf Meta WhatsApp Business API migriert wird:

1. Template-Kategorie: `UTILITY` (keine Werbung)
2. Beispielwerte fuer alle Variablen einreichen
3. Approval-Zeit: ~48h
4. Opt-Out muss im Template erwaehnt sein ("Antworte STOP zum Abmelden")

## Rate-Limiting

1 Nachricht/Sekunde pro Zielnummer (in `evolution-client.ts`). Bei Massen-Send pruefen wir zusaetzlich:

- Consent vorhanden?
- Scope kompatibel mit Template?
- Ruhezeiten (wenn Scope != critical)

## DSGVO-Hinweise

- **Keine Gesundheitsdaten im Nachrichtentext** — immer Link ins verschluesselte Portal.
- Speicherort: `whatsapp_messages`-Tabelle in eigener Supabase-Instanz (EU-Region).
- Loeschung: bei Kontakt-Loeschung werden Messages via ON DELETE CASCADE mitgeloescht.
- Auftragsverarbeitungsvertrag (AVV) mit dem Evolution-API-Hoster zwingend — bei Self-Hosting entfaellt dies.
- Einwilligung ist dokumentiert via `consent_given_at`-Timestamp (Nachweis DSGVO Art. 7(1)).

## Automatische Trigger

`src/lib/whatsapp/notify.ts` exportiert `notifyResidentContacts({ tenantId, residentId, template, vars, eventType })`. Aufruf z.B. bei kritischem Incident:

```ts
import { notifyResidentContacts } from "@/lib/whatsapp/notify";

if (incident.severity === "kritisch") {
  await notifyResidentContacts({
    tenantId,
    residentId: incident.residentId,
    template: "incident_critical",
    vars: { name: "Herr Mueller", resident_name: resident.fullName },
    eventType: "incident",
  });
}
```

## Troubleshooting

- **"Evolution 403"**: API-Key pruefen, ggf. `AUTHENTICATION_API_KEY` regenerieren
- **Nachricht nicht zugestellt**: Nummer muss in E.164-Format (mit Laenderkennung). Validierung via `validateNumber()`.
- **Instance disconnected**: QR-Code erneut scannen, WhatsApp Session laeuft nach 14 Tagen Inaktivitaet ab.
