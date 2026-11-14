"""Pull links and phone numbers out of a message, and make privacy-safe fingerprints of it.

Nothing here keeps the message: the server works on links, numbers and salted hashes only.
"""
from __future__ import annotations

import hashlib
import re
import unicodedata
from urllib.parse import urlsplit

TLDS = (
    "com|net|org|mu|info|xyz|top|cam|click|co|uk|io|app|link|site|online|live|me|biz|cc|ly|gl|in|fr|us|tk|ml|"
    "ga|cf|gq|shop|store|vip|win|bid|loan|work|ru|cn|za|ng|ke"
)
LINK_RE = re.compile(
    rf"(?i)\b(?:https?://)?(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:{TLDS})\b(?:[/?#][^\s]*)?"
)
IP_LINK_RE = re.compile(r"(?i)\bhttps?://\d{1,3}(?:\.\d{1,3}){3}(?::\d+)?(?:/[^\s]*)?")
PHONE_RE = re.compile(r"(?<![\d.])(?:\+|00)?(?:230[\s-]?)?(?:5\d{3}[\s-]?\d{4}|\d{3}[\s-]?\d{4})(?![\d.])")
TWO_LEVEL_SUFFIXES = {"co.uk", "org.uk", "com.mu", "org.mu", "gov.mu", "ac.mu", "net.mu", "co.za", "com.au", "co.in"}
SHORTENERS = {"bit.ly", "tinyurl.com", "t.co", "goo.gl", "is.gd", "cutt.ly", "shorturl.at", "rb.gy", "ow.ly", "tiny.cc", "s.id"}


def links(text: str) -> list[str]:
    """Every link in the text, normalised to start with http(s)://, without duplicates, in order."""
    found: list[str] = []
    for match in list(IP_LINK_RE.finditer(text)) + list(LINK_RE.finditer(text)):
        start = match.start()
        if start > 0 and text[start - 1] == "@":  # part of an email address
            continue
        raw = match.group(0).rstrip(".,)!?;:\"'")
        url = raw if re.match(r"(?i)^https?://", raw) else "http://" + raw
        if url.lower() not in (u.lower() for u in found):
            found.append(url)
    return found[:10]


def host_of(url: str) -> str:
    host = (urlsplit(url).hostname or "").lower()
    return host[4:] if host.startswith("www.") else host


def registrable_domain(host: str) -> str:
    """mcb-login-secure.net → mcb-login-secure.net; a.b.example.co.uk → example.co.uk."""
    parts = host.split(".")
    if len(parts) >= 3 and ".".join(parts[-2:]) in TWO_LEVEL_SUFFIXES:
        return ".".join(parts[-3:])
    return ".".join(parts[-2:])


def is_ip(host: str) -> bool:
    return bool(re.fullmatch(r"\d{1,3}(?:\.\d{1,3}){3}", host))


def phones(text: str) -> list[str]:
    """Mauritian phone numbers in the text, as +230 followed by 7 or 8 digits."""
    found: list[str] = []
    for match in PHONE_RE.finditer(text):
        digits = re.sub(r"\D", "", match.group(0))
        for prefix in ("00230", "230"):
            if digits.startswith(prefix) and len(digits) - len(prefix) in (7, 8):
                digits = digits[len(prefix):]
                break
        if len(digits) in (7, 8):
            number = "+230" + digits
            if number not in found:
                found.append(number)
    return found[:5]


def account_numbers(text: str) -> list[str]:
    """Long digit runs that look like bank or wallet accounts (8–20 digits), digits only."""
    return list(dict.fromkeys(re.sub(r"\D", "", m) for m in re.findall(r"\b\d[\d\s-]{6,24}\d\b", text)
                              if 8 <= len(re.sub(r"\D", "", m)) <= 20))[:5]


def normalise(text: str) -> str:
    """Lowercase, accents removed, links/numbers replaced by placeholders, spaces collapsed.

    So the same message with a different amount, link or phone number still matches.
    """
    text = unicodedata.normalize("NFKD", text)
    text = "".join(c for c in text if not unicodedata.combining(c)).lower()
    text = IP_LINK_RE.sub(" <url> ", text)
    text = LINK_RE.sub(" <url> ", text)
    text = re.sub(r"\d[\d,.\s]*", " <num> ", text)
    text = re.sub(r"[^\w<>]+", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def salted(value: str, salt: str) -> str:
    return hashlib.sha256((salt + "|" + value).encode("utf-8")).hexdigest()[:32]


def fingerprint(text: str, salt: str) -> str:
    """One salted hash of the normalised message (exact-match memory)."""
    return salted(normalise(text), salt)


def shingles(text: str, salt: str, size: int = 3) -> set[str]:
    """Salted hashes of every 3-word window (near-match memory without keeping any words)."""
    words = normalise(text).split()
    if len(words) < size:
        return {salted(" ".join(words), salt)} if words else set()
    return {salted(" ".join(words[i:i + size]), salt)[:16] for i in range(len(words) - size + 1)}


def similarity(a: set[str], b: set[str]) -> float:
    if not a or not b:
        return 0.0
    return len(a & b) / len(a | b)
