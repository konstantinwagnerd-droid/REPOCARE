import { useColorScheme } from 'react-native';
import { create } from 'zustand';
import { kv } from '@lib/storage';

type Mode = 'system' | 'light' | 'dark';

type ThemeState = {
  mode: Mode;
  setMode: (m: Mode) => void;
};

export const useThemePref = create<ThemeState>((set) => ({
  mode: (kv.getString('theme.mode') as Mode) ?? 'system',
  setMode: (mode) => {
    kv.setString('theme.mode', mode);
    set({ mode });
  },
}));

export function useResolvedTheme(): 'light' | 'dark' {
  const scheme = useColorScheme();
  const { mode } = useThemePref();
  if (mode === 'system') return scheme === 'dark' ? 'dark' : 'light';
  return mode;
}
