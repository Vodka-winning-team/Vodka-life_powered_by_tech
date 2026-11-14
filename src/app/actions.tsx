// What to do now: call the OFFICIAL number, share a summary with someone you trust, report it.

import { Linking, Share } from 'react-native';

import { Button, Card, Label, Screen, Section } from '@/components/ui';
import type { Contact } from '@/engine';
import { findingTitle, t } from '@/constants/strings';
import { dialNumber, formatPhone } from '@/lib/phone';
import { useStore } from '@/lib/store';
import { prettyDay } from '@/lib/time';

// TODO(D): confirm both links before the demo.
const MAUCORS_URL = 'https://maucors.govmu.org';
const MINISTRY_EMAIL = 'mailto:pra@govmu.org';

/** One group per organisation and source, so an agency with 2 numbers shows one card with 2 buttons. */
function byOrganisation(contacts: Contact[]) {
  const groups: { key: string; name: string; source: Contact['source']; phones: string[] }[] = [];
  for (const c of contacts) {
    const key = c.name + '|' + c.source.url;
    const group = groups.find((g) => g.key === key);
    if (group) {
      if (!group.phones.includes(c.phone)) group.phones.push(c.phone);
    } else {
      groups.push({ key, name: c.name, source: c.source, phones: [c.phone] });
    }
  }
  return groups;
}

export default function ActionsScreen() {
  const { current } = useStore();
  const groups = byOrganisation(current?.result.contacts ?? []);

  function call(phone: string) {
    // Always an official number from our data, never one taken from the message.
    Linking.openURL(`tel:${dialNumber(phone)}`).catch(() => {});
  }

  function share() {
    if (!current) return;
    const lines = [
      `${t('appName')}: ${t(`level${current.result.level}`)}`,
      ...current.result.findings.map((f) => `- ${findingTitle(f)}`),
      '',
      current.text,
    ];
    Share.share({ message: lines.join('\n') }).catch(() => {});
  }

  return (
    <Screen>
      <Section number={1} title={t('actionsCall')}>
        <Label variant="small">{t('actionsCallHint')}</Label>
        {groups.length === 0 && <Label>{t('actionsNoContacts')}</Label>}
        {groups.map((g) => (
          <Card key={g.key}>
            <Label variant="label">{g.name}</Label>
            {g.phones.map((phone) => (
              <Button key={phone} title={formatPhone(phone)} onPress={() => call(phone)} />
            ))}
            <Label variant="small">
              {t('sourceLabel')}: {g.source.name} ({prettyDay(g.source.date)})
            </Label>
          </Card>
        ))}
      </Section>

      <Section number={2} title={t('actionsShare')}>
        <Button kind="secondary" title={t('actionsShareButton')} onPress={share} />
      </Section>

      <Section number={3} title={t('actionsReport')}>
        <Button kind="secondary" title={t('reportMaucors')} onPress={() => Linking.openURL(MAUCORS_URL)} />
        <Button kind="secondary" title={t('reportMinistry')} onPress={() => Linking.openURL(MINISTRY_EMAIL)} />
      </Section>
    </Screen>
  );
}
