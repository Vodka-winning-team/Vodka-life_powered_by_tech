// SURPRISE CARD: "Your app must survive a user doing the 'wrong' thing: wrong input, skipped steps, panic-tapping.
// Make one key flow hard to break." These tests try to break the engine behind the key flow
// (Scan → Result → Job check → What to do now) and check it always recovers SAFELY.
import { CheckResult, Engine, JobAnswers, Level } from '../index';
import { loadRealData } from '../testing/load-data';

const engine = new Engine(loadRealData(), '2026-11-14');
const LEVELS: Level[] = ['STOP', 'CAREFUL', 'NONE'];
const kinds = (r: CheckResult) => r.findings.map((f) => f.kind);
const demo1 = 'Bonjour Kevin! THINK RECRUITMENT LTD here. Hotel job in Canada, salary CAD 3,000. ' +
  'To secure your place, pay the processing fee of Rs 50,000 today by Juice. Urgent, only 2 places left.';

/** Every result must be well-formed: a valid level, highlights inside the text, and a level that matches the findings. */
function expectWellFormed(r: CheckResult, text: string) {
  expect(LEVELS).toContain(r.level);
  for (const f of r.findings) {
    expect(LEVELS).toContain(f.level);
    for (const h of f.highlights) expect(h.start >= 0 && h.start < h.end && h.end <= text.length).toBe(true);
  }
  const worst = r.findings.some((f) => f.level === 'STOP') ? 'STOP' : r.findings.some((f) => f.level === 'CAREFUL') ? 'CAREFUL' : 'NONE';
  expect(r.level).toBe(worst);
}

describe('wrong input never gives "No warning signs found"', () => {
  test.each(['', '   ', '\n\n', 'ok', '🙂🙂🙂', '...', '?!'])('empty-ish input %j → "paste the whole message"', (text) => {
    const r = engine.check(text);
    expect(r.level).toBe('CAREFUL');
    expect(kinds(r)).toEqual(['empty_message']);
  });

  test('not a string at all (a bug in a screen) → safe result, no crash', () => {
    for (const bad of [null, undefined, 42, {}, []] as unknown[]) {
      const r = engine.check(bad as string);
      expect(r.level).toBe('CAREFUL');
    }
  });

  test('a broken job answer object → still a safe result', () => {
    const r = engine.check(demo1, 'oops' as unknown as JobAnswers);
    expect(r.level).toBe('STOP'); // the text alone already shows the job fee
  });
});

describe('skipped or wrong steps on Job check', () => {
  test('agency skipped (null) → "not found", never a green light', () => {
    const r = engine.check(demo1, { agencyId: null, costId: null });
    expect(r.level).toBe('STOP');
    expect(kinds(r)).toContain('agency_not_found');
  });

  test('unknown agency id (old saved case, wrong tap) → treated as not found', () => {
    expect(kinds(engine.check('Job in Canada', { agencyId: 'does-not-exist', costId: null }))).toContain('agency_not_found');
  });

  test('unknown cost id → reported, with the no-fee rule', () => {
    const r = engine.check('Job in Canada', { agencyId: 'abroad-think-recruitment-ltd', costId: 'nonsense' });
    expect(kinds(r)).toContain('cost_unknown');
    expect(r.level).not.toBe('NONE');
  });

  test('cost picked but agency skipped → the fee rule still applies', () => {
    const r = engine.check('They want money for the job', { agencyId: null, costId: 'visa' });
    expect(r.level).toBe('STOP');
    expect(kinds(r)).toContain('job_fee');
  });
});

describe('messy pastes still find the words', () => {
  test.each([
    'Hotel job in Canada. Pay the processing\nfee of Rs 50,000 today.',
    'Hotel job in Canada. Pay the processing    fee of Rs 50,000 today.',
    'Hotel job in Canada. Pay the processing fee of Rs 50,000 today.',
    'HOTEL JOB IN CANADA. PAY THE PROCESSING FEE OF RS 50,000 TODAY.',
    'Hotel job in Canada.\r\nPay the processing fee\r\nof Rs 50,000 today.',
  ])('%j → STOP job fee', (text) => {
    const r = engine.check(text);
    expect(r.level).toBe('STOP');
    expect(kinds(r)).toContain('job_fee');
    expectWellFormed(r, text);
  });

  test('a bare lookalike link with no other text → STOP', () => {
    expect(engine.check('mcb-login-secure.net').level).toBe('STOP');
  });
});

describe('panic-tapping', () => {
  test('tapping Check 20 times gives exactly the same result every time', () => {
    const first = engine.check(demo1, { agencyId: 'abroad-think-recruitment-ltd', costId: 'processing' });
    for (let i = 0; i < 20; i++) {
      expect(engine.check(demo1, { agencyId: 'abroad-think-recruitment-ltd', costId: 'processing' })).toEqual(first);
    }
  });
});

describe('huge and random input', () => {
  test('a very long paste is checked quickly and says only the first part was checked', () => {
    const text = demo1 + ' blah'.repeat(40000); // ~200,000 characters
    const start = Date.now();
    const r = engine.check(text);
    expect(Date.now() - start).toBeLessThan(2000);
    expect(r.level).toBe('STOP');
    expect(kinds(r)).toContain('message_truncated');
    expectWellFormed(r, text);
  });

  test('500 random messages (emoji, symbols, regex characters, other scripts) never crash', () => {
    let seed = 42;
    const rand = () => ((seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648);
    const pieces = ['Rs', '50,000', 'pay', 'code', 'MCB', 'juice', 'http://', 'bit.ly/x', '.com', '(', ')', '[', '*', '+', '?',
      '\\', '$', '^', '|', '🙂', '💰', 'é', 'ç', 'ñ', 'Ω', '中文', 'العربية', '\n', '\t', ' ', '  ', 'avoy kod', 'frais', '%', '@', '+230'];
    for (let n = 0; n < 500; n++) {
      let text = '';
      const len = Math.floor(rand() * 40);
      for (let i = 0; i < len; i++) text += pieces[Math.floor(rand() * pieces.length)] + (rand() < 0.5 ? ' ' : '');
      const r = engine.check(text);
      expectWellFormed(r, text);
    }
  });
});

describe('wording rule (CLAUDE.md): no "safe", "genuine", "scam" or "illegal" in any result text', () => {
  test('all titles and details across many messages and job answers', () => {
    const messages = [
      demo1, '', 'ok', 'Job in Canada', 'MCB: verify at mcb-login-secure.net, call 5912 3456',
      'Earn 5% per day on mornefundvex.net, guaranteed profit, urgent',
      'Happy Divali! Divali Cash Gift of Rs. 2,000 for you. View Now: bit.ly/divali-gift',
      'Salam, mo finn perdi mo telefonn, sa mo nouvo nimero. Avoy Rs 3000 urgent', 'Please send us the code',
      'Congratulations, you won a prize!', 'x'.repeat(30000),
    ];
    const jobs: (JobAnswers | null)[] = [null, { agencyId: null, costId: null }, { agencyId: 'local-my-web-ltd', costId: 'nonsense' },
      { agencyId: 'abroad-think-recruitment-ltd', costId: 'processing' }];
    const later = new Engine(loadRealData(), '2030-01-01');
    for (const m of messages) {
      for (const j of jobs) {
        for (const e of [engine, later]) {
          for (const f of e.check(m, j).findings) {
            expect(`${f.title} ${f.detail}`).not.toMatch(/\b(safe|genuine|scams?|scammers?|illegal)\b/i);
          }
        }
      }
    }
  });

  test('phone numbers in texts are written so they can be read out', () => {
    const r = engine.check(demo1, { agencyId: 'abroad-think-recruitment-ltd', costId: null });
    expect(r.findings.find((f) => f.kind === 'agency_listed')!.detail).toContain('+230 5256 8074');
  });
});

test('dates in texts are readable and the bank contact cites the bank website', () => {
  const fsc = engine.check('Earn 5% per day with AI trading on mornefundvex.net');
  expect(fsc.findings.find((f) => f.kind === 'fsc_alert')!.detail).toContain('30 Jun 2026');
  const bank = engine.check('MCB: Unusual activity on your account. Verify at mcb-login-secure.net');
  const mcb = bank.contacts.find((c) => c.name.includes('Mauritius Commercial'))!;
  expect(mcb.source.url).toContain('mcb.mu');
});
