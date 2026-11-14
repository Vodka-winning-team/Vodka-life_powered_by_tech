// Surprise card (wrong input): is this text a real message, or just random typing?
// "t4rcndfrnoif", "asdf asdf" or "1111111" must never get a Result. A real message has a few
// different real words, or a link, or a phone number. (Rules tested by Pushkar with 26 inputs.)

const VOWEL = /[aeiouyàâäéèêëîïôöùûü]/i;

/** Things people type to test a box: not words. */
const FILLER = new Set(['asdf', 'asdfg', 'asdfgh', 'qwerty', 'qwertyuiop', 'zxcv', 'zxcvbn', 'blah', 'xyz', 'abc', 'abcd', 'test', 'foo', 'bar']);

/** Endings of real web addresses (for an address typed without http). */
const WEB_ENDING = /\b[\w-]+\.(com|net|org|mu|info|xyz|top|co|io|app|site|online|link|click|ly|in|fr|uk)(\/\S*)?(?=\s|$)/i;

/** A token that looks like a word: letters only, with a vowel, and no long run of consonants. Short capitals (MCB, OTP) count too. */
function isWord(token: string): boolean {
  const word = token.replace(/^[^\p{L}]+|[^\p{L}]+$/gu, ''); // drop punctuation around it
  if (word.length < 2 || !/^[\p{L}'’-]+$/u.test(word)) return false;
  if (/^(.)\1+$/i.test(word)) return false; // one letter repeated: AAAAA
  if (FILLER.has(word.toLowerCase())) return false;
  if (word.length <= 5 && word === word.toUpperCase()) return true; // MCB, OTP, SBM
  if (!VOWEL.test(word)) return false;
  return !/[^aeiouyàâäéèêëîïôöùûü'’-]{5,}/i.test(word);
}

/** True when the text is worth checking: 2 or more different real words, or a link, or a phone number. */
export function looksLikeMessage(text: string): boolean {
  const clean = text.trim();
  if (/(https?:\/\/|www\.)\S+/i.test(clean)) return true; // a link on its own
  if (WEB_ENDING.test(clean)) return true; // a web address without http (mcb-login.net)
  // A phone number: 7 or more digits that are not all the same digit.
  const phone = clean.match(/\+?\d[\d\s-]{5,}\d/);
  if (phone && !/^(\d)\1+$/.test(phone[0].replace(/\D/g, ''))) return true;
  // Chinese or Japanese is written without spaces: 4 or more characters is a sentence.
  if (/[\u3040-\u30ff\u4e00-\u9fff]{4,}/.test(clean)) return true;
  const words = clean.split(/\s+/).filter(isWord);
  return new Set(words.map((w) => w.toLowerCase())).size >= 2;
}
