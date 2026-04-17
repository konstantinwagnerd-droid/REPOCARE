import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { KeyRound } from 'lucide-react-native';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { useAuthStore, verifyMagicLink } from '@lib/auth';

export default function CodeScreen() {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const setUser = useAuthStore((s) => s.setUser);

  const submit = async () => {
    setLoading(true);
    try {
      const u = await verifyMagicLink(code);
      setUser(u);
      router.replace('/(tabs)/home');
    } catch (e) {
      Alert.alert('Fehler', (e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-950">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, justifyContent: 'center' }}>
          <View className="items-center mb-10">
            <View className="w-20 h-20 rounded-3xl bg-brand-700 items-center justify-center mb-4">
              <KeyRound size={36} color="#fff" />
            </View>
            <Text className="text-3xl font-bold text-gray-900 dark:text-white">Code eingeben</Text>
            <Text className="text-base text-gray-500 text-center mt-2">
              Wir haben Ihnen einen 6-stelligen Code geschickt.
            </Text>
          </View>

          <View className="gap-4">
            <Input
              label="6-stelliger Code"
              placeholder="123456"
              keyboardType="number-pad"
              maxLength={6}
              autoComplete="one-time-code"
              value={code}
              onChangeText={(v) => setCode(v.replace(/\D/g, ''))}
            />
            <Button
              label="Bestätigen"
              onPress={submit}
              loading={loading}
              disabled={code.length !== 6}
              fullWidth
              size="lg"
            />
            <Button label="Neuen Code anfordern" variant="ghost" onPress={() => router.back()} fullWidth />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
