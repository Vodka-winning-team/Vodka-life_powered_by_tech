// Shield setup: explains what it does, then 4 steps. Texts from D's docs/strings-shield.md.
// Each step shows "Done" once Android reports it (checked again whenever the user comes back to the app).

import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { AppState, PermissionsAndroid, Platform } from 'react-native';

import Shield from '../../modules/fraudlens-shield';
import { Button, Card, Label, Screen } from '@/components/ui';
import { t } from '@/constants/strings';
import { useStore } from '@/lib/store';

function readStatus() {
  return {
    access: Shield?.isAccessEnabled() ?? false,
    alerts: Shield?.canShowAlerts() ?? false,
  };
}

export default function ShieldSetupScreen() {
  const { setShieldOn } = useStore();
  const [status, setStatus] = useState(readStatus);

  // Coming back from Android settings: read the status again.
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') setStatus(readStatus());
    });
    return () => subscription.remove();
  }, []);

  if (!Shield) {
    return (
      <Screen>
        <Label>{t('shieldLimits')}</Label>
      </Screen>
    );
  }

  async function allowAlerts() {
    // Android 13+ asks with a pop-up; older phones allow alerts by default (else open app settings).
    if (Platform.OS === 'android' && Number(Platform.Version) >= 33) {
      await PermissionsAndroid.request('android.permission.POST_NOTIFICATIONS');
    } else {
      Shield?.openAppSettings();
    }
    setStatus(readStatus());
  }

  function turnOn() {
    if (!status.access) {
      Shield?.openAccessSettings();
      return;
    }
    setShieldOn(true);
    router.back();
  }

  return (
    <Screen>
      <Label>{t('shieldSetupWhat')}</Label>
      <Label variant="small">{t('shieldSetupNot')}</Label>

      <Card>
        <Label variant="label">{t('shieldStepAccess')}</Label>
        <Label variant="small">{t('shieldStepAccessHint')}</Label>
        {status.access ? (
          <Label>✓ {t('shieldStepDone')}</Label>
        ) : (
          <Button kind="secondary" title={t('shieldOpenSettings')} onPress={() => Shield?.openAccessSettings()} />
        )}
      </Card>

      <Card>
        <Label variant="label">{t('shieldStepAlerts')}</Label>
        {status.alerts ? (
          <Label>✓ {t('shieldStepDone')}</Label>
        ) : (
          <Button kind="secondary" title={t('shieldOpenSettings')} onPress={allowAlerts} />
        )}
      </Card>

      <Card>
        <Label variant="label">{t('shieldStepBattery')}</Label>
        <Label variant="small">{t('shieldStepBatteryHint')}</Label>
        <Button kind="secondary" title={t('shieldOpenSettings')} onPress={() => Shield?.openAppSettings()} />
      </Card>

      <Card>
        <Label variant="label">{t('shieldStepPreview')}</Label>
        <Label variant="small">{t('shieldStepPreviewHint')}</Label>
      </Card>

      <Label variant="small">{t('shieldLimits')}</Label>
      <Button title={t('shieldDoneButton')} onPress={turnOn} />
    </Screen>
  );
}
