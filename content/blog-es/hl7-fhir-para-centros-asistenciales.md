---
title: "HL7 FHIR para centros asistenciales: interoperabilidad sin dolor"
description: "Por qué el estándar HL7 FHIR importa para residencias — y cómo adoptarlo paso a paso sin reescribir todo."
publishedAt: "2026-03-02"
updatedAt: "2026-04-17"
author: "Dr. Lukas Meier"
category: "Estándares"
tags: ["HL7", "FHIR"]
cover: "/og/blog-fhir.svg"
locale: "es"
---

## Por qué FHIR

HL7 FHIR (Fast Healthcare Interoperability Resources) es la lingua franca moderna de la interoperabilidad sanitaria. A diferencia de HL7 v2 (críptico, basado en pipes), FHIR es un estándar REST/JSON legible por humanos.

## Los recursos que importan en cuidados

- **Patient** — datos demográficos del residente
- **Observation** — constantes vitales, dolor, glucemia
- **CarePlan** — el plan de cuidados
- **MedicationAdministration** — trazabilidad MAR
- **DocumentReference** — informes SIS, entregas

## Adopción gradual

No lo rehagas todo de golpe. Empieza con:

1. **Exportar Patient + Observation** al médico de familia
2. **Importar CarePlan** desde hospitalización para evitar rupturas
3. **MedicationAdministration** para la cadena farmacia → cuidador → residente

## Ventajas concretas

- **Menos doble entrada** entre cuidados, medicina, farmacia
- **Continuidad asistencial** en traslados hospital ↔ residencia
- **Auditoría**: FHIR expone marcas de tiempo y autores
- **Cero lock-in**

## CareAI y FHIR

CareAI expone una API FHIR R4 completa. Todos los recursos disponibles en lectura y escritura con OAuth2 y SMART on FHIR.
