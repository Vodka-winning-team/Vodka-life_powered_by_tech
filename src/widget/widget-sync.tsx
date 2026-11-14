/* eslint-disable @typescript-eslint/no-require-imports -- loaded only on Android builds, after the check */
// Redraws the home screen widget when the language or automatic checking changes, so it never shows
// an old setting. Android APK only: Expo Go and the web have no widget.

import Constants from 'expo-constants';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import { useStore } from '@/lib/store';

export const widgetsAvailable = Platform.OS === 'android' && Constants.executionEnvironment !== 'storeClient';

export function WidgetSync() {
  const { language, shieldOn } = useStore();

  useEffect(() => {
    if (!widgetsAvailable) return;
    // Loaded only here, so Expo Go and the web never touch the native widget module.
    const { requestWidgetUpdate } = require('react-native-android-widget') as typeof import('react-native-android-widget');
    const { renderVerifyeWidget } = require('./task-handler') as typeof import('./task-handler');
    const { WIDGET_NAME } = require('./verifye-widget') as typeof import('./verifye-widget');
    requestWidgetUpdate({
      widgetName: WIDGET_NAME,
      renderWidget: () => renderVerifyeWidget({ language, shieldOn }),
    }).catch(() => {});
  }, [language, shieldOn]);

  return null;
}
