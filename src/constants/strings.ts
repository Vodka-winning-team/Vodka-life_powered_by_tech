// ALL text shown in the app lives here. English first; A fills French (fr) and Kreol (mfe) later.
// A missing fr/mfe text falls back to English.
// Wording rule: never "safe", "genuine", "scam" or "illegal" in any language.

import { categoryTexts, costTexts, detailTexts, jobFeeGeneral } from './finding-texts';

const en = {
  appName: 'Verifye',
  tagline: 'Verifye avan ou peye: check before you pay',

  languageLabel: 'Language',
  settingsTitle: 'Settings',
  welcomeTitle: 'Set up Verifye',
  welcomeHint: 'Choose what suits you. You can change these any time in Settings.',
  welcomeStart: 'Start',
  needsOnline: 'This check needs Online checks to be on (Settings).',
  sttSpeak: 'Say the message',
  sttStop: 'Stop listening',
  sttNeedsMic: 'To hear you, Verifye needs the microphone.',
  qrTitle: 'Scan a QR code',
  qrHint: 'Point the camera at the QR code.',
  qrSafe: 'Verifye checks what the code holds before anything opens. It never opens the link itself.',
  qrNeedsCamera: 'To read a QR code, Verifye needs the camera. Nothing is recorded or saved.',
  qrAllow: 'Allow the camera',
  nightMode: 'Night mode',
  onlineMode: 'Online checks',
  onlineModeOnHint: 'On: links and numbers are also checked online, through our server.',
  onlineModeOffHint: 'Off: fully offline. Every check runs on this phone and nothing is sent.',
  tourWelcome: 'Welcome to Verifye! Take a 1-minute tour with a practice message. It is made up, and nothing is sent to anyone.',
  tourStart: 'Start the tour',
  tourSkip: 'Skip',
  tourNext: 'Next',
  tourDone: 'Finish',
  tourAgain: 'Show the tour again',
  tourPaste: 'This is a practice message, like one you might get on WhatsApp. With a real one, paste it in this box, or share it to Verifye from WhatsApp or SMS.',
  tourCheck: 'Now tap "Check message", just below.',
  tourLevel: 'The colour gives the answer at a glance: red means stop, yellow means be careful, black means no warning signs were found.',
  tourActions: 'This button shows what to do next, with the official numbers to call.',
  tourRead: 'Hard to read? Tap "Read aloud" and Verifye reads the result to you.',
  tourFound: 'The highlighted words are the warning signs. Below, each one is explained, with its source. That is all: you are ready!',
  onlineTitle: 'Online check',
  notMessageTitle: 'Please check your text',
  notMessage: "This doesn't look like a message. Paste the whole message you received (SMS, WhatsApp or email).",
  onlineNothing: 'The online checks found nothing more.',
  learnTitle: 'Learn the tricks',
  learnTricksTitle: 'The tricks, one by one',
  quizTitle: 'Quiz: spot the warning signs',
  quizRight: 'Correct',
  quizWrong: 'Not quite',
  quizNext: 'Next question',
  quizScore: 'Your score',
  quizAgain: 'Try again',
  payTitle: 'Before you pay',
  payHint: 'About to send money? Check who you are paying first. Verifye never makes a payment.',
  payName: 'Name of the person or company (optional)',
  payAccount: 'Their account, Juice or phone number',
  payAmount: 'Amount (Rs)',
  payButton: 'Check before paying',
  payMissing: 'Enter the account or number, and the amount.',
  payWait: 'Take a moment before you pay',
  onlineLoading: 'Checking online…',
  onlineOffline: "Can't reach the server. The checks on your phone still work.",
  onlineScore: 'Risk score',
  onlineIntelTitle: 'Live link and number checks',
  onlineReports: 'Reports from other users',
  onlineReportButton: 'Report this message',
  onlineReportHint: 'A report helps warn the next person who gets this message.',
  serverLabel: 'Server address (online checks)',
  // Granny mode (Adiyen, 22:45). The one plain sentence on the Result screen, per level.
  grannyMode: 'Granny mode: bigger text and buttons',
  grannySTOP: "Don't pay or send anything. First call the official number below.",
  grannyCAREFUL: 'Be careful. Before you pay, call the official number yourself.',
  grannyNONE: 'We found no warning signs. If it asks you for money or a code, call the official number first.',
  scanTitle: 'Check a message',
  scanHint: 'Paste a suspicious SMS, WhatsApp or email below.',
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
  resultNoFindings: 'No warning signs found in our rules and official lists. If it asks you for money or a code, call the official number first.',
  resultJobButton: 'Job offer? Check the agency',
  resultActionsButton: 'What to do now',
  resultSave: 'Save to history',
  resultSaved: 'Saved',
  followUpLabel: 'They asked for something new?',
  followUpPlaceholder: 'Paste their new message',
  followUpButton: 'Add to this case and check again',
  sourceLabel: 'Source',
  readAloud: 'Read aloud',
  stopReading: 'Stop reading',
  checkedAgainst: 'Checked against these official records:',
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
  // Official numbers (Adiyen, 22:47)
  numbersTitle: 'Official numbers',
  scanNumbersButton: 'Search an agency or bank',
  numbersSearch: 'Search a name or a number',
  numberListed: "Listed as {name}'s official number ({source}).",
  numberSpoofWarning: 'Callers can fake the number they show. If someone calls you from it, hang up and call this number back yourself.',
  numberNotListed: "This number is not in our official lists ({agencies} recruitment licences, {banks} banks and payment apps). That doesn't prove anything either way: don't pay, and call the organisation on its official number.",
  numbersHint: "Numbers from the official lists. Being listed doesn't prove a message is from them.",
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

  // Tabs, paste button and home screen widget (05:30)
  tabCheck: 'Check',
  tabNumbers: 'Is it official?',
  tabLearn: 'Learn',
  tabHistory: 'History',
  pasteButton: 'Paste the copied message',
  clipboardEmpty: 'Nothing is copied yet. Copy the message in WhatsApp or SMS first, then try again.',
  widgetCheck: 'Check copied message',
  widgetAlertLabel: 'Latest security alert',
  widgetShieldOn: 'Automatic checking: on',
  widgetShieldOff: 'Automatic checking: off',
};

export type StringKey = keyof typeof en;
export type Language = 'en' | 'fr' | 'mfe';

const fr: Partial<Record<StringKey, string>> = {
  settingsTitle: "Réglages",
  welcomeTitle: "Réglez Verifye",
  welcomeHint: "Choisissez ce qui vous convient. Vous pouvez changer cela à tout moment dans les Réglages.",
  welcomeStart: "Commencer",
  needsOnline: "Cette vérification a besoin des vérifications en ligne (Réglages).",
  sttSpeak: "Dire le message",
  sttStop: "Arrêter l'écoute",
  sttNeedsMic: "Pour vous entendre, Verifye a besoin du micro.",
  srcAgenciesTitle: "Agences de recrutement",
  srcAgenciesText: "79 licences, liste du ministère du Travail du 4 nov. 2026.",
  srcFeesTitle: "Qui paie les frais de recrutement",
  srcFeesText: "Private Recruitment Agencies Act 2023, art. 5, et Regulations 2025, règl. 7(2).",
  srcBanksTitle: "Banques et applis de paiement",
  srcBanksText: "18 banques et 3 prestataires de paiement, liste de la Banque de Maurice (13 nov. 2026). Les numéros viennent du site de chaque banque.",
  srcFscTitle: "Alertes sur les placements",
  srcFscText: "21 organismes cités dans les alertes de la Financial Services Commission (2017–2026).",
  srcCertTitle: "Campagnes d'alerte de sécurité",
  srcCertText: "5 alertes de sécurité du CERT-MU (févr.–oct. 2026).",
  qrTitle: "Scanner un code QR",
  qrHint: "Pointez la caméra vers le code QR.",
  qrSafe: "Verifye vérifie ce que contient le code avant que quoi que ce soit ne s'ouvre. Il n'ouvre jamais le lien lui-même.",
  qrNeedsCamera: "Pour lire un code QR, Verifye a besoin de la caméra. Rien n'est enregistré ni sauvegardé.",
  qrAllow: "Autoriser la caméra",
  nightMode: "Mode nuit",
  onlineMode: "Vérifications en ligne",
  onlineModeOnHint: "Activé : les liens et numéros sont aussi vérifiés en ligne, par notre serveur.",
  onlineModeOffHint: "Désactivé : entièrement hors ligne. Tout est vérifié sur ce téléphone et rien n'est envoyé.",
  tourWelcome: "Bienvenue sur Verifye ! Faites une visite d'une minute avec un message d'essai. Il est inventé, et rien n'est envoyé à personne.",
  tourStart: "Commencer la visite",
  tourSkip: "Passer",
  tourNext: "Suivant",
  tourDone: "Terminer",
  tourAgain: "Revoir la visite",
  tourPaste: "Voici un message d'essai, comme vous pourriez en recevoir sur WhatsApp. Avec un vrai message, collez-le dans cette case, ou partagez-le vers Verifye depuis WhatsApp ou vos SMS.",
  tourCheck: "Touchez maintenant le bouton de vérification, juste en dessous.",
  tourLevel: "La couleur donne la réponse d'un coup d'œil : rouge, arrêtez ; jaune, soyez prudent ; noir, aucun signe d'alerte trouvé.",
  tourActions: "Ce bouton montre quoi faire ensuite, avec les numéros officiels à appeler.",
  tourRead: "Difficile à lire ? Touchez le bouton de lecture et Verifye vous lit le résultat.",
  tourFound: "Les mots surlignés sont les signes d'alerte. Plus bas, chacun est expliqué, avec sa source. C'est tout : vous êtes prêt !",
  onlineTitle: "Vérification en ligne",
  notMessageTitle: "Vérifiez votre texte",
  notMessage: "Cela ne ressemble pas à un message. Collez en entier le message que vous avez reçu (SMS, WhatsApp ou e-mail).",
  onlineNothing: "Les vérifications en ligne n'ont rien trouvé de plus.",
  learnTitle: "Apprendre les pièges",
  learnTricksTitle: "Les pièges, un par un",
  quizTitle: "Quiz : repérez les signes d'alerte",
  quizRight: "Correct",
  quizWrong: "Pas tout à fait",
  quizNext: "Question suivante",
  quizScore: "Votre score",
  quizAgain: "Recommencer",
  payTitle: "Avant de payer",
  payHint: "Vous allez envoyer de l'argent ? Vérifiez d'abord à qui. Verifye ne fait jamais de paiement.",
  payName: "Nom de la personne ou de l'entreprise (facultatif)",
  payAccount: "Son compte, Juice ou numéro de téléphone",
  payAmount: "Montant (Rs)",
  payButton: "Vérifier avant de payer",
  payMissing: "Entrez le compte ou le numéro, et le montant.",
  payWait: "Prenez un moment avant de payer",
  onlineLoading: "Vérification en ligne…",
  onlineOffline: "Serveur injoignable. Les vérifications sur votre téléphone fonctionnent toujours.",
  onlineScore: "Score de risque",
  onlineIntelTitle: "Vérification en direct des liens et numéros",
  onlineReports: "Signalements d'autres utilisateurs",
  onlineReportButton: "Signaler ce message",
  onlineReportHint: "Un signalement aide à prévenir la prochaine personne qui reçoit ce message.",
  serverLabel: "Adresse du serveur (vérifications en ligne)",
  readAloud: "Lire à voix haute",
  stopReading: "Arrêter la lecture",
  checkedAgainst: "Vérifié avec ces listes officielles :",
  grannyMode: "Mode grand-mère : texte et boutons plus grands",
  grannySTOP: "Ne payez et n'envoyez rien. Appelez d'abord le numéro officiel ci-dessous.",
  grannyCAREFUL: "Attention. Avant de payer, appelez vous-même le numéro officiel.",
  grannyNONE: "Aucun signe d'alerte trouvé. Si on vous demande de l'argent ou un code, appelez d'abord le numéro officiel.",
  numbersTitle: "Numéros officiels",
  scanNumbersButton: "Chercher une agence ou une banque",
  numbersSearch: "Chercher un nom ou un numéro",
  numberListed: "Inscrit comme numéro officiel de {name} ({source}).",
  numberSpoofWarning: "Un appelant peut afficher un faux numéro. Si quelqu'un vous appelle de ce numéro, raccrochez et rappelez-le vous-même.",
  numberNotListed: "Ce numéro ne figure pas dans nos listes officielles ({agencies} licences d'agences de recrutement, {banks} banques et applis de paiement). Cela ne prouve rien : ne payez pas, et appelez l'organisme à son numéro officiel.",
  numbersHint: "Numéros des listes officielles. Être sur la liste ne prouve pas que le message vient d'eux.",
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
  scanHint: "Collez ci-dessous un SMS, un message WhatsApp ou un e-mail suspect.",
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
  resultNoFindings: "Aucun signe d'alerte trouvé dans nos règles et les listes officielles. Si on vous demande de l'argent ou un code, appelez d'abord le numéro officiel.",
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
  // Tabs, paste button and widget (draft French, 05:30)
  tabCheck: "Vérifier",
  tabNumbers: "C'est officiel ?",
  tabLearn: "Apprendre",
  tabHistory: "Historique",
  pasteButton: "Coller le message copié",
  clipboardEmpty: "Rien n'est copié. Copiez d'abord le message dans WhatsApp ou SMS, puis réessayez.",
  widgetCheck: "Vérifier le message copié",
  widgetAlertLabel: "Dernière alerte de sécurité",
  widgetShieldOn: "Vérification automatique : activée",
  widgetShieldOff: "Vérification automatique : désactivée",
};
const mfe: Partial<Record<StringKey, string>> = {
  // Welcome page, speech, and the sources (draft Kreol, needs Paveesh's check)
  settingsTitle: "Reglaz",
  welcomeTitle: "Regle Verifye",
  welcomeHint: "Swazir seki bon pou ou. Ou kapav sanz sa ninport ki ler dan Reglaz.",
  welcomeStart: "Koumanse",
  needsOnline: "Sa verifikasion la bizin verifikasion anlinn (Reglaz).",
  sttSpeak: "Dir mesaz la",
  sttStop: "Aret ekoute",
  sttNeedsMic: "Pou tann ou, Verifye bizin mikro la.",
  srcAgenciesTitle: "Lazans rekritman",
  srcAgenciesText: "79 lisans, lis Minister Travay 4 Nov 2026.",
  srcFeesTitle: "Kisannla pey fre rekritman",
  srcFeesText: "Private Recruitment Agencies Act 2023 s.5 ek Regulations 2025 reg 7(2).",
  srcBanksTitle: "Labank ek aplikasion peyman",
  srcBanksText: "18 labank ek 3 servis peyman, lis Labank Moris (13 Nov 2026). Bann nimero sorti lor sit sak labank.",
  srcFscTitle: "Lavertisman lor investisman",
  srcFscText: "21 lorganizasion ki bann lalert Financial Services Commission mansione (2017–2026).",
  srcCertTitle: "Kanpagn lalert CERT-MU",
  srcCertText: "5 lalert CERT-MU (Fev–Okt 2026).",
  // QR scanner (draft Kreol, needs Paveesh's check)
  qrTitle: "Skann enn kod QR",
  qrHint: "Vir kamera la lor kod QR la.",
  qrSafe: "Verifye gete ki ena dan kod la avan nanye ouver. Li zame ouver lien la li mem.",
  qrNeedsCamera: "Pou lir enn kod QR, Verifye bizin kamera la. Nanye pa anrezistre ni sove.",
  qrAllow: "Les kamera la",
  // Settings switches (draft Kreol, needs Paveesh's check)
  nightMode: "Mod lanwit",
  onlineMode: "Verifikasion anlinn",
  onlineModeOnHint: "Alime: bann lien ek nimero verifye anlinn osi, par nou server.",
  onlineModeOffHint: "Tengn: net san internet. Tou verifye lor sa telefonn la ek nanye pa avoye.",
  // First-time tour (draft Kreol, needs Paveesh's check)
  tourWelcome: "Bienvini lor Verifye! Fer enn ti vizit 1 minit avek enn mesaz pou pratike. Li invante, ek nanye pa avoye ar personn.",
  tourStart: "Koumans vizit la",
  tourSkip: "Sote",
  tourNext: "Swivan",
  tourDone: "Fini",
  tourAgain: "Remontre vizit la",
  tourPaste: "Sa enn mesaz pou pratike, kouma enn ki ou kapav gagne lor WhatsApp. Avek enn vre mesaz, kol li dan sa bwat la, ou partaz li ar Verifye depi WhatsApp ou SMS.",
  tourCheck: "Aster tous bouton verifikasion la, zis anba.",
  tourLevel: "Kouler la donn repons la enn sel kout: rouz, arete; zonn, fer atansion; nwar, pa finn trouv okenn sign danze.",
  tourActions: "Sa bouton la montre ki pou fer apre, avek bann nimero ofisiel pou apele.",
  tourRead: "Difisil pou lir? Tous bouton lir for ek Verifye lir rezilta la pou ou.",
  tourFound: "Bann mo ki souligne se bann sign danze. Pli anba, sak enn explike, avek so sours. Se tou: ou pare!",
  // Online screens (draft Kreol, Sat 14 Nov 04:30: needs Paveesh's check)
  onlineTitle: "Verifikasion anlinn",
  notMessageTitle: "Verifye ou text",
  notMessage: "Sa pa paret enn mesaz. Kol an antie mesaz ki ou finn gagne (SMS, WhatsApp ou email).",
  onlineNothing: "Bann verifikasion anlinn pa finn trouv nanye an plis.",
  onlineLoading: "Pe verifye anlinn…",
  onlineOffline: "Pa pe kapav zwenn server la. Verifikasion lor ou telefonn ankor pe marse.",
  onlineScore: "Skor risk",
  onlineIntelTitle: "Verifikasion an direk bann lien ek nimero",
  onlineReports: "Signalman lezot itilizater",
  onlineReportButton: "Signal sa mesaz la",
  onlineReportHint: "Enn signalman ed pou averti prosin dimoun ki gagn sa mesaz la.",
  serverLabel: "Ladres server (verifikasion anlinn)",
  learnTitle: "Aprann bann piez",
  learnTricksTitle: "Bann piez, enn par enn",
  quizTitle: "Kwiz: trouv bann sign danze",
  quizRight: "Korek",
  quizWrong: "Pa tou-a-fe",
  quizNext: "Prosin kestion",
  quizScore: "Ou skor",
  quizAgain: "Re-eseye",
  payTitle: "Avan ou peye",
  payHint: "Ou pe al avoy larzan? Verifye avan kisannla ou pe peye. Verifye zame fer enn peyman.",
  payName: "Non dimoun ou konpagni la (pa obligatwar)",
  payAccount: "So kont, Juice ou nimero telefonn",
  payAmount: "Montan (Rs)",
  payButton: "Verifye avan peye",
  payMissing: "Met kont ou nimero la, ek montan la.",
  payWait: "Pran enn ti moman avan ou peye",
  // Shield (approved by Paveesh, 01:02)
  shieldSwitch: "Verifye nouvo mesaz otomatikman",
  shieldSwitchHint: "WhatsApp ek SMS, lor sa telefonn la selman. Li pa marse tanki ou pa met li.",
  shieldSetupTitle: "Verifikasion otomatik",
  shieldSetupWhat: "Kan sa li marse, Verifye li bann nouvo notifikasion WhatsApp ek SMS lor sa telefonn la ek verifye zot avek mem bann reg. Nanye pa gard, nanye pa avoye.",
  shieldSetupNot: "Li pa li lezot aplikasion, ou bann foto ou ou bann kontak. Ou kapav tengn li nimport kan.",
  shieldStepAccess: "1. Permet akse ar notifikasion",
  shieldStepAccessHint: "Android pou ouver enn lis. Met Verifye lor ON.",
  shieldStepAlerts: "2. Permet Verifye montre bann alert",
  shieldStepBattery: "3. Met batri lor « Unrestricted »",
  shieldStepBatteryHint: "Sertin telefonn aret bann aplikasion ki pe marse andeor. Sa permet verifikasion la kontinie marse.",
  shieldStepPreview: "4. Les aperçu mesaz lor ON dan WhatsApp",
  shieldStepPreviewHint: "WhatsApp → Settings → Notifications → Show preview. San sa, pena okenn text pou verifye.",
  shieldOpenSettings: "Ouver paramet",
  shieldStepDone: "Fini",
  shieldLimits: "Li pa kapav verifye foto, mesaz vokal ou bann chat ki ou finn met an silans. Pou sa, partaz ou kol mesaz la.",
  shieldDoneButton: "Met verifikasion otomatik lor ON",
  shieldOnStatus: "Verifikasion otomatik pe marse",
  shieldNeedsAccess: "Akse ar notifikasion finn tengn. Tap isi pou remet li.",
  shieldAlertTitleSTOP: "Aret – sinn danze trouve",
  shieldAlertTitleCAREFUL: "Fer atansion – sinn danze trouve",
  shieldAlertBody: "Tap pou trouv kifer, avan ou peye.",
  shieldChannelName: "Verifikasion mesaz",
  shieldChannelDescription: "Alert kan enn nouvo mesaz ena sinn danze.",
  readAloud: "Lir for",
  stopReading: "Aret lir",
  checkedAgainst: "Nou finn verifye avek sa bann lis ofisiel la:",
  grannySTOP: "Pa peye ni avoy nanye. Avan tou, apel nimero ofisiel anba la.",
  grannyCAREFUL: "Fer atansion. Avan ou peye, apel nimero ofisiel la ou mem.",
  grannyNONE: "Nou pa finn trouv okenn sinn danze. Si zot dimann ou larzan ou enn kod, apel nimero ofisiel la avan.",
  grannyMode: "Mod granmer: ekritir ek bouton pli gro",
  numbersTitle: "Nimero ofisiel",
  scanNumbersButton: "Rod enn lazans ouswa enn labank",
  numbersSearch: "Rod enn non ouswa enn nimero",
  numberListed: "Lor lis kouma nimero ofisiel {name} ({source}).",
  numberSpoofWarning: "Enn dimoun kapav fer parett enn lot nimero lor ou telefonn. Si kikenn apel ou depi sa nimero la, rakros ek ou mem reapel li.",
  numberNotListed: "Sa nimero la pa lor nou bann lis ofisiel ({agencies} lisans lazans rekritman, {banks} labank ek aplikasion peyman). Sa pa prouv nanye: pa peye, ek apel lorganizasion la lor so nimero ofisiel.",
  numbersHint: "Nimero depi bann lis ofisiel. Lor lis pa pe dir ki mesaz la sorti kot zot.",
  findingInfo: "Bon pou kone",
  followUpLabel: "Zot pe dimann enn lot zafer?",
  followUpPlaceholder: "Kol zot nouvo mesaz isi",
  followUpButton: "Azout dan sa dosie la ek verifye ankor",
  languageLabel: "Lang",
  scanTitle: "Verifye enn mesaz",
  scanHint: "Kol enn SMS, WhatsApp ou email ki ou dout la anba.",
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
  resultNoFindings: "Nou pa finn trouv okenn sinn danze dan nou bann reg ek bann lis ofisiel. Si zot dimann ou larzan ou enn kod, apel nimero ofisiel la avan.",
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
  // Tabs, paste button and widget (draft Kreol, 05:30, needs Paveesh's check)
  tabCheck: "Verifye",
  tabNumbers: "Li ofisiel?",
  tabLearn: "Aprann",
  tabHistory: "Istorik",
  pasteButton: "Kol mesaz ki ou finn kopye",
  clipboardEmpty: "Narien pa finn kopye ankor. Kopye mesaz la dan WhatsApp ouswa SMS avan, apre esey ankor.",
  widgetCheck: "Verifye mesaz kopye",
  widgetAlertLabel: "Dernie lalert ofisiel",
  widgetShieldOn: "Verifikasion otomatik: pe marse",
  widgetShieldOff: "Verifikasion otomatik: pa pe marse",
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
  too_good: { en: "This offer sounds too good", fr: "Cette offre est trop belle", mfe: "Sa lofer la tro bon pou vre" },
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

// ---- Finding details, cost names and dates in the current language (Adiyen's tables, finding-texts.ts) ----

const FR_MONTHS: Record<string, string> = {
  Jan: 'janv.', Feb: 'févr.', Mar: 'mars', Apr: 'avr.', May: 'mai', Jun: 'juin',
  Jul: 'juil.', Aug: 'août', Sep: 'sept.', Oct: 'oct.', Nov: 'nov.', Dec: 'déc.',
};

/** "30 Jun 2026" → "30 juin 2026" in French; other languages keep it as it is. */
function localDate(date: string): string {
  if (current !== 'fr') return date;
  return date.replace(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/, (m) => FR_MONTHS[m] ?? m);
}

/** The cost name in the current language (by fee rule id), or the English one from the data. */
export function costName(costId: string, english: string): string {
  return costTexts[costId]?.[current] || english;
}

/** Same as costName, but found from the English name (the engine's vars.cost is the English cost). */
function costFromEnglish(english: string): string {
  const id = Object.keys(costTexts).find((k) => costTexts[k].en === english);
  return id ? costName(id, english) : english;
}

/**
 * The finding's explanation in the current language. Placeholders like {name} or {date} are filled from
 * the engine's finding.vars. If the kind is unknown or a value is missing, the engine's English is shown.
 */
export function findingDetail(finding: { kind: string; detail: string; vars?: Record<string, string> }): string {
  if (current === 'en') return finding.detail;
  const vars = finding.vars ?? {};
  const texts = finding.kind === 'job_fee' && vars.ref && vars.ref === vars.generalRef ? jobFeeGeneral : detailTexts[finding.kind];
  const template = texts?.[current];
  if (!template) return finding.detail;

  let missing = false;
  const text = template.replace(/\{(\w+)\}/g, (_, name: string) => {
    if (name === 'cost' && vars.cost) return costFromEnglish(vars.cost);
    if (name === 'categoryText' && vars.category) return categoryTexts[vars.category]?.[current] ?? vars.category;
    const value = vars[name];
    if (value === undefined || value === '') {
      missing = true;
      return '';
    }
    return name === 'date' || name === 'expiry' || name === 'validFrom' ? localDate(value) : value;
  });
  return missing ? finding.detail : text;
}
