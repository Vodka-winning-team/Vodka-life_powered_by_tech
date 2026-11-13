// ALL colours and sizes live here, so a surprise-card change (bigger text, high contrast...) is one edit.

import type { Level } from '@/engine';

export const Colors = {
  light: {
    text: '#14171F',
    textSecondary: '#5B6170',
    background: '#F6F7F9',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#E6E9EF',
    border: '#DDE1E8',
    primary: '#1F4FD8',
    onPrimary: '#FFFFFF',
    highlight: '#FFE08A',
  },
  dark: {
    text: '#F2F4F8',
    textSecondary: '#A7AEBB',
    background: '#0E1116',
    backgroundElement: '#181C23',
    backgroundSelected: '#252B35',
    border: '#2C3340',
    primary: '#7EA2FF',
    onPrimary: '#0E1116',
    highlight: '#7A5C00',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light;

/** Banner colours per result level. NONE is neutral blue, never green: "no signs found" is not "safe". */
export const LevelColors: Record<Level, { background: string; text: string }> = {
  STOP: { background: '#C62828', text: '#FFFFFF' },
  CAREFUL: { background: '#F2A900', text: '#1A1300' },
  NONE: { background: '#3D5A80', text: '#FFFFFF' },
};

export const Spacing = {
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
} as const;

/** Multiply every font size by this. Set to 1.25 for "large text". */
export const TextScale = 1;

export const FontSize = {
  small: 14 * TextScale,
  body: 17 * TextScale,
  title: 26 * TextScale,
  banner: 22 * TextScale,
} as const;

export const Radius = 14;
export const MaxContentWidth = 720;
