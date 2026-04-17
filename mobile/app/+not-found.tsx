import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFound() {
  return (
    <>
      <Stack.Screen options={{ title: 'Nicht gefunden' }} />
      <View className="flex-1 items-center justify-center p-6 bg-white dark:bg-gray-950 gap-3">
        <Text className="text-xl font-bold text-gray-900 dark:text-white">Seite nicht gefunden</Text>
        <Link href="/(tabs)/dashboard" className="text-brand-700 font-semibold">
          Zum Dashboard
        </Link>
      </View>
    </>
  );
}
