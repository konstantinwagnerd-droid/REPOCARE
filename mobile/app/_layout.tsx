import '../global.css';
import { useEffect } from 'react';
import { Stack, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from '@lib/auth';
import { useResolvedTheme } from '@hooks/useThemePref';
import { View } from 'react-native';
import { NotfallButton } from '@components/NotfallButton';
import { OfflineBanner } from '@components/OfflineBanner';

const qc = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, refetchOnWindowFocus: false, staleTime: 30_000 },
  },
});

export default function RootLayout() {
  const hydrate = useAuthStore((s) => s.hydrate);
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const theme = useResolvedTheme();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (loading) return;
    if (!user) router.replace('/(auth)/login');
    else router.replace('/(tabs)/dashboard');
  }, [loading, user]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={qc}>
          <View style={{ flex: 1, backgroundColor: theme === 'dark' ? '#030712' : '#FFFFFF' }}>
            <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
            <OfflineBanner />
            <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
              <Stack.Screen name="(auth)" />
              <Stack.Screen name="(tabs)" />
              <Stack.Screen
                name="bericht-neu"
                options={{ headerShown: true, title: 'Neuer Bericht', presentation: 'modal' }}
              />
              <Stack.Screen
                name="schichtbericht"
                options={{ headerShown: true, title: 'Schichtübergabe', presentation: 'modal' }}
              />
              <Stack.Screen
                name="notfall"
                options={{ headerShown: true, title: 'Notfall melden', presentation: 'modal' }}
              />
            </Stack>
            <NotfallButton />
          </View>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
