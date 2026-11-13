import * as fs from 'fs';
import * as path from 'path';

import { findingTitle, setLanguage, t } from '../strings';

afterEach(() => setLanguage('en'));

test('finding title is translated with the name from the engine title', () => {
  setLanguage('fr');
  const title = findingTitle({ kind: 'bank_link', title: "Link is not MauBank Ltd's official website" });
  expect(title).toBe("Ce lien n'est pas le site officiel de MauBank Ltd");

  setLanguage('mfe');
  expect(findingTitle({ kind: 'cert_alert', title: 'Matches a CERT-MU alert: Fake Divali cash gift on WhatsApp' })).toBe(
    'Parey kouma enn lalert CERT-MU: Fake Divali cash gift on WhatsApp',
  );
});

test('unknown kind or changed English title falls back to the engine title', () => {
  setLanguage('fr');
  expect(findingTitle({ kind: 'something_new', title: 'New rule' })).toBe('New rule');
  expect(findingTitle({ kind: 'bank_link', title: 'Different wording' })).toBe('Different wording');
});

test('English stays English; missing French text falls back to English', () => {
  expect(t('scanTitle')).toBe('Check a message');
  setLanguage('fr');
  expect(t('scanTitle')).toBe('Vérifier un message');
  expect(t('appName')).toBe('Verifye');
});

test('wording rule: no "safe", "genuine", "scam" or "illegal" in any language', () => {
  const source = fs
    .readFileSync(path.join(__dirname, '..', 'strings.ts'), 'utf8')
    .split('\n')
    .filter((line) => !line.trim().startsWith('//')) // skip comments, e.g. the one that states the rule
    .join('\n');
  // Only the quoted texts.
  const texts = (source.match(/"[^"\n]*"|'[^'\n]*'/g) ?? []).join(' ').toLowerCase();
  for (const word of ['safe', 'genuine', 'scam', 'illegal', 'arnaque', 'illégal', 'arnak', 'ilegal', 'sekirite']) {
    expect(texts).not.toContain(word);
  }
});
