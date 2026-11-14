// Small helpers for the animations.

/**
 * Wraps a function so it runs only the first time it is called.
 * Surprise card (panic-tapping): however many taps land during the scan, exactly one Result opens.
 */
export function once(fn: () => void): () => void {
  let done = false;
  return () => {
    if (done) return;
    done = true;
    fn();
  };
}

// Which check is brand new. The Result plays its "stamp" animation only for a new check:
// reopening a case from History, or coming back from the Job check, shows it with no animation.
let freshId: string | null = null;

/** Called when a new check is made (Check button, share, widget). */
export function markFresh(id: string) {
  freshId = id;
}

/** True once for a new check, then false (so the animation never replays). */
export function takeFresh(id: string | undefined): boolean {
  if (id === undefined || id !== freshId) return false;
  freshId = null;
  return true;
}
