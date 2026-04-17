import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { AlertOctagon } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';

/** Immer sichtbarer FAB, auch auf Login (Policy-Anforderung). */
export function NotfallButton({ bottom = 90 }: { bottom?: number }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Notfall auslösen"
      onPress={() => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        router.push('/notfall');
      }}
      style={{
        position: 'absolute',
        right: 16,
        bottom,
        shadowColor: '#DC2626',
        shadowOpacity: 0.35,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 8,
      }}
    >
      <View className="bg-danger rounded-full px-4 h-14 flex-row items-center gap-2">
        <AlertOctagon size={22} color="#fff" />
        <Text className="text-white font-bold tracking-wide">NOTFALL</Text>
      </View>
    </Pressable>
  );
}
