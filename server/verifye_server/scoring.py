"""Turn the server's evidence into the answer the app shows on the "Online check" card.

Fail-safe rule (the app's banner shows the stronger of the phone's and the server's answer):
the server only says "high" on HARD evidence: a link on a blocklist, a message confirmed by
several phones, or a phone number with recent abuse reports. Soft signs (a very new website, a
hidden short link, one unconfirmed report) can raise the score but are capped at "medium".
"""
from __future__ import annotations

from dataclasses import dataclass, field

from .intel import IntelResult
from .reports import Match

MEDIUM, HIGH = 30, 60
SOFT_CAP = HIGH - 1


@dataclass
class Tactic:
    tactic: str
    label: str
    contribution: int
    details: list[str] = field(default_factory=list)

    def as_dict(self) -> dict:
        return {"tactic": self.tactic, "label": self.label, "contribution": self.contribution, "details": self.details}


def score(intel: IntelResult, match: Match, ip_links: int, reported_identifiers: int, confirmations: int) -> dict:
    hard: list[Tactic] = []
    soft: list[Tactic] = []

    if intel.blocklisted:
        hard.append(Tactic("blocklisted_link", "Link on a list of harmful websites", 95))
    if any(f.source == "phone_ipqs" and f.severity == "danger" for f in intel.findings):
        hard.append(Tactic("abused_number", "Phone number with recent abuse reports", 75))
    if match.confirmed:
        hard.append(Tactic("community_confirmed", f"Reported by {match.reporters} different phones", 85,
                           [f"{int(match.similarity * 100)}% the same as a reported message."]))
    elif match.reporters > 0:
        soft.append(Tactic("community_pending", "Reported by another phone (not confirmed yet)", 20,
                           [f"Needs {confirmations} different phones to be confirmed."]))
    new_sites = [f for f in intel.findings if f.source == "domain_age" and f.title == "Very new website"]
    if new_sites:
        soft.append(Tactic("new_website", "Very new website", 35))  # detail is in intel.findings
    unregistered = [f for f in intel.findings if f.source == "domain_age" and f.title != "Very new website"]
    if unregistered:
        soft.append(Tactic("unregistered_website", "Website address isn't registered", 30))
    shorts = [f for f in intel.findings if f.source == "short_links"]
    if shorts:
        soft.append(Tactic("hidden_link", "Short link hides the real address", 10))
    if ip_links:
        soft.append(Tactic("ip_link", "Link uses a bare number instead of a name", 15))
    if reported_identifiers:
        soft.append(Tactic("reported_contact", "Link or number seen in messages other phones reported", 20))
    if any(f.source == "phone_ipqs" and f.severity == "info" for f in intel.findings):
        soft.append(Tactic("voip_number", "Internet (VOIP) phone number", 10))

    if hard:
        value = min(100, max(t.contribution for t in hard) + sum(t.contribution for t in soft) // 4)
    else:
        value = min(SOFT_CAP, sum(t.contribution for t in soft))
    level = "high" if value >= HIGH else "medium" if value >= MEDIUM else "low"

    tactics = sorted(hard + soft, key=lambda t: -t.contribution)
    if intel.blocklisted:
        category, summary = "Known harmful link", "A link in this message is on a public list of harmful websites. Do not open it, and do not pay."
    elif match.confirmed:
        category, summary = "Reported by other phones", f"{match.reporters} different phones reported this message (or one almost the same). Do not pay; call the official number."
    elif any(t.tactic == "abused_number" for t in tactics):
        category, summary = "Risky phone number", "A phone number in this message has recent abuse reports. Do not call it back; use the official number."
    elif tactics:
        category, summary = "Signs worth checking", "The online checks found signs worth checking before you pay or open any link."
    else:
        names = {"rdap": "website age", "short": "short links", "safe_browsing": "Google Safe Browsing",
                 "urlhaus": "URLhaus", "ipqs": "phone number check"}
        checked = ", ".join(names.get(c, c) for c in intel.checked) or "reports from other phones"
        category, summary = "Nothing extra found online", f"The live checks found nothing more (checked: {checked}). That doesn't prove anything: the phone's own checks above still count, and still call the official number before you pay."
    return {
        "risk_score": value,
        "risk_level": level,
        "summary": summary,
        "category_label": category,
        "tactics": [t.as_dict() for t in tactics],
        "intel": {"findings": [f.as_dict() for f in intel.findings], "blocklisted": intel.blocklisted,
                  "checked": intel.checked, "skipped": intel.skipped},
        "verification": {"community_reports": match.reporters, "confirmed": match.confirmed},
    }
