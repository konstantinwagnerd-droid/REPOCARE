/**
 * Wrapper um expo-notifications — lokale Test-Notifications plus
 * Helfer für das Setzen des Bereitstellungs-Handlers.
 */
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { StorageKeys, getBool, setBool } from './storage';

export async function initNotifications() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'CareAI Family',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#0F766E',
    });
  }
}

export async function requestPermissions(): Promise<boolean> {
  const { status } = await Notifications.requestPermissionsAsync();
  const granted = status === 'granted';
  setBool(StorageKeys.NotificationsEnabled, granted);
  return granted;
}

export function isNotificationsEnabled(): boolean {
  return getBool(StorageKeys.NotificationsEnabled, false);
}

export async function scheduleDemoEvent(
  kind: 'mood-up' | 'mood-down' | 'new-message' | 'new-photo',
  secondsFromNow = 2
): Promise<void> {
  const titles: Record<typeof kind, string> = {
    'mood-up': 'Gute Nachricht',
    'mood-down': 'Hinweis vom Pflegeteam',
    'new-message': 'Neue Nachricht',
    'new-photo': 'Neues Foto',
  };
  const bodies: Record<typeof kind, string> = {
    'mood-up': 'Das Wohlbefinden ist heute deutlich besser als gestern.',
    'mood-down': 'Heute geht es etwas schlechter — ein Pfleger ruft bei Bedarf zurück.',
    'new-message': 'Das Pflegeteam hat Ihnen geschrieben.',
    'new-photo': 'Ein neues Foto wurde für Sie freigegeben.',
  };
  await Notifications.scheduleNotificationAsync({
    content: {
      title: titles[kind],
      body: bodies[kind],
      data: { kind },
    },
    trigger: secondsFromNow > 0
      ? { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: secondsFromNow }
      : null,
  });
}
