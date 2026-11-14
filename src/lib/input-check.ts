// Surprise card (wrong input): is this text a real message, or just random typing?
// "t4rcndfrnoif" or "asdkjh" must never get a Result. A real message has a few real words,
// or a link, or a phone number.

const VOWEL = /[aeiouyàâäéèêëîïôöùûü]/i;

/** A token that looks like a word: letters only, with a vowel, and no long run of consonants. Short capitals (MCB, OTP) count too. */
function isWord(token: string): boolean {
  const word = token.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, ''); // drop punctuation around it
  if (word.length < 2 || !/^[\p{L}'’-]+$/u.test(word)) return false;
  if (word.length <= 5 && word === word.toUpperCase()) return true; // MCB, OTP, SBM
  if (!VOWEL.test(word)) return false;
  return !/[^aeiouyàâäéèêëîïôöùûü'’-]{5,}/i.test(word);
}

/** True when the text is worth checking: 2 or more real words, or a link, or a phone number. */
export function looksLikeMessage(text: string): boolean {
  const clean = text.trim();
  if (/(https?:\/\/|www\.)\S+/i.test(clean)) return true; // a link on its own
  if (/\b[\w-]+\.[a-z]{2,}(\/\S*)?/i.test(clean)) return true; // a web address without http (mcb-login.net)
  if (/(\+?\d[\d\s-]{5,}\d)/.test(clean)) return true; // a phone number
  const words = clean.split(/\s+/).filter(isWord);
  return words.length >= 2;
}
