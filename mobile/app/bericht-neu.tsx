import { useEffect, useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Check, Mic, Save } from 'lucide-react-native';
import { Button } from '@components/ui/Button';
import { Card } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { kv } from '@lib/storage';
import { api } from '@lib/api';
import { SIS_FIELDS, MOCK_RESIDENTS } from '@lib/mock-data';
import { cn } from '@lib/cn';

export default function BerichtNeu() {
  const { residentId } = useLocalSearchParams<{ residentId?: string }>();
  const [selectedResident, setSelectedResident] = useState(residentId ?? MOCK_RESIDENTS[0]?.id ?? '');
  const [text, setText] = useState(kv.getString('draft.bericht') ?? '');
  const [sis, setSis] = useState<string[]>([]);
  const [saved, setSaved] = useState<Date | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const autosave = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (autosave.current) clearTimeout(autosave.current);
    autosave.current = setTimeout(() => {
      kv.setString('draft.bericht', text);
      setSaved(new Date());
    }, 5000);
    return () => {
      if (autosave.current) clearTimeout(autosave.current);
    };
  }, [text]);

  const toggleSis = (key: string) =>
    setSis((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));

  const submit = async () => {
    if (!text.trim()) return Alert.alert('Bericht leer', 'Bitte Text eingeben.');
    setSubmitting(true);
    try {
      await api.post(
        '/api/reports',
        { residentId: selectedResident, text, sisFields: sis, signedAt: new Date().toISOString() },
        {
          queueOnOffline: true,
          mock: { ok: true },
        },
      );
      kv.delete('draft.bericht');
      Alert.alert('Gespeichert', 'Bericht wurde signiert und übermittelt.');
      router.back();
    } catch (e) {
      Alert.alert('Fehler', (e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-950" edges={['bottom']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
        <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 120 }}>
          <Text className="text-xs uppercase tracking-wider text-gray-500">Bewohner:in</Text>
          <View className="flex-row flex-wrap gap-2">
            {MOCK_RESIDENTS.map((r) => (
              <Pressable
                key={r.id}
                onPress={() => setSelectedResident(r.id)}
                className={cn(
                  'px-3 py-2 rounded-pill border',
                  selectedResident === r.id
                    ? 'bg-brand-700 border-brand-700'
                    : 'bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700',
                )}
              >
                <Text className={selectedResident === r.id ? 'text-white font-semibold' : 'text-gray-700 dark:text-gray-300'}>
                  {r.name}
                </Text>
              </Pressable>
            ))}
          </View>

          <Card>
            <Text className="text-xs uppercase tracking-wider text-gray-500 mb-2">Bericht</Text>
            <TextInput
              multiline
              placeholder="Beobachtungen, Maßnahmen, Auffälligkeiten…"
              placeholderTextColor="#9CA3AF"
              value={text}
              onChangeText={setText}
              className="min-h-[220] text-base text-gray-900 dark:text-white"
              style={{ textAlignVertical: 'top' }}
              accessibilityLabel="Berichtstext"
            />
            <View className="flex-row justify-between items-center mt-2">
              <Text className="text-xs text-gray-500">
                {saved ? `Auto-Save: ${saved.toLocaleTimeString('de-AT')}` : 'Auto-Save alle 5s'}
              </Text>
              <Button
                label="Diktieren"
                size="sm"
                variant="secondary"
                icon={<Mic size={16} color="#0F766E" />}
                onPress={() => router.push('/voice')}
              />
            </View>
          </Card>

          <Text className="text-xs uppercase tracking-wider text-gray-500">SIS-Themenfelder</Text>
          <View className="flex-row flex-wrap gap-2">
            {SIS_FIELDS.map((f) => {
              const active = sis.includes(f.key);
              return (
                <Pressable key={f.key} onPress={() => toggleSis(f.key)}>
                  <Badge label={f.title} tone={active ? 'brand' : 'neutral'} />
                </Pressable>
              );
            })}
          </View>

          <Card className="bg-brand-50 border-brand-200">
            <View className="flex-row items-center gap-2">
              <Save size={16} color="#0F766E" />
              <Text className="text-xs text-brand-800 flex-1">
                Entwurf bleibt lokal gespeichert — auch offline.
              </Text>
            </View>
          </Card>
        </ScrollView>

        <View className="absolute bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
          <Button
            label="Signieren & Absenden"
            icon={<Check size={18} color="#fff" />}
            onPress={submit}
            loading={submitting}
            size="lg"
            fullWidth
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
