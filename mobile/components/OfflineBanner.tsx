import { Text, View } from 'react-native';
import { WifiOff } from 'lucide-react-native';
import { useOffline } from '@hooks/useOffline';

export function OfflineBanner() {
  const { online, pending } = useOffline();
  if (online && pending === 0) return null;
  return (
    <View
      accessibilityLiveRegion="polite"
      className={`flex-row items-center gap-2 px-4 py-2 ${online ? 'bg-amber-100 dark:bg-amber-900/40' : 'bg-gray-800'}`}
    >
      <WifiOff size={16} color={online ? '#D97706' : '#fff'} />
      <Text className={`flex-1 text-xs font-medium ${online ? 'text-amber-900' : 'text-white'}`}>
        {online
          ? `${pending} Einträge werden synchronisiert…`
          : 'Offline — Aktionen werden lokal gespeichert.'}
      </Text>
    </View>
  );
}
