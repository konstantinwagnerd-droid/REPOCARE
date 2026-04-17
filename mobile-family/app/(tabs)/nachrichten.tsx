import { FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { Badge } from '@components/ui/Badge';
import { mockThreads } from '@lib/mock-data';
import { relativeTimeDe } from '@lib/cn';

export default function NachrichtenScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-950" edges={['top']}>
      <View className="p-4">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">Nachrichten</Text>
        <Text className="text-sm text-gray-500 mt-1">Direkte Kommunikation mit dem Pflegeteam.</Text>
      </View>
      <FlatList
        data={mockThreads}
        keyExtractor={(t) => t.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16, gap: 8 }}
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Thread ${item.subject}, ${item.unread > 0 ? `${item.unread} ungelesen` : 'gelesen'}`}
            onPress={() => router.push({ pathname: '/thread/[id]', params: { id: item.id } })}
            className="flex-row items-center gap-3 rounded-card bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 active:opacity-80"
          >
            <View className="flex-1">
              <View className="flex-row items-center gap-2">
                <Text className="font-semibold text-gray-900 dark:text-white flex-1" numberOfLines={1}>
                  {item.subject}
                </Text>
                {item.unread > 0 ? <Badge tone="info">{item.unread}</Badge> : null}
              </View>
              <Text className="text-xs text-gray-500 mt-1">{item.participants.join(' · ')}</Text>
              <Text className="text-xs text-gray-400 mt-0.5">{relativeTimeDe(item.lastMessageAt)}</Text>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </Pressable>
        )}
        ListEmptyComponent={
          <View className="p-8 items-center">
            <Text className="text-gray-500">Keine Nachrichten vorhanden.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}
