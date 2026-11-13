package mu.fraudlens.moris.engine

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import java.time.LocalDate

/**
 * Realistic Kreol Morisien and French messages (all fictional), each with the level we expect.
 * If a native speaker finds a better spelling or a common phrase we miss, add a case here first, then the phrase in Rules.kt.
 */
class KreolFrenchTest {

    private val engine = Engine(DataSetTest.loadRealData(), today = LocalDate.of(2026, 11, 14))

    private data class Case(val text: String, val level: Level, val mustHave: List<String> = emptyList(), val job: JobAnswers? = null)

    private val cases = listOf(
        // ---------- STOP ----------
        Case("MCB: Votre compte a été suspendu suite à une activité suspecte. Veuillez vérifier vos informations sur mcb-securite.com",
            Level.STOP, listOf("bank_link", "bank_alarm")),
        Case("Bonjour, c'est le service client SBM. Pour débloquer votre carte, communiquez-nous le code OTP reçu par SMS.",
            Level.STOP, listOf("code_request")),
        Case("Bonzour, mo pe kontakte ou depi MCB. Donn mwa kod OTP ki ou finn gagne lor ou telefonn.",
            Level.STOP, listOf("code_request")),
        Case("Bonzour, nou ena travay dan lotel Kanada. Saler 90,000 par mwa. Bizin peye fre dosie Rs 45,000 avan vandredi.",
            Level.STOP, listOf("job_fee")),
        Case("Offre d'emploi au Canada : poste de serveur, salaire 2500 \$. Frais de dossier de 30 000 roupies à payer avant lundi.",
            Level.STOP, listOf("job_fee")),
        Case("Félicitations ! Votre candidature pour travailler à Dubaï est acceptée. Envoyez 15 000 Rs pour les frais de visa.",
            Level.STOP, listOf("job_fee", "prize_gift")),
        Case("SBM: ou kart inn bloke. Klik isi pou debloke: sbm-mu-verify.top",
            Level.STOP, listOf("bank_link", "bank_alarm")),
        Case("Investissez avec Everfxx et doublez votre argent en 30 jours, rendement garanti !",
            Level.STOP, listOf("fsc_alert", "guaranteed_returns")),
        Case("Allo, se mwa, mo finn sanz mo nimero. Mo finn avoy ou enn kod par erer, avoy mwa li vit.",
            Level.STOP, listOf("code_request", "new_number")),

        // ---------- CAREFUL ----------
        Case("Félicitations ! Vous avez gagné un iPhone 17. Payez seulement 500 Rs de frais de livraison.",
            Level.CAREFUL, listOf("prize_gift", "payment_request")),
        Case("Bravo! Ou finn gagn enn lot Rs 25,000 dan tiraz o sor. Avoy Rs 200 pou reklam ou lot.",
            Level.CAREFUL, listOf("prize_gift", "payment_request")),
        Case("Bonzour, nou fer ou larzan double dan 7 zour. Benefis garanti 100%. Kontakte nou lor WhatsApp.",
            Level.CAREFUL, listOf("guaranteed_returns")),
        Case("Coucou maman, j'ai changé de numéro, c'est mon nouveau numéro. Tu peux m'envoyer 3000 roupies en urgence ?",
            Level.CAREFUL, listOf("new_number", "payment_request", "urgency")),
        Case("Ou bizin peye Rs 1,500 zordi mem sinon ou kouran pou koupe.",
            Level.CAREFUL, listOf("payment_request", "urgency")),
        Case("Traffic Enforcement Alert: Speeding Case. Vous avez dépassé la limite. Payez l'amende sur govmu-avip.cam",
            Level.CAREFUL, listOf("cert_alert", "odd_link")),
        Case("Travay dan Dubai, kontakte My Web Ltd.",
            Level.CAREFUL, listOf("agency_wrong_category"), JobAnswers("local-my-web-ltd", null)),

        // ---------- NONE ----------
        Case("Bonzour mama, mo pe vinn lakaz ver 6er. Pa bizin kwi manze.", Level.NONE),
        Case("SBM : Votre code de vérification est 728193. Ne le communiquez jamais à personne.", Level.NONE),
        Case("MCB: Ou kod OTP se 551902. Pa donn li personn, mem enn anplwaye MCB.", Level.NONE),
        Case("Bonjour, suite à votre candidature, nous vous invitons à un entretien lundi à 10h. Apportez votre passeport.", Level.NONE),
        Case("Mo finn peye lekol Rs 2,000 zordi.", Level.NONE),
        Case("Merci, j'ai déjà payé les 500 roupies hier.", Level.NONE),
    )

    @Test
    fun everyCaseGivesTheExpectedLevel() {
        val failures = cases.mapNotNull { c ->
            val r = engine.check(c.text, c.job)
            val kinds = r.findings.map { it.kind }.toSet()
            val missing = c.mustHave.filter { it !in kinds }
            if (r.level != c.level || missing.isNotEmpty()) {
                "\"${c.text}\"\n   expected ${c.level} with $missing, got ${r.level} with $kinds"
            } else null
        }
        assertTrue("${failures.size} of ${cases.size} cases failed:\n" + failures.joinToString("\n"), failures.isEmpty())
    }

    @Test
    fun accentsAndCapitalsDoNotMatter() {
        val a = engine.check("FRAIS DE DOSSIER de Rs 20 000 pour l'offre d'emploi au Canada")
        val b = engine.check("frais de dossier de rs 20 000 pour l'offre d'emploi au canada")
        assertEquals(Level.STOP, a.level)
        assertEquals(a.level, b.level)
    }
}

/** Speed: the phone target is under 300 ms per check; on a laptop it should be far below that. */
class SpeedTest {
    @Test
    fun aLongMessageIsCheckedQuickly() {
        val engine = Engine(DataSetTest.loadRealData())
        val msg = ("Bonzour Kevin, THINK RECRUITMENT LTD isi. Travay dan lotel Kanada, saler 90,000. " +
            "Bizin peye fre dosie Rs 45,000 zordi mem. MCB: verify at mcb-login-secure.net. ").repeat(10)
        engine.check(msg) // warm-up
        val start = System.nanoTime()
        repeat(20) { engine.check(msg) }
        val msPerCheck = (System.nanoTime() - start) / 1_000_000.0 / 20
        assertTrue("took $msPerCheck ms per check", msPerCheck < 50)
    }
}
