// Shield: while it is on, each new WhatsApp/SMS notification is checked with Pushkar's engine.shouldAlert().
// If it has warning signs, the phone shows "Stop – warning signs found / Tap to see why".
// Tapping the alert opens FraudLens with the message (same path as share-in), so the Result shows why.
// Nothing is saved or sent anywhere.

import { useEffect } from 'react';

import Shield from '../../modules/fraudlens-shield';
import { t } from '@/constants/strings';
import { engine } from '@/lib/data';
import { useStore } from '@/lib/store';

export function ShieldWatcher() {
  const { shieldOn } = useStore();

  useEffect(() => {
    const shield = Shield; // a local copy, so TypeScript knows it isn't null inside the listener
    if (!shield || !shieldOn) return;
    shield.createChannel(t('shieldChannelName'), t('shieldChannelDescription'));

    const subscription = shield.addListener('onMessage', ({ app, text }) => {
      // debug = true only lets adb test notifications through ("com.android.shell"); real users never get those.
      const { alert, level } = engine.shouldAlert(app, text, true);
      if (!alert || level === 'NONE') return;
      const id = Date.now() % 1000000000; // a different id per alert, so each one stays visible
      shield.showAlert(id, t(`shieldAlertTitle${level}`), t('shieldAlertBody'), text);
    });
    return () => subscription.remove();
  }, [shieldOn]);

  return null;
}
