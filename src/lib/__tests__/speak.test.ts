import { setLanguage } from '@/constants/strings';
import { engine } from '@/lib/data';
import { speechFor } from '@/lib/speak';

afterEach(() => setLanguage('en'));

const MCB = 'MCB: Unusual activity on your account. Verify your account at mcb-login-secure.net or it will be blocked.';

test('read-aloud text has the level, the plain sentence, the findings and the official number', () => {
  const words = speechFor(engine.check(MCB));
  expect(words).toContain('Stop – high risk');
  expect(words).toContain("Don't pay or send anything");
  expect(words).toContain("Link is not The Mauritius Commercial Bank Limited's official website");
  expect(words).toContain('+230 202 6060');
});

test('read-aloud text follows the language', () => {
  setLanguage('fr');
  expect(speechFor(engine.check(MCB))).toContain('Stop – risque élevé');
});
