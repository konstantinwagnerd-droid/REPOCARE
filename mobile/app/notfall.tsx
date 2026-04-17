import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { AlertTriangle, Activity, Flame, HeartPulse, Send } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { Button } from '@components/ui/Button';
import { Card } from '@components/ui/Card';
import { api } from '@lib/api';
import { MOCK_RESIDENTS } from '@lib/mock-data';
import { cn } from '@lib/cn';

const TYPES = [
  { key: 'sturz', label: 'Sturz', Icon: AlertTriangle, color: '#F97316' },
  { key: 'zustand', label: 'Zustandsverschlechterung', Icon: Activity, color: '#DC2626' },
  { key: 'verletzung', label: 'Verletzung', Icon: HeartPulse, color: '#DC2626' },
  { key: 'feuer', label: 'Feuer / Evakuierung', Icon: Flame, color: '#DC2626' },
];

export default function Notfall() {
  const [type, setType] = useState<string | null>(null);
  const [resident, setResident] = useState<string | null>(null);
  const [note, setNote] = useState('');
  const [sending, setSending] = useState(false);

  const send = async () => {
    if (!type) return Alert.alert('Fehlt', 'Bitte Notfalltyp wählen.');
    setSending(true);
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    try {
      await api.post(
        '/api/emergencies',
        { type, residentId: resident, note, createdAt: new Date().toISOString() },
        { queueOnOffline: true, mock: { ok: true } },
      );
      Alert.alert(
        'Notfall gemeldet',
        'Die PDL wurde benachrichtigt. Bitte am Ort verbleiben falls sicher.',
      );
      router.back();
    } catch (e) {
      Alert.alert('Fehler', (e as Error).message);
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-950" edges={['bottom']}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 120 }}>
        <Card className="bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800">
          <Text className="font-bold text-danger">Notfall-Meldung</Text>
          <Text className="text-sm text-red-800 dark:text-red-200 mt-1">
            Diese Meldung alarmiert die PDL und erzeugt einen Eskalations-Vorgang.
          </Text>
        </Card>

        <Text className="text-xs uppercase tracking-wider text-gray-500">Typ wählen</Text>
        <View className="gap-2">
          {TYPES.map((t) => {
            const active = type === t.key;
            return (
              <Pressable
                key={t.key}
                onPress={() => {
                  Haptics.selectionAsync();
                  setType(t.key);
                }}
                className={cn(
                  'flex-row items-center gap-3 rounded-card p-4 border',
                  active ? 'bg-brand-50 border-brand-400 dark:bg-brand-900/30' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700',
                )}
              >
                <t.Icon size={24} color={t.color} />
                <Text className={cn('flex-1 font-semibold', active ? 'text-brand-800 dark:text-brand-200' : 'text-gray-900 dark:text-white')}>
                  {t.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text className="text-xs uppercase tracking-wider text-gray-500 mt-2">Bewohner:in (optional)</Text>
        <View className="flex-row flex-wrap gap-2">
          {MOCK_RESIDENTS.map((r) => (
            <Pressable
              key={r.id}
              onPress={() => setResident(resident === r.id ? null : r.id)}
              className={cn(
                'px-3 py-2 rounded-pill border',
                resident === r.id ? 'bg-brand-700 border-brand-700' : 'bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700',
              )}
            >
              <Text className={resident === r.id ? 'text-white font-semibold' : 'text-gray-700 dark:text-gray-300'}>
                {r.name}
              </Text>
            </Pressable>
          ))}
        </View>

        <Card>
          <Text className="text-xs uppercase tracking-wider text-gray-500 mb-2">Kurzbeschreibung</Text>
          <TextInput
            multiline
            placeholder="Was ist passiert? Ort, Zeit, Maßnahmen…"
            placeholderTextColor="#9CA3AF"
            value={note}
            onChangeText={setNote}
            className="min-h-[100] text-base text-gray-900 dark:text-white"
            style={{ textAlignVertical: 'top' }}
          />
        </Card>
      </ScrollView>
      <View className="absolute bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
        <Button
          label="Notfall senden"
          variant="danger"
          icon={<Send size={18} color="#fff" />}
          onPress={send}
          loading={sending}
          size="lg"
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}
