import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import type { ReactNode } from 'react';
import { cn } from '@lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'md' | 'lg';

type Props = {
  label: string;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  accessibilityLabel?: string;
};

const variants: Record<Variant, string> = {
  primary: 'bg-brand-700 active:bg-brand-800',
  secondary: 'bg-warm-100 active:bg-warm-400/40',
  ghost: 'bg-transparent border border-brand-700 active:bg-brand-50',
  danger: 'bg-red-600 active:bg-red-700',
};

const labelVariants: Record<Variant, string> = {
  primary: 'text-white',
  secondary: 'text-warm-600',
  ghost: 'text-brand-700',
  danger: 'text-white',
};

export function Button({
  label, onPress, variant = 'primary', size = 'md', icon, loading, disabled, fullWidth, accessibilityLabel,
}: Props) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      className={cn(
        'rounded-button flex-row items-center justify-center gap-2',
        size === 'lg' ? 'px-6 py-4' : 'px-5 py-3',
        variants[variant],
        fullWidth && 'w-full',
        isDisabled && 'opacity-50'
      )}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' || variant === 'danger' ? '#fff' : '#0F766E'} />
      ) : (
        <>
          {icon ? <View>{icon}</View> : null}
          <Text className={cn('font-semibold', labelVariants[variant], size === 'lg' ? 'text-lg' : 'text-base')}>
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}
