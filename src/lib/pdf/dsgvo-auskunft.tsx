import React from "react";
import { Text, View } from "@react-pdf/renderer";
import { BaseDocument, BaseDocMeta, styles, fmtDate, fmtDateTime, brand } from "./pdf-base";

export interface DsgvoAuskunftData {
  resident: {
    fullName: string;
    birthdate: Date | string;
    room: string;
  };
  requestedBy: string;
  facilityName: string;
  facilityDpo?: string; // Datenschutzbeauftragte:r
  categories: Array<{
    name: string;
    purpose: string;
    legalBasis: string;
    retention: string;
    recordCount: number;
  }>;
  recipients: Array<{ name: string; purpose: string; legalBasis: string }>;
  auditEntries: Array<{ createdAt: Date | string; action: string; entityType: string; userName: string | null }>;
}

export function DsgvoAuskunftDoc({ data, meta }: { data: DsgvoAuskunftData; meta: BaseDocMeta }) {
  return (
    <BaseDocument meta={meta}>
      <View style={styles.metaBox}>
        <Text style={styles.labelSm}>Auskunft nach Art. 15 DSGVO</Text>
        <Text style={styles.value}>Betroffene Person: {data.resident.fullName} (geb. {fmtDate(data.resident.birthdate)}, Zimmer {data.resident.room})</Text>
        <Text style={styles.value}>Antragsteller:in: {data.requestedBy}</Text>
        <Text style={styles.value}>Verantwortlich: {data.facilityName}</Text>
        {data.facilityDpo ? <Text style={styles.value}>Datenschutzbeauftragte:r: {data.facilityDpo}</Text> : null}
      </View>

      <Text style={styles.para}>
        Gemäß Art. 15 DSGVO haben Sie das Recht, Auskunft über die Sie betreffenden personenbezogenen Daten zu erhalten.
        Diese Auskunft umfasst die folgenden Kategorien.
      </Text>

      <Text style={styles.h2}>1. Kategorien personenbezogener Daten</Text>
      <View style={styles.table}>
        <View style={styles.trHead}>
          <Text style={[styles.th, { flex: 2 }]}>Datenkategorie</Text>
          <Text style={[styles.th, { flex: 2 }]}>Zweck</Text>
          <Text style={[styles.th, { flex: 2 }]}>Rechtsgrundlage</Text>
          <Text style={[styles.th, { flex: 2 }]}>Speicherdauer</Text>
          <Text style={styles.th}>Datensätze</Text>
        </View>
        {data.categories.map((c, i) => (
          <View key={i} style={styles.tr}>
            <Text style={[styles.td, { flex: 2 }]}>{c.name}</Text>
            <Text style={[styles.td, { flex: 2 }]}>{c.purpose}</Text>
            <Text style={[styles.td, { flex: 2 }]}>{c.legalBasis}</Text>
            <Text style={[styles.td, { flex: 2 }]}>{c.retention}</Text>
            <Text style={styles.td}>{c.recordCount}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.h2}>2. Empfänger / Empfängerkategorien</Text>
      {data.recipients.length === 0 ? (
        <Text style={styles.para}>Keine externen Empfänger — alle Daten verbleiben in der Einrichtung.</Text>
      ) : (
        <View style={styles.table}>
          <View style={styles.trHead}>
            <Text style={[styles.th, { flex: 2 }]}>Empfänger</Text>
            <Text style={[styles.th, { flex: 3 }]}>Zweck</Text>
            <Text style={[styles.th, { flex: 2 }]}>Rechtsgrundlage</Text>
          </View>
          {data.recipients.map((r, i) => (
            <View key={i} style={styles.tr}>
              <Text style={[styles.td, { flex: 2 }]}>{r.name}</Text>
              <Text style={[styles.td, { flex: 3 }]}>{r.purpose}</Text>
              <Text style={[styles.td, { flex: 2 }]}>{r.legalBasis}</Text>
            </View>
          ))}
        </View>
      )}

      <Text style={styles.h2}>3. Ihre Rechte</Text>
      <Text style={styles.para}>• Recht auf Berichtigung (Art. 16 DSGVO)</Text>
      <Text style={styles.para}>• Recht auf Löschung (Art. 17 DSGVO) — eingeschränkt durch gesetzliche Aufbewahrungspflicht (GuKG § 5 / SGB XI: 10 Jahre)</Text>
      <Text style={styles.para}>• Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)</Text>
      <Text style={styles.para}>• Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</Text>
      <Text style={styles.para}>• Widerspruchsrecht (Art. 21 DSGVO)</Text>
      <Text style={styles.para}>• Beschwerderecht bei der zuständigen Aufsichtsbehörde (AT: Datenschutzbehörde / DE: Landesdatenschutzbeauftragte:r).</Text>

      <Text style={styles.h2}>4. Letzte Datenzugriffe (Audit-Auszug)</Text>
      <View style={styles.table}>
        <View style={styles.trHead}>
          <Text style={[styles.th, { flex: 2 }]}>Zeit</Text>
          <Text style={styles.th}>Aktion</Text>
          <Text style={[styles.th, { flex: 2 }]}>Entität</Text>
          <Text style={[styles.th, { flex: 2 }]}>Nutzer:in</Text>
        </View>
        {data.auditEntries.slice(0, 40).map((e, i) => (
          <View key={i} style={styles.tr}>
            <Text style={[styles.td, { flex: 2 }]}>{fmtDateTime(e.createdAt)}</Text>
            <Text style={styles.td}>{e.action}</Text>
            <Text style={[styles.td, { flex: 2 }]}>{e.entityType}</Text>
            <Text style={[styles.td, { flex: 2 }]}>{e.userName ?? "—"}</Text>
          </View>
        ))}
      </View>

      <View style={[styles.signBox, { borderColor: brand.primary, backgroundColor: brand.primaryLight, marginTop: 16 }]}>
        <Text style={[styles.signBoxTitle, { color: brand.primary }]}>Hinweis</Text>
        <Text>
          Diese Auskunft wurde auf Antrag der betroffenen Person / eines autorisierten Angehörigen erstellt. Der begleitende
          JSON-Datendump enthält sämtliche maschinenlesbaren Rohdaten. Fragen richten Sie bitte an {data.facilityDpo ?? "die/den Datenschutzbeauftragte:n"}.
        </Text>
      </View>
    </BaseDocument>
  );
}
