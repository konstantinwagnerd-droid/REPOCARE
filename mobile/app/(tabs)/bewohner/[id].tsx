import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { Phone, ChevronLeft, FilePlus2 } from 'lucide-react-native';
import { Button } from '@components/ui/Button';
import { Card } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { SegmentedControl } from '@components/ui/SegmentedControl';
import { VitalChart } from '@components/VitalChart';
import {
  useResident,
  useResidentReports,
  useResidentVitals,
  useResidentMedications,
} from '@hooks/useResidents';
import { SIS_FIELDS } from '@lib/mock-data';

const TABS = [
  { key: 'overview', label: 'Übersicht' },
  { key: 'sis', label: 'SIS' },
  { key: 'massnahmen', label: 'Maßnahmen' },
  { key: 'reports', label: 'Berichte' },
  { key: 'vitals', label: 'Vitalwerte' },
  { key: 'meds', label: 'Medikation' },
  { key: 'wunden', label: 'Wunden' },
];

export default function ResidentDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [tab, setTab] = useState('overview');
  const { data: r } = useResident(id ?? '');
  const { data: reports = [] } = useResidentReports(id ?? '');
  const { data: vitals } = useResidentVitals(id ?? '');
  const { data: meds = [] } = useResidentMedications(id ?? '');

  if (!r) return null;

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-950" edges={['top']}>
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-row items-center gap-2 px-4 py-2">
        <Button
          label="Zurück"
          variant="ghost"
          size="sm"
          icon={<ChevronLeft size={18} color="#0F766E" />}
          onPress={() => router.back()}
        />
      </View>

      <View className="px-4">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">{r.name}</Text>
        <Text className="text-sm text-gray-500">
          Zimmer {r.room} · {r.station} · geb. {r.birthdate}
        </Text>
        <View className="flex-row gap-2 mt-2 flex-wrap">
          <Badge label={`PG ${r.pflegegrad}`} tone="brand" />
          {r.tags.map((t) => (
            <Badge key={t} label={t} tone="neutral" />
          ))}
        </View>
      </View>

      <SegmentedControl segments={TABS} value={tab} onChange={setTab} />

      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 120 }}>
        {tab === 'overview' && (
          <>
            <Card>
              <Text className="text-xs uppercase tracking-wider text-gray-500 mb-2">Notfallkontakt</Text>
              <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                {r.emergencyContact.name}
              </Text>
              <Text className="text-sm text-gray-500">{r.emergencyContact.relation}</Text>
              <View className="flex-row items-center gap-2 mt-3 bg-brand-50 dark:bg-brand-900/30 p-3 rounded-button">
                <Phone size={18} color="#0F766E" />
                <Text className="text-lg font-mono text-brand-800 dark:text-brand-200">
                  {r.emergencyContact.phone}
                </Text>
              </View>
            </Card>
            <Card>
              <Text className="text-xs uppercase tracking-wider text-gray-500 mb-2">Stammdaten</Text>
              <Text className="text-sm text-gray-700 dark:text-gray-300">Geburtsdatum: {r.birthdate}</Text>
              <Text className="text-sm text-gray-700 dark:text-gray-300">Pflegegrad: {r.pflegegrad}</Text>
              <Text className="text-sm text-gray-700 dark:text-gray-300">Zimmer: {r.room}</Text>
            </Card>
            <Button
              label="Neuen Bericht schreiben"
              icon={<FilePlus2 size={18} color="#fff" />}
              onPress={() => router.push({ pathname: '/bericht-neu', params: { residentId: r.id } })}
            />
          </>
        )}

        {tab === 'sis' && (
          <>
            {SIS_FIELDS.map((f) => (
              <Card key={f.key}>
                <Text className="text-xs uppercase tracking-wider text-gray-500">{f.key}</Text>
                <Text className="text-base font-semibold mt-1 text-gray-900 dark:text-white">{f.title}</Text>
                <Text className="text-sm text-gray-500 mt-2">Keine Einträge vorhanden. Tippen zum Ergänzen.</Text>
              </Card>
            ))}
          </>
        )}

        {tab === 'massnahmen' && (
          <Card>
            <Text className="font-semibold text-gray-900 dark:text-white mb-2">Geplante Maßnahmen</Text>
            <Text className="text-sm text-gray-500">• Mobilisation 2x täglich</Text>
            <Text className="text-sm text-gray-500">• Hautinspektion Sacralbereich</Text>
            <Text className="text-sm text-gray-500">• Flüssigkeitsbilanzierung</Text>
          </Card>
        )}

        {tab === 'reports' && (
          <>
            {reports.length === 0 && (
              <Text className="text-center text-gray-500 py-8">Noch keine Berichte.</Text>
            )}
            {reports.map((rep) => (
              <Card key={rep.id}>
                <View className="flex-row justify-between">
                  <Text className="text-xs text-gray-500">
                    {new Date(rep.createdAt).toLocaleString('de-AT')}
                  </Text>
                  {rep.signed && <Badge label="signiert" tone="success" />}
                </View>
                <Text className="text-sm mt-1 text-gray-500">{rep.author}</Text>
                <Text className="text-base mt-2 text-gray-900 dark:text-white">{rep.text}</Text>
                <View className="flex-row gap-1.5 mt-2">
                  {rep.sisFields.map((s) => (
                    <Badge key={s} label={s} tone="brand" />
                  ))}
                </View>
              </Card>
            ))}
          </>
        )}

        {tab === 'vitals' && vitals && (
          <>
            {vitals.hr?.length > 0 && (
              <VitalChart title="Herzfrequenz" unit="bpm" data={vitals.hr} color="#DC2626" min={50} max={110} />
            )}
            {vitals.bp?.length > 0 && (
              <VitalChart title="Blutdruck (syst.)" unit="mmHg" data={vitals.bp} color="#0F766E" min={100} max={170} />
            )}
            {vitals.temp?.length > 0 && (
              <VitalChart title="Temperatur" unit="°C" data={vitals.temp} color="#F97316" min={35.5} max={38.5} />
            )}
          </>
        )}

        {tab === 'meds' && (
          <Card>
            <Text className="font-semibold text-gray-900 dark:text-white mb-3">MAR — heute</Text>
            {meds.map((m) => (
              <View key={m.id} className="py-2 border-b border-gray-100 dark:border-gray-800">
                <Text className="font-medium text-gray-900 dark:text-white">{m.name}</Text>
                <Text className="text-xs text-gray-500">{m.dose}</Text>
                <View className="flex-row gap-2 mt-1.5">
                  {m.schedule.map((t) => (
                    <Badge key={t} label={`${t} ${m.taken[t] ? '✓' : '○'}`} tone={m.taken[t] ? 'success' : 'warning'} />
                  ))}
                </View>
              </View>
            ))}
            {meds.length === 0 && <Text className="text-sm text-gray-500">Keine Medikation hinterlegt.</Text>}
          </Card>
        )}

        {tab === 'wunden' && (
          <Card>
            <Text className="font-semibold text-gray-900 dark:text-white">Wunddokumentation</Text>
            <Text className="text-sm text-gray-500 mt-1">Aktuell keine aktiven Wunden.</Text>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
