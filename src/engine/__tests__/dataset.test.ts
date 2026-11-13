// Port of DataSetTest.kt: A's real data files (the ones bundled in the app) load and every record has a source.
import { DataSet, Engine } from '../index';
import { loadRealData } from '../testing/load-data';

test('loads all real records', () => {
  const data = loadRealData();
  expect(data.agencies).toHaveLength(79);
  expect(data.agencies.filter((a) => a.category === 'abroad')).toHaveLength(12);
  expect(data.feeRules.length).toBeGreaterThan(0);
  expect(data.banks.some((b) => b.domains.includes('mcb.mu'))).toBe(true);
  expect(data.fscAlerts.length).toBeGreaterThan(0);
  expect(data.certAlerts.length).toBeGreaterThan(0);
});

test('every record has a source and a date', () => {
  const d = loadRealData();
  const all = [...d.agencies, ...d.feeRules, ...d.banks, ...d.fscAlerts, ...d.certAlerts];
  for (const r of all) {
    expect(r.sourceUrl.startsWith('https://')).toBe(true);
    expect(r.snapshot).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  }
});

test('engine runs on the real data', () => {
  expect(new Engine(loadRealData()).check('Hello').level).toBe('NONE');
});

test('agency phones: optional list, defaults to the main phone, all become contacts', () => {
  const d = loadRealData();
  expect(d.agencies.every((a) => a.phones.length >= 1 && a.phones[0] === a.phone)).toBe(true);
  const row = { id: 'x', name: 'X Ltd', category: 'abroad', phone: '+2301111111', phones: ['+2301111111', '+23052222222'],
    address: '', valid_from: '2026-01-01', expiry: '2029-01-01', page: 1, source_url: 'https://example.org', snapshot: '2026-11-04' };
  const data = DataSet.fromJson(JSON.stringify([row]), '[]', '[]', '[]', '[]');
  const r = new Engine(data, '2026-11-14').check('Job abroad', { agencyId: 'x', costId: null });
  expect(r.contacts.map((c) => c.phone)).toEqual(['+2301111111', '+23052222222']);
});
