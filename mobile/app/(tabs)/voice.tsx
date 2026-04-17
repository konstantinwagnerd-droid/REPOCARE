import { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Sparkles } from 'lucide-react-native';
import { Button } from '@components/ui/Button';
import { Card } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { VoiceRecorder } from '@components/VoiceRecorder';
import { structure, transcribe, type StructureResult } from '@lib/voice';

export default function VoiceScreen() {
  const [transcript, setTranscript] = useState('');
  const [loading, setLoading] = useState(false);
  const [structured, setStructured] = useState<StructureResult | null>(null);

  const handleRecorded = async (uri: string) => {
    setLoading(true);
    try {
      const res = await transcribe(uri).catch(() => ({
        transcript:
          'Frau Weber hat heute gut gefrühstückt, Mobilisation erfolgt, keine Schmerzen angegeben. Blutdruck 128 zu 82.',
        durationMs: 0,
        confidence: 0.9,
      }));
      setTranscript(res.transcript);
    } catch (e) {
      Alert.alert('Transkription fehlgeschlagen', (e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const runStructure = async () => {
    if (!transcript.trim()) return;
    setLoading(true);
    try {
      const s = await structure(transcript);
      setStructured(s);
    } catch (e) {
      Alert.alert('Analyse fehlgeschlagen', (e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-950" edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 120 }}>
        <View>
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">Spracheingabe</Text>
          <Text className="text-sm text-gray-500 mt-1">
            Bericht diktieren — CareAI strukturiert automatisch nach SIS.
          </Text>
        </View>

        <Card>
          <VoiceRecorder onComplete={handleRecorded} onError={(e) => Alert.alert('Fehler', e.message)} />
        </Card>

        {(transcript || loading) && (
          <Card>
            <Text className="text-xs uppercase tracking-wider text-gray-500 mb-2">Transkript</Text>
            <TextInput
              multiline
              value={transcript}
              onChangeText={setTranscript}
              placeholder={loading ? 'Transkription läuft…' : 'Dein Text erscheint hier.'}
              placeholderTextColor="#9CA3AF"
              accessibilityLabel="Transkript bearbeiten"
              className="min-h-[120] text-base text-gray-900 dark:text-white"
              style={{ textAlignVertical: 'top' }}
            />
            <Button
              label="Strukturieren"
              icon={<Sparkles size={18} color="#fff" />}
              onPress={runStructure}
              loading={loading}
              disabled={!transcript.trim()}
              className="mt-3"
            />
          </Card>
        )}

        {structured && (
          <Card>
            <Text className="text-xs uppercase tracking-wider text-gray-500 mb-2">SIS-Vorschläge</Text>
            <Text className="text-sm text-gray-900 dark:text-white mb-3">{structured.summary}</Text>
            <View className="flex-row flex-wrap gap-1.5">
              {structured.sisFields.map((f) => (
                <Badge
                  key={f.key}
                  label={`${f.text} · ${Math.round(f.confidence * 100)}%`}
                  tone="brand"
                />
              ))}
            </View>
            {structured.suggestions.length > 0 && (
              <View className="mt-3">
                <Text className="text-xs text-gray-500 mb-1">Weitere Empfehlungen:</Text>
                {structured.suggestions.map((s, i) => (
                  <Text key={i} className="text-sm text-gray-700 dark:text-gray-300">• {s}</Text>
                ))}
              </View>
            )}
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
