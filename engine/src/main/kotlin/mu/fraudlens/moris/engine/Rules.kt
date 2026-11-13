package mu.fraudlens.moris.engine

/**
 * The X-Ray warning signs: plain word lists in English, French and Kreol.
 * Each rule = a fixed kind, a level, a one-line title and reason, and the phrases that trigger it.
 * To add a phrase, add it to the right list; matching is whole-word, case- and accent-insensitive.
 */
data class PhraseRule(
    val kind: String,
    val level: Level,
    val title: String,
    val detail: String,
    val phrases: List<String>,
)

object Rules {

    val URGENCY = PhraseRule(
        kind = "urgency", level = Level.CAREFUL,
        title = "Pressure to act fast",
        detail = "Scammers rush you so you don't stop to check. A real organisation gives you time.",
        phrases = listOf(
            "urgent", "urgently", "immediately", "right now", "act now", "today only", "pay today", "within 24 hours",
            "within 24h", "within 48 hours", "last chance", "last day", "expires today", "before it's too late", "asap",
            "urgence", "immediatement", "aujourd'hui", "dans les 24 heures", "sous 24h", "derniere chance", "tout de suite",
            "irzan", "zordi mem", "deswit", "tousuit", "vit vit", "dernie sans", "avan ki tro tar",
        ),
    )

    val PRIZE = PhraseRule(
        kind = "prize_gift", level = Level.CAREFUL,
        title = "Prize, gift or bonus",
        detail = "Unexpected prizes and gifts are a common way to get your details or a 'fee'.",
        phrases = listOf(
            "you have won", "you've won", "you won", "won a prize", "winner", "lucky draw", "cash gift", "free gift",
            "claim your prize", "claim your reward", "reward", "bonus", "congratulations",
            "vous avez gagne", "gagnant", "felicitations", "cadeau", "tirage au sort", "recompense",
            "ou finn gagne", "ou finn gagn", "kado", "lot gagnan", "tiraz o sor",
        ),
    )

    val BANK_ALARM = PhraseRule(
        kind = "bank_alarm", level = Level.CAREFUL,
        title = "Alarm about your account",
        detail = "Messages saying your account or card is blocked are a classic way to pose as a bank.",
        phrases = listOf(
            "account blocked", "account has been blocked", "account suspended", "account will be blocked",
            "card blocked", "card has been blocked", "unusual activity", "suspicious activity", "unusual login",
            "verify your account", "verify your details", "confirm your details", "update your details",
            "it will be blocked", "will be suspended",
            "compte bloque", "compte suspendu", "carte bloquee", "activite suspecte", "verifiez votre compte",
            "confirmez vos informations",
            "kont bloke", "ou kont inn bloke", "kart bloke", "verifye ou kont", "konfirm ou detay",
        ),
    )

    val RETURNS = PhraseRule(
        kind = "guaranteed_returns", level = Level.CAREFUL,
        title = "Promise of guaranteed profit",
        detail = "No real investment can guarantee profit. Investment firms must be licensed by the FSC.",
        phrases = listOf(
            "guaranteed profit", "guaranteed return", "guaranteed returns", "guaranteed income", "double your money",
            "risk free", "risk-free", "no risk", "% per day", "% daily", "% per week", "passive income",
            "rendement garanti", "profit garanti", "gain garanti", "doublez votre argent", "sans risque",
            "benefis garanti", "fer ou larzan double", "pena risk",
        ),
    )

    val NEW_NUMBER = PhraseRule(
        kind = "new_number", level = Level.CAREFUL,
        title = "Says they have a new number",
        detail = "\"I lost my phone, this is my new number\" is a common trick. Call the person on the number you already have.",
        phrases = listOf(
            "my new number", "new number", "new phone number", "changed my number", "lost my phone",
            "mon nouveau numero", "nouveau numero", "j'ai perdu mon telephone", "j'ai change de numero",
            "mo nouvo nimero", "nouvo nimero", "mo finn perdi mo telefonn", "perdi mo telefonn", "sanz mo nimero",
        ),
    )

    val SHORTENERS =listOf("bit.ly", "tinyurl.com", "t.co", "goo.gl", "is.gd", "cutt.ly", "shorturl.at", "rb.gy", "ow.ly", "tiny.cc")
    val RISKY_TLDS = listOf("xyz", "top", "cam", "click", "tk", "ml", "ga", "cf", "gq", "vip", "win", "bid", "loan", "work", "live")

    /** Words showing the message is about a job, used to decide when fee words mean a recruitment fee. */
    val JOB_CONTEXT = listOf(
        "job", "jobs", "work abroad", "work in", "vacancy", "vacancies", "recruitment", "recruiting", "recruiter",
        "hiring", "employment", "employer", "work contract", "job offer", "salary", "position", "agency",
        "emploi", "travail", "poste", "recrutement", "embauche", "offre d'emploi", "contrat de travail", "salaire",
        "travay", "lanplwa", "anplwa", "rekritman", "lazans", "saler", "kontra travay",
    )

    // ---- Asking for a code / PIN: a verb followed closely by a code word, not negated ----
    private val CODE_VERBS = listOf(
        "send", "give", "share", "tell", "provide", "forward", "reply with", "read out", "read", "enter", "type", "confirm",
        "envoyez", "envoyer", "envoie", "donnez", "donner", "communiquez", "transmettez", "confirmez", "partagez", "dites",
        "avoy", "avoye", "voye", "donn", "done", "partaz", "dir", "konfirm",
    )
    private val CODE_OBJECTS = listOf(
        "code", "codes", "otp", "pin", "password", "passcode", "cvv", "cvc", "verification code", "security code",
        "mot de passe", "code secret", "code de verification", "kod", "mo de pas", "kod sekre",
    )
    private val NEGATIONS = listOf(
        "never", "do not", "don't", "dont", "not", "no one", "nobody", "jamais", "ne pas", "ne jamais", "ne partagez",
        "zamai", "pa bizin", "pa", "pa janbe", "okenn",
    )

    private val CODE_REQUEST = Regex(
        """\b(${CODE_VERBS.joinToString("|") { Regex.escape(it) }})\b[^.!?\n]{0,40}?\b(${CODE_OBJECTS.joinToString("|") { Regex.escape(it) }})\b""",
    )

    /** Ranges where the message asks the reader to send/give a code, PIN or password. */
    fun codeRequests(norm: String): List<IntRange> = CODE_REQUEST.findAll(norm).mapNotNull { m ->
        val verbStart = m.groups[1]!!.range.first
        // "Never share this code", "pa bizin donn kod": the 25 characters before the verb hold a negation → not a request.
        val before = norm.substring(maxOf(0, verbStart - 25), verbStart)
        val negated = NEGATIONS.any { Text.findPhrase(before, it).isNotEmpty() }
        if (negated) null else m.range
    }.toList()

    // ---- Asking for money: a pay/send verb followed closely by money words or an amount ----
    private val PAY_VERBS = listOf(
        "pay", "send", "transfer", "deposit", "wire", "top up", "make a payment",
        "payer", "payez", "envoyez", "virer", "virez", "transferez", "deposez", "regler", "reglez",
        "peye", "avoy", "depoze",
    )
    private val MONEY_WORDS = listOf(
        "money", "fee", "fees", "deposit", "rs", "mur", "rupees", "payment", "cash", "amount",
        "argent", "frais", "montant", "acompte", "roupies",
        "larzan", "kas", "fre", "roupi", "depo",
    )
    private val PAY_REQUEST = Regex(
        """\b(${PAY_VERBS.joinToString("|") { Regex.escape(it) }})\b[^.!?\n]{0,40}?\b(${MONEY_WORDS.joinToString("|") { Regex.escape(it) }})\b""",
    )

    fun paymentRequests(norm: String): List<IntRange> = PAY_REQUEST.findAll(norm).mapNotNull { m ->
        val verbStart = m.groups[1]!!.range.first
        val before = norm.substring(maxOf(0, verbStart - 25), verbStart)
        if (NEGATIONS.any { Text.findPhrase(before, it).isNotEmpty() }) null else m.range
    }.toList()
}
