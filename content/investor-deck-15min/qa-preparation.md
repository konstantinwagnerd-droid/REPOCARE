# Q&A-Preparation — 20 antizipierte Fragen

## Kategorie A: Markt & Wettbewerb

### Q1: Warum glaubt ihr, dass Medifox euch nicht einfach zerquetscht?
**A:** Medifox ist Marktfuehrer, aber auf 20 Jahre alter Desktop-Architektur.
Sie haben 2024 ein KI-Modul nachgeruestet, das schlechte Reviews bekommt.
Native KI-Architektur ist ein 3-5-Jahres-Vorsprung. Und sie haben kein
MDR-zertifiziertes Risiko-Produkt. Wir verteidigen uns ueber Speed und
Compliance-Moat, nicht ueber Feature-Parity.

### Q2: Was ist, wenn ChatGPT-Enterprise einfach eine Pflege-App baut?
**A:** OpenAI macht keine Vertical-SaaS, und sie haben keine DACH-Pflege-
Domain-Expertise. SIS, Pflege-Recht, Compliance-Anforderungen sind nicht
trivial. Zweitens: Wir nutzen selbst LLMs als Bausteine — ein generisches
Tool ersetzt keine Plattform mit Integrationen, Workflows, Audit-Trail.

### Q3: Ist der DACH-Markt gross genug fuer eine Unicorn-Story?
**A:** Ehrliche Antwort: Eine Unicorn-Bewertung nur in DACH zu erreichen
ist ambitioniert. Unser Phase-4-Plan (post 2028) ist EU-Expansion ueber
Niederlande, Frankreich, Nordics. DACH-SAM reicht aber locker fuer eine
solide 100-Millionen-ARR-Company — das ist unser Basis-Case.

### Q4: Wie gross ist euer realistischer SOM in Jahr 3?
**A:** Modell-Basis: 25 zahlende Einrichtungen bei 600 EUR ARPU = 180k
ARR. Ziel 2027: 50 Einrichtungen = 360k ARR. Das ist konservativ — wir
haben bewusst keine Hockey-Sticks gemalt.

## Kategorie B: Produkt & Technologie

### Q5: Wie geht ihr mit KI-Halluzinationen um?
**A:** Drei Schutzschichten: Erstens, kein Output ist Befehl — jede
Pflegekraft bestaetigt. Zweitens, wir trainieren domain-spezifisch
und validieren gegen SIS-Korpus. Drittens, wir haben keine Diagnose-
Features, die echten medizinischen Schaden anrichten koennten.

### Q6: Wo lauft eure KI? On-premise, Cloud, welches Modell?
**A:** Hybrid-Architektur: Speech-to-Text lokal auf Device (Whisper
fine-tuned), Sprach-zu-Struktur in EU-Cloud (Hetzner Wien). LLM-Backbone:
Mix aus Open-Source (Llama-3 fine-tuned) und API-Call zu EU-Anthropic-
Hosting, je nach Task. Kein Daten-Transfer ausserhalb EU.

### Q7: Wie schnell koennt ihr auf Deutschland skalieren?
**A:** Produkt-seitig: 2 Wochen Konfiguration (Rechts-Unterschiede).
Sales-seitig: 6 Monate (Team-Aufbau Muenchen, erste Referenz-Kund:innen).
Wir starten Deutschland Q4 2027 aus Wien heraus, erst in Bayern.

### Q8: Wer besitzt die Trainings-Daten aus Pilot-Einrichtungen?
**A:** Die Einrichtungen besitzen ihre Daten. Wir haben ein DPA-basiertes
Recht auf anonymisiertes Training — opt-out moeglich. Differenzial-Privatsphaere
in Vorbereitung. Wichtig: Wir verkaufen keine Daten, niemals.

## Kategorie C: Business Model & Zahlen

### Q9: 78% Bruttomarge — wie realistisch bei Pflegekunden?
**A:** Cloud-Kosten fuer SIS-Voice + Berichte sind ca. 40 EUR pro
Einrichtung pro Monat. Plus 70 EUR Support (self-serve Starter, mehr
Touch bei Enterprise). Bei 599 EUR ARPU = 82% im Best-Case, 78% als
konservativer Plan.

### Q10: Wie lang ist der Sales-Cycle wirklich?
**A:** Pilot-Entscheidung: 6-9 Monate (Vorstand, Heimleitung, PDL,
Datenschutz, Betriebsrat). Vertragsverlaengerung nach Pilot: 1-3 Monate.
Das ist slow — aber Pflege ist Vertrauensmarkt, das ist kein Bug,
sondern Feature fuer Retention.

### Q11: Warum SAFE und nicht klassisches Equity?
**A:** Gruende: (1) Schnellere Abwicklung (2-4 Wochen vs. 3-6 Monate),
(2) Niedrigere Legal-Kosten, (3) Bewertungs-Diskussion wird erst bei
Series A gefuehrt. Wir sind flexibel — wenn Lead auf Equity besteht,
verhandeln wir.

### Q12: Was ist eure ESOP-Reserve?
**A:** 10% pre-Seed reserviert, verwaessert proportional. Erste Vergabe
an CTO (2-3%), Head of Pflege (1-2%), restliche Rollen 0,2-0,8%.
Vier-Jahres-Vesting mit einjaehrigem Cliff, Standard-Konditionen.

## Kategorie D: Team & Founder

### Q13: Bist du voll-committed? Du bist noch im Studium.
**A:** WU-Studium ist bewusst parallel — berufsbegleitend angelegt,
3-4 Semester-Verzoegerung akzeptiert. CareAI ist mein Primaer-Fokus,
GVS Austria-Rolle wird mit Seed-Close auf Beirats-Funktion reduziert
(20% Zeit). Ab Tag 1 nach Close: 60+h/Woche CareAI.

### Q14: Warum kein Co-Founder von Anfang an?
**A:** Ehrliche Antwort: Ich habe aktiv gesucht, aber keinen Fit
gefunden — Co-Founder-Match ist schwerer als Seed-Raise. Statt
Kompromiss habe ich alleine gestartet und sehe Seed-Close als
Co-Founder-Hiring-Event. Drei konkrete Gespraeche laufen.

### Q15: Was, wenn dich ein Bus ueberfaehrt?
**A:** Key-Person-Insurance in Vorbereitung (Mitigation fuer Investor:innen).
Code, Kunden-Dokumentation und Strategie sind in der Organisation
(GitHub, Notion, Daten-Raum). Advisor:innen koennen Bridge-CEO fuer
3-6 Monate sicherstellen.

## Kategorie E: Risiken & Exit

### Q16: Was ist euer Exit-Szenario?
**A:** Drei Pfade: (1) Strategischer Kauf durch DACH-Player wie
CompuGroup, Nexus oder einen Versicherer — 100-300 Mio EUR moeglich
bei 5-10 Mio ARR. (2) PE-Rollup mit anderen Vertical-SaaS-Assets.
(3) Langfristig IPO, aber unrealistisch fuer Seed-Investoren.

### Q17: Was ist euer Plan B, wenn aws Preseed abgelehnt wird?
**A:** Runway bleibt bestehen (Seed deckt 18 Monate). Re-Einreichung
beim naechsten Call (aws hat 3 Calls/Jahr). Parallel FFG Basisprogramm
als alternative Foerderung. Kein Projekt-Stopp.

### Q18: Was ist euer Plan B, wenn MDR laenger dauert?
**A:** Wir verkaufen V1.0 und V2.0 als "Dokumentations-Assistent",
nicht als Medizinprodukt — das ist kein MDR-Pflicht-Fall. Risiko-
Radar wird dann als "Vorschlags-Feature mit menschlicher Bestaetigung"
ausgeliefert, bis MDR durch. Marktgang nicht blockiert.

## Kategorie F: Harte Fragen

### Q19: Warum sollte ich dir als 19-Jaehrigem 500k anvertrauen?
**A:** Ehrliche Antwort: Sie sollten es nicht blind. Aber schauen
Sie auf drei Dinge: (1) Operations-Track-Record bei GVS Austria —
echte Verantwortung, echtes Budget, 3 Jahre. (2) Domain-Zugang
Pflege — nachvollziehbar ueber Interview-Log und LOI-Gespraeche.
(3) Team-Plan — ich hole mir erfahrene Co-Founder:innen und
Advisor:innen. Alter ist Risiko, aber nicht Disqualifikation.

### Q20: Wenn ihr scheitert — warum?
**A:** Wahrscheinlichster Fail-Mode: Sales-Zyklen laenger als geplant,
Pilot-zu-Full-Customer-Konversion unter 50%. Zweite Gefahr: Solo-
Founder-Burnout vor Co-Founder-Close. Drittes: Regulatorische
Ueberraschung (EU AI Act strenger als erwartet). Mein Job ist,
alle drei aktiv zu mitigieren — und bei Fail-Signalen frueh zu
pivotieren oder Mittel zurueckzugeben, nicht zu zombieren.

---

## Antwort-Prinzipien
1. **Ruhe** — bei harten Fragen 2 Sek Pause, dann antworten
2. **Ehrlichkeit** — "Gute Frage, hier ist die ehrliche Antwort:..."
3. **Konkret** — Zahlen, Namen, Zeitraeume, keine Buzzwords
4. **Unbekannt?** — "Ich melde mich per Mail mit praeziser Zahl"
5. **Nicht defensiv** — Kritik ist Chance, nicht Angriff
