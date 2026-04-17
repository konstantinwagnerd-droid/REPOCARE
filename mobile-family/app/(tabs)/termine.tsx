import { FlatList, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Calendar, Video, PartyPopper, Plus } from 'lucide-react-native';
import { Button } from '@components/ui/Button';
import { Badge } from '@components/ui/Badge';
import { mockAppointments, type Appointment } from '@lib/mock-data';
import { formatDateTimeDe } from '@lib/cn';

const iconMap = { visit: Calendar, 'video-call': Video, event: PartyPopper } as const;

const statusTone = (s: Appointment['status']) => {
  switch (s) {
    case 'bestaetigt': return 'success' as const;
    case 'angefragt': return 'warning' as const;
    case 'abgesagt': return 'danger' as const;
    default: return 'info' as const;
  }
};

export default function TermineScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-950" edges={['top']}>
      <View className="p-4">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">Termine</Text>
        <Text className="text-sm text-gray-500 mt-1">Besuche, Videoanrufe und Veranstaltungen.</Text>
      </View>

      <View className="px-4 mb-3 flex-row gap-2">
        <View className="flex-1">
          <Button
            label="Besuch planen"
            onPress={() => router.push('/termin-neu?type=visit')}
            icon={<Plus size={18} color="#fff" />}
            fullWidth
          />
        </View>
        <View className="flex-1">
          <Button
            label="Videoanruf"
            variant="secondary"
            onPress={() => router.push('/termin-neu?type=video-call')}
            icon={<Video size={18} color="#D97706" />}
            fullWidth
          />
        </View>
      </View>

      <FlatList
        data={mockAppointments}
        keyExtractor={(a) => a.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16, gap: 10 }}
        renderItem={({ item }) => {
          const Icon = iconMap[item.type];
          return (
            <View className="rounded-card bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 flex-row gap-3">
              <View className="w-10 h-10 rounded-full bg-brand-50 dark:bg-brand-800/40 items-center justify-center">
                <Icon size={18} color="#0F766E" />
              </View>
              <View className="flex-1 gap-1">
                <View className="flex-row items-center justify-between gap-2">
                  <Text className="font-semibold text-gray-900 dark:text-white">{item.title}</Text>
                  <Badge tone={statusTone(item.status)}>{item.status}</Badge>
                </View>
                <Text className="text-xs text-gray-500">{formatDateTimeDe(item.date)}</Text>
                {item.location ? <Text className="text-xs text-gray-500">📍 {item.location}</Text> : null}
                {item.note ? <Text className="text-xs text-gray-600 dark:text-gray-300 mt-1">{item.note}</Text> : null}
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}
