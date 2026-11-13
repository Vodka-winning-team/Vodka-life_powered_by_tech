// FraudLens Moris engine (B: Pushkar). Pure TypeScript: no react-native/expo imports, so `npm test` runs it without a phone.
// Port of the Kotlin engine (DataSet.kt, Engine.kt). Same names and behaviour.
//
// How it works: each check below is a small function that returns findings. check() runs them all,
// then the overall level is the worst finding level (STOP > CAREFUL > NONE).
// Adding a check later = adding one more function to the list in check().

import * as Rules from './rules';
import * as Text from './text';
import type {
  Agency,
  Bank,
  CertAlert,
  CheckResult,
  Contact,
  FeeRule,
  Finding,
  FscAlert,
  Highlight,
  JobAnswers,
  Level,
  Source,
} from './types';

export * from './types';

type Row = Record<string, unknown>;

const str = (r: Row, key: string): string => (r[key] === undefined || r[key] === null ? '' : String(r[key]));
const list = (r: Row, key: string): string[] => (Array.isArray(r[key]) ? (r[key] as unknown[]).map(String) : []);
const rows = (text: string): Row[] => JSON.parse(text) as Row[];

/** All official records the engine checks against. The app passes the text of the 5 JSON files. */
export class DataSet {
  constructor(
    public agencies: Agency[],
    public feeRules: FeeRule[],
    public banks: Bank[],
    public fscAlerts: FscAlert[],
    public certAlerts: CertAlert[],
  ) {}

  /** A missing field becomes "" so one bad row never crashes the app; validate.py catches it at build time. */
  static fromJson(agencies: string, feeRules: string, banks: string, fscAlerts: string, certAlerts: string): DataSet {
    return new DataSet(
      rows(agencies).map((r) => ({
        id: str(r, 'id'), name: str(r, 'name'), category: str(r, 'category'), phone: str(r, 'phone'),
        address: str(r, 'address'), validFrom: str(r, 'valid_from'), expiry: str(r, 'expiry'),
        page: Number(r.page) || 0, sourceUrl: str(r, 'source_url'), snapshot: str(r, 'snapshot'),
      })),
      rows(feeRules).map((r) => ({
        id: str(r, 'id'), cost: str(r, 'cost'), wordsEn: list(r, 'words_en'), wordsFr: list(r, 'words_fr'),
        wordsMfe: list(r, 'words_mfe'), payer: str(r, 'payer'), ref: str(r, 'ref'),
        sourceUrl: str(r, 'source_url'), snapshot: str(r, 'snapshot'),
      })),
      rows(banks).map((r) => ({
        id: str(r, 'id'), name: str(r, 'name'), type: str(r, 'type'), keywords: list(r, 'keywords'),
        domains: list(r, 'domains'), phone: str(r, 'phone'), phoneSource: str(r, 'phone_source'),
        sourceUrl: str(r, 'source_url'), snapshot: str(r, 'snapshot'),
      })),
      rows(fscAlerts).map((r) => ({
        id: str(r, 'id'), name: str(r, 'name'), domains: list(r, 'domains'), alertDate: str(r, 'alert_date'),
        alertUrl: str(r, 'alert_url'), sourceUrl: str(r, 'source_url'), snapshot: str(r, 'snapshot'),
      })),
      rows(certAlerts).map((r) => ({
        id: str(r, 'id'), campaign: str(r, 'campaign'), phrases: list(r, 'phrases'), alertDate: str(r, 'alert_date'),
        alertUrl: str(r, 'alert_url'), sourceUrl: str(r, 'source_url'), snapshot: str(r, 'snapshot'),
      })),
    );
  }
}

/** The message, read once: original text, normalised text, links, amounts, phones, banks named. */
type Message = {
  original: string;
  norm: string;
  links: Text.Link[];
  amounts: Highlight[];
  phones: Text.Phone[];
  banksNamed: Bank[];
  isJob: boolean;
};

const LEVEL_ORDER: Record<Level, number> = { STOP: 0, CAREFUL: 1, NONE: 2 };

/** Today as YYYY-MM-DD in local time (dates in the data are ISO strings, so they compare as text). */
function todayIso(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Checks a message against the rules and the official records. Runs on the phone, offline. */
export class Engine {
  /** `today` (YYYY-MM-DD) is a parameter only so tests can fix the date; the app uses the default. */
  constructor(
    public data: DataSet,
    private today: string = todayIso(),
  ) {}

  check(text: string, job: JobAnswers | null = null): CheckResult {
    const m = this.read(text);
    const findings: Finding[] = [];
    const contacts: Contact[] = [];

    findings.push(...this.codeRequestCheck(m));
    findings.push(...this.bankLinkCheck(m, contacts));
    findings.push(...this.fscCheck(m));
    findings.push(...this.jobFeeFromText(m, job));
    if (job) findings.push(...this.jobAnswersCheck(m, job, contacts));
    findings.push(...this.phraseCheck(m, Rules.URGENCY));
    findings.push(...this.paymentRequestCheck(m));
    findings.push(...this.phraseCheck(m, Rules.PRIZE));
    findings.push(...this.phraseCheck(m, Rules.RETURNS));
    findings.push(...this.phraseCheck(m, Rules.NEW_NUMBER));
    findings.push(...this.oddLinkCheck(m));
    findings.push(...this.certCheck(m));

    const level: Level = findings.some((f) => f.level === 'STOP')
      ? 'STOP'
      : findings.some((f) => f.level === 'CAREFUL')
        ? 'CAREFUL'
        : 'NONE';
    const sorted = [...findings].sort((a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level]);
    const uniqueContacts = contacts.filter((c, i) => contacts.findIndex((o) => o.phone === c.phone) === i);
    return { level, findings: sorted, contacts: uniqueContacts };
  }

  /** Register agencies whose names appear in the message, best match first (for the Job check screen). */
  suggestAgencies(text: string): Agency[] {
    const words = Agencies.words(text);
    return this.data.agencies
      .map((a) => ({ a, score: Agencies.matchScore(a.name, words) }))
      .filter((x) => x.score > 0)
      .sort((x, y) => y.score - x.score)
      .map((x) => x.a);
  }

  // ---------------------------------------------------------------- the checks

  private read(original: string): Message {
    const norm = Text.normalise(original);
    const links = Text.links(original);
    // Banks named in the text, or hidden in a link (mcb-login-secure.net names MCB).
    // Everyday words used as bank keywords ("juice" for MCB Juice) only count next to banking words,
    // so "fresh orange juice" is not MCB, but "your Juice account" is.
    const hasBankContext = (near: Highlight) =>
      Text.findAny(norm, Rules.BANK_CONTEXT).some((c) => c.start - 40 < near.end && near.start < c.end + 40);
    const keywordHits = (k: string) => {
      const hits = Text.findPhrase(norm, k);
      return Rules.EVERYDAY_BANK_KEYWORDS.includes(k) ? hits.filter(hasBankContext) : hits;
    };
    const banksNamed = this.data.banks.filter(
      (bank) =>
        bank.keywords.some((k) => keywordHits(k).length > 0) ||
        links.some((link) =>
          bank.keywords.some(
            (k) =>
              k.length >= 3 &&
              !Rules.EVERYDAY_BANK_KEYWORDS.includes(k) &&
              link.host.replace(/-/g, '').includes(k.replace(/ /g, '')),
          ),
        ),
    );
    return {
      original,
      norm,
      links,
      amounts: Text.amounts(original),
      phones: Text.phones(original),
      banksNamed,
      isJob: Text.findAny(norm, Rules.JOB_CONTEXT).length > 0,
    };
  }

  private codeRequestCheck(m: Message): Finding[] {
    const hits = Rules.codeRequests(m.norm);
    if (hits.length === 0) return [];
    return [{
      kind: 'code_request', level: 'STOP',
      title: 'Asks for a code, PIN or password',
      detail: 'Banks and real companies never ask you to send a code, PIN or password. Never share it.',
      highlights: hits, source: null,
    }];
  }

  /** A bank is named, and a link in the message is not one of that bank's official websites. */
  private bankLinkCheck(m: Message, contacts: Contact[]): Finding[] {
    const out: Finding[] = [];
    const alarm = Text.findAny(m.norm, Rules.BANK_ALARM.phrases).length > 0;
    const codeRequest = Rules.codeRequests(m.norm).length > 0;
    for (const bank of m.banksNamed) {
      const source = bankSource(bank);
      const bad = m.links.filter((link) => !bank.domains.some((d) => Text.hostIsDomain(link.host, d)));
      if (bad.length > 0) {
        out.push({
          kind: 'bank_link', level: 'STOP',
          title: `Link is not ${bank.name}'s official website`,
          detail:
            `The official website of ${bank.name} is ${bank.domains.join(' or ')} ` +
            "(Bank of Mauritius list of licensees). Don't open this link. Call the bank on its official number.",
          highlights: bad.map((l) => l.range), source,
        });
      }
      // The message claims to come from the bank (account alarm or a link) and gives another phone number.
      const claimsBank = bad.length > 0 || alarm;
      const official = Text.phoneDigits(bank.phone);
      const otherPhones = claimsBank ? m.phones.filter((p) => p.digits !== official) : [];
      if (otherPhones.length > 0) {
        out.push({
          kind: 'bank_phone', level: 'CAREFUL',
          title: `Number is not ${bank.name}'s official number`,
          detail: `Call ${bank.name} only on its official number ${bank.phone}, never on a number given in a message.`,
          highlights: otherPhones.map((p) => p.range), source,
        });
      }
      if (claimsBank || codeRequest) contacts.push({ name: bank.name, phone: bank.phone, source });
    }
    if (m.banksNamed.length > 0) out.push(...this.phraseCheck(m, Rules.BANK_ALARM));
    return out;
  }

  /** The message names a firm or website the FSC has warned about. */
  private fscCheck(m: Message): Finding[] {
    const out: Finding[] = [];
    for (const alert of this.data.fscAlerts) {
      const byDomain = m.links
        .filter((link) => alert.domains.some((d) => Text.hostIsDomain(link.host, d)))
        .map((l) => l.range);
      const byName = Text.findPhrase(m.norm, Agencies.coreName(alert.name));
      const hits = [...byDomain, ...byName];
      if (hits.length === 0) continue;
      out.push({
        kind: 'fsc_alert', level: 'STOP',
        title: `The FSC warned about ${alert.name}`,
        detail:
          `The Financial Services Commission published a warning about ${alert.name} on ${alert.alertDate}: ` +
          "it is not licensed by the FSC. Don't send money.",
        highlights: hits,
        source: { name: 'FSC investor alert', url: alert.alertUrl, date: alert.alertDate },
      });
    }
    return out;
  }

  /** Job message + a recruitment cost word + a request to pay → the employer should pay this, not the worker. */
  private jobFeeFromText(m: Message, job: JobAnswers | null): Finding[] {
    if (!m.isJob) return [];
    // The cost word must sit close (60 characters) to a request to pay or an amount:
    // "pay the processing fee Rs 50,000" counts; "bring your passport to the interview" does not.
    const money = [...Rules.paymentRequests(m.norm), ...m.amounts];
    if (money.length === 0) return [];
    const nearMoney = (r: Highlight) => money.some((x) => x.start - 60 < r.end && r.start < x.end + 60);
    const out: Finding[] = [];
    for (const rule of this.data.feeRules) {
      if (job?.costId === rule.id) continue; // reported by jobAnswersCheck instead
      const hits = Text.findAny(m.norm, allWords(rule)).filter(nearMoney);
      if (hits.length > 0) out.push(this.feeFinding(rule, hits));
    }
    return out;
  }

  /** The user's answers on the Job check screen: the chosen register agency and the cost they are asked to pay. */
  private jobAnswersCheck(m: Message, job: JobAnswers, contacts: Contact[]): Finding[] {
    const out: Finding[] = [];
    const agency = job.agencyId ? this.data.agencies.find((a) => a.id === job.agencyId) : undefined;
    if (!agency) {
      const first = this.data.agencies[0];
      out.push({
        kind: 'agency_not_found', level: 'CAREFUL',
        title: `Not found in the Ministry list of ${prettyDate(first?.snapshot ?? '')}`,
        detail:
          'Every recruitment agency must hold a licence from the Ministry of Labour. ' +
          "Ask the Ministry's Recruitment Licence Unit (pra@govmu.org) before paying anything.",
        highlights: [], source: first ? agencySource(first) : null,
      });
    } else {
      const source = agencySource(agency);
      contacts.push({ name: agency.name, phone: agency.phone, source });
      const valid = agency.validFrom <= this.today && this.today <= agency.expiry;
      if (!valid) {
        out.push({
          kind: 'agency_expired', level: 'CAREFUL',
          title: `${agency.name}: licence not valid today`,
          detail:
            `The Ministry list records this licence as valid from ${prettyDate(agency.validFrom)} to ` +
            `${prettyDate(agency.expiry)}. Ask the Ministry before paying anything.`,
          highlights: [], source,
        });
      } else if (agency.category !== 'abroad') {
        out.push({
          kind: 'agency_wrong_category', level: 'CAREFUL',
          title: `${agency.name} is listed, but not for jobs abroad`,
          detail:
            `Its licence is for ${Agencies.categoryText(agency.category)}. ` +
            'Only agencies licensed for jobs abroad may recruit you for work overseas.',
          highlights: [], source,
        });
      } else {
        out.push({
          kind: 'agency_listed', level: 'NONE',
          title: `${agency.name} is listed for jobs abroad`,
          detail:
            `Recorded as valid until ${prettyDate(agency.expiry)}. Listed, but this does not prove ` +
            `the message is from them. Call them on the number from the Ministry list: ${agency.phone}.`,
          highlights: [], source,
        });
      }
    }
    const rule = job.costId ? this.data.feeRules.find((r) => r.id === job.costId) : undefined;
    // Highlight the cost words if the message has them.
    if (rule) out.push(this.feeFinding(rule, Text.findAny(m.norm, allWords(rule))));
    return out;
  }

  private feeFinding(rule: FeeRule, hits: Highlight[]): Finding {
    const general = this.data.feeRules.find((r) => r.id === 'any_recruitment_fee');
    const detail =
      rule.id === 'any_recruitment_fee'
        ? `No recruitment agency or employer may charge a worker a fee for recruiting them (${rule.ref}).`
        : `${rule.cost}: paid by the employer, not the worker (${rule.ref}).` +
          (general ? ` No agency or employer may charge a worker a recruitment fee (${general.ref}).` : '');
    return {
      kind: 'job_fee', level: 'STOP',
      title: 'A job cost the employer must pay',
      detail, highlights: hits,
      source: { name: rule.ref, url: rule.sourceUrl, date: rule.snapshot },
    };
  }

  private paymentRequestCheck(m: Message): Finding[] {
    const hits = Rules.paymentRequests(m.norm);
    if (hits.length === 0) return [];
    return [{
      kind: 'payment_request', level: 'CAREFUL',
      title: 'Asks you to pay or send money',
      detail: 'Before paying, check who is really asking, using an official number you find yourself.',
      highlights: [...hits, ...m.amounts], source: null,
    }];
  }

  /** Short links hide where they go; some endings are mostly used by throwaway sites. */
  private oddLinkCheck(m: Message): Finding[] {
    const official = this.data.banks.flatMap((b) => b.domains);
    const odd = m.links.filter(
      (link) =>
        !official.some((d) => Text.hostIsDomain(link.host, d)) &&
        (Rules.SHORTENERS.some((s) => Text.hostIsDomain(link.host, s)) ||
          Rules.RISKY_TLDS.includes(link.host.split('.').pop() ?? '') ||
          /^\d+\.\d+\.\d+\.\d+$/.test(link.host)),
    );
    if (odd.length === 0) return [];
    return [{
      kind: 'odd_link', level: 'CAREFUL',
      title: 'Suspicious link',
      detail: "This link is shortened or uses an unusual web address, so you can't see where it really goes.",
      highlights: odd.map((l) => l.range), source: null,
    }];
  }

  /** Matches a CERT-MU alert: 2 of its phrases, or 1 that is a web or email address quoted in the alert. */
  private certCheck(m: Message): Finding[] {
    const out: Finding[] = [];
    for (const alert of this.data.certAlerts) {
      const hitsByPhrase = alert.phrases
        .map((p) => ({ p, hits: Text.findPhrase(m.norm, p) }))
        .filter((x) => x.hits.length > 0);
      const distinctive = hitsByPhrase.some(
        ({ p }) => p.includes('@') || (p.includes('.') && !p.includes(' ') && /[a-z]/i.test(p)),
      );
      if (hitsByPhrase.length < 2 && !distinctive) continue;
      out.push({
        kind: 'cert_alert', level: 'CAREFUL',
        title: `Matches a CERT-MU alert: ${alert.campaign}`,
        detail: `CERT-MU (the national cybersecurity team) warned about this on ${prettyDate(alert.alertDate)}.`,
        highlights: hitsByPhrase.flatMap((x) => x.hits),
        source: { name: 'CERT-MU security alert', url: alert.alertUrl, date: alert.alertDate },
      });
    }
    return out;
  }

  private phraseCheck(m: Message, rule: Rules.PhraseRule): Finding[] {
    const hits = Text.findAny(m.norm, rule.phrases);
    if (hits.length === 0) return [];
    return [{ kind: rule.kind, level: rule.level, title: rule.title, detail: rule.detail, highlights: hits, source: null }];
  }
}

const allWords = (rule: FeeRule) => [...rule.wordsEn, ...rule.wordsFr, ...rule.wordsMfe];
const bankSource = (bank: Bank): Source => ({ name: 'Bank of Mauritius list of licensees', url: bank.sourceUrl, date: bank.snapshot });
const agencySource = (a: Agency): Source => ({ name: 'Ministry of Labour list of recruitment agencies', url: a.sourceUrl, date: a.snapshot });

/** Agency name matching, tolerant of case, accents, "Ltd" and one-letter typos. */
export const Agencies = {
  IGNORE: new Set(['ltd', 'limited', 'ltee', 'co', 'company', 'the', 'and', 'of', 'mauritius', 'inc']),

  words(text: string): string[] {
    return Text.normalise(text).split(/[^a-z0-9]+/).filter((w) => w.length >= 2);
  },

  /** "STAR NET LIMITED (Starnet Limited)" → "star net"; used for FSC name matching. */
  coreName(name: string): string {
    return Text.normalise(name).split('(')[0].split(/[^a-z0-9.]+/)
      .filter((w) => w.length > 0 && !Agencies.IGNORE.has(w)).join(' ');
  },

  /** 0 = no match; otherwise the number of name words found (every core word of the name must be in the message). */
  matchScore(name: string, messageWords: string[]): number {
    const core = Text.normalise(name).split(/[^a-z0-9]+/).filter((w) => w.length >= 2 && !Agencies.IGNORE.has(w));
    if (core.length === 0) return 0;
    const found = core.filter((w) => messageWords.some((x) => x === w || (w.length >= 5 && oneEditApart(x, w)))).length;
    return found === core.length ? found : 0;
  },

  categoryText(category: string): string {
    if (category === 'local') return 'recruiting citizens for jobs in Mauritius';
    if (category === 'non_citizen') return 'bringing foreign workers into Mauritius';
    if (category === 'abroad') return 'jobs abroad';
    return category;
  },
};

function oneEditApart(a: string, b: string): boolean {
  if (Math.abs(a.length - b.length) > 1) return false;
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { i++; j++; continue; }
    if (++edits > 1) return false;
    if (a.length > b.length) i++;
    else if (a.length < b.length) j++;
    else { i++; j++; }
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "2026-11-04" → "4 Nov 2026" */
export function prettyDate(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!m) return iso;
  return `${Number(m[3])} ${MONTHS[Number(m[2]) - 1]} ${m[1]}`;
}
