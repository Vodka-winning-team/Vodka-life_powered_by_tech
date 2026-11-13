# automation.md: live team board

**Updated about every 10 minutes by Pushkar's Claude.** Pull, read your row, do it. To ask for something, use **Requests** at the bottom.

Last update: **Fri 13 Nov 18:38** · Next check: about 18:48 · Deadline: **Sat 12:30**

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
| 18:00: APK on a real phone; agencies, fee rules, banks data | Data ✅ · Engine ✅ (ahead) · **APK ⏳ building (Jayesh)** |
| 23:00: full flow with real data (Scan → X-Ray → bank check → job check → what to do now → history) | Screens ✅ wired to the real engine; needs testing on a phone |
| 07:00: feature freeze | — |

**Done so far**
- **Adiyen (A):** all 5 data files (79 agencies, 8 fee rules, 21 banks/payment providers, 21 FSC alerts, 5 CERT-MU alerts), `validate.py`, `docs/sources.md`.
- **Pushkar (B):** engine in TypeScript with 44 passing tests (demo 1 and 4 → STOP, genuine bank code SMS → no warning, 22 Kreol/French messages); `README.md` draft; this board.
- **Jayesh (C):** Expo app with 6 screens (Scan, Result, Job check, What to do now, History, Our sources), theme and strings files, data loader.
- **D:** nothing pushed yet.

## Next for each person
**Adiyen (A)**
1. `docs/test-cases.md`: 15 short messages in English, French and Kreol, each with the expected level (STOP / CAREFUL / NONE) and the rule it tests. Include a genuine bank code SMS → NONE. *(Due 22:00; doing it now lets the engine be tuned earlier.)*
2. Then `docs/strings-fr-mfe.md`: French and Kreol versions of the main screen texts for Jayesh.

**Pushkar (B)**
1. Add D's 6 demo messages and Adiyen's 15 test cases as engine tests as soon as they are pushed; fix anything that fails.
2. Help Jayesh test the screens with real messages (`npx expo start`, press `w`).

**Jayesh (C)**
1. Finish the APK and install it on the demo phone *(18:00 checkpoint, overdue)*.
2. Pull: the real engine is in (commit `295f3c9`). Remove the dev-only sample button when the real results look right.
3. Translate finding titles by `kind` in `strings.ts`: `code_request`, `bank_link`, `bank_phone`, `bank_alarm`, `fsc_alert`, `job_fee`, `agency_listed`, `agency_not_found`, `agency_wrong_category`, `agency_expired`, `urgency`, `payment_request`, `prize_gift`, `guaranteed_returns`, `new_number`, `odd_link`, `cert_alert`.

**D (pitch and testing), overdue**
1. Ask the organisers whether reusing FraudLens's old look and fonts is allowed; write the answer and time in `docs/decisions.md` *(due 16:30)*.
2. `docs/demo-messages.md`: the 6 demo messages from `PROJECT.md` §9, labelled fictional, each with its expected level *(due 18:00)*.
3. Find 3 testers (jobseekers or parents) for 19:00–21:00; notes in `docs/user-tests.md`.
4. Check and finish `README.md` (Pushkar's Claude drafted it at 18:35): AI tools section, surprise card, team names.

## Requests
<!-- Add new lines at the END of this list. Format: - [ ] HH:MM · Name: request -->
