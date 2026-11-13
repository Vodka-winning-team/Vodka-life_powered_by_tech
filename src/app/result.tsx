// Result screen: level banner, the message with X-Ray highlights, and each finding with its source.

import { router } from 'expo-router';
import { useState } from 'react';
import { Linking, StyleSheet, TextInput } from 'react-native';

import { Button, Card, HighlightedText, Label, LevelBanner, LevelTag, Screen } from '@/components/ui';
import { findingDetail, findingTitle, t } from '@/constants/strings';
import { FontSize, Radius, Spacing } from '@/constants/theme';
import { useLook } from '@/hooks/use-look';
import { useTheme } from '@/hooks/use-theme';
import { dialNumber, formatPhone } from '@/lib/phone';
import { useStore } from '@/lib/store';
import { prettyDay } from '@/lib/time';

export default function ResultScreen() {
  const theme = useTheme();
  const { current, saveCurrent, addToCase } = useStore();
  const { granny, scale } = useLook();
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
    // A new case (shared message, follow-up) starts a fresh page at the top, so the level banner is always seen.
    <Screen key={`${current.id}-${text}`}>
      <LevelBanner level={result.level} />

      {/* Granny mode: one plain sentence, then the official number to call, first. Details stay below. */}
      {granny && (
        <>
          <Label variant="label">{t(`granny${result.level}`)}</Label>
          {result.contacts.map((c) => (
            <Button
              key={c.name + c.phone}
              title={`${c.name}: ${formatPhone(c.phone)}`}
              onPress={() => Linking.openURL(`tel:${dialNumber(c.phone)}`).catch(() => {})}
            />
          ))}
          {result.contacts.length === 0 && (
            <Button title={t('resultActionsButton')} onPress={() => router.push('/actions')} />
          )}
        </>
      )}

      <Card>
        <Label variant="label">{t('resultMessage')}</Label>
        <HighlightedText text={text} highlights={highlights} />
      </Card>

      <Label variant="label">{t('resultFindings')}</Label>
      {result.findings.length === 0 && <Label>{t('resultNoFindings')}</Label>}
      {result.findings.map((finding, i) => (
        <Card key={`${finding.kind}-${i}`}>
          {/* A NONE finding is just information (e.g. "listed"), so it gets a neutral tag. */}
          <LevelTag level={finding.level} label={finding.level === 'NONE' ? t('findingInfo') : undefined} />
          <Label variant="label">{findingTitle(finding)}</Label>
          <Label>{findingDetail(finding)}</Label>
          {finding.source && (
            <Label variant="small">
              {t('sourceLabel')}: {finding.source.name} ({prettyDay(finding.source.date)})
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
          style={[styles.input, { color: theme.text, borderColor: theme.border, fontSize: FontSize.body * scale }]}
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
