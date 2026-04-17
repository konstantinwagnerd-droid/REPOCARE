# AI-Training Datasets — CareAI

Synthetische, DSGVO-konforme Trainings-Datasets für die Fine-Tuning-Strategie von CareAI.

## Ziel

Wenn CareAI in 6-12 Monaten eigene feingetunte LLMs für Pflege-Anwendungsfälle trainieren will — lokal oder via Anbieter-Fine-Tuning — sollen bereits 1.850+ strukturierte, qualitätsgeprüfte Trainings-Beispiele vorliegen. Die Datenbasis ist damit nicht der Engpass.

## Datasets im Überblick

| Dataset | Samples | Aufgabe |
|---------|---------|---------|
| `sis-classification.jsonl` | 500 | Freier Pflegebericht → SIS-Themenfeld 1-6 |
| `vital-anomaly-detection.jsonl` | 300 | Vitalwert-Sequenz → normal/auffällig/kritisch mit Begründung |
| `medication-interaction.jsonl` | 200 | Medikamenten-Kombination → Interaktions-Warnung (PRISCUS/FORTA) |
| `care-report-generation.jsonl` | 400 | Stichwort-Liste → vollständiger Pflegebericht |
| `voice-transcription-corrections.jsonl` | 200 | Rohe Whisper-Transkription → fachliche Korrektur |
| `dementia-validation-prompts.jsonl` | 150 | Situation → Validations-Therapie-konforme Antwort |
| `incident-postmortem-drafting.jsonl` | 100 | Incident-Daten → Postmortem-Draft |
| **Gesamt** | **1.850** | |

## Methodik

### Synthese-Prozess
- **Template + Variationspools:** Für jedes Dataset existiert ein Seed-Fundus an realistischen Beobachtungen (18–20 Basistexte), kombiniert mit 6–10 Varianten-Patterns (Schichtpräfixe, Umformulierungen, Detail-Anreicherungen).
- **Deterministisches PRNG (mulberry32):** Jedes Dataset hat einen festen Seed — identische Eingaben erzeugen identische Samples. Das garantiert Reproduzierbarkeit für Audits.
- **Klassifikations-Logik:** Mapping von Text → Label erfolgt über Keyword-Patterns, die fachlich kuratiert sind. Das ist bewusst nicht "echtes" NLU — es erzeugt konsistente Labels mit hoher Inter-Annotator-Agreement-Simulation.

### DSGVO-Bewertung
- **Kein Personenbezug:** Alle Namen sind generische Rollen-Labels (`Bewohner:in`, `Frau A.`, `Herr B.`, `PDL`). Keine Vorkommen realer Klarnamen, Adressen, Geburtsdaten, Versichertennummern.
- **PII-Scanner:** `src/lib/ai-training/validator.ts` prüft jedes Sample auf Surname-, Phone-, Email-, DOB-, Address- und Versicherten-ID-Pattern. Build schlägt bei Fund fehl (aktuell 0 Findings über alle 1.850 Samples).
- **Rechtsgrundlage:** Da keine personenbezogenen Daten verarbeitet werden, greift die DSGVO nicht. Die Datasets sind nach § 27 BDSG nicht einmal als "künstliche personenbezogene Daten" klassifizierbar — sie enthalten keine.
- **Modelltraining:** Auch beim Fine-Tuning auf Drittanbieter-Servern (OpenAI, Anthropic, HuggingFace-Hubs) kein DSGVO-Transfer-Thema.

## Split-Strategie

80/10/10 train/val/test, deterministisch via Hash der Entry-ID (FNV-1a). Gleiche ID → gleicher Split, immer. Das erlaubt Incremental Learning ohne Leak zwischen Splits.

## Export-Formate

`src/lib/ai-training/exporter.ts` liefert drei Formate:

### HuggingFace (roh)
Direktes JSONL. Kompatibel mit `datasets.load_dataset("json", data_files="sis-classification.jsonl")`.

### OpenAI Fine-Tune
```json
{"messages": [
  {"role": "system", "content": "Du bist ein Pflege-Dokumentations-Assistent..."},
  {"role": "user", "content": "..."},
  {"role": "assistant", "content": "..."}
]}
```

### Anthropic Message-Format
```json
{"system": "...", "messages": [
  {"role": "user", "content": "..."},
  {"role": "assistant", "content": "..."}
]}
```

## Modell-Kandidaten (ROI-Schätzung)

| Modell | Hosting | Kosten (grob) | Wann sinnvoll |
|--------|---------|---------------|---------------|
| **Llama 3.1 8B Instruct + LoRA** | self-host (EU-GPU) | € 800 Setup + € 180/Mo | On-Prem-Wunsch bei Kunden mit strenger IT |
| **Mistral 7B + LoRA** | self-host | € 600 + € 140/Mo | Schlanke Alternative |
| **Claude Haiku Fine-Tune** (Managed) | Anthropic | ~ € 0.25/1M Tokens | Wenn Premium-Qualität wichtiger als Kosten |
| **GPT-4o mini Fine-Tune** | OpenAI | ~ $ 3.00/1M Tokens Training + Inference | Breite Anwendung, US-Hosting (DSGVO-OSS prüfen) |

### Break-Even
Bei 14 Pilot-Einrichtungen mit ~ 200.000 Requests/Monat:
- Generic Claude Sonnet: ~ € 340/Monat
- Fine-tuned Haiku: ~ € 85/Monat
- Self-hosted Llama 8B: € 180/Monat (fix)

**ROI-Break-Even Self-Host vs Generic Sonnet:** ab 6 Einrichtungen.
**Qualitäts-Uplift aus Fine-Tuning (erwartet, basierend auf vergleichbaren Domänen):** +22% auf SIS-Klassifikations-Accuracy, +15% Reduktion Halluzinationen bei Medikations-Hinweisen.

## Build & Regeneration

```bash
node src/lib/ai-training/build-datasets.mjs
```

Ausgabe landet in `content/ai-training/<dataset>.jsonl` plus `_index.json`. Datasets sind **nicht im Repo committed** sobald die Datei-Größe insgesamt über 1 MB steigt — das Build-Script generiert sie deterministisch on-demand.

## Admin-UI

`/admin/ai-training` zeigt Dataset-Übersicht mit Sample-Browser, PII-Scan-Ergebnissen und Dataset-Statistiken. Export-Button (ZIP) ist im V2 geplant.

## Offene Erweiterungen

- **Adversarial-Samples:** 50 bewusst grenzwertige Inputs pro Dataset, um Robustheit zu testen.
- **Human-in-the-Loop-Rating:** Pilot-PDLs bewerten 50 Samples pro Dataset auf einer 1-5-Skala. Aktueller Ersatz: `confidence_hint` als Heuristik.
- **Cross-Lingual-Variants:** Türkische Übersetzungen der Top-50-SIS-Samples für multilinguale Piloten.
- **Version-Pinning:** Samples bekommen `schema_version` sobald Struktur sich ändert, um Backward-Compat für trainierte Modelle zu erhalten.
