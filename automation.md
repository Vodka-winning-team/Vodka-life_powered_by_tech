# automation.md: live team board

**Updated about every 10 minutes by Pushkar's Claude.** Pull, read your row, do it. To ask for something, use **Requests** at the bottom.

Last update: **Fri 13 Nov 19:47** · Next check: about 19:56 · **No pushes since 19:27. Jayesh: nothing since 18:45. D: nothing yet. Reply to Adiyen's 19:21 ping in Requests** · Deadline: **Sat 12:30**

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
| 18:00: APK on a real phone; agencies, fee rules, banks data | Data ✅ · Engine ✅ · **APK ⏳ not reported yet (Jayesh), no push since 18:45** |
| 23:00: full flow with real data | Screens ✅ wired to the real engine · needs a run on a real phone |
| 03:00: FSC/CERT in, job follow-up works | FSC/CERT ✅ in the engine |
| 07:00: feature freeze | — |

**Done so far**
- **Adiyen (A):** 5 data files, phones audited, `validate.py`, `docs/sources.md`, `docs/test-cases.md` (15 cases), `docs/strings-fr-mfe.md` (French + Kreol for every screen text and finding title), slide-2 fact check.
- **Pushkar (B):** TypeScript engine, **59 tests pass**; README draft, now with checked source links for every number in "Problem"; this board.
- **Jayesh (C):** Expo app with 6 screens wired to the engine; readable phone numbers; Our sources text; Job check chips; keyboard fix.
- **D:** nothing pushed yet.

## Next for each person
**Adiyen (A)**
1. **Now (19:30 passed, D still missing):** push `docs/demo-messages.md` (6 demo messages from `PROJECT.md` §9; agency suggestion: LIFETIME CANADA LTD).
2. `phones: [...]` in agencies.json once Jayesh also says yes (request below).

**Pushkar (B)**
1. Run the app (`npx expo start`, press `w`) and paste the demo messages into Scan; report problems to Jayesh here.
2. Use `phones` in the engine's contacts once Adiyen adds it.

**Jayesh (C)**
1. APK on the demo phone *(18:00 checkpoint, overdue)*.
2. Paste Adiyen's French and Kreol from `docs/strings-fr-mfe.md` into `strings.ts`, plus the language switch.
3. Answer Adiyen's `phones` question below (yes/no).
4. Remove the dev-only sample button once real results look right.

**D (pitch and testing), overdue, nothing pushed yet**
1. `docs/decisions.md`, with the organisers' answer on reusing FraudLens's look *(due 16:30)*.
2. `docs/demo-messages.md`: 6 demo messages *(due 18:00)*.
3. Testers for 19:00–21:00, notes in `docs/user-tests.md` *(should have started at 19:00: overdue)*.
4. Slides: use only the checked numbers (Adiyen's fact check + B's note below; links are in `README.md` "Problem").

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
- [ ] 18:51 · Adiyen: D, slide-2 fact check of PROJECT.md §2. ✅ "MAUCORS logged 913 scam reports in 2025" is confirmed: 913 "arnaques et fraudes" out of 6,073 incidents reported to MAUCORS in 2025 (Defimedia, 24 Aug 2026: https://defimedia.info/risques-dusurpation-didentite-whatsapp-username-le-gm-veut-des-garanties-avant-tout-deploiement). ❌ "Radio One 2026: 20+ alleged victims, Rs 296,000 from 4 complainants": no source found, so don't put it on a slide unless you have the link. ❌ "Ministry warnings in 2022 and 2023": no communiqué found online. A sourced alternative: Defimedia, 30 Jul 2021, about ten Mauritians cheated by fake recruiters for Canada, 6 complaints to the Ministry of Labour in 2 months, one person paid about Rs 350,000 (https://defimedia.info/immigration-letranger-les-faux-recruteurs-traques-intensivement-depuis-deux-mois). → B note 18:58 (sources opened and read today): ✅ Radio One, 25 Aug 2026: "une vingtaine de Mauriciens" (about twenty), one official complaint so far: https://radio1.mu/faux-recruteur-le-reve-de-travailler-a-letranger-vire-au-cauchemar-pour-une-vingtaine-de-mauriciens/ · ✅ Radio One, 7 Sep 2026: four complainants say they paid Rs 296,000 in total, one paid Rs 50,000 for a job in Dubai: https://radio1.mu/promesses-demplois-letranger-un-habitant-de-quatre-bornes-aurait-soutire-pres-de-rs-300-000-a-quatre-victimes/ · ✅ Ministry of Labour communiqué, 28 Apr 2022, "Attention aux fausses agences de recrutement offrant du travail à l'étranger": https://www.govmu.org/EN/Communique1/year%202022/May/Communiqu%C3%A9-%20Fausses%20agences%20de%20recrutement%2028.04.22.pdf · ❌ the 2023 warning link is dead (404), so say "warned in 2022" only. Slide wording: "about twenty", not "20+"; these are allegations, not convictions. README updated with these links.
- [~] 18:51 · Adiyen: B and Jayesh, a question (no change made). 55 of the 79 agencies list 2 or 3 phone numbers in the register, but agencies.json keeps only the first (the contract has one `phone`). A message using an agency's real second number can't be matched. Option: add `phones: [...]` (all register numbers) next to `phone`. That's a contract change: reply "yes" both, and I'll add it, update TASKS.md §2 and validate.py in one commit. → B 18:58: **yes from B**, as an extra field: keep `phone` (main number, unchanged) and add `phones: [...]` with all register numbers. The engine will show the extra numbers only as official numbers to call. It will never treat a number in a message that matches the register as proof the message is real (scammers can copy numbers). Waiting for Jayesh's yes.
- [ ] 19:21 · Adiyen: **PING, everyone.** Reply on this line with your name and the time (or push anything), so we know who's online. Jayesh: no push since 18:45, and the APK is overdue. Are you building? Also waiting for your yes/no on `phones` (B already said yes). D: nothing pushed yet. If there's no `docs/demo-messages.md` by 19:30, I'll push mine (same texts as B's tests). → **Pushkar (B) online 19:27** (board checks every 10 min; engine 59 tests green). Adiyen: yes, push your demo-messages.md at 19:30 if D hasn't; I'll add it as engine tests on the next check.
