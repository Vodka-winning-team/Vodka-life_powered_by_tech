"""Lessons and quiz for the app's Learn screen. Written new for Verifye on 14 Nov 2026, from our own
sources (Ministry of Labour register and Act 2023, Bank of Mauritius list, FSC and CERT-MU alerts).
All quiz messages are fictional. Wording rule: never "safe", "genuine", "scam" or "illegal".
"""

LESSONS = [
    {"id": "job_fee", "label": "A fee for a job abroad",
     "lesson": "In Mauritius, no recruitment agency or employer may charge a worker for recruiting them "
               "(Private Recruitment Agencies Act 2023, s.5). Processing, visa, passport, work permit and air "
               "ticket costs are paid by the employer (Regulations 2025, reg 7(2)).",
     "safe_action": "Don't pay. Look the agency up in Verifye and call it on the number from the Ministry list."},
    {"id": "bank_link", "label": "A link that pretends to be your bank",
     "lesson": "Fake bank messages use addresses that look close to the real one, like mcb-login-secure.net "
               "instead of mcb.mu. Banks don't send you links to 'verify' your account.",
     "safe_action": "Don't open the link. Call your bank on the number from its official website."},
    {"id": "code_request", "label": "Someone asks for a code or PIN",
     "lesson": "A one-time code or PIN is a key to your money. Your bank, MCB Juice, my.t money or blink will "
               "never ask you to send it by message or call.",
     "safe_action": "Never share it, even with someone who says they are from the bank."},
    {"id": "new_number", "label": "\"I lost my phone, this is my new number\"",
     "lesson": "A message from an unknown number pretending to be family or a friend, then asking for money, "
               "is a common trick on WhatsApp in Mauritius (CERT-MU alert, Feb 2026).",
     "safe_action": "Call the person on the number you already have before sending anything."},
    {"id": "guaranteed_returns", "label": "Guaranteed profit",
     "lesson": "No real investment can promise a fixed profit. Firms offering trading or investments in "
               "Mauritius must be licensed by the FSC, and the FSC publishes warnings about unlicensed ones.",
     "safe_action": "Search the firm in Verifye and on the FSC website before sending money."},
    {"id": "prize_gift", "label": "A prize or cash gift you didn't expect",
     "lesson": "Fake 'cash gifts' and lucky draws (for example the Divali cash gift alert from CERT-MU, Oct 2026) "
               "ask you to click a link or pay a small fee to receive a bigger prize.",
     "safe_action": "Don't click and don't pay a fee to receive a prize."},
]

QUIZ = [
    {"id": "q1", "message": "Hotel job in Canada! Pay the processing fee of Rs 50,000 today to secure your place.",
     "question": "Who should pay the processing fee?", "options": ["You", "The employer", "Half each"], "answer": 1,
     "explanation": "Regulations 2025, reg 7(2)(e): processing fees are paid by the employer, never the worker."},
    {"id": "q2", "message": "MCB: Unusual activity on your account. Verify at mcb-login-secure.net",
     "question": "Is mcb-login-secure.net MCB's website?", "options": ["Yes", "No", "Can't tell"], "answer": 1,
     "explanation": "MCB's official website is mcb.mu (Bank of Mauritius list). Anything else is not MCB."},
    {"id": "q3", "message": "MCB: Your OTP is 482913. Never share this code with anyone, including MCB staff.",
     "question": "What should you do with this code?", "options": ["Send it back", "Use it yourself only", "Share it with MCB staff"], "answer": 1,
     "explanation": "A code sent to you is for you only. Nobody, not even the bank, should ask for it."},
    {"id": "q4", "message": "Salam, mo finn perdi mo telefonn, sa mo nouvo nimero. Avoy Rs 3000 urzan.",
     "question": "What do you do first?", "options": ["Send the money", "Call the person on their old number", "Reply with your PIN"], "answer": 1,
     "explanation": "Check with the person on the number you already have. A 'new number' asking for money is a common trick."},
    {"id": "q5", "message": "Earn 5% per day with AI trading, guaranteed profit, join now!",
     "question": "What is the warning sign?", "options": ["AI", "Guaranteed profit", "The word 'join'"], "answer": 1,
     "explanation": "No real investment guarantees profit. Check the firm with the FSC."},
    {"id": "q6", "message": "Happy Divali! Divali Cash Gift of Rs. 2,000 for you. View Now: bit.ly/divali-gift",
     "question": "Why is the short link a problem?", "options": ["It is too short", "It hides where it really goes", "It is in English"], "answer": 1,
     "explanation": "Short links hide the real address. CERT-MU warned about this exact Divali cash gift message."},
]

# ---------------------------------------------------------------------------------------------------
# French and Kreol (written 14 Nov 2026, ~06:50, for the lessons above; the Kreol is a DRAFT for a
# native speaker to check). Quiz messages stay as they were received; only the question, options and
# explanation are translated. Law references are copied unchanged.
TRANSLATIONS = {
    "fr": {
        "lessons": {
            "job_fee": ("Des frais pour un emploi à l'étranger",
                        "À Maurice, aucune agence de recrutement ni aucun employeur ne peut faire payer un travailleur pour "
                        "son recrutement (Private Recruitment Agencies Act 2023, s.5). Les frais de dossier, de visa, de passeport, "
                        "de permis de travail et le billet d'avion sont payés par l'employeur (Regulations 2025, reg 7(2)).",
                        "Ne payez pas. Cherchez l'agence dans Verifye et appelez-la au numéro de la liste du Ministère."),
            "bank_link": ("Un lien qui se fait passer pour votre banque",
                          "Les faux messages de banque utilisent des adresses proches de la vraie, comme mcb-login-secure.net "
                          "au lieu de mcb.mu. Les banques ne vous envoient pas de lien pour « vérifier » votre compte.",
                          "N'ouvrez pas le lien. Appelez votre banque au numéro de son site officiel."),
            "code_request": ("Quelqu'un demande un code ou un PIN",
                             "Un code à usage unique ou un PIN est la clé de votre argent. Votre banque, MCB Juice, my.t money "
                             "ou blink ne vous demanderont jamais de l'envoyer par message ou par téléphone.",
                             "Ne le donnez jamais, même à quelqu'un qui dit appeler de la banque."),
            "new_number": ("« J'ai perdu mon téléphone, voici mon nouveau numéro »",
                           "Un message d'un numéro inconnu qui se fait passer pour un proche, puis demande de l'argent, est une "
                           "ruse courante sur WhatsApp à Maurice (alerte CERT-MU, févr. 2026).",
                           "Appelez la personne sur le numéro que vous avez déjà avant d'envoyer quoi que ce soit."),
            "guaranteed_returns": ("Profit garanti",
                                   "Aucun vrai placement ne peut promettre un profit fixe. Les sociétés qui proposent du trading "
                                   "ou des placements à Maurice doivent avoir une licence de la FSC, et la FSC publie des "
                                   "avertissements sur celles qui n'en ont pas.",
                                   "Cherchez la société dans Verifye et sur le site de la FSC avant d'envoyer de l'argent."),
            "prize_gift": ("Un prix ou un cadeau en argent inattendu",
                           "Les faux « cadeaux en argent » et tirages au sort (par exemple l'alerte CERT-MU sur le cadeau de "
                           "Divali, oct. 2026) vous demandent de cliquer sur un lien ou de payer de petits frais pour recevoir "
                           "un prix plus gros.",
                           "Ne cliquez pas et ne payez pas de frais pour recevoir un prix."),
        },
        "quiz": {
            "q1": ("Qui doit payer les frais de dossier ?", ["Vous", "L'employeur", "Moitié chacun"],
                   "Regulations 2025, reg 7(2)(e) : les frais de dossier sont payés par l'employeur, jamais par le travailleur."),
            "q2": ("mcb-login-secure.net est-il le site de la MCB ?", ["Oui", "Non", "Impossible à dire"],
                   "Le site officiel de la MCB est mcb.mu (liste de la Banque de Maurice). Toute autre adresse n'est pas la MCB."),
            "q3": ("Que faire de ce code ?", ["Le renvoyer", "L'utiliser vous-même, seulement", "Le donner au personnel de la MCB"],
                   "Un code qu'on vous envoie est pour vous seul. Personne, pas même la banque, ne doit vous le demander."),
            "q4": ("Que faites-vous d'abord ?", ["Envoyer l'argent", "Appeler la personne sur son ancien numéro", "Répondre avec votre PIN"],
                   "Vérifiez auprès de la personne sur le numéro que vous avez déjà. Un « nouveau numéro » qui demande de l'argent est une ruse courante."),
            "q5": ("Quel est le signe d'alerte ?", ["L'IA", "Le profit garanti", "Le mot « join »"],
                   "Aucun vrai placement ne garantit un profit. Vérifiez la société auprès de la FSC."),
            "q6": ("Pourquoi le lien court pose-t-il problème ?", ["Il est trop court", "Il cache sa vraie destination", "Il est en anglais"],
                   "Les liens courts cachent la vraie adresse. Le CERT-MU a mis en garde contre ce message de cadeau de Divali."),
        },
    },
    "mfe": {
        "lessons": {
            "job_fee": ("Peye pou enn travay lot pei",
                        "Dan Moris, okenn azans rekritman ouswa patron pa gagn drwa fer enn travayer peye pou so rekritman "
                        "(Private Recruitment Agencies Act 2023, s.5). Fre dosie, viza, paspor, permi travay ek tiket avion, "
                        "se patron ki peye (Regulations 2025, reg 7(2)).",
                        "Pa peye. Rod lazans dan Verifye ek telefonn li lor nimero ki lor lalis Minister."),
            "bank_link": ("Enn lien ki fer kwar li to labank",
                          "Bann fos mesaz labank servi ladres ki resanble vre ladres, kouma mcb-login-secure.net olie mcb.mu. "
                          "Labank pa avoy twa lien pou « verifye » to kont.",
                          "Pa ouver lien la. Telefonn to labank lor nimero ki lor so sit ofisiel."),
            "code_request": ("Kikenn dimann enn kod ouswa PIN",
                             "Enn kod OTP ouswa PIN se lakle to larzan. To labank, MCB Juice, my.t money ouswa blink pa pou "
                             "zame dimann twa avoy li par mesaz ouswa par telefonn.",
                             "Pa zame donn li, mem si dimoun la dir li sorti labank."),
            "new_number": ("« Mo finn perdi mo telefonn, sa mo nouvo nimero »",
                           "Enn mesaz depi enn nimero ki to pa konn, ki fer kwar li enn fami ouswa enn kamarad, apre dimann "
                           "larzan: sa enn tour ki souvan arive lor WhatsApp dan Moris (alert CERT-MU, fev 2026).",
                           "Telefonn dimoun la lor nimero ki to deza ena avan to avoy nanye."),
            "guaranteed_returns": ("Profi garanti",
                                   "Okenn vre investisman pa kapav promet enn profi fix. Bann konpani ki ofer trading ouswa "
                                   "investisman dan Moris bizin ena enn lisans FSC, ek FSC pibliye bann avertisman lor bann "
                                   "ki pena lisans.",
                                   "Rod konpani la dan Verifye ek lor sit FSC avan to avoy larzan."),
            "prize_gift": ("Enn pri ouswa kado larzan ki to pa ti atann",
                           "Bann fos « kado larzan » ek tiraz osor (par egzanp alert CERT-MU lor kado Divali, okt 2026) "
                           "dimann twa klik lor enn lien ouswa peye enn ti fre pou gagn enn pli gro pri.",
                           "Pa klik ek pa peye okenn fre pou gagn enn pri."),
        },
        "quiz": {
            "q1": ("Kisannla ki bizin peye fre dosie?", ["Twa", "Patron", "Mwatie-mwatie"],
                   "Regulations 2025, reg 7(2)(e): se patron ki peye fre dosie, zame travayer."),
            "q2": ("Eski mcb-login-secure.net se sit MCB?", ["Wi", "Non", "Pa kapav dir"],
                   "Sit ofisiel MCB se mcb.mu (lalis Bank of Mauritius). Nimport ki lot ladres, se pa MCB."),
            "q3": ("Ki to bizin fer ar sa kod la?", ["Avoy li retour", "Servi li twa mem selman", "Donn li bann staf MCB"],
                   "Enn kod ki finn avoy twa, se pou twa selman. Personn, mem pa labank, pa bizin dimann li."),
            "q4": ("Ki to fer an premie?", ["Avoy larzan", "Telefonn dimoun la lor so ansien nimero", "Reponn ar to PIN"],
                   "Verifye ar dimoun la lor nimero ki to deza ena. Enn « nouvo nimero » ki dimann larzan, se enn tour ki souvan arive."),
            "q5": ("Ki siny danze la?", ["AI", "Profi garanti", "Mo « join »"],
                   "Okenn vre investisman pa garanti profi. Verifye konpani la ar FSC."),
            "q6": ("Kifer lien kourt la enn problem?", ["Li tro kourt", "Li kasiet kot li pe vremem al", "Li an angle"],
                   "Bann lien kourt kasiet vre ladres. CERT-MU finn averti lor sa mem mesaz kado Divali la."),
        },
    },
}


def lessons(lang: str = "en") -> list[dict]:
    """Lessons in English, French ("fr") or Kreol ("mfe"); anything else gets English."""
    tr = TRANSLATIONS.get(lang, {}).get("lessons", {})
    return [{**x, **dict(zip(("label", "lesson", "safe_action"), tr[x["id"]]))} if x["id"] in tr else x for x in LESSONS]


def quiz(lang: str = "en") -> list[dict]:
    """Quiz in English, French or Kreol. The message and the right answer's position never change."""
    tr = TRANSLATIONS.get(lang, {}).get("quiz", {})
    return [{**q, **dict(zip(("question", "options", "explanation"), tr[q["id"]]))} if q["id"] in tr else q for q in QUIZ]


if __name__ == "__main__":  # python -m verifye_server.content > learn-content.json (all 3 languages, for the app's offline copy)
    import json
    print(json.dumps({lang: {"lessons": lessons(lang), "quiz": quiz(lang)} for lang in ("en", "fr", "mfe")},
                     ensure_ascii=False, indent=1))
