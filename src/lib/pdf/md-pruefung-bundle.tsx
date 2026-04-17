import React from "react";
import { Text, View } from "@react-pdf/renderer";
import { BaseDocument, BaseDocMeta, styles, fmtDate, brand, PageHeader, PageFooter, Watermark } from "./pdf-base";
import type { AkteData } from "./bewohner-akte";

export interface MdBundleData {
  kind: "MD" | "NQZ";
  facilityName: string;
  period: { from: Date | string; to: Date | string };
  residents: AkteData[];
  anonymized?: boolean;
  auditor?: string;
}

/**
 * MD-Prüfungs-Bundle (DE) / NQZ-Bundle (AT). Enthält Deckblatt, Stichprobe, pro
 * Bewohner:in eine MD-taugliche Kurzakte.
 */
export function MdBundleDoc({ data, meta }: { data: MdBundleData; meta: BaseDocMeta }) {
  return (
    <BaseDocument meta={meta}>
      <View style={styles.metaBox}>
        <Text style={styles.labelSm}>Prüfungstyp</Text>
        <Text style={styles.value}>{data.kind === "MD" ? "Medizinischer Dienst (MD) — Deutschland" : "NQZ — Nationales Qualitätszertifikat Österreich"}</Text>
        <Text style={styles.labelSm}>Einrichtung</Text>
        <Text style={styles.value}>{data.facilityName}</Text>
        <Text style={styles.labelSm}>Prüfungszeitraum</Text>
        <Text style={styles.value}>{fmtDate(data.period.from)} – {fmtDate(data.period.to)}</Text>
        {data.auditor ? <><Text style={styles.labelSm}>Prüfer:in</Text><Text style={styles.value}>{data.auditor}</Text></> : null}
        {data.anonymized ? <Text style={[styles.value, { color: brand.warning, marginTop: 4 }]}>⚠ Anonymisiert für Lehre/Forschung — Namen ersetzt durch Pseudonyme.</Text> : null}
      </View>

      <Text style={styles.h2}>Stichprobe — {data.residents.length} Bewohner:innen</Text>
      <View style={styles.table}>
        <View style={styles.trHead}>
          <Text style={styles.th}>#</Text>
          <Text style={[styles.th, { flex: 2 }]}>Bewohner:in</Text>
          <Text style={styles.th}>PG</Text>
          <Text style={styles.th}>Zimmer</Text>
          <Text style={styles.th}>Aufnahme</Text>
        </View>
        {data.residents.map((r, i) => (
          <View key={i} style={styles.tr}>
            <Text style={styles.td}>{i + 1}</Text>
            <Text style={[styles.td, { flex: 2 }]}>{data.anonymized ? `Bewohner:in ${i + 1}` : r.resident.fullName}</Text>
            <Text style={styles.td}>{r.resident.pflegegrad}</Text>
            <Text style={styles.td}>{r.resident.room}</Text>
            <Text style={styles.td}>{fmtDate(r.resident.admissionDate)}</Text>
          </View>
        ))}
      </View>

      <Text style={[styles.labelSm, { marginTop: 10 }]}>
        Die folgenden Seiten enthalten je eine vollständige MD-/NQZ-taugliche Kurzdokumentation.
        Strukturmodell-konform: Stammdaten → SIS → Maßnahmenplan → Pflegeberichte (30 Tage) → Medikation → Wunddoku → Incidents.
      </Text>

      {data.residents.map((r, i) => (
        <View key={i} break>
          <PageHeader meta={meta} />
          {meta.watermark ? <Watermark text={meta.watermark} /> : null}
          <Text style={styles.title}>Akte #{i + 1} — {data.anonymized ? `Bewohner:in ${i + 1}` : r.resident.fullName}</Text>
          <Text style={styles.subtitle}>Pflegegrad {r.resident.pflegegrad} · Zimmer {r.resident.room}</Text>

          <Text style={styles.h3}>Stammdaten</Text>
          <Text style={styles.para}>
            Geboren: {fmtDate(r.resident.birthdate)} · Aufnahme: {fmtDate(r.resident.admissionDate)} · Station: {r.resident.station}
          </Text>

          {r.sis ? (
            <>
              <Text style={styles.h3}>SIS — Kurzfassung</Text>
              {Object.entries(r.sis).slice(0, 6).map(([k, v]) => (
                <Text key={k} style={styles.para}>
                  <Text style={styles.labelSm}>{k}: </Text>
                  {v ? v.finding : "—"}
                </Text>
              ))}
            </>
          ) : null}

          {r.plans && r.plans.length > 0 ? (
            <>
              <Text style={styles.h3}>Maßnahmen ({r.plans.length})</Text>
              {r.plans.slice(0, 10).map((p, idx) => (
                <Text key={idx} style={styles.para}>• {p.title} ({p.frequency}) — {p.status}</Text>
              ))}
            </>
          ) : null}

          {r.reports && r.reports.length > 0 ? (
            <>
              <Text style={styles.h3}>Pflegeberichte — letzte 30 Tage ({r.reports.length})</Text>
              {r.reports.slice(0, 10).map((rep, idx) => (
                <View key={idx} style={{ paddingLeft: 6, marginBottom: 4, borderLeft: `1 solid ${brand.border}` }}>
                  <Text style={styles.labelSm}>{fmtDate(rep.createdAt)} · {rep.shift}{rep.signatureHash ? " · ✓" : ""}</Text>
                  <Text style={styles.para}>{rep.content.slice(0, 240)}{rep.content.length > 240 ? "…" : ""}</Text>
                </View>
              ))}
            </>
          ) : null}

          {r.medications && r.medications.length > 0 ? (
            <>
              <Text style={styles.h3}>Medikation ({r.medications.length})</Text>
              {r.medications.map((m, idx) => (
                <Text key={idx} style={styles.para}>• {m.name} {m.dosage}</Text>
              ))}
            </>
          ) : null}

          {r.wounds && r.wounds.length > 0 ? (
            <>
              <Text style={styles.h3}>Wunddoku</Text>
              {r.wounds.map((w, idx) => (
                <Text key={idx} style={styles.para}>• {w.location} — {w.stage} (seit {fmtDate(w.openedAt)})</Text>
              ))}
            </>
          ) : null}

          {r.incidents && r.incidents.length > 0 ? (
            <>
              <Text style={styles.h3}>Vorfälle</Text>
              {r.incidents.map((inc, idx) => (
                <Text key={idx} style={styles.para}>• {inc.type} ({inc.severity}) — {fmtDate(inc.occurredAt)}</Text>
              ))}
            </>
          ) : null}
          <PageFooter meta={meta} />
        </View>
      ))}
    </BaseDocument>
  );
}
