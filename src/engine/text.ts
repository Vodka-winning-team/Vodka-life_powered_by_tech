// Text helpers (port of Text.kt). Key idea: normalise() keeps exactly ONE output character per input
// character, so a match found in the normalised text has the same positions in the original message.
// That is how the X-Ray highlights land on the right words.

import type { Highlight } from './types';

const COMBINING = /\p{M}/u;
const WORD_CHAR = /[\p{L}\p{N}]/u;

/** Lowercase, accents removed (é → e), curly quotes straightened. Same length as the input. */
export function normalise(text: string): string {
  let out = '';
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '’' || c === '‘' || c === '`') {
      out += "'";
      continue;
    }
    const base = [...c.normalize('NFD')].find((ch) => !COMBINING.test(ch)) ?? c;
    out += base.toLowerCase()[0] ?? c; // one character in, one character out
  }
  return out;
}

const isWordChar = (c: string | undefined) => c !== undefined && WORD_CHAR.test(c);

export function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Every whole-word occurrence of `phrase` in already-normalised `norm`. */
export function findPhrase(norm: string, phrase: string): Highlight[] {
  const p = normalise(phrase).trim();
  if (p.length === 0) return [];
  const hits: Highlight[] = [];
  let from = 0;
  while (true) {
    const i = norm.indexOf(p, from);
    if (i < 0) break;
    const end = i + p.length; // not included
    const okStart = i === 0 || !isWordChar(norm[i - 1]) || !isWordChar(p[0]);
    const okEnd = end === norm.length || !isWordChar(norm[end]) || !isWordChar(p[p.length - 1]);
    if (okStart && okEnd) hits.push({ start: i, end });
    from = i + 1;
  }
  return hits;
}

/** All whole-word hits for a list of phrases. */
export function findAny(norm: string, phrases: string[]): Highlight[] {
  return phrases.flatMap((p) => findPhrase(norm, p));
}

/** All matches of a global regex as highlights (plus the match start, used by the rules). */
export function allMatches(re: RegExp, text: string): RegExpExecArray[] {
  const g = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g');
  const out: RegExpExecArray[] = [];
  let m: RegExpExecArray | null;
  while ((m = g.exec(text)) !== null) {
    out.push(m);
    if (m[0].length === 0) g.lastIndex++;
  }
  return out;
}

// ---- Things we pull out of a message ----

/** A link found in the message: where it is, and its host name without "www.". */
export type Link = { range: Highlight; host: string };

const TLDS =
  'com|net|org|mu|info|xyz|top|cam|click|co|uk|io|app|link|site|online|live|me|biz|cc|ly|gl|in|fr|us|tk|ml|ga|cf|gq|shop|store|vip|win|bid|loan|work';
const LINK = new RegExp(
  `\\b(?:https?://)?(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+(?:${TLDS})\\b(?:[/?#][^\\s]*)?`,
  'gi',
);

export function links(original: string): Link[] {
  const out: Link[] = [];
  for (const m of allMatches(LINK, original)) {
    if (m.index > 0 && original[m.index - 1] === '@') continue; // part of an email address
    const raw = m[0].replace(/[.,)!?;:"']+$/, '');
    const range = { start: m.index, end: m.index + raw.length };
    const host = raw
      .toLowerCase()
      .replace(/^https?:\/\//, '')
      .split(/[/?#:]/)[0]
      .replace(/^www\./, '');
    out.push({ range, host });
  }
  return out;
}

/** True if `host` is `domain` itself or one of its sub-domains (so mcb.mu.evil.com is NOT mcb.mu). */
export function hostIsDomain(host: string, domain: string): boolean {
  const d = domain.toLowerCase().replace(/^www\./, '');
  return host === d || host.endsWith('.' + d);
}

/** Money amounts such as "Rs 50,000", "Rs50000", "MUR 1,500", "30 000 roupies". */
const AMOUNT =
  /(?:\b(?:rs|mur|roupi|rupees?)\.?\s?\d[\d,.\s]*\d|\b(?:rs|mur)\.?\s?\d|\b\d[\d,.\s]*\s?(?:rs|roupies|roupi|rupees|mur)\b)/gi;

export function amounts(original: string): Highlight[] {
  return allMatches(AMOUNT, original).map((m) => ({ start: m.index, end: m.index + m[0].length }));
}

/** Phone numbers: Mauritian mobile (5xxx xxxx) or landline (xxx xxxx), with or without +230. */
const PHONE = /(?:\+?230[\s-]?)?(?:5\d{3}[\s-]?\d{4}|\d{3}[\s-]?\d{4})/g;

export type Phone = { range: Highlight; digits: string };

export function phones(original: string): Phone[] {
  const out: Phone[] = [];
  for (const m of allMatches(PHONE, original)) {
    const end = m.index + m[0].length;
    const digitBefore = m.index > 0 && /\d/.test(original[m.index - 1]);
    const digitAfter = end < original.length && /\d/.test(original[end]);
    if (digitBefore || digitAfter) continue;
    out.push({ range: { start: m.index, end }, digits: phoneDigits(m[0]).slice(-8) });
  }
  return out;
}

/** Official phone in the data file → digits only, without the country code. */
export function phoneDigits(phone: string): string {
  return phone.replace(/\D/g, '').replace(/^230/, '');
}
