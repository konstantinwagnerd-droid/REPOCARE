import "dotenv/config";
import { db } from "./client";
import * as s from "./schema";
import bcrypt from "bcryptjs";
import { sql } from "drizzle-orm";

const DEMO_PASSWORD = "Demo2026!";

const residentNames = [
  "Anna Berger", "Heinrich Kovač", "Elisabeth Sommer", "Wolfgang Leitner", "Gertrude Wagner",
  "Josef Binder", "Maria Huber", "Franz Weber", "Hildegard Müller", "Karl Steiner",
  "Rosalinde Fischer", "Otto Novak",
];

const diagnoses = [
  ["Alzheimer-Demenz", "Hypertonie", "Arthrose"],
  ["Zustand nach Schlaganfall", "Vorhofflimmern"],
  ["Diabetes mellitus Typ 2", "Chronische Niereninsuffizienz"],
  ["Parkinson-Syndrom", "Osteoporose"],
  ["Multiple Sklerose"],
  ["COPD", "Koronare Herzkrankheit"],
  ["Demenz vom Lewy-Typ"],
  ["Zustand nach Hüft-TEP", "Hypertonie"],
  ["Depression", "Arthrose"],
  ["Diabetes mellitus Typ 2"],
  ["Vaskuläre Demenz", "Hypertonie"],
  ["Parkinson", "Demenz", "Dysphagie"],
];

const allergiesList = [
  ["Penicillin"], ["Jod"], ["Latex", "Erdbeeren"], [], ["Sulfonamide"], [],
  ["Pflaster"], ["Nüsse"], [], [], ["Penicillin", "Aspirin"], [],
];

const rooms = ["101", "102", "103", "114", "201", "207", "214", "305", "312", "318", "401", "405"];
const stations = ["Station A", "Station A", "Station A", "Station A", "Station B", "Station B", "Station B", "Station B", "Station C", "Station C", "Station C", "Station C"];
const pflegegrade = [2, 4, 3, 5, 4, 3, 2, 3, 4, 2, 5, 4];

const reportSamples = [
  "Frau/Herr {n} hat gut geschlafen. Frühstück vollständig eingenommen. RR und Puls im Normbereich. Stimmung ausgeglichen.",
  "Mobilisation mit Gehhilfe heute 15 Minuten — sichtlich stolz. Keine Sturzereignisse. Schmerzlevel 2/10.",
  "Nach dem Mittagessen kurze Unruhe, mit Zuwendung und Musik beruhigt. Wunde UE rechts zeigt Granulation.",
  "Besuch der Tochter hat gutgetan. Gemeinsamer Spaziergang im Garten. Abends etwas müde, früh ins Bett.",
  "Medikation planmäßig eingenommen. Flüssigkeitszufuhr heute 1,3 l — weiter aufmerksam animieren.",
  "Gute Teilnahme beim Singkreis, 5 Lieder mitgesungen. Blutzucker präprandial 132 mg/dl, i.O.",
  "Nachtruhe unruhig, zweimal geweckt, mit Orientierungshilfe zurück ins Bett. Kein Schmerzgeschehen.",
  "Gewichtskontrolle: 68,4 kg (-0,3 kg seit letzter Woche). Appetit etwas vermindert, Wunschkost angefragt.",
];

const shiftTypes = ["frueh", "spaet", "nacht"] as const;

function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function range(n: number) { return Array.from({ length: n }, (_, i) => i); }

export async function runSeed(): Promise<{ ok: true; users: number; residents: number }> {
  console.info("Seeding CareAI demo data...");

  // Truncate (soft) — only in dev
  await db.execute(sql`TRUNCATE TABLE ${s.auditLog}, ${s.shifts}, ${s.familyMessages}, ${s.riskScores}, ${s.incidents}, ${s.woundObservations}, ${s.wounds}, ${s.medicationAdministrations}, ${s.medications}, ${s.vitalSigns}, ${s.careReports}, ${s.carePlans}, ${s.sisAssessments}, ${s.residents}, ${s.users}, ${s.tenants} RESTART IDENTITY CASCADE`);

  const [tenant] = await db.insert(s.tenants).values({
    name: "Pflegezentrum Hietzing GmbH",
    address: "Lainzer Straße 100, 1130 Wien",
    plan: "professional",
  }).returning();

  const hash = await bcrypt.hash(DEMO_PASSWORD, 10);
  const userSeeds = [
    { email: "admin@careai.demo", role: "admin" as const, name: "Dr. Ahmed Sadeghi" },
    { email: "pdl@careai.demo", role: "pdl" as const, name: "Maria Kreuzer" },
    { email: "pflege@careai.demo", role: "pflegekraft" as const, name: "Anna Weber" },
    { email: "pflege2@careai.demo", role: "pflegekraft" as const, name: "Jana Hofer" },
    { email: "pflege3@careai.demo", role: "pflegekraft" as const, name: "Tobias Schreiner" },
    { email: "pflege4@careai.demo", role: "pflegekraft" as const, name: "Marko Prohaska" },
    { email: "pflege5@careai.demo", role: "pflegekraft" as const, name: "Lena Fuchsbauer" },
    { email: "familie@careai.demo", role: "angehoeriger" as const, name: "Christine Huber" },
  ];
  const insertedUsers = await db.insert(s.users).values(
    userSeeds.map((u) => ({ tenantId: tenant.id, email: u.email, passwordHash: hash, role: u.role, fullName: u.name, emailVerified: new Date() })),
  ).returning();
  console.info(`  → ${insertedUsers.length} users`);

  const pflegeUsers = insertedUsers.filter((u) => u.role === "pflegekraft");

  const residentRows = await db.insert(s.residents).values(residentNames.map((name, i) => {
    const age = 70 + Math.floor(Math.random() * 20);
    const bd = new Date(); bd.setFullYear(bd.getFullYear() - age);
    const adm = new Date(); adm.setMonth(adm.getMonth() - Math.floor(Math.random() * 36));
    return {
      tenantId: tenant.id,
      fullName: name,
      birthdate: bd,
      pflegegrad: pflegegrade[i],
      room: rooms[i],
      station: stations[i],
      admissionDate: adm,
      diagnoses: diagnoses[i],
      allergies: allergiesList[i],
      emergencyContact: { name: `${name.split(" ")[0].slice(0, 3)}ter Angehörige:r`, phone: "+43 660 1234567", relation: pick(["Tochter", "Sohn", "Ehepartner:in", "Enkel:in"]) },
      wellbeingScore: 5 + Math.floor(Math.random() * 5),
    };
  })).returning();
  console.info(`  → ${residentRows.length} residents`);

  // SIS Assessments
  for (const r of residentRows) {
    await db.insert(s.sisAssessments).values({
      residentId: r.id,
      createdBy: insertedUsers[1].id,
      themenfeld1: { finding: "Eingeschränkte Orientierung zur Zeit, Person gut erhalten.", resources: "Freut sich über Musik und Gespräche über die Vergangenheit.", needs: "Tagesstruktur, Erinnerungshilfen, Ruhephasen." },
      themenfeld2: { finding: "Mobilität mit Gehhilfe, Sturzgefahr erhöht.", resources: "Eigenmotivation zu Bewegung vorhanden.", needs: "Tägliche Mobilisation, sicheres Schuhwerk, Orientierungshilfen." },
      themenfeld3: { finding: `Grunderkrankungen: ${r.diagnoses?.join(", ")}.`, resources: "Medikamenteneinnahme kooperativ.", needs: "Vitalzeichenkontrolle, engmaschiges Monitoring." },
      themenfeld4: { finding: "Selbstversorgung bei Körperpflege teilweise möglich.", resources: "Mag Unabhängigkeit beim Essen.", needs: "Anreichen bei Bedarf, Anleitung." },
      themenfeld5: { finding: "Familie besucht regelmäßig, soziale Teilhabe im Haus aktiv.", resources: "Aufgeschlossen, freundlich.", needs: "Einbindung in Gruppenangebote, Angehörigenkommunikation." },
      themenfeld6: { finding: "Hauswirtschaftliche Tätigkeiten nicht mehr möglich.", resources: "—", needs: "Vollständige Übernahme durch Einrichtung." },
      risikoMatrix: {
        R1: { level: r.pflegegrad >= 4 ? "hoch" : "mittel", note: "Sturzrisiko" },
        R2: { level: r.pflegegrad >= 4 ? "mittel" : "niedrig", note: "Dekubitusrisiko" },
        R3: { level: "niedrig", note: "Inkontinenz" },
        R4: { level: r.diagnoses?.some((d) => d.includes("Demenz")) ? "hoch" : "niedrig", note: "Kognition" },
        R5: { level: "mittel", note: "Ernährung / Flüssigkeit" },
        R6: { level: "niedrig", note: "Schmerz" },
        R7: { level: "keins", note: "Gewaltfreie Pflege" },
      },
    });

    // Care Plans
    const planCount = 3 + Math.floor(Math.random() * 3);
    const planTitles = ["Tägliche Mobilisation", "Dekubitusprophylaxe", "Flüssigkeitsbilanz", "Schmerz-Screening", "Sozialaktivität", "Sturzprophylaxe"];
    await db.insert(s.carePlans).values(range(planCount).map((i) => ({
      residentId: r.id,
      title: planTitles[i % planTitles.length],
      description: "Nach Expertenstandard, dokumentiert im Tagesbericht.",
      frequency: pick(["täglich", "2x täglich", "wöchentlich", "bei Bedarf"]),
      responsibleRole: "pflegekraft" as const,
      status: pick(["offen", "laufend", "erledigt", "laufend"] as const),
    })));

    // Reports over last 7 days
    const reportCount = 5 + Math.floor(Math.random() * 6);
    await db.insert(s.careReports).values(range(reportCount).map(() => {
      const d = new Date(); d.setDate(d.getDate() - Math.floor(Math.random() * 7)); d.setHours(6 + Math.floor(Math.random() * 16));
      return {
        residentId: r.id,
        authorId: pick(pflegeUsers).id,
        shift: pick(shiftTypes as unknown as string[]) as never,
        content: pick(reportSamples).replace("{n}", r.fullName.split(" ")[1]),
        sisTags: [pick(["Themenfeld 2", "Themenfeld 3", "Themenfeld 4", "Themenfeld 5"])],
        createdAt: d,
      };
    }));

    // Vitals
    const vitalCount = 20 + Math.floor(Math.random() * 10);
    await db.insert(s.vitalSigns).values(range(vitalCount).flatMap(() => {
      const d = new Date(); d.setDate(d.getDate() - Math.floor(Math.random() * 14));
      return [
        { residentId: r.id, type: "puls", valueNumeric: 60 + Math.random() * 30, recordedAt: d, recordedBy: pick(pflegeUsers).id },
        { residentId: r.id, type: "blutdruck_systolisch", valueNumeric: 110 + Math.random() * 40, recordedAt: d, recordedBy: pick(pflegeUsers).id },
        { residentId: r.id, type: "temperatur", valueNumeric: 36.2 + Math.random() * 1.2, recordedAt: d, recordedBy: pick(pflegeUsers).id },
      ];
    }));
    // weekly weights
    await db.insert(s.vitalSigns).values(range(8).map((i) => {
      const d = new Date(); d.setDate(d.getDate() - i * 7);
      return { residentId: r.id, type: "gewicht", valueNumeric: 60 + Math.random() * 25, recordedAt: d, recordedBy: pick(pflegeUsers).id };
    }));

    // Medications
    const medNames = ["Ramipril 5mg", "Metformin 500mg", "ASS 100mg", "Pantoprazol 40mg", "Simvastatin 20mg"];
    const medCount = 2 + Math.floor(Math.random() * 3);
    const insertedMeds = await db.insert(s.medications).values(range(medCount).map(() => ({
      residentId: r.id,
      name: pick(medNames),
      dosage: pick(["1-0-0", "1-0-1", "1-1-1", "0-0-1"]),
      frequency: { times: ["08:00", "20:00"], days: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"] },
      startDate: new Date(Date.now() - 90 * 86400_000),
      prescribedBy: "Dr. H. Winkler",
    }))).returning();

    // MAR entries
    for (const m of insertedMeds) {
      await db.insert(s.medicationAdministrations).values(range(7).map((i) => {
        const d = new Date(); d.setDate(d.getDate() - i); d.setHours(8);
        return {
          medicationId: m.id,
          scheduledAt: d,
          administeredAt: Math.random() > 0.08 ? new Date(d.getTime() + Math.random() * 900_000) : null,
          administeredBy: pick(pflegeUsers).id,
          status: (Math.random() > 0.08 ? "verabreicht" : pick(["verweigert", "ausgefallen"] as const)) as never,
        };
      }));
    }

    // Risk Scores (timeseries)
    for (const type of ["sturz", "dekubitus", "delir"]) {
      await db.insert(s.riskScores).values(range(8).map((i) => {
        const d = new Date(); d.setDate(d.getDate() - i * 3);
        return { residentId: r.id, type, score: 2 + Math.random() * 7, computedAt: d };
      }));
    }
  }

  // Wounds (3 across residents)
  const woundSubset = residentRows.slice(0, 3);
  for (const r of woundSubset) {
    const [w] = await db.insert(s.wounds).values({
      residentId: r.id,
      location: pick(["Sakrum", "Ferse rechts", "Unterschenkel links"]),
      type: "Dekubitus",
      stage: pick(["grad_1", "grad_2", "grad_3"] as const),
      openedAt: new Date(Date.now() - 40 * 86400_000),
    }).returning();
    await db.insert(s.woundObservations).values(range(4).map((i) => {
      const d = new Date(); d.setDate(d.getDate() - i * 5);
      return { woundId: w.id, observation: pick(["Granulationsgewebe sichtbar, keine Infektzeichen.", "Rötung unverändert, Größe leicht reduziert.", "Wundrand reizlos, Exsudat mäßig."]), recordedAt: d, recordedBy: pick(pflegeUsers).id };
    }));
  }

  // Incidents
  await db.insert(s.incidents).values(range(5).map(() => {
    const r = pick(residentRows);
    const d = new Date(); d.setDate(d.getDate() - Math.floor(Math.random() * 10));
    return {
      residentId: r.id,
      type: pick(["Sturz", "Desorientierung", "Medikamentenverweigerung", "Aggression", "Infektion"]),
      severity: pick(["niedrig", "mittel", "hoch"] as const) as never,
      description: "Vorfall dokumentiert, Standardmaßnahmen eingeleitet, Angehörige informiert.",
      occurredAt: d,
      reportedBy: pick(pflegeUsers).id,
    };
  }));

  // Shifts — next 7 days
  const stationList = ["Station A", "Station B", "Station C"];
  await db.insert(s.shifts).values(range(7).flatMap((day) => pflegeUsers.slice(0, 4).map((u, i) => {
    const start = new Date(); start.setDate(start.getDate() + day - 1); start.setHours(i % 2 === 0 ? 6 : 14, 0, 0, 0);
    const end = new Date(start); end.setHours(start.getHours() + 8);
    return { tenantId: tenant.id, userId: u.id, startsAt: start, endsAt: end, station: pick(stationList) };
  })));

  // Audit log — 200+ entries
  const auditActions = ["create", "update", "read", "login"] as Array<"create" | "update" | "read" | "login">;
  const entityTypes = ["resident", "care_report", "vital_sign", "medication_administration", "care_plan", "user"];
  await db.insert(s.auditLog).values(range(220).map(() => {
    const d = new Date(); d.setTime(d.getTime() - Math.random() * 30 * 86400_000);
    return {
      tenantId: tenant.id,
      userId: pick(insertedUsers).id,
      entityType: pick(entityTypes),
      entityId: crypto.randomUUID(),
      action: pick(auditActions),
      ip: `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
      userAgent: "Mozilla/5.0 (iPad; CPU OS 17_5) CareAI/1.0",
      createdAt: d,
    };
  }));

  console.info("Seed complete. Login with Demo2026!");
  return { ok: true, users: insertedUsers.length, residents: 12 };
}

// Allow invocation via tsx CLI (npm run db:seed)
if (typeof require !== "undefined" && require.main === module) {
  runSeed().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
}
