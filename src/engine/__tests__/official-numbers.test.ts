// "Official numbers" screen (Adiyen's 22:47 request): search every agency licence and bank by name.
import { Engine } from '../index';
import { loadRealData } from '../testing/load-data';

const engine = new Engine(loadRealData(), '2026-11-14');
const digits = (s: string) => s.replace(/\D/g, '');

test('empty search lists everything: 79 agency licences and 21 banks / payment apps', () => {
  const all = engine.officialNumbers('');
  expect(all.agencies).toHaveLength(79);
  expect(all.banks).toHaveLength(21);
  expect(all.agencies.reduce((n, a) => n + a.phones.length, 0)).toBeGreaterThanOrEqual(175);
});

test('part of an agency name, any case, finds it with all its register numbers and page', () => {
  const r = engine.officialNumbers('think recr');
  expect(r.agencies[0].name).toBe('THINK RECRUITMENT LTD');
  expect(r.agencies[0].phones.map(digits)).toEqual(expect.arrayContaining(['23052568074', '2304877890']));
  expect(r.agencies[0].detail).toBe('Licensed for jobs abroad · valid until 21 Apr 2029');
  expect(r.agencies[0].source.name).toMatch(/page \d+/);
  expect(r.banks).toHaveLength(0);
});

test('one typo still finds it ("recruitmnet")', () => {
  expect(engine.officialNumbers('think recruitmnet').agencies[0].name).toBe('THINK RECRUITMENT LTD');
});

test('an agency with two licences shows both, each with its licence type', () => {
  const talent = engine.officialNumbers('talent lab').agencies.filter((a) => a.name.toUpperCase() === 'TALENT LAB LTD');
  expect(talent.map((a) => a.category).sort()).toEqual(['local', 'non_citizen']);
});

test('banks: by name or by app name, with the number from the bank website', () => {
  const mcb = engine.officialNumbers('juice').banks;
  expect(mcb[0].id).toBe('mcb');
  expect(digits(mcb[0].phones[0])).toBe('2302026060');
  expect(mcb[0].source.url).toContain('mcb.mu');
  expect(engine.officialNumbers('blink').banks[0].type).toBe('psp');
  expect(engine.officialNumbers('SBM').banks[0].id).toBe('sbm');
});

test('no match, nonsense or wrong input → empty lists, never a crash', () => {
  for (const q of ['zzzzqqq', '🙂', '((', null as unknown as string, 42 as unknown as string]) {
    const r = engine.officialNumbers(q);
    expect(Array.isArray(r.agencies) && Array.isArray(r.banks)).toBe(true);
  }
  expect(engine.officialNumbers('zzzzqqq')).toEqual({ agencies: [], banks: [], matchedBy: 'name', number: null });
});

test('an expired licence says so instead of "valid until"', () => {
  const later = new Engine(loadRealData(), '2030-01-01');
  expect(later.officialNumbers('think recruitment').agencies[0].detail).toContain('not today');
});

test('wording rule: no safe / genuine / scam / illegal in any entry', () => {
  const all = engine.officialNumbers('');
  for (const e of [...all.agencies, ...all.banks]) expect(`${e.name} ${e.detail}`).not.toMatch(/\b(safe|genuine|scams?|illegal)\b/i);
});

describe('"Is this number official?" (Adiyen 02:26): a number in the search box is matched by number', () => {
  const ids = (q: string) => {
    const r = engine.officialNumbers(q);
    return { matchedBy: r.matchedBy, agencies: r.agencies.map((a) => a.name), banks: r.banks.map((b) => b.id) };
  };

  test('"5256 8074" → THINK RECRUITMENT LTD (abroad)', () => {
    const r = engine.officialNumbers('5256 8074');
    expect(r.matchedBy).toBe('number');
    expect(r.number).toBe('+230 5256 8074');
    expect(r.agencies.map((a) => [a.name, a.category])).toEqual([['THINK RECRUITMENT LTD', 'abroad']]);
    expect(r.banks).toHaveLength(0);
  });

  test('"+230 202 6060" and "00230-202-6060" → MCB', () => {
    expect(ids('+230 202 6060')).toEqual({ matchedBy: 'number', agencies: [], banks: ['mcb'] });
    expect(ids('00230-202-6060').banks).toEqual(['mcb']);
    expect(ids('(230) 2026060').banks).toEqual(['mcb']);
  });

  test('short code "8971" → Emtel MFS (blink)', () => {
    expect(ids('8971')).toEqual({ matchedBy: 'number', agencies: [], banks: ['emtel_mfs'] });
  });

  test('"4637800" → EMPLOYMENT PRO LIMITED, every licence that lists it', () => {
    const r = ids('4637800');
    expect(r.agencies.length).toBeGreaterThanOrEqual(1);
    expect(new Set(r.agencies)).toEqual(new Set(['EMPLOYMENT PRO LIMITED']));
    expect(r.agencies.length).toBe(engine.officialNumbers('').agencies
      .filter((a) => a.name === 'EMPLOYMENT PRO LIMITED' && a.phones.some((p) => p.replace(/\D/g, '').endsWith('4637800'))).length);
  });

  test('a number not in our lists → nothing, but still a number search (app shows "not in our official lists")', () => {
    expect(engine.officialNumbers('5999 9999')).toEqual({ agencies: [], banks: [], matchedBy: 'number', number: '+230 5999 9999' });
  });

  test('names still search by name; text with letters is never a number search', () => {
    expect(engine.officialNumbers('think').matchedBy).toBe('name');
    expect(engine.officialNumbers('').matchedBy).toBe('all');
    expect(engine.officialNumbers('MCB 202').matchedBy).toBe('name');
    expect(engine.officialNumbers('12').matchedBy).toBe('name'); // too short to be a number
  });
});
