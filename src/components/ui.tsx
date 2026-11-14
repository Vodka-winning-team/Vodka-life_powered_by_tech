// Small building blocks used by every screen. Colours and sizes come from constants/theme.ts.

import { useRef, type ComponentRef, type ReactNode, type RefObject } from 'react';
import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, View, type TextStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { t } from '@/constants/strings';
import { CardShadow, FontSize, LevelColors, MaxContentWidth, RadiusCard, Spacing } from '@/constants/theme';
import type { Highlight, Level } from '@/engine';
import { useLook } from '@/hooks/use-look';
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
  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={{ flex: 1, backgroundColor: theme.background }}>
      {/* While typing, the keyboard pushes the page up instead of covering the buttons. */}
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <ScrollView ref={scrollRef} contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
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
  const color = (variant === 'small' || variant === 'overline') && !granny ? theme.textSecondary : theme.text;
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
export function Section({ title, children }: { title?: string; children: ReactNode }) {
  const { granny } = useLook();
  return (
    <View style={{ gap: granny ? Spacing.three : Spacing.two }}>
      {/* Small uppercase heading above a group. */}
      {title ? <Label variant="overline">{title.toUpperCase()}</Label> : null}
      {children}
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
    <View style={[styles.card, { backgroundColor: theme.backgroundElement, borderColor: theme.border }]}>
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
  return (
    <Pressable
      accessibilityRole="button"
      onPress={press}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: primary ? theme.primary : theme.primarySoft,
          borderColor: primary ? theme.primary : theme.primarySoft,
          // Pressed: slightly smaller and dimmer, so every tap is felt.
          opacity: pressed ? 0.85 : 1,
          transform: [{ scale: pressed ? 0.97 : 1 }],
          minHeight: buttonHeight,
        },
      ]}>
      <Text style={[textStyles.label, sized(textStyles.label, scale), { color: primary ? theme.onPrimary : theme.primary, textAlign: 'center' }]}>
        {title}
      </Text>
    </Pressable>
  );
}

/** Big coloured banner with the result level, and (optionally) one plain sentence saying what to do. */
export function LevelBanner({ level, detail }: { level: Level; detail?: string }) {
  const colors = LevelColors[level];
  const { scale } = useLook();
  return (
    <View accessibilityRole="header" style={[styles.banner, { backgroundColor: colors.background }]}>
      <Text style={[textStyles.banner, sized(textStyles.banner, scale), { color: colors.text }]}>{t(`level${level}`)}</Text>
      {detail ? (
        <Text style={[textStyles.body, sized(textStyles.body, scale), { color: colors.text, textAlign: 'center', marginTop: Spacing.two }]}>
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
          style={p.marked ? { backgroundColor: theme.highlight, fontWeight: '700' } : undefined}>
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
          borderColor: selected ? theme.primary : theme.border,
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
  title: { fontSize: FontSize.title, fontWeight: '800', lineHeight: FontSize.title * 1.2, letterSpacing: -0.5 },
  overline: { fontSize: FontSize.overline, lineHeight: FontSize.overline * 1.4, fontWeight: '700', letterSpacing: 1 },
  body: { fontSize: FontSize.body, lineHeight: FontSize.body * 1.45 },
  small: { fontSize: FontSize.small, lineHeight: FontSize.small * 1.4 },
  tag: { fontSize: FontSize.small, lineHeight: FontSize.small * 1.4, fontWeight: '700' },
  label: { fontSize: FontSize.body, lineHeight: FontSize.body * 1.3, fontWeight: '700' },
  banner: { fontSize: FontSize.banner, fontWeight: '800', textAlign: 'center' },
});

const styles = StyleSheet.create({
  scroll: { padding: 20, alignItems: 'center' },
  column: { width: '100%', maxWidth: MaxContentWidth, gap: Spacing.three },
  card: { borderWidth: 1, borderRadius: RadiusCard, padding: 20, gap: Spacing.two, ...CardShadow },
  button: { borderWidth: 1, borderRadius: 999, paddingVertical: 15, paddingHorizontal: Spacing.three, minHeight: 52, justifyContent: 'center' },
  banner: { borderRadius: RadiusCard, paddingVertical: Spacing.five, paddingHorizontal: Spacing.three, ...CardShadow },
  warning: { borderRadius: RadiusCard, padding: Spacing.three, gap: Spacing.one },
  tag: { alignSelf: 'flex-start', borderRadius: 8, paddingHorizontal: Spacing.two, paddingVertical: 2 },
  chip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: Spacing.three, paddingVertical: Spacing.two, minHeight: 48, minWidth: 48, justifyContent: 'center' },
});
