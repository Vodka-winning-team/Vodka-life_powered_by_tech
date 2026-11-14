// Draws the home screen widget. Android calls this when the widget is added, resized or due an update
// (every 30 minutes at most); the app also asks for a redraw when the language or automatic checking changes.

import AsyncStorage from '@react-native-async-storage/async-storage';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';

import type { Language } from '@/constants/strings';
import { VerifyeWidget } from './verifye-widget';

// Same keys as src/lib/store.tsx, read-only here.
const LANGUAGE_KEY = 'language-v1';
const SHIELD_KEY = 'shield-v1';

async function readSettings(): Promise<{ language: Language; shieldOn: boolean }> {
  try {
    const [language, shield] = await Promise.all([AsyncStorage.getItem(LANGUAGE_KEY), AsyncStorage.getItem(SHIELD_KEY)]);
    return {
      language: language === 'fr' || language === 'mfe' ? language : 'en',
      shieldOn: shield === 'on',
    };
  } catch {
    return { language: 'en', shieldOn: false };
  }
}

/** The widget in both looks; the phone picks light or dark. */
export async function renderVerifyeWidget(override?: { language?: Language; shieldOn?: boolean }) {
  const saved = await readSettings();
  const settings = { ...saved, ...override };
  return {
    light: <VerifyeWidget scheme="light" {...settings} />,
    dark: <VerifyeWidget scheme="dark" {...settings} />,
  };
}

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  switch (props.widgetAction) {
    case 'WIDGET_ADDED':
    case 'WIDGET_UPDATE':
    case 'WIDGET_RESIZED':
      props.renderWidget(await renderVerifyeWidget());
      break;
    default:
      // Clicks open the app through links (OPEN_APP / OPEN_URI), so there is nothing to do here.
      break;
  }
}
