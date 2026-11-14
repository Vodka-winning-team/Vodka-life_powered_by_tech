// ALL colours and sizes live here, so a surprise-card change (bigger text, high contrast...) is one edit.

import { Platform } from 'react-native';

import type { Level } from '@/engine';

/**
 * "Notice style": black, white and yellow, like an official notice. One look for everyone,
 * so the light and dark entries are the same (strong contrast in any lighting).
 */
const NOTICE = {
  text: '#111111',
  textSecondary: '#5C5C5C',
  background: '#FFFFFF',
  backgroundElement: '#FFFFFF',
  backgroundSelected: '#F2C230',
  border: '#111111', // strong rule (inputs, outlined buttons, section headings)
  hairline: '#DADAD4', // thin rule between rows
  primary: '#111111', // main buttons: black, with yellow text
  primarySoft: '#FFFFFF',
  onPrimary: '#F2C230',
  accent: '#F2C230', // the yellow band, number squares, highlights
  onAccent: '#111111', // text on yellow (the same in night mode)
  highlight: '#F2C230',
} as const;

/** Night mode: the same notice, inverted. Black page, white text, yellow buttons. */
const NOTICE_NIGHT = {
  text: '#FFFFFF',
  textSecondary: '#B9B9B2',
  background: '#111111',
  backgroundElement: '#111111',
  backgroundSelected: '#F2C230',
  border: '#FFFFFF',
  hairline: '#3A3A36',
  primary: '#F2C230', // main buttons: yellow, with black text
  primarySoft: '#111111',
  onPrimary: '#111111',
  accent: '#F2C230',
  onAccent: '#111111',
  highlight: '#F2C230',
} as const;

export const Colors = { light: NOTICE, dark: NOTICE_NIGHT } as const;

export type ThemeColor = keyof typeof Colors.light;

/** Banner colours per result level. NONE is black, never green: "no signs found" is not "safe". */
export const LevelColors: Record<Level, { background: string; text: string }> = {
  STOP: { background: '#B3261E', text: '#FFFFFF' },
  CAREFUL: { background: '#F2C230', text: '#111111' },
  NONE: { background: '#111111', text: '#FFFFFF' },
};

export const Spacing = {
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
} as const;

/** Multiply every font size by this. Set to 1.25 for "large text". */
export const TextScale = 1.1;

export const FontSize = {
  small: 14 * TextScale,
  body: 17 * TextScale,
  title: 44 * TextScale,
  overline: 14 * TextScale,
  poster: 88 * TextScale,
  banner: 22 * TextScale,
} as const;

/** Corner radius: 3 px everywhere, so the squares are not sharp. */
export const Radius = 3;
export const RadiusCard = 3;

/** No shadows in the notice style (kept so components can still spread it). */
export const CardShadow = {
  shadowColor: '#101828',
  shadowOpacity: 0,
  shadowRadius: 0,
  shadowOffset: { width: 0, height: 0 },
  elevation: 0,
} as const;
export const MaxContentWidth = 720;

/** Condensed heavy face for headings (Roboto Condensed on Android; the normal face elsewhere). */
export const HeadingFont = Platform.OS === 'android' ? 'sans-serif-condensed' : undefined;

/** Page margin. Full-width bands use the same number, negative, to reach the screen edges. */
export const PageMargin = 24;
