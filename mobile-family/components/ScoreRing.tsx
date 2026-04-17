import { View, Text } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

type Props = {
  score: number; // 0-100
  size?: number;
};

/**
 * Wohlbefindens-Ring. Farbe wechselt bei <50 (rot), <70 (amber), sonst (brand).
 */
export function ScoreRing({ score, size = 120 }: Props) {
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, score));
  const dash = c * (1 - pct / 100);
  const color = pct < 50 ? '#DC2626' : pct < 70 ? '#D97706' : '#0F766E';
  return (
    <View style={{ width: size, height: size }} className="items-center justify-center">
      <Svg width={size} height={size}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke="#E5E7EB" strokeWidth={stroke} fill="none" />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          strokeDasharray={`${c} ${c}`}
          strokeDashoffset={dash}
          strokeLinecap="round"
          fill="none"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View className="absolute items-center">
        <Text className="text-3xl font-bold text-gray-900 dark:text-white">{pct}</Text>
        <Text className="text-xs text-gray-500">von 100</Text>
      </View>
    </View>
  );
}
