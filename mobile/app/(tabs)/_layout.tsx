import { Tabs } from 'expo-router';
import { Home, Users, Mic, MoreHorizontal } from 'lucide-react-native';
import { useResolvedTheme } from '@hooks/useThemePref';

export default function TabLayout() {
  const theme = useResolvedTheme();
  const tint = '#0F766E';
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: tint,
        tabBarInactiveTintColor: theme === 'dark' ? '#9CA3AF' : '#6B7280',
        tabBarStyle: {
          backgroundColor: theme === 'dark' ? '#030712' : '#FFFFFF',
          borderTopColor: theme === 'dark' ? '#1F2937' : '#E5E7EB',
          height: 68,
          paddingBottom: 10,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Heute',
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="bewohner"
        options={{
          title: 'Bewohner:innen',
          tabBarIcon: ({ color, size }) => <Users color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="voice"
        options={{
          title: 'Stimme',
          tabBarIcon: ({ color, size }) => <Mic color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="mehr"
        options={{
          title: 'Mehr',
          tabBarIcon: ({ color, size }) => <MoreHorizontal color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
