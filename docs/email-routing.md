# E-Mail Auto-Routing

Eingehende E-Mails an `info@careai.health` werden automatisch klassifiziert und
an die richtige Abteilung geroutet. Implementierung: regex-basiert, ohne LLM
(fuer die Grundlast ausreichend).

## Webhook

**URL:** `POST /api/email/inbound`

**Payload** (Resend/Postmark-kompatibel):

```json
{
  "from": { "email": "kunde@example.com", "name": "Max Muster" },
  "subject": "Anfrage zu Demo",
  "text": "Plain-Text-Body",
  "html": "<p>HTML-Body</p>",
  "attachments": [{ "filename": "lebenslauf.pdf" }],
  "tenantId": "<uuid>"
}
```

**Auth:** HMAC-SHA256 ueber den Raw-Body mit `EMAIL_WEBHOOK_SECRET`. Header
`x-signature: <hex>` oder `x-signature: sha256=<hex>`. Ohne gesetztes Secret
ist die Route **in Dev** ungeprueft — Produktion muss das Secret setzen.

**Response:**

```json
{ "ok": true, "id": "...", "classification": "lead", "routedTo": "nex", "confidence": 0.74 }
```

## Resend-Konfiguration

In der Resend-Konsole einen Inbound-Endpoint anlegen:

- **Webhook URL:** `https://repocare.vercel.app/api/email/inbound`
- **Signing-Secret:** entsprechend `EMAIL_WEBHOOK_SECRET` in Vercel-Env setzen
- **Event:** `email.received`
- **Domain:** `careai.health` (MX-Record auf Resend)

## Klassifikations-Matrix

| Kategorie     | Routing | Trigger-Keywords (Betreff + Body, lowercase)                                                    | Beispiele                                      |
| ------------- | ------- | ----------------------------------------------------------------------------------------------- | ---------------------------------------------- |
| `lead`        | Nex     | interesse, demo, angebot, preise, kosten, informationen zu, anfrage, termin, beratung           | "Angebot fuer 80 Betten?"                      |
| `application` | Aria    | bewerbung, initiativbewerbung, lebenslauf, stelle, praktikum · **+ PDF-Anhang mit `cv`/`lebenslauf`/`bewerbung`** | "Initiativbewerbung als PDL"                   |
| `complaint`   | Zara    | beschwerde, unzufrieden, kritik, mangel, reklamiere, fordere · **+ Sentiment (>=3 `!`)**        | "Inakzeptable Betreuung!!!"                    |
| `support`     | Zara    | problem, funktioniert nicht, fehler, login, passwort                                            | "Login funktioniert nicht"                     |
| `other`       | Inbox   | Kein Keyword-Match                                                                              | Allgemeiner Newsletter, Spam                   |

## Custom Rules

Admins koennen unter `/admin/email-routing` Rules definieren. Hoechste
`priority` gewinnt vor Default-Matching:

- **subject_contains:** exakter Substring im Betreff (lowercase)
- **body_contains:** Substring im Body-Text
- **from_domain:** genaue Domain-Uebereinstimmung (z.B. `@partner.de` → `partner.de`)

## Testing

- `POST /api/email/rules` mit `{ "test": { "from": "…", "subject": "…", "text": "…" } }`
  klassifiziert ohne zu persistieren — wird vom Routing-Editor genutzt.
- Admin-UI: `/admin/email-routing` enthaelt ein Test-Feld mit sofortiger Preview.
- Manuelles Reroute einer bestehenden Mail: `POST /api/email/inbound/{id}/reroute`.

## DB-Tabellen

Siehe `src/db/schema.ts`:

- `email_inbound` — persistiert alle eingegangenen Mails mit Klassifikation.
- `email_routing_rules` — tenant-spezifische Custom-Rules.
