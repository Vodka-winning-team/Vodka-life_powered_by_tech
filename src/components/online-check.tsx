// "Online check" card on the Result screen: what our server found (score, warning signs,
// live link and number checks, reports from other users), plus a button to report the message.

import { useState } from 'react';

import { Button, Card, Label, Status } from '@/components/ui';
import { t } from '@/constants/strings';
import { reportOnline, type OnlineResult } from '@/lib/online';
import { useStore } from '@/lib/store';

/** 'loading' while waiting, 'offline' when the server can't be reached, else the server's answer. */
export type OnlineState = 'loading' | 'offline' | OnlineResult;

export function OnlineCheck({ state, text }: { state: OnlineState; text: string }) {
  const { serverUrl } = useStore();
  const [reportMessage, setReportMessage] = useState('');
  const [sending, setSending] = useState(false);

  async function report() {
    setSending(true);
    const answer = await reportOnline(serverUrl, text);
    setReportMessage(answer ? answer.message : t('onlineOffline'));
    setSending(false);
  }

  if (state === 'loading') {
    return (
      <Card>
        <Label variant="label">{t('onlineTitle')}</Label>
        <Label variant="small">{t('onlineLoading')}</Label>
      </Card>
    );
  }

  if (state === 'offline') {
    return (
      <Card>
        <Label variant="label">{t('onlineTitle')}</Label>
        <Label variant="small">{t('onlineOffline')}</Label>
      </Card>
    );
  }

  const reports = state.verification?.community_reports ?? 0;
  const intelFindings = state.intel?.findings ?? [];
  // Nothing found online (e.g. an ordinary link): one short line, no score and no advice about paying.
  const nothing = state.risk_score === 0 && state.tactics.length === 0 && intelFindings.length === 0 && reports === 0;

  return (
    <Card>
      <Label variant="label">{t('onlineTitle')}</Label>
      {nothing ? (
        <Label>{t('onlineNothing')}</Label>
      ) : (
        <>
          <Status>
            {t('onlineScore')}: {state.risk_score}/100 · {state.category_label}
          </Status>
          <Label>{state.summary}</Label>
        </>
      )}

      {state.tactics.map((tactic) => (
        <Label key={tactic.tactic} variant="small">
          • {tactic.label} (+{tactic.contribution}){tactic.details.length > 0 ? `: ${tactic.details.join(' ')}` : ''}
        </Label>
      ))}

      {intelFindings.length > 0 && <Label variant="label">{t('onlineIntelTitle')}</Label>}
      {intelFindings.map((finding, i) => (
        <Label key={`${finding.target}-${i}`} variant="small">
          • {finding.title}: {finding.detail}
        </Label>
      ))}

      {reports > 0 && (
        <Label variant="small">
          {t('onlineReports')}: {reports}
        </Label>
      )}

      {reportMessage !== '' ? (
        <Status>{reportMessage}</Status>
      ) : (
        <Button kind="secondary" title={sending ? t('onlineLoading') : t('onlineReportButton')} onPress={report} />
      )}
      <Label variant="small">{t('onlineReportHint')}</Label>
    </Card>
  );
}
