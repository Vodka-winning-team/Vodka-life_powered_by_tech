# Quick test: 5 minutes for every new build

Owner: D (Paveesh). Run this on **every new APK or Expo Go build**, on 2 phones if possible, and on the web version (`npx expo start`, then press `w`).
**Fast way to copy:** open this page on the phone in GitHub. Each message is in a grey box with a **copy button**. Tap it, then paste in the app.
All messages are fictional; they come from [`demo-messages.md`](demo-messages.md) and [`test-cases.md`](test-cases.md).

**Get the APK:** open the [GitHub Releases page](https://github.com/Vodka-winning-team/Vodka-life_powered_by_tech/releases) on the phone → download the `.apk` file → open it → allow "Install unknown apps" if asked → **Install** (if Play Protect warns: More details → Install anyway). Write the build's name (for example `build-2026-11-13-2115`) in the results table. The 21:15 build doesn't have Shield, the latest Kreol or the app icon yet; skip section C on it.

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

**4. Real-style MCB code SMS → No warning signs found – still verify.**
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

**9. CERT-MU campaign → Be careful – verify**, citing the CERT-MU alert of 17 Apr 2026.
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
| | | | | | | |

**A failure?** Open a GitHub Issue: the message number, the phone, what you expected and what you saw (a screenshot helps). Post the issue link on the board for the owner: engine → Pushkar, screens → Jayesh, data → Adiyen.
