// Our sources: every official dataset in the app, with record count, date and link.

import { Linking, Pressable } from 'react-native';

import { Card, Label, Screen } from '@/components/ui';
import { t } from '@/constants/strings';
import { sources } from '@/lib/data';

export default function SourcesScreen() {
  return (
    <Screen>
      <Label>{t('sourcesHint')}</Label>
      {sources.map((s) => (
        <Pressable key={s.name} accessibilityRole="link" onPress={() => s.url && Linking.openURL(s.url)}>
          <Card>
            <Label variant="label">{s.name}</Label>
            <Label variant="small">
              {s.count} {t('sourcesRecords')} · {t('sourcesChecked')} {s.snapshot}
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
