import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Activity, Bell, FilePlus2, Stethoscope, ClipboardList } from 'lucide-react-native';
import { Button } from '@components/ui/Button';
import { Card } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { useAuthStore } from '@lib/auth';
import { useResidents } from '@hooks/useResidents';

export default function DashboardScreen() {
  const user = useAuthStore((s) => s.user);
  const { data: residents = [] } = useResidents();

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-950" edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <View className="flex-row items-center justify-between">
          <View>
            <Text className="text-sm text-gray-500">Guten Morgen,</Text>
            <Text className="text-2xl font-bold text-gray-900 dark:text-white">
              {user?.name ?? 'Pflegekraft'}
            </Text>
          </View>
          <View className="w-11 h-11 rounded-full bg-brand-700 items-center justify-center">
            <Bell size={20} color="#fff" />
            <View className="absolute top-1 right-1 w-2.5 h-2.5 bg-accent-500 rounded-full" />
          </View>
        </View>

        <Card>
          <Text className="text-xs uppercase tracking-wider text-gray-500 mb-1">Schicht</Text>
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">Frühdienst · 06:00 – 14:00</Text>
          <Text className="text-sm text-gray-500 mt-1">Station 1 · 5 Bewohner:innen zugeteilt</Text>
          <View className="flex-row gap-2 mt-3">
            <Badge label="3 offene Aufgaben" tone="warning" />
            <Badge label="1 kritischer Wert" tone="danger" />
          </View>
        </Card>

        <View>
          <Text className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Schnell-Aktionen</Text>
          <View className="flex-row flex-wrap gap-3">
            <Button
              label="Neuer Bericht"
              icon={<FilePlus2 size={18} color="#fff" />}
              onPress={() => router.push('/bericht-neu')}
              className="flex-1 min-w-[150]"
            />
            <Button
              label="Schichtübergabe"
              variant="secondary"
              icon={<ClipboardList size={18} color="#0F766E" />}
              onPress={() => router.push('/schichtbericht')}
              className="flex-1 min-w-[150]"
            />
          </View>
        </View>

        <View>
          <Text className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">
            Meine Bewohner:innen heute
          </Text>
          <View className="gap-2">
            {residents.slice(0, 3).map((r) => (
              <Card key={r.id} className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-full bg-brand-100 items-center justify-center">
                  <Text className="font-bold text-brand-700">
                    {r.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-900 dark:text-white">{r.name}</Text>
                  <Text className="text-xs text-gray-500">Zimmer {r.room} · PG {r.pflegegrad}</Text>
                </View>
                <Activity size={18} color="#0F766E" />
              </Card>
            ))}
          </View>
        </View>

        <Card className="bg-brand-50 dark:bg-brand-900/20 border-brand-200 dark:border-brand-800">
          <View className="flex-row items-start gap-3">
            <Stethoscope size={20} color="#0F766E" />
            <View className="flex-1">
              <Text className="font-semibold text-brand-800 dark:text-brand-200">
                Erinnerung: Medikation 08:00
              </Text>
              <Text className="text-sm text-brand-700 dark:text-brand-300 mt-1">
                7 Einträge offen · tippen für MAR-Liste
              </Text>
            </View>
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
