// Result screen: level banner, the message with X-Ray highlights, and each finding with its source.

import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Linking, Pressable, StyleSheet, TextInput } from 'react-native';

import { Appear } from '@/components/motion';
import { OnlineCheck } from '@/components/online-check';
import { TourTip } from '@/components/tour';
import { Button, Card, HighlightedText, Label, LevelBanner, LevelTag, Screen, Warning } from '@/components/ui';
import { findingDetail, findingTitle, t } from '@/constants/strings';
import { FontSize, Radius, Spacing } from '@/constants/theme';
import { useLook } from '@/hooks/use-look';
import { useOnlineCheck } from '@/hooks/use-online-check';
import { useTheme } from '@/hooks/use-theme';
import { dialNumber, formatPhone } from '@/lib/phone';
import { sources } from '@/lib/data';
import { isFromQr, takeFresh } from '@/lib/once';
import { speak, speechFor, stopSpeaking } from '@/lib/speak';
import { useStore } from '@/lib/store';
import { prettyDay } from '@/lib/time';

export default function ResultScreen() {
  const theme = useTheme();
  const { current, saveCurrent, addToCase, serverUrl, online: onlineMode } = useStore();
  const { granny, scale } = useLook();
  const [newText, setNewText] = useState('');
  const [reading, setReading] = useState(false);
  // Motion: only a brand-new check gets the stamp; a case reopened from History doesn't.
  const [stampedId] = useState(() => (takeFresh(current?.id) ? current?.id : undefined));
  const play = current !== null && stampedId === current.id;
  const online = useOnlineCheck(current?.text ?? '');

  // Stop reading aloud when leaving the screen.
  useEffect(() => stopSpeaking, []);

  if (!current) {
    return (
      <Screen>
        <Label>{t('scanEmpty')}</Label>
        <Button title={t('scanTitle')} onPress={() => router.dismissTo('/')} />
      </Screen>
    );
  }

  const { result, text } = current;

  // Surprise card (wrong input): never show a level for random typing or an empty share.
  if (result.findings.some((f) => f.kind === 'empty_message')) {
    return (
      <Screen>
        <Warning title={t('notMessageTitle')}>{t('notMessage')}</Warning>
        <Card>
          <Label variant="small">{text.slice(0, 300)}</Label>
        </Card>
        <Button title={t('scanTitle')} onPress={() => router.dismissTo('/')} />
      </Screen>
    );
  }
  const highlights = result.findings.flatMap((f) => f.highlights);
  // The banner shows the stronger of the two answers: the checks on the phone, or the server's score.
  const onlineLevel = typeof online === 'object' ? (online.risk_level === 'high' ? 'STOP' : online.risk_level === 'medium' ? 'CAREFUL' : 'NONE') : 'NONE';
  const found = result.level === 'STOP' || onlineLevel === 'STOP' ? 'STOP' : result.level === 'CAREFUL' || onlineLevel === 'CAREFUL' ? 'CAREFUL' : 'NONE';
  // A link from a QR code: our lists only know links that were already reported, so "nothing found"
  // is not good news. The result is at least "Be careful".
  const qrCaution = isFromQr(current.id) && found === 'NONE';
  const level = qrCaution ? 'CAREFUL' : found;

  return (
    // A new case, follow-up or Job check answer starts a fresh page at the top, so the level banner is always seen.
    <Screen key={`${current.id}-${text}-${current.job?.agencyId ?? ''}-${current.job?.costId ?? ''}`}>
      {/* The banner says the level and what to do. (Granny mode shows that sentence in big text just below.) */}
      <LevelBanner level={level} detail={granny ? undefined : t(`granny${level}`)} stamp={play} />
      <TourTip step={3}>{t('tourLevel')}</TourTip>

      {/* The next step comes first. (Granny mode shows the Call buttons themselves, just below.) */}
      <TourTip step={4}>{t('tourActions')}</TourTip>
      {!granny && <Button title={t('resultActionsButton')} onPress={() => router.push('/actions')} />}

      <TourTip step={5}>{t('tourRead')}</TourTip>

      {/* Read aloud: level, plain sentence, each finding, official numbers (EN/FR voices; Kreol uses French). */}
      <Button
        kind="secondary"
        title={reading ? t('stopReading') : t('readAloud')}
        onPress={() => {
          if (reading) {
            stopSpeaking();
            setReading(false);
          } else {
            setReading(true);
            speak(speechFor(result, level), () => setReading(false), onlineMode ? serverUrl : '');
          }
        }}
      />

      {/* Granny mode: one plain sentence, then the official number to call, first. Details stay below. */}
      {granny && (
        <>
          <Label variant="label">{t(`granny${level}`)}</Label>
          {result.contacts.map((c) => (
            <Button
              key={c.name + c.phone}
              title={`${c.name}: ${formatPhone(c.phone)}`}
              onPress={() => Linking.openURL(`tel:${dialNumber(c.phone)}`).catch(() => {})}
            />
          ))}
          {result.contacts.length === 0 && (
            <Button title={t('resultActionsButton')} onPress={() => router.push('/actions')} />
          )}
        </>
      )}

      {/* A link from a QR code that is on no list: say plainly that this is not a green light. */}
      {qrCaution && (
        <Card>
          <LevelTag level="CAREFUL" />
          <Label variant="label">{t('qrCautionTitle')}</Label>
          <Label>{t('qrCautionText')}</Label>
        </Card>
      )}

      {/* Tour, last step: the highlights and the findings. */}
      <TourTip step={6}>{t('tourFound')}</TourTip>
      <Card>
        <Label variant="label">{t('resultMessage')}</Label>
        <HighlightedText text={text} highlights={highlights} />
      </Card>

      <Label variant="label">{t('resultFindings')}</Label>
      {result.findings.length === 0 && <Label>{t('resultNoFindings')}</Label>}
      {result.findings.map((finding, i) => (
        <Appear key={`${finding.kind}-${i}`} play={play} index={i + 1}>
        <Card>
          {/* A NONE finding is just information (e.g. "listed"), so it gets a neutral tag. */}
          <LevelTag level={finding.level} label={finding.level === 'NONE' ? t('findingInfo') : undefined} />
          <Label variant="label">{findingTitle(finding)}</Label>
          <Label>{findingDetail(finding)}</Label>
          {finding.source && (
            <Label variant="small">
              {t('sourceLabel')}: {finding.source.name} ({prettyDay(finding.source.date)})
            </Label>
          )}
        </Card>
        </Appear>
      ))}

      {/* Offline mode and the message has a link: say that the link was NOT checked online. */}
      {!onlineMode && /(https?:\/\/|www\.)\S+/i.test(text) && (
        <Card>
          <LevelTag level="CAREFUL" label={t('onlineMode')} />
          <Label>{t('offlineLinkNote')}</Label>
          <Button kind="secondary" title={t('settingsTitle')} onPress={() => router.push('/settings')} />
        </Card>
      )}

      {/* What our server adds: score, live link and number checks, reports from other users. */}
      <OnlineCheck state={online} text={text} />

      {/* How old is the data: every check uses these official records, with their dates. */}
      <Pressable accessibilityRole="link" onPress={() => router.push('/sources')}>
        <Card>
          <Label variant="label">{t('checkedAgainst')}</Label>
          {sources.map((s) => (
            <Label key={s.title} variant="small">
              {t(s.title)}: {prettyDay(s.snapshot)}
            </Label>
          ))}
        </Card>
      </Pressable>

      <Button kind="secondary" title={t('resultJobButton')} onPress={() => router.push('/job')} />
      <Button
        kind="secondary"
        title={current.savedAt ? t('resultSaved') : t('resultSave')}
        onPress={saveCurrent}
      />

      {/* Follow-up: they send a new demand later (e.g. "now Rs 15,000 for the air ticket"). */}
      <Card>
        <Label variant="label">{t('followUpLabel')}</Label>
        <TextInput
          value={newText}
          onChangeText={setNewText}
          placeholder={t('followUpPlaceholder')}
          placeholderTextColor={theme.textSecondary}
          multiline
          accessibilityLabel={t('followUpPlaceholder')}
          style={[styles.input, { color: theme.text, borderColor: theme.border, fontSize: FontSize.body * scale }]}
        />
        <Button
          kind="secondary"
          title={t('followUpButton')}
          onPress={() => {
            addToCase(newText);
            setNewText('');
          }}
        />
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: { minHeight: 80, borderWidth: 1, borderRadius: Radius, padding: Spacing.two + 4, fontSize: FontSize.body, textAlignVertical: 'top' },
});
