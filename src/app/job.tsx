// Job check: pick the agency from the Ministry register and the cost asked, then check again.

import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

import { Button, Card, Chip, Label, Screen } from '@/components/ui';
import { t } from '@/constants/strings';
import { FontSize, Radius, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';
import { engine } from '@/lib/data';
import { useStore } from '@/lib/store';

export default function JobScreen() {
  const theme = useTheme();
  const { current, updateCase } = useStore();
  const text = current?.text ?? '';

  const [agencyId, setAgencyId] = useState<string | null>(current?.job?.agencyId ?? null);
  const [costId, setCostId] = useState<string | null>(current?.job?.costId ?? null);
  const [search, setSearch] = useState('');

  const suggested = engine.suggestAgencies(text);
  const query = search.trim().toLowerCase();
  const matches =
    query.length < 2
      ? []
      : engine.data.agencies.filter((a) => a.name.toLowerCase().includes(query)).slice(0, 8);
  const picked = engine.data.agencies.find((a) => a.id === agencyId);

  function checkAgain() {
    updateCase(text, { agencyId, costId });
    router.back();
  }

  return (
    <Screen>
      <Label variant="label">{t('jobAgencyLabel')}</Label>
      <Card>
        <Label variant="small">{picked ? picked.name : t('jobNoAgency')}</Label>
        {suggested.length > 0 && <Label variant="small">{t('jobSuggested')}</Label>}
        <View style={styles.wrap}>
          {suggested.map((a) => (
            <Chip key={a.id} title={a.name} selected={a.id === agencyId} onPress={() => setAgencyId(a.id === agencyId ? null : a.id)} />
          ))}
        </View>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder={t('jobSearch')}
          placeholderTextColor={theme.textSecondary}
          accessibilityLabel={t('jobSearch')}
          style={[styles.input, { color: theme.text, borderColor: theme.border }]}
        />
        <View style={styles.wrap}>
          {matches.map((a) => (
            <Chip key={a.id} title={a.name} selected={a.id === agencyId} onPress={() => setAgencyId(a.id === agencyId ? null : a.id)} />
          ))}
        </View>
      </Card>

      <Label variant="label">{t('jobCostLabel')}</Label>
      <View style={styles.wrap}>
        {engine.data.feeRules.map((rule) => (
          <Chip key={rule.id} title={rule.cost} selected={rule.id === costId} onPress={() => setCostId(rule.id === costId ? null : rule.id)} />
        ))}
      </View>

      <Button title={t('jobCheckButton')} onPress={checkAgain} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.two },
  input: { borderWidth: 1, borderRadius: Radius, padding: Spacing.two + 4, fontSize: FontSize.body },
});
