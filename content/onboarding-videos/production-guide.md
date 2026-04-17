# Production-Guide — Onboarding-Videos

**Ziel: 3 Onboarding-Videos produzieren, die Pflegekräfte respektieren, nicht belehren.**
**Budget: EUR 3.000–5.000 inhouse. Alternativ Agentur EUR 15.000.**

---

## Equipment

### Minimum (inhouse, EUR ca. 1.200 einmalig)

**Audio (wichtiger als Bild!):**
- Blue Yeti Nano USB-Mikrofon (EUR 100) — studio-tauglicher Sound ohne Studio.
- Lavalier-Mikro Rode Wireless Go II (EUR 300) — für Darsteller:in.
- Popschutz, kleiner Absorber (EUR 50).

**Kamera:**
- Sony ZV-E10 mit 16–50mm Kit (EUR 800) oder alternativ:
- iPhone 14+ für B-Roll (in vielen Fällen ausreichend).

**Beleuchtung:**
- 2x Softbox-LED 45W (EUR 200) — key + fill.
- 1x Aufsteck-Licht für Ringlicht-Effekt (EUR 60).

**Screen-Recording:**
- OBS Studio (kostenlos) auf PC.
- Bildschirm-Aufnahme iPad/iPhone via Quicktime (kostenlos).
- Loom (für schnelle Drafts, EUR 15/Monat).

### Komfort (EUR zusätzlich ca. 1.500)

- Kamerastativ Manfrotto (EUR 150).
- Tonangel + Mikro Rode NTG5 (EUR 450).
- Kamera-Monitor Feelworld (EUR 200).
- Raummiete „Aufnahmeraum" (falls Heim nicht verfügbar).

---

## Drehplan

### Tag 1 — Video 1 (Erste Pflegedokumentation)
- 09:00 Setup + Licht (1h)
- 10:00 Voiceover-Aufnahme (ca. 45 Min)
- 11:00 B-Roll mit Pflegekraft in Heim (2h — Location bereits abgestimmt mit Pilotkunde)
- 13:00 Mittagspause
- 14:00 Screen-Recording iPad mit Demo-Mandant (2h)
- 16:00 Wrap + Rohsichtung

### Tag 2 — Video 2 (Spracheingabe)
- Gleiche Struktur wie Tag 1.
- Zusatz: Split-Screen-Aufnahmen Do/Don't (30 Min).

### Tag 3 — Video 3 (Maßnahmenplan)
- Gleiche Struktur.
- Zusatz: PDL-Darsteller:in, andere Perspektive.

### Tag 4 — Post-Production
- Rohschnitt alle drei Videos.
- Review mit CSM + Produkt.

### Tag 5 — Post-Production
- Korrekturen, Farbe, Ton-Mix, Captions.
- Export, Upload.

---

## Post-Production

### Tools

- **DaVinci Resolve (Free)** — Schnitt, Farbkorrektur, Export.
- **Audacity (Free)** — Voiceover-Cleanup, De-Esser, Kompression.
- **Aegisub (Free)** — Caption-Timing.
- **Handbrake (Free)** — Final-Export-Konvertierung.

### Audio-Chain Voiceover

1. Audacity: Import.
2. Rauschprofil → Rauschunterdrückung (leicht, nicht zu aggressiv).
3. Equalizer: Low-Cut 80 Hz, leichter Boost bei 3 kHz für Verständlichkeit.
4. Compressor: Ratio 3:1, Threshold so, dass nur Lautspitzen gezähmt.
5. Normalisieren auf –3 dB.
6. Export WAV.

### Video-Chain

1. DaVinci: Import Voiceover + Screen-Recording + B-Roll.
2. Schnitt nach Shotlist.
3. Farbkorrektur B-Roll (Weißabgleich, leichte Sättigung).
4. Lower-Thirds mit Inter-Font, CareAI-Mint (#00C389).
5. Musik unter VO: Motion Array / Artlist Lizenz, max. –20 dB.
6. Export H.264, 1080p60, 10 Mbps.

### Caption-Workflow

1. Whisper (OpenAI) automatisch transkribieren.
2. Aegisub: Timing verfeinern.
3. Als SRT + VTT exportieren.
4. Bei YouTube-Upload direkt einbinden.
5. Für Embed-Variante: Burn-In optional.

---

## Distribution

### Primär
- **In-App Video-Hub:** help.careai.at/videos
- Autoplay beim ersten Login (je nach Rolle).

### Sekundär
- **YouTube-Kanal CareAI** (öffentlich, für Sales/Marketing).
- **LinkedIn** (schnittsame Teaser, 60s Cut-Downs).
- **Pilot-Kit**: QR-Code in gedrucktem Quick-Guide → Video.

---

## Versionierung

- Jedes Video bekommt Version `v1.0`, `v1.1` bei Kleinkorrekturen, `v2.0` bei Neudreh.
- Alte Versionen bleiben 90 Tage abrufbar für Kund:innen, die Links geteilt haben.

---

## Qualitäts-Standards

- **Audio muss stimmen.** Eher schlechtes Bild als schlechter Ton.
- **Captions sind Pflicht** (DSGVO-Accessibility, Lärmumgebung im Heim).
- **Keine Produktions-Musik über Voiceover** — maximal unter Intro/Outro.
- **Kein Off-Camera-Lachen, keine Outtakes im Final.**
- **Respekt** vor der Zielgruppe in jedem Frame.

---

## Review-Kriterien vor Release

- [ ] Fachlich korrekt (Review durch Pflegekraft aus Pilotkunde).
- [ ] DSGVO-konform (kein echter Bewohner, kein echter Name).
- [ ] Barrierefrei (Captions, gute Kontraste).
- [ ] Tonal respektvoll (Produkt-Lead Freigabe).
- [ ] Marke konsistent (Design-Review).
- [ ] Unter 5 Min je Video.
