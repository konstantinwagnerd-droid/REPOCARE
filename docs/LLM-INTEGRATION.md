# CareAI — LLM-Integration

Leitfaden für den produktiven Einsatz von LLMs (Claude / OpenAI) im Pflegekontext — DSGVO-konform, kostenkontrolliert, safety-by-default.

## Default: Mock

`LLM_PROVIDER=mock` (Default) — alle Endpunkte liefern deterministische Demo-Outputs. Keine Kosten, keine externen Aufrufe. **Demo ist immer sicher.**

## Real-Provider aktivieren

```env
LLM_PROVIDER=anthropic
ENABLE_REAL_LLM=true
ANTHROPIC_API_KEY=sk-ant-...
ANTHROPIC_MODEL=claude-4-7-sonnet
```

Oder OpenAI:

```env
LLM_PROVIDER=openai
ENABLE_REAL_LLM=true
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o
# EU-Region — sobald Endpoint verfügbar:
OPENAI_BASE_URL=https://eu.api.openai.com/v1
```

Ohne `ENABLE_REAL_LLM=true` wird weiter Mock verwendet — zweiter Schalter verhindert versehentliche Produktivkosten.

## Kostenübersicht (April 2026, EUR / 1 Mio. Token)

| Model | Input | Output | Use Case |
|---|---|---|---|
| Claude 4.7 Sonnet | 2,80 € | 14,00 € | Standardberichte, SIS-Klassifikation |
| Claude 4.7 Opus | 14,00 € | 70,00 € | Komplexe Übergaben, Risikoassessments |
| GPT-4o | 2,30 € | 9,00 € | Allrounder |
| GPT-4o-mini | 0,14 € | 0,56 € | Voice-Korrektur, Zusammenfassungen |

Typische Kosten pro 100 Pflegeheimen/Monat bei aktiver Nutzung:
- ~50.000 Berichte × 1500 Output-Token = **~1,05 € pro Heim/Monat** für SIS-Klassifikation
- ~3.000 Übergaben × 2000 Output-Token = **~0,84 € pro Heim/Monat** für Handover

**Budget-Guard:** `LLM_COST_BUDGET_EUR_PER_MONTH=50` alarmiert im Logger bei Überschreitung. Hartes Cap via `checkRateLimit` + Tenant-Quotas.

## Prompt-Versionierung

Alle Templates in `src/lib/llm/prompts/*.ts` haben eine Version (`v1.2.0`). Die Version landet in `billing_llm_usage.prompt_key` → Audit-Trail für Regressionen.

Neue Template-Änderung = neue Minor-Version. Breaking = Major-Version.

## PII-Handling

`src/lib/llm/safety.ts` scrubbt vor jedem API-Call:

| PII-Typ | Regex | Token |
|---|---|---|
| AT SV-Nr | 4+6 Ziffern | `[SVNR_0]` |
| DE SV-Nr | `NN NNNNNN X NNN` | `[SVNR_0]` |
| IBAN | `AT/DE...20+` | `[IBAN_0]` |
| E-Mail | standard | `[EMAIL_0]` |
| Telefon | international | `[PHONE_0]` |

Nach der Response werden die Tokens wieder zurückgetauscht (`restorePII`). Der LLM-Anbieter sieht die Originalwerte nie.

**Namen** werden NICHT automatisch gescrubbed — Pflegeberichte brauchen sie. Lösung: Pseudonyme (Resident-IDs) in Prompts statt Klarnamen, wo möglich.

## Prompt-Injection-Schutz

`detectPromptInjection()` blockt offensichtliche Red-Flags (`ignore previous instructions`, …). Tief­greifenderer Schutz via:

- System-Prompt priorisiert Eingabe-Inhalt, nicht Anweisungen darin
- Output-Schema-Validierung (JSON-Mode) — unerwartete Felder → Fehler

## Fallback-Strategie

Jeder Endpoint (`/api/voice/structure`, `/api/handover/generate`, `/api/risk-assessment`) fällt bei Provider-Fehlern auf Mock zurück → kein User-Blackout.

## Monitoring

Jeder Call loggt:

```json
{
  "level": "info",
  "msg": "llm.usage",
  "provider": "anthropic",
  "model": "claude-4-7-sonnet",
  "input_tokens": 850,
  "output_tokens": 420,
  "cost_eur": 0.008260,
  "tenant_id": "…",
  "user_id": "…",
  "prompt_key": "sis-classification:v1.2.0",
  "at": "2026-04-17T..."
}
```

Persistenz in `billing_llm_usage` (Postgres). Dashboard-Queries z.B.:

```sql
SELECT tenant_id, date_trunc('day', at) AS day, sum(cost_eur) AS eur
FROM billing_llm_usage
WHERE at > now() - interval '30 days'
GROUP BY 1, 2
ORDER BY 1, 2;
```

## Prompt Engineering Guidelines

1. **Nur Fakten** — "Erfinde keine Inhalte" als System-Regel.
2. **JSON-Schema** — für alle strukturierten Outputs `jsonMode: true`.
3. **Temperatur niedrig** (0,2–0,4) für medizinische Inhalte.
4. **Max-Tokens** konservativ — spart Kosten, verhindert Geschwafel.
5. **Kontext-Kompression** — niemals roh 50 Berichte rein-werfen; erst aggregieren.
6. **Nachvollziehbarkeit** — im Prompt verlangen, dass Quellen-Zitate mitgeliefert werden.

## Testing

- Mock-Provider-Tests in `tests/lib/llm/`
- Snapshot-Tests für Prompt-Outputs (Contract-Test-Style)
- Cost-Tracker-Tests verifizieren, dass kein Request ohne `promptKey` + `tenantId` durchgeht
