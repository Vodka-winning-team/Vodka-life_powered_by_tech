// Official numbers: every official number in our data, with search, no message needed.
// (e.g. Kevin heard an agency's name from a friend, or his mum wants her bank's real number.)
// Same wording rule: "listed" never means "safe" or "genuine".

import { useState } from 'react';
import { Linking, StyleSheet, TextInput } from 'react-native';

import { Button, Card, Label, Screen } from '@/components/ui';
import { t } from '@/constants/strings';
import { FontSize, Radius, Spacing } from '@/constants/theme';
import type { OfficialEntry } from '@/engine';
import { useTheme } from '@/hooks/use-theme';
import { engine } from '@/lib/data';
import { dialNumber, formatPhone } from '@/lib/phone';
import { prettyDay } from '@/lib/time';

function EntryCard({ entry }: { entry: OfficialEntry }) {
  return (
    <Card>
      <Label variant="label">{entry.name}</Label>
      <Label variant="small">{entry.detail}</Label>
      {entry.phones.map((phone) => (
        // Opens the dialler with the number; it never calls by itself.
        <Button
          key={phone}
          kind="secondary"
          title={formatPhone(phone)}
          onPress={() => Linking.openURL(`tel:${dialNumber(phone)}`).catch(() => {})}
        />
      ))}
      <Label variant="small">
        {t('sourceLabel')}: {entry.source.name} ({prettyDay(entry.source.date)})
      </Label>
    </Card>
  );
}

export default function NumbersScreen() {
  const theme = useTheme();
  const [query, setQuery] = useState('');
  const { agencies, banks } = engine.officialNumbers(query);

  return (
    <Screen>
      <Label>{t('numbersHint')}</Label>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder={t('numbersSearch')}
        placeholderTextColor={theme.textSecondary}
        accessibilityLabel={t('numbersSearch')}
        style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement, borderColor: theme.border }]}
      />

      {/* Empty sections are hidden (e.g. a search that only matches agencies). */}
      {banks.length > 0 && (
        <Label variant="label">
          {t('srcBanksTitle')} ({banks.length})
        </Label>
      )}
      {banks.map((entry) => (
        <EntryCard key={entry.id} entry={entry} />
      ))}

      {agencies.length > 0 && (
        <Label variant="label">
          {t('srcAgenciesTitle')} ({agencies.length})
        </Label>
      )}
      {agencies.map((entry) => (
        <EntryCard key={entry.id} entry={entry} />
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: { borderWidth: 1, borderRadius: Radius, padding: Spacing.three, fontSize: FontSize.body },
});
