"""fee_rules.json: which recruitment costs the employer must pay, never the worker.

Sources (data/raw/law/):
  pra_act_2023.pdf   Private Recruitment Agencies Act 2023, s.5 "Fees for recruitment"
  pra_regs_2025.pdf  Private Recruitment Agencies Regulations 2025 (GN 98 of 2025), reg 7(2)

Each rule keeps the exact clause wording in QUOTE. The script stops if that
wording is not found in the PDF, so every `ref` is checked against the law text.
The word lists are what a message might say for that cost (EN / FR / Kreol).
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from _common import DOWNLOADED, RAW, pdf_text, write_json  # noqa: E402

ACT_URL = ("https://empment-labour.govmu.org/SiteAssets/MofedStyles/Doc/Recruitment%20%20Licence/"
           "The%20Private%20Recruitment%20Agencies%20Act%202023.pdf")
REGS_URL = ("https://empment-labour.govmu.org/SiteAssets/MofedStyles/Doc/Recruitment%20%20Licence/"
            "The%20Private%20Recruitment%20Agencies%20Regulation%202025.pdf")
ACT = "Private Recruitment Agencies Act 2023"
REGS = "Private Recruitment Agencies Regulations 2025"

RULES = [
    {
        "id": "any_recruitment_fee",
        "cost": "Any fee for recruiting the worker",
        "words_en": ["recruitment fee", "registration fee", "placement fee", "agency fee",
                     "job fee", "service fee", "commission"],
        "words_fr": ["frais de recrutement", "frais d'inscription", "frais de placement",
                     "frais d'agence", "commission"],
        "words_mfe": ["fre rekritman", "fre lagans", "fre enskripsion", "fre linskripsion", "komisyon"],
        "ref": f"{ACT}, s.5(1)",
        "law": "act",
        "quote": "(1) No private recruitment agency, labour contractor or employer, including an employer "
                 "referred to in section 3(2), shall charge a worker any fee in relation to his recruitment.",
    },
    {
        "id": "air_ticket",
        "cost": "Round trip air tickets",
        "words_en": ["air ticket", "air tickets", "plane ticket", "flight ticket", "airfare", "air fare",
                     "return ticket", "travel fee"],
        "words_fr": ["billet d'avion", "billets d'avion", "billet aller-retour", "frais de voyage"],
        "words_mfe": ["tiket avion", "biye avion", "tiket aller-retour", "fre vwayaz"],
        "ref": f"{REGS}, reg 7(2)(a)",
        "law": "regs",
        "quote": "(a) round trip air tickets;",
    },
    {
        "id": "police_report",
        "cost": "Police report fee",
        "words_en": ["police report", "police certificate", "certificate of character", "police clearance"],
        "words_fr": ["rapport de police", "certificat de moralité", "certificat de police", "casier judiciaire"],
        "words_mfe": ["rapor lapolis", "sertifika karakter", "sertifika moralite", "papie lapolis"],
        "ref": f"{REGS}, reg 7(2)(b)",
        "law": "regs",
        "quote": "(b) police report fee;",
    },
    {
        "id": "passport",
        "cost": "Passport issuance fee",
        "words_en": ["passport fee", "passport"],
        "words_fr": ["frais de passeport", "passeport"],
        "words_mfe": ["fre paspor", "paspor"],
        "ref": f"{REGS}, reg 7(2)(c)",
        "law": "regs",
        "quote": "(c) passport issuance fee;",
    },
    {
        "id": "visa",
        "cost": "Visa fee",
        "words_en": ["visa fee", "visa"],
        "words_fr": ["frais de visa", "visa"],
        "words_mfe": ["fre viza", "viza"],
        "ref": f"{REGS}, reg 7(2)(d)",
        "law": "regs",
        "quote": "(d) visa fee;",
    },
    {
        "id": "processing",
        "cost": "Processing fee",
        "words_en": ["processing fee", "processing fees", "file fee", "admin fee", "administration fee",
                     "application fee"],
        "words_fr": ["frais de dossier", "frais de traitement", "frais administratifs"],
        "words_mfe": ["fre dosie", "fre dosye", "fre prosesing", "fre administratif"],
        "ref": f"{REGS}, reg 7(2)(e)",
        "law": "regs",
        "quote": "(e) processing fee;",
    },
    {
        "id": "work_permit",
        "cost": "Work permit fee",
        "words_en": ["work permit fee", "work permit"],
        "words_fr": ["frais de permis de travail", "permis de travail"],
        "words_mfe": ["permi travay", "permi de travay", "fre permi"],
        "ref": f"{REGS}, reg 7(2)(f)",
        "law": "regs",
        "quote": "(f) work permit fee;",
    },
    {
        "id": "annual_fees",
        "cost": "Annual fees",
        "words_en": ["annual fee", "annual fees", "yearly fee"],
        "words_fr": ["frais annuels", "cotisation annuelle"],
        "words_mfe": ["fre aniel", "fre chak lane"],
        "ref": f"{REGS}, reg 7(2)(g)",
        "law": "regs",
        "quote": "(g) annual fees;",
    },
]

# reg 7(2) opening words: these costs "shall be borne by the employer".
REG_7_2 = ("(2) For the purpose of section 5(3) of the Act, the following costs incurred in respect of "
           "the recruitment of a worker shall be borne by the employer")


def main():
    text = {"act": pdf_text(RAW / "law" / "pra_act_2023.pdf"),
            "regs": pdf_text(RAW / "law" / "pra_regs_2025.pdf")}
    problems = []
    if REG_7_2 not in text["regs"]:
        problems.append("reg 7(2) opening words not found in the Regulations PDF")
    rows = []
    for r in RULES:
        if r["quote"] not in text[r["law"]]:
            problems.append(f"{r['id']}: clause wording not found in the PDF: {r['quote']!r}")
        rows.append({
            "id": r["id"],
            "cost": r["cost"],
            "words_en": r["words_en"],
            "words_fr": r["words_fr"],
            "words_mfe": r["words_mfe"],
            "payer": "employer",
            "ref": r["ref"],
            "source_url": ACT_URL if r["law"] == "act" else REGS_URL,
            "snapshot": DOWNLOADED,
        })
    for msg in problems:
        print("PROBLEM:", msg)
    write_json("fee_rules.json", rows)
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
