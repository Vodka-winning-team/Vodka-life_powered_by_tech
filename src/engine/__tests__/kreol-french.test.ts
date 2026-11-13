// Port of KreolFrenchTest.kt: realistic Kreol Morisien and French messages (all fictional) with the level we expect.
// If a native speaker finds a better spelling or a common phrase we miss, add a case here first, then the phrase in rules.ts.
import { Engine, JobAnswers, Level } from '../index';
import { loadRealData } from '../testing/load-data';

const engine = new Engine(loadRealData(), '2026-11-14');

type Case = { text: string; level: Level; mustHave?: string[]; job?: JobAnswers };

const cases: Case[] = [
  // ---------- STOP ----------
  { text: 'MCB: Votre compte a été suspendu suite à une activité suspecte. Veuillez vérifier vos informations sur mcb-securite.com', level: 'STOP', mustHave: ['bank_link', 'bank_alarm'] },
  { text: "Bonjour, c'est le service client SBM. Pour débloquer votre carte, communiquez-nous le code OTP reçu par SMS.", level: 'STOP', mustHave: ['code_request'] },
  { text: 'Bonzour, mo pe kontakte ou depi MCB. Donn mwa kod OTP ki ou finn gagne lor ou telefonn.', level: 'STOP', mustHave: ['code_request'] },
  { text: 'Bonzour, nou ena travay dan lotel Kanada. Saler 90,000 par mwa. Bizin peye fre dosie Rs 45,000 avan vandredi.', level: 'STOP', mustHave: ['job_fee'] },
  { text: "Offre d'emploi au Canada : poste de serveur, salaire 2500 $. Frais de dossier de 30 000 roupies à payer avant lundi.", level: 'STOP', mustHave: ['job_fee'] },
  { text: 'Félicitations ! Votre candidature pour travailler à Dubaï est acceptée. Envoyez 15 000 Rs pour les frais de visa.', level: 'STOP', mustHave: ['job_fee', 'prize_gift'] },
  { text: 'SBM: ou kart inn bloke. Klik isi pou debloke: sbm-mu-verify.top', level: 'STOP', mustHave: ['bank_link', 'bank_alarm'] },
  { text: 'Investissez avec Everfxx et doublez votre argent en 30 jours, rendement garanti !', level: 'STOP', mustHave: ['fsc_alert', 'guaranteed_returns'] },
  { text: 'Allo, se mwa, mo finn sanz mo nimero. Mo finn avoy ou enn kod par erer, avoy mwa li vit.', level: 'STOP', mustHave: ['code_request', 'new_number'] },

  // ---------- CAREFUL ----------
  { text: 'Félicitations ! Vous avez gagné un iPhone 17. Payez seulement 500 Rs de frais de livraison.', level: 'CAREFUL', mustHave: ['prize_gift', 'payment_request'] },
  { text: 'Bravo! Ou finn gagn enn lot Rs 25,000 dan tiraz o sor. Avoy Rs 200 pou reklam ou lot.', level: 'CAREFUL', mustHave: ['prize_gift', 'payment_request'] },
  { text: 'Bonzour, nou fer ou larzan double dan 7 zour. Benefis garanti 100%. Kontakte nou lor WhatsApp.', level: 'CAREFUL', mustHave: ['guaranteed_returns'] },
  { text: "Coucou maman, j'ai changé de numéro, c'est mon nouveau numéro. Tu peux m'envoyer 3000 roupies en urgence ?", level: 'CAREFUL', mustHave: ['new_number', 'payment_request', 'urgency'] },
  { text: 'Ou bizin peye Rs 1,500 zordi mem sinon ou kouran pou koupe.', level: 'CAREFUL', mustHave: ['payment_request', 'urgency'] },
  { text: "Traffic Enforcement Alert: Speeding Case. Vous avez dépassé la limite. Payez l'amende sur govmu-avip.cam", level: 'CAREFUL', mustHave: ['cert_alert', 'odd_link'] },
  { text: 'Travay dan Dubai, kontakte My Web Ltd.', level: 'CAREFUL', mustHave: ['agency_wrong_category'], job: { agencyId: 'local-my-web-ltd', costId: null } },

  // ---------- NONE ----------
  { text: 'Bonzour mama, mo pe vinn lakaz ver 6er. Pa bizin kwi manze.', level: 'NONE' },
  { text: 'SBM : Votre code de vérification est 728193. Ne le communiquez jamais à personne.', level: 'NONE' },
  { text: 'MCB: Ou kod OTP se 551902. Pa donn li personn, mem enn anplwaye MCB.', level: 'NONE' },
  { text: 'Bonjour, suite à votre candidature, nous vous invitons à un entretien lundi à 10h. Apportez votre passeport.', level: 'NONE' },
  { text: 'Mo finn peye lekol Rs 2,000 zordi.', level: 'NONE' },
  { text: "Merci, j'ai déjà payé les 500 roupies hier.", level: 'NONE' },
];

test.each(cases)('$level: $text', (c) => {
  const r = engine.check(c.text, c.job ?? null);
  const kinds = r.findings.map((f) => f.kind);
  expect({ level: r.level, missing: (c.mustHave ?? []).filter((k) => !kinds.includes(k)) }).toEqual({ level: c.level, missing: [] });
});

test('accents and capitals do not matter', () => {
  const a = engine.check("FRAIS DE DOSSIER de Rs 20 000 pour l'offre d'emploi au Canada");
  const b = engine.check("frais de dossier de rs 20 000 pour l'offre d'emploi au canada");
  expect(a.level).toBe('STOP');
  expect(b.level).toBe(a.level);
});

test('speed: a long message is checked quickly (phone target < 300 ms)', () => {
  const msg = (
    'Bonzour Kevin, THINK RECRUITMENT LTD isi. Travay dan lotel Kanada, saler 90,000. ' +
    'Bizin peye fre dosie Rs 45,000 zordi mem. MCB: verify at mcb-login-secure.net. '
  ).repeat(10);
  engine.check(msg); // warm-up
  const start = Date.now();
  for (let i = 0; i < 20; i++) engine.check(msg);
  expect((Date.now() - start) / 20).toBeLessThan(50);
});
