// The level a case shows on screen. It is the strongest of:
//   - the checks on the phone (result.level),
//   - the online check's answer, remembered with the case (onlineLevel),
//   - "Be careful" for a link read from a QR code that no list knows.
// Result and History both use this, so a saved case never looks milder than it was.

import type { Level } from '@/engine';
import { hasLink } from '@/lib/input-check';

const ORDER: Level[] = ['NONE', 'CAREFUL', 'STOP'];

export function strongest(a: Level, b: Level): Level {
  return ORDER.indexOf(a) >= ORDER.indexOf(b) ? a : b;
}

/** True when the case is a link from a QR code that nothing flagged: it still gets "Be careful". */
export function needsQrCaution(check: { text: string; fromQr?: boolean }, found: Level): boolean {
  return check.fromQr === true && found === 'NONE' && hasLink(check.text);
}

export function shownLevel(check: { text: string; result: { level: Level }; onlineLevel?: Level; fromQr?: boolean }): Level {
  const found = strongest(check.result.level, check.onlineLevel ?? 'NONE');
  return needsQrCaution(check, found) ? 'CAREFUL' : found;
}
