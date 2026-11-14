// French and Kreol for what our server says on the "Online check" card.
// The server answers in English; these tables translate its fixed sentences, by their id.
// (Kreol is a draft: it needs a native speaker's check.)

import type { Language } from '@/constants/strings';

type Two = { fr: string; mfe: string };

/** Warning signs, by the server's tactic id. */
const TACTICS: Record<string, Two> = {
  blocklisted_link: { fr: "Lien sur une liste de sites dangereux", mfe: "Lien lor enn lis sit danzere" },
  abused_number: { fr: "Numéro de téléphone signalé récemment pour abus", mfe: "Nimero telefonn ki finn signale resaman" },
  community_confirmed: { fr: "Signalé par plusieurs téléphones", mfe: "Signale par plizir telefonn" },
  community_pending: { fr: "Signalé par un autre téléphone (pas encore confirmé)", mfe: "Signale par enn lot telefonn (pankor konfirme)" },
  new_website: { fr: "Site web très récent", mfe: "Sit web bien nouvo" },
  unregistered_website: { fr: "Adresse de site web non enregistrée", mfe: "Ladres sit web pa anrezistre" },
  hidden_link: { fr: "Un lien court cache la vraie adresse", mfe: "Enn lien kourt kasiet vre ladres la" },
  ip_link: { fr: "Le lien utilise un simple numéro au lieu d'un nom", mfe: "Lien la servi enn nimero olie enn non" },
  reported_contact: { fr: "Lien ou numéro vu dans des messages signalés par d'autres téléphones", mfe: "Lien ou nimero ki finn trouve dan mesaz ki lezot telefonn inn signale" },
  voip_number: { fr: "Numéro de téléphone Internet (VOIP)", mfe: "Nimero telefonn Internet (VOIP)" },
};

/** The card's heading and sentence, by the server's category (its English heading). */
const CATEGORIES: Record<string, { label: Two; summary: Two }> = {
  'Known harmful link': {
    label: { fr: "Lien dangereux connu", mfe: "Lien danzere ki nou kone" },
    summary: { fr: "Un lien de ce message figure sur une liste publique de sites dangereux. Ne l'ouvrez pas, et ne payez pas.", mfe: "Enn lien dan sa mesaz la lor enn lis piblik sit danzere. Pa ouver li, ek pa peye." },
  },
  'Reported by other phones': {
    label: { fr: "Signalé par d'autres téléphones", mfe: "Signale par lezot telefonn" },
    summary: { fr: "Plusieurs téléphones ont signalé ce message (ou un message presque identique). Ne payez pas ; appelez le numéro officiel.", mfe: "Plizir telefonn inn signal sa mesaz la (ou enn preske parey). Pa peye; apel nimero ofisiel la." },
  },
  'Risky phone number': {
    label: { fr: "Numéro de téléphone à risque", mfe: "Nimero telefonn a risk" },
    summary: { fr: "Un numéro de ce message a été signalé récemment pour abus. Ne le rappelez pas ; utilisez le numéro officiel.", mfe: "Enn nimero dan sa mesaz la finn signale resaman. Pa reapel li; servi nimero ofisiel la." },
  },
  'Signs worth checking': {
    label: { fr: "Signes à vérifier", mfe: "Bann sign pou verifye" },
    summary: { fr: "Les vérifications en ligne ont trouvé des signes à vérifier avant de payer ou d'ouvrir un lien.", mfe: "Bann verifikasion anlinn inn trouv bann sign pou verifye avan ou peye ou ouver enn lien." },
  },
};

/** A warning sign's name in the app's language (the server's English name if we have no translation). */
export function onlineTacticLabel(id: string, english: string, language: Language): string {
  return language === 'en' ? english : (TACTICS[id]?.[language] ?? english);
}

/** The card's heading and sentence in the app's language. */
export function onlineCategory(category: string, summary: string, language: Language): { label: string; summary: string } {
  const known = CATEGORIES[category];
  if (language === 'en' || !known) return { label: category, summary };
  return { label: known.label[language], summary: known.summary[language] };
}
