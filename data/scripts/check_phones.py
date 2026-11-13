"""Audit the phone numbers in agencies.json.

Run:  python data/scripts/check_phones.py          report only
      python data/scripts/check_phones.py --fix    also fix format problems in agencies.json

For every agency it checks:
  - not blank;
  - "+230" then 7 digits (landline) or 8 digits starting with 5 (mobile), no spaces/dashes/brackets;
  - the number really is in that agency's row of the register PDF (data/raw/register/);
  - no other agency (a different name) has the same number.
The same company can hold several licences (local / abroad / non_citizen),
so the same number on rows with the same name is expected, not a problem.

--fix only changes the format ("+230 212 3456" -> "+2302123456"). It never
adds, guesses or looks up a number: missing or doubtful numbers are listed.
It also writes data/phones-check.md, a table to tick by eye against the PDF.
"""
import json
import sys
from collections import defaultdict
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from _common import OUT, PHONE_OK, ROOT, clean, normalize_phone  # noqa: E402
import agencies as register  # noqa: E402  (same PDF reading as agencies.py)

JSON = OUT / "agencies.json"
TABLE = ROOT / "data" / "phones-check.md"


def register_phones():
    """{(page, name): [all phones printed in that row]} read from the register PDF."""
    import pdfplumber
    rows = {}
    with pdfplumber.open(register.PDF) as pdf:
        for page_no, page in enumerate(pdf.pages, start=1):
            for table in page.extract_tables():
                for raw in table:
                    r = [c for c in raw if c and c.strip()]
                    if len(r) == 7 and r[0].strip().rstrip(".").isdigit():
                        _, phones = register.split_address(r[register.ADDRESS])
                        rows[(page_no, clean(r[register.NAME]))] = phones
    return rows


def main(fix):
    agencies = json.loads(JSON.read_text(encoding="utf-8"))
    in_pdf = register_phones()
    problems, notes, fixes = [], [], []

    for a in agencies:
        phone = a.get("phone")
        where = (a["id"], a["name"], a["page"])
        if not phone or not str(phone).strip():
            problems.append((*where, "no phone (blank) - check the PDF row, do not guess"))
            continue
        if not PHONE_OK.match(phone):
            fixed = normalize_phone(phone)
            if fixed:
                fixes.append((*where, f"format {phone!r} -> {fixed!r}"))
                if fix:
                    a["phone"] = phone = fixed
            else:
                problems.append((*where, f"{phone!r} is not a Mauritian landline or mobile number"))
                continue
        printed = in_pdf.get((a["page"], a["name"]))
        if printed is None:
            problems.append((*where, "row not found in the register PDF"))
        elif normalize_phone(phone) not in printed:
            problems.append((*where, f"{phone} is not in this row of the PDF (PDF has {printed})"))
        elif len(printed) > 1:
            notes.append((*where, f"PDF lists {len(printed)} numbers {printed}; the file keeps the first"))

    by_phone = defaultdict(set)
    for a in agencies:
        if a.get("phone"):
            by_phone[normalize_phone(a["phone"]) or a["phone"]].add(a["name"])
    for a in agencies:
        names = by_phone.get(normalize_phone(a.get("phone") or "") or a.get("phone"), set())
        if len(names) > 1:
            others = sorted(names - {a["name"]})
            problems.append((a["id"], a["name"], a["page"], f"same number as another agency: {others}"))

    valid = sum(1 for a in agencies if a.get("phone") and PHONE_OK.match(a["phone"]))
    print(f"Agencies: {len(agencies)}")
    print(f"Valid phone (format {'after fix' if fix else 'now'}): {valid}")
    print(f"Format fixes {'applied' if fix else 'needed (run with --fix)'}: {len(fixes)}")
    print(f"Problems: {len(problems)}")
    for id_, name, page, what in problems:
        print(f"  PROBLEM  {id_} | {name} | page {page} | {what}")
    print(f"Notes (several numbers in the register, first one kept): {len(notes)}")
    for id_, name, page, what in notes:
        print(f"  note     {id_} | page {page} | {what}")

    if fix and fixes:
        JSON.write_text(json.dumps(agencies, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"wrote {JSON.relative_to(ROOT)}")
    write_table(agencies)
    return 1 if problems else 0


def write_table(agencies):
    lines = [
        "# Agency phone check",
        "",
        "Tick each row after comparing it with the register PDF "
        "(`data/raw/register/agencies_register.pdf`, Ministry list as at 04 Nov 2026).",
        "Made by `data/scripts/check_phones.py`; re-run it after any data change.",
        "",
        "| ✓ | id | name | phone | page |",
        "|---|---|---|---|---|",
    ]
    for a in agencies:
        lines.append(f"| [ ] | {a['id']} | {a['name']} | {a.get('phone') or '**MISSING**'} | {a['page']} |")
    TABLE.write_text("\n".join(lines) + "\n", encoding="utf-8")
    print(f"wrote {TABLE.relative_to(ROOT)} ({len(agencies)} rows)")


if __name__ == "__main__":
    sys.exit(main(fix="--fix" in sys.argv))
