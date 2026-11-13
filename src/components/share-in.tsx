// Share-in: in WhatsApp/SMS, long-press a message → Share → FraudLens.
// The app opens, checks the shared text and shows the Result screen. (APK only: not in Expo Go or on the web.)

import { router } from 'expo-router';
import { useShareIntentContext } from 'expo-share-intent';
import { useEffect } from 'react';

import { useStore } from '@/lib/store';

export function ShareIn() {
  const { hasShareIntent, shareIntent, resetShareIntent } = useShareIntentContext();
  const { runCheck } = useStore();

  useEffect(() => {
    if (!hasShareIntent) return;
    const shared = (shareIntent.text ?? shareIntent.webUrl ?? '').trim();
    resetShareIntent();
    if (shared === '') return;
    // A too-short share still opens the Result, which then says "Paste the whole message" (never "no warning signs").
    runCheck(shared);
    router.push('/result');
    // Runs only when a new share arrives, not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasShareIntent]);

  return null;
}
