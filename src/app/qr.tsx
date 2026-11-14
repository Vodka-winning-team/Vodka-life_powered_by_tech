// Scan a QR code: the camera reads the code, and Verifye checks what is inside (usually a link)
// BEFORE anything opens. The link is never opened by the app: the user gets a Result first.

import { CameraView, useCameraPermissions } from 'expo-camera';
import { router } from 'expo-router';
import { useRef } from 'react';
import { Linking, StyleSheet, View } from 'react-native';

import { Button, Label, Screen, Warning } from '@/components/ui';
import { t } from '@/constants/strings';
import { RadiusCard } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { leaveNotice } from '@/lib/notice';
import { useStore } from '@/lib/store';

export default function QrScreen() {
  const theme = useTheme();
  const { runCheck } = useStore();
  const [permission, askPermission] = useCameraPermissions();
  // The camera reports the same code many times a second: only the first one counts.
  const done = useRef(false);

  function onScanned(data: string) {
    if (done.current) return;
    done.current = true;
    const text = data.trim();
    const check = text === '' ? null : runCheck(text);
    const notUsable = check?.result.findings.some((f) => f.kind === 'empty_message') ?? true;
    if (notUsable) {
      // The code holds nothing we can check (random characters): back to Check with the warning.
      leaveNotice('notMessage');
      router.dismissTo('/');
    } else {
      router.replace('/result');
    }
  }

  // Still asking Android whether the camera is allowed.
  if (!permission) {
    return (
      <Screen>
        <Label>{t('onlineLoading')}</Label>
      </Screen>
    );
  }

  if (!permission.granted) {
    return (
      <Screen>
        <Warning title={t('qrTitle')}>{t('qrNeedsCamera')}</Warning>
        {/* If Android won't ask again (refused twice), open the app's settings so it can be allowed there. */}
        <Button title={t('qrAllow')} onPress={() => (permission.canAskAgain ? askPermission() : Linking.openSettings())} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Label>{t('qrHint')}</Label>
      <View style={[styles.frame, { borderColor: theme.border }]}>
        <CameraView
          style={styles.camera}
          facing="back"
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={(event) => onScanned(event.data)}
        />
      </View>
      <Label variant="small">{t('qrSafe')}</Label>
    </Screen>
  );
}

const styles = StyleSheet.create({
  frame: { borderWidth: 2, borderRadius: RadiusCard, overflow: 'hidden', aspectRatio: 1 },
  camera: { flex: 1 },
});
