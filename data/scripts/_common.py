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


def phones_in(text):
    """Mauritian numbers in a text, as '+230 XXX XXXX' (7 digits) or '+230 XXXX XXXX' (8 digits)."""
    found = []
    for m in re.finditer(r"(?<!\d)(\d{3,4})[\s-]?(\d{4})(?!\d)", text or ""):
        digits = m.group(1) + m.group(2)
        if len(digits) == 7:
            found.append(f"+230 {digits[:3]} {digits[3:]}")
        elif len(digits) == 8 and digits[0] == "5":
            found.append(f"+230 {digits[:4]} {digits[4:]}")
    return found
