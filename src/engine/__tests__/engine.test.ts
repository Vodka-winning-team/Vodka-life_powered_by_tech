// Run with: npm test
// B: replace with real tests (demo messages, A's 15 test cases), ported from DataSetTest.kt.

import { DataSet, Engine } from '../index';

test('stub engine returns NONE', () => {
  const engine = new Engine(DataSet.fromJson('[]', '[]', '[]', '[]', '[]'));
  expect(engine.check('Hello').level).toBe('NONE');
});
