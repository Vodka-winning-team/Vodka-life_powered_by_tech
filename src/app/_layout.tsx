import Constants from 'expo-constants';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { ShareIntentProvider } from 'expo-share-intent';
import { Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { ShareIn } from '@/components/share-in';
import { ShieldWatcher } from '@/components/shield-watcher';
import { t } from '@/constants/strings';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { StoreProvider, useStore } from '@/lib/store';
import { WidgetSync } from '@/widget/widget-sync';

// A link that opens a screen directly (the widget, a Shield alert) still has the tabs underneath,
// so Back always returns to the app instead of closing it.
export const unstable_settings = { anchor: '(tabs)' };

type ThemeColors = (typeof Colors)['light'] | (typeof Colors)['dark'];

// Share-in from WhatsApp/SMS works in the APK only: Expo Go and the web don't have the native module.
const shareInDisabled = Platform.OS === 'web' || Constants.executionEnvironment === 'storeClient';

export default function RootLayout() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[scheme];

  return (
    <ShareIntentProvider options={{ disabled: shareInDisabled }}>
      <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
        <StoreProvider>
          <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
          <AppStack colors={colors} />
          <ShareIn />
          <ShieldWatcher />
          <WidgetSync />
        </StoreProvider>
      </ThemeProvider>
    </ShareIntentProvider>
  );
}

/** Reads the language from the store, so the screen titles re-render when it changes. */
function AppStack({ colors }: { colors: ThemeColors }) {
  const { language } = useStore(); // titles are re-read when the language changes
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}>
      {/* The 4 tabs (Check, Is it official?, Learn, History) have their own headers. */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false, title: t('appName', language) }} />
      {/* The key flow and the other screens open on top of the tabs. */}
      <Stack.Screen name="result" options={{ title: t('resultTitle', language) }} />
      <Stack.Screen name="job" options={{ title: t('jobTitle', language) }} />
      <Stack.Screen name="actions" options={{ title: t('actionsTitle', language) }} />
      <Stack.Screen name="sources" options={{ title: t('sourcesTitle', language) }} />
      <Stack.Screen name="shield" options={{ title: t('shieldSetupTitle', language) }} />
      <Stack.Screen name="pay" options={{ title: t('payTitle', language) }} />
      <Stack.Screen name="settings" options={{ title: t('settingsTitle', language) }} />
      {/* Opened by the home screen widget: checks the copied message, then shows the Result. */}
      <Stack.Screen name="check" options={{ headerShown: false, animation: 'fade' }} />
    </Stack>
  );
}
