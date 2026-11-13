# Quick test: 5 minutes for every new build

Owner: D (Paveesh). Run this on **every new APK or Expo Go build**, on 2 phones if possible, and on the web version (`npx expo start`, then press `w`).
**Fast way to copy:** open this page on the phone in GitHub. Each message is in a grey box with a **copy button**. Tap it, then paste in the app.
All messages are fictional; they come from [`demo-messages.md`](demo-messages.md) and [`test-cases.md`](test-cases.md).

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

## C. Shield, only if it was built ([proposal](proposal-shield-optin.md))

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
| | | | | | | |

**A failure?** Open a GitHub Issue: the message number, the phone, what you expected and what you saw (a screenshot helps). Post the issue link on the board for the owner: engine → Pushkar, screens → Jayesh, data → Adiyen.
