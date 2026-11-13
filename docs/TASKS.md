# TASKS.md: who does what, step by step (Fri 13 Nov 16:10 → Sat 12:30)

Read `PROJECT.md` first. This file adds the exact tasks per person, which files each person owns, and how we use Claude.
Changes since PROJECT.md (team review, 16:05): **Shield is cut**, the Arnak? Live plan is the "what's next" slide only, and the **job check is the lead story**.

> ## ⚠️ STACK CHANGE (team decision, Fri 13 Nov ~18:15): the app is now **Expo (React Native + TypeScript)**
> **Why:** it must work on any device: Android APK, iPhone through Expo Go, and a web link, from one codebase.
> **What changes:** the app is TypeScript in `src/`. The engine moves from Kotlin to **TypeScript in `src/engine/`** (same names, same behaviour). The data files do **not** move: `app/src/main/assets/data/` stays as it is.
> **What stays:** the data contract, the level rule, the wording rules, offline, no server, all features and the demo.
>
> ### Pushkar (B): port the engine to TypeScript, now
> Your Kotlin engine (`engine/`, ~1,000 lines, 21 tests) works, so **port it, don't redesign it**. Stop adding Kotlin.
> 1. `git pull`, then `npm install` (once). Read `src/engine/types.ts`: the contract already ported from your `Model.kt` (same names, camelCase fields).
> 2. Replace the stub in `src/engine/index.ts` with a port of `DataSet.kt`, `Engine.kt`, `Rules.kt`, `Text.kt`. Same class and method names: `DataSet.fromJson(agencies, feeRules, banks, fscAlerts, certAlerts)` (5 JSON strings), `new Engine(data)`, `engine.check(text, job?)`, `engine.suggestAgencies(text)`. The app already calls these, so screens work the moment you push.
> 3. **Highlights:** Kotlin `IntRange` (end included) becomes `{ start, end }` with **end NOT included** (`end = last + 1`, like `text.slice(start, end)`). Keep `Text.kt`'s trick that keeps character positions after removing accents.
> 4. Port `EngineTest.kt` + `DataSetTest.kt` to Jest in `src/engine/__tests__/` (read the data files with `fs.readFileSync` from `app/src/main/assets/data/`). Run with `npm test`. All 21 must pass.
> 5. `TryIt.kt` becomes `src/engine/try-it.ts` if you still want it (optional).
> 6. **Pure TypeScript only:** no `react-native` or `expo` imports in `src/engine/`.
> 7. When all tests pass: delete the Kotlin `engine/` folder in the same commit (`B: engine ported to TypeScript, 21 tests`).
>
> **Adiyen (A):** nothing changes. `validate.py` and the JSON stay where they are.
> **D:** README "Stack" = Expo SDK 58, React Native, TypeScript, Expo Router. "How to run" = `npm install`, then `npx expo start` (scan the QR code with Expo Go), or install the APK.

---

## 0. How we work with Claude (everyone)

- **Setup:** your own laptop, a clone of this repo, one Claude Code session opened in that folder (Claude desktop app → Code → pick the repo folder).
- **First message to Claude** (copy it, change the letter and role):
  > Read PROJECT.md and docs/TASKS.md. I am Person A (Data). Do only the Person A tasks, in order, one step at a time. Only create or edit files in the folders Person A owns. After each step: tell me how to check it myself, explain what you did in 5 plain lines, add one line to docs/ai-log.md, then commit only my folders with a clear message and push.
- **The loop, every step:** Claude does one step → **you check it yourself** (run it, open the file, look at the phone) → Claude explains it → commit + push. At least one push per hour.
- **Git** (Claude can run these): `git pull --rebase` before each step · `git add <your folders>` · `git commit -m "A: agencies.json, 79 licences"` · `git push`. If the push is rejected: `git pull --rebase`, then push again.
- **Never edit another person's folder.** Need a change there? Tell that person.
- **The contract (section 2)** changes only if A, B and C all agree. Update this file in the same commit and tell the team.
- **AI log:** one line per step in `docs/ai-log.md`: time, person, what Claude did, what you checked. D turns it into the README "AI tools" section.
- **Small requests.** "Write the PDF parser for the agency register", not "build the data". Every person must be able to explain their part to a judge.

---

## 1. Who owns which files

| Person | Owns | Never touches |
|---|---|---|
| **A: Data (Adiyen)** | `data/`, `app/src/main/assets/data/` | `engine/`, app code |
| **B: Engine (Pushkar)** | `src/engine/` (TypeScript + its tests); the old Kotlin `engine/` until it is deleted | `src/app/`, `data/` |
| **C: App + main laptop (Jayesh)** | `src/` (except `src/engine/`), `assets/` (except data), `package.json`, `app.json`, `tsconfig.json`, `eslint.config.js` | `src/engine/`, `data/` |
| **D: Pitch + testing** | `README.md`, `docs/` | code |

---

## 2. The contract (the "plugs" between people)

### Data files: A writes them, B reads them
JSON arrays in `app/src/main/assets/data/`. **Every record has `source_url` and `snapshot` (YYYY-MM-DD).**

| File | Fields |
|---|---|
| `agencies.json` | `id, name, category ("abroad" \| "local" \| "non_citizen"), phone, phones [ ], address, valid_from, expiry, page` (`phone` = main number = `phones[0]`; `phones` = every number the register prints) |
| `fee_rules.json` | `id, cost, words_en [ ], words_fr [ ], words_mfe [ ], payer ("employer"), ref` |
| `banks.json` | `id, name, type ("bank" \| "psp"), keywords [ ], domains [ ], phone, phone_source` |
| `fsc_alerts.json` | `id, name, domains [ ], alert_date, alert_url` (organisations only, never people) |
| `cert_alerts.json` | `id, campaign, phrases [ ], alert_date, alert_url` |

### Engine: B writes it, C calls it
Folder `src/engine/`, imported as `@/engine`. **Pure TypeScript, no `react-native` or `expo` imports**, so it can be tested without a phone (`npm test`). Full types: `src/engine/types.ts`.

```ts
type Level = 'STOP' | 'CAREFUL' | 'NONE';
type Source = { name: string; url: string; date: string };
type Highlight = { start: number; end: number };          // end NOT included
type Finding = { kind: string; level: Level; title: string; detail: string;
                 highlights: Highlight[]; source: Source | null };
type Contact = { name: string; phone: string; source: Source };
type CheckResult = { level: Level; findings: Finding[]; contacts: Contact[] };
type JobAnswers = { agencyId: string | null; costId: string | null };

class DataSet {
  agencies: Agency[]; feeRules: FeeRule[]; banks: Bank[]; fscAlerts: FscAlert[]; certAlerts: CertAlert[];
  static fromJson(agencies: string, feeRules: string, banks: string,
                  fscAlerts: string, certAlerts: string): DataSet;
}
class Engine {
  constructor(data: DataSet);
  check(text: string, job?: JobAnswers | null): CheckResult;
  suggestAgencies(text: string): Agency[];               // agency names found in the message
}
```
C loads the 5 files (`src/lib/data.ts`) and passes their text to `DataSet.fromJson`.
`Finding.kind` is a fixed key (`job_fee`, `code_request`, `bank_link`…), so C can translate titles later.

**Level rule:** STOP if any of: a request for a code or PIN; a link that isn't the official site of the bank named; a job fee the employer should pay; a match with an FSC alert. CAREFUL if there are other warning signs. NONE otherwise.
**Wording:** never "safe", "genuine", "scam" or "illegal". Say "Not found in the Ministry list of 4 Nov 2026" and "Listed, but this does not prove the message is from them".

---

## 3. Person A: Data (name: Adiyen)

**Goal:** 5 JSON files of real, checked records, with a source on every row.

| By | Step | Done when |
|---|---|---|
| 16:30 | Download sources **in a normal browser** into `data/raw/` (bom.mu and FSC block scripts): Ministry of Labour register PDF · Private Recruitment Agencies Act 2023 PDF · Regulations 2025 PDF · BoM list of licensees + payment service providers PDF · FSC unauthorised entities · CERT-MU alerts (Divali WhatsApp bonus, property). If you have `arnak-datasets.zip` from earlier today, put it there too: banks and FSC alerts are mostly done in it. `data/raw/` is not committed. | Files are in `data/raw/` |
| 16:45 | One **real** sample record per file in `app/src/main/assets/data/` → push. B and C start from these. | 5 valid JSON files pushed |
| 18:00 | **agencies.json:** `data/scripts/agencies.py` (pdfplumber) → all 79 licences, no directors' or other people's names. Check every row against the PDF by eye. | 79 rows, checked |
| 18:00 | **fee_rules.json:** the general no-fee rule (s.5) + one rule per cost in reg 7(2) (air ticket, police report, passport, visa, processing, work permit, annual fees). Words in EN/FR/Kreol ("processing fee", "frais de dossier", "fre dosie"…). **Read the PDF yourself and copy the exact clause reference.** | Every rule has a checked `ref` |
| 18:00 | **banks.json:** 19 banks + payment providers; `domains` and `keywords` (e.g. MCB: mcb.mu; juice); phone from each bank's own contact page. | Rows + sources |
| 18:00 | **Sync.** | |
| 21:00 | **fsc_alerts.json** (15–25 organisations, no individuals) and **cert_alerts.json** (3–5 campaigns with the phrases each alert quotes). `data/scripts/validate.py`: valid JSON, unique ids, every row has `source_url` + `snapshot`, phones start +230, dates YYYY-MM-DD. | `validate.py` passes |
| 22:00 | `docs/test-cases.md`: 15 short messages (EN/FR/Kreol), each with the expected level and the rule it tests. Include a **genuine MCB code SMS → NONE**. Give it to B. | 15 cases |
| 23:00 | `docs/sources.md`: each file's record count, snapshot date and link (for the "Our sources" screen and the README). **Sync.** | |
| 23:00–01:00 | **Sleep.** | |
| 01:00–07:00 | Fix data bugs reported by B, C or D; French + Kreol translations of the main screen texts in `docs/strings-fr-mfe.md` for C; check the slide-2 numbers with D. | |

---

## 4. Person B: Engine (name: Pushkar)

**Goal:** `check()` gives the right level and reasons for every test message, without a phone.

| By | Step | Done when |
|---|---|---|
| 16:45 | After C pushes the skeleton: the data classes, `DataSet.fromJson`, and `Engine.check()` as a stub returning NONE → push. C can wire the screens now. | C can call it |
| 18:00 | Parsing works on A's sample files. Tests run with `./gradlew :engine:test` (needs Android Studio/SDK installed, no phone). **Sync.** | First tests green |
| 20:00 | **check():** normalise text (lowercase, strip accents, Kreol variants avoy/avoye/voye); find links (domain), amounts (Rs, MUR, roupi), phone numbers, bank names (keywords), agency names. **X-Ray rules**, each = kind + EN/FR/Kreol phrases + level + one-line reason + highlight ranges: urgency · asks for a code/PIN · payment request · prize/gift · poses as a bank · job fee · guaranteed returns · odd link. **Bank check:** bank named + link not in its `domains` → STOP + `Contact` with its official phone. **Job check** (with `JobAnswers`): agency in the register? category "abroad"? expiry after today? cost payer = employer → STOP, citing `ref`. Then the level rule. | Demo messages 1 and 4 give STOP |
| 20:00 | **Code rule:** "send / give / share us the code" → STOP. "Your code is 123456, never share it" → **no finding**. | Unit test for both |
| 21:00 | `suggestAgencies(text)`: fuzzy match agency names in the message (ignore Ltd/Co/case/accents). | Finds the agency in demo message 1 |
| 23:00 | Unit tests green for D's 6 demo messages and A's 15 test cases. FSC match (domain or name) → STOP with the alert date; CERT match (phrase) → finding citing the alert. **Sync.** | All green |
| 23:00–03:00 | Edge cases from D's testing; job follow-up (same case, new cost → re-check); speed under 300 ms on the phone. | |
| 03:00–05:00 | Help C with the job-check screen and bugs. | |
| 05:00–07:00 | **Sleep.** | |

---

## 5. Person C: App + main laptop (name: Jayesh)

**Goal:** the APK on a real phone, every screen working with B's engine and A's data. **You are the main laptop:** you pull everyone's work at each sync, build, and install.

| By | Step | Done when |
|---|---|---|
| 16:45 | Android Studio: new project, Empty Activity (Compose), Kotlin, package `mu.fraudlens.moris`, minSdk 26. Add module `:engine` (Kotlin JVM library + kotlinx-serialization-json + JUnit), empty package. `.gitignore`: build/, .gradle/, local.properties, data/raw/. **Push, then tell the team "skeleton is up".** | Others can pull and build |
| 18:00 | Screens navigate with a fake result; share-in (ACTION_SEND, text/plain) opens Scan; debug APK on the demo phone over USB. Pull A + B: load assets → `DataSet.fromJson` → `Engine`. **Sync.** | APK on phone, real data loads |
| 23:00 | **Scan** (paste + share-in) → **Result** (big level banner; the message with X-Ray highlights from `Finding.highlights`; each finding with source + date) → **Job check** (B's `suggestAgencies` + search; cost picker from fee rules) → **What to do now** (ACTION_DIAL with the official number, never the message's; ACTION_SEND summary to a trusted person; report links: MAUCORS, bank fraud line, pra@govmu.org) → **History** (saved only when the user taps Save; JSON file in app storage) → **Our sources** (counts and dates from the loaded data). **Sync: full flow on the phone with real data.** | Demo steps 1–6 work |
| 23:00–01:00 | Fix what D finds. | |
| 01:00–03:00 | **Sleep.** | |
| 03:00–07:00 | Job-case follow-up (reopen a case, add a cost, re-check); languages: `values/strings.xml` (EN), `values-fr`, `values-b+mfe` (Kreol) + in-app switch; large text; surprise-card changes. | |
| 07:00 | **Feature freeze.** | |
| 10:00 | Final APK on 2 phones; upload it as a GitHub Release (link for the form). | |

All text in `strings.xml`; colours and sizes in one theme file, so surprise-card changes are fast.

---

## 6. Person D: Pitch + testing (name: ________)

**Goal:** the jury gets Kevin's problem in 30 seconds, the demo never breaks, the submission is complete.

| By | Step | Done when |
|---|---|---|
| 16:30 | Ask the organisers about reusing FraudLens's look/fonts; log the answer with the time. Create `docs/decisions.md` (real times, 5–10 entries by the end), `docs/ai-log.md`, and the README skeleton: Problem · User · Data sources · Stack · AI tools · Surprise card · How to run. | Pushed |
| 18:00 | `docs/demo-messages.md`: the 6 demo messages from PROJECT.md section 9, labelled fictional, each with the expected level and why → B. Find 3 testers (jobseekers or parents); book 15 min each between 19:00 and 21:00 (phone/WhatsApp is fine). | B has them |
| 19:00–21:00 | **User tests** on the 18:00 APK: hand over the phone + one message, say nothing, note where they hesitate → `docs/user-tests.md` → top 3 fixes to C. | 3 tests written up |
| 21:00–03:00 | Test every new APK on 2 phones (different Android versions); bugs as GitHub Issues with steps. Check every fact on the slides (Radio One 2026 case, MAUCORS 913 reports, law clauses with A). **6 slides:** 1 Kevin's story · 2 the problem in numbers · 3 live demo · 4 our data and sources · 5 impact (who runs it, Rs 0 cost, how it reaches users) · 6 surprise card + what's next (Arnak? Live). Demo script (4 min) + answers to likely questions. | Slides + script |
| 03:00–05:00 | **Sleep.** | |
| 07:00–10:00 | Backup video (~2 min, screen recording + voice); final README; decision log complete. | |
| 10:00–11:30 | 3 full rehearsals; each person explains a part they didn't build. | |
| 12:00 | Submit the Google Form: repo link, APK link, video, slides. **Deadline 12:30.** | Submitted |

---

## 7. Syncs (10 minutes, at the main laptop)

Routine: everyone pushes 5 minutes before → C pulls, builds, installs → run the demo flow once → each person says what's next.

| Time | Must be true | If not |
|---|---|---|
| 18:00 | APK on a real phone; real agencies, fee rules and banks data | Drop FSC + CERT |
| 23:00 | Scan → X-Ray → bank check → job check → what to do now → history, with real data | Languages: EN + Kreol labels only |
| 03:00 | FSC/CERT in; job follow-up works | Drop job follow-up |
| 07:00 | **Feature freeze.** Surprise card visible | Bug fixes only |
| 10:00 | Final APK on 2 phones; video done | — |

**Cut order:** FSC/CERT → French → job follow-up. Never cut features 1–8. (Shield is already cut.)

## 8. Surprise card
When it's announced, all 4 meet for 10 minutes and decide how it changes the main flow; D logs it with the time. It must be visible in the demo, with its own slide and README section.
