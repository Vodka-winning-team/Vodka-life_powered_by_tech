// Official numbers: every official number in our data, with search, no message needed.
// (e.g. Kevin heard an agency's name from a friend, or his mum wants her bank's real number.)
// Same wording rule: "listed" never means "safe" or "genuine".

import { useState } from 'react';
import { Linking, StyleSheet, TextInput } from 'react-native';

import { Button, Card, Label, Screen } from '@/components/ui';
import { t } from '@/constants/strings';
import { FontSize, Radius, Spacing } from '@/constants/theme';
import type { OfficialEntry } from '@/engine';
import { useLook } from '@/hooks/use-look';
import { useTheme } from '@/hooks/use-theme';
import { engine } from '@/lib/data';
import { dialNumber, formatPhone } from '@/lib/phone';
import { prettyDay } from '@/lib/time';

function EntryCard({ entry, byNumber }: { entry: OfficialEntry; byNumber: boolean }) {
  return (
    <Card>
      {/* Found by a phone number: say whose number it is, and that a caller can fake it. */}
      {byNumber && <Label>{t('numberListed').replace('{name}', entry.name).replace('{source}', entry.source.name)}</Label>}
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
      {byNumber && <Label variant="small">{t('numberSpoofWarning')}</Label>}
    </Card>
  );
}

export default function NumbersScreen() {
  const theme = useTheme();
  const { scale } = useLook();
  const [query, setQuery] = useState('');
  const { agencies, banks, matchedBy } = engine.officialNumbers(query);
  // The engine tells us when the search was a phone number.
  const byNumber = matchedBy === 'number';
  // For the "not in our lists" card: how many records we searched.
  const all = engine.officialNumbers('');

  return (
    <Screen>
      <Label>{t('numbersHint')}</Label>
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder={t('numbersSearch')}
        placeholderTextColor={theme.textSecondary}
        accessibilityLabel={t('numbersSearch')}
        style={[styles.input, { color: theme.text, backgroundColor: theme.backgroundElement, borderColor: theme.border, fontSize: FontSize.body * scale }]}
      />

      {/* Empty sections are hidden (e.g. a search that only matches agencies). */}
      {banks.length > 0 && (
        <Label variant="label">
          {t('srcBanksTitle')} ({banks.length})
        </Label>
      )}
      {banks.map((entry) => (
        <EntryCard key={entry.id} entry={entry} byNumber={byNumber} />
      ))}

      {agencies.length > 0 && (
        <Label variant="label">
          {t('srcAgenciesTitle')} ({agencies.length})
        </Label>
      )}
      {agencies.map((entry) => (
        <EntryCard key={entry.id} entry={entry} byNumber={byNumber} />
      ))}

      {byNumber && agencies.length === 0 && banks.length === 0 && (
        <Card>
          <Label>
            {t('numberNotListed').replace('{agencies}', String(all.agencies.length)).replace('{banks}', String(all.banks.length))}
          </Label>
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: { borderWidth: 1, borderRadius: Radius, padding: Spacing.three, fontSize: FontSize.body, minHeight: 52 },
});
