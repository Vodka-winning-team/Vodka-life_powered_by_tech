// App state shared by the screens: the current check, and the saved history.
// History is saved on the phone (AsyncStorage) ONLY when the user taps Save.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { setLanguage as setStringsLanguage, type Language } from '@/constants/strings';
import type { CheckResult, JobAnswers } from '@/engine';
import { engine } from '@/lib/data';
import { DEFAULT_SERVER } from '@/lib/online';

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
  runCheck: (text: string, job?: JobAnswers | null) => Check;
  updateCase: (text: string, job: JobAnswers | null) => void;
  addToCase: (newText: string) => void;
  openCheck: (check: Check) => void;
  saveCurrent: () => void;
  clearHistory: () => void;
  language: Language;
  setLanguage: (language: Language) => void;
  /** Shield (automatic checking of new WhatsApp/SMS): off unless the user turns it on. */
  shieldOn: boolean;
  setShieldOn: (on: boolean) => void;
  /** Granny mode: bigger text and buttons, strong contrast, simpler Result (display only). */
  granny: boolean;
  setGranny: (on: boolean) => void;
  /** Address of our server for the online checks. */
  serverUrl: string;
  setServerUrl: (url: string) => void;
};

const HISTORY_KEY = 'history-v1';
const LANGUAGE_KEY = 'language-v1';
const SHIELD_KEY = 'shield-v1';
const GRANNY_KEY = 'granny-v1';
const SERVER_KEY = 'server-v1';
const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<Check | null>(null);
  const [history, setHistory] = useState<Check[]>([]);
  const [language, setLanguageState] = useState<Language>('en');
  const [shieldOn, setShieldOnState] = useState(false);
  const [granny, setGrannyState] = useState(false);
  const [serverUrl, setServerUrlState] = useState(DEFAULT_SERVER);

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
    AsyncStorage.getItem(SHIELD_KEY)
      .then((saved) => setShieldOnState(saved === 'on'))
      .catch(() => {});
    AsyncStorage.getItem(GRANNY_KEY)
      .then((saved) => setGrannyState(saved === 'on'))
      .catch(() => {});
    AsyncStorage.getItem(SERVER_KEY)
      .then((saved) => { if (saved) setServerUrlState(saved); })
      .catch(() => {});
  }, []);

  function setServerUrl(url: string) {
    const clean = url.trim() || DEFAULT_SERVER;
    setServerUrlState(clean);
    AsyncStorage.setItem(SERVER_KEY, clean).catch(() => {});
  }

  function setGranny(on: boolean) {
    setGrannyState(on);
    AsyncStorage.setItem(GRANNY_KEY, on ? 'on' : 'off').catch(() => {});
  }

  function setShieldOn(on: boolean) {
    setShieldOnState(on);
    AsyncStorage.setItem(SHIELD_KEY, on ? 'on' : 'off').catch(() => {});
  }

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

  /** A new check from the Scan screen: always a new case. */
  function runCheck(text: string, job: JobAnswers | null = null): Check {
    const check: Check = { id: String(Date.now()), text, job, result: engine.check(text, job), savedAt: null };
    setCurrent(check);
    return check;
  }

  /**
   * Follow-up on the open case (Job check answers, or a new message from them).
   * Keeps the same case; if it was saved, the saved copy in History is updated too.
   */
  function updateCase(text: string, job: JobAnswers | null) {
    if (!current) return;
    const updated: Check = { ...current, text, job, result: engine.check(text, job) };
    if (current.savedAt) {
      updated.savedAt = new Date().toISOString();
      writeHistory([updated, ...history.filter((c) => c.id !== updated.id)]);
    }
    setCurrent(updated);
  }

  /** Adds their new message to the open case, then checks the whole case again. */
  function addToCase(newText: string) {
    if (!current || newText.trim() === '') return;
    updateCase(current.text + '\n\n' + newText.trim(), current.job);
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
    updateCase,
    addToCase,
    openCheck: setCurrent,
    saveCurrent,
    clearHistory: () => {
      writeHistory([]);
      if (current) setCurrent({ ...current, savedAt: null });
    },
    language,
    setLanguage: (next) => chooseLanguage(next),
    shieldOn,
    setShieldOn,
    granny,
    setGranny,
    serverUrl,
    setServerUrl,
  };

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore must be used inside StoreProvider');
  return store;
}
