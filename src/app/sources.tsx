// Our sources: every official dataset in the app, with record count, date and link.

import { Linking, Pressable } from 'react-native';

import { Card, Label, Screen } from '@/components/ui';
import { t } from '@/constants/strings';
import { sources } from '@/lib/data';
import { prettyDay } from '@/lib/time';

export default function SourcesScreen() {
  return (
    <Screen>
      <Label>{t('sourcesHint')}</Label>
      {sources.map((s) => (
        <Pressable key={s.title} accessibilityRole="link" onPress={() => s.url && Linking.openURL(s.url)}>
          <Card>
            <Label variant="label">{t(s.title)}</Label>
            <Label>{t(s.text)}</Label>
            <Label variant="small">
              {s.count} {t('sourcesRecords')} · {t('sourcesChecked')} {prettyDay(s.snapshot)}
            </Label>
            <Label variant="small" numberOfLines={1}>
              {s.url}
            </Label>
          </Card>
        </Pressable>
      ))}
    </Screen>
  );
}
