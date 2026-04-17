import { Text, View } from 'react-native';
import Svg, { Polyline, Circle, Line } from 'react-native-svg';
import type { VitalPoint } from '@lib/mock-data';

/**
 * Leichtgewichtiger Vital-Chart auf react-native-svg.
 * Vermeidet victory-native Bundle-Overhead.
 */
export function VitalChart({
  title,
  unit,
  data,
  color = '#0F766E',
  min,
  max,
}: {
  title: string;
  unit: string;
  data: VitalPoint[];
  color?: string;
  min?: number;
  max?: number;
}) {
  if (!data.length) return null;
  const width = 300;
  const height = 120;
  const padding = 16;
  const values = data.map((d) => d.v);
  const lo = min ?? Math.min(...values) - 2;
  const hi = max ?? Math.max(...values) + 2;
  const range = Math.max(hi - lo, 1);

  const points = data
    .map((d, i) => {
      const x = padding + (i / Math.max(data.length - 1, 1)) * (width - padding * 2);
      const y = padding + (1 - (d.v - lo) / range) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(' ');

  const last = data[data.length - 1];

  return (
    <View
      className="rounded-card bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4"
      accessibilityLabel={`${title}: zuletzt ${last?.v} ${unit}`}
    >
      <View className="flex-row items-baseline justify-between mb-2">
        <Text className="text-sm font-medium text-gray-500">{title}</Text>
        <Text className="text-xl font-semibold text-gray-900 dark:text-white">
          {last?.v ?? '—'}
          <Text className="text-sm text-gray-500"> {unit}</Text>
        </Text>
      </View>
      <Svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
        <Line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#E5E7EB" strokeWidth={1} />
        <Polyline points={points} fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
        {data.map((d, i) => {
          const x = padding + (i / Math.max(data.length - 1, 1)) * (width - padding * 2);
          const y = padding + (1 - (d.v - lo) / range) * (height - padding * 2);
          return <Circle key={i} cx={x} cy={y} r={3} fill={color} />;
        })}
      </Svg>
    </View>
  );
}
