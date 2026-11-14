# Quick test: 5 minutes for every new build

Owner: D (Paveesh). Run this on **every new APK or Expo Go build**, on 2 phones if possible, and on the web version (`npx expo start`, then press `w`).
**Fast way to copy:** open this page on the phone in GitHub. Each message is in a grey box with a **copy button**. Tap it, then paste in the app.
**Result labels:** this page uses the wording of the final look (`c/notice-style`): "Be careful – check first" and "No warning signs found – still check". Builds up to release 06:56 still say "verify" in those two labels; the levels are the same.
All messages are fictional; they come from [`demo-messages.md`](demo-messages.md) and [`test-cases.md`](test-cases.md).

**Get the APK:** open the [newest release](https://github.com/Vodka-winning-team/Vodka-life_powered_by_tech/releases/tag/verifye-final-2026-11-14-1145) on the phone (final build, Sat 14 Nov 11:45) → download the `.apk` file → open it → allow "Install unknown apps" if asked → **Install** (if Play Protect warns: More details → Install anyway). Install it over the old build and write the build's name (`verifye-final-2026-11-14-1145`) in the results table. Remove the old September FraudLens app, and set Phone as the default dialler.

---

## A. Messages (paste → Check message)

**1. Job offer → Stop – high risk.** Then tap **Job offer? Check the agency** → pick THINK RECRUITMENT LTD → **Processing fee** → Stop, reg 7(2)(e).
```
Bonjour Kevin! THINK RECRUITMENT LTD here. Hotel job in Canada, salary CAD 3,000. To secure your place, pay the processing fee of Rs 50,000 today by Juice. Urgent, only 2 places left.
```

**2. Follow-up on the same case** (Result → **They asked for something new?** → paste → **Add to this case and check again**) → Stop, reg 7(2)(a).
```
They now want Rs 15,000 for the air ticket.
```

**3. Fake MCB link → Stop.** Shows MCB's official number +230 202 6060.
```
MCB: Unusual activity on your account. Verify your account at mcb-login-secure.net or it will be blocked.
```

**4. Real-style MCB code SMS → No warning signs found – still check.**
```
MCB: Your OTP for the online payment of Rs 1,250.00 at DARTY is 482913. Never share this code with anyone, including MCB staff.
```

**5. Kreol air ticket → Stop.**
```
Bonzour, ou finn gagn travay dan lotel Kanada. Bizin peye tiket avion Rs 38,000 avan lindi.
```

**6. French police report → Stop.**
```
Offre d'emploi en France : pour finaliser votre recrutement, payez 6 000 roupies pour le certificat de moralité.
```

**7. Orange juice (no false alarm) → No warning signs found.**
```
Weekend promo: fresh orange juice 1L at Rs 75. See all offers at freshmarket.mu
```

**8. FSC alert → Stop**, with the FSC alert date (4 Dec 2024).
```
Trade with KRAKEIF Global, a licensed investment dealer. 10% per week guaranteed.
```

**9. CERT-MU campaign → Be careful – check first**, citing the CERT-MU alert of 17 Apr 2026.
```
Mauritius Telecom Lucky Draw: you have won a prize! Send your details to mauritiustelecomeluckydraw@gmail.com
```

## B. Screens (1 minute)

- [ ] **Share-in (APK only):** in WhatsApp, long-press message 1 → **Share** → **Verifye** → the Result opens with Stop.
- [ ] **What to do now** → **Call the official number** opens the dialler with the register or bank number (don't call).
- [ ] **Share a summary** opens the share sheet (don't send).
- [ ] **Save to history** → **History** shows the case → **Clear history** empties it.
- [ ] **Our sources** shows 79 · 8 · 21 · 21 · 5 records with dates.
- [ ] Language switch: **Français**, then **Kreol**, then back to **English**. The titles change, and nothing is cut off.
- [ ] No screen shows the words "safe", "genuine", "scam" or "illegal".

## B1. New screens (final APK, 1 minute)

- [ ] The app's name and icon are **Verifye** (home screen, Share menu, Notification access list).
- [ ] While typing on Scan, the keyboard doesn't hide **Check message**.
- [ ] **Search an agency or bank** → type "think" → THINK RECRUITMENT LTD with both register numbers and "page 7" → a number opens the dialler only. Type "mcb" → MCB's official number.
- [ ] **Granny mode** (Settings card on Scan) → bigger text and buttons, no grey text; the Result shows one plain sentence, then the Call button. Switch it off again.
- [ ] **Read aloud** on the Result reads the result (English and French voices); **Stop reading** stops it.
- [ ] The Result shows **"Checked against these official records"** with dates (agencies 4 Nov 2026; banks, FSC and CERT-MU 13 Nov 2026) → tap → Our sources.
- [ ] In French and Kreol, the finding details, cost names and dates are translated.

## B1b. Tabs, widget, tour and online (builds from 05:58, 2 minutes)

- [ ] First start: the **tour** runs with a practice message; **Skip** works.
- [ ] Four tabs: **Check · Is it official? · Learn · History**; the tab bar sits above the phone's navigation buttons. Settings (Granny mode, automatic checking, tour, server) open from the gear on Check.
- [ ] **Paste the copied message** fills the box with what you copied; nothing copied → "Nothing is copied yet".
- [ ] **Widget:** add the Verifye widget to the home screen → "Check copied message" opens the app and checks it; it shows the newest CERT-MU alert.
- [ ] **Is it official?** → type `5256 8074` → THINK RECRUITMENT LTD. Type a made-up number → not listed.
- [ ] **Learn** → lessons open and the quiz scores, in airplane mode too; switch to Kreol.
- [ ] Random typing (`asdf asdf`) → amber box **"Please check your text"**, no Result.
- [ ] **Online (server running, phone on USB or hotspot):** message 3 → the **Online check** card with "Website address isn't registered". **Report this message** → saved; after a 2nd phone reports it → "Reported by other phones". **Read aloud** in Kreol plays; **Stop reading** stops it.
- [ ] **"This offer sounds too good"** (in git since 07:27; in builds after the 06:56 release): paste `Data entry job, $20/hour, work from home, no experience needed. WhatsApp 5XXX XXXX` → **Be careful**, "This offer sounds too good". Paste `ABC Ltd is hiring a data entry clerk in Ebene. Rs 18,000 a month. Send your CV to hr@abc.mu by 30 Nov.` → no such warning.
- [ ] **Server off:** the card says the online check isn't available, and the phone's result is unchanged.

## B1c. Final look (builds after the 10:53 merge, 2 minutes)

- [ ] First launch: the **welcome page** ("Set up Verifye": language, night mode, Granny mode, online checks) → **Start**.
- [ ] The look is black, white and sand; text is readable in bright light. **Night mode** switches to a near-black page and back.
- [ ] Labels: **"Be careful – check first"** and **"No warning signs found – still check"** (black banner, never green).
- [ ] **Online checks OFF** → check message 3 → the result comes from the phone only, and it says the link was not checked online. Nothing is sent.
- [ ] **Online checks ON** (server running) → the Online check card appears.
- [ ] **Scan a QR code** → allow the camera → scan any QR code with a link → Verifye shows a result or "A link from a QR code" caution, and **does not open the link**.
- [ ] **No "Say the message" button** in Granny mode (speech-to-text was removed at 11:23; the final 11:45 build doesn't have it).
- [ ] Animations: press a button (it dips), Check (the line sweeps once; tap skips it), the level word settles in. With the phone's "Remove animations" on, nothing moves.
- [ ] **Back** works during the scan animation, and 6 fast taps on Check give 1 Result.
- [ ] French and Kreol in the new look: nothing cut off.

## B2. Try to break it (surprise card, 1 minute)

- [ ] Tap **Check message** with nothing pasted → *"Paste a message first."*
- [ ] Paste `🙂🙂🙂` → *"Paste the whole message to check it"*, **never** "No warning signs found".
- [ ] Paste this (the line break inside "processing fee" is on purpose) → **Stop**:
  ```
  Bonjour Kevin! THINK RECRUITMENT LTD here. To secure your place, pay the processing
  fee of Rs 50,000 today by Juice. Urgent, only 2 places left.
  ```
- [ ] Tap **Check message** 5 times fast → **one** result screen, the same Stop.
- [ ] **Job offer? Check the agency** → **Back** without picking anything → the warnings are still there; no green light.
- [ ] **Save to history** twice → **one** entry in History.
- [ ] Close the app completely and reopen it → it doesn't crash; History is still there.

## C. Shield ([proposal](proposal-shield-optin.md); built 21:40, passed on the release APK 22:33)

- [ ] **Old FraudLens app removed:** uninstall the old FraudLens app (`com.fraudlens.shield`, from September) from the test phone. It would also react to the same WhatsApp, and judges must only see code written this weekend (Rule 1: start from empty). In Android's Notification access list, only **"Verifye"** is on.

**Which test for which build:** the fake notification from the laptop (`adb`) only works in a **development build**. The **release APK** ignores it on purpose (decision 15; Jayesh's fix at 21:50). With the release APK, use a **real WhatsApp or SMS from another phone, with the network on**.

- [ ] Switch off → the fake notification below gives **no** alert.
- [ ] Switch on (explanation screen → Android Notification access) → with the phone on USB:
  ```
  adb shell cmd notification post -S bigtext -t "THINK RECRUITMENT" demo1 "Bonjour Kevin! THINK RECRUITMENT LTD here. Hotel job in Canada, salary CAD 3,000. To secure your place, pay the processing fee of Rs 50,000 today by Juice. Urgent, only 2 places left."
  ```
  → **"Warning signs found. Tap to see why."** within 2 seconds → tap → Result: Stop.
- [ ] The same command with message 4 (the MCB code SMS) → **no** alert.
- [ ] One real WhatsApp message from a teammate's phone → alert.
- [ ] A **long** WhatsApp message (demo message 1 pasted 3 times, with "processing fee" only in the last copy) → alert. This checks we read the whole message, not the shortened preview.
- [ ] WhatsApp → Settings → Notifications → "Show preview" **off** → send again → no alert, and no crash. Turn previews back on.

## D. Results (add one line per run)

| Time | Build (APK / Expo Go / web) | Phone + Android version | Tester | Passed | Failed (number + what you saw) | GitHub issue |
|---|---|---|---|---|---|---|
| 20:57 | APK (airplane mode) | Jayesh's phone, Android 16 | Jayesh | All 6 demo steps + 3 backup messages | — | board 20:57 |
| 22:33 | Release APK with Shield | Jayesh's phone, Android 16 | Jayesh + Pushkar | Shield: real WhatsApp → alert; normal message → no alert | — | board 22:33 |
| 22:44 | Release APK build-2026-11-13-2115 | Samsung Galaxy A72, Android 14 | Pushkar | Demo 1 via share-in, Job check, Call, demos 4 and 5, all of B2 (empty, "ok", 6 rapid taps, skipped Job check, Save twice, force stop), Kreol screens | 1) keyboard hides "Check message" while typing; 2) FR/Kreol finding details and "Result" header still English; 3) dates show 2026-11-13; 4) Truecaller makes Call show an "Open with" chooser | board 22:45 (for Jayesh) |
| 22:54 | Release APK with Shield | Jayesh's phone, Android 16 | Jayesh + Pushkar | Shield end to end: real WhatsApp → alert → tap → Result "Stop – high risk" (a mistyped link, mcb-logon-secure.net, was still caught); normal message → no alert | — (findings 1 and 3 from 22:44 fixed in commit e27f04a, in the next APK) | board 22:54 |
| 23:24–23:28 | Verifye.apk (verifye-2026-11-13-2330) | Jayesh's phone, Android 16 | Jayesh | Verifye name, keyboard fix, titles switch language, dates, Official numbers, Granny mode, Shield still on | — | board 23:28 |
| 23:40 | Verifye.apk (verifye-2026-11-13-2330) | Samsung Galaxy A72, Android 14 | Pushkar | Retest: name, keyboard fix and the rest of the quick test | 2 small issues (Result not starting at the top for a new case; empty sections in Official numbers), fixed 23:42 | board 23:40 |
| 00:53–00:56 | Final Verifye.apk (verifye-final-2026-11-14-0055) | Jayesh's phone, Android 16 | Jayesh | Phone-tested before release (icon, UI polish, Read aloud, records card, FR/Kreol, agency fixes) | — | board 00:56 |
| 01:28 | Final Verifye.apk (verifye-final-2026-11-14-0055) | Samsung Galaxy A72, Android 14 | Pushkar | Full quick test on the final APK: new Scan layout, demo 1 via share-in, Read aloud and records card on the Result, Job check, one card per organisation, demos 4 and 5, wrong-input checks | 1 small note: Result did not open at the top after Job check → Check again (fixed in git 01:30, commit 46513e3; not in this APK) | board 01:28 |
| 06:00 | App on the new `server/` | Pushkar's phone | Pushkar | Online check card, Report (2 phones → "Reported by other phones"), Learn, Before you pay | myt voice and Safe Browsing not tested (no keys) | board 06:00 |
| 06:16–06:35 | Demo build 06:25, new `server/` with keys | Jayesh's phone, Android 16 | Jayesh | myt voice, Safe Browsing ("Known harmful link", 100/100), site checks, report from another phone | — | board 06:20, 06:35 |
| 06:51 | Release 06:31 | Samsung Galaxy A72, Android 14 | Pushkar | Paste button and widget work | Tab bar under the navigation buttons + 3 small notes (fixed 06:55) | board 06:51 |
| | | | | | | |

**A failure?** Open a GitHub Issue: the message number, the phone, what you expected and what you saw (a screenshot helps). Post the issue link on the board for the owner: engine → Pushkar, screens → Jayesh, data → Adiyen.
