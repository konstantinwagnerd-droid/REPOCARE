import { Pressable, Text, View } from 'react-native';
import { router } from 'expo-router';
import { ChevronRight, User } from 'lucide-react-native';
import type { Resident } from '@lib/mock-data';
import { Badge } from './ui/Badge';

export function BewohnerCard({ resident }: { resident: Resident }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${resident.name}, Zimmer ${resident.room}, Pflegegrad ${resident.pflegegrad}`}
      onPress={() => router.push(`/bewohner/${resident.id}`)}
      className="active:opacity-80"
    >
      <View className="flex-row items-center gap-3 rounded-card bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4">
        <View className="w-12 h-12 rounded-full bg-brand-100 dark:bg-brand-900/40 items-center justify-center">
          <User size={22} color="#0F766E" />
        </View>
        <View className="flex-1 gap-1">
          <Text className="text-base font-semibold text-gray-900 dark:text-white">{resident.name}</Text>
          <Text className="text-sm text-gray-500">
            Zimmer {resident.room} · {resident.station}
          </Text>
          <View className="flex-row flex-wrap gap-1.5 mt-1">
            <Badge label={`PG ${resident.pflegegrad}`} tone="brand" />
            {resident.tags.slice(0, 2).map((t) => (
              <Badge key={t} label={t} tone="neutral" />
            ))}
          </View>
        </View>
        <ChevronRight size={20} color="#9CA3AF" />
      </View>
    </Pressable>
  );
}
