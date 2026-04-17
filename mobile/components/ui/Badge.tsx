import { Text, View } from 'react-native';
import { cn } from '@lib/cn';

type Tone = 'brand' | 'accent' | 'danger' | 'success' | 'warning' | 'neutral';

const tones: Record<Tone, string> = {
  brand: 'bg-brand-100 dark:bg-brand-900/40',
  accent: 'bg-accent-50 dark:bg-accent-600/20',
  danger: 'bg-red-50 dark:bg-red-900/30',
  success: 'bg-green-50 dark:bg-green-900/30',
  warning: 'bg-amber-50 dark:bg-amber-900/30',
  neutral: 'bg-gray-100 dark:bg-gray-800',
};
const text: Record<Tone, string> = {
  brand: 'text-brand-700 dark:text-brand-300',
  accent: 'text-accent-600 dark:text-accent-400',
  danger: 'text-danger',
  success: 'text-success',
  warning: 'text-warning',
  neutral: 'text-gray-700 dark:text-gray-300',
};

export function Badge({ label, tone = 'neutral' }: { label: string; tone?: Tone }) {
  return (
    <View className={cn('px-2.5 py-1 rounded-pill self-start', tones[tone])}>
      <Text className={cn('text-xs font-medium', text[tone])}>{label}</Text>
    </View>
  );
}
