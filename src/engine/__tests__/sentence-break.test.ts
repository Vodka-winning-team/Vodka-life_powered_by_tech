// A missing space after a full stop ("was used.Today at 10:42") must not become a web address,
// or a real bank SMS gets "Stop – link is not the bank's website". Found on main at 11:35, 14 Nov.
import { CheckResult, Engine } from '../index';
import { loadRealData } from '../testing/load-data';

const engine = new Engine(loadRealData(), '2026-11-14');
const kinds = (r: CheckResult) => r.findings.map((f) => f.kind);

test.each([
  'MCB: Your card ending 1234 was used.Today at 10:42 for Rs 500 at Winners. Never share your OTP.',
  'SBM: Thank you for banking with us.Help is available 24/7 on our app.',
  'MCB Juice payment of Rs 200 received.Today your balance is Rs 1,500.',
])('a sentence break is not a link: %s', (text) => {
  const r = engine.check(text);
  expect(kinds(r)).not.toContain('bank_link');
  expect(r.level).not.toBe('STOP');
});

test.each([
  'MCB: Verify at mcb-secure.support now',
  'MCB: Verify at MCB-SECURE.SUPPORT now',
  'MCB: Verify at https://mcb-secure.Support now',
  'MCB: Verify at www.mcb-secure.Today now',
  'MCB: Verify at mcb-login-secure.Net now',
])('a real look-alike address is still a link: %s', (text) => {
  const r = engine.check(text);
  expect(kinds(r)).toContain('bank_link');
  expect(r.level).toBe('STOP');
});
