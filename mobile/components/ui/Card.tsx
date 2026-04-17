import { View, type ViewProps } from 'react-native';
import { cn } from '@lib/cn';

export function Card({ className, children, ...rest }: ViewProps) {
  return (
    <View
      className={cn(
        'rounded-card bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4',
        typeof className === 'string' ? className : undefined,
      )}
      style={{ shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 1 }}
      {...rest}
    >
      {children}
    </View>
  );
}
