// App state shared by the screens: the current check, and the saved history.
// History is saved on the phone (AsyncStorage) ONLY when the user taps Save.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { setLanguage as setStringsLanguage, type Language } from '@/constants/strings';
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
  language: Language;
  setLanguage: (language: Language) => void;
};

const HISTORY_KEY = 'history-v1';
const LANGUAGE_KEY = 'language-v1';
const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<Check | null>(null);
  const [history, setHistory] = useState<Check[]>([]);
  const [language, setLanguageState] = useState<Language>('en');

  // Load saved history once, when the app starts.
  useEffect(() => {
    AsyncStorage.getItem(HISTORY_KEY)
      .then((saved) => {
        if (saved) setHistory(JSON.parse(saved));
      })
      .catch(() => {});
    AsyncStorage.getItem(LANGUAGE_KEY)
      .then((saved) => {
        if (saved === 'en' || saved === 'fr' || saved === 'mfe') chooseLanguage(saved, false);
      })
      .catch(() => {});
  }, []);

  /** Changing the state re-renders every screen, so all t() texts switch at once. */
  function chooseLanguage(next: Language, save = true) {
    setStringsLanguage(next);
    setLanguageState(next);
    if (save) AsyncStorage.setItem(LANGUAGE_KEY, next).catch(() => {});
  }

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
    clearHistory: () => {
      writeHistory([]);
      if (current) setCurrent({ ...current, savedAt: null });
    },
    language,
    setLanguage: (next) => chooseLanguage(next),
  };

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore must be used inside StoreProvider');
  return store;
}
