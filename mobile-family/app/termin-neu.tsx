import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';

export default function TerminNeuScreen() {
  const { type } = useLocalSearchParams<{ type?: 'visit' | 'video-call' }>();
  const isVideo = type === 'video-call';
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');

  const submit = () => {
    if (!date || !time) {
      Alert.alert('Fehlende Angaben', 'Bitte Datum und Uhrzeit eintragen.');
      return;
    }
    Alert.alert(
      'Angefragt',
      isVideo
        ? 'Ihre Videoanruf-Anfrage wurde an das Pflegeteam gesendet. Sie erhalten eine Bestätigung.'
        : 'Ihr Besuchstermin wurde eingetragen. Das Pflegeteam wird informiert.'
    );
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-950">
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={{ padding: 20, gap: 16 }}>
          <Text className="text-xl font-bold text-gray-900 dark:text-white">
            {isVideo ? 'Videoanruf anfragen' : 'Besuch planen'}
          </Text>
          <Text className="text-sm text-gray-500">
            Sie erhalten eine Bestätigung durch das Pflegeteam.
          </Text>
          <Input
            label="Datum"
            placeholder="TT.MM.JJJJ"
            value={date}
            onChangeText={setDate}
            keyboardType="numeric"
          />
          <Input
            label="Uhrzeit"
            placeholder="HH:MM"
            value={time}
            onChangeText={setTime}
            keyboardType="numeric"
          />
          <Input
            label="Notiz (optional)"
            placeholder="Hinweise für das Team …"
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={3}
          />
          <Button label={isVideo ? 'Anfragen' : 'Besuch eintragen'} onPress={submit} fullWidth size="lg" />
          <Button label="Abbrechen" variant="ghost" onPress={() => router.back()} fullWidth />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
