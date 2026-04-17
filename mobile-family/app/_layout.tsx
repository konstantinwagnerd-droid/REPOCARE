import '../global.css';
import { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useColorScheme, View } from 'react-native';
import { useAuthStore } from '@lib/auth';
import { initNotifications } from '@lib/notifications';

const qc = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false, staleTime: 30_000 } },
});

export default function RootLayout() {
  const hydrate = useAuthStore((s) => s.hydrate);
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const scheme = useColorScheme();

  useEffect(() => {
    hydrate();
    initNotifications();
  }, [hydrate]);

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace('/(auth)/email');
    else router.replace('/(tabs)/home');
  }, [loading, user]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={qc}>
          <View style={{ flex: 1, backgroundColor: scheme === 'dark' ? '#030712' : '#FFFFFF' }}>
            <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
            <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen name="thread/[id]" options={{ headerShown: true, title: 'Nachricht' }} />
              <Stack.Screen name="termin-neu" options={{ headerShown: true, title: 'Neuer Termin', presentation: 'modal' }} />
              <Stack.Screen name="video-call" options={{ headerShown: true, title: 'Videoanruf' }} />
            </Stack>
          </View>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
