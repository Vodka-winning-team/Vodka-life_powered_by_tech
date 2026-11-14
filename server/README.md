# Verifye server (optional online checks)

Written new on **Sat 14 Nov 2026** (from 04:20), replacing the September FraudLens backend. Nothing in this folder comes from an earlier project. The app works **fully offline without it**: when the phone can reach this server, the Result screen adds an "Online check" card.

## What it adds
| Check | How | Needs a key? |
|---|---|---|
| **Harmful links** | Google Safe Browsing (the exact link) and abuse.ch URLhaus (the website); shared platforms like Linktree, Google Drive or YouTube are never called harmful because of other people's pages | yes (both optional) |
| **Very new or unregistered websites** | Domain registration record from public RDAP: under 30 days = warning; no record = warning only for endings whose registry answers (.com, .net, .xyz, .sbs…), never for .mu or .ee | no |
| **Short links** | Asks the shortener where `bit.ly/…` really goes; never opens the final site | no |
| **Risky phone numbers** | IPQualityScore fraud score, recent abuse, VOIP | optional |
| **Reports from other phones** | "This message tried to trick me": counts once 2 different phones report the same message or a near copy | no |
| **Pay check** | Warns on large amounts and on account numbers that appeared in reported messages | no |
| **Lessons and quiz** | 6 lessons, 6 questions, in English, French and Kreol (`?lang=fr` or `mfe`; Kreol is a draft), written for Verifye from our official sources | no |
| **Kreol read-aloud** | myt AI Cloud text-to-speech; the key stays on the server | yes (myt) |

**Fail-safe:** the server only answers "high" on hard evidence (a blocklisted link, a message confirmed by 2+ phones, a phone number with recent abuse reports). Soft signs (new website, short link, one unconfirmed report) are capped at "medium". Every provider has a time limit; a slow or missing one is skipped, never an error.

**Privacy:**
- **What the server receives:** the message text, used in memory for one request. It's never written to disk or logs.
- **What the providers get:** only links, domains and phone numbers, never the message.
- **What a report keeps:** salted hashes only: a fingerprint of the message, hashed 3-word windows for near matches, and hashed domains, numbers and accounts. No words, and no reporter id in clear (tested).

## Run it (on the demo laptop)
```
cd server
python -m venv .venv
.venv/bin/pip install -r requirements.txt        # Windows: .venv\Scripts\pip install -r requirements.txt
cp .env.example .env                             # then fill in the keys you have
.venv/bin/python -m uvicorn verifye_server.main:app --host 0.0.0.0 --port 8000
```
Check `http://<laptop-ip>:8000/health`: it lists which checks are on (never the keys). In the app: Settings → server address `http://<laptop-ip>:8000`. Phone and laptop must be on the same network (a phone hotspot works).

## Keys (`server/.env`, git-ignored)
See `.env.example`. All are optional:
- **`SAFE_BROWSING_KEY`:** Google Cloud console → enable the Safe Browsing API → create an API key.
- **`URLHAUS_AUTH_KEY`:** free account at auth.abuse.ch.
- **`IPQS_KEY`:** IPQualityScore.
- **`MYT_API_KEY`, `MYT_BASE_URL`, `MYT_VOICE`:** from the myt console.
- **`SERVER_SALT`:** any long random string. Keep it the same between restarts so reports keep matching.

## Tests
```
cd server && .venv/bin/python -m pytest -q      # 33 tests, no network (providers are faked)
```

## Endpoints (all under `/api/v1`, as the app calls them)
| Method and path | Purpose |
|---|---|
| `POST /analyze` | Online checks for a message |
| `POST /report` | Report a message that tried to trick you |
| `POST /payments/check` | Pay check |
| `GET /learn/tactics`, `GET /learn/quiz` | Lessons and quiz |
| `GET /speech/status`, `GET or POST /speech` | Kreol read-aloud |
| `GET /health` (no prefix) | Which checks are on |
