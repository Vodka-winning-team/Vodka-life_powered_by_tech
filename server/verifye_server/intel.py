"""Live checks on the links and phone numbers of a message.

Every provider is optional (no key → skipped), runs in parallel, and must answer inside the
time budget (INTEL_BUDGET_SECONDS); a slow or broken provider is skipped, never an error.
Only links, domains and phone numbers are sent to the providers, never the message.
Answers are cached for an hour so the same link isn't checked again on every tap.
"""
from __future__ import annotations

import asyncio
import json
import time
from dataclasses import dataclass, field
from datetime import datetime, timezone
from pathlib import Path

import httpx

from . import extract
from .config import SERVER_DIR, Settings

CACHE_SECONDS = 3600
NEW_DOMAIN_DAYS = 30
BANKS_FILE = SERVER_DIR.parent / "app" / "src" / "main" / "assets" / "data" / "banks.json"


def official_domains() -> set[str]:
    """Official bank / payment-app domains from Adiyen's Bank of Mauritius data (never flagged as new or odd)."""
    try:
        rows = json.loads(Path(BANKS_FILE).read_text(encoding="utf-8"))
        return {d.lower() for row in rows for d in row.get("domains", [])}
    except (OSError, ValueError):
        return set()


def is_official(host: str, official: set[str]) -> bool:
    return any(host == d or host.endswith("." + d) for d in official)


@dataclass
class Finding:
    severity: str  # "danger" | "warning" | "info"
    title: str
    detail: str
    target: str
    source: str  # which provider

    def as_dict(self) -> dict:
        return {"severity": self.severity, "title": self.title, "detail": self.detail, "target": self.target}


@dataclass
class IntelResult:
    findings: list[Finding] = field(default_factory=list)
    blocklisted: bool = False
    checked: list[str] = field(default_factory=list)  # providers that answered
    skipped: list[str] = field(default_factory=list)  # providers off, slow or failing


class Intel:
    def __init__(self, settings: Settings, transport: httpx.AsyncBaseTransport | None = None) -> None:
        self.settings = settings
        self.transport = transport
        self.official = official_domains()
        self._cache: dict[str, tuple[float, object]] = {}

    def _client(self, timeout: float) -> httpx.AsyncClient:
        return httpx.AsyncClient(timeout=timeout, transport=self.transport, follow_redirects=False,
                                 headers={"User-Agent": "Verifye/1.0 (hackathon prototype)"})

    async def _cached(self, key: str, fn):
        hit = self._cache.get(key)
        if hit and time.time() - hit[0] < CACHE_SECONDS:
            return hit[1]
        value = await fn()
        self._cache[key] = (time.time(), value)
        return value

    # ------------------------------------------------------------------ providers
    async def unshorten(self, url: str) -> str | None:
        """Where a short link really goes (asks the shortener only, never opens the final site)."""
        async def go() -> str | None:
            current = url
            async with self._client(2.0) as client:
                for _ in range(3):
                    if extract.host_of(current) not in extract.SHORTENERS:
                        break
                    resp = await client.head(current)
                    location = resp.headers.get("location")
                    if resp.status_code not in (301, 302, 303, 307, 308) or not location:
                        break
                    current = location if location.startswith("http") else str(httpx.URL(current).join(location))
            return current if current != url else None
        return await self._cached("unshorten:" + url, go)

    async def domain_age_days(self, domain: str) -> int | None:
        """Days since the domain was registered, from public RDAP records (no key needed)."""
        async def go() -> int | None:
            async with self._client(2.5) as client:
                resp = await client.get(f"https://rdap.org/domain/{domain}", follow_redirects=True)
            if resp.status_code != 200:
                return None
            for event in resp.json().get("events", []):
                if event.get("eventAction") == "registration" and event.get("eventDate"):
                    born = datetime.fromisoformat(event["eventDate"].replace("Z", "+00:00"))
                    return (datetime.now(timezone.utc) - born).days
            return None
        return await self._cached("rdap:" + domain, go)

    async def safe_browsing(self, urls: list[str]) -> set[str]:
        """URLs that Google Safe Browsing lists as phishing / malware / unwanted software."""
        async def go() -> set[str]:
            body = {
                "client": {"clientId": "verifye", "clientVersion": "1.0"},
                "threatInfo": {
                    "threatTypes": ["MALWARE", "SOCIAL_ENGINEERING", "UNWANTED_SOFTWARE", "POTENTIALLY_HARMFUL_APPLICATION"],
                    "platformTypes": ["ANY_PLATFORM"],
                    "threatEntryTypes": ["URL"],
                    "threatEntries": [{"url": u} for u in urls],
                },
            }
            async with self._client(2.5) as client:
                resp = await client.post(
                    "https://safebrowsing.googleapis.com/v4/threatMatches:find",
                    params={"key": self.settings.safe_browsing_key}, json=body)
            resp.raise_for_status()
            return {m["threat"]["url"] for m in resp.json().get("matches", [])}
        return await self._cached("gsb:" + "|".join(sorted(urls)), go)

    async def urlhaus_host(self, host: str) -> int:
        """How many malware URLs abuse.ch URLhaus lists on this host (0 = not listed)."""
        async def go() -> int:
            async with self._client(2.5) as client:
                resp = await client.post("https://urlhaus-api.abuse.ch/v1/host/", data={"host": host},
                                          headers={"Auth-Key": self.settings.urlhaus_auth_key})
            resp.raise_for_status()
            data = resp.json()
            return len(data.get("urls") or []) if data.get("query_status") == "ok" else 0
        return await self._cached("urlhaus:" + host, go)

    async def phone_reputation(self, number: str) -> dict | None:
        """IPQualityScore phone check: fraud score, recent abuse, VOIP (optional key)."""
        async def go() -> dict | None:
            digits = number.lstrip("+")
            async with self._client(2.5) as client:
                resp = await client.get(
                    f"https://www.ipqualityscore.com/api/json/phone/{self.settings.ipqs_key}/{digits}",
                    params={"country[]": "MU"})
            resp.raise_for_status()
            data = resp.json()
            return data if data.get("success") else None
        return await self._cached("ipqs:" + number, go)

    # ------------------------------------------------------------------ all together
    async def check(self, urls: list[str], numbers: list[str]) -> IntelResult:
        result = IntelResult()
        jobs: dict[str, asyncio.Future] = {}
        shorts = [u for u in urls if extract.host_of(u) in extract.SHORTENERS]
        for u in shorts:
            jobs["short:" + u] = asyncio.ensure_future(self.unshorten(u))
        domains = sorted({extract.registrable_domain(extract.host_of(u)) for u in urls
                          if not extract.is_ip(extract.host_of(u)) and extract.host_of(u) not in extract.SHORTENERS
                          and not is_official(extract.host_of(u), self.official)})
        for d in domains:
            jobs["rdap:" + d] = asyncio.ensure_future(self.domain_age_days(d))
        if urls and self.settings.safe_browsing_key:
            jobs["safe_browsing"] = asyncio.ensure_future(self.safe_browsing(urls))
        if urls and self.settings.urlhaus_auth_key:
            for h in sorted({extract.host_of(u) for u in urls}):
                jobs["urlhaus:" + h] = asyncio.ensure_future(self.urlhaus_host(h))
        if numbers and self.settings.ipqs_key:
            for n in numbers[:2]:
                jobs["ipqs:" + n] = asyncio.ensure_future(self.phone_reputation(n))
        if not self.settings.safe_browsing_key:
            result.skipped.append("safe_browsing (no key)")
        if not self.settings.urlhaus_auth_key:
            result.skipped.append("urlhaus (no key)")
        if not jobs:
            return result

        done, pending = await asyncio.wait(jobs.values(), timeout=self.settings.intel_budget_seconds)
        for fut in pending:
            fut.cancel()
        for name, fut in jobs.items():
            provider = name.split(":", 1)[0]
            if fut not in done or fut.cancelled() or fut.exception() is not None:
                result.skipped.append(provider)
                continue
            result.checked.append(provider)
            self._add_findings(name, fut.result(), result)
        result.checked = sorted(set(result.checked))
        result.skipped = sorted(set(result.skipped))
        return result

    def _add_findings(self, name: str, value, result: IntelResult) -> None:
        kind, _, target = name.partition(":")
        if kind == "short" and value:
            final_host = extract.host_of(value)
            result.findings.append(Finding(
                "warning", "Short link hides the real address",
                f"It really goes to {final_host}." + ("" if is_official(final_host, self.official)
                                                       else " That is not an official bank site in our list."),
                target, "short_links"))
        elif kind == "rdap" and value is not None and value < NEW_DOMAIN_DAYS:
            result.findings.append(Finding(
                "warning", "Very new website",
                f"{target} was registered {value} day{'s' if value != 1 else ''} ago. Websites used to trick people are often brand new.",
                target, "domain_age"))
        elif kind == "safe_browsing" and value:
            result.blocklisted = True
            for url in sorted(value):
                result.findings.append(Finding(
                    "danger", "Listed as a dangerous website",
                    "Google Safe Browsing lists this link as phishing or harmful. Do not open it.", url, "safe_browsing"))
        elif kind == "urlhaus" and value:
            result.blocklisted = True
            result.findings.append(Finding(
                "danger", "Listed for spreading malware",
                f"abuse.ch URLhaus lists {value} harmful link{'s' if value != 1 else ''} on {target}. Do not open it.",
                target, "urlhaus"))
        elif kind == "ipqs" and value:
            score = int(value.get("fraud_score") or 0)
            if value.get("recent_abuse") or score >= 85:
                result.findings.append(Finding(
                    "danger", "Phone number with recent abuse reports",
                    f"IPQualityScore gives {target} a fraud score of {score}/100"
                    + (" and recent abuse reports." if value.get("recent_abuse") else "."), target, "phone_ipqs"))
            elif value.get("VOIP"):
                result.findings.append(Finding(
                    "info", "Internet phone number",
                    f"{target} is a VOIP (internet) number, often used when someone hides who they are.",
                    target, "phone_ipqs"))
