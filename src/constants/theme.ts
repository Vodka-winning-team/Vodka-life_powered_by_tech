// ALL colours and sizes live here, so a surprise-card change (bigger text, high contrast...) is one edit.

import type { Level } from '@/engine';

/**
 * "Notice style": black, white and one calm sand accent ("Soft Sand"), like an official notice. One look for everyone,
 * so the light and dark entries are the same (strong contrast in any lighting).
 */
const NOTICE = {
  text: '#111111',
  textSecondary: '#5C5C5C',
  background: '#FFFFFF',
  backgroundElement: '#FFFFFF',
  backgroundSelected: '#D7B982',
  border: '#111111', // strong rule (inputs, outlined buttons, section headings)
  hairline: '#DADAD4', // thin rule between rows
  primary: '#111111', // main buttons: black, with sand text
  primarySoft: '#FFFFFF',
  onPrimary: '#D7B982',
  accent: '#D7B982', // the sand band, number squares, highlights
  onAccent: '#111111', // text on the accent (the same in night mode)
  highlight: '#D7B982',
} as const;

/** Night mode: the same notice, inverted. Near-black page, warm white text, sand buttons. */
const NOTICE_NIGHT = {
  text: '#F5F2EB',
  textSecondary: '#B9B9B2',
  background: '#191815',
  backgroundElement: '#191815',
  backgroundSelected: '#D7B982',
  border: '#F5F2EB',
  hairline: '#3A3A36',
  primary: '#D7B982', // main buttons: sand, with black text
  primarySoft: '#191815',
  onPrimary: '#111111',
  accent: '#D7B982',
  onAccent: '#111111',
  highlight: '#D7B982',
} as const;

export const Colors = { light: NOTICE, dark: NOTICE_NIGHT } as const;

export type ThemeColor = keyof typeof Colors.light;

/** Banner colours per result level. NONE is black, never green: "no signs found" is not "safe". */
export const LevelColors: Record<Level, { background: string; text: string }> = {
  STOP: { background: '#B3261E', text: '#FFFFFF' },
  CAREFUL: { background: '#946200', text: '#FFFFFF' },
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

/** Heading font: Oswald Bold (loaded in src/app/_layout.tsx from assets/fonts). */
export const HeadingFont = 'Oswald-Bold';
/** The font files, by the names used in styles. */
export const Fonts = {
  'Oswald-Bold': require('../../assets/fonts/Oswald-Bold.ttf'),
  'Oswald-SemiBold': require('../../assets/fonts/Oswald-SemiBold.ttf'),
};

/** Page margin. Full-width bands use the same number, negative, to reach the screen edges. */
export const PageMargin = 24;
