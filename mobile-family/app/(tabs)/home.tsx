import { ScrollView, Text, View, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card, CardTitle, CardSub } from '@components/ui/Card';
import { Badge } from '@components/ui/Badge';
import { ScoreRing } from '@components/ScoreRing';
import { ActivityRow } from '@components/ActivityRow';
import { mockActivities, mockPhotos, mockWellbeing } from '@lib/mock-data';
import { useAuthStore } from '@lib/auth';
import { formatDateDe, relativeTimeDe } from '@lib/cn';
import { getBool, StorageKeys } from '@lib/storage';

export default function HomeScreen() {
  const user = useAuthStore((s) => s.user);
  const today = mockWellbeing[mockWellbeing.length - 1]!;
  const yesterday = mockWellbeing[mockWellbeing.length - 2]!;
  const delta = today.score - yesterday.score;
  const trend = delta > 2 ? 'success' : delta < -2 ? 'warning' : 'info';
  const trendText = delta > 2 ? `+${delta} besser als gestern` : delta < -2 ? `${delta} schlechter` : 'stabil zu gestern';
  const fotosAllowed = getBool(StorageKeys.PrivacyFotos, true);

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-950" edges={['top']}>
      <ScrollView contentContainerStyle={{ padding: 16, gap: 16 }}>
        <View>
          <Text className="text-sm text-gray-500">Hallo {user?.name ?? 'Angehörige'}</Text>
          <Text className="text-2xl font-bold text-gray-900 dark:text-white">{user?.residentName ?? 'Bewohner:in'}</Text>
          <Text className="text-xs text-gray-400 mt-1">Stand: {formatDateDe(today.date)}</Text>
        </View>

        <Card>
          <View className="flex-row items-center gap-5">
            <ScoreRing score={today.score} />
            <View className="flex-1 gap-2">
              <CardTitle>Wohlbefinden heute</CardTitle>
              <Badge tone={trend}>{trendText}</Badge>
              {today.note ? <CardSub>{today.note}</CardSub> : null}
            </View>
          </View>
        </Card>

        <Card>
          <CardTitle>Heutige Aktivitäten</CardTitle>
          {mockActivities.filter((a) => Date.now() - new Date(a.date).getTime() < 86_400_000).map((a) => (
            <ActivityRow key={a.id} a={a} />
          ))}
        </Card>

        {fotosAllowed ? (
          <Card>
            <CardTitle>Fotos</CardTitle>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
              {mockPhotos.map((p) => (
                <View key={p.id} className="w-56">
                  <Image
                    source={{ uri: p.uri }}
                    style={{ width: 224, height: 140, borderRadius: 12 }}
                    accessibilityLabel={p.caption}
                  />
                  <Text className="text-xs text-gray-500 mt-1">{p.caption}</Text>
                  <Text className="text-[10px] text-gray-400">{relativeTimeDe(p.date)}</Text>
                </View>
              ))}
            </ScrollView>
          </Card>
        ) : (
          <Card>
            <CardTitle>Fotos</CardTitle>
            <CardSub>Fotos sind in den Einstellungen deaktiviert.</CardSub>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
