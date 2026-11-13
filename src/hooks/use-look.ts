// Granny mode (Adiyen, 22:45): bigger text, bigger buttons, strong contrast. Display only; same results.

import { useStore } from '@/lib/store';

export function useLook() {
  const { granny } = useStore();
  return {
    granny,
    /** Multiply every font size by this. */
    scale: granny ? 1.4 : 1,
    /** Minimum height of buttons and chips (a shaky finger can't hit the wrong one). */
    buttonHeight: granny ? 64 : 52,
    chipHeight: granny ? 56 : 48,
  };
}
