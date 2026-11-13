package mu.fraudlens.moris.engine

import java.time.LocalDate

/**
 * Checks a message against the rules and the official records. Runs on the phone, offline.
 *
 * How it works: each check below is a small function that returns findings. check() runs them all,
 * then the overall level is the worst finding level (STOP > CAREFUL > NONE).
 * Adding a check later = adding one more function to the list in check().
 *
 * [today] is a parameter only so tests can fix the date; the app uses the default.
 */
class Engine(val data: DataSet, private val today: LocalDate = LocalDate.now()) {

    fun check(text: String, job: JobAnswers? = null): CheckResult {
        val m = Message(text)
        val findings = mutableListOf<Finding>()
        val contacts = mutableListOf<Contact>()

        findings += codeRequestCheck(m)
        findings += bankLinkCheck(m, contacts)
        findings += fscCheck(m)
        findings += jobFeeFromText(m, job)
        if (job != null) findings += jobAnswersCheck(m, job, contacts)
        findings += phraseCheck(m, Rules.URGENCY)
        findings += paymentRequestCheck(m)
        findings += phraseCheck(m, Rules.PRIZE)
        findings += phraseCheck(m, Rules.RETURNS)
        findings += phraseCheck(m, Rules.NEW_NUMBER)
        findings += oddLinkCheck(m)
        findings += certCheck(m)

        val level = when {
            findings.any { it.level == Level.STOP } -> Level.STOP
            findings.any { it.level == Level.CAREFUL } -> Level.CAREFUL
            else -> Level.NONE
        }
        return CheckResult(level, findings.sortedBy { it.level.ordinal }, contacts.distinctBy { it.phone })
    }

    /** Register agencies whose names appear in the message, best match first (for the Job check screen). */
    fun suggestAgencies(text: String): List<Agency> {
        val words = Agencies.words(text)
        return data.agencies
            .map { it to Agencies.matchScore(it.name, words) }
            .filter { it.second > 0 }
            .sortedByDescending { it.second }
            .map { it.first }
    }

    // ---------------------------------------------------------------- the checks

    /** The message, read once: original text, normalised text, links, amounts, banks named. */
    private inner class Message(val original: String) {
        val norm = Text.normalise(original)
        val links = Text.links(original)
        val amounts = Text.amounts(original)
        val phones = Text.phones(original)

        /** Banks named in the text, or hidden in a link (mcb-login-secure.net names MCB). */
        val banksNamed: List<Bank> = data.banks.filter { bank ->
            Text.findAny(norm, bank.keywords).isNotEmpty() ||
                links.any { link -> bank.keywords.any { k -> k.length >= 3 && k.replace(" ", "") in link.host.replace("-", "") } }
        }
        val isJob = Text.findAny(norm, Rules.JOB_CONTEXT).isNotEmpty()
    }

    private fun codeRequestCheck(m: Message): List<Finding> {
        val hits = Rules.codeRequests(m.norm)
        if (hits.isEmpty()) return emptyList()
        return listOf(
            Finding(
                kind = "code_request", level = Level.STOP,
                title = "Asks for a code, PIN or password",
                detail = "Banks and real companies never ask you to send a code, PIN or password. Never share it.",
                highlights = hits, source = null,
            ),
        )
    }

    /** A bank is named, and a link in the message is not one of that bank's official websites. */
    private fun bankLinkCheck(m: Message, contacts: MutableList<Contact>): List<Finding> {
        val out = mutableListOf<Finding>()
        for (bank in m.banksNamed) {
            val source = bankSource(bank)
            val bad = m.links.filter { link -> bank.domains.none { Text.hostIsDomain(link.host, it) } }
            if (bad.isNotEmpty()) {
                out += Finding(
                    kind = "bank_link", level = Level.STOP,
                    title = "Link is not ${bank.name}'s official website",
                    detail = "The official website of ${bank.name} is ${bank.domains.joinToString(" or ")} " +
                        "(Bank of Mauritius list of licensees). Don't open this link. Call the bank on its official number.",
                    highlights = bad.map { it.range }, source = source,
                )
            }
            // The message claims to come from the bank (account alarm or a link) and gives another phone number.
            val claimsBank = bad.isNotEmpty() || Text.findAny(m.norm, Rules.BANK_ALARM.phrases).isNotEmpty()
            val official = Text.phoneDigits(bank.phone)
            val otherPhones = if (claimsBank) m.phones.filter { it.digits != official } else emptyList()
            if (otherPhones.isNotEmpty()) {
                out += Finding(
                    kind = "bank_phone", level = Level.CAREFUL,
                    title = "Number is not ${bank.name}'s official number",
                    detail = "Call ${bank.name} only on its official number ${bank.phone}, never on a number given in a message.",
                    highlights = otherPhones.map { it.range }, source = source,
                )
            }
            if (claimsBank || Rules.codeRequests(m.norm).isNotEmpty()) contacts += Contact(bank.name, bank.phone, source)
        }
        if (m.banksNamed.isNotEmpty()) out += phraseCheck(m, Rules.BANK_ALARM)
        return out
    }

    /** The message names a firm or website the FSC has warned about. */
    private fun fscCheck(m: Message): List<Finding> = data.fscAlerts.mapNotNull { alert ->
        val byDomain = m.links.filter { link -> alert.domains.any { Text.hostIsDomain(link.host, it) } }.map { it.range }
        val byName = Text.findPhrase(m.norm, Agencies.coreName(alert.name))
        val hits = byDomain + byName
        if (hits.isEmpty()) return@mapNotNull null
        Finding(
            kind = "fsc_alert", level = Level.STOP,
            title = "The FSC warned about ${alert.name}",
            detail = "The Financial Services Commission published a warning about ${alert.name} on ${alert.alertDate}: " +
                "it is not licensed by the FSC. Don't send money.",
            highlights = hits, source = Source("FSC investor alert", alert.alertUrl, alert.alertDate),
        )
    }

    /** Job message + a recruitment cost word + a request to pay → the employer should pay this, not the worker. */
    private fun jobFeeFromText(m: Message, job: JobAnswers?): List<Finding> {
        if (!m.isJob) return emptyList()
        // The cost word must sit close (60 characters) to a request to pay or an amount:
        // "pay the processing fee Rs 50,000" counts; "bring your passport to the interview" does not.
        val money = Rules.paymentRequests(m.norm) + m.amounts
        if (money.isEmpty()) return emptyList()
        fun nearMoney(r: IntRange) = money.any { it.first - 60 <= r.last && r.first <= it.last + 60 }
        return data.feeRules.mapNotNull { rule ->
            if (job?.costId == rule.id) return@mapNotNull null // reported by jobAnswersCheck instead
            val hits = Text.findAny(m.norm, rule.allWords).filter(::nearMoney)
            if (hits.isEmpty()) null else feeFinding(rule, hits)
        }
    }

    /** The user's answers on the Job check screen: the chosen register agency and the cost they are asked to pay. */
    private fun jobAnswersCheck(m: Message, job: JobAnswers, contacts: MutableList<Contact>): List<Finding> {
        val out = mutableListOf<Finding>()
        val agency = job.agencyId?.let { id -> data.agencies.firstOrNull { it.id == id } }
        if (agency == null) {
            val snapshot = data.agencies.firstOrNull()?.snapshot ?: ""
            out += Finding(
                kind = "agency_not_found", level = Level.CAREFUL,
                title = "Not found in the Ministry list of ${Dates.pretty(snapshot)}",
                detail = "Every recruitment agency must hold a licence from the Ministry of Labour. " +
                    "Ask the Ministry's Recruitment Licence Unit (pra@govmu.org) before paying anything.",
                highlights = emptyList(),
                source = data.agencies.firstOrNull()?.let { agencySource(it) },
            )
        } else {
            val source = agencySource(agency)
            contacts += Contact(agency.name, agency.phone, source)
            val valid = Dates.covers(agency.validFrom, agency.expiry, today)
            out += when {
                !valid -> Finding(
                    kind = "agency_expired", level = Level.CAREFUL,
                    title = "${agency.name}: licence not valid today",
                    detail = "The Ministry list records this licence as valid from ${Dates.pretty(agency.validFrom)} to " +
                        "${Dates.pretty(agency.expiry)}. Ask the Ministry before paying anything.",
                    highlights = emptyList(), source = source,
                )
                agency.category != "abroad" -> Finding(
                    kind = "agency_wrong_category", level = Level.CAREFUL,
                    title = "${agency.name} is listed, but not for jobs abroad",
                    detail = "Its licence is for ${Agencies.categoryText(agency.category)}. " +
                        "Only agencies licensed for jobs abroad may recruit you for work overseas.",
                    highlights = emptyList(), source = source,
                )
                else -> Finding(
                    kind = "agency_listed", level = Level.NONE,
                    title = "${agency.name} is listed for jobs abroad",
                    detail = "Recorded as valid until ${Dates.pretty(agency.expiry)}. Listed, but this does not prove " +
                        "the message is from them. Call them on the number from the Ministry list: ${agency.phone}.",
                    highlights = emptyList(), source = source,
                )
            }
        }
        job.costId?.let { id -> data.feeRules.firstOrNull { it.id == id } }
            ?.let { rule -> out += feeFinding(rule, Text.findAny(m.norm, rule.allWords)) } // highlight the cost words if the message has them
        return out
    }

    private fun feeFinding(rule: FeeRule, hits: List<IntRange>): Finding {
        val general = data.feeRules.firstOrNull { it.id == "any_recruitment_fee" }
        val detail = if (rule.id == "any_recruitment_fee") {
            "No recruitment agency or employer may charge a worker a fee for recruiting them (${rule.ref})."
        } else {
            "${rule.cost}: paid by the employer, not the worker (${rule.ref})." +
                (general?.let { " No agency or employer may charge a worker a recruitment fee (${it.ref})." } ?: "")
        }
        return Finding(
            kind = "job_fee", level = Level.STOP,
            title = "A job cost the employer must pay",
            detail = detail, highlights = hits,
            source = Source(rule.ref, rule.sourceUrl, rule.snapshot),
        )
    }

    private fun paymentRequestCheck(m: Message): List<Finding> {
        val hits = Rules.paymentRequests(m.norm)
        if (hits.isEmpty()) return emptyList()
        return listOf(
            Finding(
                kind = "payment_request", level = Level.CAREFUL,
                title = "Asks you to pay or send money",
                detail = "Before paying, check who is really asking, using an official number you find yourself.",
                highlights = hits + m.amounts, source = null,
            ),
        )
    }

    /** Short links hide where they go; some endings are mostly used by throwaway sites. */
    private fun oddLinkCheck(m: Message): List<Finding> {
        val knownOfficial = data.banks.flatMap { it.domains }
        val odd = m.links.filter { link ->
            knownOfficial.none { Text.hostIsDomain(link.host, it) } &&
                (Rules.SHORTENERS.any { Text.hostIsDomain(link.host, it) } ||
                    link.host.substringAfterLast('.') in Rules.RISKY_TLDS ||
                    link.host.matches(Regex("""\d+\.\d+\.\d+\.\d+""")))
        }
        if (odd.isEmpty()) return emptyList()
        return listOf(
            Finding(
                kind = "odd_link", level = Level.CAREFUL,
                title = "Suspicious link",
                detail = "This link is shortened or uses an unusual web address, so you can't see where it really goes.",
                highlights = odd.map { it.range }, source = null,
            ),
        )
    }

    /** Matches a CERT-MU alert: 2 of its phrases, or 1 that is a web or email address quoted in the alert. */
    private fun certCheck(m: Message): List<Finding> = data.certAlerts.mapNotNull { alert ->
        val hitsByPhrase = alert.phrases.map { it to Text.findPhrase(m.norm, it) }.filter { it.second.isNotEmpty() }
        val distinctive = hitsByPhrase.any { (p, _) -> '@' in p || (p.contains('.') && !p.contains(' ') && p.any { it.isLetter() }) }
        if (hitsByPhrase.size < 2 && !distinctive) return@mapNotNull null
        Finding(
            kind = "cert_alert", level = Level.CAREFUL,
            title = "Matches a CERT-MU alert: ${alert.campaign}",
            detail = "CERT-MU (the national cybersecurity team) warned about this on ${Dates.pretty(alert.alertDate)}.",
            highlights = hitsByPhrase.flatMap { it.second },
            source = Source("CERT-MU security alert", alert.alertUrl, alert.alertDate),
        )
    }

    private fun phraseCheck(m: Message, rule: PhraseRule): List<Finding> {
        val hits = Text.findAny(m.norm, rule.phrases)
        if (hits.isEmpty()) return emptyList()
        return listOf(Finding(rule.kind, rule.level, rule.title, rule.detail, hits, null))
    }

    private fun bankSource(bank: Bank) = Source("Bank of Mauritius list of licensees", bank.sourceUrl, bank.snapshot)
    private fun agencySource(a: Agency) = Source("Ministry of Labour list of recruitment agencies", a.sourceUrl, a.snapshot)
}

/** Agency name matching, tolerant of case, accents, "Ltd" and one-letter typos. */
internal object Agencies {
    private val IGNORE = setOf("ltd", "limited", "ltee", "co", "company", "the", "and", "of", "mauritius", "inc")

    fun words(text: String): List<String> = Text.normalise(text).split(Regex("[^a-z0-9]+")).filter { it.length >= 2 }

    /** "STAR NET LIMITED (Starnet Limited)" → "star net"; used for FSC name matching. */
    fun coreName(name: String): String = Text.normalise(name).substringBefore('(').split(Regex("[^a-z0-9.]+"))
        .filter { it.isNotEmpty() && it !in IGNORE }.joinToString(" ")

    /** 0 = no match; otherwise the number of name words found (every core word of the name must be in the message). */
    fun matchScore(name: String, messageWords: List<String>): Int {
        val core = Text.normalise(name).split(Regex("[^a-z0-9]+")).filter { it.length >= 2 && it !in IGNORE }
        if (core.isEmpty()) return 0
        val found = core.count { w -> messageWords.any { it == w || (w.length >= 5 && oneEditApart(it, w)) } }
        return if (found == core.size) found else 0
    }

    private fun oneEditApart(a: String, b: String): Boolean {
        if (kotlin.math.abs(a.length - b.length) > 1) return false
        var i = 0; var j = 0; var edits = 0
        while (i < a.length && j < b.length) {
            if (a[i] == b[j]) { i++; j++; continue }
            if (++edits > 1) return false
            when {
                a.length > b.length -> i++
                a.length < b.length -> j++
                else -> { i++; j++ }
            }
        }
        return edits + (a.length - i) + (b.length - j) <= 1
    }

    fun categoryText(category: String) = when (category) {
        "local" -> "recruiting citizens for jobs in Mauritius"
        "non_citizen" -> "bringing foreign workers into Mauritius"
        "abroad" -> "jobs abroad"
        else -> category
    }
}

internal object Dates {
    fun covers(from: String, to: String, day: LocalDate): Boolean = try {
        !day.isBefore(LocalDate.parse(from)) && !day.isAfter(LocalDate.parse(to))
    } catch (e: Exception) {
        false
    }

    private val MONTHS = listOf("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec")

    /** "2026-11-04" → "4 Nov 2026" */
    fun pretty(iso: String): String = try {
        val d = LocalDate.parse(iso)
        "${d.dayOfMonth} ${MONTHS[d.monthValue - 1]} ${d.year}"
    } catch (e: Exception) {
        iso
    }
}
