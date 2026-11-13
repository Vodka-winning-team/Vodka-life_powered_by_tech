// STUB written by C so the screens can be wired. B (Pushkar) owns this folder and replaces it:
// port DataSet.kt and Engine.kt from engine/src/main/kotlin/ to TypeScript here.
// Keep these exact signatures: the app already calls them.

import type {
  Agency,
  Bank,
  CertAlert,
  CheckResult,
  FeeRule,
  FscAlert,
  JobAnswers,
} from './types';

export * from './types';

/** All official records the engine checks against. */
export class DataSet {
  constructor(
    public agencies: Agency[],
    public feeRules: FeeRule[],
    public banks: Bank[],
    public fscAlerts: FscAlert[],
    public certAlerts: CertAlert[],
  ) {}

  /** Takes the text of the 5 JSON files. TODO(B): parse each file and map snake_case to camelCase. */
  static fromJson(
    agencies: string,
    feeRules: string,
    banks: string,
    fscAlerts: string,
    certAlerts: string,
  ): DataSet {
    return new DataSet([], [], [], [], []);
  }
}

/** Checks a message against the rules and the official records. Runs on the phone, offline. */
export class Engine {
  constructor(public data: DataSet) {}

  /** TODO(B): the real checks. Stub: always NONE. */
  check(text: string, job: JobAnswers | null = null): CheckResult {
    return { level: 'NONE', findings: [], contacts: [] };
  }

  /** TODO(B): register agencies whose names appear in the message. Stub: none. */
  suggestAgencies(text: string): Agency[] {
    return [];
  }
}
