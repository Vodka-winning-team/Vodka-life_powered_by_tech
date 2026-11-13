# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

**FraudLens Moris** ("Verifye avan ou peye") is an offline Android app in Kotlin with no server. It checks a suspicious SMS, WhatsApp or email message, shows its warning signs (X-Ray) and the official-register checks, then tells the user what to do now. The overseas-job check is the lead story. Built for the hackathon **Life Powered by Tech**, Theme 1. Hard deadline: **Sat 14 Nov 2026, 12:30**.

Read these docs in this order:

1. **`docs/TASKS.md`** is the plan we're following: each person's tasks, file ownership and the contract. Where it differs from `PROJECT.md`, `TASKS.md` wins. **Shield is cut.**
2. **`PROJECT.md`** gives the background: user (Kevin), evidence, features 1–13, demo script (§9) and decision log entries (§10).
3. `docs/Arnak-Live-winning-plan.md` is a different app idea, kept only for the "what's next" slide. Do not build it.

## How each session works

There are four teammates (A Data, B Engine, C App, D Pitch). Each runs their own Claude session and states their role in the first message. In a session:

- **Do only that person's tasks, one step at a time, in the order listed in `docs/TASKS.md`.**
- **Only create or edit files in the folders that person owns.**
  - A: `data/` and `app/src/main/assets/data/`
  - B: `engine/`
  - C: `app/` (except `assets/data/`), `settings.gradle.kts`, the root `build.gradle.kts` and `gradle/`
  - D: `README.md` and `docs/`

  If another person's folder needs a change, say so instead of making it.
- After each step:
  1. Tell the user how to check the step themselves.
  2. Explain what you did in 5 plain lines.
  3. Add one line to `docs/ai-log.md`: time, person, what Claude did, what was checked.
  4. Run `git pull --rebase`, then `git add <own folders only>`.
  5. Commit with the person's letter as a prefix (e.g. `A: agencies.json, 79 licences`) and push. If the push is rejected, pull with rebase and push again.

  Push at least once an hour. The judges look at the commit history.
- Keep each change small enough that the person can explain it to a judge.
- The contract in `docs/TASKS.md` §2 changes only if A, B and C all agree. Update `TASKS.md` in the same commit.

## Architecture

```
data/raw/        official source files downloaded in a browser (gitignored; bom.mu and FSC block scripts)
data/scripts/    Python, one script per source (pdfplumber) -> JSON; validate.py checks every file
app/             Android app, Compose, package mu.fraudlens.moris, minSdk 26
app/src/main/assets/data/   agencies.json, fee_rules.json, banks.json, fsc_alerts.json, cert_alerts.json
engine/          Gradle module :engine, package mu.fraudlens.moris.engine; pure Kotlin JVM, NO Android imports
docs/            TASKS.md, decisions.md, ai-log.md, demo-messages.md, test-cases.md, sources.md, user-tests.md
```

Data flows like this:

1. A's scripts write the JSON into the app's assets.
2. The app reads all five files as text and passes them to `DataSet.fromJson(...)`.
3. `Engine(data).check(text, jobAnswers)` returns a `CheckResult`: a `Level` plus a list of `Finding`s (fixed `kind` key, highlight `IntRange`s into the message, and a `Source`) and official `Contact`s.
4. The screens render that result.

`suggestAgencies(text)` fuzzy-matches register agencies named in the message, for the Job check screen. The exact signatures and JSON fields are in `docs/TASKS.md` §2. Code against them exactly.

Level rule:

- **STOP** if any of these: a request for a code or PIN; a link that isn't the official domain of the bank named in the message; a job fee the employer should pay (Act 2023 s.5, Regs 2025 reg 7(2)); a match with an FSC alert.
- **CAREFUL** if there are other warning signs.
- **NONE** otherwise.

Note that "Your code is 123456, never share it" must produce **no** finding.

The engine's test targets are D's 6 demo messages (`docs/demo-messages.md`) and A's 15 cases (`docs/test-cases.md`).

## Commands

These are the planned commands; the Gradle project is created by C.

- Engine tests (no phone needed): `./gradlew :engine:test`
- One engine test: `./gradlew :engine:test --tests "mu.fraudlens.moris.engine.EngineTest"`
- Build or install the debug APK on a phone connected by USB: `./gradlew :app:assembleDebug` / `./gradlew :app:installDebug`
- Validate the data: `python data/scripts/validate.py`. It checks for valid JSON, unique ids, `source_url` and `snapshot` on every row, phone numbers starting with `+230`, and dates in YYYY-MM-DD format.

## Rules that are easy to break

- **Write all code from scratch.** Never copy from the old FraudLens repo or from `E:\Hackathon`.
- No AI/ML models, no server, no live lookups. All data is bundled on the phone.
- Use only real records from official sources; never fake or placeholder data. Every record has `source_url` and `snapshot`. Copy law clause references exactly from the PDFs.
- Privacy:
  - Never store the names of people (directors or anyone else). FSC alerts list organisations only.
  - Never ask the user for codes, PINs or bank details.
  - History is saved only when the user taps Save.
- UI wording: never say "safe", "genuine", "scam" or "illegal". Use "Not found in the Ministry list of 4 Nov 2026" or "Listed, but this does not prove the message is from them".
- The dial button always uses the official number, never a number taken from the message.
- All UI text goes in `strings.xml` (`values/`, `values-fr/`, `values-b+mfe/` for Kreol). Colours and sizes go in one theme file, so the surprise card can be handled quickly.
- Demo messages are fictional and labelled that way.
- Cut order if behind: FSC/CERT first, then French, then job follow-up. Never cut features 1–8.
