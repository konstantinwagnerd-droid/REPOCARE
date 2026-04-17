import { Text, View } from 'react-native';
import type { ReactNode } from 'react';
import { cn } from '@lib/cn';

type Tone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

const toneMap: Record<Tone, string> = {
  neutral: 'bg-gray-100 dark:bg-gray-800',
  success: 'bg-emerald-100 dark:bg-emerald-900/40',
  warning: 'bg-amber-100 dark:bg-amber-900/40',
  danger: 'bg-red-100 dark:bg-red-900/40',
  info: 'bg-brand-100 dark:bg-brand-800/40',
};

const textMap: Record<Tone, string> = {
  neutral: 'text-gray-700 dark:text-gray-200',
  success: 'text-emerald-800 dark:text-emerald-200',
  warning: 'text-amber-800 dark:text-amber-200',
  danger: 'text-red-800 dark:text-red-200',
  info: 'text-brand-800 dark:text-brand-100',
};

export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: Tone }) {
  return (
    <View className={cn('self-start rounded-full px-2 py-0.5', toneMap[tone])}>
      <Text className={cn('text-xs font-medium', textMap[tone])}>{children}</Text>
    </View>
  );
}
