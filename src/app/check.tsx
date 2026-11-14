// Opened by the home screen widget ("Check copied message", link fraudlens://check).
// Reads the copied text and checks it straight away, like share-in. Nothing is sent anywhere.
// Surprise card (fail safe): nothing copied, or too little text -> back to the Check tab with a
// "copy the message first" note, never a result.

import * as Clipboard from 'expo-clipboard';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { useTheme } from '@/hooks/use-theme';
import { leaveNotice } from '@/lib/notice';
import { useStore } from '@/lib/store';

export default function CheckCopiedScreen() {
  const theme = useTheme();
  const { runCheck } = useStore();

  useEffect(() => {
    let cancelled = false;
    Clipboard.getStringAsync()
      .catch(() => '')
      .then((copied) => {
        if (cancelled) return;
        const text = (copied ?? '').trim();
        const check = text === '' ? null : runCheck(text);
        const tooShort = check?.result.findings.some((f) => f.kind === 'empty_message') ?? true;
        if (tooShort) {
          leaveNotice('clipboardEmpty');
          router.dismissTo('/');
        } else {
          router.replace('/result');
        }
      });
    return () => {
      cancelled = true;
    };
    // Runs once, when the widget opens this screen.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.background }}>
      <ActivityIndicator color={theme.primary} size="large" />
    </View>
  );
}
