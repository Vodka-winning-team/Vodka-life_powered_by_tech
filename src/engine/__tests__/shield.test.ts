// Shield opt-in (decision 15): engine side. shouldAlert() decides if a WhatsApp/SMS notification raises an alert.
import { Engine } from '../index';
import { loadRealData } from '../testing/load-data';

const engine = new Engine(loadRealData(), '2026-11-14');
const demo1 = 'Bonjour Kevin! THINK RECRUITMENT LTD here. Hotel job in Canada, salary CAD 3,000. ' +
  'To secure your place, pay the processing fee of Rs 50,000 today by Juice. Urgent, only 2 places left.';
const demo5 = 'MCB: Your OTP for the online payment of Rs 1,250.00 at DARTY is 482913. Never share this code with anyone, including MCB staff.';

test('demo 1 on WhatsApp → alert, STOP', () => {
  expect(engine.shouldAlert('com.whatsapp', demo1)).toEqual({ alert: true, level: 'STOP' });
});

test('demo 5 (real bank code SMS) on Google Messages → no alert', () => {
  expect(engine.shouldAlert('com.google.android.apps.messaging', demo5).alert).toBe(false);
});

test('a warning from any other app → no alert (Shield reads only WhatsApp and SMS)', () => {
  for (const pkg of ['com.facebook.orca', 'com.android.shell', 'com.google.android.gm', '']) {
    expect(engine.shouldAlert(pkg, demo1).alert).toBe(false);
  }
});

test('adb test notifications alert only in debug builds', () => {
  expect(engine.shouldAlert('com.android.shell', demo1, true).alert).toBe(true);
});

test('empty, emoji-only, summary or unreadable notifications → no alert', () => {
  for (const text of ['', '   ', '🙂🙂', '3 new messages', null as unknown as string]) {
    expect(engine.shouldAlert('com.whatsapp', text).alert).toBe(false);
  }
});

test('CAREFUL warnings alert too (Kreol new number + money)', () => {
  expect(engine.shouldAlert('com.whatsapp.w4b', 'Salam, mo finn perdi mo telefonn, sa mo nouvo nimero. Avoy Rs 3000 urgent'))
    .toEqual({ alert: true, level: 'CAREFUL' });
});

test('a very long chat with no warning sign → no alert just because it is long', () => {
  expect(engine.shouldAlert('com.whatsapp', 'See you at 7 for dinner. '.repeat(1200)).alert).toBe(false);
});
