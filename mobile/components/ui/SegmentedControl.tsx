import { Pressable, ScrollView, Text, View } from 'react-native';
import * as Haptics from 'expo-haptics';
import { cn } from '@lib/cn';

export type Segment = { key: string; label: string };

export function SegmentedControl({
  segments,
  value,
  onChange,
}: {
  segments: Segment[];
  value: string;
  onChange: (key: string) => void;
}) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      className="max-h-14 py-2"
    >
      {segments.map((s) => {
        const active = s.key === value;
        return (
          <Pressable
            key={s.key}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => {
              Haptics.selectionAsync();
              onChange(s.key);
            }}
            className={cn(
              'h-10 px-4 rounded-pill items-center justify-center border',
              active
                ? 'bg-brand-700 border-brand-700'
                : 'bg-transparent border-gray-200 dark:border-gray-700',
            )}
          >
            <Text className={cn('text-sm font-semibold', active ? 'text-white' : 'text-gray-700 dark:text-gray-300')}>
              {s.label}
            </Text>
          </Pressable>
        );
      })}
      <View className="w-2" />
    </ScrollView>
  );
}
