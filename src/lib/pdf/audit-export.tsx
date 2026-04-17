import React from "react";
import { Text, View } from "@react-pdf/renderer";
import { BaseDocument, BaseDocMeta, styles, fmtDateTime } from "./pdf-base";

export interface AuditEntry {
  createdAt: Date | string;
  userName: string | null;
  action: string;
  entityType: string;
  entityId: string;
  ip: string | null;
}

export function AuditExportDoc({
  meta,
  entries,
  filter,
}: {
  meta: BaseDocMeta;
  entries: AuditEntry[];
  filter: { from?: Date | string; to?: Date | string; user?: string; action?: string };
}) {
  return (
    <BaseDocument meta={meta}>
      <View style={styles.metaBox}>
        <Text style={styles.labelSm}>Audit-Log-Export</Text>
        <Text style={styles.value}>
          {filter.from ? `Von ${fmtDateTime(filter.from)}` : "Von Anfang"} — {filter.to ? `bis ${fmtDateTime(filter.to)}` : "bis heute"}
        </Text>
        {filter.user ? <Text style={styles.value}>Nutzer:in: {filter.user}</Text> : null}
        {filter.action ? <Text style={styles.value}>Aktion: {filter.action}</Text> : null}
        <Text style={styles.labelSm}>{entries.length} Einträge</Text>
      </View>

      <View style={styles.table}>
        <View style={styles.trHead} fixed>
          <Text style={[styles.th, { flex: 2 }]}>Zeit</Text>
          <Text style={[styles.th, { flex: 2 }]}>Nutzer:in</Text>
          <Text style={styles.th}>Aktion</Text>
          <Text style={[styles.th, { flex: 2 }]}>Entität</Text>
          <Text style={styles.th}>IP</Text>
        </View>
        {entries.map((e, i) => (
          <View key={i} style={styles.tr} wrap={false}>
            <Text style={[styles.td, { flex: 2 }]}>{fmtDateTime(e.createdAt)}</Text>
            <Text style={[styles.td, { flex: 2 }]}>{e.userName ?? "—"}</Text>
            <Text style={styles.td}>{e.action}</Text>
            <Text style={[styles.td, { flex: 2 }]}>{e.entityType} ({e.entityId.slice(0, 8)}…)</Text>
            <Text style={[styles.td, { fontFamily: "Courier", fontSize: 8 }]}>{e.ip ?? "—"}</Text>
          </View>
        ))}
      </View>

      <Text style={[styles.labelSm, { marginTop: 10 }]}>
        Dieses Audit-Log ist revisionssicher und kryptographisch gehasht. Der Hash im Footer sichert die Unverändertheit
        dieses Exports.
      </Text>
    </BaseDocument>
  );
}
