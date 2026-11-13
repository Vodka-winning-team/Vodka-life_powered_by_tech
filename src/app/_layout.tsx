import Constants from 'expo-constants';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { ShareIntentProvider } from 'expo-share-intent';
import { Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { ShareIn } from '@/components/share-in';
import { t } from '@/constants/strings';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { StoreProvider, useStore } from '@/lib/store';

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
        </StoreProvider>
      </ThemeProvider>
    </ShareIntentProvider>
  );
}

/** Reads the language from the store, so the screen titles re-render when it changes. */
function AppStack({ colors }: { colors: ThemeColors }) {
  useStore(); // subscribe to language changes
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}>
      <Stack.Screen name="index" options={{ title: t('appName') }} />
      <Stack.Screen name="result" options={{ title: t('resultTitle') }} />
      <Stack.Screen name="job" options={{ title: t('jobTitle') }} />
      <Stack.Screen name="actions" options={{ title: t('actionsTitle') }} />
      <Stack.Screen name="history" options={{ title: t('historyTitle') }} />
      <Stack.Screen name="sources" options={{ title: t('sourcesTitle') }} />
    </Stack>
  );
}
