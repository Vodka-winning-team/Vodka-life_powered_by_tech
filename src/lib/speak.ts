// Read the result aloud (for people who struggle to read).
// Online: our server asks myt AI Cloud for the audio and the app plays it.
// Offline, or when the server has no voice set up: the phone's own voices.
// English and French voices are standard; there is no Kreol voice, so Kreol is read with the French voice (partial).

import { createAudioPlayer, type AudioPlayer } from 'expo-audio';
import * as Speech from 'expo-speech';

import { findingDetail, findingTitle, getLanguage, t } from '@/constants/strings';
import type { CheckResult } from '@/engine';
import { formatPhone } from '@/lib/phone';

const VOICE: Record<string, string> = { en: 'en-GB', fr: 'fr-FR', mfe: 'fr-FR' };

/** The words to read: level, the plain sentence, each finding, then the official numbers. */
export function speechFor(result: CheckResult): string {
  const parts = [t(`level${result.level}`), t(`granny${result.level}`)];
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
  const root = server.replace(/\/+$/, '');
  if (root !== '' && (await onlineVoiceReady(root))) {
    const audio = createAudioPlayer({ uri: `${root}/api/v1/speech?text=${encodeURIComponent(text.slice(0, 1500))}` });
    player = audio;
    audio.addListener('playbackStatusUpdate', (status) => {
      if (status.didJustFinish) onDone();
    });
    audio.play();
    return;
  }
  Speech.speak(text, {
    language: VOICE[getLanguage()] ?? 'en-GB',
    rate: 0.95,
    onDone,
    onStopped: onDone,
    onError: onDone,
  });
}

export function stopSpeaking() {
  Speech.stop();
  if (player) {
    player.remove();
    player = null;
  }
}
