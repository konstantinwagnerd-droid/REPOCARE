import { useEffect, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Fingerprint, LogIn } from 'lucide-react-native';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { login, useAuthStore } from '@lib/auth';
import { authenticate, isBiometricAvailable, isBiometricEnabled } from '@lib/biometric';

const schema = z.object({
  email: z.string().email('Bitte gültige E-Mail eingeben'),
  password: z.string().min(4, 'Mindestens 4 Zeichen'),
});

type FormValues = z.infer<typeof schema>;

export default function LoginScreen() {
  const setUser = useAuthStore((s) => s.setUser);
  const [loading, setLoading] = useState(false);
  const [bioAvailable, setBioAvailable] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: 'demo@careai.demo', password: 'demo2026' },
  });

  useEffect(() => {
    (async () => {
      if (isBiometricEnabled()) {
        const av = await isBiometricAvailable();
        setBioAvailable(av);
      }
    })();
  }, []);

  const onSubmit = async ({ email, password }: FormValues) => {
    setLoading(true);
    try {
      const u = await login(email, password);
      setUser(u);
      router.replace('/(tabs)/dashboard');
    } catch (e) {
      Alert.alert('Anmeldung fehlgeschlagen', (e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const unlockBiometric = async () => {
    const ok = await authenticate('CareAI entsperren');
    if (ok) router.replace('/(tabs)/dashboard');
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-gray-950">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} className="flex-1">
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24, justifyContent: 'center' }}>
          <View className="gap-2 mb-10">
            <View className="w-14 h-14 rounded-2xl bg-brand-700 items-center justify-center mb-4">
              <Text className="text-white text-2xl font-black">C</Text>
            </View>
            <Text className="text-3xl font-bold text-gray-900 dark:text-white">Willkommen bei CareAI</Text>
            <Text className="text-base text-gray-500">Bitte mit dem Dienst-Account anmelden.</Text>
          </View>

          <View className="gap-4">
            <Controller
              control={control}
              name="email"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  label="E-Mail"
                  placeholder="name@careai.demo"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.email?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="password"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  label="Passwort"
                  placeholder="••••••••"
                  secureTextEntry
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.password?.message}
                />
              )}
            />
            <Button
              label="Anmelden"
              onPress={handleSubmit(onSubmit)}
              loading={loading}
              icon={<LogIn size={18} color="#fff" />}
              fullWidth
              size="lg"
            />
            {bioAvailable && (
              <Button
                label="Mit Biometrie entsperren"
                variant="ghost"
                onPress={unlockBiometric}
                icon={<Fingerprint size={18} color="#0F766E" />}
                fullWidth
              />
            )}
          </View>

          <Text className="text-xs text-gray-400 text-center mt-8">
            Demo-Login: jede Adresse @careai.demo · Mindest-PW 4 Zeichen
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
