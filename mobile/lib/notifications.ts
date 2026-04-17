/**
 * Push-Notifications via expo-notifications.
 * Events: incident, medication-due, handover-reminder, alert-critical.
 */
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { kv } from './storage';

export type NotificationEvent =
  | 'incident'
  | 'medication-due'
  | 'handover-reminder'
  | 'alert-critical';

export type NotificationPayload = {
  event: NotificationEvent;
  residentId?: string;
  reportId?: string;
  title: string;
  body: string;
};

const PREFS_KEY = 'notifications.prefs';
const QUIET_KEY = 'notifications.quiet';

export type NotificationPrefs = {
  incident: boolean;
  'medication-due': boolean;
  'handover-reminder': boolean;
  'alert-critical': boolean;
};

const DEFAULT_PREFS: NotificationPrefs = {
  incident: true,
  'medication-due': true,
  'handover-reminder': true,
  'alert-critical': true,
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function registerForPushNotifications(): Promise<string | null> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  let status = existing;
  if (status !== 'granted') {
    const req = await Notifications.requestPermissionsAsync();
    status = req.status;
  }
  if (status !== 'granted') return null;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('alerts', {
      name: 'Kritische Warnungen',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#F97316',
    });
  }
  try {
    const token = await Notifications.getExpoPushTokenAsync();
    return token.data;
  } catch {
    return null;
  }
}

export function getPrefs(): NotificationPrefs {
  return kv.getJSON<NotificationPrefs>(PREFS_KEY) ?? DEFAULT_PREFS;
}

export function setPrefs(prefs: NotificationPrefs) {
  kv.setJSON(PREFS_KEY, prefs);
}

export type QuietHours = { enabled: boolean; from: string; to: string };

export function getQuietHours(): QuietHours {
  return kv.getJSON<QuietHours>(QUIET_KEY) ?? { enabled: true, from: '22:00', to: '06:00' };
}

export function setQuietHours(q: QuietHours) {
  kv.setJSON(QUIET_KEY, q);
}
