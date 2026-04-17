import React from "react";
import { Text, View } from "@react-pdf/renderer";
import { BaseDocument, BaseDocMeta, styles, fmtDate, fmtDateTime, PageHeader, PageFooter, Watermark, brand } from "./pdf-base";

export interface AkteSection {
  key: string;
  title: string;
  render: () => React.ReactNode;
}

export interface AkteData {
  resident: {
    fullName: string;
    birthdate: Date | string;
    pflegegrad: number;
    room: string;
    station: string;
    admissionDate: Date | string;
    diagnoses?: string[];
    allergies?: string[];
    emergencyContact?: { name: string; phone: string; relation: string } | null;
  };
  period: { from: Date | string; to: Date | string };
  include: {
    stammdaten?: boolean;
    sis?: boolean;
    plan?: boolean;
    reports?: boolean;
    vitals?: boolean;
    medication?: boolean;
    wounds?: boolean;
    incidents?: boolean;
    risks?: boolean;
  };
  sis?: Record<string, { finding: string; resources: string; needs: string } | null>;
  plans?: Array<{ title: string; description: string; frequency: string; status: string }>;
  reports?: Array<{ shift: string; content: string; createdAt: Date | string; authorName?: string; signatureHash?: string | null }>;
  vitals?: Array<{ type: string; value: string; recordedAt: Date | string }>;
  medications?: Array<{ name: string; dosage: string; frequencyText?: string; prescribedBy?: string | null }>;
  mar?: Array<{ medicationName: string; scheduledAt: Date | string; status: string; notes?: string | null }>;
  wounds?: Array<{ location: string; type: string; stage: string; openedAt: Date | string; closedAt?: Date | string | null }>;
  incidents?: Array<{ type: string; severity: string; description: string; occurredAt: Date | string }>;
  risks?: Array<{ type: string; score: number; computedAt: Date | string }>;
}

const sisThemeTitles: Record<string, string> = {
  themenfeld1: "1. Kognitive und kommunikative Fähigkeiten",
  themenfeld2: "2. Mobilität und Beweglichkeit",
  themenfeld3: "3. Krankheitsbezogene Anforderungen",
  themenfeld4: "4. Selbstversorgung",
  themenfeld5: "5. Leben in sozialen Beziehungen",
  themenfeld6: "6. Haushaltsführung",
};

export function BewohnerAkteDoc({ data, meta }: { data: AkteData; meta: BaseDocMeta }) {
  const sections: AkteSection[] = [];

  if (data.include.stammdaten !== false) {
    sections.push({ key: "stammdaten", title: "1. Stammdaten", render: () => <StammdatenSection r={data.resident} /> });
  }
  if (data.include.sis && data.sis) {
    sections.push({ key: "sis", title: "2. SIS — Strukturierte Informationssammlung", render: () => <SisSection sis={data.sis!} /> });
  }
  if (data.include.plan && data.plans) {
    sections.push({ key: "plan", title: "3. Maßnahmenplan", render: () => <PlansSection plans={data.plans!} /> });
  }
  if (data.include.reports && data.reports) {
    sections.push({ key: "reports", title: "4. Pflegeberichte", render: () => <ReportsSection reports={data.reports!} /> });
  }
  if (data.include.vitals && data.vitals) {
    sections.push({ key: "vitals", title: "5. Vitalwerte", render: () => <VitalsSection vitals={data.vitals!} /> });
  }
  if (data.include.medication && data.medications) {
    sections.push({ key: "meds", title: "6. Medikation + MAR", render: () => <MedsSection meds={data.medications!} mar={data.mar} /> });
  }
  if (data.include.wounds && data.wounds) {
    sections.push({ key: "wounds", title: "7. Wunddokumentation", render: () => <WoundsSection wounds={data.wounds!} /> });
  }
  if (data.include.incidents && data.incidents) {
    sections.push({ key: "incidents", title: "8. Vorfälle & Incidents", render: () => <IncidentsSection incidents={data.incidents!} /> });
  }
  if (data.include.risks && data.risks) {
    sections.push({ key: "risks", title: "9. Risiko-Scores", render: () => <RisksSection risks={data.risks!} /> });
  }

  return (
    <BaseDocument meta={meta}>
      {/* TOC */}
      <Text style={styles.h2}>Inhaltsverzeichnis</Text>
      {sections.map((s) => (
        <Text key={s.key} style={styles.para}>• {s.title}</Text>
      ))}
      <View style={styles.metaBox}>
        <Text style={styles.labelSm}>Bewohner:in</Text>
        <Text style={styles.value}>{data.resident.fullName} · geboren {fmtDate(data.resident.birthdate)} · Pflegegrad {data.resident.pflegegrad} · Zimmer {data.resident.room}</Text>
        <Text style={styles.labelSm}>Berichtszeitraum</Text>
        <Text style={styles.value}>{fmtDate(data.period.from)} – {fmtDate(data.period.to)}</Text>
      </View>
      {sections.map((s) => (
        <View key={s.key} break>
          <PageHeader meta={meta} />
          {meta.watermark ? <Watermark text={meta.watermark} /> : null}
          <Text style={styles.title}>{s.title}</Text>
          {s.render()}
          <PageFooter meta={meta} />
        </View>
      ))}
    </BaseDocument>
  );
}

function StammdatenSection({ r }: { r: AkteData["resident"] }) {
  return (
    <View>
      <View style={styles.metaBox}>
        <View style={styles.row}>
          <View style={{ flex: 1 }}><Text style={styles.labelSm}>Name</Text><Text style={styles.value}>{r.fullName}</Text></View>
          <View style={{ flex: 1 }}><Text style={styles.labelSm}>Geboren</Text><Text style={styles.value}>{fmtDate(r.birthdate)}</Text></View>
          <View style={{ flex: 1 }}><Text style={styles.labelSm}>Aufnahme</Text><Text style={styles.value}>{fmtDate(r.admissionDate)}</Text></View>
        </View>
        <View style={[styles.row, { marginTop: 6 }]}>
          <View style={{ flex: 1 }}><Text style={styles.labelSm}>Pflegegrad</Text><Text style={styles.value}>{r.pflegegrad}</Text></View>
          <View style={{ flex: 1 }}><Text style={styles.labelSm}>Zimmer</Text><Text style={styles.value}>{r.room}</Text></View>
          <View style={{ flex: 1 }}><Text style={styles.labelSm}>Station</Text><Text style={styles.value}>{r.station}</Text></View>
        </View>
      </View>
      <Text style={styles.h3}>Diagnosen</Text>
      <Text style={styles.para}>{(r.diagnoses ?? []).join(", ") || "—"}</Text>
      <Text style={styles.h3}>Allergien</Text>
      <Text style={styles.para}>{(r.allergies ?? []).join(", ") || "—"}</Text>
      {r.emergencyContact ? (
        <>
          <Text style={styles.h3}>Notfallkontakt</Text>
          <Text style={styles.para}>
            {r.emergencyContact.name} ({r.emergencyContact.relation}) — {r.emergencyContact.phone}
          </Text>
        </>
      ) : null}
    </View>
  );
}

function SisSection({ sis }: { sis: Record<string, { finding: string; resources: string; needs: string } | null> }) {
  return (
    <View>
      {Object.keys(sisThemeTitles).map((k) => {
        const v = sis[k];
        return (
          <View key={k} style={{ marginBottom: 10 }}>
            <Text style={styles.h3}>{sisThemeTitles[k]}</Text>
            {v ? (
              <>
                <Text style={styles.para}><Text style={styles.labelSm}>Befund: </Text>{v.finding}</Text>
                <Text style={styles.para}><Text style={styles.labelSm}>Ressourcen: </Text>{v.resources}</Text>
                <Text style={styles.para}><Text style={styles.labelSm}>Bedarfe: </Text>{v.needs}</Text>
              </>
            ) : <Text style={styles.para}>Noch nicht erfasst.</Text>}
          </View>
        );
      })}
    </View>
  );
}

function PlansSection({ plans }: { plans: NonNullable<AkteData["plans"]> }) {
  return (
    <View style={styles.table}>
      <View style={styles.trHead}>
        <Text style={[styles.th, { flex: 2 }]}>Maßnahme</Text>
        <Text style={[styles.th, { flex: 3 }]}>Beschreibung</Text>
        <Text style={styles.th}>Frequenz</Text>
        <Text style={styles.th}>Status</Text>
      </View>
      {plans.map((p, i) => (
        <View key={i} style={styles.tr}>
          <Text style={[styles.td, { flex: 2 }]}>{p.title}</Text>
          <Text style={[styles.td, { flex: 3 }]}>{p.description}</Text>
          <Text style={styles.td}>{p.frequency}</Text>
          <Text style={styles.td}>{p.status}</Text>
        </View>
      ))}
    </View>
  );
}

function ReportsSection({ reports }: { reports: NonNullable<AkteData["reports"]> }) {
  return (
    <View>
      {reports.map((r, i) => (
        <View key={i} style={{ marginBottom: 10, paddingLeft: 8, borderLeft: `2 solid ${brand.primary}` }}>
          <Text style={styles.labelSm}>{fmtDateTime(r.createdAt)} · Schicht {r.shift} · {r.authorName ?? "—"}{r.signatureHash ? " · ✓ signiert" : ""}</Text>
          <Text style={styles.para}>{r.content}</Text>
        </View>
      ))}
    </View>
  );
}

function VitalsSection({ vitals }: { vitals: NonNullable<AkteData["vitals"]> }) {
  return (
    <View style={styles.table}>
      <View style={styles.trHead}>
        <Text style={[styles.th, { flex: 2 }]}>Typ</Text>
        <Text style={styles.th}>Wert</Text>
        <Text style={[styles.th, { flex: 2 }]}>Erfasst</Text>
      </View>
      {vitals.slice(0, 200).map((v, i) => (
        <View key={i} style={styles.tr}>
          <Text style={[styles.td, { flex: 2 }]}>{v.type}</Text>
          <Text style={styles.td}>{v.value}</Text>
          <Text style={[styles.td, { flex: 2 }]}>{fmtDateTime(v.recordedAt)}</Text>
        </View>
      ))}
    </View>
  );
}

function MedsSection({ meds, mar }: { meds: NonNullable<AkteData["medications"]>; mar?: AkteData["mar"] }) {
  return (
    <View>
      <Text style={styles.h3}>Aktuelle Medikation</Text>
      <View style={styles.table}>
        <View style={styles.trHead}>
          <Text style={[styles.th, { flex: 2 }]}>Wirkstoff / Name</Text>
          <Text style={styles.th}>Dosierung</Text>
          <Text style={[styles.th, { flex: 2 }]}>Einnahme</Text>
          <Text style={styles.th}>Verordnet von</Text>
        </View>
        {meds.map((m, i) => (
          <View key={i} style={styles.tr}>
            <Text style={[styles.td, { flex: 2 }]}>{m.name}</Text>
            <Text style={styles.td}>{m.dosage}</Text>
            <Text style={[styles.td, { flex: 2 }]}>{m.frequencyText ?? "—"}</Text>
            <Text style={styles.td}>{m.prescribedBy ?? "—"}</Text>
          </View>
        ))}
      </View>
      {mar && mar.length > 0 ? (
        <>
          <Text style={styles.h3}>MAR — Verabreichungen (letzte 30)</Text>
          <View style={styles.table}>
            <View style={styles.trHead}>
              <Text style={[styles.th, { flex: 2 }]}>Medikament</Text>
              <Text style={[styles.th, { flex: 2 }]}>Geplant</Text>
              <Text style={styles.th}>Status</Text>
              <Text style={[styles.th, { flex: 2 }]}>Notiz</Text>
            </View>
            {mar.slice(0, 30).map((a, i) => (
              <View key={i} style={styles.tr}>
                <Text style={[styles.td, { flex: 2 }]}>{a.medicationName}</Text>
                <Text style={[styles.td, { flex: 2 }]}>{fmtDateTime(a.scheduledAt)}</Text>
                <Text style={styles.td}>{a.status}</Text>
                <Text style={[styles.td, { flex: 2 }]}>{a.notes ?? "—"}</Text>
              </View>
            ))}
          </View>
        </>
      ) : null}
    </View>
  );
}

function WoundsSection({ wounds }: { wounds: NonNullable<AkteData["wounds"]> }) {
  return (
    <View style={styles.table}>
      <View style={styles.trHead}>
        <Text style={[styles.th, { flex: 2 }]}>Lokalisation</Text>
        <Text style={styles.th}>Typ</Text>
        <Text style={styles.th}>Grad</Text>
        <Text style={styles.th}>Eröffnet</Text>
        <Text style={styles.th}>Geschlossen</Text>
      </View>
      {wounds.map((w, i) => (
        <View key={i} style={styles.tr}>
          <Text style={[styles.td, { flex: 2 }]}>{w.location}</Text>
          <Text style={styles.td}>{w.type}</Text>
          <Text style={styles.td}>{w.stage}</Text>
          <Text style={styles.td}>{fmtDate(w.openedAt)}</Text>
          <Text style={styles.td}>{w.closedAt ? fmtDate(w.closedAt) : "offen"}</Text>
        </View>
      ))}
    </View>
  );
}

function IncidentsSection({ incidents }: { incidents: NonNullable<AkteData["incidents"]> }) {
  return (
    <View>
      {incidents.map((i, idx) => (
        <View key={idx} style={{ marginBottom: 8 }}>
          <Text style={{ fontFamily: "Helvetica-Bold" }}>{i.type} — {i.severity.toUpperCase()}</Text>
          <Text>{i.description}</Text>
          <Text style={styles.labelSm}>{fmtDateTime(i.occurredAt)}</Text>
        </View>
      ))}
    </View>
  );
}

function RisksSection({ risks }: { risks: NonNullable<AkteData["risks"]> }) {
  return (
    <View style={styles.table}>
      <View style={styles.trHead}>
        <Text style={styles.th}>Typ</Text>
        <Text style={styles.th}>Score</Text>
        <Text style={[styles.th, { flex: 2 }]}>Berechnet</Text>
      </View>
      {risks.map((r, i) => (
        <View key={i} style={styles.tr}>
          <Text style={styles.td}>{r.type}</Text>
          <Text style={styles.td}>{r.score.toFixed(1)}</Text>
          <Text style={[styles.td, { flex: 2 }]}>{fmtDateTime(r.computedAt)}</Text>
        </View>
      ))}
    </View>
  );
}
