import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Nicht gefunden' }} />
      <View className="flex-1 items-center justify-center p-6 bg-white dark:bg-gray-950">
        <Text className="text-xl font-bold text-gray-900 dark:text-white">Diese Seite existiert nicht.</Text>
        <Link href="/(tabs)/home" className="mt-4 text-brand-700">Zurück zur Startseite</Link>
      </View>
    </>
  );
}
