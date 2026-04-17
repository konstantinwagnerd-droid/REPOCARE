import { TextInput, Text, View, TextInputProps } from 'react-native';
import { cn } from '@lib/cn';

type Props = TextInputProps & {
  label?: string;
  error?: string;
  hint?: string;
};

export function Input({ label, error, hint, className, ...rest }: Props) {
  return (
    <View className="gap-1.5">
      {label ? <Text className="text-sm font-medium text-gray-700 dark:text-gray-200">{label}</Text> : null}
      <TextInput
        accessibilityLabel={label}
        placeholderTextColor="#9CA3AF"
        className={cn(
          'rounded-button border px-4 py-3 text-base text-gray-900 dark:text-white dark:bg-gray-900',
          error ? 'border-red-500' : 'border-gray-300 dark:border-gray-700',
          className
        )}
        {...rest}
      />
      {hint && !error ? <Text className="text-xs text-gray-500">{hint}</Text> : null}
      {error ? <Text className="text-xs text-red-600">{error}</Text> : null}
    </View>
  );
}
