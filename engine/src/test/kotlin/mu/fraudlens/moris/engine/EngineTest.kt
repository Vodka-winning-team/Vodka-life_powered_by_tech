package mu.fraudlens.moris.engine

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test
import java.time.LocalDate

/**
 * The demo messages from PROJECT.md §9 (all fictional) plus edge cases, on the REAL data files.
 * D's docs/demo-messages.md and A's docs/test-cases.md will be added here when they are pushed.
 */
class EngineTest {

    private val engine = Engine(DataSetTest.loadRealData(), today = LocalDate.of(2026, 11, 14))

    private fun kinds(r: CheckResult) = r.findings.map { it.kind }.toSet()

    // ---- Demo 1: overseas job offer naming a real licensed agency, processing fee ----
    private val demo1 = "Bonjour Kevin! THINK RECRUITMENT LTD here. Hotel job in Canada, salary CAD 3,000. " +
        "To secure your place, pay the processing fee of Rs 50,000 today by Juice. Urgent, only 2 places left."

    @Test
    fun demo1_jobOfferWithProcessingFee_isStop() {
        val r = engine.check(demo1)
        assertEquals(Level.STOP, r.level)
        val fee = r.findings.first { it.kind == "job_fee" }
        assertTrue(fee.detail.contains("reg 7(2)(e)"))
        // The highlight is on "processing fee" in the original text.
        val h = fee.highlights.first()
        assertEquals("processing fee", demo1.substring(h.first, h.last + 1))
        assertTrue("urgency" in kinds(r))
    }

    @Test
    fun demo1_suggestsTheRegisterAgency() {
        val top = engine.suggestAgencies(demo1).first()
        assertEquals("abroad-think-recruitment-ltd", top.id)
    }

    @Test
    fun demo1_withJobAnswers_listedButNotProof_andOfficialPhone() {
        val r = engine.check(demo1, JobAnswers(agencyId = "abroad-think-recruitment-ltd", costId = "processing"))
        assertEquals(Level.STOP, r.level)
        val listed = r.findings.first { it.kind == "agency_listed" }
        assertTrue(listed.detail.contains("does not prove"))
        assertEquals(1, r.findings.count { it.kind == "job_fee" }) // not counted twice
        // The contact is the register number, never a number from the message.
        assertTrue(r.contacts.any { it.phone == "+230 5256 8074" })
        assertFalse(r.contacts.any { it.name.contains("Mauritius Commercial") }) // "Juice" alone doesn't add MCB
    }

    // ---- Demo 3: follow-up, now an air ticket ----
    @Test
    fun demo3_followUpAirTicket_citesReg72a() {
        val r = engine.check("They now want Rs 15,000 for the air ticket.", JobAnswers("abroad-think-recruitment-ltd", "air_ticket"))
        assertEquals(Level.STOP, r.level)
        assertTrue(r.findings.first { it.kind == "job_fee" }.detail.contains("reg 7(2)(a)"))
    }

    // ---- Demo 4: bank lookalike link ----
    @Test
    fun demo4_mcbLookalikeLink_isStop_withOfficialNumber() {
        val r = engine.check("MCB: Unusual activity on your account. Verify your account at mcb-login-secure.net or it will be blocked.")
        assertEquals(Level.STOP, r.level)
        assertTrue("bank_link" in kinds(r))
        assertTrue(r.contacts.any { it.phone == "+230 202 6060" })
    }

    // ---- Demo 5: genuine bank code SMS → nothing found ----
    @Test
    fun demo5_genuineOtp_isNone() {
        val r = engine.check(
            "MCB: Your OTP for the online payment of Rs 1,250.00 at DARTY is 482913. " +
                "Never share this code with anyone, including MCB staff.",
        )
        assertEquals(Level.NONE, r.level)
        assertTrue(r.findings.isEmpty())
    }

    // ---- Code rule (TASKS.md: both directions) ----
    @Test
    fun codeRequest_isStop() {
        assertEquals(Level.STOP, engine.check("Please send us the code you just received to confirm.").level)
        assertEquals(Level.STOP, engine.check("Bonzour, mo finn avoy ou enn kod. Avoy mwa kod la vit.").level)
        assertEquals(Level.STOP, engine.check("Merci de nous envoyer le code de vérification.").level)
    }

    @Test
    fun codeWithNever_isNotAFinding() {
        val r = engine.check("Your code is 123456, never share it.")
        assertFalse("code_request" in kinds(r))
        assertEquals(Level.NONE, r.level)
    }

    // ---- Agency answers ----
    @Test
    fun agencyNotInList_isCareful() {
        val r = engine.check("Job in Dubai", JobAnswers(agencyId = null, costId = null))
        assertEquals(Level.CAREFUL, r.level)
        assertTrue(r.findings.first().title.contains("4 Nov 2026"))
    }

    @Test
    fun localAgencyForJobAbroad_isWrongCategory() {
        val r = engine.check("Job in Canada", JobAnswers(agencyId = "local-my-web-ltd", costId = null))
        assertTrue("agency_wrong_category" in kinds(r))
    }

    @Test
    fun expiredLicence_isFlagged() {
        val later = Engine(DataSetTest.loadRealData(), today = LocalDate.of(2030, 1, 1))
        val r = later.check("Job in Canada", JobAnswers(agencyId = "abroad-think-recruitment-ltd", costId = null))
        assertTrue("agency_expired" in kinds(r))
    }

    // ---- Links ----
    @Test
    fun officialBankLink_isNotFlagged() {
        val r = engine.check("MCB: see our new rates at https://www.mcb.mu/personal/rates")
        assertFalse("bank_link" in kinds(r))
    }

    @Test
    fun subdomainTrick_isFlagged() {
        val r = engine.check("MCB: verify now at https://mcb.mu.secure-check.com/login")
        assertTrue("bank_link" in kinds(r))
    }

    @Test
    fun fscWarnedWebsite_isStop() {
        val r = engine.check("Earn 5% per day with AI trading on mornefundvex.net, join now!")
        assertEquals(Level.STOP, r.level)
        assertTrue("fsc_alert" in kinds(r))
        assertTrue("guaranteed_returns" in kinds(r))
    }

    @Test
    fun certCampaign_divaliCashGift() {
        val r = engine.check("Happy Divali! Divali Cash Gift of Rs. 2,000 for you. View Now: bit.ly/divali-gift")
        assertTrue("cert_alert" in kinds(r))
        assertTrue("odd_link" in kinds(r))
    }

    @Test
    fun kreolNewNumberMoneyRequest_isCareful() {
        val r = engine.check("Salam, mo finn perdi mo telefonn, sa mo nouvo nimero. Avoy Rs 3000 lor my.t money urgent")
        assertEquals(Level.CAREFUL, r.level)
        assertTrue(kinds(r).containsAll(listOf("new_number", "payment_request", "urgency")))
    }

    @Test
    fun ordinaryMessage_isNone() {
        assertEquals(Level.NONE, engine.check("See you at 7 for dinner? Bring the kids.").level)
        assertEquals(Level.NONE, engine.check("Bring your passport to the job interview on Monday.").level)
    }

    @Test
    fun highlightsAlwaysInsideTheMessage() {
        for (msg in listOf(demo1, "MCB: Unusual activity. Verify at mcb-login-secure.net", "Avoy mwa kod la")) {
            for (f in engine.check(msg).findings) for (h in f.highlights) {
                assertTrue(h.first >= 0 && h.last < msg.length)
            }
        }
    }
}
