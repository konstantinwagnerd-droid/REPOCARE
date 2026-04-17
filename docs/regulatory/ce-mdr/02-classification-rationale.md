# 02 — Klassifizierungs-Rationale

**Dokument-ID:** CAI-REG-002
**Version:** 1.0 — Draft

## Klassifizierung: Klasse IIa

Rechtsgrundlage: **MDR 2017/745 Annex VIII, Rule 11** (Software-Regel).

## Rule 11 — Wortlaut (MDR Annex VIII)

> "Software intended to provide information which is used to take decisions with diagnosis or therapeutic purposes is classified as class IIa, except if such decisions have an impact that may cause:
> - death or an irreversible deterioration of a person's state of health, in which case it is in class III; or
> - a serious deterioration of a person's state of health or a surgical intervention, in which case it is classified as class IIb.
> Software intended to monitor physiological processes is classified as class IIa, except if it is intended for monitoring of vital physiological parameters, where the nature of variations of those parameters is such that it could result in immediate danger to the patient, in which case it is classified as class IIb. All other software is classified as class I."

## Subsumtion CareAI

### Kriterium 1: Zweck der Software

CareAI **liefert Informationen, die zur Entscheidungsfindung mit diagnostischem oder therapeutischem Zweck verwendet werden** (prädiktive Risikohinweise → Einleitung präventiver Pflegemaßnahmen).

→ **Rule 11 greift.**

### Kriterium 2: Schweregrad der Auswirkung bei Fehlinformation

Szenarien-Analyse:

| Fehlklassifikation | Konsequenz | Schweregrad |
|---------------------|------------|-------------|
| Falsch-Negativ Dekubitus | Verspätete Prävention → Druckgeschwür Grad 1-2 | Reversibel, mittelschwer |
| Falsch-Negativ Sturzrisiko | Sturz ohne zusätzliche Prävention | Potentiell schwer (Fraktur), aber durch Basispflege abgedeckt |
| Falsch-Positiv | Übervorsorge, Personalressourcen | Gering |
| Falsch-Negativ Delir | Verspätete Erkennung, verlängerter Verlauf | Reversibel, mittelschwer |
| Falsch-Negativ Mangelernährung | Gewichtsverlust, verspätete Substitution | Reversibel, langsam progredient |

**Bewertung:**
- **Kein Tod / keine irreversible Verschlechterung** als direkte Folge einer CareAI-Fehlinformation, weil:
  - Human-in-the-Loop (Pflegefachperson bewertet vor Umsetzung)
  - Basispflege (Lagerung, Mobilisation, Ernährung) erfolgt standardmäßig unabhängig von CareAI
  - Alerts sind **zusätzlich**, nicht ersetzend
- **Keine schwere Gesundheitsverschlechterung / kein chirurgischer Eingriff** als direkte kausale Folge. Dekubitus Grad 3/4 und sturzbedingte Frakturen können theoretisch verschlimmert werden, aber der Kausalpfad geht über die klinische Entscheidung des Personals.

→ **Nicht Klasse III. Nicht Klasse IIb. → Klasse IIa.**

### Kriterium 3: Monitoring vitaler Parameter?

CareAI **überwacht keine vitalen physiologischen Parameter in Echtzeit**. Dokumentierte Vitalwerte werden retrospektiv in die Risikobewertung einbezogen, aber nicht gemonitort.

→ **Keine Sonderklassifizierung.**

## Ergebnis

**CareAI SaMD = Klasse IIa** nach MDR Annex VIII Rule 11.

**Konsequenzen:**
- Konformitätsbewertung **mit Beteiligung einer Benannten Stelle** (Annex IX / X / XI).
- Empfohlen: **Annex IX** (vollständiges QMS-Audit + Baumusterprüfung der TD).
- **IEC 62304 Software-Sicherheitsklasse:** Klasse B (Nicht-lebensbedrohlich, Verletzung möglich). Begründung: Bei Fehlfunktion kann eine verzögerte Intervention theoretisch zu nicht-schwerwiegender Verletzung führen (Dekubitus Grad 1-2, leichter Sturz).

## AI Act — Konformitätsbewertung integriert

Nach AI Act Art. 43(3) kann für Hochrisiko-KI in Medizinprodukten die AI-Act-Konformitätsbewertung durch die **gleiche Benannte Stelle** im Rahmen der MDR-Zertifizierung erfolgen. Zusätzliche Anforderungen (Art. 9-14 AI Act) werden in die TD integriert (siehe Dokument 10).

## Referenzen

- MDR 2017/745 Annex VIII
- MDCG 2019-11 Rev.1 — Guidance on Qualification and Classification of Software
- IMDRF/SaMD WG/N12 — Framework on Categorization of SaMD
- MDCG 2020-1 — Guidance on Clinical Evaluation of Medical Device Software
