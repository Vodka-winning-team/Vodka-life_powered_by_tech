# FraudLens Moris: *Verifye avan ou peye* (check before you pay)

An offline app that checks a suspicious SMS, WhatsApp or email **before you pay**. It shows the warning signs in the message (X-Ray), what **official Mauritian records** say about the bank, agency or company in it, and what to do now. Nothing leaves the phone.

Hackathon: **Life Powered by Tech**, Theme 1 *Powered to Protect*.

**Team documents:** plan in [`PROJECT.md`](PROJECT.md) and [`docs/TASKS.md`](docs/TASKS.md) · decision log in [`docs/decisions.md`](docs/decisions.md) · AI log in [`docs/ai-log.md`](docs/ai-log.md) · user tests in [`docs/user-tests.md`](docs/user-tests.md) · live team board in [`automation.md`](automation.md).

## Problem
Fake recruiters ask Mauritian jobseekers for "processing fees" for jobs abroad. Radio One reported about twenty Mauritians allegedly cheated by one fake recruiter ([25 Aug 2026](https://radio1.mu/faux-recruteur-le-reve-de-travailler-a-letranger-vire-au-cauchemar-pour-une-vingtaine-de-mauriciens/)), and four complainants who say they paid Rs 296,000 in total, one of them Rs 50,000 for a job in Dubai ([7 Sep 2026](https://radio1.mu/promesses-demplois-letranger-un-habitant-de-quatre-bornes-aurait-soutire-pres-de-rs-300-000-a-quatre-victimes/)). The Ministry of Labour warned the public about fake recruitment agencies offering jobs abroad ([communiqué, 28 Apr 2022](https://www.govmu.org/EN/Communique1/year%202022/May/Communiqu%C3%A9-%20Fausses%20agences%20de%20recrutement%2028.04.22.pdf)). Fake bank messages and links are common too: 913 of the 6,073 incidents reported to MAUCORS in 2025 were scams and fraud ([Defimedia, 24 Aug 2026](https://defimedia.info/risques-dusurpation-didentite-whatsapp-username-le-gm-veut-des-garanties-avant-tout-deploiement)).

The law is clear: no agency or employer may charge a worker a recruitment fee (Private Recruitment Agencies Act 2023, s.5), and processing, visa, passport, work-permit and air-ticket costs are paid by the employer (Regulations 2025, reg 7(2)). But at the moment of paying, nobody checks.

## User
**Kevin, 24, from Triolet**, gets a WhatsApp offer for a hotel job in Canada. The "agency" wants Rs 50,000 today, and his mother is asked to lend it. The app gives both of them the same evidence before any money moves.

## What the app does
1. **Scan:** paste a message, or share it straight from WhatsApp or SMS (Share → FraudLens Moris, Android APK).
2. **X-Ray:** highlights the tricks in English, French and Kreol: pressure to act fast, asking for a code or PIN, asking for money, prizes and gifts, account-blocked alarms, guaranteed profit, "I have a new number", odd links.
3. **Official checks:**
   - **Job offer:** is the agency in the Ministry of Labour register, licensed for jobs **abroad**, and valid today? Is the fee one the employer must pay (with the exact clause)?
   - **Bank link:** is the link the bank's official website, per the Bank of Mauritius list? (`mcb-login-secure.net` is not `mcb.mu`.)
   - **Investment offer:** has the FSC warned about this firm or website?
   - **Known campaigns:** does it match a CERT-MU alert (e.g. the Divali WhatsApp cash gift)?
4. **Result:** *Stop – high risk*, *Be careful – verify*, or *No warning signs found – still verify*. The app never says "safe" or "scam".
5. **What to do now:** call the **official** number (from the register or the bank list, never from the message), share a summary with someone you trust, report (MAUCORS, the bank, the Ministry's Recruitment Licence Unit).
6. **History** (saved only when you tap Save) and **Our sources** (every dataset with its date).

No AI model: clear rules plus official records, so every warning can be explained and checked.

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
- **No server, no accounts, no internet needed.**

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
- **Choices:** the user (Kevin), the job-fee check as our lead story, no AI model, no server, and every cut. See [`docs/decisions.md`](docs/decisions.md).
- **The data:** every agency row compared by eye with the Ministry PDF; every law clause found word for word in the Act and the Regulations; every bank phone read on the bank's own website.
- **The rules:** tested on the 6 demo messages and 15 test cases, including a real bank code SMS that must give no warning.
- **Real people:** user tests with a jobseeker, a parent and a native Kreol reader ([`docs/user-tests.md`](docs/user-tests.md), in progress Fri evening).

Every teammate can explain and change their own part.

## Surprise card
**Our card (announced Fri 13 Nov, 20:46):** "Your app must survive a user doing the 'wrong' thing: wrong input, skipped steps, panic-tapping. Make one key flow hard to break." Rule: "Show the key flow recovers safely from mistakes."

**Our key flow:** Kevin's case: **Scan → Result → Job check → What to do now**.
**Our principle: fail safe.** Whatever the user does wrong, the app never shows a false "No warning signs found".

| Mistake | What the app does | Status |
|---|---|---|
| Empty paste, 2 letters, emojis only | "Paste the whole message to check it", never a result | ✅ engine 20:48 · app 21:00 |
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
APK: https://github.com/Vodka-winning-team/Vodka-life_powered_by_tech/releases (test build of Fri 13 Nov 21:15; the final build is added before 12:00).

## Team
| Person | Role |
|---|---|
| Adiyen | A: Data |
| Pushkar | B: Engine |
| Jayesh | C: App |
| Paveesh | D: Pitch and testing |
