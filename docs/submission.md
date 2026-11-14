# Submission checklist and form answers

Owner: D (Paveesh). **Deadline: Sat 14 Nov, 12:30. Late submissions are not judged. We submit by 12:15.**
The organisers' list ("What to submit"): Git repo link · the app · backup demo video · pitch slides · README · decision log.

## 1. The six things, and where each one is

| # | What they ask for | Ours | Status |
|---|---|---|---|
| 1 | **Git repo link:** public, commits from kick-off, sent through their Google Form | https://github.com/Vodka-winning-team/Vodka-life_powered_by_tech | ✅ public; first commit Fri 12:32 |
| 2 | **The app:** Android APK or Expo/test link | Newest release on https://github.com/Vodka-winning-team/Vodka-life_powered_by_tech/releases Final build: https://github.com/Vodka-winning-team/Vodka-life_powered_by_tech/releases/tag/verifye-final-2026-11-14-1145 | ✅ released 11:45 (no speech-to-text) |
| 3 | **Backup demo video:** about 2 minutes, core feature working | [`Demo Video.mp4`](../Demo%20Video.mp4) in the repo: https://github.com/Vodka-winning-team/Vodka-life_powered_by_tech/blob/main/Demo%20Video.mp4 | ✅ in the repo (1 min 40 s, the real app on a real phone, no narration) |
| 4 | **Pitch slides:** maximum 6 | [`Verifye-pitch.pptx`](Verifye-pitch.pptx): 6 slides, with speaker notes. Text version: [`slides.md`](slides.md) | ✅ file in the repo (11:17); open it once on the presentation laptop |
| 5 | **README:** problem, user, data sources, stack, AI tools, surprise card, how to run | [`README.md`](../README.md): all seven sections are there | ⏳ final pass at the freeze (APK link, features, test counts) |
| 6 | **Decision log:** 5–10 key decisions, with times | [`decisions.md`](decisions.md): 25 decisions with times and records | ✅ add any new ones before submitting |

## 2. Before pressing Submit

- [ ] The repo is **public** (open it in a private browser window).
- [ ] The **APK link opens and downloads** on a phone that isn't logged in to GitHub.
- [ ] The APK is the **final build**, installed and quick-tested on 2 phones.
- [ ] The **video plays** for someone outside the team (link sharing set to "anyone with the link").
- [ ] The slides file has **6 slides or fewer** and opens on another laptop.
- [ ] README: the APK link is the final one; the AI tools are all listed; the surprise card section matches the app.
- [ ] No keys or passwords in the repo (`server/.env` is git-ignored; checked on 14 Nov).
- [ ] The old `backend/` folder is gone from `main` (removed 06:58, commit eb2fc33).
- [ ] One person submits; a second person watches and reads the links aloud.
- [ ] Take a screenshot of the confirmation page.

## 3. Answers to paste into the form

Adapt to the form's real fields.

**Team name:** *(the name we registered with; our GitHub organisation is "Vodka-winning-team")*

**Team members:** Adiyen (data) · Pushkar (engine and server) · Jayesh (app) · Paveesh (pitch and testing)

**Project name:** Verifye: *avan ou peye* (check before you pay)

**Theme:** Theme 1, Powered to Protect

**One-line description:**
Verifye checks a suspicious SMS, WhatsApp or email before you pay: it shows the warning signs, what the law and official Mauritian records say, and the official number to call, in English, French and Kreol.

**Short description (about 60 words):**
Kevin, 24, is offered a hotel job in Canada for a Rs 50,000 "processing fee". Verifye checks the message on his phone, offline: the agency against the Ministry of Labour register, the fee against the 2025 Regulations (the employer pays), and links against the Bank of Mauritius list. Online, it adds live link checks, reports from other phones and a Kreol voice.

**The user and the problem:**
Job seekers and their families in Mauritius are asked for fees for jobs abroad. The law says the employer pays (Private Recruitment Agencies Act 2023, s.5; Regulations 2025, reg 7(2)), but nobody checks at the moment of paying.

**Datasets used (all real, official, dated):**
Ministry of Labour list of private recruitment agencies (79 licences, 4 Nov 2026) · Private Recruitment Agencies Act 2023 and Regulations 2025 (8 fee rules) · Bank of Mauritius list of licensees (18 banks, 3 payment providers) · FSC investor alerts (21 organisations) · CERT-MU security alerts (5 campaigns). Details: `docs/sources.md`.

**Tech stack:**
Expo (React Native, TypeScript) for the app; a rules engine in TypeScript that runs on the phone; an optional Python (FastAPI) server written this weekend; Python scripts that turn the official PDFs into data.

**AI tools used:**
Claude Code (Anthropic) by each teammate for code, tests, data scripts and documents; OpenAI Codex CLI for reviews; myt AI Cloud text-to-speech for the optional Kreol voice. Every AI-assisted step is logged in `docs/ai-log.md` with what we checked. No AI model decides a result in the app.

**Surprise card:**
"Your app must survive a user doing the 'wrong' thing." We made Kevin's key flow fail safe: empty, random or broken input never gets a result; one tap gives one action; skipped steps never give a green light. Tested with 500 random messages.

**Links:**
- Repo: https://github.com/Vodka-winning-team/Vodka-life_powered_by_tech
- APK: https://github.com/Vodka-winning-team/Vodka-life_powered_by_tech/releases/tag/verifye-final-2026-11-14-1145
- Video: https://github.com/Vodka-winning-team/Vodka-life_powered_by_tech/blob/main/Demo%20Video.mp4
- Slides: *(file or link)*

## 4. Who does what between 11:00 and 12:15

| Time | Who | What |
|---|---|---|
| 11:00 | Jayesh | Final APK released; link on the board |
| 11:00–11:30 | Pushkar, Adiyen, Paveesh | Quick test on 2–3 phones |
| 11:30–12:00 | Paveesh + Jayesh | Record the 2-minute backup video; upload it; set sharing to "anyone with the link" |
| 11:30–12:00 | Paveesh's Claude | Final README, slides numbers, this file's links |
| 12:00–12:10 | Paveesh | Export the slides; fill the form |
| **12:15** | Paveesh, with one teammate watching | **Submit.** Screenshot the confirmation. |
