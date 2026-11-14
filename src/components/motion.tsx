// Motion (Paveesh's brief, docs/motion-brief.md). Built-in Animated only, native driver,
// transform and opacity only. Reduce motion or Granny mode: nothing moves, just a 150 ms fade.
//
//   Appear      : a block fades up 12 px (the findings on a new Result, one after another)
//   ScanOverlay : after "Check message", a yellow line sweeps once over the message while the
//                 4 sources tick off; any tap skips it

import { useEffect, useState, type ReactNode } from 'react';
import { Animated, Easing, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { t } from '@/constants/strings';
import { CardShadow, FontSize, RadiusCard, Spacing } from '@/constants/theme';
import { useLook } from '@/hooks/use-look';
import { useReduceMotion } from '@/hooks/use-reduce-motion';
import { useTheme } from '@/hooks/use-theme';
import { sources } from '@/lib/data';

/** Decelerating curve, no bounce. */
export const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);

/**
 * Fades its content up when `play` is true on first show. `index` staggers the blocks by 60 ms,
 * capped at 240 ms so a long list never feels slow. With `play` false it is simply shown.
 */
export function Appear({ play, index = 0, children }: { play: boolean; index?: number; children: ReactNode }) {
  const { granny } = useLook();
  const reduce = useReduceMotion();
  const still = granny || reduce; // no movement: a short fade only
  const progress = useState(() => new Animated.Value(play ? 0 : 1))[0];

  useEffect(() => {
    if (!play) return;
    Animated.timing(progress, {
      toValue: 1,
      duration: still ? 150 : 240,
      delay: still ? 0 : Math.min(index * 60, 240),
      easing: EASE_OUT,
      useNativeDriver: true,
    }).start();
    // Runs once, when the block first appears.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const translateY = still ? 0 : progress.interpolate({ inputRange: [0, 1], outputRange: [12, 0] });
  return <Animated.View style={{ opacity: progress, transform: [{ translateY }] }}>{children}</Animated.View>;
}

const SWEEP_MS = 700; // the whole scan stays under 800 ms
const LINE_COLOR = '#D7B982';

/**
 * The scanner. Shown on top of the Check tab while `visible`; calls `onDone` when the sweep ends
 * or as soon as the user taps anywhere (or presses Back). It never blocks input.
 */
export function ScanOverlay({ visible, text, onDone }: { visible: boolean; text: string; onDone: () => void }) {
  const theme = useTheme();
  const sweep = useState(() => new Animated.Value(0))[0];
  const [boxHeight, setBoxHeight] = useState(160);
  // The 4 official sources that tick off during the sweep.
  const names = sources.slice(0, 4).map((s) => t(s.title));

  useEffect(() => {
    if (!visible) return;
    sweep.setValue(0);
    const animation = Animated.timing(sweep, { toValue: 1, duration: SWEEP_MS, easing: Easing.inOut(Easing.cubic), useNativeDriver: true });
    animation.start(({ finished }) => {
      if (finished) onDone();
    });
    return () => animation.stop();
    // Starts when the scanner is shown; onDone is guarded by the caller, so it runs once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  if (!visible) return null;

  const lineY = sweep.interpolate({ inputRange: [0, 1], outputRange: [0, boxHeight - 4] });

  return (
    <Modal transparent visible animationType="fade" onRequestClose={onDone} statusBarTranslucent>
      {/* Tapping anywhere skips straight to the Result. */}
      <Pressable accessibilityRole="button" onPress={onDone} style={styles.backdrop}>
        <View style={[styles.sheet, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
          <View style={[styles.message, { borderColor: theme.border }]} onLayout={(e) => setBoxHeight(e.nativeEvent.layout.height)}>
            <Text numberOfLines={6} style={[styles.text, { color: theme.text }]}>
              {text}
            </Text>
            <Animated.View style={[styles.line, { transform: [{ translateY: lineY }] }]} />
          </View>
          {names.map((name, i) => {
            // Each source lights up when the line has passed its quarter of the message.
            const opacity = sweep.interpolate({
              inputRange: [i * 0.25, Math.min(i * 0.25 + 0.15, 1)],
              outputRange: [0.25, 1],
              extrapolate: 'clamp',
            });
            return (
              <Animated.Text key={name} numberOfLines={2} style={[styles.source, { color: theme.text, opacity }]}>
                ✓ {name}
              </Animated.Text>
            );
          })}
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'center', padding: 20 },
  sheet: { borderRadius: RadiusCard, borderWidth: 2, padding: 20, gap: Spacing.two, ...CardShadow },
  message: { borderWidth: 2, borderRadius: RadiusCard, padding: Spacing.three, overflow: 'hidden', marginBottom: Spacing.one },
  text: { fontSize: FontSize.body, lineHeight: FontSize.body * 1.45 },
  line: { position: 'absolute', left: 0, right: 0, top: 0, height: 4, backgroundColor: LINE_COLOR },
  source: { fontSize: FontSize.small, lineHeight: FontSize.small * 1.5, fontWeight: '600' },
});
