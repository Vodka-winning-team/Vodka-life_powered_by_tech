import * as fs from 'fs';
import * as path from 'path';

import { costName, findingDetail, findingTitle, setLanguage, t } from '../strings';

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
  const source = ['strings.ts', 'finding-texts.ts']
    .map((file) => fs.readFileSync(path.join(__dirname, '..', file), 'utf8'))
    .join('\n')
    .split('\n')
    .filter((line) => !line.trim().startsWith('//')) // skip comments, e.g. the one that states the rule
    .join('\n');
  // Only the quoted texts.
  const texts = (source.match(/"[^"\n]*"|'[^'\n]*'/g) ?? []).join(' ').toLowerCase();
  for (const word of ['safe', 'genuine', 'scam', 'illegal', 'arnaque', 'illégal', 'arnak', 'ilegal', 'sekirite']) {
    expect(texts).not.toContain(word);
  }
});

test('finding details are translated with the engine vars, and fall back to English', () => {
  const jobFee = {
    kind: 'job_fee',
    detail: 'English detail',
    vars: { cost: 'Processing fee', ref: 'Regs 2025, reg 7(2)(e)', generalRef: 'Act 2023, s.5(1)' },
  };
  setLanguage('fr');
  expect(findingDetail(jobFee)).toBe(
    "Frais de dossier : payé par l'employeur, pas par le travailleur (Regs 2025, reg 7(2)(e)). Aucune agence ni aucun employeur ne peut faire payer des frais de recrutement à un travailleur (Act 2023, s.5(1)).",
  );
  // French month names
  expect(findingDetail({ kind: 'cert_alert', detail: 'x', vars: { date: '30 Oct 2026' } })).toContain('le 30 oct. 2026');
  // missing value or unknown kind → English
  expect(findingDetail({ kind: 'bank_link', detail: 'English detail', vars: { name: 'MCB' } })).toBe('English detail');
  expect(findingDetail({ kind: 'something_new', detail: 'English detail' })).toBe('English detail');

  setLanguage('mfe');
  expect(costName('processing', 'Processing fee')).toBe('Fre dosie');
  expect(findingDetail({ kind: 'agency_wrong_category', detail: 'x', vars: { name: 'A', category: 'local' } })).toContain('rekrit Morisien pou travay Moris');
});
