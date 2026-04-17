import { View } from 'react-native';
import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import { cn } from '@lib/cn';

export function Skeleton({ className }: { className?: string }) {
  const opacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.65, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.35, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={{ opacity }}
      className={cn('bg-gray-200 dark:bg-gray-800 rounded-md', className)}
    >
      <View />
    </Animated.View>
  );
}
