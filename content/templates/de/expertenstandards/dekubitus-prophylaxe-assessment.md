---
id: de-es-dekubitus
title: Expertenstandard Dekubitus-Prophylaxe
jurisdiction: de
category: expertenstandards
applicable_to:
  - stationaer
  - ambulant
legal_reference: § 113a SGB XI
source_url: "https://www.dnqp.de/expertenstandards-und-auditinstrumente/"
version_date: 2023-06-01
assessment_tool: Braden-Skala (max 23 Pkt; ≤ 18 = Risiko)
---

# Dekubitus-Prophylaxe — Assessment & Maßnahmen

**Bewohner:in:** {{resident.name}} | Datum: {{datum}} | Pflegekraft: {{pk}}

## 1. Risikoeinschätzung (Braden-Skala)

| Kategorie | 1 | 2 | 3 | 4 | Punkte |
|-----------|---|---|---|---|--------|
| Sensorische Wahrnehmung | stark eingeschränkt | eingeschränkt | gering eingeschränkt | keine Einschränkung | {{b_wahrnehmung}} |
| Feuchtigkeit | ständig feucht | oft feucht | manchmal feucht | selten feucht | {{b_feuchtigkeit}} |
| Aktivität | bettlägerig | an den Stuhl gebunden | geht gelegentlich | geht regelmäßig | {{b_aktivitaet}} |
| Mobilität | komplett immobil | stark eingeschränkt | gering eingeschränkt | mobil | {{b_mobilitaet}} |
| Ernährung | sehr schlecht | unzureichend | ausreichend | sehr gut | {{b_ernaehrung}} |
| Reibung + Scherkräfte | Problem | potenzielles Problem | kein sichtbares Problem | — | {{b_reibung}} |

**Summe Braden: {{braden_summe}} Punkte** → Risikoklasse: {{braden_risiko}}

## 2. Hautinspektion
- Gefährdete Stellen: Sakrum {{haut_sakrum}}, Fersen {{haut_fersen}}, Trochanter {{haut_trochanter}}, Ellbogen {{haut_ellbogen}}
- Bereits bestehende Dekubitus: Grad {{dec_grad}}, Lokalisation {{dec_lok}}

## 3. Prophylaxe-Maßnahmen (nach DNQP)
- [ ] Bewegungsförderung (Mikro-Lagerung 30° alle {{interval}} h)
- [ ] Druckverteilung: Hilfsmittel {{hilfsmittel}}
- [ ] Hautpflege mit pH-neutralem Syndet
- [ ] Ernährung/Hydratation optimieren
- [ ] Angehörige-Schulung dokumentiert

## 4. Evaluation
Nächste Re-Einschätzung: {{reeval_datum}}


---

**Quelle:** [DNQP](https://www.dnqp.de/expertenstandards-und-auditinstrumente/) — DNQP Expertenstandard Dekubitus-Prophylaxe (2. Akt. 2017)
**Rechtsgrundlage:** § 113a SGB XI
**Stand:** 2023-06-01
