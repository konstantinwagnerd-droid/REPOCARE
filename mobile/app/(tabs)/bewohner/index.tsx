import { useMemo, useState } from 'react';
import { FlatList, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search } from 'lucide-react-native';
import { BewohnerCard } from '@components/BewohnerCard';
import { SegmentedControl } from '@components/ui/SegmentedControl';
import { Skeleton } from '@components/ui/Skeleton';
import { useResidents } from '@hooks/useResidents';

export default function BewohnerIndex() {
  const { data, isLoading } = useResidents();
  const [query, setQuery] = useState('');
  const [station, setStation] = useState('all');

  const stations = useMemo(() => {
    const set = new Set((data ?? []).map((r) => r.station));
    return [{ key: 'all', label: 'Alle' }, ...Array.from(set).map((s) => ({ key: s, label: s }))];
  }, [data]);

  const filtered = useMemo(() => {
    const base = data ?? [];
    return base.filter((r) => {
      const q = query.trim().toLowerCase();
      const matchQ = !q || r.name.toLowerCase().includes(q) || r.room.includes(q);
      const matchS = station === 'all' || r.station === station;
      return matchQ && matchS;
    });
  }, [data, query, station]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-950" edges={['top']}>
      <View className="px-4 pt-2 pb-3 gap-3">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">Bewohner:innen</Text>
        <View className="flex-row items-center gap-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-button px-3 h-12">
          <Search size={18} color="#6B7280" />
          <TextInput
            className="flex-1 text-base text-gray-900 dark:text-white"
            placeholder="Name oder Zimmer suchen"
            placeholderTextColor="#9CA3AF"
            value={query}
            onChangeText={setQuery}
            accessibilityLabel="Bewohner suchen"
          />
        </View>
      </View>
      <SegmentedControl segments={stations} value={station} onChange={setStation} />
      {isLoading ? (
        <View className="px-4 gap-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(r) => r.id}
          contentContainerStyle={{ padding: 16, gap: 10, paddingBottom: 100 }}
          renderItem={({ item }) => <BewohnerCard resident={item} />}
          ListEmptyComponent={
            <Text className="text-center text-gray-500 mt-10">Keine Treffer.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}
