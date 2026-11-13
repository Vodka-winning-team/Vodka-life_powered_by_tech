"""fsc_alerts.json: Financial Services Commission (FSC) investor alerts about
organisations that are not licensed by the FSC.

Sources: one FSC alert PDF per row, saved in data/raw/fsc/<file>.pdf.
The FSC index page blocks scripts, but the alert PDFs download normally.

Privacy: FSC alerts that name private individuals are left out on purpose,
and their names are not written here. Organisations only.

For each row the script checks, in the PDF text: the name, the date as
printed, and every domain. It stops if any of them is missing.
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from _common import DOWNLOADED, RAW, parse_date, pdf_text, write_json  # noqa: E402

M = "https://www.fscmauritius.org/media/"

# (id, name, domains, date as printed in the PDF, raw file, alert URL)
ALERTS = [
    ("mornefundvex", "Mornefundvex.net", ["mornefundvex.net"], "30 June 2026",
     "mornefundvex", M + "j4hpzi4b/v10-investor-alert-mornefundvex-ed-30062026.pdf"),
    ("star_net", "STAR NET LIMITED (Starnet Limited)", ["starnetfx.com"], "29 June 2026",
     "starnet", M + "wivpfmih/annex-6-investor-alert-290626-1.pdf"),
    ("distributex", "DistributeX", ["dx9001.com"], "30 April 2026",
     "distributex", M + "g5imvcdp/v10-investor-alert-distributex-ed-30042026.pdf"),
    ("loan_agency_of_mauritius", "Loan Agency of Mauritius", [], "30 April 2026",
     "maaf-loan-agency", M + "s2lddtmx/v10-investor-alert-maaf-assurance-ed-30042026.pdf"),
    ("maaf_assurance", "MAAF Assurance", [], "30 April 2026",
     "maaf-loan-agency", M + "s2lddtmx/v10-investor-alert-maaf-assurance-ed-30042026.pdf"),
    ("krakeif_global", "KRAKEIF Global", [], "04 December 2024",
     "krakeif-global", M + "194592/investor-alert-krakeif-to-publish-on-website.pdf"),
    ("seal_exchange", "SEAL Exchange", [], "18 September 2024",
     "seal-exchange", M + "193031/investor-alert-seal-exchange.pdf"),
    ("qnet", "Qnet Ltd", [], "27 March 2025",
     "qnet", M + "198707/communique_qnet-27032025-1.pdf"),
    ("crypto_coin_investment", "Crypto Coin Investment", [], "31 October 2023",
     "crypto-coin-investment", M + "167543/investor-alert-crypto-coin-investment-311023.pdf"),
    ("trading_asset_solution", "Trading Asset Solution", ["tradingassetsolution.com"], "24 October 2023",
     "trading-asset-solution", M + "166510/investor-alert-trading-asset-solution.pdf"),
    ("al_veyux", "AL VEYUX", [], "27 September 2023",
     "al-veyux", M + "159711/investor-alert-final-al-veyux.pdf"),
    ("match_cfd", "Match CFD", [], "24 April 2023",
     "match-cfd", M + "143875/investor-alert-cfd-rev-krag.pdf"),
    ("localcoinswap", "Localcoinswap", ["localcoinswap.com"], "9 March 2023",
     "localcoinswap", M + "ydbdwe54/v11-annex-25-investor-alert-localcoinswap.pdf"),
    ("saqs_investment", "Saqs Investment", [], "06 February 2023",
     "saqs-investment", M + "137587/saqs-investment.pdf"),
    ("financemarketindex", "Financemarketindex", ["financemarketindex.com"], "27 June 2022",
     "financemarketindex", M + "129516/investor-alert-financemarketindex-_-billionaires-finance.pdf"),
    ("billionaires_finance", "Billionaires Finance", ["financemarketindex.com"], "27 June 2022",
     "financemarketindex", M + "129516/investor-alert-financemarketindex-_-billionaires-finance.pdf"),
    ("fxtradeoptions", "FXTradeOptions Limited", ["fxtradeoptions.com"], "04 May 2022",
     "fxtradeoptions", M + "123472/investor-alert.pdf"),
    ("everfxx", "Everfxx", ["everfxx.co.uk"], "28 March 2022",
     "everfxx", M + "123389/investor-alert-everfxx.pdf"),
    ("binary_fxcent", "Binary Fxcent", [], "12 July 2021",
     "binary-fxcent", M + "105842/annex-6-investor-alert-binary-fxcent-rev-agr.pdf"),
    # The PDF also prints "03 May 2016": that is the date on the fake licence, not the alert.
    ("24forexlive", "24FOREXLIVE LIMITED", [], "30 January 2019",
     "24forexlive", M + "70748/investor-alert-forexlive.pdf"),
    ("247_options_trade", "247 OPTIONS TRADE", [], "12 December 2017",
     "247-options-trade", M + "4214/investor-alert-247-options-trade-pdf.pdf"),
]


def main():
    problems, rows, texts = [], [], {}
    for id_, name, domains, printed_date, file, url in ALERTS:
        if file not in texts:
            texts[file] = pdf_text(RAW / "fsc" / f"{file}.pdf").lower()
        text = texts[file]
        for probe in [name, printed_date, *domains]:
            if probe.lower() not in text:
                problems.append(f"{id_}: {probe!r} not found in fsc/{file}.pdf")
        rows.append({
            "id": id_,
            "name": name,
            "domains": domains,
            "alert_date": parse_date(printed_date),
            "alert_url": url,
            "source_url": url,
            "snapshot": DOWNLOADED,
        })
    rows.sort(key=lambda r: r["alert_date"], reverse=True)
    for msg in problems:
        print("PROBLEM:", msg)
    write_json("fsc_alerts.json", rows)
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
