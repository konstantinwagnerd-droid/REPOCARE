# Telemedizin-Portal

## Zweck
Online-Sprechstunden zwischen Pflegekräften (mit Bewohner:in) und externen
Ärzt:innen. Reduziert Krankenhaus-Transporte, verkürzt Verordnungsketten,
dokumentiert Diagnosen und Rezepte revisionssicher.

## Zonen
- `src/lib/telemedizin/` — reine Domänenlogik (Types, Room, Rx, ICD, History)
- `src/app/telemedizin/**` — UI (Dashboard, Raum, Termin, Historie, Rezepte)
- `src/app/api/telemedizin/**` — REST-API (CRUD, Join, Messages, Rx, PDF, ICD)

## Kern-Artefakte
| Datei | Aufgabe |
|-------|---------|
| `types.ts` | `Consultation`, `Participant`, `Prescription`, `SessionState`, `JoinToken` |
| `consultation-room.ts` | Raum-Management, JoinToken-Vergabe, Session-State |
| `prescription.ts` | eRezept-Erstellung, 16-stelliger Access-Code, TI-Token, ELGA-Ref |
| `history.ts` | Historische Auswertungen, Statistik |
| `icd.ts` | 80 häufige ICD-10-Codes für die Pflegeheim-Praxis |

## WebRTC-Architektur

```
 ┌─────────────┐   SDP/ICE    ┌────────────────────┐   SDP/ICE   ┌─────────────┐
 │ Pflege-Browser │◄──signal──►│  Signalisierungs-   │◄──signal──►│  Arzt-Browser│
 │ getUserMedia() │            │  Server (Socket.io) │            │ getUserMedia()│
 └──────┬──────┘              └──────┬─────────────┘            └──────┬──────┘
        │                             │                                │
        ▼                             ▼                                ▼
 ┌─────────────────────────────────────────────────────────────────────────────┐
 │                          STUN/TURN (coturn)                                │
 │                 direkte P2P-Medienverbindung (SRTP)                        │
 └─────────────────────────────────────────────────────────────────────────────┘
```

Der aktuelle Stand implementiert:
- `getUserMedia()` im Raum (`raum-client.tsx`)
- Token-basierte Joins via `POST /api/telemedizin/consultations/:id/join`
- In-Memory Session-Tracking (wer ist anwesend)

Für Produktion fehlt:
- Signalisierungs-Server (Socket.io / LiveKit / Daily)
- STUN/TURN-Server mit ausreichender Kapazität
- SFU bei > 2 Teilnehmer:innen (Pion / Janus / LiveKit)

## TI-Kompatibilität (Deutschland)

Die `Prescription`-Struktur bildet die zentralen Felder des **eRezept-FHIR-Profils**
nach (gematik Spec 2024):

| Feld | FHIR | Unser Feld |
|------|------|-----------|
| Prescription ID | `Task.identifier` | `prescription.id` |
| Access-Code | `Task.identifier[accessCode]` | `prescription.accessCode` (16 Zeichen, 4×4) |
| Arzneimittel-PZN | `Medication.code.coding[pzn]` | `item.pzn` |
| Dosieranweisung | `MedicationRequest.dosageInstruction.text` | `item.dosage` |
| Issuer LANR | `Practitioner.identifier[lanr]` | `doctor.externalIds.lanr` |

**Fehlt für Produktiv-Einsatz:**
- HBA-Signatur (Heilberufsausweis) via Konnektor-API
- Übertragung an den TI-Fachdienst (`$create`, `$accept`)
- KIM-Nachrichtenversand an Apotheken

## ELGA-Bezug (Österreich)

Felder für **ELGA e-Medikation**:
- `elgaRef` — logische Referenz im e-Medikations-Patient Summary
- Für Erstellung nötig: ELGA-Karte des:der Ärzt:in, Ordinations­software mit
  ELGA-CDA-Adapter, Zustimmung der Patient:in (e-Card).

## API-Überblick

| Methode | Pfad | Zweck |
|---------|------|-------|
| GET | `/api/telemedizin/consultations` | Liste (Filter: status, residentId) |
| POST | `/api/telemedizin/consultations` | Neu anlegen |
| GET | `/api/telemedizin/consultations/:id` | Einzelne |
| PATCH | `/api/telemedizin/consultations/:id` | Status ändern / absagen |
| POST | `/api/telemedizin/consultations/:id/join` | JoinToken holen + Session starten |
| DELETE | `/api/telemedizin/consultations/:id/join?participantId=` | Raum verlassen |
| GET/POST | `/api/telemedizin/consultations/:id/messages` | Chat |
| GET/POST | `/api/telemedizin/prescriptions` | Rezept-Liste, -Ausstellung |
| GET | `/api/telemedizin/prescriptions/:id` | Einzel-Rezept |
| PATCH | `/api/telemedizin/prescriptions/:id` | Status (eingelöst / storniert) |
| GET | `/api/telemedizin/prescriptions/:id/pdf` | PDF-Surrogat |
| GET | `/api/telemedizin/icd?q=` | ICD-10 Suche |

## Use Cases

1. **Pflegekraft plant Konsultation** — Subject, Ärzt:in, Slot, Notiz.
2. **Arzt:in tritt Raum bei** — Webcam/Mic, Session wird `aktiv`.
3. **Während Konsultation** — Chat, Diagnose-Codierung, Rezept-Erstellung.
4. **Nach Auflegen** — Status `abgeschlossen`, Rezepte in Historie sichtbar,
   Angehörige werden (bei Consent) via Family-App informiert.

## Sicherheit (aktueller Stand)

- JoinTokens sind kurzlebig (10 Min), nur pro Konsultation gültig.
- Alle API-Routen liegen unter Next.js-Middleware-Schutz (zu ergänzen: Rolle `pflege|pdl|arzt`).
- Medienströme sind end-to-end verschlüsselt, sobald WebRTC-Signalisierung live ist.
- Rezept-PDFs enthalten keine schützenswerten biometrischen Daten im aktuellen Stub.
