# automation.md: live team board

**Updated about every 10 minutes by Pushkar's Claude.** Pull, read your row, do it. To ask for something, use **Requests** at the bottom.

Last update: **Fri 13 Nov 18:48** · Next check: about 18:56 · Deadline: **Sat 12:30**

## How to use this file
- **Check it:** `git pull`, then read **Next for each person**. Your Claude can read it too: "Read automation.md and do my next task".
- **Ask Pushkar's Claude for something:** add one line at the **end** of **Requests**, commit **only this file**, push:
  `- [ ] 18:40 · Jayesh: please check the Result screen shows highlights for demo 1`
- **Answers:** Claude ticks your line: `- [x] … → done 18:50 (commit abc1234): what changed`, or `- [!] … → can't: why`.
- **Don't edit the other sections.** They are rewritten every 10 minutes, so edits there are lost.
- **What Pushkar's Claude will do:** work in the engine (`src/engine/`), docs and README text, run checks (tests, typecheck, lint, data validation), answer questions. It changes someone else's folder only when that folder's owner asks here.
- **What it won't do:** force-push, delete other people's work, add keys or passwords, install anything outside the repo, change GitHub settings.

## Status
| Checkpoint | State |
|---|---|
| 18:00: APK on a real phone; agencies, fee rules, banks data | Data ✅ · Engine ✅ · **APK ⏳ still building (Jayesh fixed a Windows build error at 18:43)** |
| 23:00: full flow with real data (Scan → X-Ray → bank check → job check → what to do now → history) | Screens ✅ wired to the real engine · needs a run on a real phone |
| 03:00: FSC/CERT in, job follow-up works | FSC/CERT ✅ already in the engine |
| 07:00: feature freeze | — |

**Done so far**
- **Adiyen (A):** all 5 data files, phones audited (+230 format), `validate.py`, `docs/sources.md`, `docs/test-cases.md` (15 cases).
- **Pushkar (B):** TypeScript engine, **59 tests pass** (demo 1 and 4 STOP, genuine bank code SMS NONE, 22 Kreol/French messages, Adiyen's 15 cases); README draft; this board.
- **Jayesh (C):** Expo app with 6 screens wired to the engine; readable phone numbers; Our sources text; bigger Job check chips; keyboard fix.
- **D:** nothing pushed yet.

## Next for each person
**Adiyen (A)**
1. `docs/strings-fr-mfe.md`: French and Kreol versions of the main screen texts (from `src/constants/strings.ts`) for Jayesh.
2. Use "Security alert campaigns" instead of "Scam campaigns" in `docs/sources.md` (wording rule; Jayesh changed it on screen).
3. If D is still missing at 19:30, write `docs/demo-messages.md` (6 demo messages from `PROJECT.md` §9; suggested real agency: LIFETIME CANADA LTD).

**Pushkar (B)**
1. Run the app (`npx expo start`, press `w`) and try the demo messages on the Scan screen; report anything that looks wrong to Jayesh here.
2. Add D's demo messages as tests when they are pushed.

**Jayesh (C)**
1. Finish the APK and install it on the demo phone *(18:00 checkpoint, overdue)*.
2. Remove the dev-only sample button once real results look right.
3. Finding titles by `kind` in `strings.ts` (list in `src/engine/index.ts`): `code_request`, `bank_link`, `bank_phone`, `bank_alarm`, `fsc_alert`, `job_fee`, `agency_listed`, `agency_not_found`, `agency_wrong_category`, `agency_expired`, `urgency`, `payment_request`, `prize_gift`, `guaranteed_returns`, `new_number`, `odd_link`, `cert_alert`.

**D (pitch and testing), overdue, nothing pushed yet**
1. Ask the organisers whether reusing FraudLens's old look and fonts is allowed; answer + time in `docs/decisions.md` *(due 16:30)*.
2. `docs/demo-messages.md`: the 6 demo messages from `PROJECT.md` §9, labelled fictional, each with its expected level *(due 18:00)*.
3. Book 3 testers (jobseekers or parents) for 19:00–21:00; notes in `docs/user-tests.md`.
4. Finish `README.md` (drafted 18:35): AI tools, surprise card, team names. Adiyen's request above has the data for slide 4.

## Requests
<!-- Add new lines at the END of this list. Format: - [ ] HH:MM · Name: request -->
- [x] 18:42 · Adiyen: B, `docs/test-cases.md` is pushed (commit 4b59107): 15 cases, each with expected level, must-have kinds and job answers. Please add them as engine tests (today = 2026-11-14) and tell me here which fail. If a case is wrong rather than the engine, say so and I'll fix the case. → done 18:48 (B): all 15 are tests in `src/engine/__tests__/test-cases.test.ts` (today 2026-11-14, contacts checked by digits). 14 passed first time; case 9 (orange juice) failed and is fixed in the engine (see next line). None of your cases were wrong. Engine total: 59 tests pass.
- [x] 18:42 · Adiyen: B, case 9 ("fresh orange juice ... freshmarket.mu") will probably be STOP, because MCB's keyword `juice` names MCB and any link then counts as not mcb.mu. Option 1: the engine counts `juice` only next to bank words (account, card, code, login, verify). Option 2: I remove `juice` from banks.json and keep `mcb juice`. Reply which one you prefer. → done 18:48 (B): option 1, keep `juice` in banks.json. The engine now counts everyday keywords like `juice` only within 40 characters of a banking word (account, card, code, wallet, verify, payment, app, kont, kart…), and never inside a link name. "Fresh orange juice" → NONE; "your Juice account… verify" still names MCB.
- [x] 18:42 · Adiyen: Jayesh, agency phones in agencies.json are now +230XXXXXXX with no spaces (commit 0cc0e9c). Bank phones keep their spaces (+230 202 6060), and two payment apps are short codes (8971 blink, 8908 my.t money). Show them as they are and dial them as they are. → done 18:45 (Jayesh): digits never change; on screen +230 numbers get spaces for reading (+230 5256 8074), short codes 8971/8908 shown and dialled as they are (`src/lib/phone.ts` + tests).
- [x] 18:42 · Adiyen: Jayesh, for "Our sources", the counts, dates and ready-made sentences are in `docs/sources.md` → "Text for the Our sources screen". → done 18:45 (Jayesh): your 5 sentences are on the screen (`src/constants/strings.ts`). Changed "Scam campaigns" to "Security alert campaigns" (wording rule: never "scam" on screen). Please use that wording in sources.md too.
- [ ] 18:42 · Adiyen: D, `docs/sources.md` has every dataset's count, date and link for slide 4 (data and sources) and the README "Data sources" section. Demo idea: LIFETIME CANADA LTD is a real licensed abroad agency (register page 9), which fits Kevin's Canada hotel job.
- [x] 18:43 · Jayesh: FYI removed unused native packages (gesture-handler, reanimated, worklets, @expo/ui, expo-image...) to fix the Windows APK build; run `npm install` after pulling. Nothing in src/engine changed. → noted 18:48 (B): pulled, ran `npm install`; engine tests, `tsc` and lint still pass.
- [x] 18:45 · Jayesh: FYI fixed from a Codex review: chips are 48 pt and can be unselected (Job check), "Saved" clears with Clear history, keyboard no longer covers buttons on iPhone.
- [ ] 18:49 · Adiyen: Jayesh, `docs/strings-fr-mfe.md` is pushed (commit 67907bf): French and Kreol for all 43 keys in strings.ts, ready to paste into the `fr` and `mfe` objects (section 3), plus the 17 finding titles by `kind` with {name}/{date}/{campaign} placeholders (section 2). Kreol needs a native speaker's read before the demo; send corrections here and I'll update the file.
- [ ] 18:51 · Adiyen: D, slide-2 fact check of PROJECT.md §2. ✅ "MAUCORS logged 913 scam reports in 2025" is confirmed: 913 "arnaques et fraudes" out of 6,073 incidents reported to MAUCORS in 2025 (Defimedia, 24 Aug 2026: https://defimedia.info/risques-dusurpation-didentite-whatsapp-username-le-gm-veut-des-garanties-avant-tout-deploiement). ❌ "Radio One 2026: 20+ alleged victims, Rs 296,000 from 4 complainants": no source found, so don't put it on a slide unless you have the link. ❌ "Ministry warnings in 2022 and 2023": no communiqué found online. A sourced alternative: Defimedia, 30 Jul 2021, about ten Mauritians cheated by fake recruiters for Canada, 6 complaints to the Ministry of Labour in 2 months, one person paid about Rs 350,000 (https://defimedia.info/immigration-letranger-les-faux-recruteurs-traques-intensivement-depuis-deux-mois).
- [ ] 18:51 · Adiyen: B and Jayesh, a question (no change made). 55 of the 79 agencies list 2 or 3 phone numbers in the register, but agencies.json keeps only the first (the contract has one `phone`). A message using an agency's real second number can't be matched. Option: add `phones: [...]` (all register numbers) next to `phone`. That's a contract change: reply "yes" both, and I'll add it, update TASKS.md §2 and validate.py in one commit.
