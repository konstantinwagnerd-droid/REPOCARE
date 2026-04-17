import type { Notification, NotificationAudience, NotificationChannel, NotificationEvent } from "./types";
import { getTemplate, render } from "./templates";
import { notificationStore, inQuietHours } from "./store";
import { deliverInApp } from "./channels/in-app";
import { deliverEmail } from "./channels/email";
import { deliverPush } from "./channels/push";
import { deliverSms } from "./channels/sms";

export interface DispatchInput {
  event: NotificationEvent;
  audience: NotificationAudience;
  tenantId: string;
  vars?: Record<string, string | number>;
  href?: string;
  /** Override default channels. */
  channels?: NotificationChannel[];
}

export interface DirectoryResolver {
  /** Liefert User-IDs für eine audience. */
  resolve(audience: NotificationAudience, tenantId: string): string[];
}

/** Default-Resolver – für Demo: scope=user liefert den value direkt. */
export const defaultResolver: DirectoryResolver = {
  resolve(aud) {
    if (aud.scope === "user" && aud.value) return [aud.value];
    // role/tenant/all: im echten System via DB. Demo → eine Mock-Liste.
    return [aud.value ?? "demo-user"];
  },
};

let idCounter = 0;
function genId(): string {
  idCounter++;
  return `ntf_${Date.now().toString(36)}_${idCounter.toString(36)}`;
}

export async function dispatch(
  input: DispatchInput,
  resolver: DirectoryResolver = defaultResolver,
): Promise<Notification[]> {
  const tmpl = getTemplate(input.event);
  if (!tmpl) throw new Error(`Unknown notification event: ${input.event}`);

  const vars = input.vars ?? {};
  const title = render(tmpl.title, vars);
  const body = render(tmpl.body, vars);
  const channels = input.channels ?? tmpl.defaultChannels;

  const userIds = resolver.resolve(input.audience, input.tenantId);
  const out: Notification[] = [];

  for (const userId of userIds) {
    const prefs = notificationStore.getPrefs(userId);
    // Respect per-event opt-out
    if (prefs.events[input.event] === false) continue;

    const quiet = inQuietHours(prefs);
    const activeChannels = channels.filter((c) => {
      if (prefs.channels[c] === false) return false;
      if (quiet && tmpl.kind !== "critical" && c === "push") return false;
      return true;
    });

    const notif: Notification = {
      id: genId(),
      userId,
      tenantId: input.tenantId,
      event: input.event,
      kind: tmpl.kind,
      title,
      body,
      channels: activeChannels,
      createdAt: Date.now(),
      href: input.href,
      meta: Object.fromEntries(Object.entries(vars).map(([k, v]) => [k, v])),
    };

    for (const ch of activeChannels) {
      let ok = false;
      if (ch === "in-app") ok = await deliverInApp(notif);
      else if (ch === "email") ok = await deliverEmail(notif);
      else if (ch === "push") ok = await deliverPush(notif);
      else if (ch === "sms-stub") ok = await deliverSms(notif);
      notificationStore.recordDelivery(input.event, ch, ok);
    }

    out.push(notif);
  }
  return out;
}
