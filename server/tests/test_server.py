"""Server tests. No network: every provider is faked with httpx.MockTransport.
Run from server/:  .venv/bin/python -m pytest -q
"""
from __future__ import annotations

import json

import httpx
import pytest
from fastapi.testclient import TestClient

from verifye_server import extract
from verifye_server.config import Settings, load_settings
from verifye_server.main import create_app

DEMO1 = ("Bonjour Kevin! THINK RECRUITMENT LTD here. Hotel job in Canada, salary CAD 3,000. To secure your place, "
         "pay the processing fee of Rs 50,000 today by Juice. Urgent, only 2 places left.")
FAKE_MCB = "MCB: Unusual activity on your account. Verify your account at mcb-login-secure.net or it will be blocked."
REAL_OTP = "MCB: Your OTP for the online payment of Rs 1,250.00 at DARTY is 482913. Never share this code with anyone."


class FakeProviders:
    """Pretends to be RDAP, Safe Browsing, URLhaus, IPQS, a URL shortener and myt; records what was sent."""

    def __init__(self, harmful=(), new_domains=(), urlhaus_hosts=(), abused_numbers=(), fail=(), unregistered=()):
        self.unregistered = set(unregistered)
        self.harmful, self.new_domains, self.urlhaus_hosts = set(harmful), set(new_domains), set(urlhaus_hosts)
        self.abused_numbers, self.fail = set(abused_numbers), set(fail)
        self.requests: list[httpx.Request] = []

    def __call__(self, request: httpx.Request) -> httpx.Response:
        self.requests.append(request)
        host = request.url.host
        if host in self.fail:
            raise httpx.ConnectError("down", request=request)
        if host == "rdap.org":
            domain = request.url.path.rsplit("/", 1)[-1]
            if domain in self.unregistered:
                return httpx.Response(404)
            date = "2026-11-10T00:00:00Z" if domain in self.new_domains else "2009-01-01T00:00:00Z"
            return httpx.Response(200, json={"events": [{"eventAction": "registration", "eventDate": date}]})
        if host == "safebrowsing.googleapis.com":
            urls = [e["url"] for e in json.loads(request.content)["threatInfo"]["threatEntries"]]
            hits = [{"threat": {"url": u}} for u in urls if extract.host_of(u) in self.harmful]
            return httpx.Response(200, json={"matches": hits} if hits else {})
        if host == "urlhaus-api.abuse.ch":
            h = dict(x.split("=") for x in request.content.decode().split("&"))["host"]
            return httpx.Response(200, json={"query_status": "ok", "urls": [{}, {}]} if h in self.urlhaus_hosts
                                  else {"query_status": "no_results"})
        if host == "www.ipqualityscore.com":
            number = "+" + request.url.path.rsplit("/", 1)[-1]
            bad = number in self.abused_numbers
            return httpx.Response(200, json={"success": True, "fraud_score": 92 if bad else 10, "recent_abuse": bad, "VOIP": False})
        if host == "bit.ly":
            return httpx.Response(301, headers={"location": "https://divali-gift-mu.top/claim"})
        if host == "myt.example":
            return httpx.Response(200, content=b"RIFF....WAVE", headers={"content-type": "audio/wav"})
        return httpx.Response(404)


def make_client(tmp_path, providers=None, **overrides) -> tuple[TestClient, FakeProviders]:
    providers = providers or FakeProviders()
    base = dict(safe_browsing_key="k", urlhaus_auth_key="k", ipqs_key="k", myt_api_key="k",
                myt_base_url="https://myt.example/v1", myt_voice="v1", server_salt="test-salt",
                report_confirmations=2, intel_budget_seconds=2.0, rate_limit_per_minute=1000,
                db_path=str(tmp_path / "t.db"))
    base.update(overrides)
    app = create_app(Settings(**base), transport=httpx.MockTransport(providers))
    return TestClient(app), providers


# ------------------------------------------------------------------ analyze
def test_harmful_link_is_high_and_names_the_source(tmp_path):
    client, _ = make_client(tmp_path, FakeProviders(harmful={"mcb-login-secure.net"}))
    r = client.post("/api/v1/analyze", json={"text": FAKE_MCB}).json()
    assert r["risk_level"] == "high" and r["risk_score"] >= 95
    assert r["intel"]["blocklisted"] is True
    assert any("Safe Browsing" in f["detail"] for f in r["intel"]["findings"])
    assert r["category_label"] == "Known harmful link"


def test_urlhaus_listing_is_high(tmp_path):
    client, _ = make_client(tmp_path, FakeProviders(urlhaus_hosts={"mcb-login-secure.net"}))
    assert client.post("/api/v1/analyze", json={"text": FAKE_MCB}).json()["risk_level"] == "high"


def test_new_website_alone_is_never_high(tmp_path):
    client, _ = make_client(tmp_path, FakeProviders(new_domains={"mcb-login-secure.net"}))
    r = client.post("/api/v1/analyze", json={"text": FAKE_MCB}).json()
    assert r["risk_level"] == "medium"  # soft sign, capped below "high"
    assert any(t["tactic"] == "new_website" for t in r["tactics"])


def test_short_link_is_unmasked_without_opening_the_final_site(tmp_path):
    client, providers = make_client(tmp_path)
    r = client.post("/api/v1/analyze", json={"text": "Divali Cash Gift! View Now: bit.ly/divali-gift"}).json()
    assert any("divali-gift-mu.top" in f["detail"] for f in r["intel"]["findings"])
    assert not any(req.url.host == "divali-gift-mu.top" for req in providers.requests)


def test_official_bank_site_is_not_checked_for_age(tmp_path):
    client, providers = make_client(tmp_path)
    client.post("/api/v1/analyze", json={"text": "MCB: see https://www.mcb.mu/personal"})
    assert not any(req.url.host == "rdap.org" for req in providers.requests)


def test_real_code_sms_has_no_online_warnings(tmp_path):
    client, providers = make_client(tmp_path)
    r = client.post("/api/v1/analyze", json={"text": REAL_OTP}).json()
    assert r["risk_level"] == "low" and r["tactics"] == [] and r["category_label"] == "Nothing extra found online"
    assert "rdap" not in r["summary"]


def test_abused_phone_number_is_high(tmp_path):
    client, _ = make_client(tmp_path, FakeProviders(abused_numbers={"+23059123456"}))
    r = client.post("/api/v1/analyze", json={"text": "Call me now on 5912 3456 to unlock your card"}).json()
    assert r["risk_level"] == "high" and r["category_label"] == "Risky phone number"


def test_a_provider_that_is_down_is_skipped_not_an_error(tmp_path):
    client, _ = make_client(tmp_path, FakeProviders(fail={"safebrowsing.googleapis.com", "rdap.org"}))
    r = client.post("/api/v1/analyze", json={"text": FAKE_MCB})
    assert r.status_code == 200
    assert "safe_browsing" in r.json()["intel"]["skipped"]


def test_no_keys_still_answers(tmp_path):
    client, providers = make_client(tmp_path, safe_browsing_key="", urlhaus_auth_key="", ipqs_key="")
    r = client.post("/api/v1/analyze", json={"text": FAKE_MCB}).json()
    assert r["risk_level"] in {"low", "medium"}
    assert not any(req.url.host in {"safebrowsing.googleapis.com", "urlhaus-api.abuse.ch"} for req in providers.requests)


def test_providers_never_receive_the_message_text(tmp_path):
    client, providers = make_client(tmp_path, FakeProviders())
    client.post("/api/v1/analyze", json={"text": FAKE_MCB + " Please call 5912 3456."})
    for req in providers.requests:
        sent = req.url.query.decode() + req.content.decode(errors="ignore")
        assert "Unusual activity" not in sent and "Verify your account" not in sent


def test_empty_and_huge_messages_are_handled(tmp_path):
    client, _ = make_client(tmp_path)
    assert client.post("/api/v1/analyze", json={"text": ""}).json()["risk_level"] == "low"
    assert client.post("/api/v1/analyze", json={"text": "x " * 4999}).status_code == 200


# ------------------------------------------------------------------ reports
def test_report_needs_two_phones_and_then_warns_others(tmp_path):
    client, _ = make_client(tmp_path)
    first = client.post("/api/v1/report", json={"text": DEMO1, "label": "scam", "reporter_id": "phone-a"}).json()
    again = client.post("/api/v1/report", json={"text": DEMO1, "label": "scam", "reporter_id": "phone-a"}).json()
    assert first["status"] == "pending" and again["status"] == "already_reported"
    medium = client.post("/api/v1/analyze", json={"text": DEMO1}).json()
    assert medium["risk_level"] != "high" and medium["verification"]["community_reports"] == 1
    second = client.post("/api/v1/report", json={"text": DEMO1, "label": "scam", "reporter_id": "phone-b"}).json()
    assert second["status"] == "confirmed"
    r = client.post("/api/v1/analyze", json={"text": DEMO1}).json()
    assert r["risk_level"] == "high" and r["verification"]["community_reports"] == 2


def test_a_reworded_copy_with_other_numbers_still_matches(tmp_path):
    client, _ = make_client(tmp_path)
    for who in ("a", "b"):
        client.post("/api/v1/report", json={"text": DEMO1, "label": "scam", "reporter_id": who})
    copy = DEMO1.replace("Rs 50,000", "Rs 75,000").replace("Kevin", "Priya")
    assert client.post("/api/v1/analyze", json={"text": copy}).json()["verification"]["confirmed"] is True


def test_reports_store_no_words_of_the_message(tmp_path):
    client, _ = make_client(tmp_path)
    client.post("/api/v1/report", json={"text": DEMO1, "label": "scam", "reporter_id": "phone-a"})
    raw = (tmp_path / "t.db").read_bytes()
    for word in (b"RECRUITMENT", b"Kevin", b"processing", b"50,000", b"phone-a"):
        assert word not in raw


def test_too_short_or_not_a_trick_is_not_stored(tmp_path):
    client, _ = make_client(tmp_path)
    assert client.post("/api/v1/report", json={"text": "hi", "label": "scam", "reporter_id": "a"}).json()["status"] == "too_short"
    assert client.post("/api/v1/report", json={"text": DEMO1, "label": "legit", "reporter_id": "a"}).json()["status"] == "ignored"


# ------------------------------------------------------------------ pay check
def test_payment_to_a_reported_account_is_paused(tmp_path):
    client, _ = make_client(tmp_path)
    msg = "Send the deposit to account 000123456789 today."
    for who in ("a", "b"):
        client.post("/api/v1/report", json={"text": msg, "label": "scam", "reporter_id": who})
    r = client.post("/api/v1/payments/check", json={"payee_name": "Invest Group", "payee_account": "0001 2345 6789", "amount": 500}).json()
    assert r["decision"] == "pause" and r["cooldown_seconds"] == 30


def test_large_unknown_payment_is_a_warning_small_one_is_allowed(tmp_path):
    client, _ = make_client(tmp_path)
    big = client.post("/api/v1/payments/check", json={"payee_account": "11112222", "amount": 45000}).json()
    small = client.post("/api/v1/payments/check", json={"payee_account": "11112222", "amount": 200}).json()
    assert big["decision"] == "warn" and small["decision"] == "allow"
    assert "still check" in small["headline"]


# ------------------------------------------------------------------ learn, speech, health, limits
def test_lessons_and_quiz_have_the_fields_the_app_reads(tmp_path):
    client, _ = make_client(tmp_path)
    lessons = client.get("/api/v1/learn/tactics").json()
    quiz = client.get("/api/v1/learn/quiz").json()
    assert lessons and all({"id", "label", "lesson", "safe_action"} <= set(x) for x in lessons)
    assert quiz and all({"id", "message", "question", "options", "answer", "explanation"} <= set(q) for q in quiz)
    assert all(0 <= q["answer"] < len(q["options"]) for q in quiz)


def test_user_facing_texts_follow_the_wording_rule(tmp_path):
    client, _ = make_client(tmp_path, FakeProviders(harmful={"mcb-login-secure.net"}, new_domains={"x-y.top"}))
    texts = json.dumps([client.get("/api/v1/learn/tactics").json(), client.get("/api/v1/learn/quiz").json(),
                        client.post("/api/v1/analyze", json={"text": FAKE_MCB + " x-y.top bit.ly/a"}).json()["summary"]])
    texts = texts.replace("Google Safe Browsing", "").replace("safe_action", "")
    import re
    assert not re.search(r"\b(safe|genuine|scams?|illegal)\b", texts, re.I)


def test_speech_proxies_to_myt_and_reports_status(tmp_path):
    client, providers = make_client(tmp_path)
    assert client.get("/api/v1/speech/status").json()["ready"] is True
    audio = client.get("/api/v1/speech", params={"text": "Aret. Pa peye."})
    assert audio.status_code == 200 and audio.headers["content-type"] == "audio/wav"
    assert providers.requests[-1].headers["authorization"] == "Bearer k"


def test_speech_without_key_is_503(tmp_path):
    client, _ = make_client(tmp_path, myt_api_key="")
    assert client.get("/api/v1/speech/status").json()["ready"] is False
    assert client.get("/api/v1/speech", params={"text": "hello"}).status_code == 503


def test_health_lists_providers_but_never_keys(tmp_path):
    client, _ = make_client(tmp_path, safe_browsing_key="SECRET-KEY-123")
    body = client.get("/health").text
    assert "SECRET-KEY-123" not in body and '"safe_browsing":true' in body.replace(" ", "")


def test_rate_limit(tmp_path):
    client, _ = make_client(tmp_path, rate_limit_per_minute=3)
    codes = [client.get("/api/v1/learn/quiz").status_code for _ in range(5)]
    assert codes[:3] == [200, 200, 200] and codes[-1] == 429


def test_env_file_is_read(tmp_path):
    env = tmp_path / ".env"
    env.write_text("SAFE_BROWSING_KEY=abc\nREPORT_CONFIRMATIONS=3\n# comment\n")
    s = load_settings(env, environ={})
    assert s.safe_browsing_key == "abc" and s.report_confirmations == 3 and s.providers()["safe_browsing"]


@pytest.mark.parametrize("text,expected", [
    ("Call +230 5912 3456", ["+23059123456"]), ("call 00230 202 6060", ["+2302026060"]), ("no number", []),
])
def test_phone_extraction(text, expected):
    assert extract.phones(text) == expected


def test_unregistered_website_is_a_soft_warning(tmp_path):
    client, _ = make_client(tmp_path, FakeProviders(unregistered={"mcb-login-secure.net"}))
    r = client.post("/api/v1/analyze", json={"text": FAKE_MCB}).json()
    assert r["risk_level"] == "medium"
    assert any(t["tactic"] == "unregistered_website" for t in r["tactics"])
    assert any("isn't registered" in f["title"] for f in r["intel"]["findings"])


def test_links_with_any_ending_are_found_when_http_is_written():
    assert extract.links("see http://malware.testing.google.test/testing/malware/ now") == [
        "http://malware.testing.google.test/testing/malware/"]
    assert extract.links("go to https://kotak-secure.de/login.com today") == ["https://kotak-secure.de/login.com"]
    assert extract.links("mail me at a@b.com or visit mcb-login.sbs") == ["http://mcb-login.sbs"]


def test_nothing_found_summary_does_not_tell_a_harmless_message_to_pay(tmp_path):
    client, _ = make_client(tmp_path)
    r = client.post("/api/v1/analyze", json={"text": "Listen to this song https://www.youtube.com/watch?v=abc"}).json()
    assert r["risk_level"] == "low" and "pay" not in r["summary"]


@pytest.mark.parametrize("lang,word", [("fr", "employeur"), ("mfe", "patron")])
def test_lessons_and_quiz_in_french_and_kreol(tmp_path, lang, word):
    client, _ = make_client(tmp_path)
    en = client.get("/api/v1/learn/quiz").json()
    other = client.get(f"/api/v1/learn/quiz?lang={lang}").json()
    lessons = client.get(f"/api/v1/learn/tactics?lang={lang}").json()
    assert [q["id"] for q in other] == [q["id"] for q in en]
    assert all(a["answer"] == b["answer"] and a["message"] == b["message"] and len(a["options"]) == len(b["options"])
               for a, b in zip(en, other))
    assert word in json.dumps(other, ensure_ascii=False).lower() and lessons[0]["label"] != "A fee for a job abroad"
    assert "reg 7(2)" in lessons[0]["lesson"]
    texts = json.dumps([lessons, other], ensure_ascii=False).lower()
    assert not any(w in texts for w in ("arnaque", "illégal", "ilegal", "arnak", "escroquerie"))
    assert client.get("/api/v1/learn/quiz?lang=xx").json() == en
