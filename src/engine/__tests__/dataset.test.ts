// Port of DataSetTest.kt: A's real data files (the ones bundled in the app) load and every record has a source.
import { Engine } from '../index';
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
