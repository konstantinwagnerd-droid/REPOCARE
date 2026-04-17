import React from "react";
import { Text, View } from "@react-pdf/renderer";
import { BaseDocument, BaseDocMeta, styles, fmtDate, fmtDateTime, brand } from "./pdf-base";

export interface PflegeberichtData {
  resident: {
    fullName: string;
    birthdate: Date | string;
    pflegegrad: number;
    room: string;
  };
  report: {
    shift: string;
    content: string;
    createdAt: Date | string;
    sisTags?: string[] | null;
    signatureHash?: string | null;
    signedAt?: Date | string | null;
    version?: number;
  };
  author: {
    fullName: string;
    role?: string;
    personnelNumber?: string;
  };
  period: { from: Date | string; to: Date | string };
  vitals?: Array<{ type: string; value: string; recordedAt: Date | string }>;
  carePlanRefs?: Array<{ title: string; status: string }>;
  incidents?: Array<{ type: string; severity: string; description: string; occurredAt: Date | string }>;
}

export function PflegeberichtDoc({ data, meta }: { data: PflegeberichtData; meta: BaseDocMeta }) {
  return (
    <BaseDocument meta={meta}>
      {/* Kopfzeile */}
      <View style={styles.metaBox}>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.labelSm}>Bewohner:in</Text>
            <Text style={styles.value}>{data.resident.fullName}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.labelSm}>Geboren</Text>
            <Text style={styles.value}>{fmtDate(data.resident.birthdate)}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.labelSm}>Pflegegrad</Text>
            <Text style={styles.value}>{data.resident.pflegegrad}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.labelSm}>Zimmer</Text>
            <Text style={styles.value}>{data.resident.room}</Text>
          </View>
        </View>
        <View style={[styles.row, { marginTop: 6 }]}>
          <View style={{ flex: 1 }}>
            <Text style={styles.labelSm}>Berichtszeitraum</Text>
            <Text style={styles.value}>{fmtDate(data.period.from)} – {fmtDate(data.period.to)}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.labelSm}>Verfasser:in</Text>
            <Text style={styles.value}>{data.author.fullName}{data.author.role ? `, ${data.author.role}` : ""}{data.author.personnelNumber ? ` (Nr. ${data.author.personnelNumber})` : ""}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.labelSm}>Erstellt</Text>
            <Text style={styles.value}>{fmtDateTime(data.report.createdAt)}</Text>
          </View>
        </View>
      </View>

      {/* SIS-Bezug */}
      {data.report.sisTags && data.report.sisTags.length > 0 ? (
        <View style={{ flexDirection: "row", gap: 4, marginBottom: 10, flexWrap: "wrap" }}>
          <Text style={styles.labelSm}>SIS-Bezug:</Text>
          {data.report.sisTags.map((t) => (
            <Text key={t} style={styles.badge}>#{t}</Text>
          ))}
        </View>
      ) : null}

      {/* Inhalt */}
      <Text style={styles.h2}>Verlaufsdokumentation — Schicht {data.report.shift}</Text>
      <View style={{ paddingLeft: 10, borderLeft: `2 solid ${brand.primary}`, marginBottom: 12 }}>
        <Text style={styles.para}>{data.report.content}</Text>
      </View>

      {/* Vital-Werte */}
      {data.vitals && data.vitals.length > 0 ? (
        <>
          <Text style={styles.h2}>Erfasste Vitalwerte</Text>
          <View style={styles.table}>
            <View style={styles.trHead}>
              <Text style={[styles.th, { flex: 2 }]}>Typ</Text>
              <Text style={styles.th}>Wert</Text>
              <Text style={[styles.th, { flex: 2 }]}>Erfasst</Text>
            </View>
            {data.vitals.map((v, i) => (
              <View key={i} style={styles.tr}>
                <Text style={[styles.td, { flex: 2 }]}>{v.type}</Text>
                <Text style={styles.td}>{v.value}</Text>
                <Text style={[styles.td, { flex: 2 }]}>{fmtDateTime(v.recordedAt)}</Text>
              </View>
            ))}
          </View>
        </>
      ) : null}

      {/* Maßnahmen-Verweise */}
      {data.carePlanRefs && data.carePlanRefs.length > 0 ? (
        <>
          <Text style={styles.h2}>Referenzierte Maßnahmen</Text>
          {data.carePlanRefs.map((p, i) => (
            <Text key={i} style={styles.para}>• {p.title} ({p.status})</Text>
          ))}
        </>
      ) : null}

      {/* Vorkommnisse */}
      {data.incidents && data.incidents.length > 0 ? (
        <>
          <Text style={styles.h2}>Verknüpfte Vorfälle</Text>
          {data.incidents.map((i, idx) => (
            <View key={idx} style={{ marginBottom: 4 }}>
              <Text style={{ fontFamily: "Helvetica-Bold" }}>{i.type} — Schwere: {i.severity}</Text>
              <Text>{i.description}</Text>
              <Text style={styles.labelSm}>{fmtDateTime(i.occurredAt)}</Text>
            </View>
          ))}
        </>
      ) : null}

      {/* Signatur-Block */}
      {data.report.signatureHash ? (
        <View style={styles.signBox}>
          <Text style={styles.signBoxTitle}>✓ Elektronisch signiert</Text>
          <Text>
            Verfasser: {data.author.fullName}
            {"  "}| Datum: {fmtDateTime(data.report.signedAt ?? data.report.createdAt)}
          </Text>
          <Text style={styles.hashText}>Signatur-Hash: {data.report.signatureHash}</Text>
          <Text style={styles.hashText}>Version: {data.report.version ?? 1}</Text>
        </View>
      ) : (
        <View style={[styles.signBox, { borderColor: brand.warning, backgroundColor: "#FFF7E6" }]}>
          <Text style={[styles.signBoxTitle, { color: brand.warning }]}>⚠ Entwurf — nicht signiert</Text>
          <Text>Dieser Bericht ist noch nicht elektronisch signiert und kann bearbeitet werden.</Text>
        </View>
      )}

      <Text style={[styles.labelSm, { marginTop: 14 }]}>
        Aufbewahrungspflicht: 10 Jahre gemäß GuKG § 5 (AT) / SGB XI (DE).
      </Text>
    </BaseDocument>
  );
}
