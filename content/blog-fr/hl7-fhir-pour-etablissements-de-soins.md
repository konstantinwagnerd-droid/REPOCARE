---
title: "HL7 FHIR pour les établissements de soins : interopérabilité sans douleur"
description: "Pourquoi le standard HL7 FHIR compte pour les maisons de retraite — et comment l'adopter progressivement sans refonte majeure."
publishedAt: "2026-03-02"
updatedAt: "2026-04-17"
author: "Dr. Lukas Meier"
category: "Standards"
tags: ["HL7", "FHIR", "Interopérabilité"]
cover: "/og/blog-fhir.svg"
locale: "fr"
---

## Pourquoi FHIR

HL7 FHIR (Fast Healthcare Interoperability Resources) est la lingua franca moderne de l'interopérabilité en santé. Contrairement à HL7 v2 (basé sur des pipes et cryptique), FHIR est un standard REST/JSON lisible par l'humain et facile à intégrer.

## Les ressources qui comptent pour les soins

- **Patient** — données démographiques du résident
- **Observation** — signes vitaux, douleur, glycémie
- **CarePlan** — le plan de soins lui-même
- **MedicationAdministration** — traçabilité MAR
- **DocumentReference** — rapports SIS, transmissions, documents MDK

## Adoption progressive

Ne refaites pas tout d'un coup. Commencez par :

1. **Export Patient + Observation** vers le médecin traitant (souvent déjà demandé)
2. **Import CarePlan** depuis un établissement de retour pour éviter les ruptures
3. **MedicationAdministration** pour la chaîne pharmacie → soignant → résident

## Avantages concrets

- **Moins de double saisie** entre soins, médecine, pharmacie
- **Continuité des soins** lors des transferts hôpital ↔ EHPAD
- **Audit** : FHIR expose naturellement les horodatages et auteurs
- **Zéro verrouillage** : changer de logiciel devient possible

## CareAI et FHIR

CareAI expose une API FHIR R4 complète. Toutes les ressources listées ci-dessus sont disponibles en lecture et écriture, avec OAuth2 et SMART on FHIR pour les apps tierces.
