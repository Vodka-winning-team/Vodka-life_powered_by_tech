// DEV ONLY: a fictional message with a hand-made result, so the screens can be tested before B's engine is ready.
// The bank name, domain list and phone come from A's real banks.json. Delete this file once the engine works.

import type { Check } from '@/lib/store';

const banks: { id: string; name: string; phone: string; domains: string[]; phone_source: string; snapshot: string }[] =
  require('../../app/src/main/assets/data/banks.json');

const mcb = banks.find((b) => b.id === 'mcb')!;

const text =
  'MCB: your account is blocked. Verify now at mcb-login-secure.net and send us the code we text you. (FICTIONAL SAMPLE)';

function span(part: string) {
  const start = text.indexOf(part);
  return { start, end: start + part.length };
}

const source = { name: mcb.name, url: mcb.phone_source, date: mcb.snapshot };

export const sampleCheck: Check = {
  id: 'sample',
  text,
  job: null,
  savedAt: null,
  result: {
    level: 'STOP',
    findings: [
      {
        kind: 'bank_link',
        level: 'STOP',
        title: 'Link is not the official site of the bank named',
        detail: `The message names ${mcb.name}. Its official site is ${mcb.domains.join(', ')}.`,
        highlights: [span('mcb-login-secure.net')],
        source,
      },
      {
        kind: 'code_request',
        level: 'STOP',
        title: 'Asks you to send a code',
        detail: 'A bank never asks you to send or read out a code.',
        highlights: [span('send us the code')],
        source: null,
      },
      {
        kind: 'urgency',
        level: 'CAREFUL',
        title: 'Rushes you',
        detail: 'Words like "now" and "blocked" push you to act before you check.',
        highlights: [span('blocked'), span('Verify now')],
        source: null,
      },
    ],
    contacts: [{ name: mcb.name, phone: mcb.phone, source }],
  },
};
