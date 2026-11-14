// A one-time note for the Check tab, left by a screen that sends the user back there
// (e.g. the widget's "Check copied message" when nothing was copied).

import type { StringKey } from '@/constants/strings';

let pending: StringKey | null = null;

export function leaveNotice(key: StringKey) {
  pending = key;
}

/** Returns the note once, then forgets it. */
export function takeNotice(): StringKey | null {
  const key = pending;
  pending = null;
  return key;
}
