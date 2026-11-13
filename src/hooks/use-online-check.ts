// Asks the server to check the current message, and gives back 'loading', 'offline' or the answer.

import { useEffect, useState } from 'react';

import type { OnlineState } from '@/components/online-check';
import { analyzeOnline } from '@/lib/online';
import { useStore } from '@/lib/store';

export function useOnlineCheck(text: string): OnlineState {
  const { serverUrl } = useStore();
  // Remember which message the answer belongs to, so a new message shows 'loading' straight away.
  const [answer, setAnswer] = useState<{ key: string; state: OnlineState } | null>(null);
  const key = `${serverUrl}|${text}`;

  useEffect(() => {
    if (text === '') return;
    let cancelled = false;
    analyzeOnline(serverUrl, text).then((result) => {
      if (!cancelled) setAnswer({ key: `${serverUrl}|${text}`, state: result ?? 'offline' });
    });
    return () => {
      cancelled = true;
    };
  }, [serverUrl, text]);

  return answer && answer.key === key ? answer.state : 'loading';
}
