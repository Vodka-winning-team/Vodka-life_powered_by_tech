package mu.fraudlens.moris.engine

import java.text.Normalizer

/**
 * Text helpers. Key idea: normalise() keeps exactly ONE output character per input character,
 * so a match found in the normalised text has the same positions in the original message
 * (that is how the X-Ray highlights land on the right words).
 */
object Text {

    /** Lowercase, accents removed (é → e), curly quotes straightened. Same length as the input. */
    fun normalise(text: String): String {
        val out = StringBuilder(text.length)
        for (c in text) {
            val plain = when (c) {
                '’', '‘', '`' -> '\''
                else -> Normalizer.normalize(c.toString(), Normalizer.Form.NFD)
                    .firstOrNull { Character.getType(it) != Character.NON_SPACING_MARK.toInt() } ?: c
            }
            out.append(plain.lowercaseChar())
        }
        return out.toString()
    }

    private fun isWordChar(c: Char) = c.isLetterOrDigit()

    /** Every whole-word occurrence of [phrase] in already-normalised [norm]. Ranges are inclusive. */
    fun findPhrase(norm: String, phrase: String): List<IntRange> {
        val p = normalise(phrase).trim()
        if (p.isEmpty()) return emptyList()
        val hits = mutableListOf<IntRange>()
        var from = 0
        while (true) {
            val i = norm.indexOf(p, from)
            if (i < 0) break
            val end = i + p.length - 1
            val okStart = i == 0 || !isWordChar(norm[i - 1]) || !isWordChar(p.first())
            val okEnd = end == norm.lastIndex || !isWordChar(norm[end + 1]) || !isWordChar(p.last())
            if (okStart && okEnd) hits += i..end
            from = i + 1
        }
        return hits
    }

    /** All whole-word hits for a list of phrases. */
    fun findAny(norm: String, phrases: List<String>): List<IntRange> = phrases.flatMap { findPhrase(norm, it) }

    // ---- Things we pull out of a message ----

    /** A link found in the message: where it is, and its host name without "www.". */
    data class Link(val range: IntRange, val host: String)

    private val TLDS = "com|net|org|mu|info|xyz|top|cam|click|co|uk|io|app|link|site|online|live|me|biz|cc|ly|gl|in|fr|us|tk|ml|ga|cf|gq|shop|store|vip|win|bid|loan|work"
    private val LINK = Regex(
        """(?i)\b(?:https?://)?(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:$TLDS)\b(?:[/?#][^\s]*)?""",
    )

    fun links(original: String): List<Link> = LINK.findAll(original).mapNotNull { m ->
        if (m.range.first > 0 && original[m.range.first - 1] == '@') return@mapNotNull null // part of an email address
        var raw = m.value.trimEnd('.', ',', ')', '!', '?', ';', ':', '"', '\'')
        val range = m.range.first..(m.range.first + raw.length - 1)
        raw = raw.lowercase().removePrefix("https://").removePrefix("http://")
        val host = raw.split('/', '?', '#', ':').first().removePrefix("www.")
        Link(range, host)
    }.toList()

    /** True if [host] is [domain] itself or one of its sub-domains (so mcb.mu.evil.com is NOT mcb.mu). */
    fun hostIsDomain(host: String, domain: String): Boolean {
        val d = domain.lowercase().removePrefix("www.")
        return host == d || host.endsWith(".$d")
    }

    /** Money amounts such as "Rs 50,000", "Rs50000", "MUR 1,500", "5000 roupi". */
    private val AMOUNT = Regex(
        """(?i)(?:\b(?:rs|mur|roupi|rupees?)\.?\s?\d[\d,.\s]*\d|\b(?:rs|mur)\.?\s?\d|\b\d[\d,.\s]*\s?(?:rs|roupies|roupi|rupees|mur)\b)""",
    )

    fun amounts(original: String): List<IntRange> = AMOUNT.findAll(original).map { it.range }.toList()

    /** Phone numbers: Mauritian mobile (5xxx xxxx) or landline (xxx xxxx), with or without +230. Returns digits only. */
    private val PHONE = Regex("""(?<!\d)(?:\+?230[\s-]?)?(?:5\d{3}[\s-]?\d{4}|\d{3}[\s-]?\d{4})(?!\d)""")

    data class Phone(val range: IntRange, val digits: String)

    fun phones(original: String): List<Phone> = PHONE.findAll(original).map { m ->
        Phone(m.range, m.value.filter { it.isDigit() }.removePrefix("230").takeLast(8))
    }.toList()

    /** Official phone in the data file → digits only, without the country code. */
    fun phoneDigits(phone: String): String = phone.filter { it.isDigit() }.removePrefix("230")
}
