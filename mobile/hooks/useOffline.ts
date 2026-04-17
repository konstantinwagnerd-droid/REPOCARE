import { useEffect, useState } from 'react';
import { size as queueSize, flush } from '@lib/offline-queue';
import { api } from '@lib/api';

/**
 * Minimaler Online-Status-Hook. Ohne NetInfo: reagiert auf fetch-Fehler.
 * In Prod wird @react-native-community/netinfo ergänzt — hier um Deps klein zu halten.
 */
export function useOffline() {
  const [online, setOnline] = useState(true);
  const [pending, setPending] = useState(queueSize());

  useEffect(() => {
    let alive = true;
    const ping = async () => {
      try {
        await fetch(`${process.env.EXPO_PUBLIC_API_URL ?? 'https://careai.demo'}/api/health`, {
          method: 'HEAD',
        });
        if (!alive) return;
        setOnline(true);
      } catch {
        if (!alive) return;
        setOnline(false);
      }
      setPending(queueSize());
    };
    ping();
    const i = setInterval(ping, 15000);
    return () => {
      alive = false;
      clearInterval(i);
    };
  }, []);

  useEffect(() => {
    if (!online) return;
    if (pending === 0) return;
    let cancelled = false;
    (async () => {
      const res = await flush(async (item) => {
        await api.post(item.path, item.body ? JSON.parse(item.body) : undefined);
      });
      if (cancelled) return;
      setPending(queueSize());
      if (res.failed === 0) setPending(0);
    })();
    return () => {
      cancelled = true;
    };
  }, [online, pending]);

  return { online, pending };
}
