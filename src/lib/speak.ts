// Read the result aloud (for people who struggle to read).
// Online: our server asks myt AI Cloud for the audio and the app plays it.
// Offline, or when the server has no voice set up: the phone's own voices.
// English and French voices are standard; there is no Kreol voice, so Kreol is read with the French voice (partial).

import { createAudioPlayer, type AudioPlayer } from 'expo-audio';
import * as Speech from 'expo-speech';

import { findingDetail, findingTitle, getLanguage, t } from '@/constants/strings';
import type { CheckResult, Level } from '@/engine';
import { formatPhone } from '@/lib/phone';

const VOICE: Record<string, string> = { en: 'en-GB', fr: 'fr-FR', mfe: 'fr-FR' };

/** The words to read: level, the plain sentence, each finding, then the official numbers. */
export function speechFor(result: CheckResult, level: Level = result.level): string {
  // `level` is the level shown on the banner (it can be stronger than the phone's own, after the online check).
  const parts = [t(`level${level}`), t(`granny${level}`)];
  for (const finding of result.findings) {
    parts.push(findingTitle(finding), findingDetail(finding));
  }
  for (const contact of result.contacts) {
    parts.push(`${t('actionsCall')}: ${contact.name}, ${formatPhone(contact.phone)}`);
  }
  // Short pauses between parts.
  return parts.filter(Boolean).join('. ').replace(/\.\./g, '.');
}

/** The online voice that is playing now, if any. */
let player: AudioPlayer | null = null;
/** Goes up on every speak() and stopSpeaking(), so a voice that is still loading knows it was cancelled. */
let turn = 0;
/** Timer that falls back to the phone's voice if the online voice never starts. */
let startTimer: ReturnType<typeof setTimeout> | null = null;

/** How long the online voice may take to start before we use the phone's voice instead. */
const START_LIMIT_MS = 8000;

function clearStartTimer() {
  if (startTimer) {
    clearTimeout(startTimer);
    startTimer = null;
  }
}

/** Reads the text with the phone's own voice (works offline). */
function phoneVoice(text: string, onDone: () => void) {
  Speech.speak(text, {
    language: VOICE[getLanguage()] ?? 'en-GB',
    rate: 0.95,
    onDone,
    onStopped: onDone,
    onError: onDone,
  });
}

/** Asks the server whether text-to-speech is set up (3 seconds at most). */
async function onlineVoiceReady(server: string): Promise<boolean> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3000);
  try {
    const response = await fetch(`${server}/api/v1/speech/status`, { signal: controller.signal });
    const status = (await response.json()) as { ready?: boolean };
    return status.ready === true;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

/** Reads the text aloud: the server's voice when it is available, else the phone's voice. */
export async function speak(text: string, onDone: () => void, server = '') {
  stopSpeaking();
  const myTurn = turn;
  const root = server.replace(/\/+$/, '');
  const online = root !== '' && (await onlineVoiceReady(root));
  // "Stop reading" was tapped while we were asking the server: don't start.
  if (myTurn !== turn) return;
  if (online) {
    const audio = createAudioPlayer({ uri: `${root}/api/v1/speech?text=${encodeURIComponent(text.slice(0, 1500))}` });
    player = audio;
    let started = false;
    audio.addListener('playbackStatusUpdate', (status) => {
      if (status.playing) started = true;
      if (status.didJustFinish) {
        clearStartTimer();
        onDone();
      }
    });
    audio.play();
    // If the audio never starts (the voice service failed), don't stay silent: use the phone's voice.
    startTimer = setTimeout(() => {
      startTimer = null;
      if (started || player !== audio || myTurn !== turn) return;
      try {
        audio.remove();
      } catch {
        // The player was already gone.
      }
      player = null;
      phoneVoice(text, onDone);
    }, START_LIMIT_MS);
    return;
  }
  phoneVoice(text, onDone);
}

export function stopSpeaking() {
  turn += 1;
  clearStartTimer();
  Speech.stop();
  if (player) {
    // Pause first (stops the sound at once), then free the player.
    try {
      player.pause();
      player.remove();
    } catch {
      // The player was already gone: nothing to stop.
    }
    player = null;
  }
}
