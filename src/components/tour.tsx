// First-time tour: small pop-up tips that walk a new user through one check with a practice message.
// A tip shows only when the tour is on its step. Each screen places <TourTip step={n}> just above
// the thing it explains; the little arrow under the tip points at it.

import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { t } from '@/constants/strings';
import { CardShadow, FontSize, RadiusCard, Spacing } from '@/constants/theme';
import { useLook } from '@/hooks/use-look';
import { useTheme } from '@/hooks/use-theme';
import { useStore } from '@/lib/store';

/** The practice message used by the tour. It is made up, and it is never sent or saved. */
export const TOUR_MESSAGE =
  'Congratulations! You are selected for a hotel job in Dubai. Salary Rs 60,000. To keep your place, pay the processing fee of Rs 15,000 today by Juice. Urgent, only 2 places left.';

/** Number of steps (0 to 6), shown as "2/7" on each tip. */
export const TOUR_STEPS = 7;

export function TourTip({
  step,
  children,
  nextTitle,
  onNext,
  hideNext = false,
}: {
  step: number;
  children: ReactNode;
  /** Text of the main button ("Next" by default). */
  nextTitle?: string;
  /** Runs before moving to the next step (e.g. fill in the practice message). */
  onNext?: () => void;
  /** For a step where the user must tap something on the screen itself. */
  hideNext?: boolean;
}) {
  const theme = useTheme();
  const { scale } = useLook();
  const { tourStep, setTourStep } = useStore();
  if (tourStep !== step) return null;

  const last = step === TOUR_STEPS - 1;
  const text = { color: theme.onPrimary, fontSize: FontSize.body * scale, lineHeight: FontSize.body * scale * 1.4 };

  function next() {
    onNext?.();
    setTourStep(last ? null : step + 1);
  }

  return (
    <View accessibilityLiveRegion="polite">
      <View style={[styles.tip, { backgroundColor: theme.primary }]}>
        <Text style={[styles.count, { color: theme.onPrimary }]}>
          {step + 1}/{TOUR_STEPS}
        </Text>
        <Text style={text}>{children}</Text>
        <View style={styles.buttons}>
          {!last && (
            <Pressable accessibilityRole="button" onPress={() => setTourStep(null)} style={styles.skip}>
              <Text style={[text, styles.bold]}>{t('tourSkip')}</Text>
            </Pressable>
          )}
          {!hideNext && (
            <Pressable accessibilityRole="button" onPress={next} style={[styles.next, { backgroundColor: theme.onPrimary }]}>
              <Text style={[styles.bold, { color: theme.primary, fontSize: FontSize.body * scale }]}>
                {nextTitle ?? (last ? t('tourDone') : t('tourNext'))}
              </Text>
            </Pressable>
          )}
        </View>
      </View>
      {/* The arrow: a small square turned 45 degrees, half hidden behind the tip. */}
      <View style={[styles.arrow, { backgroundColor: theme.primary }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  tip: { borderRadius: RadiusCard, padding: 20, gap: Spacing.two, ...CardShadow },
  count: { fontSize: FontSize.overline, fontWeight: '700', letterSpacing: 1, opacity: 0.8 },
  buttons: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: Spacing.three, marginTop: Spacing.one },
  skip: { minHeight: 48, justifyContent: 'center', paddingHorizontal: Spacing.two },
  next: { minHeight: 48, justifyContent: 'center', paddingHorizontal: Spacing.four, borderRadius: 999 },
  bold: { fontWeight: '700' },
  arrow: { width: 18, height: 18, transform: [{ rotate: '45deg' }], alignSelf: 'center', marginTop: -10 },
});
