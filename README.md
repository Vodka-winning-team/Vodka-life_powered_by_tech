# FraudLens Moris: *Verifye avan ou peye* (check before you pay)

An offline app that checks a suspicious SMS, WhatsApp or email **before you pay**. It shows the warning signs in the message (X-Ray), what **official Mauritian records** say about the bank, agency or company in it, and what to do now. Nothing leaves the phone.

Hackathon: **Life Powered by Tech**, Theme 1 *Powered to Protect*.

> This README is a working draft (13 Nov, 18:35). D finishes it before submission. The plan is in [`PROJECT.md`](PROJECT.md) and [`docs/TASKS.md`](docs/TASKS.md); live team status is in [`automation.md`](automation.md).

## Problem
Fake recruiters ask Mauritian jobseekers for "processing fees" for jobs abroad. In 2026 Radio One reported a fake recruiter with more than 20 alleged victims, and Rs 296,000 taken from four complainants. The Ministry warned about fake recruitment agencies in 2022 and 2023. Fake bank messages and links are common too: MAUCORS logged 913 scam reports in 2025.

The law is clear: no agency or employer may charge a worker a recruitment fee (Private Recruitment Agencies Act 2023, s.5), and processing, visa, passport, work-permit and air-ticket costs are paid by the employer (Regulations 2025, reg 7(2)). But at the moment of paying, nobody checks.

## User
**Kevin, 24, from Triolet**, gets a WhatsApp offer for a hotel job in Canada. The "agency" wants Rs 50,000 today, and his mother is asked to lend it. The app gives both of them the same evidence before any money moves.

## What the app does
1. **Scan:** paste a message (share-in from WhatsApp comes with the APK).
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
| Scam campaigns | 5 alerts | [CERT-MU security alerts](https://cert-mu.govmu.org/cert-mu/?page_id=1439) (Feb–Oct 2026) |

No personal names are stored: directors' names and alerts naming individuals are left out.

## Stack
- **App:** Expo SDK 58, React Native, TypeScript, Expo Router. One codebase: Android APK, iPhone through Expo Go, and web.
- **Engine:** pure TypeScript in `src/engine/` (rules + official records), runs on the phone, offline. 44 automated tests (Jest).
- **Data:** Python scripts in `data/scripts/` turn the official PDFs and pages into JSON; `validate.py` checks every row.
- **No server, no accounts, no internet needed.**

## AI tools
*(D completes this from [`docs/ai-log.md`](docs/ai-log.md), which has one line per AI-assisted step and what the team checked.)*
- **Claude Code (Anthropic):** each teammate's coding assistant, used for the data scripts, the engine, the app screens, tests and documentation. Every step was checked by the teammate (see the AI log).
- **OpenAI Codex CLI:** idea generation and critical review of the ideas before the build.

## Surprise card
*(To be filled in when the card is announced: what it was, and how it changed the app.)*

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
APK: *(link added when the release build is uploaded)*.

## Team
| Person | Role |
|---|---|
| Adiyen | A: Data |
| Pushkar | B: Engine |
| Jayesh | C: App |
| *(name)* | D: Pitch and testing |
