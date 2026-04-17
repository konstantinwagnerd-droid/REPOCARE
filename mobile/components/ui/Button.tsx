import { ActivityIndicator, Pressable, Text, View, type PressableProps } from 'react-native';
import * as Haptics from 'expo-haptics';
import { cn } from '@lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'accent';
type Size = 'sm' | 'md' | 'lg';

const base = 'rounded-button items-center justify-center flex-row';
const variants: Record<Variant, string> = {
  primary: 'bg-brand-700 active:bg-brand-800',
  secondary: 'bg-gray-100 active:bg-gray-200 dark:bg-gray-800 dark:active:bg-gray-700',
  ghost: 'bg-transparent active:bg-gray-100 dark:active:bg-gray-800',
  danger: 'bg-danger active:opacity-90',
  accent: 'bg-accent-500 active:bg-accent-600',
};
const labelColors: Record<Variant, string> = {
  primary: 'text-white',
  secondary: 'text-gray-900 dark:text-white',
  ghost: 'text-brand-700 dark:text-brand-300',
  danger: 'text-white',
  accent: 'text-white',
};
const sizes: Record<Size, string> = {
  sm: 'h-10 px-3',
  md: 'h-12 px-4',
  lg: 'h-14 px-5',
};
const labelSizes: Record<Size, string> = {
  sm: 'text-sm font-semibold',
  md: 'text-base font-semibold',
  lg: 'text-lg font-semibold',
};

export type ButtonProps = PressableProps & {
  label: string;
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: React.ReactNode;
  haptic?: boolean;
  fullWidth?: boolean;
};

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading,
  icon,
  haptic = true,
  fullWidth,
  disabled,
  onPress,
  className,
  ...rest
}: ButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !!disabled || !!loading, busy: !!loading }}
      disabled={disabled || loading}
      onPress={(e) => {
        if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress?.(e);
      }}
      className={cn(
        base,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        (disabled || loading) && 'opacity-60',
        typeof className === 'string' ? className : undefined,
      )}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'secondary' || variant === 'ghost' ? '#0F766E' : '#fff'} />
      ) : (
        <View className="flex-row items-center gap-2">
          {icon}
          <Text className={cn(labelColors[variant], labelSizes[size])}>{label}</Text>
        </View>
      )}
    </Pressable>
  );
}
