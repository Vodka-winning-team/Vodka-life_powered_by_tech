// True when the phone's "Remove animations" (reduce motion) setting is on.
// Then nothing moves in the app: animations become a short fade.

import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

export function useReduceMotion(): boolean {
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((on) => {
        if (!cancelled) setReduce(on);
      })
      .catch(() => {});
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduce);
    return () => {
      cancelled = true;
      subscription.remove();
    };
  }, []);

  return reduce;
}
