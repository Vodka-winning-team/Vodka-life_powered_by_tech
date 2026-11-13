"""banks.json: licensed banks and payment service providers (PSPs), with their
official web domains and the official phone number to call back.

Licence sources (data/raw/bom/):
  bom_list.html     Bank of Mauritius "List of Licensees" page, Banks (18 banks)
  bom_licensee.pdf  Bank of Mauritius list of licensed payment service providers

The names below must appear in those files, or the script stops.
Domains and phones come from each bank's own website (phone_source), checked 13 Nov 2026.

How B should use the fields:
  keywords  lowercase words that mean the message names this bank or app
  domains   a link is official if its host equals a domain or ends with "." + domain
  phone     "+230 ..." or a Mauritian short code ("8971"), which dials as is in Mauritius

Left out on purpose: EZ Dash Limited (PSP). No official website or phone number found.
"""
import html
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from _common import DOWNLOADED, RAW, clean, write_json  # noqa: E402

BANKS_URL = "https://www.bom.mu/financial-stability/supervision/licensees/list-of-licensees"
PSP_URL = "https://bom.mu/sites/default/files/licensee.pdf"

# (id, name as BoM lists it, keywords, domains, phone, phone_source)
BANKS = [
    ("abc", "ABC Banking Corporation Ltd", ["abc banking"], ["abcbanking.mu"],
     "+230 206 8000", "https://abcbanking.mu/contact-us/"),
    ("absa", "Absa Bank (Mauritius) Limited", ["absa"], ["absabank.mu"],
     "+230 402 1000", "https://www.absabank.mu/en/product-terms-and-conditions"),
    ("afrasia", "AfrAsia Bank Limited", ["afrasia"], ["afrasiabank.com"],
     "+230 403 5570", "https://www.afrasiabank.com/en/private/security-tips-to-protect-yourself-online/how-to-report-suspected-fraud"),
    ("baroda", "Bank of Baroda", ["bank of baroda", "baroda"], ["bankofbaroda-mu.com"],
     "+230 208 1504", "https://www.bankofbaroda-mu.com/contact-us"),
    ("boc", "BANK OF CHINA (MAURITIUS) LIMITED", ["bank of china"], ["bankofchina.com"],
     "+230 203 4878", "https://www.bankofchina.com/mu/"),
    ("bankone", "Bank One Limited", ["bank one", "bankone"], ["bankone.mu"],
     "+230 202 9200", "https://bankone.mu/"),
    ("patronus", "Banque Patronus Limitée", ["banque patronus", "patronus"], ["banquepatronus.com"],
     "+230 490 4125", "https://www.banquepatronus.com/"),
    ("bcp", "BCP Bank (Mauritius) Ltd", ["bcp bank", "bcp"], ["bcpbank.mu"],
     "+230 207 1000", "https://bcpbank.mu/personal/produit/loss-or-theft"),
    ("hsbc", "HSBC Bank (Mauritius) Limited", ["hsbc"], ["hsbc.co.mu"],
     "+230 403 8369", "https://www.business.hsbc.co.mu/"),
    ("hsbc_corp", "The Hongkong and Shanghai Banking Corporation Limited",
     ["hongkong and shanghai banking"], ["hsbc.co.mu"],
     "+230 403 8369", "https://www.business.hsbc.co.mu/"),
    ("investec", "Investec Bank (Mauritius) Limited", ["investec"], ["investec.com", "investec.co.mu"],
     "+230 207 4004", "https://www.investec.com/en_mu/welcome-to-investec/contact-us.html"),
    ("maubank", "MauBank Ltd", ["maubank", "mau bank"], ["maubank.mu"],
     "+230 405 9400", "https://www.maubank.mu/contact-us/"),
    ("sbi", "SBI (Mauritius) Ltd", ["sbi", "state bank of india"],
     ["sbimauritius.com", "mu.statebank", "onlinesbiglobal.statebank"],
     "+230 404 4999", "https://mu.statebank/contact-us"),
    ("sbm", "SBM Bank (Mauritius) Ltd", ["sbm"], ["sbmgroup.mu"],
     "+230 207 0111", "https://www.sbmgroup.mu/"),
    ("standard_bank", "Standard Bank (Mauritius) Limited", ["standard bank"], ["standardbank.mu"],
     "+230 402 5200", "https://www.standardbank.mu/"),
    ("standard_chartered", "Standard Chartered Bank (Mauritius) Limited", ["standard chartered"],
     ["sc.com"], "+230 403 6500", "https://www.sc.com/mu/contact/"),
    ("mcb", "The Mauritius Commercial Bank Limited", ["mcb", "juice", "mcb juice"], ["mcb.mu"],
     "+230 202 6060", "https://www.mcb.mu/contact-us"),
    ("warwyck", "Warwyck Private Bank Ltd", ["warwyck"], ["warwyck.com", "warwyckprivatebank.com"],
     "+230 698 2700", "https://www.warwyck.com"),
]

PSPS = [
    ("cim", "CIM Financial Services Ltd", ["cim finance", "cim financial"], ["cimfinance.mu", "cim.mu"],
     "+230 203 6800", "https://cimfinance.mu/"),
    ("emtel_mfs", "Emtel MFS Co Ltd", ["blink by emtel", "blink wallet", "blink app", "emtel mfs"],
     ["emtel.com"], "8971", "https://blink.emtel.com"),
    ("cellplus", "Cellplus Mobile Communications Limited", ["my.t money", "myt money", "mytmoney"],
     ["myt.mu", "telecom.mu"], "8908", "https://myt.mu/support/mytmoney/1/money"),
]


def compact(text):
    """Lowercase letters and digits only, without legal suffixes, so that
    'Banque Patronus Limitée' matches BoM's garbled 'Banque Patronus Limit?e'."""
    text = re.sub(r"\b(limit\S*|ltd|co)\b", " ", clean(text).lower())
    return re.sub(r"[^a-z0-9]", "", text)


def bom_bank_text():
    s = (RAW / "bom" / "bom_list.html").read_text(encoding="utf-8", errors="replace")
    s = re.sub(r"<script.*?</script>|<style.*?</style>", "", s, flags=re.S)
    return compact(html.unescape(re.sub(r"<[^>]+>", " ", s)))


def bom_psp_names():
    """Names in the first column of the PSP table (plain text mixes the columns)."""
    import pdfplumber
    names = []
    with pdfplumber.open(RAW / "bom" / "bom_licensee.pdf") as pdf:
        for page in pdf.pages:
            for table in page.extract_tables():
                names += [compact(r[0]) for r in table if r and r[0] and clean(r[0])]
    return " ".join(names)


def main():
    banks_text, psp_text = bom_bank_text(), bom_psp_names()
    problems, rows = [], []
    for kind, items, text, url in (("bank", BANKS, banks_text, BANKS_URL), ("psp", PSPS, psp_text, PSP_URL)):
        for id_, name, keywords, domains, phone, phone_source in items:
            if compact(name) not in text:
                problems.append(f"{id_}: {name!r} not found in the BoM {kind} list")
            rows.append({
                "id": id_,
                "name": name,
                "type": kind,
                "keywords": keywords,
                "domains": domains,
                "phone": phone,
                "phone_source": phone_source,
                "source_url": url,
                "snapshot": DOWNLOADED,
            })
    if sum(1 for r in rows if r["type"] == "bank") != 18:
        problems.append("expected the 18 banks on the BoM list")
    for msg in problems:
        print("PROBLEM:", msg)
    write_json("banks.json", rows)
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
