// "This offer sounds too good" (D's request on the board, 07:19): CAREFUL only when 2+ different clues appear.
// All messages are fictional; the 7 cases are D's, plus a few that must stay unchanged.
import { CheckResult, Engine } from '../index';
import { loadRealData } from '../testing/load-data';

const engine = new Engine(loadRealData(), '2026-11-14');
const tooGood = (r: CheckResult) => r.findings.find((f) => f.kind === 'too_good');

const careful = [
  'Data entry job, $20/hour, work from home, no experience needed. WhatsApp 5XXX XXXX',
  'Travay lakaz lor ou telefonn, gagn Rs 3,000 par zour, pa bizin lexperians. Avoy mesaz lor WhatsApp.',
  'Gagnez 500 euros par semaine en likant des vidéos, 1 heure par jour, sans expérience. Contact Telegram.',
  'Earn Rs 50,000 a month packing from home. Bring 2 friends and earn more.',
];

test.each(careful)('too good → CAREFUL with highlights: %s', (text) => {
  const r = engine.check(text);
  const f = tooGood(r);
  expect(f).toBeDefined();
  expect(f!.level).toBe('CAREFUL');
  expect(f!.title).toBe('This offer sounds too good');
  expect(Number(f!.vars!.clues)).toBeGreaterThanOrEqual(2);
  expect(f!.highlights.length).toBeGreaterThan(0);
  for (const h of f!.highlights) expect(text.slice(h.start, h.end).trim().length).toBeGreaterThan(0);
  expect(r.level).toBe('CAREFUL'); // an ad alone never gives STOP
});

const normal = [
  'ABC Ltd is hiring a data entry clerk in Ebene. Rs 18,000 a month. Send your CV to hr@abc.mu by 30 Nov.',
  'Nou pe rod enn vander pou nou magazin Curepipe, lexperians enn lane, apel 2XX XXXX.',
  'Work from home on Fridays is allowed for all staff.',
  'Call me on WhatsApp when you get home.',
  'Your code is 123456, never share it.',
];

test.each(normal)('one clue or none → no too_good finding: %s', (text) => {
  expect(tooGood(engine.check(text))).toBeUndefined();
});

test('a too-good ad that also asks for a job fee is still STOP', () => {
  const r = engine.check(`${careful[0]} Pay Rs 2,000 registration fee to start.`);
  expect(r.level).toBe('STOP');
  expect(tooGood(r)).toBeDefined();
});

test('a job abroad paid in foreign money is not a clue by itself (demo 1 has no too_good)', () => {
  const demo1 =
    'Bonjour Kevin! THINK RECRUITMENT LTD here. Hotel job in Canada, salary CAD 3,000. ' +
    'To secure your place, pay the processing fee of Rs 50,000 today by Juice. Urgent, only 2 places left.';
  expect(tooGood(engine.check(demo1))).toBeUndefined();
  expect(tooGood(engine.check('Cruise ship job, $2,000 a month, apply on WhatsApp.'))).toBeUndefined();
});
