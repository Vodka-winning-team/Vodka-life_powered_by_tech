# Decision log

Real times, Fri 13 Nov 2026 (Mauritius time). Each line says what we decided, why, and where it is recorded (commit, file or board line), so a judge can check it.
Started by A (Adiyen) at 20:15 because D was missing (Jayesh's request on `automation.md`, 20:07). **D: please review and keep adding.**

## Decisions

1. **14:00 · Theme 1 and a FraudLens rebuild.** The organisers approved it, and the team already knew the idea. *Record: PROJECT.md §10.*
2. **15:00 · No AI model: rules plus official registers.** The rules ask for real data, and the app must work offline. Every warning points to a rule or an official record. *Record: PROJECT.md §10, CLAUDE.md "No AI/ML models".*
3. **15:00 · No server: all data is bundled on the phone.** It works with no signal and sends nothing anywhere. *Record: PROJECT.md §10.*
4. **15:00 · The overseas-job check is the lead story.** There is documented local harm and a clear legal rule: Private Recruitment Agencies Act 2023 s.5 and Regulations 2025 reg 7(2). *Record: PROJECT.md §10.*
5. **16:05 · Team review: Shield is cut.** The "Arnak? Live" plan becomes only the "what's next" slide, and the job check stays the lead. This brings the scope down to what four people can finish by Saturday 12:30. *Record: docs/TASKS.md, line 4.*
6. **17:44 · Privacy rules for the data.**
   - The register's director and email columns are never read.
   - FSC alerts that name a private person are left out.
   - CERT-MU's property alert names a person and lists private mobiles, and none of those are copied.
   - EZ Dash is left out because it has no official website or phone.

   *Record: commits 89ac36e, 4c99e02; docs/sources.md "What we left out".*
7. **~18:15 · Stack change: Kotlin to Expo (React Native and TypeScript).** The app must run on an Android APK, an iPhone through Expo Go, and the web, from one codebase. The engine was ported with the same names and behaviour, and the data files didn't move. *Record: TASKS.md stack-change box; commits 8f730ca (18:18), 295f3c9 (18:24, Kotlin engine removed).*
8. **18:45 · On screen, "Security alert campaigns", never "Scam campaigns".** This follows the wording rule: never "safe", "genuine", "scam" or "illegal". *Record: commit c1e6fb5; sources.md updated in d344625.*
9. **18:48 · Everyday bank keywords like "juice" (MCB Juice) count only near a banking word** such as account, card, code, wallet or verify. Otherwise "fresh orange juice" plus any link became a bank-link STOP. A's test case 9 found this bug. *Record: commit 839e373; board, 18:42 request.*
10. **18:58 · The slides use only numbers we've checked.**
    - "About twenty" Mauritians (Radio One, 25 Aug 2026), not "20+".
    - Rs 296,000 from four complainants (Radio One, 7 Sep 2026), presented as allegations, not convictions.
    - The Ministry warning is from 2022 only, because the 2023 link is dead.
    - MAUCORS logged 913 scam and fraud reports out of 6,073 incidents in 2025 (Defimedia, 24 Aug 2026).

    *Record: board, 18:51 and 18:58 lines; README "Problem".*
11. **20:04 · Agencies keep every register phone number.** `phone` stays the main number and `phones` lists all of them (175 numbers; 55 agencies have 2–6). A matching number is never treated as proof that a message is real, because scammers can copy numbers. This is a contract change, agreed by A, by B (18:58) and by C (20:04). *Record: commit 1483850; TASKS.md §2.*
12. **20:07 · Test in Expo Go and the browser; don't wait for the APK.** The Windows native build ran out of memory, and the app already works in Expo Go and on the web. *Record: board, Jayesh 20:07.*
13. **20:10 · The stage demo uses THINK RECRUITMENT LTD** (a real licensed abroad agency, register page 7). The demo texts are the same ones B's engine tests check, so what we show is what is tested. LIFETIME CANADA LTD was also suggested. *Record: commits 5b7ca41, 4b7541c.*
14. **20:46 · Surprise card: "survive a user doing the wrong thing".** The card: *"Your app must survive a user doing the 'wrong' thing: wrong input, skipped steps, panic-tapping. Make one key flow hard to break."* Our key flow is Kevin's case, **Scan → Result → Job check → What to do now**, and our principle is **fail safe**: wrong, empty or broken input never shows "No warning signs found". Engine side done at 20:48 (never crashes; 4 new finding kinds: `empty_message`, `message_truncated`, `cost_unknown`, `check_failed`; 24 robustness tests). App side (tap guard, "paste the whole message", skipped Job check) by Jayesh. D adds a 60-second "try to break it" demo segment, a slide and the README section. *Record: board 20:46 and 20:48 (Pushkar); commit 0996621. Team 10-minute meeting to confirm: see Open.*
15. **21:01 · Shield comes back as an opt-in switch** (D's proposal, `docs/proposal-shield-optin.md`). Off by default, Android APK only, WhatsApp and SMS notifications only, nothing saved or sent; the alert opens the normal Result screen. **Why:** Kevin is warned before he pays without having to think of checking, while the user stays in control. **Order:** share-in and the surprise card app work first; then Pushkar's `shouldAlert()` with Jest tests; then the Android part. **Hard stop at 03:00:** if it doesn't work on the APK, it's removed and stays a slide-6 "what's next" line. Never in the main demo path: the last 20 seconds, and in the backup video. It reverses part of decision 5 (Shield cut at 16:05). *Record: agreed by A, B, C and D in person, reported by Paveesh at 21:01; texts in `docs/strings-shield.md`; board line 21:01.*

## Open (not decided yet)

- **The AI pattern score, on-phone learning and data updates** (C's proposal, 17:42, `docs/proposal-ai-and-updates.md`). It's marked "PROPOSAL, needs A, B, C and D to agree", and it would change decision 2.
- **Reusing FraudLens's old look and fonts:** the question to the organisers (TASKS.md, D at 16:30). No answer is logged yet.
- **Surprise card meeting:** Pushkar's plan (decision 14) was posted at 20:46 and the engine part is done. All 4 still confirm it in a 10-minute meeting; D adds the time here.
