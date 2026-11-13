// ALL text shown in the app lives here. English first; A fills French (fr) and Kreol (mfe) later.
// A missing fr/mfe text falls back to English.
// Wording rule: never "safe", "genuine", "scam" or "illegal" in any language.

const en = {
  appName: 'FraudLens Moris',
  tagline: 'Verifye avan ou peye: check before you pay',

  scanTitle: 'Check a message',
  scanHint: 'Paste a suspicious SMS, WhatsApp or email below. Nothing leaves your phone.',
  scanPlaceholder: 'Paste the message here',
  scanButton: 'Check message',
  scanEmpty: 'Paste a message first.',
  openHistory: 'History',
  openSources: 'Our sources',

  levelSTOP: 'Stop – high risk',
  levelCAREFUL: 'Be careful – verify',
  levelNONE: 'No warning signs found – still verify',

  resultTitle: 'Result',
  resultMessage: 'The message',
  resultFindings: 'What we found',
  resultNoFindings: 'No warning signs found in our rules and official lists. Still call the official number before you pay.',
  resultJobButton: 'Job offer? Check the agency',
  resultActionsButton: 'What to do now',
  resultSave: 'Save to history',
  resultSaved: 'Saved',
  sourceLabel: 'Source',

  jobTitle: 'Job check',
  jobAgencyLabel: '1. Which agency is it?',
  jobSuggested: 'Found in the message',
  jobSearch: 'Search the Ministry register',
  jobNoAgency: 'No agency picked',
  jobCostLabel: '2. What are they asking you to pay for?',
  jobCheckButton: 'Check again',

  actionsTitle: 'What to do now',
  actionsCall: 'Call the official number',
  actionsCallHint: 'Use this number, never the one in the message.',
  actionsNoContacts: 'No official number for this message yet.',
  actionsShare: 'Ask someone you trust',
  actionsShareButton: 'Share a summary',
  actionsReport: 'Report it',
  reportMaucors: 'MAUCORS (online report to CERT-MU and the police)',
  reportMinistry: 'Ministry of Labour, recruitment agencies (pra@govmu.org)',

  historyTitle: 'History',
  historyEmpty: 'Nothing saved yet. Tap "Save to history" on a result.',
  historyClear: 'Clear history',

  sourcesTitle: 'Our sources',
  sourcesHint: 'Every check uses these official records, bundled in the app.',
  sourcesRecords: 'records',
  sourcesChecked: 'checked',

  sampleButton: 'Try a sample message (fictional)',
};

export type StringKey = keyof typeof en;
export type Language = 'en' | 'fr' | 'mfe';

const fr: Partial<Record<StringKey, string>> = {};
const mfe: Partial<Record<StringKey, string>> = {};

const all = { en, fr, mfe };

// TODO(C, 03:00): language switch in the app. For now, English.
let current: Language = 'en';

export function setLanguage(language: Language) {
  current = language;
}

export function t(key: StringKey): string {
  return all[current][key] ?? en[key];
}
