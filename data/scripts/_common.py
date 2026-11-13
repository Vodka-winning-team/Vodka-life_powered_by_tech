"""Shared helpers for the data scripts (Person A).

Every script reads official files from data/raw/ and writes one JSON array
into app/src/main/assets/data/. See docs/sources.md for what each file holds.
"""
import json
import re
import unicodedata
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
RAW = ROOT / "data" / "raw"
OUT = ROOT / "app" / "src" / "main" / "assets" / "data"

# Date we downloaded and checked the sources (YYYY-MM-DD).
DOWNLOADED = "2026-11-13"

MONTHS = {m: i for i, m in enumerate(
    ["january", "february", "march", "april", "may", "june", "july",
     "august", "september", "october", "november", "december"], start=1)}


def write_json(name, rows):
    OUT.mkdir(parents=True, exist_ok=True)
    path = OUT / name
    path.write_text(json.dumps(rows, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"wrote {path.relative_to(ROOT)}: {len(rows)} rows")


def pdf_text(path):
    """All text of a PDF, whitespace collapsed to single spaces."""
    import pdfplumber
    with pdfplumber.open(path) as pdf:
        text = " ".join(page.extract_text() or "" for page in pdf.pages)
    return re.sub(r"\s+", " ", text)


def clean(text):
    """Join wrapped lines and fix the broken apostrophes the PDFs contain."""
    text = (text or "").replace("�", "'").replace("’", "'").replace("`", "'")
    return re.sub(r"\s+", " ", text).strip()


def slug(text):
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")


def parse_date(text):
    """'01 April 2026', '1st April 2026', '12.12.2024' -> '2026-04-01'."""
    text = clean(text)
    # The month may be split by a line break in a table cell ("Septem ber").
    m = re.search(r"(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z][A-Za-z ]*?)\s*,?\s+(\d{4})", text)
    month = m.group(2).replace(" ", "").lower() if m else ""
    if month in MONTHS:
        return f"{int(m.group(3)):04d}-{MONTHS[month]:02d}-{int(m.group(1)):02d}"
    m = re.search(r"(\d{1,2})[./](\d{1,2})[./](\d{4})", text)
    if m:
        return f"{int(m.group(3)):04d}-{int(m.group(2)):02d}-{int(m.group(1)):02d}"
    raise ValueError(f"cannot read a date in {text!r}")


PHONE_OK = re.compile(r"^\+230(\d{7}|5\d{7})$")


def normalize_phone(raw):
    """'212 3456', '(230) 5497-5200', '+230 212 3456' -> '+2302123456' / '+23054975200'.
    Only changes the format. Returns None if the digits are not a Mauritian
    landline (7 digits) or mobile (8 digits starting with 5)."""
    digits = re.sub(r"\D", "", raw or "")
    if len(digits) > 8 and digits.startswith("230"):
        digits = digits[3:]
    if len(digits) == 7 or (len(digits) == 8 and digits[0] == "5"):
        return "+230" + digits
    return None


def phones_in(text):
    """Mauritian numbers in a text, in the format '+230XXXXXXX' or '+2305XXXXXXX'.
    The register also prints some landlines as 4+3 digits ("4637 800", page 5)."""
    found = []
    for m in re.finditer(r"(?<!\d)(\d{3,4})[\s-]?(\d{3,4})(?!\d)", text or ""):
        phone = normalize_phone(m.group(1) + m.group(2))
        if phone:
            found.append(phone)
    return found
