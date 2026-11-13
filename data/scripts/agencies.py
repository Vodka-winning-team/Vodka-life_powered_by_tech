"""agencies.json from the Ministry of Labour register of private recruitment agencies.

Source: data/raw/register/agencies_register.pdf (list "as at 04 November 2026", 22 pages).
The PDF has three sections, each a table:
  "Citizens of Mauritius for Employment in Mauritius" -> category "local"
  "Citizens of Mauritius for Employment Abroad"       -> category "abroad"
  "Non-Citizens for Employment in Mauritius"          -> category "non_citizen"

Privacy: the "Name of Director(s)" and "Email Address" columns are never read
into the output (emails contain people's names).
"""
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from _common import RAW, clean, parse_date, phones_in, slug, write_json  # noqa: E402

PDF = RAW / "register" / "agencies_register.pdf"
SOURCE_URL = "https://empment-labour.govmu.org/Documents/Recruitment/List%20of%20Recruitment%20Agencies.pdf"
SNAPSHOT = "2026-11-04"  # the "as at" date printed on the register
SECTIONS = {
    "Citizens of Mauritius for Employment in Mauritius": "local",
    "Citizens of Mauritius for Employment Abroad": "abroad",
    "Non-Citizens for Employment in Mauritius": "non_citizen",
}
EXPECTED = {"local": 20, "abroad": 12, "non_citizen": 47}

# Each row has 7 filled cells in this order. Page 9 has extra empty columns,
# so we read the filled cells in order instead of fixed column positions.
SN, NAME, DIRECTORS, ADDRESS, EMAIL, VALID_FROM, EXPIRY = range(7)


# Names the PDF text breaks inside a word. Each fix was checked on the page image
# (visual check of all 22 pages, 14 Nov 2026): page 20 prints "MAREEMOOTO" and "O LIMITED"
# on two lines of the same cell.
NAME_FIXES = {"DEEVALEN MAREEMOOTO O LIMITED": "DEEVALEN MAREEMOOTOO LIMITED"}


def licensee_name(cell):
    name = clean(cell)
    return NAME_FIXES.get(name, name)


def is_phone_line(line):
    return re.fullmatch(r"[\d\s/,.\-]+", line) and len(re.sub(r"\D", "", line)) >= 7


def split_address(cell):
    """The cell holds the address lines, then one or more phone lines."""
    lines = [clean(x) for x in (cell or "").split("\n") if clean(x)]
    address = clean(" ".join(x for x in lines if not is_phone_line(x)))
    address = re.sub(r"\s+,", ",", address)
    phones = phones_in(" ".join(x for x in lines if is_phone_line(x)))
    return address, list(dict.fromkeys(phones))  # some rows print a number twice; keep PDF order


def category_of(page_text):
    flat = clean(page_text)
    for title, cat in SECTIONS.items():
        if f"authorised to recruit {title}" in flat:
            return cat
    raise ValueError("page has no known section title")


def main():
    import pdfplumber
    rows, problems = [], []
    with pdfplumber.open(PDF) as pdf:
        for page_no, page in enumerate(pdf.pages, start=1):
            cat = category_of(page.extract_text())
            for table in page.extract_tables():
                for raw in table:
                    r = [c for c in raw if c and c.strip()]
                    if not r or not re.fullmatch(r"\d+\.?", r[SN].strip()):
                        continue
                    if len(r) != 7:
                        problems.append(f"page {page_no}: row {r[SN]} has {len(r)} filled cells, expected 7")
                        continue
                    sn = int(r[SN].strip().rstrip("."))
                    name = licensee_name(r[NAME])
                    address, phones = split_address(r[ADDRESS])
                    if not phones:
                        problems.append(f"page {page_no} {cat} #{sn} {name}: no phone found")
                    row = {
                        "id": f"{cat}-{slug(name)}",
                        "name": name,
                        "category": cat,
                        "phone": phones[0] if phones else None,
                        "phones": phones,  # every number the register prints, first = phone
                        "address": address,
                        "valid_from": parse_date(r[VALID_FROM]),
                        "expiry": parse_date(r[EXPIRY]),
                        "page": page_no,
                        "source_url": SOURCE_URL,
                        "snapshot": SNAPSHOT,
                    }
                    # A director's name must never leak into a field we keep.
                    if re.search(r"\b(Mr|Mrs|Ms|Miss)\b\.?\s", f"{name} {address}"):
                        problems.append(f"page {page_no} #{sn}: title of a person in name/address")
                    rows.append((sn, row))

    counts = {c: sum(1 for _, r in rows if r["category"] == c) for c in EXPECTED}
    if counts != EXPECTED:
        problems.append(f"row counts {counts}, expected {EXPECTED}")
    for cat in EXPECTED:
        sns = [sn for sn, r in rows if r["category"] == cat]
        if sns != list(range(1, len(sns) + 1)):
            problems.append(f"{cat}: serial numbers not 1..n: {sns}")
    ids = [r["id"] for _, r in rows]
    if len(ids) != len(set(ids)):
        problems.append("duplicate ids")
    for msg in problems:
        print("PROBLEM:", msg)
    write_json("agencies.json", [r for _, r in rows])
    return 1 if problems else 0


if __name__ == "__main__":
    sys.exit(main())
