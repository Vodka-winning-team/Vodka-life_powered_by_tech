// Welcome: the first screen a new user sees. The few options that matter, each with one switch:
// language, night mode, Granny mode (bigger text) and online checks. Everything can be changed
// later in Settings.

import { router } from 'expo-router';
import { StyleSheet, Switch, View } from 'react-native';

import { Button, Card, Chip, Label, Screen } from '@/components/ui';
import { t, type Language } from '@/constants/strings';
import { Spacing } from '@/constants/theme';
import { setNight, useNight } from '@/lib/night';
import { useStore } from '@/lib/store';

// Each language is written in its own language.
const LANGUAGES: { id: Language; name: string }[] = [
  { id: 'en', name: 'English' },
  { id: 'fr', name: 'Français' },
  { id: 'mfe', name: 'Kreol' },
];

export default function WelcomeScreen() {
  const { language, setLanguage, granny, setGranny, online, setOnline, finishWelcome } = useStore();
  const night = useNight();

  function start() {
    finishWelcome();
    router.dismissTo('/');
  }

  return (
    <Screen>
      <Label variant="title">{t('welcomeTitle')}</Label>
      <Label>{t('welcomeHint')}</Label>

      <View style={styles.languages} accessibilityLabel={t('languageLabel')}>
        {LANGUAGES.map((l) => (
          <Chip key={l.id} title={l.name} selected={l.id === language} onPress={() => setLanguage(l.id)} />
        ))}
      </View>

      <Card>
        <View style={styles.row}>
          <View style={styles.grow}>
            <Label variant="label">{t('nightMode')}</Label>
          </View>
          <Switch value={night} accessibilityLabel={t('nightMode')} onValueChange={setNight} />
        </View>
      </Card>

      <Card>
        <View style={styles.row}>
          <View style={styles.grow}>
            <Label variant="label">{t('grannyMode')}</Label>
          </View>
          <Switch value={granny} accessibilityLabel={t('grannyMode')} onValueChange={setGranny} />
        </View>
      </Card>

      <Card>
        <View style={styles.row}>
          <View style={styles.grow}>
            <Label variant="label">{t('onlineMode')}</Label>
          </View>
          <Switch value={online} accessibilityLabel={t('onlineMode')} onValueChange={setOnline} />
        </View>
        <Label variant="small">{online ? t('onlineModeOnHint') : t('onlineModeOffHint')}</Label>
      </Card>

      <Button title={t('welcomeStart')} onPress={start} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  languages: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  row: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  grow: { flex: 1 },
});
