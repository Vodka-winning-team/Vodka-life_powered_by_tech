package mu.fraudlens.moris.engine

/**
 * Try the engine by hand, without a phone:   ./gradlew -q --console=plain :engine:tryIt
 * Type a message and press Enter to see what the app would show. Commands:
 *   job <agency-id or none> [cost-id]   answers for the NEXT message (like the Job check screen), e.g. "job abroad-think-recruitment-ltd processing"
 *   agencies <text>                     which register agencies suggestAgencies() finds in the text
 *   costs                               list the cost ids
 *   quit
 * Lives in the test folder, so it is never shipped in the app.
 */
fun main(args: Array<String>) {
    val data = DataSetTest.loadRealData()
    val engine = Engine(data)
    println("FraudLens Moris engine: ${data.agencies.size} agencies, ${data.banks.size} banks/PSPs, " +
        "${data.feeRules.size} fee rules, ${data.fscAlerts.size} FSC alerts, ${data.certAlerts.size} CERT-MU alerts")

    // One-shot mode (no typing needed): TRY_MSG="message" and optionally TRY_JOB="agency-id|none cost-id".
    val envMsg = System.getenv("TRY_MSG")
    if (!envMsg.isNullOrBlank() || args.isNotEmpty()) {
        val job = System.getenv("TRY_JOB")?.trim()?.takeIf { it.isNotEmpty() }?.split(Regex("\\s+"))?.let {
            JobAnswers(agencyId = it.getOrNull(0)?.takeIf { a -> a != "none" }, costId = it.getOrNull(1))
        }
        show(engine, envMsg?.takeIf { it.isNotBlank() } ?: args.joinToString(" "), job)
        return
    }

    println("Type a message (or: job <agency-id|none> [cost-id] · agencies <text> · costs · quit)")
    var job: JobAnswers? = null
    while (true) {
        print("\n> ")
        val line = readLine()?.trim() ?: break
        when {
            line.isEmpty() -> continue
            line == "quit" || line == "exit" -> break
            line == "costs" -> data.feeRules.forEach { println("  ${it.id.padEnd(20)} ${it.cost}  (${it.ref})") }
            line.startsWith("agencies ") -> engine.suggestAgencies(line.removePrefix("agencies ")).forEach {
                println("  ${it.id}  ·  ${it.name}  ·  ${it.category}  ·  ${it.phone}")
            }.also { if (engine.suggestAgencies(line.removePrefix("agencies ")).isEmpty()) println("  (none found)") }
            line.startsWith("job ") -> {
                val parts = line.split(Regex("\\s+"))
                job = JobAnswers(agencyId = parts.getOrNull(1)?.takeIf { it != "none" }, costId = parts.getOrNull(2))
                println("  Job answers set for the next message: $job")
            }
            else -> { show(engine, line, job); job = null }
        }
    }
}

private fun show(engine: Engine, text: String, job: JobAnswers?) {
    val r = engine.check(text, job)
    val label = when (r.level) {
        Level.STOP -> "STOP – high risk"
        Level.CAREFUL -> "BE CAREFUL – verify"
        Level.NONE -> "NO WARNING SIGNS FOUND – still verify"
    }
    println("\n  ===== $label =====")
    // X-Ray: the message with every highlighted part in [brackets].
    val marks = r.findings.flatMap { it.highlights }.sortedBy { it.first }
    val xray = StringBuilder()
    var pos = 0
    for (h in marks) {
        if (h.first < pos) continue
        xray.append(text, pos, h.first).append('[').append(text, h.first, h.last + 1).append(']')
        pos = h.last + 1
    }
    xray.append(text.substring(pos))
    println("  X-Ray: $xray")
    for (f in r.findings) {
        println("\n  [${f.level}] ${f.title}   (kind: ${f.kind})")
        println("     ${f.detail}")
        f.source?.let { println("     Source: ${it.name}, ${it.date} · ${it.url}") }
    }
    if (r.contacts.isNotEmpty()) println("\n  Call (official numbers): " + r.contacts.joinToString(" · ") { "${it.name} ${it.phone}" })
}
