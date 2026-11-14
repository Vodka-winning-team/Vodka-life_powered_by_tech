// Online checks: the app sends the message to our server (server/, FastAPI), which adds
// the hybrid score, live link and number checks, and the memory of reported messages.
// If the server can't be reached, the app keeps working with the checks on the phone.

import AsyncStorage from '@react-native-async-storage/async-storage';

/** Default server address. It can be changed in Settings on the Scan screen. */
export const DEFAULT_SERVER = process.env.EXPO_PUBLIC_API_URL ?? 'http://10.231.16.165:8000';

const TIMEOUT_MS = 10000;
const DEVICE_KEY = 'device-v1';

export type OnlineTactic = { tactic: string; label: string; contribution: number; details: string[] };
export type OnlineIntelFinding = { severity: 'danger' | 'warning' | 'info'; title: string; detail: string; target: string };

/** The parts of the server's answer that the app shows. */
export type OnlineResult = {
  risk_score: number;
  risk_level: 'low' | 'medium' | 'high';
  summary: string;
  category_label: string;
  tactics: OnlineTactic[];
  intel: { findings: OnlineIntelFinding[]; blocklisted: boolean };
  verification: { community_reports: number };
};

export type ReportAnswer = { status: string; message: string };

/** fetch() with a time limit, so a slow or missing server never blocks the screen. */
async function post(server: string, path: string, body: object): Promise<unknown> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(`${server.replace(/\/+$/, '')}/api/v1${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Server answered ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

/** Ask the server to check a message. Returns null when the server can't be reached. */
export async function analyzeOnline(server: string, text: string): Promise<OnlineResult | null> {
  try {
    return (await post(server, '/analyze', { text: text.slice(0, 5000), channel: 'sms' })) as OnlineResult;
  } catch {
    return null;
  }
}

/** A random id for this install, so the server can count reports from different phones. Not linked to the user. */
async function deviceId(): Promise<string> {
  const saved = await AsyncStorage.getItem(DEVICE_KEY);
  if (saved) return saved;
  const fresh = `v-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
  await AsyncStorage.setItem(DEVICE_KEY, fresh);
  return fresh;
}

/** Report a message so the server remembers it for other users. Returns null when the server can't be reached. */
export async function reportOnline(server: string, text: string): Promise<ReportAnswer | null> {
  try {
    const reporter_id = await deviceId();
    return (await post(server, '/report', { text: text.slice(0, 5000), label: 'scam', reporter_id })) as ReportAnswer;
  } catch {
    return null;
  }
}

/** A short lesson about one trick used in fake messages. */
export type Lesson = { id: string; label: string; lesson: string; safe_action: string };
export type QuizQuestion = { id: string; message: string; question: string; options: string[]; answer: number; explanation: string };

/** Read something from the server. Returns null when the server can't be reached. */
export async function getOnline<T>(server: string, path: string): Promise<T | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(`${server.replace(/\/+$/, '')}/api/v1${path}`, { signal: controller.signal });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

/** The server's answer to "should I make this payment?". */
export type PaymentAnswer = {
  decision: 'allow' | 'warn' | 'pause';
  headline: string;
  reasons: { severity: string; text: string }[];
  safe_actions: { id: string; title: string; detail: string }[];
  cooldown_seconds: number;
};

/** Check a payment before making it. Returns null when the server can't be reached. */
export async function checkPayment(
  server: string,
  payment: { payee_name: string | null; payee_account: string; amount: number },
): Promise<PaymentAnswer | null> {
  try {
    return (await post(server, '/payments/check', payment)) as PaymentAnswer;
  } catch {
    return null;
  }
}
