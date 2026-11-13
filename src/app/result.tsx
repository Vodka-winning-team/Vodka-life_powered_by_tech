// Result screen: level banner, the message with X-Ray highlights, and each finding with its source.

import { router } from 'expo-router';

import { Button, Card, HighlightedText, Label, LevelBanner, LevelTag, Screen } from '@/components/ui';
import { t } from '@/constants/strings';
import { useStore } from '@/lib/store';

export default function ResultScreen() {
  const { current, saveCurrent } = useStore();

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
          <Label variant="label">{finding.title}</Label>
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
    </Screen>
  );
}
