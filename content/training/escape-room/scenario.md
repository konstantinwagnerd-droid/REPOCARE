# CareAI Escape-Room — "Operation Sichere Dokumentation"

**Format:** Teamschulung als Escape-Room-Spiel.
**Teamgröße:** 4 Pflegekräfte.
**Dauer:** 60 Minuten Spiel + 30 Min Debrief.
**Ort:** Schulungsraum der Einrichtung, 4 Tablets mit CareAI-Dev-Instanz, 1 Präsentationsmonitor.

---

## Gesamt-Szenario

> **Einrichtungsbriefing 09:00 Uhr, Montag:**
> Die MD-Prüfung wurde vorverlegt — sie beginnt in **60 Minuten**.
> 8 Bewohner:innen müssen bis dahin lückenlos dokumentiert und geprüft sein. Ihr seid das Kernteam. Ihr habt CareAI, euer Wissen und 60 Minuten. Los geht's.

**Ziel:** Alle 5 Räume (Aufgaben) lösen, maximale Punktzahl erreichen, innerhalb der Zeit fertig werden.

**Punkte-System:**
- Max. 100 Punkte gesamt (20 pro Raum).
- Zeitbonus: +10 bei Fertigstellung < 50 Min.
- Team-Bonus: +5 bei keiner Auseinandersetzung mit Moderator:in nötig.
- Pass-Grenze: 70 Punkte = „MD-ready". Darunter: Debrief mit Training-Schwerpunkten.

---

## Raum 1 — "Aufnahme" (10 Min)

### Aufgaben-Text

> Frau Ingrid Panzenböck (72 Jahre) wird um 09:05 aus dem Krankenhaus zurückverlegt. Ihr habt einen Entlassungsbrief (Ausdruck liegt am Tisch) und den Auftrag, sie in CareAI komplett anzulegen, bevor die Prüfer:innen das erste Zimmer besuchen. **Ihr habt 10 Minuten.**

### Hilfsmittel auf dem Tisch
- Ausgedruckter Entlassungsbrief aus Krankenhaus (mit Diagnose-Codes, Medikation, Empfehlungen).
- Cheat-Card: „Stammdaten-Felder in CareAI".
- Zettel mit Bewohner-Präferenzen von Angehörigen (informell, handgeschrieben).

### Was zu tun ist
1. Bewohner anlegen (Stammdaten).
2. Diagnosen und ICD-Codes einpflegen.
3. Medikation übernehmen (Arzt-Verordnung aus Brief).
4. Biografie aus Angehörigen-Notizen in Freitext-Feld.
5. Ersten SIS-Impuls setzen (themenweise grobe Erstaufnahme).

### Lösungs-Walkthrough
- Stammdaten: 2 Min (Name, Geburtsdatum, Zimmer, Versicherung).
- Diagnosen: ICD-10 aus Brief (F03 Demenz, E11 Diabetes Typ 2, I10 Hypertonie) per Suche eingeben. 2 Min.
- Medikation: 3 Medikamente mit Dosis/Intervall. Alternative: Import aus Brief per OCR-Scan (Bonuspunkte!). 3 Min.
- Biografie: per Spracheingabe einlesen aus Notizen. 2 Min.
- SIS-Impuls: Mobilität, Kognition, Alltagsaktivitäten. 1 Min.

### Punkte
- Stammdaten vollständig: 5
- Diagnosen korrekt: 5
- Medikation korrekt: 5
- Biografie + SIS-Impuls: 5

### Moderations-Tipps
- Wenn Team stoppt: „Was macht ihr mit dem Entlassungsbrief? Nur lesen?" (Hinweis auf OCR).
- Wenn Zeit knapp: „Priorisiert — was MUSS für die Prüferin sichtbar sein?"

---

## Raum 2 — "SIS-Challenge" (15 Min)

### Aufgaben-Text

> Drei Bewohner:innen haben seit Wochen keinen frischen SIS-Eintrag. Die MD-Prüferin fragt bei Probeöffnung nach. **Ihr habt 15 Minuten, um für alle drei einen aktualisierten SIS zu liefern. Und zwar NICHT mit Standardfloskeln.**

### Hilfsmittel
- Kurze Steckbriefe der drei Bewohner:innen (Vorlieben, aktuelles Befinden laut Schichtbericht).
- Zugriff auf letzte Pflegeberichte der Bewohner:innen in CareAI.
- Spracheingabe-Tipps-Karte.

### Was zu tun ist
1. Pro Bewohner:in: 6 SIS-Themen durchgehen.
2. Individuelle, konkrete Antworten — keine Floskeln.
3. Spracheingabe nutzen, Zeitdruck erfordert Effizienz.

### Lösungs-Walkthrough
- 15 Min geteilt durch 3 Bewohner = 5 Min pro Person.
- Spracheingabe pro SIS-Thema: ca. 40 Sekunden.
- **Trick:** CareAI's Floskel-Detektor markiert Standardphrasen rot. Wenn etwas rot ist, umschreiben.

### Punkte
- Jede:r Bewohner:in mit 6 SIS-Themen: 5 Punkte × 3 = max. 15.
- Kein Floskel-Alarm = 5 Bonuspunkte.

### Moderations-Tipps
- Wenn Team langsam: „Spracheingabe nutzen, nicht tippen."
- Wenn floskelhaft: „Wie würdet ihr das eurer Kollegin sagen, die grade aus Urlaub kommt?"

---

## Raum 3 — "Vital-Detektive" (10 Min)

### Aufgaben-Text

> Zwei Bewohner:innen haben in den letzten Tagen verdächtige Vital-Werte — aber die Dokumentation ist unvollständig oder widersprüchlich. Nur CareAI's Anomalie-Tool weiß wo. **Findet beide Anomalien und dokumentiert eure Einschätzung.**

### Hilfsmittel
- Dashboard-Walkthrough für Anomalie-Tool.
- Normwerte-Karte (RR, Puls, Gewicht, BZ).

### Was zu tun ist
1. Dashboard → Anomalien öffnen.
2. Die zwei markierten Bewohner:innen identifizieren.
3. Ursache hypothetisieren: Messfehler? Echte Verschlechterung? Medikationseffekt?
4. Einschätzung mit Begründung in CareAI dokumentieren.
5. Handlungsempfehlung: Arzt benachrichtigen? Nachmessen? Abwarten?

### Vorbereitete Anomalien
1. **Herr Gruber (85):** Gewicht 3 kg Verlust in 2 Wochen, Nahrungsaufnahme laut Berichten normal → Verdacht auf Schilddrüse, Arzt-Kontakt empfehlen.
2. **Frau Novak (78):** Blutdruck-Werte springen: 90/60 und 180/95 am gleichen Tag → Wahrscheinlich Messtechnik-Fehler (Manschette falsch), nachmessen empfehlen.

### Punkte
- Beide Anomalien gefunden: 10.
- Begründung plausibel: 5.
- Handlungsempfehlung klar: 5.

### Moderations-Tipps
- Wenn Team nur eine findet: „Fehlt noch eine — schaut in 'Anomalien'."
- Wenn Team nur beschreibt: „Was schlagt ihr vor?"

---

## Raum 4 — "Spracheingabe-Sprint" (10 Min)

### Aufgaben-Text

> **5 Pflegeberichte in 10 Minuten.** Ausschliesslich per Spracheingabe. Kein Tippen erlaubt (außer Korrekturen). Unsauberkeit kostet.

### Hilfsmittel
- 5 Schichtbericht-Szenarien (Karten mit Fakten zu je einer Bewohner:in).
- Spracheingabe-Tipps-Karte.

### Was zu tun ist
1. Team teilt sich auf: 2 sprechen parallel an getrennten Tablets, 2 kontrollieren + korrigieren.
2. Jedes Szenario: Spracheingabe → Check → Speichern.
3. 2 Min pro Bericht maximal.

### Punkte
- Pro fertig gestelltem Bericht mit korrekter Struktur: 3 Punkte × 5 = 15.
- Kein offensichtlicher Fehler nach Korrektur: 5 Bonus.

### Moderations-Tipps
- Wenn Team nicht parallelisiert: „Ihr seid 4, nutzt alle Tablets."
- Wenn Tippwut: rote Karte (Punktabzug -1).

---

## Raum 5 — "MD-Reveal" (15 Min)

### Aufgaben-Text

> Die Prüferin hat gesprochen: sie hat stichprobenartig einen Bewohner gezogen — **Frau Aurelia Hofmann.** Ihr habt 15 Minuten, um ihre komplette Doku zu prüfen, Lücken zu finden und zu schließen. Danach kommt die Inspektion.

### Hilfsmittel
- Checkliste „Was MD-Prüfer:innen sehen wollen".
- Audit-Log-Zugriff in CareAI.
- Zugriff auf Frau Hofmanns komplettes Profil.

### Was zu tun ist
1. MD-Readiness-Score aufrufen.
2. Lückenliste durchgehen.
3. Jede Lücke fixen (Wie gelernt: SIS, Maßnahmen, Vitals, Assessments).
4. Audit-Log checken: gibt's Einträge, die Fragen aufwerfen könnten?
5. Abschlussprüfung: alle grün.

### Vorbereitete Lücken (im Demo-Setup)
- Letzter SIS-Eintrag 18 Tage alt (Soll: 14).
- Sturz-Assessment fehlt (nie gemacht).
- Maßnahmen-Evaluation für „Dekubitus-Prophylaxe" seit 8 Wochen nicht durchgeführt.
- Medikationsänderung vor 3 Tagen nicht quittiert (offene Verordnung).
- Eine Bedarfsmedikation ohne Wirkungsdokumentation.

### Punkte
- Jede Lücke gefunden & behoben: 3 Punkte × 5 = 15.
- Gesamt-Score am Ende ≥ 90%: 5 Bonus.

### Moderations-Tipps
- Wenn Team überfordert: „Nehmt die MD-Readiness-Liste von oben nach unten durch."
- Wenn Team sich bei einer Lücke festbeisst: „15 Min Timer — priorisiert Anzahl über Perfektion."

---

## Abschluss

Nach Raum 5: Summe aller Punkte, Gesamt-Zeit.

**70+ Punkte:** Willkommens-Applaus, kleines Geschenk (Mehrwegflasche CareAI).
**< 70 Punkte:** Ehrlicher Debrief mit „Was lernt ihr mit zurück" — ohne Schamgefühl.

Siehe `debrief-guide.md` für den strukturierten Ablauf nach dem Spiel.
