import type { Notification, NotificationPreferences, PushSubscription, DeliveryStat, NotificationEvent, NotificationChannel } from "./types";

/**
 * In-Memory-Mock-Store.
 * Produktion: durch Redis/DB ersetzen. Kein Schema-Change erlaubt → in-memory.
 * Sliding window: letzte 500 Notifications pro User.
 */

const WINDOW = 500;

// Shared module-level state (pro Node-Instanz). Demo-tauglich.
const userInbox = new Map<string, Notification[]>();
const userPrefs = new Map<string, NotificationPreferences>();
const pushSubs = new Map<string, PushSubscription[]>();
const stats: DeliveryStat[] = [];

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export const notificationStore = {
  push(userId: string, n: Notification): void {
    const arr = userInbox.get(userId) ?? [];
    arr.unshift(n);
    if (arr.length > WINDOW) arr.length = WINDOW;
    userInbox.set(userId, arr);
  },

  inbox(userId: string, filter?: "all" | "unread" | "critical"): Notification[] {
    const arr = userInbox.get(userId) ?? [];
    if (filter === "unread") return arr.filter((n) => !n.readAt);
    if (filter === "critical") return arr.filter((n) => n.kind === "critical");
    return arr;
  },

  unreadCount(userId: string): number {
    return (userInbox.get(userId) ?? []).filter((n) => !n.readAt).length;
  },

  markRead(userId: string, ids: string[]): number {
    const arr = userInbox.get(userId) ?? [];
    let changed = 0;
    const now = Date.now();
    for (const n of arr) {
      if (ids.includes(n.id) && !n.readAt) {
        n.readAt = now;
        changed++;
      }
    }
    return changed;
  },

  markAllRead(userId: string): number {
    const arr = userInbox.get(userId) ?? [];
    const now = Date.now();
    let changed = 0;
    for (const n of arr)
      if (!n.readAt) {
        n.readAt = now;
        changed++;
      }
    return changed;
  },

  remove(userId: string, id: string): boolean {
    const arr = userInbox.get(userId) ?? [];
    const idx = arr.findIndex((n) => n.id === id);
    if (idx === -1) return false;
    arr.splice(idx, 1);
    return true;
  },

  getPrefs(userId: string): NotificationPreferences {
    return (
      userPrefs.get(userId) ?? {
        userId,
        events: {},
        channels: { "in-app": true, email: true, push: true, "sms-stub": false },
        quietHours: { enabled: true, from: "22:00", to: "06:00" },
      }
    );
  },

  savePrefs(prefs: NotificationPreferences): void {
    userPrefs.set(prefs.userId, prefs);
  },

  subscribe(sub: PushSubscription): void {
    const arr = pushSubs.get(sub.userId) ?? [];
    if (arr.find((s) => s.endpoint === sub.endpoint)) return;
    arr.push(sub);
    pushSubs.set(sub.userId, arr);
  },

  unsubscribe(userId: string, endpoint: string): boolean {
    const arr = pushSubs.get(userId) ?? [];
    const idx = arr.findIndex((s) => s.endpoint === endpoint);
    if (idx === -1) return false;
    arr.splice(idx, 1);
    return true;
  },

  subscriptions(userId: string): PushSubscription[] {
    return pushSubs.get(userId) ?? [];
  },

  recordDelivery(event: NotificationEvent, channel: NotificationChannel, ok: boolean): void {
    const day = today();
    let stat = stats.find((s) => s.event === event && s.channel === channel && s.day === day);
    if (!stat) {
      stat = { event, channel, delivered: 0, failed: 0, day };
      stats.push(stat);
    }
    if (ok) stat.delivered++;
    else stat.failed++;
  },

  stats(days = 7): DeliveryStat[] {
    const cutoff = Date.now() - days * 86_400_000;
    return stats.filter((s) => new Date(s.day).getTime() >= cutoff);
  },

  /** Test-Only: alles leeren. */
  _reset(): void {
    userInbox.clear();
    userPrefs.clear();
    pushSubs.clear();
    stats.length = 0;
  },
};

export function inQuietHours(prefs: NotificationPreferences, now = new Date()): boolean {
  if (!prefs.quietHours.enabled) return false;
  const [fh, fm] = prefs.quietHours.from.split(":").map(Number);
  const [th, tm] = prefs.quietHours.to.split(":").map(Number);
  const mins = now.getHours() * 60 + now.getMinutes();
  const from = fh * 60 + fm;
  const to = th * 60 + tm;
  // Over-midnight range (z.B. 22:00 -> 06:00)
  return from > to ? mins >= from || mins < to : mins >= from && mins < to;
}
