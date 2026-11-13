# French and Kreol screen texts (Person A → Jayesh)

For `src/constants/strings.ts`: same keys as the `en` object. `appName` and `tagline` stay as they are in every language.

Wording rule, kept in all three languages: no "safe", "genuine", "scam" or "illegal". That means no *sûr / authentique / arnaque / illégal* in French, and no *sekirite / vre / arnak / ilegal* in Kreol.

Kreol uses the standard Kreol Morisien spelling (*Grafi Larmoni*: mesaz, nimero, verifye, lazans). **Please get a native speaker to read the Kreol column before the demo**; fix it here first, then in `strings.ts`.

## 1. Screen texts

| key | English | French | Kreol |
|---|---|---|---|
| scanTitle | Check a message | Vérifier un message | Verifye enn mesaz |
| scanHint | Paste a suspicious SMS, WhatsApp or email below. Nothing leaves your phone. | Collez ci-dessous un SMS, un message WhatsApp ou un e-mail suspect. Rien ne quitte votre téléphone. | Kol enn SMS, WhatsApp ou email ki ou dout la anba. Nanye pa sorti depi ou telefonn. |
| scanPlaceholder | Paste the message here | Collez le message ici | Kol mesaz la isi |
| scanButton | Check message | Vérifier le message | Verifye mesaz la |
| scanEmpty | Paste a message first. | Collez d'abord un message. | Kol enn mesaz avan. |
| openHistory | History | Historique | Istorik |
| openSources | Our sources | Nos sources | Nou bann sours |
| levelSTOP | Stop – high risk | Stop – risque élevé | Aret – gran risk |
| levelCAREFUL | Be careful – verify | Attention – vérifiez | Fer atansion – verifye |
| levelNONE | No warning signs found – still verify | Aucun signe d'alerte trouvé – vérifiez quand même | Nou pa finn trouv okenn sinn danze – verifye kan mem |
| resultTitle | Result | Résultat | Rezilta |
| resultMessage | The message | Le message | Mesaz la |
| resultFindings | What we found | Ce que nous avons trouvé | Seki nou finn trouve |
| resultNoFindings | No warning signs found in our rules and official lists. Still call the official number before you pay. | Aucun signe d'alerte trouvé dans nos règles et les listes officielles. Appelez quand même le numéro officiel avant de payer. | Nou pa finn trouv okenn sinn danze dan nou bann reg ek bann lis ofisiel. Kan mem, apel nimero ofisiel la avan ou peye. |
| resultJobButton | Job offer? Check the agency | Offre d'emploi ? Vérifiez l'agence | Enn lofer travay? Verifye lazans la |
| resultActionsButton | What to do now | Que faire maintenant | Ki pou fer aster |
| resultSave | Save to history | Enregistrer dans l'historique | Gard dan istorik |
| resultSaved | Saved | Enregistré | Finn gard |
| sourceLabel | Source | Source | Sours |
| followUpLabel | They asked for something new? | Ils demandent autre chose ? | Zot pe dimann enn lot zafer? |
| followUpPlaceholder | Paste their new message | Collez leur nouveau message | Kol zot nouvo mesaz isi |
| followUpButton | Add to this case and check again | Ajouter à ce dossier et vérifier à nouveau | Azout dan sa dosie la ek verifye ankor |
| jobTitle | Job check | Vérifier l'offre d'emploi | Verifye lofer travay |
| jobAgencyLabel | 1. Which agency is it? | 1. De quelle agence s'agit-il ? | 1. Ki lazans sa? |
| jobSuggested | Found in the message | Trouvée dans le message | Trouv dan mesaz la |
| jobSearch | Search the Ministry register | Chercher dans le registre du ministère | Rod dan rezis Minister la |
| jobNoAgency | No agency picked | Aucune agence choisie | Pa finn swazir okenn lazans |
| jobCostLabel | 2. What are they asking you to pay for? | 2. Que vous demande-t-on de payer ? | 2. Pou ki zot pe dimann ou peye? |
| jobCheckButton | Check again | Vérifier à nouveau | Verifye ankor |
| actionsTitle | What to do now | Que faire maintenant | Ki pou fer aster |
| actionsCall | Call the official number | Appeler le numéro officiel | Apel nimero ofisiel la |
| actionsCallHint | Use this number, never the one in the message. | Utilisez ce numéro, jamais celui du message. | Servi sa nimero la, zamè sa enn ki dan mesaz la. |
| actionsNoContacts | No official number for this message yet. | Pas encore de numéro officiel pour ce message. | Pena nimero ofisiel pou sa mesaz la ankor. |
| actionsShare | Ask someone you trust | Demandez à une personne de confiance | Dimann enn dimounn ki ou ena konfians |
| actionsShareButton | Share a summary | Partager un résumé | Partaz enn rezime |
| actionsReport | Report it | Signaler | Fer enn rapor |
| reportMaucors | MAUCORS (online report to CERT-MU and the police) | MAUCORS (signalement en ligne au CERT-MU et à la police) | MAUCORS (rapor lor internet ar CERT-MU ek lapolis) |
| reportMinistry | Ministry of Labour, recruitment agencies (pra@govmu.org) | Ministère du Travail, agences de recrutement (pra@govmu.org) | Minister Travay, lazans rekritman (pra@govmu.org) |
| historyTitle | History | Historique | Istorik |
| historyEmpty | Nothing saved yet. Tap "Save to history" on a result. | Rien d'enregistré pour l'instant. Touchez « Enregistrer dans l'historique » sur un résultat. | Nanye pa finn gard ankor. Tap « Gard dan istorik » lor enn rezilta. |
| historyClear | Clear history | Effacer l'historique | Efas istorik |
| sourcesTitle | Our sources | Nos sources | Nou bann sours |
| sourcesHint | Every check uses these official records, bundled in the app. | Chaque vérification utilise ces données officielles, incluses dans l'application. | Sak verifikasion servi sa bann done ofisiel la, ki deza dan aplikasion la. |
| sourcesRecords | records | entrées | antre |
| sourcesChecked | checked | vérifié | verifye |
| sampleButton | Try a sample message (fictional) | Essayer un message d'exemple (fictif) | Seye enn mesaz egzanp (fiktif) |

## 2. Finding titles by `kind`

These are for Jayesh's task "translate finding titles by `kind`". The English is the engine's title. `{name}`, `{date}` and `{campaign}` are filled in by the app: `{name}` is a bank, agency or firm name, `{date}` comes from `prettyDate()`, and `{campaign}` is the CERT-MU campaign name.

| kind | English | French | Kreol |
|---|---|---|---|
| code_request | Asks for a code, PIN or password | Demande un code, un PIN ou un mot de passe | Pe dimann enn kod, PIN ouswa mo de pas |
| bank_link | Link is not {name}'s official website | Ce lien n'est pas le site officiel de {name} | Sa lien la pa sit ofisiel {name} |
| bank_phone | Number is not {name}'s official number | Ce numéro n'est pas le numéro officiel de {name} | Sa nimero la pa nimero ofisiel {name} |
| bank_alarm | Alarm about your account | Alerte sur votre compte | Lalarm lor ou kont |
| fsc_alert | The FSC warned about {name} | La FSC a publié une alerte sur {name} | FSC finn averti piblik lor {name} |
| job_fee | A job cost the employer must pay | Un coût que l'employeur doit payer | Enn fre ki patron bizin peye |
| agency_listed | {name} is listed for jobs abroad | {name} figure sur la liste pour les emplois à l'étranger | {name} lor lis pou travay aletranze |
| agency_not_found | Not found in the Ministry list of {date} | Introuvable dans la liste du ministère du {date} | Pa trouv dan lis Minister {date} |
| agency_wrong_category | {name} is listed, but not for jobs abroad | {name} figure sur la liste, mais pas pour les emplois à l'étranger | {name} lor lis, me pa pou travay aletranze |
| agency_expired | {name}: licence not valid today | {name} : licence non valide aujourd'hui | {name}: lisans pa valid zordi |
| urgency | Pressure to act fast | Pression pour agir vite | Pe fors ou azir vit |
| payment_request | Asks you to pay or send money | Vous demande de payer ou d'envoyer de l'argent | Pe dimann ou peye ouswa avoy larzan |
| prize_gift | Prize, gift or bonus | Prix, cadeau ou bonus | Pri, kado ouswa bonis |
| guaranteed_returns | Promise of guaranteed profit | Promesse de profit garanti | Promes enn profi garanti |
| new_number | Says they have a new number | Dit avoir un nouveau numéro | Dir ki li ena enn nouvo nimero |
| odd_link | Suspicious link | Lien suspect | Lien sispe |
| cert_alert | Matches a CERT-MU alert: {campaign} | Correspond à une alerte du CERT-MU : {campaign} | Parey kouma enn lalert CERT-MU: {campaign} |

## 3. Ready to paste into `strings.ts`

```ts
const fr: Partial<Record<StringKey, string>> = {
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
  followUpLabel: "Ils demandent autre chose ?",
  followUpPlaceholder: "Collez leur nouveau message",
  followUpButton: "Ajouter à ce dossier et vérifier à nouveau",
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
  sampleButton: "Essayer un message d'exemple (fictif)",
};

const mfe: Partial<Record<StringKey, string>> = {
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
  followUpLabel: "Zot pe dimann enn lot zafer?",
  followUpPlaceholder: "Kol zot nouvo mesaz isi",
  followUpButton: "Azout dan sa dosie la ek verifye ankor",
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
  sampleButton: "Seye enn mesaz egzanp (fiktif)",
};
```
