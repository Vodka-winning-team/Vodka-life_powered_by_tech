// What to do now: call the OFFICIAL number, share a summary with someone you trust, report it.

import { Linking, Share } from 'react-native';

import { Button, Card, Label, Screen } from '@/components/ui';
import { t } from '@/constants/strings';
import { dialNumber, formatPhone } from '@/lib/phone';
import { useStore } from '@/lib/store';

// TODO(D): confirm both links before the demo.
const MAUCORS_URL = 'https://maucors.govmu.org';
const MINISTRY_EMAIL = 'mailto:pra@govmu.org';

export default function ActionsScreen() {
  const { current } = useStore();
  const contacts = current?.result.contacts ?? [];

  function call(phone: string) {
    // Always an official number from our data, never one taken from the message.
    Linking.openURL(`tel:${dialNumber(phone)}`).catch(() => {});
  }

  function share() {
    if (!current) return;
    const lines = [
      `${t('appName')}: ${t(`level${current.result.level}`)}`,
      ...current.result.findings.map((f) => `- ${f.title}`),
      '',
      current.text,
    ];
    Share.share({ message: lines.join('\n') }).catch(() => {});
  }

  return (
    <Screen>
      <Label variant="label">{t('actionsCall')}</Label>
      <Label variant="small">{t('actionsCallHint')}</Label>
      {contacts.length === 0 && <Label>{t('actionsNoContacts')}</Label>}
      {contacts.map((c) => (
        <Card key={c.name + c.phone}>
          <Label variant="label">{c.name}</Label>
          <Button title={formatPhone(c.phone)} onPress={() => call(c.phone)} />
          <Label variant="small">
            {t('sourceLabel')}: {c.source.url} ({c.source.date})
          </Label>
        </Card>
      ))}

      <Label variant="label">{t('actionsShare')}</Label>
      <Button kind="secondary" title={t('actionsShareButton')} onPress={share} />

      <Label variant="label">{t('actionsReport')}</Label>
      <Button kind="secondary" title={t('reportMaucors')} onPress={() => Linking.openURL(MAUCORS_URL)} />
      <Button kind="secondary" title={t('reportMinistry')} onPress={() => Linking.openURL(MINISTRY_EMAIL)} />
    </Screen>
  );
}
