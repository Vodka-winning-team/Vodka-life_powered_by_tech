package mu.fraudlens.moris.engine

/**
 * Checks a message against the rules and the official records. Runs on the phone, offline.
 * Step 1 (stub): always returns NONE, so C can wire the screens. The real checks come in the next steps.
 */
class Engine(val data: DataSet) {

    fun check(text: String, job: JobAnswers? = null): CheckResult =
        CheckResult(level = Level.NONE, findings = emptyList(), contacts = emptyList())

    /** Register agencies whose names appear in the message (for the Job check screen). Stub: none yet. */
    fun suggestAgencies(text: String): List<Agency> = emptyList()
}
