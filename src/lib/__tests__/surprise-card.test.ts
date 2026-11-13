// Surprise card, app side: "survive wrong input, skipped steps, panic-tapping".
// Uses the real engine and the real data files, like the app does.

import { findingTitle, setLanguage } from '@/constants/strings';
import { engine } from '@/lib/data';
import { localDateTime } from '@/lib/time';

const DEMO_1 =
  'Bonjour Kevin! THINK RECRUITMENT LTD here. Hotel job in Canada, salary CAD 3,000. To secure your place, pay the processing fee of Rs 50,000 today by Juice. Urgent, only 2 places left.';

afterEach(() => setLanguage('en'));

test('too little text never gives a result: the Scan screen gets empty_message', () => {
  for (const input of ['ok', '🙂🙂🙂', '  .. ', 'a1']) {
    const result = engine.check(input);
    expect(result.level).not.toBe('NONE');
    expect(result.findings.some((f) => f.kind === 'empty_message')).toBe(true);
  }
  setLanguage('fr');
  const tooShort = engine.check('ok').findings[0];
  expect(findingTitle(tooShort)).toBe('Collez le message en entier pour le vérifier');
});

test('skipping the Job check (no answers) still shows the warnings, never "no warning signs"', () => {
  const skipped = engine.check(DEMO_1, null);
  expect(skipped.level).toBe('STOP');
  expect(skipped.findings.some((f) => f.kind === 'job_fee')).toBe(true);
});

test('panic-tapping Check: the same message always gives the same result', () => {
  const first = JSON.stringify(engine.check(DEMO_1));
  for (let i = 0; i < 20; i++) expect(JSON.stringify(engine.check(DEMO_1))).toBe(first);
});

test('history shows local time in a readable format', () => {
  const iso = new Date(2026, 10, 13, 20, 49).toISOString(); // 13 Nov 2026, 20:49 local
  expect(localDateTime(iso)).toBe('13 Nov 2026, 20:49');
  expect(localDateTime(null)).toBe('');
  expect(localDateTime('not a date')).toBe('');
});
