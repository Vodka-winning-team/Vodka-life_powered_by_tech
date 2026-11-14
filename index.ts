/* eslint-disable @typescript-eslint/no-require-imports -- loaded only on Android builds, after the check */
// App entry. Registers the home screen widget's task handler (Android APK only), then starts the app.
// Expo Go and the web skip the widget, because they don't have its native module.

import Constants from 'expo-constants';
import { Platform } from 'react-native';

if (Platform.OS === 'android' && Constants.executionEnvironment !== 'storeClient') {
  const { registerWidgetTaskHandler } = require('react-native-android-widget');
  const { widgetTaskHandler } = require('./src/widget/task-handler');
  registerWidgetTaskHandler(widgetTaskHandler);
}

require('expo-router/entry');
