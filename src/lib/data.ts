// Loads A's 5 official data files (bundled in the app, so it works offline) and builds the engine.

import type { StringKey } from '@/constants/strings';
import { DataSet, Engine } from '@/engine';

const agencies = require('../../app/src/main/assets/data/agencies.json');
const feeRules = require('../../app/src/main/assets/data/fee_rules.json');
const banks = require('../../app/src/main/assets/data/banks.json');
const fscAlerts = require('../../app/src/main/assets/data/fsc_alerts.json');
const certAlerts = require('../../app/src/main/assets/data/cert_alerts.json');

// The contract takes the files as text (so downloaded updates can use the same path later).
const dataSet = DataSet.fromJson(
  JSON.stringify(agencies),
  JSON.stringify(feeRules),
  JSON.stringify(banks),
  JSON.stringify(fscAlerts),
  JSON.stringify(certAlerts),
);

export const engine = new Engine(dataSet);

/** One line on the "Our sources" screen. Read from the raw files, so it works even before B's parser. */
export type SourceInfo = { title: StringKey; text: StringKey; count: number; snapshot: string; url: string };

type Row = { snapshot?: string; source_url?: string };

function describe(title: StringKey, text: StringKey, rows: Row[]): SourceInfo {
  const first = rows[0] ?? {};
  return {
    title,
    text,
    count: rows.length,
    snapshot: first.snapshot ?? '',
    url: first.source_url ?? '',
  };
}

// The sentences come from A's docs/sources.md ("Text for the Our sources screen").
export const sources: SourceInfo[] = [
  describe('srcAgenciesTitle', 'srcAgenciesText', agencies),
  describe('srcFeesTitle', 'srcFeesText', feeRules),
  describe('srcBanksTitle', 'srcBanksText', banks),
  describe('srcFscTitle', 'srcFscText', fscAlerts),
  describe('srcCertTitle', 'srcCertText', certAlerts),
];
