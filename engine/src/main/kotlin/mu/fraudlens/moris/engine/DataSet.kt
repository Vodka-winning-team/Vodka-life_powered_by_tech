package mu.fraudlens.moris.engine

import kotlinx.serialization.json.Json
import kotlinx.serialization.json.JsonArray
import kotlinx.serialization.json.JsonObject
import kotlinx.serialization.json.jsonArray
import kotlinx.serialization.json.jsonObject
import kotlinx.serialization.json.jsonPrimitive

/** All official records the engine checks against. The app reads the 5 JSON files as text and passes them here. */
class DataSet(
    val agencies: List<Agency>,
    val feeRules: List<FeeRule>,
    val banks: List<Bank>,
    val fscAlerts: List<FscAlert>,
    val certAlerts: List<CertAlert>,
) {
    companion object {
        fun fromJson(
            agencies: String,
            feeRules: String,
            banks: String,
            fscAlerts: String,
            certAlerts: String,
        ): DataSet = DataSet(
            agencies = rows(agencies).map { r ->
                Agency(
                    id = r.str("id"), name = r.str("name"), category = r.str("category"),
                    phone = r.str("phone"), address = r.str("address"),
                    validFrom = r.str("valid_from"), expiry = r.str("expiry"),
                    page = r.str("page").toIntOrNull() ?: 0,
                    sourceUrl = r.str("source_url"), snapshot = r.str("snapshot"),
                )
            },
            feeRules = rows(feeRules).map { r ->
                FeeRule(
                    id = r.str("id"), cost = r.str("cost"),
                    wordsEn = r.list("words_en"), wordsFr = r.list("words_fr"), wordsMfe = r.list("words_mfe"),
                    payer = r.str("payer"), ref = r.str("ref"),
                    sourceUrl = r.str("source_url"), snapshot = r.str("snapshot"),
                )
            },
            banks = rows(banks).map { r ->
                Bank(
                    id = r.str("id"), name = r.str("name"), type = r.str("type"),
                    keywords = r.list("keywords"), domains = r.list("domains"),
                    phone = r.str("phone"), phoneSource = r.str("phone_source"),
                    sourceUrl = r.str("source_url"), snapshot = r.str("snapshot"),
                )
            },
            fscAlerts = rows(fscAlerts).map { r ->
                FscAlert(
                    id = r.str("id"), name = r.str("name"), domains = r.list("domains"),
                    alertDate = r.str("alert_date"), alertUrl = r.str("alert_url"),
                    sourceUrl = r.str("source_url"), snapshot = r.str("snapshot"),
                )
            },
            certAlerts = rows(certAlerts).map { r ->
                CertAlert(
                    id = r.str("id"), campaign = r.str("campaign"), phrases = r.list("phrases"),
                    alertDate = r.str("alert_date"), alertUrl = r.str("alert_url"),
                    sourceUrl = r.str("source_url"), snapshot = r.str("snapshot"),
                )
            },
        )

        private fun rows(text: String): List<JsonObject> = Json.parseToJsonElement(text).jsonArray.map { it.jsonObject }

        /** A missing field becomes "" so one bad row never crashes the app; validate.py catches it at build time. */
        private fun JsonObject.str(key: String): String = this[key]?.jsonPrimitive?.content ?: ""

        private fun JsonObject.list(key: String): List<String> =
            (this[key] as? JsonArray)?.map { it.jsonPrimitive.content } ?: emptyList()
    }
}
