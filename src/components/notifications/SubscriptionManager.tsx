"use client";

import { useEffect, useState } from "react";
import { BellRing, BellOff } from "lucide-react";
import { urlBase64ToUint8Array, VAPID_PUBLIC_KEY_PLACEHOLDER } from "@/lib/notifications/push";

type PermState = "default" | "granted" | "denied" | "unsupported";

export function SubscriptionManager() {
  const [perm, setPerm] = useState<PermState>("default");
  const [endpoint, setEndpoint] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("Notification" in window) || !("serviceWorker" in navigator)) {
      setPerm("unsupported");
      return;
    }
    setPerm(Notification.permission as PermState);
  }, []);

  async function enable() {
    setBusy(true);
    setMsg(null);
    try {
      if (!("Notification" in window)) throw new Error("Browser unterstützt Notifications nicht.");
      const result = await Notification.requestPermission();
      setPerm(result as PermState);
      if (result !== "granted") {
        setMsg("Berechtigung abgelehnt. Du kannst sie in den Browser-Einstellungen ändern.");
        return;
      }
      // Service-Worker existiert nicht in Demo – reines Mock-Subscribe
      const mockEndpoint = `https://example.push/endpoint/${crypto.randomUUID()}`;
      const mockKeys = {
        p256dh: btoa(String.fromCharCode(...urlBase64ToUint8Array(VAPID_PUBLIC_KEY_PLACEHOLDER).slice(0, 32))),
        auth: btoa(String.fromCharCode(...urlBase64ToUint8Array(VAPID_PUBLIC_KEY_PLACEHOLDER).slice(0, 16))),
      };
      const res = await fetch("/api/notifications/push/subscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ endpoint: mockEndpoint, keys: mockKeys }),
      });
      if (!res.ok) throw new Error("Subscribe fehlgeschlagen.");
      setEndpoint(mockEndpoint);
      setMsg("Browser-Push aktiviert. Du erhältst kritische Hinweise auch außerhalb der App.");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Fehler beim Aktivieren.");
    } finally {
      setBusy(false);
    }
  }

  async function disable() {
    if (!endpoint) return;
    setBusy(true);
    try {
      await fetch("/api/notifications/push/unsubscribe", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ endpoint }),
      });
      setEndpoint(null);
      setMsg("Push-Abo entfernt.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="flex items-center gap-2 font-serif text-sm font-semibold">
        <BellRing className="h-4 w-4 text-primary" /> Browser-Push
      </div>
      <p className="mt-1 text-sm text-muted-foreground">
        Kritische Ereignisse auch bei geschlossenem Tab. DSGVO-konform, nur Event-Metadaten, keine Patientendaten im Push-Inhalt.
      </p>
      <div className="mt-3 flex items-center gap-2 text-sm">
        Status: <span className="font-medium">{perm}</span>
        {endpoint ? (
          <button
            type="button"
            onClick={disable}
            disabled={busy}
            className="ml-auto flex items-center gap-1 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs hover:bg-secondary/80"
          >
            <BellOff className="h-3.5 w-3.5" /> Deaktivieren
          </button>
        ) : (
          <button
            type="button"
            onClick={enable}
            disabled={busy || perm === "unsupported" || perm === "denied"}
            className="ml-auto rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            Aktivieren
          </button>
        )}
      </div>
      {msg && <div className="mt-2 rounded-md bg-muted/40 p-2 text-xs text-muted-foreground">{msg}</div>}
    </div>
  );
}
