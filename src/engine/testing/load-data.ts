/// <reference types="node" />
// Test helper only (never imported by the app): loads A's real data files from disk.
import { readFileSync } from 'fs';
import { join } from 'path';

import { DataSet } from '../index';

const dir = join(__dirname, '../../../app/src/main/assets/data');
const read = (f: string) => readFileSync(join(dir, f), 'utf8');

export function loadRealData(): DataSet {
  return DataSet.fromJson(
    read('agencies.json'),
    read('fee_rules.json'),
    read('banks.json'),
    read('fsc_alerts.json'),
    read('cert_alerts.json'),
  );
}
