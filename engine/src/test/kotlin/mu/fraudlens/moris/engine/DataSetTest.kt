package mu.fraudlens.moris.engine

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import java.io.File

/** Loads A's real data files (the same ones bundled in the APK) and checks they parse. */
class DataSetTest {

    companion object {
        // Gradle runs tests from the engine/ folder.
        private val dataDir = File("../app/src/main/assets/data")

        fun loadRealData(): DataSet = DataSet.fromJson(
            agencies = File(dataDir, "agencies.json").readText(),
            feeRules = File(dataDir, "fee_rules.json").readText(),
            banks = File(dataDir, "banks.json").readText(),
            fscAlerts = File(dataDir, "fsc_alerts.json").readText(),
            certAlerts = File(dataDir, "cert_alerts.json").readText(),
        )
    }

    @Test
    fun loadsAllRealRecords() {
        val data = loadRealData()
        assertEquals(79, data.agencies.size)
        assertEquals(12, data.agencies.count { it.category == "abroad" })
        assertTrue(data.feeRules.isNotEmpty())
        assertTrue(data.banks.any { "mcb.mu" in it.domains })
        assertTrue(data.fscAlerts.isNotEmpty())
        assertTrue(data.certAlerts.isNotEmpty())
    }

    @Test
    fun everyRecordHasASource() {
        val data = loadRealData()
        val sources = data.agencies.map { it.sourceUrl to it.snapshot } +
            data.feeRules.map { it.sourceUrl to it.snapshot } +
            data.banks.map { it.sourceUrl to it.snapshot } +
            data.fscAlerts.map { it.sourceUrl to it.snapshot } +
            data.certAlerts.map { it.sourceUrl to it.snapshot }
        assertTrue(sources.all { (url, date) -> url.startsWith("https://") && date.matches(Regex("""\d{4}-\d{2}-\d{2}""")) })
    }

    @Test
    fun stubEngineReturnsNone() {
        val result = Engine(loadRealData()).check("Hello")
        assertEquals(Level.NONE, result.level)
    }
}
