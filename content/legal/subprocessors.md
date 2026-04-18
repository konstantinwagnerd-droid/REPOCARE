# Unter-Auftragsverarbeiter (Subprocessors) — CareAI

**Version:** 1.0 | **Stand:** 2026-04-18 | **Öffentlich** unter `https://repocare.vercel.app/datenschutz/subprocessors`

CareAI setzt die folgenden Unter-Auftragsverarbeiter gemäß Art. 28 Abs. 2 DSGVO ein. Mit allen Anbietern besteht ein AV-Vertrag; wo die Mutter­gesellschaft außerhalb der EU sitzt, sind zusätzlich **Standardvertrags­klauseln (SCCs)** nach Durchführungs­beschluss (EU) 2021/914 vereinbart und die Datenverarbeitung auf EU-Regionen beschränkt.

## Aktive Unter-Auftragsverarbeiter

| Anbieter | Zweck | Standort Verarbeitung | Zertifizierung | AV-Status |
|---|---|---|---|---|
| **Hetzner Online GmbH** | Hosting, Backups, Netzwerk | Falkenstein, Sachsen (DE) | ISO 27001, DIN ISO/IEC 27001:2015, DSGVO | Aktiv |
| **Anthropic PBC** | LLM-Inferenz (Claude) | EU-Endpoint (Frankfurt, DE) | SOC 2 Type II, ISO 27001 (in Zertifizierung) | Aktiv |
| **Resend (Drip, Inc.)** | Transaktions-E-Mail | EU (Irland) | DSGVO-konform, SOC 2 | Aktiv |
| **Cloudflare, Inc.** | CDN, WAF, DDoS-Schutz | EU-first Routing | ISO 27001, SOC 2, PCI-DSS | Aktiv |
| **Supabase, Inc.** | Managed Postgres | Frankfurt (DE), AWS eu-central-1 | SOC 2, ISO 27001 (Hosting via AWS) | Aktiv |
| **Vercel, Inc.** | Application Hosting | Frankfurt (DE), eu-central-1 | SOC 2 Type II, ISO 27001 (in Arbeit) | Aktiv |

## Optional / bedingt eingesetzt

| Anbieter | Zweck | Standort | AV-Status |
|---|---|---|---|
| Sentry (Functional Software, Inc.) | Error-Tracking (pseudonymisiert, opt-in) | Frankfurt (DE) | Bereit, aktiv nach Einrichtungs-Opt-in |
| OpenAI (EU-Endpoint) | Alternative LLM-Inferenz (opt-in) | EU | Bereit, aktiv nach Einrichtungs-Opt-in |
| D-Trust / A-Trust | Qualifizierte Signatur (QES) | DE / AT | Aktiv bei Nutzung Abrechnungs-Signatur |

## Änderungs-Ankündigung

Änderungen (Hinzufügen oder Ersetzen eines Unter-Auftragsverarbeiters) werden **mindestens 30 Tage vor Wirksamwerden** unter dieser URL angekündigt. Verantwortliche können aus berechtigtem Grund widersprechen — siehe § 7 AV-Vertrag.

**Benachrichtigungs-E-Mail** bei Änderungen kann auf Wunsch bestellt werden: abo@careai.health

## Hinweise zu Drittland-Transfers

- **Hetzner, Supabase EU, Vercel EU, Anthropic EU-Endpoint, Resend EU:** Verarbeitung ausschließlich in EU-Regionen.
- **US-Muttergesellschaften (Anthropic, Supabase, Vercel, Resend, Cloudflare):** zusätzlich SCCs (Modul 3: Prozessor-zu-Sub-Prozessor), Verschlüsselung, strikte Zweckbindung; sofern das Unternehmen EU-US Data Privacy Framework zertifiziert ist, wird dies als zusätzliche Garantie herangezogen.
- **Kein Datenexport in Länder ohne Angemessenheits­beschluss** ohne vorherige schriftliche Weisung des Verantwortlichen.

---

**Dokument-ID:** `SUBPROC-CAREAI-v1.0` · letzte Aktualisierung 2026-04-18.

Bei Fragen: **datenschutz@careai.health**
