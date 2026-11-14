// The app's look follows the Night mode switch in Settings, not the phone's own dark mode.

import { useNight } from '@/lib/night';

export function useColorScheme(): 'light' | 'dark' {
  return useNight() ? 'dark' : 'light';
}
