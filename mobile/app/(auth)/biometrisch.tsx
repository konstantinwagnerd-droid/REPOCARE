import { useEffect, useState } from 'react';
import { Alert, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Fingerprint, Shield } from 'lucide-react-native';
import { Button } from '@components/ui/Button';
import {
  authenticate,
  getSupportedTypes,
  isBiometricAvailable,
  setBiometricEnabled,
} from '@lib/biometric';

export default function BiometrischScreen() {
  const [types, setTypes] = useState<string[]>([]);
  const [available, setAvailable] = useState(false);

  useEffect(() => {
    (async () => {
      setAvailable(await isBiometricAvailable());
      setTypes(await getSupportedTypes());
    })();
  }, []);

  const enable = async () => {
    const ok = await authenticate('Biometrie aktivieren');
    if (ok) {
      setBiometricEnabled(true);
      Alert.alert('Aktiviert', 'Beim nächsten Öffnen kannst du per Biometrie entsperren.');
      router.replace('/(tabs)/dashboard');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-950 p-6">
      <View className="items-center mt-8 gap-4">
        <View className="w-20 h-20 rounded-full bg-brand-100 dark:bg-brand-900/40 items-center justify-center">
          <Fingerprint size={40} color="#0F766E" />
        </View>
        <Text className="text-2xl font-bold text-center text-gray-900 dark:text-white">
          Schneller Zugriff per Biometrie
        </Text>
        <Text className="text-center text-gray-500 max-w-sm">
          {available
            ? `Verfügbar: ${types.join(', ')}. Anmeldung in unter einer Sekunde — ideal für den Schichtdienst.`
            : 'Auf diesem Gerät ist keine Biometrie eingerichtet. Du kannst diese Funktion jederzeit in den Einstellungen aktivieren.'}
        </Text>
      </View>

      <View className="flex-row items-start gap-3 mt-8 rounded-card bg-brand-50 dark:bg-brand-900/20 p-4">
        <Shield size={20} color="#0F766E" />
        <Text className="text-xs text-brand-800 dark:text-brand-200 flex-1">
          Deine biometrischen Daten verlassen das Gerät nicht. CareAI speichert keine Fingerabdrücke oder Gesichtsdaten.
        </Text>
      </View>

      <View className="mt-auto gap-3">
        <Button
          label={available ? 'Biometrie aktivieren' : 'Ohne Biometrie fortfahren'}
          onPress={available ? enable : () => router.replace('/(tabs)/dashboard')}
          fullWidth
          size="lg"
        />
        {available && (
          <Button
            label="Später erinnern"
            variant="ghost"
            onPress={() => router.replace('/(tabs)/dashboard')}
            fullWidth
          />
        )}
      </View>
    </SafeAreaView>
  );
}
