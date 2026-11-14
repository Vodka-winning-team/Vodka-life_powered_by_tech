// App state shared by the screens: the current check, and the saved history.
// History is saved on the phone (AsyncStorage) ONLY when the user taps Save.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

import { setLanguage as setStringsLanguage, type Language } from '@/constants/strings';
import type { CheckResult, JobAnswers, Level } from '@/engine';
import { engine } from '@/lib/data';
import { looksLikeMessage } from '@/lib/input-check';
import { markFresh } from '@/lib/once';
import { DEFAULT_SERVER } from '@/lib/online';

export type Check = {
  id: string;
  text: string;
  job: JobAnswers | null;
  result: CheckResult;
  savedAt: string | null;
  /** The online check's answer for this case, kept so History shows the same level as the Result did. */
  onlineLevel?: Level;
  /** True when the text was read from a QR code. */
  fromQr?: boolean;
};

type Store = {
  current: Check | null;
  history: Check[];
  runCheck: (text: string, job?: JobAnswers | null, fromQr?: boolean) => Check;
  /** Remember the online check's answer with the current case (and its saved copy). */
  noteOnlineLevel: (level: Level) => void;
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
  /** True until the user has seen the welcome page (first launch). */
  welcomeDue: boolean;
  finishWelcome: () => void;
  /** Online checks on or off. Off = fully offline: nothing is sent, every check runs on the phone. */
  online: boolean;
  setOnline: (on: boolean) => void;
  /** Address of our server for the online checks. */
  serverUrl: string;
  setServerUrl: (url: string) => void;
  /** First-time tour: the step being shown (0, 1, 2...), or null when the tour is not running. */
  tourStep: number | null;
  /** Move the tour to a step; null ends it (and remembers that it was seen). */
  setTourStep: (step: number | null) => void;
};

const HISTORY_KEY = 'history-v1';
const LANGUAGE_KEY = 'language-v1';
const SHIELD_KEY = 'shield-v1';
const GRANNY_KEY = 'granny-v1';
const SERVER_KEY = 'server-v1';
const ONLINE_KEY = 'online-v1';
const WELCOME_KEY = 'welcome-v1';
const TOUR_KEY = 'tour-v1';
const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [current, setCurrent] = useState<Check | null>(null);
  const [history, setHistory] = useState<Check[]>([]);
  const [language, setLanguageState] = useState<Language>('en');
  const [shieldOn, setShieldOnState] = useState(false);
  const [granny, setGrannyState] = useState(false);
  const [serverUrl, setServerUrlState] = useState(DEFAULT_SERVER);
  // Starts off, so a phone set to offline never contacts the server while the saved choice is loading.
  const [online, setOnlineState] = useState(false);
  const [welcomeDue, setWelcomeDue] = useState(false);
  const [tourStep, setTourStepState] = useState<number | null>(null);

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
    // A phone that has never finished or skipped the tour starts it.
    AsyncStorage.getItem(TOUR_KEY)
      .then((saved) => { if (saved !== 'done') setTourStepState(0); })
      .catch(() => {});
    AsyncStorage.getItem(WELCOME_KEY)
      .then((saved) => setWelcomeDue(saved !== 'done'))
      .catch(() => {});
    AsyncStorage.getItem(ONLINE_KEY)
      .then((saved) => setOnlineState(saved !== 'off'))
      .catch(() => {});
    AsyncStorage.getItem(SERVER_KEY)
      .then((saved) => { if (saved) setServerUrlState(saved); })
      .catch(() => {});
  }, []);

  function setTourStep(step: number | null) {
    setTourStepState(step);
    if (step === null) AsyncStorage.setItem(TOUR_KEY, 'done').catch(() => {});
  }

  function finishWelcome() {
    setWelcomeDue(false);
    AsyncStorage.setItem(WELCOME_KEY, 'done').catch(() => {});
  }

  function setOnline(on: boolean) {
    setOnlineState(on);
    AsyncStorage.setItem(ONLINE_KEY, on ? 'on' : 'off').catch(() => {});
  }

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
  function runCheck(text: string, job: JobAnswers | null = null, fromQr = false): Check {
    // Surprise card (wrong input): random typing is treated like an empty message, so it never gets a result.
    const result = looksLikeMessage(text) ? engine.check(text, job) : engine.check('');
    const check: Check = { id: String(Date.now()), text, job, result, savedAt: null, fromQr };
    markFresh(check.id);
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

  function noteOnlineLevel(level: Level) {
    if (!current || current.onlineLevel === level) return;
    const updated = { ...current, onlineLevel: level };
    setCurrent(updated);
    if (updated.savedAt) writeHistory(history.map((c) => (c.id === updated.id ? updated : c)));
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
    noteOnlineLevel,
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
    welcomeDue,
    finishWelcome,
    online,
    setOnline,
    serverUrl,
    setServerUrl,
    tourStep,
    setTourStep,
  };

  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}

export function useStore(): Store {
  const store = useContext(StoreContext);
  if (!store) throw new Error('useStore must be used inside StoreProvider');
  return store;
}
