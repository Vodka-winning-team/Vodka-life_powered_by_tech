// Scan screen: paste a message, then check it.
// TODO(C): share-in from WhatsApp/SMS needs a development build (not Expo Go); add after the 18:00 sync.

import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { Button, Label, Screen } from '@/components/ui';
import { t } from '@/constants/strings';
import { FontSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { sampleCheck } from '@/lib/sample';
import { useStore } from '@/lib/store';

export default function ScanScreen() {
  const theme = useTheme();
  const { runCheck, openCheck } = useStore();
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

  function trySample() {
    openCheck(sampleCheck);
    router.push('/result');
  }

  return (
    <Screen>
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

      {__DEV__ && <Button kind="secondary" title={t('sampleButton')} onPress={trySample} />}
    </Screen>
  );
}

const styles = StyleSheet.create({
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
