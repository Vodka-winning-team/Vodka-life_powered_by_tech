// App state shared by the screens: the current check, and the saved history.
// History is saved on the phone (AsyncStorage) ONLY when the user taps Save.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import type { CheckResult, JobAnswers } from '@/engine';
import { engine } from '@/lib/data';

export type Check = {
  id: string;
  text: string;
  job: JobAnswers | null;
  result: CheckResult;
  savedAt: string | null;
};

type Store = {
  current: Check | null;
  history: Check[];
  runCheck: (text: string, job?: JobAnswers | null) => void;
  openCheck: (check: Check) => void;
  saveCurrent: () => void;
  clearHistory: () => void;
};

const HISTORY_KEY = 'history-v1';
const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<Check | null>(null);
  const [history, setHistory] = useState<Check[]>([]);

  // Load saved history once, when the app starts.
  useEffect(() => {
    AsyncStorage.getItem(HISTORY_KEY)
      .then((saved) => {
        if (saved) setHistory(JSON.parse(saved));
      })
      .catch(() => {});
  }, []);

  function writeHistory(next: Check[]) {
    setHistory(next);
    AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(next)).catch(() => {});
  }

  function runCheck(text: string, job: JobAnswers | null = null) {
    const result = engine.check(text, job);
    // Re-checking the same message (e.g. after the Job check) keeps the same id.
    const id = current && current.text === text ? current.id : String(Date.now());
    setCurrent({ id, text, job, result, savedAt: null });
  }

  function saveCurrent() {
    if (!current) return;
    const saved = { ...current, savedAt: new Date().toISOString() };
    setCurrent(saved);
    writeHistory([saved, ...history.filter((c) => c.id !== saved.id)]);
  }

  const store: Store = {
    current,
    history,
    runCheck,
    openCheck: setCurrent,
    saveCurrent,
    clearHistory: () => writeHistory([]),
  };

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore must be used inside StoreProvider');
  return store;
}
