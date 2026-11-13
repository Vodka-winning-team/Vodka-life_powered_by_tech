/// <reference types="node" />
// Keeps the stage demo honest: reads docs/demo-messages.md (Adiyen) and checks every demo text gives the expected result.
// If someone edits a demo text in the doc, this test runs the new text.
import { readFileSync } from 'fs';
import { join } from 'path';

import { Engine } from '../index';
import { loadRealData } from '../testing/load-data';

const doc = readFileSync(join(__dirname, '../../../docs/demo-messages.md'), 'utf8');
const quoteAfter = (heading: string) => {
  const part = doc.split(heading)[1] ?? '';
  const line = part.split('\n').find((l) => l.startsWith('> '));
  return line ? line.slice(2).trim() : '';
};
const engine = new Engine(loadRealData(), '2026-11-14');
const digits = (s: string) => s.replace(/\D/g, '');
const think = 'abroad-think-recruitment-ltd';

test('demo step 1: job offer + job check → STOP, register number, agency suggested', () => {
  const text = quoteAfter('## 1.');
  expect(text).toContain('THINK RECRUITMENT LTD');
  expect(engine.suggestAgencies(text)[0].id).toBe(think);
  const r = engine.check(text, { agencyId: think, costId: 'processing' });
  expect(r.level).toBe('STOP');
  expect(r.findings.some((f) => f.kind === 'agency_listed' && f.detail.includes('does not prove'))).toBe(true);
  expect(r.findings.find((f) => f.kind === 'job_fee')!.detail).toContain('reg 7(2)(e)');
  expect(r.contacts.some((c) => digits(c.phone) === '23052568074')).toBe(true);
});

test('demo step 3: follow-up air ticket → STOP, reg 7(2)(a)', () => {
  const r = engine.check(quoteAfter('## 3.'), { agencyId: think, costId: 'air_ticket' });
  expect(r.level).toBe('STOP');
  expect(r.findings.find((f) => f.kind === 'job_fee')!.detail).toContain('reg 7(2)(a)');
});

test('demo step 4: MCB lookalike link → STOP, MCB official number', () => {
  const r = engine.check(quoteAfter('## 4.'));
  expect(r.level).toBe('STOP');
  expect(r.findings.some((f) => f.kind === 'bank_link')).toBe(true);
  expect(r.contacts.some((c) => digits(c.phone) === '2302026060')).toBe(true);
});

test('demo step 5: real bank code SMS → NONE with no findings', () => {
  const r = engine.check(quoteAfter('## 5.'));
  expect(r.level).toBe('NONE');
  expect(r.findings).toHaveLength(0);
});
