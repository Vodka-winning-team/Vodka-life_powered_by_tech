"""Verifye server (FastAPI). Run from the server/ folder:

    .venv/bin/python -m uvicorn verifye_server.main:app --host 0.0.0.0 --port 8000      (Linux/macOS)
    .venv\\Scripts\\python -m uvicorn verifye_server.main:app --host 0.0.0.0 --port 8000  (Windows)

Endpoints match what the app already calls (src/lib/online.ts, src/lib/speak.ts), under /api/v1.
Privacy: the message text is used in memory for one request and never stored or logged;
reports keep salted hashes only (see reports.py).
"""
from __future__ import annotations

import time
from collections import defaultdict, deque

import httpx
from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response
from pydantic import BaseModel, Field

from . import content, extract, scoring
from .config import Settings, get_settings
from .intel import Intel, is_official
from .reports import ReportStore

MAX_TEXT = 5000


class AnalyzeRequest(BaseModel):
    text: str = Field("", max_length=MAX_TEXT * 2)
    channel: str = "sms"


class ReportRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=MAX_TEXT * 2)
    label: str = "scam"
    reporter_id: str = Field(..., min_length=1, max_length=100)


class PaymentRequest(BaseModel):
    payee_name: str | None = Field(None, max_length=200)
    payee_account: str = Field(..., min_length=1, max_length=60)
    amount: float = Field(..., ge=0)


class SpeechRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=1500)


def create_app(settings: Settings | None = None, transport: httpx.AsyncBaseTransport | None = None) -> FastAPI:
    settings = settings or get_settings()
    app = FastAPI(title="Verifye server", version="1.0",
                  description="Optional online checks for the Verifye app. The app works without it.")
    app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["GET", "POST"], allow_headers=["*"])
    intel = Intel(settings, transport)
    store = ReportStore(settings.db_path, settings.server_salt, settings.report_confirmations)
    hits: dict[str, deque] = defaultdict(deque)

    @app.middleware("http")
    async def rate_limit(request: Request, call_next):
        if request.url.path.startswith("/api/"):
            who = request.client.host if request.client else "?"
            now = time.monotonic()
            q = hits[who]
            while q and now - q[0] > 60:
                q.popleft()
            if len(q) >= settings.rate_limit_per_minute:
                return JSONResponse({"detail": "Too many checks from this phone. Wait a minute."}, status_code=429)
            q.append(now)
        return await call_next(request)

    # ---------------------------------------------------------------- health
    @app.get("/health")
    def health() -> dict:
        return {"status": "ok", "providers": settings.providers(), "reported_messages": store.total(),
                "report_confirmations": settings.report_confirmations}

    # ---------------------------------------------------------------- analyze
    @app.post("/api/v1/analyze")
    async def analyze(req: AnalyzeRequest) -> dict:
        text = req.text[:MAX_TEXT]
        urls = extract.links(text)
        numbers = extract.phones(text)
        result = await intel.check(urls, numbers)
        match = store.match(text)
        reported = sum(store.identifier_reporters("domain", extract.registrable_domain(extract.host_of(u))) > 0
                       for u in urls if not is_official(extract.host_of(u), intel.official))
        reported += sum(store.identifier_reporters("phone", n) > 0 for n in numbers)
        ip_links = sum(extract.is_ip(extract.host_of(u)) for u in urls)
        return scoring.score(result, match, ip_links, reported, settings.report_confirmations)

    # ---------------------------------------------------------------- report
    @app.post("/api/v1/report")
    def report(req: ReportRequest) -> dict:
        if req.label != "scam":
            return {"status": "ignored", "message": "Thanks. Only messages that tried to trick you are kept."}
        if len(extract.normalise(req.text).split()) < 3:
            return {"status": "too_short", "message": "This message is too short to report."}
        status = store.add(req.text[:MAX_TEXT], req.reporter_id)
        messages = {
            "already_reported": "You already reported this message. Thank you.",
            "pending": f"Thank you. When {settings.report_confirmations} different phones report it, it will warn other users.",
            "confirmed": "Thank you. Enough phones reported this message: other users will now be warned.",
        }
        return {"status": status, "message": messages[status]}

    # ---------------------------------------------------------------- pay check
    @app.post("/api/v1/payments/check")
    def payment_check(req: PaymentRequest) -> dict:
        account = "".join(c for c in req.payee_account if c.isdigit())
        reporters = store.identifier_reporters("account", account) if account else 0
        reasons: list[dict] = []
        if reporters >= settings.report_confirmations:
            decision = "pause"
            reasons.append({"severity": "danger", "text": f"This account number was in messages that {reporters} different phones reported."})
        elif reporters:
            decision = "warn"
            reasons.append({"severity": "warning", "text": "This account number was in a message another phone reported (not confirmed yet)."})
        else:
            decision = "allow"
        if req.amount >= 10000:
            decision = "pause" if decision == "pause" else "warn"
            reasons.append({"severity": "warning", "text": f"Large amount: Rs {req.amount:,.0f}. Take a moment before sending."})
        if not reasons:
            reasons.append({"severity": "info", "text": "Nothing found about this account. That doesn't prove it's who they say."})
        headline = {"pause": "Stop: don't send this payment yet", "warn": "Check before you send",
                    "allow": "No warning found: still check who you're paying"}[decision]
        actions = [
            {"id": "call_official", "title": "Call the official number", "detail": "Use the number from Verifye's official lists, never the one in the message."},
            {"id": "ask_someone", "title": "Ask someone you trust", "detail": "Show the message to a family member before paying."},
        ]
        if decision != "allow":
            actions.insert(0, {"id": "wait", "title": "Wait before paying", "detail": "People who want your money rush you. Take your time."})
        return {"decision": decision, "headline": headline, "reasons": reasons, "safe_actions": actions,
                "cooldown_seconds": {"pause": 30, "warn": 10, "allow": 0}[decision]}

    # ---------------------------------------------------------------- learn
    @app.get("/api/v1/learn/tactics")
    def lessons() -> list[dict]:
        return content.LESSONS

    @app.get("/api/v1/learn/quiz")
    def quiz() -> list[dict]:
        return content.QUIZ

    # ---------------------------------------------------------------- speech (myt AI Cloud)
    @app.get("/api/v1/speech/status")
    def speech_status() -> dict:
        return {"ready": settings.tts_ready, "model": settings.myt_model}

    async def _speak(text: str) -> Response:
        if not settings.tts_ready:
            raise HTTPException(503, "Text-to-speech is not set up on this server.")
        url = settings.myt_base_url.rstrip("/") + "/audio/speech"
        body = {"model": settings.myt_model, "input": text, "voice": settings.myt_voice, "response_format": "mp3"}
        try:
            async with httpx.AsyncClient(timeout=20, transport=transport) as client:
                answer = await client.post(url, json=body, headers={"Authorization": f"Bearer {settings.myt_api_key}"})
        except httpx.HTTPError:
            raise HTTPException(502, "Could not reach the text-to-speech service.")
        if answer.status_code != 200:
            raise HTTPException(502, f"Text-to-speech service answered {answer.status_code}.")
        media = "audio/wav" if answer.content[:4] == b"RIFF" else "audio/mpeg"
        return Response(content=answer.content, media_type=media)

    @app.post("/api/v1/speech")
    async def speak(req: SpeechRequest) -> Response:
        return await _speak(req.text)

    @app.get("/api/v1/speech")
    async def speak_from_link(text: str = Query(..., min_length=1, max_length=1500)) -> Response:
        return await _speak(text)

    app.state.store = store
    app.state.intel = intel
    return app


app = create_app()
