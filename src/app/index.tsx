// Scan screen: paste a message, then check it.
// TODO(C): share-in from WhatsApp/SMS needs a development build (not Expo Go); add after the 18:00 sync.

import { router } from 'expo-router';
import { useRef, useState, type ComponentRef } from 'react';
import { ScrollView, StyleSheet, Switch, TextInput, View } from 'react-native';

import Shield from '../../modules/fraudlens-shield';

import { Button, Card, Chip, Label, Screen } from '@/components/ui';
import { findingTitle, t, type Language } from '@/constants/strings';
import { FontSize, Radius, Spacing } from '@/constants/theme';
import { useLook } from '@/hooks/use-look';
import { useTheme } from '@/hooks/use-theme';
import { useStore } from '@/lib/store';

export default function ScanScreen() {
  const theme = useTheme();
  const { runCheck, language, setLanguage, shieldOn, setShieldOn, granny, setGranny } = useStore();
  const { scale } = useLook();
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);

  function check() {
    if (text.trim() === '') {
      setError(t('scanEmpty'));
      return;
    }
    const check = runCheck(text.trim());
    // Surprise card (wrong input): too little text to check -> stay here and say so, never show a result.
    const tooShort = check.result.findings.find((f) => f.kind === 'empty_message');
    if (tooShort) {
      setError(findingTitle(tooShort));
      return;
    }
    setError('');
    router.push('/result');
  }

  return (
    <Screen scrollRef={scrollRef}>
      <View style={styles.languages} accessibilityLabel={t('languageLabel')}>
        {LANGUAGES.map((l) => (
          <Chip key={l.id} title={l.name} selected={l.id === language} onPress={() => setLanguage(l.id)} />
        ))}
      </View>
      <View style={styles.switchRow}>
        <View style={styles.half}>
          <Label variant="label">{t('grannyMode')}</Label>
        </View>
        <Switch value={granny} accessibilityLabel={t('grannyMode')} onValueChange={setGranny} />
      </View>
      <Label variant="small">{t('tagline')}</Label>
      <Label variant="title">{t('scanTitle')}</Label>
      <Label>{t('scanHint')}</Label>

      <TextInput
        value={text}
        onChangeText={setText}
        placeholder={t('scanPlaceholder')}
        placeholderTextColor={theme.textSecondary}
        multiline
        textAlignVertical="top"
        accessibilityLabel={t('scanPlaceholder')}
        // Keep the "Check message" button in view above the keyboard while typing.
        onFocus={() => setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 300)}
        style={[
          styles.input,
          { color: theme.text, backgroundColor: theme.backgroundElement, borderColor: theme.border, fontSize: FontSize.body * scale },
        ]}
      />
      {error !== '' && <Label variant="small">{error}</Label>}

      <Button title={t('scanButton')} onPress={check} />

      <View style={styles.row}>
        <View style={styles.half}>
          <Button kind="secondary" title={t('openHistory')} onPress={() => router.push('/history')} />
        </View>
        <View style={styles.half}>
          <Button kind="secondary" title={t('openSources')} onPress={() => router.push('/sources')} />
        </View>
      </View>
      <Button kind="secondary" title={t('numbersTitle')} onPress={() => router.push('/numbers')} />

      {/* Shield: Android APK only (the native part doesn't exist in Expo Go or on the web). Off unless turned on. */}
      {Shield && (
        <Card>
          <View style={styles.switchRow}>
            <View style={styles.half}>
              <Label variant="label">{t('shieldSwitch')}</Label>
            </View>
            <Switch
              value={shieldOn}
              accessibilityLabel={t('shieldSwitch')}
              onValueChange={(on) => (on ? router.push('/shield') : setShieldOn(false))}
            />
          </View>
          <Label variant="small">{t('shieldSwitchHint')}</Label>
          {shieldOn && Shield.isAccessEnabled() && <Label>✓ {t('shieldOnStatus')}</Label>}
          {shieldOn && !Shield.isAccessEnabled() && (
            <Button kind="secondary" title={t('shieldNeedsAccess')} onPress={() => router.push('/shield')} />
          )}
        </Card>
      )}
    </Screen>
  );
}

// Each language is written in its own language, so people can find theirs.
const LANGUAGES: { id: Language; name: string }[] = [
  { id: 'en', name: 'English' },
  { id: 'fr', name: 'Français' },
  { id: 'mfe', name: 'Kreol' },
];

const styles = StyleSheet.create({
  languages: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  input: {
    minHeight: 160,
    borderWidth: 1,
    borderRadius: Radius,
    padding: Spacing.three,
    fontSize: FontSize.body,
  },
  row: { flexDirection: 'row', gap: Spacing.two },
  half: { flex: 1 },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
});
