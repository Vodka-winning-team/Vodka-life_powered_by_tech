// Small building blocks used by every screen. Colours and sizes come from constants/theme.ts.

import { useEffect, useRef, useState, type ComponentRef, type ReactNode, type RefObject } from 'react';
import { Animated, Easing, KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, View, type TextStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { t } from '@/constants/strings';
import { CardShadow, FontSize, HeadingFont, LevelColors, MaxContentWidth, PageMargin, RadiusCard, Spacing } from '@/constants/theme';
import type { Highlight, Level } from '@/engine';
import { useLook } from '@/hooks/use-look';
import { useReduceMotion } from '@/hooks/use-reduce-motion';
import { onGoToTop } from '@/lib/tab-top';
import { useTheme } from '@/hooks/use-theme';

/** Text style at the current size (Granny mode makes text 1.4x bigger). */
function sized(style: TextStyle, scale: number): TextStyle {
  return {
    fontSize: (style.fontSize ?? FontSize.body) * scale,
    lineHeight: style.lineHeight ? style.lineHeight * scale : undefined,
  };
}

/** Scrolling page with safe margins and a max width (looks right on phones, tablets and the web). */
export function Screen({ children, scrollRef }: { children: ReactNode; scrollRef?: RefObject<ComponentRef<typeof ScrollView> | null> }) {
  const theme = useTheme();
  const { granny } = useLook();
  const ownRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const pageRef = scrollRef ?? ownRef;
  // Tapping the tab you are already on brings the page back to the top.
  useEffect(() => onGoToTop(() => pageRef.current?.scrollTo({ y: 0, animated: true })), [pageRef]);
  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={{ flex: 1, backgroundColor: theme.background }}>
      {/* While typing, the keyboard pushes the page up instead of covering the buttons. */}
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <ScrollView ref={pageRef} contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={[styles.column, granny && { gap: Spacing.four }]}>{children}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type Variant = 'title' | 'body' | 'small' | 'label' | 'overline';

export function Label({
  children,
  variant = 'body',
  style,
  numberOfLines,
}: {
  children: ReactNode;
  variant?: Variant;
  style?: TextStyle;
  numberOfLines?: number;
}) {
  const theme = useTheme();
  const { granny, scale } = useLook();
  // Granny mode: strong contrast, so no grey text.
  const color = variant === 'small' && !granny ? theme.textSecondary : theme.text;
  return (
    <Text numberOfLines={numberOfLines} style={[textStyles[variant], sized(textStyles[variant], scale), { color }, style]}>
      {children}
    </Text>
  );
}

/**
 * A group of related items (a heading and its controls): tight spacing inside,
 * while the page puts more space between groups. Granny mode spreads it a little more.
 */
export function Section({ title, number, children }: { title?: string; number?: number; children: ReactNode }) {
  const theme = useTheme();
  const { granny } = useLook();
  const body = (
    <View style={{ flex: 1, gap: granny ? Spacing.three : Spacing.two }}>
      {/* Uppercase heading with a strong rule under it. */}
      {title ? (
        <View style={{ borderBottomWidth: 2, borderBottomColor: theme.border, paddingBottom: 6 }}>
          <Label variant="overline">{title.toUpperCase()}</Label>
        </View>
      ) : null}
      {children}
    </View>
  );
  if (number === undefined) return body;
  // A numbered step: a yellow square with the number, then the step.
  return (
    <View style={{ flexDirection: 'row', gap: 14 }}>
      <View style={[styles.number, { backgroundColor: theme.accent }]}>
        <Text style={[textStyles.number, { color: theme.onAccent }]}>{number}</Text>
      </View>
      {body}
    </View>
  );
}

/** A short state line (e.g. "Automatic checking is on", "Done"), in the accent colour, bold. */
export function Status({ children }: { children: ReactNode }) {
  const theme = useTheme();
  return (
    <Label variant="label" style={{ color: theme.primary }}>
      {children}
    </Label>
  );
}

/** Amber warning box for something the user should fix (e.g. the text is not a message). */
export function Warning({ title, children }: { title: string; children: ReactNode }) {
  const colors = LevelColors.CAREFUL;
  const { scale } = useLook();
  return (
    <View accessibilityRole="alert" accessibilityLiveRegion="polite" style={[styles.warning, { backgroundColor: colors.background }]}>
      <Text style={[textStyles.label, sized(textStyles.label, scale), { color: colors.text }]}>{title}</Text>
      <Text style={[textStyles.body, sized(textStyles.body, scale), { color: colors.text }]}>{children}</Text>
    </View>
  );
}

export function Card({ children }: { children: ReactNode }) {
  const theme = useTheme();
  return (
    <View style={[styles.card, { borderBottomColor: theme.hairline }]}>
      {children}
    </View>
  );
}

/**
 * Surprise card ("panic-tapping"): a second tap within `wait` ms is ignored,
 * so one tap = one action (one check, one save, one call, one share, one screen).
 */
function useOneTap(onPress: () => void, wait: number) {
  const last = useRef(0);
  return () => {
    const now = Date.now();
    if (now - last.current < wait) return;
    last.current = now;
    onPress();
  };
}

export function Button({
  title,
  onPress,
  kind = 'primary',
}: {
  title: string;
  onPress: () => void;
  kind?: 'primary' | 'secondary';
}) {
  const theme = useTheme();
  const { scale, buttonHeight } = useLook();
  const primary = kind === 'primary';
  const press = useOneTap(onPress, 1000);
  const reduce = useReduceMotion();
  // Pressed: the button eases to 97% of its size in 100 ms, and back on release, so every tap is felt.
  const [size] = useState(() => new Animated.Value(1));
  function ease(to: number) {
    if (reduce) return; // "Remove animations" is on: the button only dims
    Animated.timing(size, { toValue: to, duration: 100, easing: Easing.out(Easing.quad), useNativeDriver: true }).start();
  }
  return (
    <Pressable accessibilityRole="button" onPress={press} onPressIn={() => ease(0.97)} onPressOut={() => ease(1)}>
      {({ pressed }) => (
        <Animated.View
          style={[
            styles.button,
            {
              backgroundColor: primary ? theme.primary : theme.primarySoft,
              borderColor: theme.primary,
              opacity: pressed ? 0.85 : 1,
              transform: [{ scale: size }],
              minHeight: buttonHeight + 6,
              justifyContent: primary ? 'space-between' : 'center',
            },
          ]}>
          <Text
            style={[
              textStyles.label,
              sized(textStyles.label, scale),
              { color: primary ? theme.onPrimary : theme.primary, flexShrink: 1 },
              primary ? { fontFamily: HeadingFont, fontWeight: '800', letterSpacing: 0.3 } : { textAlign: 'center' },
            ]}>
            {title}
          </Text>
          {/* The main button points forward. */}
          {primary ? <Text style={[textStyles.label, sized(textStyles.label, scale), { color: theme.onPrimary }]}>→</Text> : null}
        </Animated.View>
      )}
    </Pressable>
  );
}

/** Big coloured banner with the result level, and (optionally) one plain sentence saying what to do. */
export function LevelBanner({ level, detail, stamp = false }: { level: Level; detail?: string; stamp?: boolean }) {
  const colors = LevelColors[level];
  const { scale, granny } = useLook();
  const reduce = useReduceMotion();
  // "Stop – high risk" becomes the word "Stop." with "HIGH RISK" above it.
  const [word, note] = t(`level${level}`).split(' – ');
  // A short word is set poster-size; a longer phrase ("No warning signs found") is set smaller so it fits.
  const big = word.length <= 6 ? FontSize.poster : word.length <= 12 ? 56 : 34;
  // The "stamp" (new results only): the word lands from 135% to 100% in 400 ms, no bounce.
  // Granny mode or "Remove animations": a 150 ms fade, nothing moves.
  const still = granny || reduce;
  const [landed] = useState(() => new Animated.Value(stamp ? 0 : 1));
  useEffect(() => {
    if (!stamp) return;
    Animated.timing(landed, { toValue: 1, duration: still ? 150 : 400, easing: Easing.bezier(0.16, 1, 0.3, 1), useNativeDriver: true }).start();
    // Runs once, when the banner first appears.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const stampSize = still ? 1 : landed.interpolate({ inputRange: [0, 1], outputRange: [1.35, 1] });
  return (
    <View accessibilityRole="header" accessibilityLabel={t(`level${level}`)} style={[styles.banner, { backgroundColor: colors.background }]}>
      {note ? <Text style={[textStyles.overline, { color: colors.text }]}>{note.toUpperCase()}</Text> : null}
      <Animated.Text
        style={[
          textStyles.poster,
          { color: colors.text, fontSize: big, lineHeight: big * 0.95, opacity: landed, transform: [{ scale: stampSize }], transformOrigin: 'left center' },
        ]}>
        {word}.
      </Animated.Text>
      {detail ? (
        <Text style={[textStyles.body, sized(textStyles.body, scale), { color: colors.text, fontWeight: '600', marginTop: Spacing.one }]}>
          {detail}
        </Text>
      ) : null}
    </View>
  );
}

/** Small coloured tag (used on each finding and in History). `label` replaces the level text. */
export function LevelTag({ level, label }: { level: Level; label?: string }) {
  const colors = LevelColors[level];
  const { scale } = useLook();
  return (
    <View style={[styles.tag, { backgroundColor: colors.background }]}>
      <Text numberOfLines={1} style={[textStyles.tag, sized(textStyles.tag, scale), { color: colors.text }]}>
        {label ?? t(`level${level}`)}
      </Text>
    </View>
  );
}

/** The message, with the X-Ray highlights marked. */
export function HighlightedText({ text, highlights }: { text: string; highlights: Highlight[] }) {
  const theme = useTheme();
  const { scale } = useLook();
  const marked = new Array(text.length).fill(false);
  for (const h of highlights) {
    for (let i = Math.max(0, h.start); i < Math.min(text.length, h.end); i++) marked[i] = true;
  }

  // Split the text into runs of marked / not marked characters.
  const parts: { text: string; marked: boolean }[] = [];
  for (let i = 0; i < text.length; i++) {
    const last = parts[parts.length - 1];
    if (last && last.marked === marked[i]) last.text += text[i];
    else parts.push({ text: text[i], marked: marked[i] });
  }

  return (
    <Text style={[textStyles.body, sized(textStyles.body, scale), { color: theme.text }]}>
      {parts.map((p, i) => (
        <Text
          key={i}
          style={p.marked ? { backgroundColor: theme.highlight, color: theme.onAccent, fontWeight: '700' } : undefined}>
          {p.text}
        </Text>
      ))}
    </Text>
  );
}

/** Pill button for picking one option (costs, agencies). */
export function Chip({ title, selected, onPress }: { title: string; selected: boolean; onPress: () => void }) {
  const theme = useTheme();
  const { scale, chipHeight } = useLook();
  const press = useOneTap(onPress, 400);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={press}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? theme.primary : theme.backgroundElement,
          borderColor: theme.border,
          minHeight: chipHeight,
        },
      ]}>
      <Text style={[textStyles.small, sized(textStyles.small, scale), { color: selected ? theme.onPrimary : theme.text, fontWeight: '600' }]}>
        {title}
      </Text>
    </Pressable>
  );
}

const textStyles = StyleSheet.create({
  title: { fontSize: FontSize.title, fontWeight: '900', lineHeight: FontSize.title * 1.0, letterSpacing: -0.5, fontFamily: HeadingFont, textTransform: 'uppercase' },
  overline: { fontSize: FontSize.overline, lineHeight: FontSize.overline * 1.4, fontWeight: '800', letterSpacing: 1.5, fontFamily: HeadingFont },
  poster: { fontSize: FontSize.poster, fontWeight: '900', letterSpacing: -1, fontFamily: HeadingFont },
  number: { fontSize: 30, lineHeight: 34, fontWeight: '900', fontFamily: HeadingFont },
  body: { fontSize: FontSize.body, lineHeight: FontSize.body * 1.45 },
  small: { fontSize: FontSize.small, lineHeight: FontSize.small * 1.4 },
  tag: { fontSize: FontSize.small, lineHeight: FontSize.small * 1.4, fontWeight: '700' },
  label: { fontSize: FontSize.body, lineHeight: FontSize.body * 1.3, fontWeight: '700' },
  banner: { fontSize: FontSize.banner, fontWeight: '800', textAlign: 'center' },
});

const styles = StyleSheet.create({
  scroll: { padding: PageMargin, alignItems: 'center' },
  column: { width: '100%', maxWidth: MaxContentWidth, gap: Spacing.three },
  card: { borderBottomWidth: 1, paddingBottom: 14, gap: Spacing.one + 2, ...CardShadow },
  number: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: RadiusCard },
  button: { borderWidth: 2, borderRadius: RadiusCard, paddingVertical: 14, paddingHorizontal: 18, minHeight: 58, flexDirection: 'row', alignItems: 'center', gap: Spacing.two },
  // The band reaches the screen edges and the top of the page.
  banner: { marginHorizontal: -PageMargin, marginTop: -PageMargin, paddingHorizontal: PageMargin, paddingTop: Spacing.three, paddingBottom: 22, gap: 4 },
  warning: { borderRadius: RadiusCard, padding: Spacing.three, gap: Spacing.one },
  tag: { alignSelf: 'flex-start', borderRadius: RadiusCard, paddingHorizontal: 9, paddingVertical: 4 },
  chip: { borderWidth: 2, borderRadius: RadiusCard, paddingHorizontal: Spacing.three, paddingVertical: Spacing.two, minHeight: 48, minWidth: 48, justifyContent: 'center' },
});
