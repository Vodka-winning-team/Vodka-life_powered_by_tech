// Adiyen's (A) 15 data-driven test cases from docs/test-cases.md, all fictional. today = 2026-11-14.
import { Engine, JobAnswers, Level } from '../index';
import { loadRealData } from '../testing/load-data';

const engine = new Engine(loadRealData(), '2026-11-14');
const digits = (s: string) => s.replace(/\D/g, '');

type Case = { n: number; text: string; level: Level; mustHave?: string[]; job?: JobAnswers; contact?: string };

const cases: Case[] = [
  { n: 1, text: 'Bonzour, ou finn gagn travay dan lotel Kanada. Bizin peye tiket avion Rs 38,000 avan lindi.', level: 'STOP', mustHave: ['job_fee'] },
  { n: 2, text: "Offre d'emploi en France : pour finaliser votre recrutement, payez 6 000 roupies pour le certificat de moralité.", level: 'STOP', mustHave: ['job_fee'] },
  { n: 3, text: 'Hotel jobs in Canada! Register now: registration fee Rs 5,000, send it by Friday to secure your place.', level: 'STOP', mustHave: ['job_fee'] },
  { n: 4, text: 'Lazans travay Dubai: bizin peye fre aniel Rs 8,000 chak lane pou gard ou plas.', level: 'STOP', mustHave: ['job_fee'] },
  { n: 5, text: 'Absa: your card has been blocked. Unblock it now at absa-mu-update.com', level: 'STOP', mustHave: ['bank_link', 'bank_alarm'], contact: '+230 402 1000' },
  { n: 6, text: 'blink by Emtel: ou wallet inn bloke. Klik lor blink-emtel-verify.com pou debloke li.', level: 'STOP', mustHave: ['bank_link'], contact: '8971' },
  { n: 7, text: 'SBM: our branches close at 12:00 on 24 December. Details on https://www.sbmgroup.mu', level: 'NONE' },
  { n: 8, text: 'MCB: 482913 is your Juice verification code. MCB will never ask you for this code. Do not share it.', level: 'NONE' },
  { n: 9, text: 'Weekend promo: fresh orange juice 1L at Rs 75. See all offers at freshmarket.mu', level: 'NONE' },
  { n: 10, text: 'Trade with KRAKEIF Global, a licensed investment dealer. 10% per week guaranteed.', level: 'STOP', mustHave: ['fsc_alert'] },
  { n: 11, text: 'Plateforme FOREX régulée : ouvrez votre compte sur https://www.starnetfx.com et commencez à trader.', level: 'STOP', mustHave: ['fsc_alert'] },
  { n: 12, text: 'Mauritius Telecom Lucky Draw: you have won a prize! Send your details to mauritiustelecomeluckydraw@gmail.com', level: 'CAREFUL', mustHave: ['cert_alert', 'prize_gift'] },
  { n: 13, text: 'House for sale in Pereybere, only Rs. 700,000! Make an advance payment or deposit of Rs 20,000 to secure a property viewing.', level: 'CAREFUL', mustHave: ['cert_alert', 'payment_request'] },
  { n: 14, text: 'LIFETIME CANADA LTD: your hotel job in Toronto is confirmed. Pay the visa fee of Rs 12,000 this week.', level: 'STOP', mustHave: ['job_fee', 'agency_listed'], job: { agencyId: 'abroad-lifetime-canada-ltd', costId: 'visa' }, contact: '+2302138028' },
  { n: 15, text: 'Travail en Australie avec ZENITH CONSULTANCY LTD. Contactez-nous pour votre candidature.', level: 'CAREFUL', mustHave: ['agency_wrong_category'], job: { agencyId: 'non_citizen-zenith-consultancy-ltd', costId: null } },
];

test.each(cases)('A case $n → $level', (c) => {
  const r = engine.check(c.text, c.job ?? null);
  const kinds = r.findings.map((f) => f.kind);
  const got = {
    level: r.level,
    missing: (c.mustHave ?? []).filter((k) => !kinds.includes(k)),
    contact: c.contact ? r.contacts.some((x) => digits(x.phone) === digits(c.contact!)) : true,
    noFindingsWhenNone: c.level === 'NONE' ? r.findings.length === 0 : true,
  };
  expect(got).toEqual({ level: c.level, missing: [], contact: true, noFindingsWhenNone: true });
});
