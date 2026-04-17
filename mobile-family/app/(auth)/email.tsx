import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Mail, Heart } from 'lucide-react-native';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { requestMagicLink } from '@lib/auth';

export default function EmailScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setLoading(true);
    try {
      const res = await requestMagicLink(email);
      Alert.alert('Code gesendet', `Bitte prüfen Sie Ihr E-Mail-Postfach.\n\n${res.hint}`);
      router.push('/(auth)/code');
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
              <Heart size={40} color="#fff" />
            </View>
            <Text className="text-3xl font-bold text-gray-900 dark:text-white">CareAI Family</Text>
            <Text className="text-base text-gray-500 text-center mt-2">
              Bleiben Sie in Verbindung mit Ihrer Angehörigen.
            </Text>
          </View>

          <View className="gap-4">
            <Input
              label="E-Mail-Adresse"
              placeholder="familie@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              value={email}
              onChangeText={setEmail}
              accessibilityHint="Wir senden Ihnen einen einmaligen Anmelde-Code."
            />
            <Button
              label="Code anfordern"
              onPress={submit}
              loading={loading}
              disabled={email.length < 5}
              icon={<Mail size={18} color="#fff" />}
              fullWidth
              size="lg"
            />
          </View>

          <Text className="text-xs text-gray-400 text-center mt-8">
            Wir verwenden einen sicheren Magic-Link. Keine Passwörter nötig.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
