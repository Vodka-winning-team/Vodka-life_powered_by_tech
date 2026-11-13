// Scan screen: paste a message, then check it.
// TODO(C): share-in from WhatsApp/SMS needs a development build (not Expo Go); add after the 18:00 sync.

import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { Button, Chip, Label, Screen } from '@/components/ui';
import { t, type Language } from '@/constants/strings';
import { FontSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useStore } from '@/lib/store';

export default function ScanScreen() {
  const theme = useTheme();
  const { runCheck, language, setLanguage } = useStore();
  const [text, setText] = useState('');
  const [error, setError] = useState('');

  function check() {
    if (text.trim() === '') {
      setError(t('scanEmpty'));
      return;
    }
    setError('');
    runCheck(text.trim());
    router.push('/result');
  }


  return (
    <Screen>
      <View style={styles.languages} accessibilityLabel={t('languageLabel')}>
        {LANGUAGES.map((l) => (
          <Chip key={l.id} title={l.name} selected={l.id === language} onPress={() => setLanguage(l.id)} />
        ))}
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
        style={[
          styles.input,
          { color: theme.text, backgroundColor: theme.backgroundElement, borderColor: theme.border },
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
});
