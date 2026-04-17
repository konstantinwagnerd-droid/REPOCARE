---
title: "HL7 FHIR per strutture assistenziali: interoperabilità senza dolore"
description: "Perché lo standard HL7 FHIR è importante per le RSA — e come adottarlo gradualmente senza stravolgimenti."
publishedAt: "2026-03-02"
updatedAt: "2026-04-17"
author: "Dr. Lukas Meier"
category: "Standard"
tags: ["HL7", "FHIR"]
cover: "/og/blog-fhir.svg"
locale: "it"
---

## Perché FHIR

HL7 FHIR (Fast Healthcare Interoperability Resources) è la moderna lingua franca dell'interoperabilità sanitaria. A differenza di HL7 v2 (criptico, basato su pipe), FHIR è uno standard REST/JSON leggibile dall'uomo.

## Le risorse che contano per l'assistenza

- **Patient** — anagrafica residente
- **Observation** — parametri vitali, dolore, glicemia
- **CarePlan** — il piano assistenziale
- **MedicationAdministration** — tracciabilità MAR
- **DocumentReference** — report SIS, consegne

## Adozione graduale

Non rifare tutto in una volta. Inizia con:

1. **Export Patient + Observation** verso il MMG
2. **Import CarePlan** dalle strutture di ritorno per evitare rotture
3. **MedicationAdministration** per la catena farmacia → operatore → residente

## Vantaggi concreti

- **Meno doppia digitazione** tra assistenza, medicina, farmacia
- **Continuità assistenziale** nei trasferimenti ospedale ↔ RSA
- **Audit**: FHIR espone timestamp e autori
- **Zero lock-in**

## CareAI e FHIR

CareAI espone API FHIR R4 complete. Tutte le risorse disponibili in lettura/scrittura, con OAuth2 e SMART on FHIR.
