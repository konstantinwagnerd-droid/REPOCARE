# CRM-Sync

## Zweck

Bidirektionale Synchronisation zwischen CareAI-Leads/Kunden und externen CRM-Systemen (Salesforce, HubSpot). Ein Mock-Provider ist Default für Entwicklung und Tests.

## Architektur

```
src/lib/crm-sync/
├── types.ts                 SyncDirection, CRMContact, CareAILead, CRMProvider
├── mapper.ts                CareAI-Lead ↔ CRM-Contact + Stage-Mapping
├── sync-engine.ts           runSync(), Konflikt-Auflösung, In-Memory-LeadStore
└── providers/
    ├── mock.ts              In-Memory Default
    ├── salesforce.ts        jsforce (SOAP+REST), lazy import
    └── hubspot.ts           REST v3 mit Private-App-Token
```

## Setup: Salesforce

1. Connected App anlegen in Salesforce Setup → App Manager → New Connected App
   - OAuth-Scopes: `api`, `refresh_token`
   - Callback-URL: `https://careai.at/api/crm-sync/salesforce/callback` (TBD wenn OAuth-Flow aktiviert)
2. Security-Token per Self-Service anfordern (My Settings → Reset My Security Token)
3. Env-Variablen setzen:

```bash
SALESFORCE_LOGIN_URL=https://login.salesforce.com   # oder test.salesforce.com für Sandbox
SALESFORCE_USERNAME=integration@careai.at
SALESFORCE_PASSWORD=...
SALESFORCE_SECURITY_TOKEN=...
```

4. `npm i jsforce` — Provider lädt es lazy; ohne Installation ist er no-op.

## Setup: HubSpot

1. Private App anlegen: HubSpot Settings → Integrations → Private Apps
   - Scopes: `crm.objects.contacts.read`, `crm.objects.contacts.write`
2. Token kopieren und setzen:

```bash
HUBSPOT_PRIVATE_APP_TOKEN=pat-eu1-xxxxxxxx
```

## Field-Mapping

Standard-Mapping in `mapper.ts`:

| CareAI | Salesforce | HubSpot |
|--------|------------|---------|
| `email` | `Email` | `email` |
| `firstName` | `FirstName` | `firstname` |
| `lastName` | `LastName` | `lastname` |
| `organization` | `Company` | `company` |
| `phone` | `Phone` | `phone` |
| `stage` | `LeadStatus` (angepasst) | `lifecyclestage` |

Stage-Mapping (CareAI → CRM):

| CareAI | CRM |
|--------|-----|
| `new`, `contacted` | `lead` |
| `qualified` | `mql` |
| `demo` | `sql` |
| `pilot` | `opportunity` |
| `customer` | `customer` |
| `lost` | `churned` |

Custom-Felder lassen sich via `SyncConfig.fieldMap` ergänzen (in `runSync()`-Aufruf).

## Konflikt-Auflösung

Bei bidirektionalem Sync kann derselbe Kontakt auf beiden Seiten geändert werden. Wähle eine Strategie:

| Strategie | Verhalten |
|-----------|-----------|
| `careai-wins` | CareAI-Version überschreibt CRM |
| `crm-wins` | CRM-Version überschreibt CareAI |
| `newest-wins` | `updatedAt`-Vergleich (Default für Pull) |

## API

| Methode | Route | Zweck |
|---------|-------|-------|
| `POST` | `/api/crm-sync/push` | Pusht alle Leads → CRM |
| `POST` | `/api/crm-sync/pull` | Pullt Kontakte seit `since` aus CRM |
| `GET` | `/api/crm-sync/status?provider=...` | Health-Check |

Alle Endpoints sind `admin`-geschützt.

Request-Body-Beispiel (Push):

```json
{
  "provider": "hubspot",
  "conflictResolution": "careai-wins",
  "rateLimitRps": 5
}
```

## Rate-Limits

- **Salesforce**: 15 API-Calls/Sek pro User, Daily Limits (15.000 bis 1M je nach Lizenz).
- **HubSpot**: 100 Requests / 10s bei Private Apps, 250.000/Tag in Enterprise.

Der Engine-Default `rateLimitRps=5` lässt sich pro Sync anpassen. Ein Retry-Wrapper mit exponentiellem Backoff ist TBD (Scope Wave 13).

## DSGVO / Datenschutz

CRMs sind **eigene Datenverarbeiter** im Sinne der DSGVO (Art. 28). Anforderungen:

- **AV-Vertrag** mit Salesforce Inc. und HubSpot Inc. abschließen (Templates bei Anbieter verfügbar).
- **EU-Region** wählen wenn möglich (HubSpot EU Datacenter = `api.hubapi.com/eu1`).
- **Nur zweckgebundene Daten** syncen — keine SIS-Inhalte, keine Vitaldaten, nur Lead-/Vertriebs-Metadaten.
- **Lösch-Kaskade**: Bei DSGVO-Löschantrag zuerst im CareAI-System löschen, dann `pushContact` mit `stage = lost` + Flag für CRM-Delete (TBD).
- **Audit-Log**: `SyncResult` wird per Endpoint-Response protokolliert, Persistenz TBD.

## Admin-UI

- `/admin/crm-sync` — Provider-Overview, Konflikt-Strategie-Doku, API-Endpoint-Referenz.
- Mapping-Editor und Sync-History-Log sind im Scope von Wave 13 (benötigen DB-Migration).
