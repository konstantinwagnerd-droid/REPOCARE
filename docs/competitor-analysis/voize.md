# voize GmbH (voize.de)

**Stand:** 2026-04-18
**Quellen:** voize.de
**Marktposition:** Spracheingabe-Spezialist, Berlin, ~€30M Series A 2024, 50.000+ Pflegekräfte

## Hauptprodukt

- **voize App** — Android/iOS Sprache-zu-strukturierter-Doku
- Integriert in Medifox, Vivendi, Senso, Godo, u.v.m.

## Kernfeature

**Voice-to-Structured-Doc:** Pflegekraft spricht Fließtext ("Herr Meier hat heute Früh 200ml Kaffee getrunken, RR 140/85, stabil auf den Beinen") und voize extrahiert:
- Vitalwerte (RR: 140/85) → in Vitalwerte-Tabelle
- Ernährung (200ml Kaffee) → Trinkprotokoll
- Mobilität (stabil auf den Beinen) → SIS-Themenfeld 2
- Freitext → Pflegebericht

## Technologie

- Eigenes fine-tuned Speech-Recognition-Modell (auf Pflege-Fachvokabular trainiert)
- Lokal auf Device (DSGVO-kritisch, keine Cloud-Übertragung der Audio)
- NER (Named Entity Recognition) für Werte + SIS-Mapping
- Offline-fähig, ASR on-device

## Integrationen

- REST-API in alle großen DACH-PDMS (Medifox, Vivendi, Senso, Godo, Connext, Euregon)
- Keine Direkt-Abrechnung, reine Doku-Erfassung

## Preismodell

- Pro-Pflegekraft-Lizenz, typisch €15-25/Pflegekraft/Monat
- Enterprise mit PDMS-Integration

## CareAI-relevante Gaps

CareAI hat bereits `/voice` und `/voice-commands` Routen. **Aber:** voize's Differenzierung ist NER + strukturiertes Mapping in die Zieltabellen. CareAI sollte:
1. Spracheingabe mit LLM-basiertem Strukturieren (bereits teilweise vorhanden im Handover)
2. Direct-to-Vitalwerte/SIS-Mapping nachbauen
3. Offline-ASR prüfen (Whisper-on-device) oder Cloud-ASR mit klarer DSGVO-Doku
