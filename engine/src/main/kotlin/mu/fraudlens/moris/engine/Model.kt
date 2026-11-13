package mu.fraudlens.moris.engine

// ---- What the engine returns (contract: docs/TASKS.md §2) ----

/** Overall result. STOP = "Stop – high risk", CAREFUL = "Be careful – verify", NONE = "No warning signs found – still verify". */
enum class Level { STOP, CAREFUL, NONE }

/** Where a finding comes from: an official record, with its date. */
data class Source(val name: String, val url: String, val date: String)

/**
 * One reason shown on the Result screen.
 * kind: fixed key (e.g. "job_fee", "code_request", "bank_link") so the app can translate the title.
 * highlights: character ranges in the original message to mark in the X-Ray.
 */
data class Finding(
    val kind: String,
    val level: Level,
    val title: String,
    val detail: String,
    val highlights: List<IntRange>,
    val source: Source?,
)

/** An official number to call. Never a number taken from the message. */
data class Contact(val name: String, val phone: String, val source: Source)

data class CheckResult(val level: Level, val findings: List<Finding>, val contacts: List<Contact>)

/** The user's answers on the Job check screen: which register agency, which cost they are asked to pay. */
data class JobAnswers(val agencyId: String?, val costId: String?)

// ---- Records loaded from A's data files (app/src/main/assets/data/) ----

data class Agency(
    val id: String,
    val name: String,
    val category: String, // "abroad" | "local" | "non_citizen"
    val phone: String,
    val address: String,
    val validFrom: String, // YYYY-MM-DD
    val expiry: String, // YYYY-MM-DD
    val page: Int,
    val sourceUrl: String,
    val snapshot: String,
)

data class FeeRule(
    val id: String,
    val cost: String,
    val wordsEn: List<String>,
    val wordsFr: List<String>,
    val wordsMfe: List<String>,
    val payer: String,
    val ref: String,
    val sourceUrl: String,
    val snapshot: String,
) {
    val allWords: List<String> get() = wordsEn + wordsFr + wordsMfe
}

data class Bank(
    val id: String,
    val name: String,
    val type: String, // "bank" | "psp"
    val keywords: List<String>,
    val domains: List<String>,
    val phone: String,
    val phoneSource: String,
    val sourceUrl: String,
    val snapshot: String,
)

data class FscAlert(
    val id: String,
    val name: String,
    val domains: List<String>,
    val alertDate: String,
    val alertUrl: String,
    val sourceUrl: String,
    val snapshot: String,
)

data class CertAlert(
    val id: String,
    val campaign: String,
    val phrases: List<String>,
    val alertDate: String,
    val alertUrl: String,
    val sourceUrl: String,
    val snapshot: String,
)
