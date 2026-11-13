// The contract between Engine (B) and App (C): docs/TASKS.md §2.
// TypeScript port of engine/src/main/kotlin/.../Model.kt. Same names, camelCase fields.
// Pure TypeScript: no React Native imports anywhere in src/engine/, so `npm test` runs it without a phone.

/** STOP = "Stop – high risk", CAREFUL = "Be careful – verify", NONE = "No warning signs found – still verify". */
export type Level = 'STOP' | 'CAREFUL' | 'NONE';

/** Where a finding comes from: an official record, with its date. */
export type Source = { name: string; url: string; date: string };

/**
 * A span of the original message to mark in the X-Ray.
 * start is included, end is NOT included (like text.slice(start, end)).
 * Kotlin used IntRange (end included); here end = Kotlin's last + 1.
 */
export type Highlight = { start: number; end: number };

/**
 * One reason shown on the Result screen.
 * kind: fixed key ("job_fee", "code_request", "bank_link"...) so the app can translate the title.
 */
export type Finding = {
  kind: string;
  level: Level;
  title: string;
  detail: string;
  highlights: Highlight[];
  source: Source | null;
  /** Values used in title/detail (name, phone, date, ref...), so the app can build French/Kreol texts by `kind`. Optional. */
  vars?: Record<string, string>;
};

/** An official number to call. Never a number taken from the message. */
export type Contact = { name: string; phone: string; source: Source };

export type CheckResult = { level: Level; findings: Finding[]; contacts: Contact[] };

/** The user's answers on the Job check screen: which register agency, which cost they are asked to pay. */
export type JobAnswers = { agencyId: string | null; costId: string | null };

// ---- Records loaded from A's data files (app/src/main/assets/data/) ----

export type Agency = {
  id: string;
  name: string;
  category: string; // "abroad" | "local" | "non_citizen"
  phone: string;
  /** All register numbers (first = `phone`). Optional in the data file; defaults to [phone]. */
  phones: string[];
  address: string;
  validFrom: string; // YYYY-MM-DD
  expiry: string; // YYYY-MM-DD
  page: number;
  sourceUrl: string;
  snapshot: string;
};

export type FeeRule = {
  id: string;
  cost: string;
  wordsEn: string[];
  wordsFr: string[];
  wordsMfe: string[];
  payer: string;
  ref: string;
  sourceUrl: string;
  snapshot: string;
};

export type Bank = {
  id: string;
  name: string;
  type: string; // "bank" | "psp"
  keywords: string[];
  domains: string[];
  phone: string;
  phoneSource: string;
  sourceUrl: string;
  snapshot: string;
};

export type FscAlert = {
  id: string;
  name: string;
  domains: string[];
  alertDate: string;
  alertUrl: string;
  sourceUrl: string;
  snapshot: string;
};

export type CertAlert = {
  id: string;
  campaign: string;
  phrases: string[];
  alertDate: string;
  alertUrl: string;
  sourceUrl: string;
  snapshot: string;
};

/**
 * One entry on the "Official numbers" screen (Adiyen's 22:47 request): an agency licence or a bank / payment app,
 * with every official number we have and where it comes from. Being listed never proves a message is from them.
 */
export type OfficialEntry = {
  type: 'agency' | 'bank' | 'psp';
  id: string;
  name: string;
  /** Agencies: "abroad" | "local" | "non_citizen". Banks: "bank" | "psp". */
  category: string;
  /** One readable line, e.g. "Licensed for jobs abroad · valid until 21 Apr 2029" or "Bank". */
  detail: string;
  /** Agencies only: does the recorded validity cover today? */
  validNow: boolean | null;
  /** Raw numbers as stored (the app formats them for reading; dial them as they are). */
  phones: string[];
  source: Source;
};

/**
 * Result of officialNumbers(query). `matchedBy` tells the app which card to show:
 * 'number' → the query was a phone number: show the "listed as … official number" card + the caller-ID warning,
 *            or, with no results, the "not in our official lists" card;
 * 'name'   → name search; 'all' → empty query (everything, A to Z).
 */
export type OfficialNumbers = {
  agencies: OfficialEntry[];
  banks: OfficialEntry[];
  matchedBy: 'all' | 'name' | 'number';
  /** For a number search: the number as the app should show it back ("+230 5256 8074", "8971"). */
  number: string | null;
};
