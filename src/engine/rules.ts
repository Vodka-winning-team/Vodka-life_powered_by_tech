// The X-Ray warning signs (port of Rules.kt): plain word lists in English, French and Kreol.
// Each rule = a fixed kind, a level, a one-line title and reason, and the phrases that trigger it.
// To add a phrase, add it to the right list; matching is whole-word, case- and accent-insensitive.

import { allMatches, escapeRe, findPhrase } from './text';
import type { Highlight, Level } from './types';

export type PhraseRule = { kind: string; level: Level; title: string; detail: string; phrases: string[] };

export const URGENCY: PhraseRule = {
  kind: 'urgency',
  level: 'CAREFUL',
  title: 'Pressure to act fast',
  detail: "Scammers rush you so you don't stop to check. A real organisation gives you time.",
  phrases: [
    'urgent', 'urgently', 'immediately', 'right now', 'act now', 'today only', 'pay today', 'within 24 hours',
    'within 24h', 'within 48 hours', 'last chance', 'last day', 'expires today', "before it's too late", 'asap',
    'urgence', 'immediatement', "aujourd'hui", 'dans les 24 heures', 'sous 24h', 'derniere chance', 'tout de suite',
    'irzan', 'zordi mem', 'deswit', 'tousuit', 'vit vit', 'dernie sans', 'avan ki tro tar',
  ],
};

export const PRIZE: PhraseRule = {
  kind: 'prize_gift',
  level: 'CAREFUL',
  title: 'Prize, gift or bonus',
  detail: "Unexpected prizes and gifts are a common way to get your details or a 'fee'.",
  phrases: [
    'you have won', "you've won", 'you won', 'won a prize', 'winner', 'lucky draw', 'cash gift', 'free gift',
    'claim your prize', 'claim your reward', 'reward', 'bonus', 'congratulations',
    'vous avez gagne', 'gagnant', 'felicitations', 'cadeau', 'tirage au sort', 'recompense',
    'gagn enn pri', 'gagne enn pri', 'gagn enn lot', 'gagne enn lot', 'kado', 'lot gagnan', 'tiraz o sor',
  ],
};

export const BANK_ALARM: PhraseRule = {
  kind: 'bank_alarm',
  level: 'CAREFUL',
  title: 'Alarm about your account',
  detail: 'Messages saying your account or card is blocked are a classic way to pose as a bank.',
  phrases: [
    'account blocked', 'account has been blocked', 'account suspended', 'account will be blocked',
    'card blocked', 'card has been blocked', 'unusual activity', 'suspicious activity', 'unusual login',
    'verify your account', 'verify your details', 'confirm your details', 'update your details',
    'it will be blocked', 'will be suspended',
    'compte bloque', 'compte suspendu', 'carte bloquee', 'activite suspecte', 'verifiez votre compte',
    'confirmez vos informations', 'a ete suspendu', 'a ete bloque', 'a ete bloquee',
    'kont bloke', 'kont inn bloke', 'kart bloke', 'kart inn bloke', 'inn bloke', 'verifye ou kont', 'konfirm ou detay',
  ],
};

export const RETURNS: PhraseRule = {
  kind: 'guaranteed_returns',
  level: 'CAREFUL',
  title: 'Promise of guaranteed profit',
  detail: 'No real investment can guarantee profit. Investment firms must be licensed by the FSC.',
  phrases: [
    'guaranteed profit', 'guaranteed return', 'guaranteed returns', 'guaranteed income', 'double your money',
    'risk free', 'risk-free', 'no risk', '% per day', '% daily', '% per week', 'passive income',
    'rendement garanti', 'profit garanti', 'gain garanti', 'doublez votre argent', 'sans risque',
    'benefis garanti', 'fer ou larzan double', 'pena risk',
  ],
};

export const NEW_NUMBER: PhraseRule = {
  kind: 'new_number',
  level: 'CAREFUL',
  title: 'Says they have a new number',
  detail: '"I lost my phone, this is my new number" is a common trick. Call the person on the number you already have.',
  phrases: [
    'my new number', 'new number', 'new phone number', 'changed my number', 'lost my phone',
    'mon nouveau numero', 'nouveau numero', "j'ai perdu mon telephone", "j'ai change de numero",
    'mo nouvo nimero', 'nouvo nimero', 'mo finn perdi mo telefonn', 'perdi mo telefonn', 'sanz mo nimero',
  ],
};

/** Bank keywords that are also everyday words: they only name the bank when a banking word is within 40 characters. */
export const EVERYDAY_BANK_KEYWORDS = ['juice'];

/** Banking words that make an everyday keyword ("juice") mean the bank's app. */
export const BANK_CONTEXT = [
  'account', 'card', 'code', 'otp', 'pin', 'login', 'log in', 'verify', 'verification', 'wallet', 'payment', 'transfer',
  'app', 'bank', 'blocked', 'suspended', 'mcb', 'password',
  'compte', 'carte', 'virement', 'paiement', 'banque', 'bloque',
  'kont', 'kart', 'transfer larzan', 'bloke', 'labank',
];

export const SHORTENERS =['bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'is.gd', 'cutt.ly', 'shorturl.at', 'rb.gy', 'ow.ly', 'tiny.cc'];
export const RISKY_TLDS = ['xyz', 'top', 'cam', 'click', 'tk', 'ml', 'ga', 'cf', 'gq', 'vip', 'win', 'bid', 'loan', 'work', 'live'];

/** Words showing the message is about a job, used to decide when fee words mean a recruitment fee. */
export const JOB_CONTEXT = [
  'job', 'jobs', 'work abroad', 'work in', 'vacancy', 'vacancies', 'recruitment', 'recruiting', 'recruiter',
  'hiring', 'employment', 'employer', 'work contract', 'job offer', 'salary', 'position', 'agency',
  'emploi', 'travail', 'travailler', 'candidature', 'recrute', 'poste', 'recrutement', 'embauche', "offre d'emploi",
  'contrat de travail', 'salaire',
  'travay', 'lanplwa', 'anplwa', 'rekritman', 'lazans', 'saler', 'kontra travay',
];

const NEGATIONS = [
  'never', 'do not', "don't", 'dont', 'not', 'no one', 'nobody', 'jamais', 'ne pas', 'ne jamais', 'ne partagez',
  'zamai', 'pa bizin', 'pa', 'pa janbe', 'okenn',
];

/** "Mo finn peye", "j'ai envoye", "already paid": the writer says they paid; that is not a request. */
const PAST_MARKERS = ['finn', 'deja', 'already', "j'ai", 'i have', "i've", 'nous avons', 'on a'];

const hasAny = (text: string, phrases: string[]) => phrases.some((p) => findPhrase(text, p).length > 0);

const verbThenObject = (verbs: string[], objects: string[]) =>
  new RegExp(`\\b(?:${verbs.map(escapeRe).join('|')})\\b[^.!?\\n]{0,40}?\\b(?:${objects.map(escapeRe).join('|')})\\b`, 'g');

// ---- Asking for a code / PIN: a verb followed closely by a code word, not negated ----
const CODE_VERBS = [
  'send', 'give', 'share', 'tell', 'provide', 'forward', 'reply with', 'read out', 'read', 'enter', 'type', 'confirm',
  'envoyez', 'envoyer', 'envoie', 'donnez', 'donner', 'communiquez', 'transmettez', 'confirmez', 'partagez', 'dites',
  'avoy', 'avoye', 'voye', 'donn', 'done', 'partaz', 'dir', 'konfirm',
];
const CODE_OBJECTS = [
  'code', 'codes', 'otp', 'pin', 'password', 'passcode', 'cvv', 'cvc', 'verification code', 'security code',
  'mot de passe', 'code secret', 'code de verification', 'kod', 'mo de pas', 'kod sekre',
];
const CODE_REQUEST = verbThenObject(CODE_VERBS, CODE_OBJECTS);

/** Ranges where the (normalised) message asks the reader to send/give a code, PIN or password. */
export function codeRequests(norm: string): Highlight[] {
  return allMatches(CODE_REQUEST, norm)
    .filter((m) => {
      // "Never share this code", "pa bizin donn kod": a negation in the 25 characters before the verb.
      const before = norm.slice(Math.max(0, m.index - 25), m.index);
      return !hasAny(before, NEGATIONS);
    })
    .map((m) => ({ start: m.index, end: m.index + m[0].length }));
}

// ---- Asking for money: a pay/send verb followed closely by money words or an amount ----
const PAY_VERBS = [
  'pay', 'send', 'transfer', 'deposit', 'wire', 'top up', 'make a payment',
  'payer', 'payez', 'envoyez', 'envoyer', 'envoie', 'versez', 'verser', 'virer', 'virez', 'transferez', 'deposez',
  'regler', 'reglez', 'peye', 'avoy', 'depoze',
];
const MONEY_WORDS = [
  'money', 'fee', 'fees', 'deposit', 'rs', 'mur', 'rupees', 'payment', 'cash', 'amount',
  'argent', 'frais', 'montant', 'acompte', 'roupies',
  'larzan', 'kas', 'fre', 'roupi', 'depo',
];
const PAY_REQUEST = verbThenObject(PAY_VERBS, MONEY_WORDS);

export function paymentRequests(norm: string): Highlight[] {
  return allMatches(PAY_REQUEST, norm)
    .filter((m) => {
      const before = norm.slice(Math.max(0, m.index - 25), m.index);
      const justBefore = norm.slice(Math.max(0, m.index - 12), m.index);
      return !hasAny(before, NEGATIONS) && !hasAny(justBefore, PAST_MARKERS);
    })
    .map((m) => ({ start: m.index, end: m.index + m[0].length }));
}
