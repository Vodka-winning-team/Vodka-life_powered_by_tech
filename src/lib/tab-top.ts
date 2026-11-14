// Tapping the tab you are already on brings its page back to the top.
// The tab bar calls goToTop(); every page listens and scrolls up.

const listeners = new Set<() => void>();

export function goToTop() {
  for (const listener of listeners) listener();
}

/** Returns a function that stops listening. */
export function onGoToTop(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}
