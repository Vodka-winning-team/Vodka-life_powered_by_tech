// History: checks the user chose to save (stored only on this phone).

import { router } from 'expo-router';
import { Pressable } from 'react-native';

import { Button, Card, Label, LevelTag, Screen } from '@/components/ui';
import { t } from '@/constants/strings';
import { useStore, type Check } from '@/lib/store';
import { localDateTime } from '@/lib/time';

export default function HistoryScreen() {
  const { history, openCheck, clearHistory } = useStore();

  function open(check: Check) {
    openCheck(check);
    router.push('/result');
  }

  return (
    <Screen>
      {history.length === 0 && <Label>{t('historyEmpty')}</Label>}
      {history.map((check) => (
        <Pressable key={check.id} accessibilityRole="button" onPress={() => open(check)}>
          <Card>
            <LevelTag level={check.result.level} />
            <Label numberOfLines={2}>{check.text}</Label>
            <Label variant="small">{localDateTime(check.savedAt)}</Label>
          </Card>
        </Pressable>
      ))}
      {history.length > 0 && <Button kind="secondary" title={t('historyClear')} onPress={clearHistory} />}
    </Screen>
  );
}
