import { TextInput, View, Text, type TextInputProps } from 'react-native';
import { cn } from '@lib/cn';

export type InputProps = TextInputProps & {
  label?: string;
  error?: string;
  helper?: string;
};

export function Input({ label, error, helper, className, ...rest }: InputProps) {
  return (
    <View className="gap-1.5">
      {label && (
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</Text>
      )}
      <TextInput
        className={cn(
          'h-12 rounded-button px-4 border bg-white dark:bg-gray-900 text-gray-900 dark:text-white',
          error ? 'border-danger' : 'border-gray-200 dark:border-gray-700',
          typeof className === 'string' ? className : undefined,
        )}
        placeholderTextColor="#9CA3AF"
        accessibilityLabel={label}
        {...rest}
      />
      {error ? (
        <Text className="text-xs text-danger">{error}</Text>
      ) : helper ? (
        <Text className="text-xs text-gray-500">{helper}</Text>
      ) : null}
    </View>
  );
}
