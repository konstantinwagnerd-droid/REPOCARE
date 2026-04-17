import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { Button } from '@components/ui/Button';
import { MOCK_RESIDENTS } from '@lib/mock-data';
import { router } from 'expo-router';
import { Check } from 'lucide-react-native';

export default function Schichtbericht() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-950" edges={['bottom']}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 120 }}>
        <Text className="text-xl font-bold text-gray-900 dark:text-white">Schichtübergabe Frühdienst</Text>
        <Text className="text-sm text-gray-500">06:00 – 14:00 · Station 1</Text>

        <Card>
          <Text className="text-xs uppercase tracking-wider text-gray-500 mb-2">Auffälligkeiten</Text>
          {MOCK_RESIDENTS.slice(0, 3).map((r) => (
            <View key={r.id} className="py-2 border-b border-gray-100 dark:border-gray-800">
              <Text className="font-semibold text-gray-900 dark:text-white">{r.name}</Text>
              <Text className="text-sm text-gray-500">Zimmer {r.room}</Text>
              <View className="flex-row gap-1.5 mt-1">
                {r.tags.slice(0, 2).map((t) => (
                  <Badge key={t} label={t} tone="warning" />
                ))}
              </View>
            </View>
          ))}
        </Card>

        <Card>
          <Text className="text-xs uppercase tracking-wider text-gray-500 mb-2">Offene Aufgaben</Text>
          <Text className="text-sm text-gray-700 dark:text-gray-300">• Verbandwechsel Hr. Berger 15:00</Text>
          <Text className="text-sm text-gray-700 dark:text-gray-300">• Angehörigengespräch Fr. Weber</Text>
          <Text className="text-sm text-gray-700 dark:text-gray-300">• Arztvisite 16:00</Text>
        </Card>
      </ScrollView>
      <View className="absolute bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800">
        <Button
          label="Übergabe bestätigen"
          icon={<Check size={18} color="#fff" />}
          onPress={() => router.back()}
          size="lg"
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}
