// Small building blocks used by every screen. Colours and sizes come from constants/theme.ts.

import { useRef, type ComponentRef, type ReactNode, type RefObject } from 'react';
import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, Text, View, type TextStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { t } from '@/constants/strings';
import { FontSize, LevelColors, MaxContentWidth, Radius, Spacing } from '@/constants/theme';
import type { Highlight, Level } from '@/engine';
import { useTheme } from '@/hooks/use-theme';

/** Scrolling page with safe margins and a max width (looks right on phones, tablets and the web). */
export function Screen({ children, scrollRef }: { children: ReactNode; scrollRef?: RefObject<ComponentRef<typeof ScrollView> | null> }) {
  const theme = useTheme();
  return (
    <SafeAreaView edges={['bottom', 'left', 'right']} style={{ flex: 1, backgroundColor: theme.background }}>
      {/* While typing, the keyboard pushes the page up instead of covering the buttons. */}
      <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
        <ScrollView ref={scrollRef} contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.column}>{children}</View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

type Variant = 'title' | 'body' | 'small' | 'label';

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
  const color = variant === 'small' ? theme.textSecondary : theme.text;
  return (
    <Text numberOfLines={numberOfLines} style={[textStyles[variant], { color }, style]}>
      {children}
    </Text>
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
  const primary = kind === 'primary';
  const press = useOneTap(onPress, 1000);
  return (
    <Pressable
      accessibilityRole="button"
      onPress={press}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: primary ? theme.primary : theme.backgroundElement,
          borderColor: primary ? theme.primary : theme.border,
          opacity: pressed ? 0.75 : 1,
        },
      ]}>
      <Text style={[textStyles.label, { color: primary ? theme.onPrimary : theme.text, textAlign: 'center' }]}>
        {title}
      </Text>
    </Pressable>
  );
}

/** Big coloured banner with the result level. */
export function LevelBanner({ level }: { level: Level }) {
  const colors = LevelColors[level];
  return (
    <View accessibilityRole="header" style={[styles.banner, { backgroundColor: colors.background }]}>
      <Text style={[textStyles.banner, { color: colors.text }]}>{t(`level${level}`)}</Text>
    </View>
  );
}

/** Small coloured tag (used on each finding and in History). `label` replaces the level text. */
export function LevelTag({ level, label }: { level: Level; label?: string }) {
  const colors = LevelColors[level];
  return (
    <View style={[styles.tag, { backgroundColor: colors.background }]}>
      <Text numberOfLines={1} style={[textStyles.tag, { color: colors.text }]}>
        {label ?? t(`level${level}`)}
      </Text>
    </View>
  );
}

/** The message, with the X-Ray highlights marked. */
export function HighlightedText({ text, highlights }: { text: string; highlights: Highlight[] }) {
  const theme = useTheme();
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
    <Text style={[textStyles.body, { color: theme.text }]}>
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
        },
      ]}>
      <Text style={[textStyles.small, { color: selected ? theme.onPrimary : theme.text, fontWeight: '600' }]}>
        {title}
      </Text>
    </Pressable>
  );
}

const textStyles = StyleSheet.create({
  title: { fontSize: FontSize.title, fontWeight: '700', lineHeight: FontSize.title * 1.25 },
  body: { fontSize: FontSize.body, lineHeight: FontSize.body * 1.45 },
  small: { fontSize: FontSize.small, lineHeight: FontSize.small * 1.4 },
  tag: { fontSize: FontSize.small, lineHeight: FontSize.small * 1.4, fontWeight: '700' },
  label: { fontSize: FontSize.body, fontWeight: '700' },
  banner: { fontSize: FontSize.banner, fontWeight: '800', textAlign: 'center' },
});

const styles = StyleSheet.create({
  scroll: { padding: Spacing.three, alignItems: 'center' },
  column: { width: '100%', maxWidth: MaxContentWidth, gap: Spacing.three },
  card: { borderWidth: 1, borderRadius: Radius, padding: Spacing.three, gap: Spacing.two },
  button: { borderWidth: 1, borderRadius: Radius, paddingVertical: 15, paddingHorizontal: Spacing.three, minHeight: 52, justifyContent: 'center' },
  banner: { borderRadius: Radius, paddingVertical: Spacing.four, paddingHorizontal: Spacing.three },
  tag: { alignSelf: 'flex-start', borderRadius: 8, paddingHorizontal: Spacing.two, paddingVertical: 2 },
  chip: { borderWidth: 1, borderRadius: 999, paddingHorizontal: Spacing.three, paddingVertical: Spacing.two, minHeight: 48, minWidth: 48, justifyContent: 'center' },
});
