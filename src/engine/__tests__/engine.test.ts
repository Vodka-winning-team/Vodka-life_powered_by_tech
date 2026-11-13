// Port of EngineTest.kt: the demo messages from PROJECT.md §9 (all fictional) plus edge cases, on the REAL data.
import { CheckResult, Engine } from '../index';
import { loadRealData } from '../testing/load-data';

const engine = new Engine(loadRealData(), '2026-11-14');
const kinds = (r: CheckResult) => new Set(r.findings.map((f) => f.kind));

const demo1 =
  'Bonjour Kevin! THINK RECRUITMENT LTD here. Hotel job in Canada, salary CAD 3,000. ' +
  'To secure your place, pay the processing fee of Rs 50,000 today by Juice. Urgent, only 2 places left.';

test('demo 1: job offer with processing fee is STOP, highlight on "processing fee"', () => {
  const r = engine.check(demo1);
  expect(r.level).toBe('STOP');
  const fee = r.findings.find((f) => f.kind === 'job_fee')!;
  expect(fee.detail).toContain('reg 7(2)(e)');
  const h = fee.highlights[0];
  expect(demo1.slice(h.start, h.end)).toBe('processing fee');
  expect(kinds(r).has('urgency')).toBe(true);
});

test('demo 1: suggests the register agency', () => {
  expect(engine.suggestAgencies(demo1)[0].id).toBe('abroad-think-recruitment-ltd');
});

test('demo 1 with job answers: listed but not proof, register phone, fee counted once', () => {
  const r = engine.check(demo1, { agencyId: 'abroad-think-recruitment-ltd', costId: 'processing' });
  expect(r.level).toBe('STOP');
  expect(r.findings.find((f) => f.kind === 'agency_listed')!.detail).toContain('does not prove');
  expect(r.findings.filter((f) => f.kind === 'job_fee')).toHaveLength(1);
  expect(r.contacts.some((c) => c.phone === '+230 5256 8074')).toBe(true);
  expect(r.contacts.some((c) => c.name.includes('Mauritius Commercial'))).toBe(false); // "Juice" alone doesn't add MCB
});

test('demo 3: follow-up air ticket cites reg 7(2)(a)', () => {
  const r = engine.check('They now want Rs 15,000 for the air ticket.', { agencyId: 'abroad-think-recruitment-ltd', costId: 'air_ticket' });
  expect(r.level).toBe('STOP');
  expect(r.findings.find((f) => f.kind === 'job_fee')!.detail).toContain('reg 7(2)(a)');
});

test('demo 4: MCB lookalike link is STOP with the official number', () => {
  const r = engine.check('MCB: Unusual activity on your account. Verify your account at mcb-login-secure.net or it will be blocked.');
  expect(r.level).toBe('STOP');
  expect(kinds(r).has('bank_link')).toBe(true);
  expect(r.contacts.some((c) => c.phone === '+230 202 6060')).toBe(true);
});

test('demo 5: genuine OTP SMS has no findings', () => {
  const r = engine.check(
    'MCB: Your OTP for the online payment of Rs 1,250.00 at DARTY is 482913. Never share this code with anyone, including MCB staff.',
  );
  expect(r.level).toBe('NONE');
  expect(r.findings).toHaveLength(0);
});

test('asking for a code is STOP (EN, Kreol, FR)', () => {
  expect(engine.check('Please send us the code you just received to confirm.').level).toBe('STOP');
  expect(engine.check('Bonzour, mo finn avoy ou enn kod. Avoy mwa kod la vit.').level).toBe('STOP');
  expect(engine.check('Merci de nous envoyer le code de vérification.').level).toBe('STOP');
});

test('"your code is 123456, never share it" is not a finding', () => {
  const r = engine.check('Your code is 123456, never share it.');
  expect(kinds(r).has('code_request')).toBe(false);
  expect(r.level).toBe('NONE');
});

test('agency not in the list is CAREFUL and names the list date', () => {
  const r = engine.check('Job in Dubai', { agencyId: null, costId: null });
  expect(r.level).toBe('CAREFUL');
  expect(r.findings[0].title).toContain('4 Nov 2026');
});

test('local agency for a job abroad is the wrong category', () => {
  expect(kinds(engine.check('Job in Canada', { agencyId: 'local-my-web-ltd', costId: null })).has('agency_wrong_category')).toBe(true);
});

test('expired licence is flagged', () => {
  const later = new Engine(loadRealData(), '2030-01-01');
  expect(kinds(later.check('Job in Canada', { agencyId: 'abroad-think-recruitment-ltd', costId: null })).has('agency_expired')).toBe(true);
});

test('official bank link is not flagged; sub-domain trick is', () => {
  expect(kinds(engine.check('MCB: see our new rates at https://www.mcb.mu/personal/rates')).has('bank_link')).toBe(false);
  expect(kinds(engine.check('MCB: verify now at https://mcb.mu.secure-check.com/login')).has('bank_link')).toBe(true);
});

test('FSC-warned website is STOP', () => {
  const r = engine.check('Earn 5% per day with AI trading on mornefundvex.net, join now!');
  expect(r.level).toBe('STOP');
  expect(kinds(r).has('fsc_alert')).toBe(true);
  expect(kinds(r).has('guaranteed_returns')).toBe(true);
});

test('CERT-MU campaign: Divali cash gift', () => {
  const r = engine.check('Happy Divali! Divali Cash Gift of Rs. 2,000 for you. View Now: bit.ly/divali-gift');
  expect(kinds(r).has('cert_alert')).toBe(true);
  expect(kinds(r).has('odd_link')).toBe(true);
});

test('Kreol new number + money request is CAREFUL', () => {
  const r = engine.check('Salam, mo finn perdi mo telefonn, sa mo nouvo nimero. Avoy Rs 3000 lor my.t money urgent');
  expect(r.level).toBe('CAREFUL');
  for (const k of ['new_number', 'payment_request', 'urgency']) expect(kinds(r).has(k)).toBe(true);
});

test('ordinary messages are NONE', () => {
  expect(engine.check('See you at 7 for dinner? Bring the kids.').level).toBe('NONE');
  expect(engine.check('Bring your passport to the job interview on Monday.').level).toBe('NONE');
});

test('highlights are always inside the message', () => {
  for (const msg of [demo1, 'MCB: Unusual activity. Verify at mcb-login-secure.net', 'Avoy mwa kod la']) {
    for (const f of engine.check(msg).findings) {
      for (const h of f.highlights) expect(h.start >= 0 && h.end <= msg.length && h.start < h.end).toBe(true);
    }
  }
});
