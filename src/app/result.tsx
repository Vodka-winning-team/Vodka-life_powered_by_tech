// Result screen: level banner, the message with X-Ray highlights, and each finding with its source.

import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput } from 'react-native';

import { Button, Card, HighlightedText, Label, LevelBanner, LevelTag, Screen } from '@/components/ui';
import { findingTitle, t } from '@/constants/strings';
import { FontSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { useStore } from '@/lib/store';

export default function ResultScreen() {
  const theme = useTheme();
  const { current, saveCurrent, addToCase } = useStore();
  const [newText, setNewText] = useState('');

  if (!current) {
    return (
      <Screen>
        <Label>{t('scanEmpty')}</Label>
        <Button title={t('scanTitle')} onPress={() => router.replace('/')} />
      </Screen>
    );
  }

  const { result, text } = current;
  const highlights = result.findings.flatMap((f) => f.highlights);

  return (
    <Screen>
      <LevelBanner level={result.level} />

      <Card>
        <Label variant="label">{t('resultMessage')}</Label>
        <HighlightedText text={text} highlights={highlights} />
      </Card>

      <Label variant="label">{t('resultFindings')}</Label>
      {result.findings.length === 0 && <Label>{t('resultNoFindings')}</Label>}
      {result.findings.map((finding, i) => (
        <Card key={`${finding.kind}-${i}`}>
          <LevelTag level={finding.level} />
          <Label variant="label">{findingTitle(finding)}</Label>
          <Label>{finding.detail}</Label>
          {finding.source && (
            <Label variant="small">
              {t('sourceLabel')}: {finding.source.name} ({finding.source.date})
            </Label>
          )}
        </Card>
      ))}

      <Button title={t('resultActionsButton')} onPress={() => router.push('/actions')} />
      <Button kind="secondary" title={t('resultJobButton')} onPress={() => router.push('/job')} />
      <Button
        kind="secondary"
        title={current.savedAt ? t('resultSaved') : t('resultSave')}
        onPress={saveCurrent}
      />

      {/* Follow-up: they send a new demand later (e.g. "now Rs 15,000 for the air ticket"). */}
      <Card>
        <Label variant="label">{t('followUpLabel')}</Label>
        <TextInput
          value={newText}
          onChangeText={setNewText}
          placeholder={t('followUpPlaceholder')}
          placeholderTextColor={theme.textSecondary}
          multiline
          accessibilityLabel={t('followUpPlaceholder')}
          style={[styles.input, { color: theme.text, borderColor: theme.border }]}
        />
        <Button
          kind="secondary"
          title={t('followUpButton')}
          onPress={() => {
            addToCase(newText);
            setNewText('');
          }}
        />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: { minHeight: 80, borderWidth: 1, borderRadius: Radius, padding: Spacing.two + 4, fontSize: FontSize.body, textAlignVertical: 'top' },
});
