import { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, Text, View } from 'react-native';
import { Mic, Square } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { VoiceRecorder as Recorder } from '@lib/voice';

export function VoiceRecorder({
  onComplete,
  onError,
}: {
  onComplete: (uri: string, durationMs: number) => void;
  onError?: (err: Error) => void;
}) {
  const [recording, setRecording] = useState(false);
  const [meter, setMeter] = useState(0); // dB, negativ
  const [elapsed, setElapsed] = useState(0);
  const recorder = useRef(new Recorder()).current;
  const startedAt = useRef(0);
  const pulse = useRef(new Animated.Value(1)).current;
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (recording) {
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, { toValue: 1.18, duration: 550, useNativeDriver: true }),
          Animated.timing(pulse, { toValue: 1, duration: 550, useNativeDriver: true }),
        ]),
      );
      loop.start();
      return () => loop.stop();
    }
  }, [recording, pulse]);

  const start = async () => {
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      await recorder.start((db) => setMeter(db));
      startedAt.current = Date.now();
      setRecording(true);
      timer.current = setInterval(() => setElapsed(Date.now() - startedAt.current), 300);
    } catch (e) {
      onError?.(e as Error);
    }
  };

  const stop = async () => {
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      const uri = await recorder.stop();
      if (timer.current) clearInterval(timer.current);
      setRecording(false);
      onComplete(uri, Date.now() - startedAt.current);
      setElapsed(0);
    } catch (e) {
      onError?.(e as Error);
    }
  };

  const seconds = Math.floor(elapsed / 1000);
  const min = String(Math.floor(seconds / 60)).padStart(2, '0');
  const sec = String(seconds % 60).padStart(2, '0');

  // meter: -160 .. 0 dB → 0..1
  const level = Math.max(0, Math.min(1, (meter + 60) / 60));

  return (
    <View className="items-center gap-4 py-6">
      <Animated.View
        style={{ transform: [{ scale: pulse }] }}
        className="w-32 h-32 rounded-full items-center justify-center"
      >
        <View
          className={`w-32 h-32 rounded-full items-center justify-center ${recording ? 'bg-accent-500' : 'bg-brand-700'}`}
          style={{
            shadowColor: recording ? '#F97316' : '#0F766E',
            shadowOpacity: 0.4,
            shadowRadius: 20 + level * 20,
            shadowOffset: { width: 0, height: 0 },
            elevation: 10,
          }}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={recording ? 'Aufnahme stoppen' : 'Aufnahme starten'}
            onPress={recording ? stop : start}
            className="w-full h-full items-center justify-center"
          >
            {recording ? <Square size={42} color="#fff" /> : <Mic size={42} color="#fff" />}
          </Pressable>
        </View>
      </Animated.View>
      <Text className="text-3xl font-mono text-gray-900 dark:text-white">
        {min}:{sec}
      </Text>
      <Text className="text-sm text-gray-500">
        {recording ? 'Aufnahme läuft — tippen zum Stoppen' : 'Tippen zum Aufnehmen'}
      </Text>
    </View>
  );
}
