import { markFresh, once, takeFresh } from '@/lib/once';

test('6 fast taps during the scan open exactly one Result', () => {
  let opened = 0;
  const openResult = once(() => {
    opened += 1;
  });
  for (let tap = 0; tap < 6; tap++) openResult();
  expect(opened).toBe(1);
});

test('the stamp plays once for a new check, and never for an old one', () => {
  markFresh('check-1');
  expect(takeFresh('check-0')).toBe(false); // a case reopened from History
  expect(takeFresh('check-1')).toBe(true); // the new check
  expect(takeFresh('check-1')).toBe(false); // coming back to it later
  expect(takeFresh(undefined)).toBe(false);
});
