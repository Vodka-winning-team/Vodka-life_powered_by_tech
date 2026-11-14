// The 4 tabs at the bottom: Check, Is it official?, Learn, History.
// The key flow (Result → Job check → What to do now) opens ON TOP of the tabs, with no tab bar,
// so a stray tab tap can't break it (surprise card).

import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Tabs } from 'expo-router';
import type { ComponentProps } from 'react';
import { Pressable, type ColorValue } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { t } from '@/constants/strings';
import { FontSize, Spacing } from '@/constants/theme';
import { useLook } from '@/hooks/use-look';
import { useTheme } from '@/hooks/use-theme';
import { useStore } from '@/lib/store';

type IconName = ComponentProps<typeof Ionicons>['name'];

function tabIcon(name: IconName, active: IconName) {
  function TabIcon({ color, focused, size }: { color: ColorValue; focused: boolean; size: number }) {
    return <Ionicons name={focused ? active : name} color={typeof color === 'string' ? color : undefined} size={size} />;
  }
  return TabIcon;
}

export default function TabsLayout() {
  const theme = useTheme();
  const { language } = useStore(); // titles are re-read when the language changes
  const { granny, scale } = useLook();
  // Space taken by Android's navigation buttons at the bottom of the screen (0 on phones without them).
  const insets = useSafeAreaInsets();

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: theme.background },
        headerTintColor: theme.text,
        headerShadowVisible: false,
        headerTitleStyle: { fontWeight: '700' },
        sceneStyle: { backgroundColor: theme.background },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.backgroundElement,
          borderTopColor: theme.border,
          borderTopWidth: 2,
          height: (granny ? 84 : 68) + insets.bottom,
          paddingTop: Spacing.one,
          paddingBottom: insets.bottom,
        },
        tabBarLabelStyle: { fontSize: (granny ? 13 : 11) * Math.min(scale, 1.2), fontWeight: '600' },
        tabBarIconStyle: { marginBottom: 0 },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          // The name is set in poster type on the yellow band just below, so the header itself is plain yellow.
          title: '',
          headerStyle: { backgroundColor: theme.accent },
          tabBarLabel: t('tabCheck', language),
          tabBarIcon: tabIcon('shield-checkmark-outline', 'shield-checkmark'),
          // Settings (Granny mode, automatic checking, tour) behind a gear, top right.
          headerRight: () => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('settingsTitle', language)}
              hitSlop={12}
              onPress={() => router.push('/settings')}
              style={({ pressed }) => ({ paddingHorizontal: Spacing.three, opacity: pressed ? 0.6 : 1 })}>
              <Ionicons name="settings-outline" size={FontSize.banner * scale} color={theme.text} />
            </Pressable>
          ),
        }}
      />
      <Tabs.Screen
        name="numbers"
        options={{
          title: t('numbersTitle', language),
          tabBarLabel: t('tabNumbers', language),
          tabBarIcon: tabIcon('call-outline', 'call'),
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: t('learnTitle', language),
          tabBarLabel: t('tabLearn', language),
          tabBarIcon: tabIcon('school-outline', 'school'),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: t('historyTitle', language),
          tabBarLabel: t('tabHistory', language),
          tabBarIcon: tabIcon('time-outline', 'time'),
        }}
      />
    </Tabs>
  );
}
