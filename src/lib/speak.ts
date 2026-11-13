// Read the result aloud (for people who struggle to read). Uses the phone's own voices, offline.
// English and French voices are standard; there is no Kreol voice, so Kreol is read with the French voice (partial).

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

export function speak(text: string, onDone: () => void) {
  Speech.stop();
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
}
