// "Online check" card on the Result screen: what our server found (score, warning signs,
// live link and number checks, reports from other users), plus a button to report the message.

import { useState } from 'react';

import { Button, Card, Label, Status } from '@/components/ui';
import { onlineCategory, onlineFindingText, onlineTacticLabel } from '@/constants/online-texts';
import { t } from '@/constants/strings';
import { reportOnline, type OnlineResult } from '@/lib/online';
import { useStore } from '@/lib/store';

/** 'loading' while waiting, 'offline' when the server can't be reached, else the server's answer. */
export type OnlineState = 'loading' | 'offline' | 'off' | OnlineResult;

export function OnlineCheck({ state, text }: { state: OnlineState; text: string }) {
  const { serverUrl, language } = useStore();
  // The report confirmation is kept with the text it was for, so it disappears when the message changes
  // (e.g. after a follow-up is added to the case).
  const [reported, setReported] = useState<{ text: string; message: string } | null>(null);
  const [sending, setSending] = useState(false);
  const reportMessage = reported && reported.text === text ? reported.message : '';

  async function report() {
    setSending(true);
    const answer = await reportOnline(serverUrl, text);
    setReported({ text, message: answer ? answer.message : t('onlineOffline') });
    setSending(false);
  }

  // Offline mode (the switch in Settings): no online card at all.
  if (state === 'off') return null;

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
  // The server answers in English: show its fixed sentences in the app's language.
  const category = onlineCategory(state.category_label, state.summary, language);
  // Nothing found online (e.g. an ordinary link): one short line, no score and no advice about paying.
  const nothing = state.risk_score === 0 && state.tactics.length === 0 && intelFindings.length === 0 && reports === 0;
  // Some live services did not answer: "nothing found" would then promise more than was checked.
  const skipped = (state.intel?.skipped ?? []).length > 0;

  return (
    <Card>
      <Label variant="label">{t('onlineTitle')}</Label>
      {nothing ? (
        <Label>{skipped ? t('onlineSkipped') : t('onlineNothing')}</Label>
      ) : (
        <>
          <Status>
            {t('onlineScore')}: {state.risk_score}/100 · {category.label}
          </Status>
          <Label>{category.summary}</Label>
          {/* The banner at the top also counts the checks on the phone, so it can be stronger than this score. */}
          <Label variant="small">{t('onlineScoreNote')}</Label>
        </>
      )}

      {state.tactics.map((tactic) => (
        <Label key={tactic.tactic} variant="small">
          • {onlineTacticLabel(tactic.tactic, tactic.label, language)} (+{tactic.contribution})
          {language === 'en' && tactic.details.length > 0 ? `: ${tactic.details.join(' ')}` : ''}
        </Label>
      ))}

      {intelFindings.length > 0 && <Label variant="label">{t('onlineIntelTitle')}</Label>}
      {intelFindings.map((finding, i) => (
        <Label key={`${finding.target}-${i}`} variant="small">
          • {onlineFindingText(finding.title, finding.detail, language)}
        </Label>
      ))}

      {reports > 0 && (
        <Label variant="small">
          {t('onlineReports')}: {reports}
        </Label>
      )}

      {/* Reporting is offered only when something was found: an ordinary message should not invite a report. */}
      {!nothing && (
        <>
          {reportMessage !== '' ? (
            <Status>{reportMessage}</Status>
          ) : (
            <Button kind="secondary" title={sending ? t('onlineLoading') : t('onlineReportButton')} onPress={report} />
          )}
          <Label variant="small">{t('onlineReportHint')}</Label>
        </>
      )}
    </Card>
  );
}
