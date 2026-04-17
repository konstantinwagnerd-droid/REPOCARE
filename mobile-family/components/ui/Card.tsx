import { View, Text, ViewProps } from 'react-native';
import type { ReactNode } from 'react';
import { cn } from '@lib/cn';

type Props = ViewProps & { children: ReactNode };

export function Card({ children, className, ...rest }: Props) {
  return (
    <View
      {...rest}
      className={cn('rounded-card bg-white dark:bg-gray-900 p-4 border border-gray-100 dark:border-gray-800', className as string)}
    >
      {children}
    </View>
  );
}

export function CardTitle({ children }: { children: ReactNode }) {
  return <Text className="text-base font-semibold text-gray-900 dark:text-white mb-2">{children}</Text>;
}

export function CardSub({ children }: { children: ReactNode }) {
  return <Text className="text-sm text-gray-500 dark:text-gray-400">{children}</Text>;
}
