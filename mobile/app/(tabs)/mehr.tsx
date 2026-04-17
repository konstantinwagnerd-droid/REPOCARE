import { useState } from 'react';
import { Alert, Linking, ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import Constants from 'expo-constants';
import {
  Bell,
  ChevronRight,
  ExternalLink,
  Fingerprint,
  HelpCircle,
  LogOut,
  Moon,
  Shield,
  User,
} from 'lucide-react-native';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { logout, useAuthStore } from '@lib/auth';
import { useThemePref } from '@hooks/useThemePref';
import { isBiometricEnabled, setBiometricEnabled } from '@lib/biometric';
import { getQuietHours, setQuietHours } from '@lib/notifications';

export default function MehrScreen() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const { mode, setMode } = useThemePref();
  const [bio, setBio] = useState(isBiometricEnabled());
  const [quiet, setQuiet] = useState(getQuietHours());

  const handleLogout = async () => {
    await logout();
    setUser(null);
    router.replace('/(auth)/login');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-950" edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 120 }}>
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Mehr</Text>

        <Card>
          <View className="flex-row items-center gap-3">
            <View className="w-12 h-12 rounded-full bg-brand-700 items-center justify-center">
              <User size={22} color="#fff" />
            </View>
            <View className="flex-1">
              <Text className="font-semibold text-gray-900 dark:text-white">{user?.name ?? 'Gast'}</Text>
              <Text className="text-xs text-gray-500">{user?.email}</Text>
              <Text className="text-xs text-gray-500 capitalize">Rolle: {user?.role}</Text>
            </View>
          </View>
        </Card>

        <Text className="text-xs uppercase tracking-wider text-gray-500 mt-2">Sicherheit</Text>
        <Card>
          <Row
            icon={<Fingerprint size={18} color="#0F766E" />}
            label="Biometrisches Entsperren"
            right={
              <Switch
                value={bio}
                onValueChange={(v) => {
                  setBio(v);
                  setBiometricEnabled(v);
                }}
              />
            }
          />
        </Card>

        <Text className="text-xs uppercase tracking-wider text-gray-500 mt-2">Benachrichtigungen</Text>
        <Card>
          <Row
            icon={<Bell size={18} color="#0F766E" />}
            label="Nachtruhe (22:00 – 06:00)"
            right={
              <Switch
                value={quiet.enabled}
                onValueChange={(v) => {
                  const next = { ...quiet, enabled: v };
                  setQuiet(next);
                  setQuietHours(next);
                }}
              />
            }
          />
        </Card>

        <Text className="text-xs uppercase tracking-wider text-gray-500 mt-2">Darstellung</Text>
        <Card>
          <View className="flex-row items-center gap-3 mb-3">
            <Moon size={18} color="#0F766E" />
            <Text className="flex-1 text-gray-900 dark:text-white">Theme</Text>
          </View>
          <View className="flex-row gap-2">
            {(['system', 'light', 'dark'] as const).map((m) => (
              <Button
                key={m}
                label={m === 'system' ? 'System' : m === 'light' ? 'Hell' : 'Dunkel'}
                variant={mode === m ? 'primary' : 'secondary'}
                size="sm"
                onPress={() => setMode(m)}
                className="flex-1"
              />
            ))}
          </View>
        </Card>

        <Text className="text-xs uppercase tracking-wider text-gray-500 mt-2">Datenschutz & Hilfe</Text>
        <Card>
          <LinkRow
            icon={<Shield size={18} color="#0F766E" />}
            label="Datenschutz-Hinweise"
            onPress={() => Linking.openURL('https://careai.demo/datenschutz')}
          />
          <Divider />
          <LinkRow
            icon={<ExternalLink size={18} color="#0F766E" />}
            label="Impressum"
            onPress={() => Linking.openURL('https://careai.demo/impressum')}
          />
          <Divider />
          <LinkRow
            icon={<HelpCircle size={18} color="#0F766E" />}
            label="Hilfe & Support"
            onPress={() => Linking.openURL('mailto:support@careai.demo')}
          />
        </Card>

        <Button
          label="Abmelden"
          variant="danger"
          icon={<LogOut size={18} color="#fff" />}
          onPress={() => Alert.alert('Abmelden?', 'Du wirst von diesem Gerät abgemeldet.', [
            { text: 'Abbrechen', style: 'cancel' },
            { text: 'Abmelden', style: 'destructive', onPress: handleLogout },
          ])}
          className="mt-4"
        />

        <Text className="text-center text-xs text-gray-400 mt-4">
          CareAI Mobile · v{Constants.expoConfig?.version ?? '1.0.0'} (Build {Constants.expoConfig?.ios?.buildNumber ?? '1'})
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ icon, label, right }: { icon: React.ReactNode; label: string; right?: React.ReactNode }) {
  return (
    <View className="flex-row items-center gap-3 min-h-[44]">
      {icon}
      <Text className="flex-1 text-gray-900 dark:text-white">{label}</Text>
      {right}
    </View>
  );
}

function LinkRow({ icon, label, onPress }: { icon: React.ReactNode; label: string; onPress: () => void }) {
  return (
    <View onTouchEnd={onPress} className="flex-row items-center gap-3 py-3">
      {icon}
      <Text className="flex-1 text-gray-900 dark:text-white">{label}</Text>
      <ChevronRight size={18} color="#9CA3AF" />
    </View>
  );
}

function Divider() {
  return <View className="h-px bg-gray-100 dark:bg-gray-800 my-1" />;
}
