"""cert_alerts.json: CERT-MU security alerts about scam campaigns, with the
phrases each alert quotes, so a matching message can cite the official alert.

Sources: data/raw/cert/<file>.pdf, listed on https://cert-mu.govmu.org/cert-mu/?page_id=1439

Every phrase and the date must appear in the alert PDF, or the script stops.
Privacy: the property alert names a person and lists private mobile numbers.
None of those are copied here.
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from _common import DOWNLOADED, RAW, parse_date, pdf_text, write_json  # noqa: E402

U = "https://cert-mu.govmu.org/cert-mu/wp-content/uploads/"

# (id, campaign, phrases quoted by the alert, "Date of Issue" as printed, file, path)
ALERTS = [
    ("divali_cash_gift", "Fake Divali cash gift on WhatsApp",
     ["Divali Cash Gift", "cash gift", "Rs. 2,000", "View Now"],
     "30 October 2026", "Security-Alert-Divali-Bonus-Scam-on-WhatsApp", "2026/11/"),
    ("property_deposit_tiktok", "Fake property adverts on TikTok asking for a deposit before a visit",
     ["property visit", "secure a property viewing", "advance payment or deposit", "Rs. 700,000"],
     "1st October 2026", "Security-Alert-Property-Scam", "2026/10/"),
    ("fake_speeding_fine", "Fake speeding fine by SMS",
     ["Traffic Enforcement Alert", "Speeding Case", "govmu-avip.cam", "exceeded the speed limit",
      "driving license will be suspended"],
     "1 July 2026", "Security-Alert-Scam-in-Circulation-Fake-Speeding-Fines-in-Mauritius", "2026/07/"),
    ("mt_lucky_draw", "Fake Mauritius Telecom lucky draw",
     ["Lucky Draw", "mauritiustelecomeluckydraw@gmail.com", "won a prize", "promotional offer"],
     "17 April 2026", "Security-Alert-MT-Phishing-Scam", "2026/04/"),
    ("whatsapp_impersonation", "WhatsApp messages posing as family, a bank or an employer",
     ["new phone number", "urgent money transfers", "one-time passwords", "verification codes"],
     "6 February 2026", "Security-Alert-WhatsApp-Scam", "2026/02/"),
]


def main():
    problems, rows = [], []
    for id_, campaign, phrases, printed_date, file, path in ALERTS:
        text = pdf_text(RAW / "cert" / f"{file}.pdf").lower().replace("“", '"').replace("”", '"')
        if f"date of issue: {printed_date.lower()}" not in text:
            problems.append(f"{id_}: date {printed_date!r} not found in cert/{file}.pdf")
        for phrase in phrases:
            if phrase.lower() not in text:
                problems.append(f"{id_}: phrase {phrase!r} not found in cert/{file}.pdf")
        url = f"{U}{path}{file}.pdf"
        rows.append({
            "id": id_,
            "campaign": campaign,
            "phrases": phrases,
            "alert_date": parse_date(printed_date),
            "alert_url": url,
            "source_url": url,
            "snapshot": DOWNLOADED,
        })
    for msg in problems:
        print("PROBLEM:", msg)
    write_json("cert_alerts.json", rows)
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
