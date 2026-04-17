import React from "react";
import { Text, View, Image } from "@react-pdf/renderer";
import { BaseDocument, BaseDocMeta, styles, fmtDate, brand } from "./pdf-base";

export interface BmpEntry {
  wirkstoff: string;
  handelsname: string;
  staerke: string;
  form: string;
  morgens?: string;
  mittags?: string;
  abends?: string;
  nachts?: string;
  einheit: string;
  hinweise?: string;
  grund?: string;
}

export interface BmpData {
  resident: {
    fullName: string;
    birthdate: Date | string;
    pflegegrad: number;
  };
  issuedAt: Date | string;
  doctor?: string;
  entries: BmpEntry[];
  barcodeDataUrl?: string; // base64 PNG mock
}

/**
 * Bundeseinheitlicher Medikationsplan nach § 31a SGB V (DE). Querformat A4.
 */
export function MedikationsplanDoc({ data, meta }: { data: BmpData; meta: BaseDocMeta }) {
  return (
    <BaseDocument meta={meta} orientation="landscape">
      <View style={[styles.metaBox, { flexDirection: "row", alignItems: "center" }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.labelSm}>Bundeseinheitlicher Medikationsplan (§ 31a SGB V)</Text>
          <Text style={[styles.value, { fontFamily: "Helvetica-Bold", fontSize: 12 }]}>{data.resident.fullName}</Text>
          <Text style={styles.value}>geboren {fmtDate(data.resident.birthdate)} · Pflegegrad {data.resident.pflegegrad}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.labelSm}>Ausgestellt am</Text>
          <Text style={styles.value}>{fmtDate(data.issuedAt)}</Text>
          {data.doctor ? <><Text style={styles.labelSm}>Arzt</Text><Text style={styles.value}>{data.doctor}</Text></> : null}
        </View>
        {data.barcodeDataUrl ? (
          <View style={{ alignItems: "flex-end" }}>
            <Image src={data.barcodeDataUrl} style={{ width: 80, height: 80 }} />
            <Text style={styles.hashText}>BMP-Datamatrix (Mock)</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.table}>
        <View style={styles.trHead}>
          <Text style={[styles.th, { flex: 1.5 }]}>Wirkstoff</Text>
          <Text style={[styles.th, { flex: 1.5 }]}>Handelsname</Text>
          <Text style={styles.th}>Stärke</Text>
          <Text style={styles.th}>Form</Text>
          <Text style={styles.th}>Mor</Text>
          <Text style={styles.th}>Mit</Text>
          <Text style={styles.th}>Abd</Text>
          <Text style={styles.th}>Nac</Text>
          <Text style={styles.th}>Einheit</Text>
          <Text style={[styles.th, { flex: 2 }]}>Hinweise</Text>
          <Text style={[styles.th, { flex: 1.5 }]}>Grund</Text>
        </View>
        {data.entries.map((e, i) => (
          <View key={i} style={styles.tr}>
            <Text style={[styles.td, { flex: 1.5, fontFamily: "Helvetica-Bold" }]}>{e.wirkstoff}</Text>
            <Text style={[styles.td, { flex: 1.5 }]}>{e.handelsname}</Text>
            <Text style={styles.td}>{e.staerke}</Text>
            <Text style={styles.td}>{e.form}</Text>
            <Text style={styles.td}>{e.morgens ?? "—"}</Text>
            <Text style={styles.td}>{e.mittags ?? "—"}</Text>
            <Text style={styles.td}>{e.abends ?? "—"}</Text>
            <Text style={styles.td}>{e.nachts ?? "—"}</Text>
            <Text style={styles.td}>{e.einheit}</Text>
            <Text style={[styles.td, { flex: 2 }]}>{e.hinweise ?? "—"}</Text>
            <Text style={[styles.td, { flex: 1.5 }]}>{e.grund ?? "—"}</Text>
          </View>
        ))}
      </View>

      <Text style={[styles.labelSm, { marginTop: 10 }]}>
        Dieser Plan entspricht der Spezifikation des Bundeseinheitlichen Medikationsplans (§ 31a SGB V).
        Kontrollieren Sie alle Angaben mit Ihrem Arzt / Apotheker. Farben und Spalten gemäß BMP-Standard.
      </Text>
      <View style={{ flexDirection: "row", marginTop: 6, gap: 6 }}>
        <View style={[styles.badge, { backgroundColor: "#FFF7E6", color: brand.warning }]}><Text>Mor = Morgens</Text></View>
        <View style={[styles.badge, { backgroundColor: "#FFF7E6", color: brand.warning }]}><Text>Mit = Mittags</Text></View>
        <View style={[styles.badge, { backgroundColor: "#FFF7E6", color: brand.warning }]}><Text>Abd = Abends</Text></View>
        <View style={[styles.badge, { backgroundColor: "#FFF7E6", color: brand.warning }]}><Text>Nac = Nachts</Text></View>
      </View>
    </BaseDocument>
  );
}
