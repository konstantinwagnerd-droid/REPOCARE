import { View, Text } from 'react-native';
import { Utensils, Footprints, Users, Stethoscope, Music, Moon } from 'lucide-react-native';
import type { Activity } from '@lib/mock-data';
import { relativeTimeDe } from '@lib/cn';

const iconMap = {
  meal: Utensils,
  walk: Footprints,
  visit: Users,
  medical: Stethoscope,
  leisure: Music,
  sleep: Moon,
} as const;

export function ActivityRow({ a }: { a: Activity }) {
  const Icon = iconMap[a.icon];
  return (
    <View
      className="flex-row gap-3 py-3 border-b border-gray-100 dark:border-gray-800 last:border-b-0"
      accessibilityLabel={`${a.title}, ${a.description}, ${relativeTimeDe(a.date)}`}
    >
      <View className="w-10 h-10 rounded-full bg-brand-50 dark:bg-brand-800/40 items-center justify-center">
        <Icon size={18} color="#0F766E" />
      </View>
      <View className="flex-1">
        <Text className="text-sm font-semibold text-gray-900 dark:text-white">{a.title}</Text>
        <Text className="text-sm text-gray-500 dark:text-gray-400">{a.description}</Text>
        <Text className="text-xs text-gray-400 mt-0.5">{relativeTimeDe(a.date)}</Text>
      </View>
    </View>
  );
}
