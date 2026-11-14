// Night mode: a switch in Settings (not the phone's own dark mode). Saved on the phone.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSyncExternalStore } from 'react';

const KEY = 'night-v1';
let night = false;
const listeners = new Set<() => void>();

function tell() {
  for (const listener of listeners) listener();
}

// Read the saved choice once, when the app starts.
AsyncStorage.getItem(KEY)
  .then((saved) => {
    if (saved === 'on') {
      night = true;
      tell();
    }
  })
  .catch(() => {});

export function setNight(on: boolean) {
  night = on;
  AsyncStorage.setItem(KEY, on ? 'on' : 'off').catch(() => {});
  tell();
}

/** True when night mode is on. The screen re-draws when it changes. */
export function useNight(): boolean {
  return useSyncExternalStore(
    (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    () => night,
    () => night,
  );
}
