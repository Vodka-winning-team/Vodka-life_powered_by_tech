// Dates are saved in ISO format (UTC). On screen we show the phone's local time, e.g. "13 Nov 2026, 20:49".

import { getLanguage } from '@/constants/strings';

// Short month names in each language of the app.
const MONTH_NAMES = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  fr: ['janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'],
  mfe: ['Zan', 'Fev', 'Mars', 'Avr', 'Me', 'Zin', 'Zil', 'Out', 'Sept', 'Okt', 'Nov', 'Des'],
};

/** The month names for the language the app is in now. */
function months(): string[] {
  return MONTH_NAMES[getLanguage()] ?? MONTH_NAMES.en;
}

export function localDateTime(iso: string | null): string {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return '';
  const two = (n: number) => String(n).padStart(2, '0');
  return `${d.getDate()} ${months()[d.getMonth()]} ${d.getFullYear()}, ${two(d.getHours())}:${two(d.getMinutes())}`;
}

/** "2026-11-13" → "13 Nov 2026" (source dates). Anything else is shown as it is. */
export function prettyDay(iso: string): string {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso.trim());
  if (!m) return iso;
  const month = months()[Number(m[2]) - 1];
  return month ? `${Number(m[3])} ${month} ${m[1]}` : iso;
}
