# Verifye: *avan ou peye* (check before you pay)

An app that checks a suspicious SMS, WhatsApp or email **before you pay**. It shows the warning signs in the message (X-Ray), what **official Mauritian records** say about the bank, agency or company in it, and what to do now. **Every check works on the phone, offline.** When the phone can reach our optional server, the result adds live link checks, reports from other phones and a Kreol voice.

Hackathon: **Life Powered by Tech**, Theme 1 *Powered to Protect*.

*Verifye* is Kreol for “check”. Until Fri 13 Nov, 22:46, the app’s working name was FraudLens Moris (decision 17); some internal code names still use it.

> **About the server, for the record:** at 02:55 on Sat 14 Nov the server of our earlier FraudLens project (September 2026) was added to this repo as `backend/`. It was not written during this hackathon, so the team replaced it with a new server written from scratch that night (`server/`, from 04:30) and **removed `backend/` at 06:58** (commit eb2fc33). It stays visible in the git history; nothing from it is in the app or the server we submit. See decision 23 in [`docs/decisions.md`](docs/decisions.md).

**Team documents:** plan in [`PROJECT.md`](PROJECT.md) and [`docs/TASKS.md`](docs/TASKS.md) · decision log in [`docs/decisions.md`](docs/decisions.md) · AI log in [`docs/ai-log.md`](docs/ai-log.md) · user-test script in [`docs/user-tests.md`](docs/user-tests.md) (not run yet) · phone tests in [`docs/quick-test.md`](docs/quick-test.md) · live team board in [`automation.md`](automation.md).

## Problem
Fake recruiters ask Mauritian jobseekers for "processing fees" for jobs abroad. Radio One reported about twenty Mauritians allegedly cheated by one fake recruiter ([25 Aug 2026](https://radio1.mu/faux-recruteur-le-reve-de-travailler-a-letranger-vire-au-cauchemar-pour-une-vingtaine-de-mauriciens/)), and four complainants who say they paid Rs 296,000 in total, one of them Rs 50,000 for a job in Dubai ([7 Sep 2026](https://radio1.mu/promesses-demplois-letranger-un-habitant-de-quatre-bornes-aurait-soutire-pres-de-rs-300-000-a-quatre-victimes/)). The Ministry of Labour warned the public about fake recruitment agencies offering jobs abroad ([communiqué, 28 Apr 2022](https://www.govmu.org/EN/Communique1/year%202022/May/Communiqu%C3%A9-%20Fausses%20agences%20de%20recrutement%2028.04.22.pdf)). Fake bank messages and links are common too: 913 of the 6,073 incidents reported to MAUCORS in 2025 were scams and fraud ([Defimedia, 24 Aug 2026](https://defimedia.info/risques-dusurpation-didentite-whatsapp-username-le-gm-veut-des-garanties-avant-tout-deploiement)).

The law is clear: no agency or employer may charge a worker a recruitment fee (Private Recruitment Agencies Act 2023, s.5), and processing, visa, passport, work-permit and air-ticket costs are paid by the employer (Regulations 2025, reg 7(2)). But at the moment of paying, nobody checks.

## User
**Kevin, 24, from Triolet**, gets a WhatsApp offer for a hotel job in Canada. The "agency" wants Rs 50,000 today, and his mother is asked to lend it. The app gives both of them the same evidence before any money moves.

## What the app does
1. **Scan:** paste a message, or share it straight from WhatsApp or SMS (Share → Verifye, Android APK).
2. **X-Ray:** highlights the tricks in English, French and Kreol: pressure to act fast, asking for a code or PIN, asking for money, prizes and gifts, account-blocked alarms, guaranteed profit, "I have a new number", odd links.
3. **Official checks:**
   - **Job offer:** is the agency in the Ministry of Labour register, licensed for jobs **abroad**, and valid today? Is the fee one the employer must pay (with the exact clause)?
   - **Bank link:** is the link the bank's official website, per the Bank of Mauritius list? (`mcb-login-secure.net` is not `mcb.mu`.)
   - **Investment offer:** has the FSC warned about this firm or website?
   - **Known campaigns:** does it match a CERT-MU alert (e.g. the Divali WhatsApp cash gift)?
4. **Result:** *Stop – high risk*, *Be careful – verify*, or *No warning signs found – still verify*. The app never says "safe" or "scam".
5. **What to do now:** call the **official** number (from the register or the bank list, never from the message), share a summary with someone you trust, report (MAUCORS, the bank, the Ministry's Recruitment Licence Unit).
6. **History** (saved only when you tap Save) and **Our sources** (every dataset with its date).
7. **Automatic checking (opt-in, Android only):** if you switch it on, new WhatsApp and SMS notifications are checked on the phone with the same rules, and a warning appears: *"Stop – warning signs found. Tap to see why."* Off by default, nothing saved or sent, no other apps read. It can't read photos, voice notes or muted chats, so sharing or pasting stays the main way in.
8. **Official numbers ("Search an agency or bank"):** look up any of the 79 agencies or 21 banks and payment apps without a message, and see every official number with its source. The Call button only opens the dialler. **"Is this number official?"**: type a phone number to see whether it is in the Ministry register or the bank list, and whose it is (in the 02:34 build, not released yet).
9. **Granny mode:** one switch for bigger text and buttons, strong contrast, and a simpler result: one plain sentence, then the Call button.
10. **Read aloud:** the result is read out with the phone's own voices, offline (English and French). With the server, Kreol is read by a Mauritian voice (myt AI Cloud text-to-speech).
11. **"Checked against these official records":** every result shows the date of each official list it used.
12. **Four tabs:** Check · Is it official? · Learn · History, with Settings behind the gear on Check. A **Paste the copied message** button, a **home-screen widget** ("Check copied message", the newest CERT-MU alert) and a **first-time tour** with a practice message.
13. **Learn the tricks:** 6 short lessons and a quiz in English, French and Kreol, written for Verifye from our official sources. Works offline.
14. **Online check (optional, needs the server):** an extra card on the result: links on Google Safe Browsing or URLhaus blocklists, websites registered very recently or not at all, where a short link really goes, and messages reported by other phones.
15. **Report this message:** it counts once 2 different phones report the same message or a near copy. The server keeps salted fingerprints only, never the words.
16. **Before you pay:** a pay check that warns on large amounts and on account numbers seen in reported messages.

**No AI model decides a result:** clear rules plus official records, so every warning can be explained and checked. The only AI service is the optional Kreol voice.

**Privacy:** the phone's checks never send anything. The online check is optional: the server uses the message in memory for one request and never stores or logs it; outside providers get only links, domains and phone numbers. The app says so, and it works without the server.

## Data sources
All real, official and dated. Every record in the app has its `source_url` and `snapshot` date. Details: [`docs/sources.md`](docs/sources.md).

| Data | Records | Source |
|---|---|---|
| Recruitment agencies | 79 licences (12 for jobs abroad) | [Ministry of Labour, List of Private Recruitment Agencies, 4 Nov 2026](https://empment-labour.govmu.org/Documents/Recruitment/List%20of%20Recruitment%20Agencies.pdf) |
| Who pays recruitment costs | 8 rules | [Private Recruitment Agencies Act 2023](https://empment-labour.govmu.org/SiteAssets/MofedStyles/Doc/Recruitment%20%20Licence/The%20Private%20Recruitment%20Agencies%20Act%202023.pdf) s.5, [Regulations 2025](https://empment-labour.govmu.org/SiteAssets/MofedStyles/Doc/Recruitment%20%20Licence/The%20Private%20Recruitment%20Agencies%20Regulation%202025.pdf) reg 7(2) |
| Banks and payment providers | 18 banks + 3 payment providers | [Bank of Mauritius list of licensees](https://www.bom.mu/financial-stability/supervision/licensees/list-of-licensees); phones from each bank's own website |
| Investment warnings | 21 organisations | [FSC Mauritius](https://www.fscmauritius.org/) investor alerts (2017–2026) |
| Security alert campaigns | 5 alerts | [CERT-MU security alerts](https://cert-mu.govmu.org/cert-mu/?page_id=1439) (Feb–Oct 2026) |

No personal names are stored: directors' names and alerts naming individuals are left out.

## Stack
- **App:** Expo SDK 58, React Native, TypeScript, Expo Router. One codebase: Android APK, iPhone through Expo Go, and web.
- **Engine:** pure TypeScript in `src/engine/` (rules + official records), runs on the phone, offline. Automated tests (Jest) run every demo message, the 15 test cases and the real data files: `npm test`.
- **Data:** Python scripts in `data/scripts/` turn the official PDFs and pages into JSON; `validate.py` checks every row.
- **Server (optional):** Python (FastAPI) in `server/`, written new on Sat 14 Nov. No trained model; it answers "high" only on hard evidence. 32 tests. Details: [`server/README.md`](server/README.md).
- **No accounts. No internet needed for the checks.**

## AI tools
AI tools were allowed by the organisers. We list them all here. Every AI-assisted step has a line in [`docs/ai-log.md`](docs/ai-log.md) (and [`docs/ai-log/A.md`](docs/ai-log/A.md)) saying what the AI did and what the teammate checked.

| Tool | Who | What we used it for |
|---|---|---|
| **Claude Code (Anthropic)** | Adiyen (A, data) | Python scripts that turn the official PDFs into JSON; `validate.py`; test cases; French and Kreol strings; fact-checking the numbers on our slides |
| **Claude Code** | Pushkar (B, engine) | The rules engine (first in Kotlin, then ported to TypeScript), its tests, a try-it tool, the README draft, the slide draft and the team board (`automation.md`) |
| **Claude Code** | Jayesh (C, app) | The Expo app and its 6 screens, the phone-number format, the language switch |
| **Claude Code** | Paveesh (D, pitch) | README, pitch documents and user-test write-ups |
| **OpenAI Codex CLI** | Team | Critical review of our ideas before the build, and a read-only review of the app screens (4 fixes, 13 Nov 18:45) |

**What we added ourselves, and checked:**
- **Choices:** the user (Kevin), the job-fee check as our lead story, no AI model deciding a result, checks that work offline, a server written from scratch when we went online, and every cut. See [`docs/decisions.md`](docs/decisions.md).
- **The data:** every agency row checked against the Ministry PDF, page by page (all 79, with 2 errors found and fixed), and a script checks every phone number against its row; every law clause found word for word in the Act and the Regulations; every bank phone read on the bank's own website.
- **The rules:** tested on the 6 demo messages and 15 test cases, including a real bank code SMS that must give no warning.
- **Real phones:** the team tested the release APK on two Android phones (Android 14 and 16): every demo message, wrong input, panic taps, share-in, and automatic checking with a real WhatsApp ([`docs/quick-test.md`](docs/quick-test.md)). **No tests with outside users yet:** that is the first step of a pilot (decision 18).

Every teammate can explain and change their own part.

## Surprise card
**Our card (announced Fri 13 Nov, 20:46):** "Your app must survive a user doing the 'wrong' thing: wrong input, skipped steps, panic-tapping. Make one key flow hard to break." Rule: "Show the key flow recovers safely from mistakes."

**Our key flow:** Kevin's case: **Scan → Result → Job check → What to do now**.
**Our principle: fail safe.** Whatever the user does wrong, the app never shows a false "No warning signs found".

| Mistake | What the app does | Status |
|---|---|---|
| Empty paste, 2 letters, emojis only, random typing ("asdf asdf") | An amber box, "Please check your text"; never a result | ✅ engine 20:48 · app 21:00 · stricter rules Sat 06:55 |
| Very long paste | Checks the first 20,000 characters and says so | Engine ✅ |
| Line breaks, tabs or extra spaces inside words ("processing / fee") | Still found, same result | Engine ✅ |
| Panic-tapping any button | Same input always gives the same result; a second tap within 1 second is ignored (Check, Save, Call, Share) | ✅ engine 20:48 · app 21:00 |
| Unknown agency or cost (e.g. an old saved case) | "Be careful", with the reason; never a green light | Engine ✅ |
| Skipping the Job check, or going Back | Result still shows every warning sign found; never "no warning" | ✅ app 21:00 |
| Saving twice, or closing the app mid-flow | One history entry; history and language are kept when the app reopens | ✅ app 21:00 |
| Internal error | "We couldn't check this message" (Be careful), never a crash | Engine ✅ |

**Tested:** 24 "try to break it" tests in the engine, including 500 random messages, a 200,000-character paste, 20 repeated taps and wrong input types (88 engine tests in total at 20:48). See decision 14 in [`docs/decisions.md`](docs/decisions.md) and the demo segment in [`docs/demo-script.md`](docs/demo-script.md).

## How to run
```
npm install
npx expo start        # scan the QR code with Expo Go (Android or iPhone, same Wi-Fi), or press w for the web
npm test              # engine tests, no phone needed
```
To try the engine on one message without the app:
```
TRY_MSG="MCB: verify your account at mcb-login-secure.net" npx jest try-it
```
APK: https://github.com/Vodka-winning-team/Vodka-life_powered_by_tech/releases/tag/verifye-2026-11-14-0656 (demo build, Sat 14 Nov 06:56). The final build is linked here before 12:00.

Optional server, on the demo laptop: double-click `run_server.bat`, or follow [`server/README.md`](server/README.md). In the app: Settings → server address. Phone and laptop must be on the same network (a phone hotspot works).

## Team
| Person | Role |
|---|---|
| Adiyen | A: Data |
| Pushkar | B: Engine |
| Jayesh | C: App |
| Paveesh | D: Pitch and testing |
