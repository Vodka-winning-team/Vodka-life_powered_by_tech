// Scan screen: paste a message, then check it.
// TODO(C): share-in from WhatsApp/SMS needs a development build (not Expo Go); add after the 18:00 sync.

import { router } from 'expo-router';
import { useRef, useState, type ComponentRef } from 'react';
import { ScrollView, StyleSheet, Switch, TextInput, View } from 'react-native';

import Shield from '../../modules/fraudlens-shield';

import { Button, Card, Chip, Label, Screen, Section, Status } from '@/components/ui';
import { findingTitle, t, type Language } from '@/constants/strings';
import { FontSize, LevelColors, Radius, Spacing } from '@/constants/theme';
import { useLook } from '@/hooks/use-look';
import { useTheme } from '@/hooks/use-theme';
import { useStore } from '@/lib/store';

export default function ScanScreen() {
  const theme = useTheme();
  const { runCheck, language, setLanguage, shieldOn, setShieldOn, granny, setGranny, serverUrl, setServerUrl } = useStore();
  const { scale } = useLook();
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const [inputY, setInputY] = useState(0);

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

      {/* The main task first: paste (or share) a message and check it. */}
      <Section>
        <Label variant="small">{t('tagline')}</Label>
        <Label variant="title">{t('scanTitle')}</Label>
        <Label>{t('scanHint')}</Label>
      </Section>

      <View style={styles.field} onLayout={(e) => setInputY(e.nativeEvent.layout.y)}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder={t('scanPlaceholder')}
          placeholderTextColor={theme.textSecondary}
          multiline
          textAlignVertical="top"
          accessibilityLabel={t('scanPlaceholder')}
          // Keep the box and the "Check message" button in view above the keyboard while typing.
          onFocus={() => setTimeout(() => scrollRef.current?.scrollTo({ y: Math.max(0, inputY - Spacing.three), animated: true }), 300)}
          style={[
            styles.input,
            {
              color: theme.text,
              backgroundColor: theme.backgroundElement,
              borderColor: error !== '' ? LevelColors.CAREFUL.background : theme.border,
              fontSize: FontSize.body * scale,
              lineHeight: FontSize.body * scale * 1.45,
            },
          ]}
        />
        {/* The error sits under its box and is read out by screen readers. */}
        {error !== '' && (
          <View accessibilityLiveRegion="polite">
            <Label variant="label">{error}</Label>
          </View>
        )}
        <Button title={t('scanButton')} onPress={check} />
      </View>

      {/* Look things up without a message. */}
      <Section>
        {/* Look up an agency or bank (e.g. a name heard from a friend). */}
        <Button kind="secondary" title={t('scanNumbersButton')} onPress={() => router.push('/numbers')} />
        {/* Online extras: check a payment before making it, and short lessons with a quiz. */}
        <Button kind="secondary" title={t('payTitle')} onPress={() => router.push('/pay')} />
        <Button kind="secondary" title={t('learnTitle')} onPress={() => router.push('/learn')} />
        <View style={granny ? styles.column : styles.row}>
          <View style={granny ? undefined : styles.half}>
            <Button kind="secondary" title={t('openHistory')} onPress={() => router.push('/history')} />
          </View>
          <View style={granny ? undefined : styles.half}>
            <Button kind="secondary" title={t('openSources')} onPress={() => router.push('/sources')} />
          </View>
        </View>
      </Section>

      {/* Settings: Granny mode for everyone; Shield in the Android APK only (no native part in Expo Go or on the web). */}
      <Card>
        <Label variant="label">{t('settingsTitle')}</Label>
        <View style={styles.switchRow}>
          <View style={styles.half}>
            <Label>{t('grannyMode')}</Label>
          </View>
          <Switch value={granny} accessibilityLabel={t('grannyMode')} onValueChange={setGranny} />
        </View>
        {Shield && (
          <>
            <View style={styles.switchRow}>
              <View style={styles.half}>
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
          </>
        )}
        {/* Where the online checks go (our server). Saved when the keyboard closes. */}
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
  server: { borderWidth: 1, borderRadius: Radius, padding: Spacing.two, fontSize: FontSize.small, minHeight: 48 },
  column: { gap: Spacing.two },
  field: { gap: Spacing.two },
  switchRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
});
