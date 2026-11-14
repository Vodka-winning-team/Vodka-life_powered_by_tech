// Settings (opened from the gear on the Check tab): Granny mode, automatic checking (Shield),
// the first-time tour and the server address. Moved here from the Check screen so that screen
// has one job: check a message.

import { router } from 'expo-router';
import { StyleSheet, Switch, TextInput, View } from 'react-native';

import Shield from '../../modules/fraudlens-shield';

import { Button, Card, Label, Screen, Status } from '@/components/ui';
import { t } from '@/constants/strings';
import { FontSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useStore } from '@/lib/store';

export default function SettingsScreen() {
  const theme = useTheme();
  const { shieldOn, setShieldOn, granny, setGranny, serverUrl, setServerUrl, setTourStep } = useStore();

  return (
    <Screen>
      <Card>
        <View style={styles.switchRow}>
          <View style={styles.grow}>
            <Label>{t('grannyMode')}</Label>
          </View>
          <Switch value={granny} accessibilityLabel={t('grannyMode')} onValueChange={setGranny} />
        </View>
      </Card>

      {/* Shield: Android APK only (no native part in Expo Go or on the web). */}
      {Shield && (
        <Card>
          <View style={styles.switchRow}>
            <View style={styles.grow}>
              <Label>{t('shieldSwitch')}</Label>
            </View>
            <Switch
              value={shieldOn}
              accessibilityLabel={t('shieldSwitch')}
              onValueChange={(on) => (on ? router.push('/shield') : setShieldOn(false))}
            />
          </View>
          <Label variant="small">{t('shieldSwitchHint')}</Label>
          {shieldOn && Shield.isAccessEnabled() && <Status>{t('shieldOnStatus')}</Status>}
          {shieldOn && !Shield.isAccessEnabled() && (
            <Button kind="secondary" title={t('shieldNeedsAccess')} onPress={() => router.push('/shield')} />
          )}
        </Card>
      )}

      {/* The tour starts on the Check tab, so go back there. */}
      <Button
        kind="secondary"
        title={t('tourAgain')}
        onPress={() => {
          setTourStep(0);
          router.dismissTo('/');
        }}
      />

      {/* Where the online checks go (our server). Saved when the keyboard closes. */}
      <Card>
        <Label variant="small">{t('serverLabel')}</Label>
        <TextInput
          defaultValue={serverUrl}
          key={serverUrl}
          onEndEditing={(e) => setServerUrl(e.nativeEvent.text)}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
          accessibilityLabel={t('serverLabel')}
          style={[styles.server, { color: theme.text, backgroundColor: theme.background, borderColor: theme.border }]}
        />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  grow: { flex: 1 },
  server: { borderWidth: 1, borderRadius: Radius, padding: Spacing.two, fontSize: FontSize.small, minHeight: 48 },
});
