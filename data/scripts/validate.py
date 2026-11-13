"""Check every data file in app/src/main/assets/data/.

Run:  python data/scripts/validate.py     (exit code 0 = all good)

Checks: valid JSON array; exactly the fields of the contract (docs/TASKS.md §2,
plus source_url and snapshot); unique ids; every row has source_url and
snapshot; agency phones are "+230" + 7 digits or 8 digits starting with 5,
no spaces; other phones start with +230 (or are a 3-4 digit short code);
dates are real YYYY-MM-DD dates; no person titles (Mr/Mrs/Ms) anywhere.
"""
import json
import re
import sys
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from _common import OUT, PHONE_OK  # noqa: E402

COMMON = {"source_url", "snapshot"}
FIELDS = {
    "agencies.json": {"id", "name", "category", "phone", "address", "valid_from", "expiry", "page"},
    "fee_rules.json": {"id", "cost", "words_en", "words_fr", "words_mfe", "payer", "ref"},
    "banks.json": {"id", "name", "type", "keywords", "domains", "phone", "phone_source"},
    "fsc_alerts.json": {"id", "name", "domains", "alert_date", "alert_url"},
    "cert_alerts.json": {"id", "campaign", "phrases", "alert_date", "alert_url"},
}
ALLOWED = {
    ("agencies.json", "category"): {"abroad", "local", "non_citizen"},
    ("fee_rules.json", "payer"): {"employer"},
    ("banks.json", "type"): {"bank", "psp"},
}
DATE_FIELDS = {"snapshot", "valid_from", "expiry", "alert_date"}
LIST_FIELDS = {"words_en", "words_fr", "words_mfe", "keywords", "domains", "phrases"}
PHONE = re.compile(r"^(\+230 \d{3,4} \d{4}|\d{3,4})$")
DOMAIN = re.compile(r"^[a-z0-9-]+(\.[a-z0-9-]+)+$")
PERSON = re.compile(r"\b(Mr|Mrs|Ms|Miss)\b\.?\s+[A-Z]")


def is_date(value):
    try:
        return bool(re.fullmatch(r"\d{4}-\d{2}-\d{2}", value)) and date.fromisoformat(value) is not None
    except (TypeError, ValueError):
        return False


def check_file(name, fields):
    errors = []
    path = OUT / name
    try:
        rows = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        return [f"{name}: file missing"]
    except json.JSONDecodeError as e:
        return [f"{name}: not valid JSON ({e})"]
    if not isinstance(rows, list) or not rows:
        return [f"{name}: must be a non-empty JSON array"]

    seen = set()
    for i, row in enumerate(rows):
        where = f"{name} row {i} ({row.get('id', '?')})"
        keys = set(row)
        if keys != fields | COMMON:
            missing, extra = (fields | COMMON) - keys, keys - (fields | COMMON)
            errors.append(f"{where}: fields differ from the contract; missing {sorted(missing)}, extra {sorted(extra)}")
        if row.get("id") in seen:
            errors.append(f"{where}: duplicate id")
        seen.add(row.get("id"))
        for key in ("source_url", "snapshot"):
            if not row.get(key):
                errors.append(f"{where}: no {key}")
        if not str(row.get("source_url", "")).startswith("https://"):
            errors.append(f"{where}: source_url must be an https link")
        for key, value in row.items():
            if key in DATE_FIELDS and not is_date(value):
                errors.append(f"{where}: {key} {value!r} is not YYYY-MM-DD")
            if key in LIST_FIELDS and not (isinstance(value, list) and all(isinstance(x, str) and x for x in value)):
                errors.append(f"{where}: {key} must be a list of non-empty strings")
            if (name, key) in ALLOWED and value not in ALLOWED[(name, key)]:
                errors.append(f"{where}: {key} {value!r} not one of {sorted(ALLOWED[(name, key)])}")
        if name == "agencies.json":
            if not PHONE_OK.match(str(row.get("phone"))):
                errors.append(f"{where}: phone {row.get('phone')!r} must be +230 then 7 digits, or 8 starting with 5")
        elif "phone" in row and not PHONE.match(str(row["phone"])):
            errors.append(f"{where}: phone {row['phone']!r} must be '+230 ...' or a short code")
        for d in row.get("domains", []):
            if not DOMAIN.match(d):
                errors.append(f"{where}: domain {d!r} must be a bare lowercase host (no https://, no path)")
        if "valid_from" in row and "expiry" in row and str(row["valid_from"]) >= str(row["expiry"]):
            errors.append(f"{where}: valid_from is not before expiry")
        if PERSON.search(json.dumps(row, ensure_ascii=False)):
            errors.append(f"{where}: looks like it contains a person's name (Mr/Mrs/Ms)")
    print(f"{name}: {len(rows)} rows")
    return errors


def main():
    errors = []
    for name, fields in FIELDS.items():
        errors += check_file(name, fields)
    for e in errors:
        print("ERROR:", e)
    print("OK, all files valid" if not errors else f"{len(errors)} error(s)")
    return 1 if errors else 0


if __name__ == "__main__":
    sys.exit(main())
