/**
 * Pflegegeld-Antrag PDF
 *
 * Generiert einen rechtskonformen Antrag — entweder nach SGB XI (DE) oder BPGG (AT).
 * Daten werden auto-befuellt aus Bewohner- und Pflegedaten; PDL ergaenzt vor dem
 * finalen Druck Lueckenfelder.
 *
 * Quelle DE: Musterformular Antrag auf Leistungen der Pflegeversicherung nach § 33 SGB XI
 * Quelle AT: Musterformular Antrag auf Bundespflegegeld nach BPGG (BMASGK)
 */
import React from "react";
import { Text, View } from "@react-pdf/renderer";
import { BaseDocument, BaseDocMeta, styles, fmtDate, brand } from "./pdf-base";

export type PensionJurisdiction = "de-sgb-xi" | "at-bpgg";

export interface PensionApplicationData {
  jurisdiction: PensionJurisdiction;
  resident: {
    fullName: string;
    birthdate: Date | string;
    pflegegrad?: number | null;
    room?: string;
    admissionDate?: Date | string;
  };
  // Sozialversicherungs-/Versichertennummer
  insuranceNumber?: string;
  address?: string;
  // DE-spezifisch
  pflegekasse?: string;
  // AT-spezifisch
  versicherungstraeger?: string; // PVA, SVS, BVAEB, Land
  // Gemeinsam
  diagnoses?: string[];
  // Pflegebedarfs-Beschreibung, aus SIS / NBA befuellt
  mobilityDescription?: string;
  cognitionDescription?: string;
  selfCareDescription?: string;
  therapyDescription?: string;
  socialDescription?: string;
  // Stunden-Analyse (AT) bzw. NBA-Modul-Notizen (DE)
  monthlyHoursEstimate?: number;
  modules?: Array<{ name: string; score?: number | null; note?: string }>;
  // Angaben zur Einrichtung (bei stationaer)
  facility?: {
    name: string;
    address?: string;
    admissionDate?: Date | string;
  };
  // Unterschriften
  residentCanSign?: boolean;
  legalRepresentative?: {
    fullName: string;
    role: string; // z.B. "Erwachsenenvertreter", "Betreuer mit Aufgabenkreis Gesundheitssorge"
    address?: string;
  };
  // PDL / Einrichtungs-Ansprechperson
  submittedBy?: {
    fullName: string;
    role: string;
  };
  // Freie Notizen / Begründung
  notes?: string;
}

function GermanForm({ data }: { data: PensionApplicationData }) {
  return (
    <>
      <View style={styles.metaBox}>
        <Text style={styles.h3}>Antrag nach SGB XI</Text>
        <Text style={{ fontSize: 9, color: brand.muted }}>
          Antrag auf Leistungen der Pflegeversicherung (§ 33 SGB XI) — Festsetzung Pflegegrad
          nach dem Neuen Begutachtungsassessment (NBA)
        </Text>
      </View>

      <Text style={styles.h2}>1. Angaben zur versicherten Person</Text>
      <FieldRow label="Name, Vorname" value={data.resident.fullName} />
      <FieldRow label="Geburtsdatum" value={fmtDate(data.resident.birthdate)} />
      <FieldRow label="Versichertennummer" value={data.insuranceNumber ?? "— bitte ergänzen —"} />
      <FieldRow label="Adresse" value={data.address ?? "— bitte ergänzen —"} />
      <FieldRow label="Pflegekasse" value={data.pflegekasse ?? "— bitte ergänzen —"} />
      {data.resident.pflegegrad ? (
        <FieldRow
          label="Bisheriger Pflegegrad"
          value={`PG ${data.resident.pflegegrad}`}
        />
      ) : null}

      <Text style={styles.h2}>2. Angaben zur Einrichtung (stationär)</Text>
      <FieldRow label="Einrichtung" value={data.facility?.name ?? ""} />
      <FieldRow label="Einzug am" value={data.facility?.admissionDate ? fmtDate(data.facility.admissionDate) : "—"} />

      <Text style={styles.h2}>3. Relevante Diagnosen</Text>
      {data.diagnoses && data.diagnoses.length > 0 ? (
        data.diagnoses.map((d, i) => (
          <Text key={i} style={styles.para}>• {d}</Text>
        ))
      ) : (
        <Text style={styles.para}>— bitte aus ärztlicher Stellungnahme ergänzen —</Text>
      )}

      <Text style={styles.h2}>4. Begründung zum Pflegebedarf (NBA-Module)</Text>

      <Text style={styles.h3}>Modul 1 — Mobilität</Text>
      <Text style={styles.para}>{data.mobilityDescription || "— bitte ergänzen (10% Gewichtung im NBA) —"}</Text>

      <Text style={styles.h3}>Module 2+3 — Kognitive Fähigkeiten, Verhalten</Text>
      <Text style={styles.para}>{data.cognitionDescription || "— bitte ergänzen (15% Gewichtung) —"}</Text>

      <Text style={styles.h3}>Modul 4 — Selbstversorgung</Text>
      <Text style={styles.para}>{data.selfCareDescription || "— bitte ergänzen (40% Gewichtung) —"}</Text>

      <Text style={styles.h3}>Modul 5 — Therapie / Krankheitsbewältigung</Text>
      <Text style={styles.para}>{data.therapyDescription || "— bitte ergänzen (20% Gewichtung) —"}</Text>

      <Text style={styles.h3}>Modul 6 — Alltagsleben / Soziale Kontakte</Text>
      <Text style={styles.para}>{data.socialDescription || "— bitte ergänzen (15% Gewichtung) —"}</Text>

      {data.modules && data.modules.length > 0 ? (
        <View style={styles.table}>
          <View style={styles.trHead}>
            <Text style={[styles.th, { flex: 2 }]}>NBA-Modul</Text>
            <Text style={styles.th}>Score</Text>
            <Text style={[styles.th, { flex: 3 }]}>Hinweis</Text>
          </View>
          {data.modules.map((m, i) => (
            <View key={i} style={styles.tr}>
              <Text style={[styles.td, { flex: 2 }]}>{m.name}</Text>
              <Text style={styles.td}>{m.score ?? "—"}</Text>
              <Text style={[styles.td, { flex: 3 }]}>{m.note ?? "—"}</Text>
            </View>
          ))}
        </View>
      ) : null}

      {data.notes ? (
        <>
          <Text style={styles.h2}>5. Ergänzende Begründung</Text>
          <Text style={styles.para}>{data.notes}</Text>
        </>
      ) : null}
    </>
  );
}

function AustrianForm({ data }: { data: PensionApplicationData }) {
  return (
    <>
      <View style={styles.metaBox}>
        <Text style={styles.h3}>Antrag nach BPGG</Text>
        <Text style={{ fontSize: 9, color: brand.muted }}>
          Antrag auf Bundespflegegeld nach Bundespflegegeldgesetz (BPGG), Einstufungs­verordnung (EinstV)
        </Text>
      </View>

      <Text style={styles.h2}>1. Angaben zur antragstellenden Person</Text>
      <FieldRow label="Name, Vorname" value={data.resident.fullName} />
      <FieldRow label="Geburtsdatum" value={fmtDate(data.resident.birthdate)} />
      <FieldRow label="SV-Nummer" value={data.insuranceNumber ?? "— bitte ergänzen —"} />
      <FieldRow label="Adresse" value={data.address ?? "— bitte ergänzen —"} />
      <FieldRow
        label="Versicherungsträger"
        value={data.versicherungstraeger ?? "— PVA/SVS/BVAEB/Land, bitte prüfen —"}
      />

      <Text style={styles.h2}>2. Angaben zur Einrichtung</Text>
      <FieldRow label="Einrichtung" value={data.facility?.name ?? ""} />
      <FieldRow label="Einzug am" value={data.facility?.admissionDate ? fmtDate(data.facility.admissionDate) : "—"} />

      <Text style={styles.h2}>3. Relevante Diagnosen</Text>
      {data.diagnoses && data.diagnoses.length > 0 ? (
        data.diagnoses.map((d, i) => (
          <Text key={i} style={styles.para}>• {d}</Text>
        ))
      ) : (
        <Text style={styles.para}>— bitte aus ärztlicher Stellungnahme ergänzen —</Text>
      )}

      <Text style={styles.h2}>4. Pflegebedarfs-Beschreibung</Text>

      <Text style={styles.h3}>Mobilität &amp; Bewegung</Text>
      <Text style={styles.para}>{data.mobilityDescription || "— bitte ergänzen —"}</Text>

      <Text style={styles.h3}>Kognition &amp; Kommunikation</Text>
      <Text style={styles.para}>{data.cognitionDescription || "— bitte ergänzen —"}</Text>

      <Text style={styles.h3}>Selbstversorgung (Körperpflege, Essen, Ausscheidung)</Text>
      <Text style={styles.para}>{data.selfCareDescription || "— bitte ergänzen —"}</Text>

      <Text style={styles.h3}>Therapie &amp; Medizinische Anforderungen</Text>
      <Text style={styles.para}>{data.therapyDescription || "— bitte ergänzen —"}</Text>

      <Text style={styles.h3}>Betreuungsbedarf &amp; Tagesstruktur</Text>
      <Text style={styles.para}>{data.socialDescription || "— bitte ergänzen —"}</Text>

      <Text style={styles.h2}>5. Stunden-Analyse nach BPGG</Text>
      <Text style={styles.para}>
        Geschätzter monatlicher Pflegebedarf:{" "}
        <Text style={{ fontFamily: "Helvetica-Bold" }}>
          {data.monthlyHoursEstimate ? `${data.monthlyHoursEstimate} Stunden/Monat` : "— bitte ergänzen —"}
        </Text>
      </Text>
      <Text style={[styles.para, { fontSize: 8, color: brand.muted }]}>
        Einstufungs-Schwellen (BPGG): Stufe 1 &gt; 65h, Stufe 2 &gt; 95h, Stufe 3 &gt; 120h,
        Stufe 4 &gt; 160h, Stufen 5-7 &gt; 180h mit qualitativen Zusatzkriterien.
      </Text>

      {data.notes ? (
        <>
          <Text style={styles.h2}>6. Ergänzende Begründung</Text>
          <Text style={styles.para}>{data.notes}</Text>
        </>
      ) : null}

      <View style={[styles.metaBox, { marginTop: 10 }]}>
        <Text style={{ fontSize: 9, color: brand.muted }}>
          Hinweis nach HeimAufG / BPGG: Ärztliche Stellungnahme wird separat beigelegt. Im Fall einer
          stationären Versorgung wird das Pflegegeld (85%) an den Heimträger überwiesen; 15%
          bleiben als Taschengeld bei der bewohnenden Person (§ 13 BPGG).
        </Text>
      </View>
    </>
  );
}

function FieldRow({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={[styles.labelSm, { flex: 1 }]}>{label}</Text>
      <Text style={[styles.value, { flex: 2 }]}>{value || "—"}</Text>
    </View>
  );
}

function SignatureBlock({ data }: { data: PensionApplicationData }) {
  return (
    <View style={styles.signBox}>
      <Text style={styles.signBoxTitle}>Unterschriften</Text>

      <View style={{ flexDirection: "row", marginTop: 8, gap: 16 }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.labelSm}>
            {data.residentCanSign
              ? "Unterschrift Antragsteller:in"
              : "Unterschrift gesetzl. Vertreter:in"}
          </Text>
          <View style={{ borderBottom: `1 solid ${brand.border}`, height: 24, marginTop: 16 }} />
          {data.legalRepresentative && !data.residentCanSign ? (
            <Text style={{ fontSize: 8, color: brand.muted, marginTop: 2 }}>
              {data.legalRepresentative.fullName} ({data.legalRepresentative.role})
            </Text>
          ) : null}
        </View>

        <View style={{ flex: 1 }}>
          <Text style={styles.labelSm}>Ort, Datum</Text>
          <View style={{ borderBottom: `1 solid ${brand.border}`, height: 24, marginTop: 16 }} />
        </View>
      </View>

      {data.submittedBy ? (
        <View style={{ marginTop: 12 }}>
          <Text style={styles.labelSm}>Eingereicht durch (Einrichtung)</Text>
          <Text style={styles.value}>
            {data.submittedBy.fullName} — {data.submittedBy.role}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

export function PensionApplicationDoc({
  data,
  meta,
}: {
  data: PensionApplicationData;
  meta: BaseDocMeta;
}) {
  const isDE = data.jurisdiction === "de-sgb-xi";
  return (
    <BaseDocument meta={meta}>
      {isDE ? <GermanForm data={data} /> : <AustrianForm data={data} />}
      <SignatureBlock data={data} />
    </BaseDocument>
  );
}
