import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { t } from '@/constants/strings';
import { Colors } from '@/constants/theme';
import { StoreProvider } from '@/lib/store';

export default function RootLayout() {
  const scheme = useColorScheme() === 'dark' ? 'dark' : 'light';
  const colors = Colors[scheme];

  return (
    <ThemeProvider value={scheme === 'dark' ? DarkTheme : DefaultTheme}>
      <StoreProvider>
        <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
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
      </StoreProvider>
    </ThemeProvider>
  );
}
