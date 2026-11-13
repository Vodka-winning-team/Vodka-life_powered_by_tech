/// <reference types="node" />
// Try the engine by hand, without a phone (port of TryIt.kt). Skipped in normal `npm test` runs.
//   TRY_MSG="MCB: verify at mcb-login-secure.net" npx jest try-it
//   TRY_MSG="Pay the processing fee Rs 50,000" TRY_JOB="abroad-think-recruitment-ltd processing" npx jest try-it
// TRY_JOB = "<agency-id or none> [cost-id]", like the answers on the Job check screen.
import { Engine, JobAnswers } from '../index';
import { loadRealData } from '../testing/load-data';

const msg = process.env.TRY_MSG ?? '';
const jobParts = (process.env.TRY_JOB ?? '').trim().split(/\s+/).filter(Boolean);
const job: JobAnswers | null = jobParts.length
  ? { agencyId: jobParts[0] === 'none' ? null : jobParts[0], costId: jobParts[1] ?? null }
  : null;

(msg ? test : test.skip)('try it', () => {
  const engine = new Engine(loadRealData());
  const r = engine.check(msg, job);
  const label = { STOP: 'STOP – high risk', CAREFUL: 'BE CAREFUL – verify', NONE: 'NO WARNING SIGNS FOUND – still verify' }[r.level];
  // X-Ray: the message with every highlighted part in [brackets].
  const marks = r.findings.flatMap((f) => f.highlights).sort((a, b) => a.start - b.start);
  let xray = '';
  let pos = 0;
  for (const h of marks) {
    if (h.start < pos) continue;
    xray += msg.slice(pos, h.start) + '[' + msg.slice(h.start, h.end) + ']';
    pos = h.end;
  }
  xray += msg.slice(pos);
  const lines = [`\n===== ${label} =====`, `X-Ray: ${xray}`];
  for (const f of r.findings) {
    lines.push(`\n[${f.level}] ${f.title}   (kind: ${f.kind})`, `   ${f.detail}`);
    if (f.source) lines.push(`   Source: ${f.source.name}, ${f.source.date} · ${f.source.url}`);
  }
  if (r.contacts.length) lines.push('\nCall (official numbers): ' + r.contacts.map((c) => `${c.name} ${c.phone}`).join(' · '));
  const agencies = engine.suggestAgencies(msg);
  if (agencies.length) lines.push('Agencies found in the message: ' + agencies.map((a) => `${a.name} (${a.id})`).join(', '));
  process.stdout.write(lines.join('\n') + '\n\n');
});
