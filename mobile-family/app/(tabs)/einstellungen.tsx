import { useEffect, useState } from 'react';
import { Alert, ScrollView, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Bell, Image as ImageIcon, Shield, LogOut, MessageCircle } from 'lucide-react-native';
import { Card, CardSub, CardTitle } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { useAuthStore } from '@lib/auth';
import { StorageKeys, getBool, setBool } from '@lib/storage';
import { isNotificationsEnabled, requestPermissions, scheduleDemoEvent } from '@lib/notifications';

export default function EinstellungenScreen() {
  const user = useAuthStore((s) => s.user);
  const signOut = useAuthStore((s) => s.signOut);
  const [notif, setNotif] = useState(false);
  const [fotos, setFotos] = useState(true);

  useEffect(() => {
    setNotif(isNotificationsEnabled());
    setFotos(getBool(StorageKeys.PrivacyFotos, true));
  }, []);

  const toggleNotif = async (v: boolean) => {
    if (v) {
      const ok = await requestPermissions();
      setNotif(ok);
      if (!ok) Alert.alert('Hinweis', 'Bitte Benachrichtigungen in den System-Einstellungen aktivieren.');
    } else {
      setBool(StorageKeys.NotificationsEnabled, false);
      setNotif(false);
    }
  };

  const toggleFotos = (v: boolean) => {
    setBool(StorageKeys.PrivacyFotos, v);
    setFotos(v);
  };

  const logoutNow = () => {
    Alert.alert('Abmelden?', 'Sie können sich jederzeit wieder anmelden.', [
      { text: 'Abbrechen', style: 'cancel' },
      { text: 'Abmelden', style: 'destructive', onPress: () => { signOut(); router.replace('/(auth)/email'); } },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-950" edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <View>
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">Einstellungen</Text>
          <Text className="text-sm text-gray-500 mt-1">{user?.email}</Text>
        </View>

        <Card>
          <CardTitle>Benachrichtigungen</CardTitle>
          <CardSub>Push-Benachrichtigungen bei wichtigen Ereignissen.</CardSub>
          <View className="mt-3 gap-3">
            <Row icon={<Bell size={18} color="#0F766E" />} label="Push-Benachrichtigungen">
              <Switch value={notif} onValueChange={toggleNotif} />
            </Row>
            <Button
              label="Test-Benachrichtigung auslösen"
              variant="ghost"
              icon={<MessageCircle size={18} color="#0F766E" />}
              onPress={() => scheduleDemoEvent('new-message', 1)}
              disabled={!notif}
              fullWidth
            />
          </View>
        </Card>

        <Card>
          <CardTitle>Privatsphäre</CardTitle>
          <View className="mt-3 gap-3">
            <Row icon={<ImageIcon size={18} color="#0F766E" />} label="Fotos anzeigen">
              <Switch value={fotos} onValueChange={toggleFotos} />
            </Row>
            <Row icon={<Shield size={18} color="#0F766E" />} label="Datenschutz-Info">
              <Text className="text-xs text-gray-500">DSGVO konform</Text>
            </Row>
          </View>
        </Card>

        <Card>
          <CardTitle>Konto</CardTitle>
          <CardSub>
            Angemeldet als {user?.name}, Zugriff auf {user?.residentName}.
          </CardSub>
          <View className="mt-3">
            <Button
              label="Abmelden"
              variant="danger"
              icon={<LogOut size={18} color="#fff" />}
              onPress={logoutNow}
              fullWidth
            />
          </View>
        </Card>

        <Text className="text-xs text-gray-400 text-center">CareAI Family · v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <View className="flex-row items-center gap-3">
      <View className="w-9 h-9 rounded-full bg-brand-50 dark:bg-brand-800/40 items-center justify-center">{icon}</View>
      <Text className="flex-1 text-sm text-gray-900 dark:text-white">{label}</Text>
      {children}
    </View>
  );
}
