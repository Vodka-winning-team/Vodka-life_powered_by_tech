// Check tab: paste (or share) a message, then check it. Settings are behind the gear, top right.
// Share-in from WhatsApp/SMS and the home screen widget also land on the Result (APK only).

import Ionicons from '@expo/vector-icons/Ionicons';
import * as Clipboard from 'expo-clipboard';
import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useRef, useState, type ComponentRef } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { ScanOverlay } from '@/components/motion';
import { TOUR_MESSAGE, TourTip } from '@/components/tour';
import { Button, Screen, Section, Warning } from '@/components/ui';
import { findingTitle, t, type Language } from '@/constants/strings';
import { FontSize, HeadingFont, PageMargin, Radius, Spacing } from '@/constants/theme';
import { useLook } from '@/hooks/use-look';
import { useTheme } from '@/hooks/use-theme';
import { useReduceMotion } from '@/hooks/use-reduce-motion';
import { looksLikeMessage } from '@/lib/input-check';
import { takeNotice } from '@/lib/notice';
import { once } from '@/lib/once';
import { useStore } from '@/lib/store';

export default function ScanScreen() {
  const theme = useTheme();
  const { runCheck, language, setLanguage, tourStep, setTourStep } = useStore();
  const { scale, granny } = useLook();
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const [inputY, setInputY] = useState(0);
  // Motion: the scanner shown between "Check message" and the Result.
  const [scanning, setScanning] = useState(false);
  const finishScan = useRef<() => void>(() => {});
  const reduceMotion = useReduceMotion();

  // A note left by another screen (e.g. the widget found nothing copied).
  useFocusEffect(
    useCallback(() => {
      const notice = takeNotice();
      if (notice) setError(t(notice));
    }, []),
  );

  // "Show the tour again" (Settings): start from an empty box.
  useEffect(() => {
    if (tourStep === 0) {
      setText('');
      setError('');
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
  }, [tourStep]);

  /** Fills the box with what was copied in WhatsApp or SMS. The user still taps Check. */
  async function paste() {
    const copied = (await Clipboard.getStringAsync().catch(() => '')).trim();
    if (copied === '') {
      setError(t('clipboardEmpty'));
      return;
    }
    setText(copied);
    setError('');
  }

  function check() {
    if (text.trim() === '') {
      setError(t('scanEmpty'));
      return;
    }
    if (!looksLikeMessage(text)) {
      setError(t('notMessage'));
      return;
    }
    const check = runCheck(text.trim());
    // Surprise card (wrong input): too little text to check -> stay here and say so, never show a result.
    const tooShort = check.result.findings.find((f) => f.kind === 'empty_message');
    if (tooShort) {
      setError(findingTitle(tooShort));
      return;
    }
    setError('');
    // The tour was waiting for this tap: carry on with the tips on the Result screen.
    const inTour = tourStep === 2;
    if (inTour) setTourStep(3);
    // Opens the Result exactly once, however many taps land (surprise card: panic-tapping).
    const openResult = once(() => {
      setScanning(false);
      router.push('/result');
    });
    finishScan.current = openResult;
    // The scanner plays only from this button. Not in Granny mode, with "Remove animations", or in the tour.
    if (granny || reduceMotion || inTour) openResult();
    else setScanning(true);
  }

  return (
    <Screen scrollRef={scrollRef}>
      <ScanOverlay visible={scanning} text={text.trim()} onDone={() => finishScan.current()} />
      {/* The yellow band: tagline, language (EN / FR / KM), the name in poster type, and what the app does. */}
      <View style={[styles.band, { backgroundColor: theme.accent }]}>
        <View style={styles.bandTop}>
          <Text style={[styles.bandTag, { color: theme.onAccent }]}>{t('tagline').split(': ').pop()?.toUpperCase()}</Text>
          <View style={styles.languages} accessibilityLabel={t('languageLabel')}>
            {LANGUAGES.map((l) => {
              const selected = l.id === language;
              return (
                <Pressable
                  key={l.id}
                  accessibilityRole="button"
                  accessibilityLabel={l.name}
                  accessibilityState={{ selected }}
                  onPress={() => setLanguage(l.id)}
                  style={[styles.language, selected && { backgroundColor: theme.onAccent }]}>
                  <Text style={{ fontWeight: '700', fontSize: FontSize.small, color: selected ? theme.accent : theme.onAccent }}>
                    {l.id === 'mfe' ? 'KM' : l.id.toUpperCase()}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
        <Text style={[styles.bandName, { color: theme.onAccent }]}>{t('appName')}</Text>
        <Text style={{ color: theme.onAccent, fontSize: FontSize.body * scale, lineHeight: FontSize.body * scale * 1.4, fontWeight: '500' }}>{t('scanHint')}</Text>
      </View>

      {/* First-time tour, step 1: welcome. "Start" puts the practice message in the box. */}
      <TourTip step={0} nextTitle={t('tourStart')} onNext={() => setText(TOUR_MESSAGE)}>
        {t('tourWelcome')}
      </TourTip>

      {/* The main task first: paste (or share) a message and check it. */}
      <Section title={t('scanTitle')}>{null}</Section>

      <TourTip step={1}>{t('tourPaste')}</TourTip>

      <View style={styles.field} onLayout={(e) => setInputY(e.nativeEvent.layout.y)}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder={t('scanPlaceholder')}
          placeholderTextColor={theme.textSecondary}
          multiline
          textAlignVertical="top"
          accessibilityLabel={t('scanPlaceholder')}
          // Keep the box and the "Check message" button in view above the keyboard while typing.
          onFocus={() => setTimeout(() => scrollRef.current?.scrollTo({ y: Math.max(0, inputY - Spacing.three), animated: true }), 300)}
          style={[
            styles.input,
            {
              color: theme.text,
              backgroundColor: theme.backgroundElement,
              borderColor: theme.border,
              fontSize: FontSize.body * scale,
              lineHeight: FontSize.body * scale * 1.45,
            },
          ]}
        />
        {/* One tap instead of long-press → Paste in the box. */}
        <Pressable
          accessibilityRole="button"
          onPress={paste}
          style={({ pressed }) => [styles.paste, { borderColor: theme.border, opacity: pressed ? 0.7 : 1 }]}>
          <Ionicons name="clipboard-outline" size={18 * scale} color={theme.primary} />
          <Text style={{ color: theme.primary, fontSize: FontSize.small * scale, fontWeight: '600' }}>{t('pasteButton')}</Text>
        </Pressable>
        {/* The error sits under its box and is read out by screen readers. */}
        {error !== '' && <Warning title={t('notMessageTitle')}>{error}</Warning>}
        {/* Tour: the user taps the real button, so this tip has no "Next". */}
        <TourTip step={2} hideNext>
          {t('tourCheck')}
        </TourTip>
        <Button title={t('scanButton')} onPress={check} />
      </View>

      {/* Before paying: the other lookups are in the tabs below. */}
      <Section>
        <Button kind="secondary" title={t('payTitle')} onPress={() => router.push('/pay')} />
        <Pressable accessibilityRole="link" onPress={() => router.push('/sources')} style={styles.sourcesLink}>
          <Ionicons name="document-text-outline" size={16 * scale} color={theme.textSecondary} />
          <Text style={{ color: theme.textSecondary, fontSize: FontSize.small * scale, textDecorationLine: 'underline' }}>
            {t('openSources')}
          </Text>
        </Pressable>
      </Section>
    </Screen>
  );
}

// Each language is written in its own language, so people can find theirs.
const LANGUAGES: { id: Language; name: string }[] = [
  { id: 'en', name: 'English' },
  { id: 'fr', name: 'Français' },
  { id: 'mfe', name: 'Kreol' },
];

const styles = StyleSheet.create({
  languages: { flexDirection: 'row', gap: 2 },
  language: { minWidth: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: Radius },
  // The band reaches the screen edges and the top of the page (under the yellow header).
  band: { marginHorizontal: -PageMargin, marginTop: -PageMargin, paddingHorizontal: PageMargin, paddingBottom: 22, gap: 8 },
  bandTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bandTag: { flex: 1, fontFamily: HeadingFont, fontWeight: '700', fontSize: 13, letterSpacing: 2 },
  bandName: { fontFamily: HeadingFont, fontWeight: '900', fontSize: 84, lineHeight: 84, letterSpacing: -1 },
  input: {
    minHeight: 160,
    borderWidth: 2,
    borderRadius: Radius,
    padding: 14,
    fontSize: FontSize.body,
  },
  field: { gap: Spacing.two },
  paste: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: Spacing.two,
    minHeight: 44,
    paddingHorizontal: Spacing.three,
    borderWidth: 2,
    borderRadius: Radius,
  },
  sourcesLink: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.one, minHeight: 44 },
});
