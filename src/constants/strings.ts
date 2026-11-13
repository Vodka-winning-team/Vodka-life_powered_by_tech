// ALL text shown in the app lives here. English first; A fills French (fr) and Kreol (mfe) later.
// A missing fr/mfe text falls back to English.
// Wording rule: never "safe", "genuine", "scam" or "illegal" in any language.

const en = {
  appName: 'Verifye',
  tagline: 'Verifye avan ou peye: check before you pay',

  languageLabel: 'Language',
  scanTitle: 'Check a message',
  scanHint: 'Paste a suspicious SMS, WhatsApp or email below. Nothing leaves your phone.',
  scanPlaceholder: 'Paste the message here',
  scanButton: 'Check message',
  scanEmpty: 'Paste a message first.',
  openHistory: 'History',
  openSources: 'Our sources',

  levelSTOP: 'Stop – high risk',
  levelCAREFUL: 'Be careful – verify',
  levelNONE: 'No warning signs found – still verify',

  resultTitle: 'Result',
  resultMessage: 'The message',
  resultFindings: 'What we found',
  resultNoFindings: 'No warning signs found in our rules and official lists. Still call the official number before you pay.',
  resultJobButton: 'Job offer? Check the agency',
  resultActionsButton: 'What to do now',
  resultSave: 'Save to history',
  resultSaved: 'Saved',
  followUpLabel: 'They asked for something new?',
  followUpPlaceholder: 'Paste their new message',
  followUpButton: 'Add to this case and check again',
  sourceLabel: 'Source',
  findingInfo: 'Good to know',

  jobTitle: 'Job check',
  jobAgencyLabel: '1. Which agency is it?',
  jobSuggested: 'Found in the message',
  jobSearch: 'Search the Ministry register',
  jobNoAgency: 'No agency picked',
  jobCostLabel: '2. What are they asking you to pay for?',
  jobCheckButton: 'Check again',

  actionsTitle: 'What to do now',
  actionsCall: 'Call the official number',
  actionsCallHint: 'Use this number, never the one in the message.',
  actionsNoContacts: 'No official number for this message yet.',
  actionsShare: 'Ask someone you trust',
  actionsShareButton: 'Share a summary',
  actionsReport: 'Report it',
  reportMaucors: 'MAUCORS (online report to CERT-MU and the police)',
  reportMinistry: 'Ministry of Labour, recruitment agencies (pra@govmu.org)',

  historyTitle: 'History',
  historyEmpty: 'Nothing saved yet. Tap "Save to history" on a result.',
  historyClear: 'Clear history',

  sourcesTitle: 'Our sources',
  // Shield (decision 15), texts from D's docs/strings-shield.md
  shieldSwitch: 'Check new messages automatically',
  shieldSwitchHint: 'WhatsApp and SMS, on this phone only. Off unless you turn it on.',
  shieldSetupTitle: 'Automatic checking',
  shieldSetupWhat: 'When this is on, Verifye reads new WhatsApp and SMS notifications on this phone and checks them with the same rules. Nothing is saved or sent.',
  shieldSetupNot: "It doesn't read other apps, your photos or your contacts. You can turn it off at any time.",
  shieldStepAccess: '1. Allow notification access',
  shieldStepAccessHint: 'Android will open a list. Turn on Verifye.',
  shieldStepAlerts: '2. Allow Verifye to show alerts',
  shieldStepBattery: '3. Set battery use to "Unrestricted"',
  shieldStepBatteryHint: 'Some phones stop apps in the background. This keeps the check running.',
  shieldStepPreview: '4. Keep message previews on in WhatsApp',
  shieldStepPreviewHint: "WhatsApp → Settings → Notifications → Show preview. Without it, there's no text to check.",
  shieldOpenSettings: 'Open settings',
  shieldStepDone: 'Done',
  shieldLimits: "It can't check photos, voice notes or muted chats. For those, share or paste the message.",
  shieldDoneButton: 'Turn on automatic checking',
  shieldOnStatus: 'Automatic checking is on',
  shieldNeedsAccess: 'Notification access is off. Tap to turn it back on.',
  shieldAlertTitleSTOP: 'Stop – warning signs found',
  shieldAlertTitleCAREFUL: 'Be careful – warning signs found',
  shieldAlertBody: 'Tap to see why, before you pay.',
  shieldChannelName: 'Message checks',
  shieldChannelDescription: 'Alerts when a new message has warning signs.',

  sourcesHint: 'Every check uses these official records, bundled in the app.',
  sourcesRecords: 'records',
  sourcesChecked: 'checked',
  srcAgenciesTitle: 'Recruitment agencies',
  srcAgenciesText: '79 licences, Ministry of Labour list of 4 Nov 2026.',
  srcFeesTitle: 'Who pays recruitment costs',
  srcFeesText: 'Private Recruitment Agencies Act 2023 s.5 and Regulations 2025 reg 7(2).',
  srcBanksTitle: 'Banks and payment apps',
  srcBanksText: "18 banks and 3 payment providers, Bank of Mauritius list (13 Nov 2026). Phone numbers come from each bank's own website.",
  srcFscTitle: 'Investment warnings',
  srcFscText: '21 organisations named in Financial Services Commission alerts (2017–2026).',
  srcCertTitle: 'Security alert campaigns',
  srcCertText: '5 CERT-MU security alerts (Feb–Oct 2026).',

};

export type StringKey = keyof typeof en;
export type Language = 'en' | 'fr' | 'mfe';

const fr: Partial<Record<StringKey, string>> = {
  shieldSwitch: "Vérifier les nouveaux messages automatiquement",
  shieldSwitchHint: "WhatsApp et SMS, sur ce téléphone seulement. Désactivé tant que vous ne l'activez pas.",
  shieldSetupTitle: "Vérification automatique",
  shieldSetupWhat: "Quand c'est activé, Verifye lit les nouvelles notifications WhatsApp et SMS de ce téléphone et les vérifie avec les mêmes règles. Rien n'est enregistré ni envoyé.",
  shieldSetupNot: "Il ne lit pas les autres applications, vos photos ni vos contacts. Vous pouvez le désactiver à tout moment.",
  shieldStepAccess: "1. Autoriser l'accès aux notifications",
  shieldStepAccessHint: "Android va ouvrir une liste. Activez Verifye.",
  shieldStepAlerts: "2. Autoriser Verifye à afficher des alertes",
  shieldStepBattery: "3. Régler la batterie sur « Non restreinte »",
  shieldStepBatteryHint: "Certains téléphones arrêtent les applications en arrière-plan. Cela permet à la vérification de continuer.",
  shieldStepPreview: "4. Garder l'aperçu des messages dans WhatsApp",
  shieldStepPreviewHint: "WhatsApp → Paramètres → Notifications → Afficher l'aperçu. Sans cela, il n'y a aucun texte à vérifier.",
  shieldOpenSettings: "Ouvrir les paramètres",
  shieldStepDone: "Fait",
  shieldLimits: "Il ne peut pas vérifier les photos, les messages vocaux ni les discussions en sourdine. Pour ceux-là, partagez ou collez le message.",
  shieldDoneButton: "Activer la vérification automatique",
  shieldOnStatus: "La vérification automatique est activée",
  shieldNeedsAccess: "L'accès aux notifications est désactivé. Touchez ici pour le réactiver.",
  shieldAlertTitleSTOP: "Stop – signes d'alerte trouvés",
  shieldAlertTitleCAREFUL: "Attention – signes d'alerte trouvés",
  shieldAlertBody: "Touchez pour voir pourquoi, avant de payer.",
  shieldChannelName: "Vérification des messages",
  shieldChannelDescription: "Alertes quand un nouveau message présente des signes d'alerte.",
  findingInfo: "Bon à savoir",
  followUpLabel: "Ils demandent autre chose ?",
  followUpPlaceholder: "Collez leur nouveau message",
  followUpButton: "Ajouter à ce dossier et vérifier à nouveau",
  languageLabel: "Langue",
  scanTitle: "Vérifier un message",
  scanHint: "Collez ci-dessous un SMS, un message WhatsApp ou un e-mail suspect. Rien ne quitte votre téléphone.",
  scanPlaceholder: "Collez le message ici",
  scanButton: "Vérifier le message",
  scanEmpty: "Collez d'abord un message.",
  openHistory: "Historique",
  openSources: "Nos sources",
  levelSTOP: "Stop – risque élevé",
  levelCAREFUL: "Attention – vérifiez",
  levelNONE: "Aucun signe d'alerte trouvé – vérifiez quand même",
  resultTitle: "Résultat",
  resultMessage: "Le message",
  resultFindings: "Ce que nous avons trouvé",
  resultNoFindings: "Aucun signe d'alerte trouvé dans nos règles et les listes officielles. Appelez quand même le numéro officiel avant de payer.",
  resultJobButton: "Offre d'emploi ? Vérifiez l'agence",
  resultActionsButton: "Que faire maintenant",
  resultSave: "Enregistrer dans l'historique",
  resultSaved: "Enregistré",
  sourceLabel: "Source",
  jobTitle: "Vérifier l'offre d'emploi",
  jobAgencyLabel: "1. De quelle agence s'agit-il ?",
  jobSuggested: "Trouvée dans le message",
  jobSearch: "Chercher dans le registre du ministère",
  jobNoAgency: "Aucune agence choisie",
  jobCostLabel: "2. Que vous demande-t-on de payer ?",
  jobCheckButton: "Vérifier à nouveau",
  actionsTitle: "Que faire maintenant",
  actionsCall: "Appeler le numéro officiel",
  actionsCallHint: "Utilisez ce numéro, jamais celui du message.",
  actionsNoContacts: "Pas encore de numéro officiel pour ce message.",
  actionsShare: "Demandez à une personne de confiance",
  actionsShareButton: "Partager un résumé",
  actionsReport: "Signaler",
  reportMaucors: "MAUCORS (signalement en ligne au CERT-MU et à la police)",
  reportMinistry: "Ministère du Travail, agences de recrutement (pra@govmu.org)",
  historyTitle: "Historique",
  historyEmpty: "Rien d'enregistré pour l'instant. Touchez « Enregistrer dans l'historique » sur un résultat.",
  historyClear: "Effacer l'historique",
  sourcesTitle: "Nos sources",
  sourcesHint: "Chaque vérification utilise ces données officielles, incluses dans l'application.",
  sourcesRecords: "entrées",
  sourcesChecked: "vérifié",
};
const mfe: Partial<Record<StringKey, string>> = {
  findingInfo: "Bon pou kone",
  followUpLabel: "Zot pe dimann enn lot zafer?",
  followUpPlaceholder: "Kol zot nouvo mesaz isi",
  followUpButton: "Azout dan sa dosie la ek verifye ankor",
  languageLabel: "Lang",
  scanTitle: "Verifye enn mesaz",
  scanHint: "Kol enn SMS, WhatsApp ou email ki ou dout la anba. Nanye pa sorti depi ou telefonn.",
  scanPlaceholder: "Kol mesaz la isi",
  scanButton: "Verifye mesaz la",
  scanEmpty: "Kol enn mesaz avan.",
  openHistory: "Istorik",
  openSources: "Nou bann sours",
  levelSTOP: "Aret – gran risk",
  levelCAREFUL: "Fer atansion – verifye",
  levelNONE: "Nou pa finn trouv okenn sinn danze – verifye kan mem",
  resultTitle: "Rezilta",
  resultMessage: "Mesaz la",
  resultFindings: "Seki nou finn trouve",
  resultNoFindings: "Nou pa finn trouv okenn sinn danze dan nou bann reg ek bann lis ofisiel. Kan mem, apel nimero ofisiel la avan ou peye.",
  resultJobButton: "Enn lofer travay? Verifye lazans la",
  resultActionsButton: "Ki pou fer aster",
  resultSave: "Gard dan istorik",
  resultSaved: "Finn gard",
  sourceLabel: "Sours",
  jobTitle: "Verifye lofer travay",
  jobAgencyLabel: "1. Ki lazans sa?",
  jobSuggested: "Trouv dan mesaz la",
  jobSearch: "Rod dan rezis Minister la",
  jobNoAgency: "Pa finn swazir okenn lazans",
  jobCostLabel: "2. Pou ki zot pe dimann ou peye?",
  jobCheckButton: "Verifye ankor",
  actionsTitle: "Ki pou fer aster",
  actionsCall: "Apel nimero ofisiel la",
  actionsCallHint: "Servi sa nimero la, zamè sa enn ki dan mesaz la.",
  actionsNoContacts: "Pena nimero ofisiel pou sa mesaz la ankor.",
  actionsShare: "Dimann enn dimounn ki ou ena konfians",
  actionsShareButton: "Partaz enn rezime",
  actionsReport: "Fer enn rapor",
  reportMaucors: "MAUCORS (rapor lor internet ar CERT-MU ek lapolis)",
  reportMinistry: "Minister Travay, lazans rekritman (pra@govmu.org)",
  historyTitle: "Istorik",
  historyEmpty: "Nanye pa finn gard ankor. Tap « Gard dan istorik » lor enn rezilta.",
  historyClear: "Efas istorik",
  sourcesTitle: "Nou bann sours",
  sourcesHint: "Sak verifikasion servi sa bann done ofisiel la, ki deza dan aplikasion la.",
  sourcesRecords: "antre",
  sourcesChecked: "verifye",
};

const all = { en, fr, mfe };

// The language is chosen on the Scan screen; the store (src/lib/store.tsx) calls setLanguage and re-renders the app.
let current: Language = 'en';

export function setLanguage(language: Language) {
  current = language;
}

export function t(key: StringKey, language: Language = current): string {
  return all[language][key] ?? en[key];
}

export function getLanguage(): Language {
  return current;
}

// Finding titles by kind, from A's docs/strings-fr-mfe.md section 2.
const findingTitles: Record<string, Record<Language, string>> = {
  // Surprise card kinds (engine 20:48), Kreol from Adiyen (21:01).
  empty_message: { en: "Paste the whole message to check it", fr: "Collez le message en entier pour le vérifier", mfe: "Kol mesaz la an antie pou nou kapav verifye li" },
  message_truncated: { en: "Only the first part was checked", fr: "Seul le début du message a été vérifié", mfe: "Nou finn verifye zis koumansman mesaz la" },
  cost_unknown: { en: "We couldn't match that cost", fr: "Nous n'avons pas reconnu ce coût", mfe: "Nou pa finn rekonet sa fre la" },
  check_failed: { en: "We couldn't check this message", fr: "Nous n'avons pas pu vérifier ce message", mfe: "Nou pa finn kapav verifye sa mesaz la" },
  code_request: { en: "Asks for a code, PIN or password", fr: "Demande un code, un PIN ou un mot de passe", mfe: "Pe dimann enn kod, PIN ouswa mo de pas" },
  bank_link: { en: "Link is not {name}'s official website", fr: "Ce lien n'est pas le site officiel de {name}", mfe: "Sa lien la pa sit ofisiel {name}" },
  bank_phone: { en: "Number is not {name}'s official number", fr: "Ce numéro n'est pas le numéro officiel de {name}", mfe: "Sa nimero la pa nimero ofisiel {name}" },
  bank_alarm: { en: "Alarm about your account", fr: "Alerte sur votre compte", mfe: "Lalarm lor ou kont" },
  fsc_alert: { en: "The FSC warned about {name}", fr: "La FSC a publié une alerte sur {name}", mfe: "FSC finn averti piblik lor {name}" },
  job_fee: { en: "A job cost the employer must pay", fr: "Un coût que l'employeur doit payer", mfe: "Enn fre ki patron bizin peye" },
  agency_listed: { en: "{name} is listed for jobs abroad", fr: "{name} figure sur la liste pour les emplois à l'étranger", mfe: "{name} lor lis pou travay aletranze" },
  agency_not_found: { en: "Not found in the Ministry list of {date}", fr: "Introuvable dans la liste du ministère du {date}", mfe: "Pa trouv dan lis Minister {date}" },
  agency_wrong_category: { en: "{name} is listed, but not for jobs abroad", fr: "{name} figure sur la liste, mais pas pour les emplois à l'étranger", mfe: "{name} lor lis, me pa pou travay aletranze" },
  agency_expired: { en: "{name}: licence not valid today", fr: "{name} : licence non valide aujourd'hui", mfe: "{name}: lisans pa valid zordi" },
  urgency: { en: "Pressure to act fast", fr: "Pression pour agir vite", mfe: "Pe fors ou azir vit" },
  payment_request: { en: "Asks you to pay or send money", fr: "Vous demande de payer ou d'envoyer de l'argent", mfe: "Pe dimann ou peye ouswa avoy larzan" },
  prize_gift: { en: "Prize, gift or bonus", fr: "Prix, cadeau ou bonus", mfe: "Pri, kado ouswa bonis" },
  guaranteed_returns: { en: "Promise of guaranteed profit", fr: "Promesse de profit garanti", mfe: "Promes enn profi garanti" },
  new_number: { en: "Says they have a new number", fr: "Dit avoir un nouveau numéro", mfe: "Dir ki li ena enn nouvo nimero" },
  odd_link: { en: "Suspicious link", fr: "Lien suspect", mfe: "Lien sispe" },
  cert_alert: { en: "Matches a CERT-MU alert: {campaign}", fr: "Correspond à une alerte du CERT-MU : {campaign}", mfe: "Parey kouma enn lalert CERT-MU: {campaign}" },
};

/** Turns an English template like "Link is not {name}'s official website" into a pattern that captures {name}. */
function templatePattern(template: string): { pattern: RegExp; names: string[] } {
  const names: string[] = [];
  const parts = template.split(/(\{\w+\})/).map((part) => {
    const placeholder = part.match(/^\{(\w+)\}$/);
    if (placeholder) {
      names.push(placeholder[1]);
      return '(.+)';
    }
    return part.replace(/[.*+?^$|()[\]\\{}]/g, '\\$&');
  });
  return { pattern: new RegExp('^' + parts.join('') + '$'), names };
}

/**
 * The finding's title in the current language.
 * The engine writes the English title with the values already in it ("Link is not MCB's official website").
 * We match it against the English template to get the values back, then put them into the French or Kreol text.
 * If anything doesn't match, we show the engine's English title, so nothing is ever lost.
 */
export function findingTitle(finding: { kind: string; title: string }): string {
  const titles = findingTitles[finding.kind];
  if (!titles || current === 'en') return finding.title;

  const { pattern, names } = templatePattern(titles.en);
  const match = finding.title.match(pattern);
  if (!match) return finding.title;

  let text = titles[current];
  if (!text) return finding.title; // not translated yet
  names.forEach((name, i) => {
    text = text.replace('{' + name + '}', match[i + 1]);
  });
  return text;
}
