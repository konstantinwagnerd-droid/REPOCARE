---
title: "HL7 FHIR for care facilities: a practical primer"
description: "Why HL7 FHIR matters for care providers, which resources are relevant, and how to avoid vendor lock-in."
publishedAt: "2026-03-24"
updatedAt: "2026-04-10"
author: "Tobias Lindner"
category: "Interoperability"
tags: ["HL7", "FHIR", "Interoperability", "APIs"]
cover: "/og/blog-fhir.svg"
locale: "en"
---

## Why FHIR, why now

HL7 FHIR (Fast Healthcare Interoperability Resources) is the modern standard for exchanging health data. It uses REST + JSON and is designed for the web. In Germany, the gematik-mandated **Pflege-IO** (PIO) is based on FHIR. In Austria, ELGA is moving toward FHIR profiles. Switzerland&apos;s EPD already uses FHIR.

For a care provider, FHIR means: **your data can leave your current vendor.** That is either a relief or a threat depending on which vendor you picked.

## The resources that matter in care

- **Patient** — resident master data
- **Observation** — vitals, scores, SIS fields
- **Condition** — diagnoses (incl. ICD-10)
- **MedicationStatement / MedicationAdministration** — MAR data
- **CarePlan** — Maßnahmenplan / care plan
- **CareTeam** — who is involved
- **Encounter** — shifts, visits, episodes
- **DocumentReference** — unstructured notes

## Typical pain points

- **Vendor profiles ≠ standard profiles.** Many legacy vendors have "FHIR export" that only works with their own importer. Check for conformance to published profiles (KBV, gematik, ELGA).
- **Consent resources.** GDPR compliance requires explicit linkage of Consent resources to every processing purpose.
- **Versioning.** FHIR R4 is the de facto standard in DACH; R5 is slowly arriving.

## What CareAI does

- Native FHIR R4 APIs for all resources above
- Published profiles: KBV-Basisprofil-DE, ELGA-CDA crosswalk
- Bulk export (`$export`) for full data portability
- Zero-cost migration assistance

Interoperability is not a feature. It is a baseline.
