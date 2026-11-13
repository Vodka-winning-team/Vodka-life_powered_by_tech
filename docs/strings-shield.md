# Shield screen texts (Person D → Jayesh)

For `src/constants/strings.ts`, in the `en`, `fr` and `mfe` objects. The design is in [`proposal-shield-optin.md`](proposal-shield-optin.md).
Wording rule in all three languages: no "safe", "genuine", "scam" or "illegal" (*sûr, authentique, arnaque, illégal*; *sekirite, vre, arnak, ilegal*).
**Kreol: approved by Paveesh (native speaker) on Sat 14 Nov. Ready to paste.** Later fixes go here first, then in `strings.ts`.
Android's own permission screens (Notification access, battery) are in the phone's language, so we don't translate them.

## 1. Where each text appears

| key | Where | English |
|---|---|---|
| shieldSwitch | Scan screen, switch label (Android only) | Check new messages automatically |
| shieldSwitchHint | Under the switch | WhatsApp and SMS, on this phone only. Off unless you turn it on. |
| shieldSetupTitle | Setup screen title | Automatic checking |
| shieldSetupWhat | Setup, first paragraph | When this is on, Verifye reads new WhatsApp and SMS notifications on this phone and checks them with the same rules. Nothing is saved or sent. |
| shieldSetupNot | Setup, second paragraph | It doesn't read other apps, your photos or your contacts. You can turn it off at any time. |
| shieldStepAccess | Setup step 1 | 1. Allow notification access |
| shieldStepAccessHint | Under step 1 | Android will open a list. Turn on Verifye. |
| shieldStepAlerts | Setup step 2 | 2. Allow Verifye to show alerts |
| shieldStepBattery | Setup step 3 | 3. Set battery use to "Unrestricted" |
| shieldStepBatteryHint | Under step 3 | Some phones stop apps in the background. This keeps the check running. |
| shieldStepPreview | Setup step 4 | 4. Keep message previews on in WhatsApp |
| shieldStepPreviewHint | Under step 4 | WhatsApp → Settings → Notifications → Show preview. Without it, there's no text to check. |
| shieldOpenSettings | Button on each step | Open settings |
| shieldStepDone | Shown when a step is done | Done |
| shieldLimits | Bottom of setup | It can't check photos, voice notes or muted chats. For those, share or paste the message. |
| shieldDoneButton | Last button of setup | Turn on automatic checking |
| shieldOnStatus | Scan screen, switch on | Automatic checking is on |
| shieldNeedsAccess | Scan screen, if access was removed | Notification access is off. Tap to turn it back on. |
| shieldAlertTitleSTOP | Phone alert, level STOP | Stop – warning signs found |
| shieldAlertTitleCAREFUL | Phone alert, level CAREFUL | Be careful – warning signs found |
| shieldAlertBody | Phone alert, second line | Tap to see why, before you pay. |
| shieldChannelName | Android notification channel name | Message checks |
| shieldChannelDescription | Android notification channel description | Alerts when a new message has warning signs. |

The debug-only button **"Send test alert"** stays in English (it's for us, not for users).

## 2. French and Kreol

| key | French | Kreol (approved by Paveesh) |
|---|---|---|
| shieldSwitch | Vérifier les nouveaux messages automatiquement | Verifye nouvo mesaz otomatikman |
| shieldSwitchHint | WhatsApp et SMS, sur ce téléphone seulement. Désactivé tant que vous ne l'activez pas. | WhatsApp ek SMS, lor sa telefonn la selman. Li pa marse tanki ou pa met li. |
| shieldSetupTitle | Vérification automatique | Verifikasion otomatik |
| shieldSetupWhat | Quand c'est activé, Verifye lit les nouvelles notifications WhatsApp et SMS de ce téléphone et les vérifie avec les mêmes règles. Rien n'est enregistré ni envoyé. | Kan sa li marse, Verifye li bann nouvo notifikasion WhatsApp ek SMS lor sa telefonn la ek verifye zot avek mem bann reg. Nanye pa gard, nanye pa avoye. |
| shieldSetupNot | Il ne lit pas les autres applications, vos photos ni vos contacts. Vous pouvez le désactiver à tout moment. | Li pa li lezot aplikasion, ou bann foto ou ou bann kontak. Ou kapav tengn li nimport kan. |
| shieldStepAccess | 1. Autoriser l'accès aux notifications | 1. Permet akse ar notifikasion |
| shieldStepAccessHint | Android va ouvrir une liste. Activez Verifye. | Android pou ouver enn lis. Met Verifye lor ON. |
| shieldStepAlerts | 2. Autoriser Verifye à afficher des alertes | 2. Permet Verifye montre bann alert |
| shieldStepBattery | 3. Régler la batterie sur « Non restreinte » | 3. Met batri lor « Unrestricted » |
| shieldStepBatteryHint | Certains téléphones arrêtent les applications en arrière-plan. Cela permet à la vérification de continuer. | Sertin telefonn aret bann aplikasion ki pe marse andeor. Sa permet verifikasion la kontinie marse. |
| shieldStepPreview | 4. Garder l'aperçu des messages dans WhatsApp | 4. Les aperçu mesaz lor ON dan WhatsApp |
| shieldStepPreviewHint | WhatsApp → Paramètres → Notifications → Afficher l'aperçu. Sans cela, il n'y a aucun texte à vérifier. | WhatsApp → Settings → Notifications → Show preview. San sa, pena okenn text pou verifye. |
| shieldOpenSettings | Ouvrir les paramètres | Ouver paramet |
| shieldStepDone | Fait | Fini |
| shieldLimits | Il ne peut pas vérifier les photos, les messages vocaux ni les discussions en sourdine. Pour ceux-là, partagez ou collez le message. | Li pa kapav verifye foto, mesaz vokal ou bann chat ki ou finn met an silans. Pou sa, partaz ou kol mesaz la. |
| shieldDoneButton | Activer la vérification automatique | Met verifikasion otomatik lor ON |
| shieldOnStatus | La vérification automatique est activée | Verifikasion otomatik pe marse |
| shieldNeedsAccess | L'accès aux notifications est désactivé. Touchez ici pour le réactiver. | Akse ar notifikasion finn tengn. Tap isi pou remet li. |
| shieldAlertTitleSTOP | Stop – signes d'alerte trouvés | Aret – sinn danze trouve |
| shieldAlertTitleCAREFUL | Attention – signes d'alerte trouvés | Fer atansion – sinn danze trouve |
| shieldAlertBody | Touchez pour voir pourquoi, avant de payer. | Tap pou trouv kifer, avan ou peye. |
| shieldChannelName | Vérification des messages | Verifikasion mesaz |
| shieldChannelDescription | Alertes quand un nouveau message présente des signes d'alerte. | Alert kan enn nouvo mesaz ena sinn danze. |

Kreol notes: *marse* = running/on, *tengn* = turned off, *sinn danze* = warning signs (the same words as `levelNONE`), *aperçu* left in French because Mauritian WhatsApp screens are in English or French. In step 4 the menu names stay in English, as WhatsApp shows them on most phones here.

## 3. Paste-ready blocks for `strings.ts`

```ts
// en
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
```

```ts
// fr
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
```

```ts
// mfe (Kreol: approved by Paveesh)
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
```
