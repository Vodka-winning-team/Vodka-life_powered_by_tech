# Backup video script (2 minutes)

Owner: D (Paveesh). The organisers ask for a **backup demo video, about 2 minutes, with the core feature working**. It is what we play if the phone or the server fails on stage.
**Record it on the final build** (release `verifye-2026-11-14-1056` or newer), between 11:30 and 12:00.

## Before recording (5 minutes)

- [ ] Phone: final build installed, welcome page and tour already done, English, History cleared, brightness up, **Do not disturb on** (no personal notifications in the video).
- [ ] **Online checks: OFF** to start. Server running on Jayesh's laptop for the online part (phone on USB or hotspot).
- [ ] The 3 messages below are in a notes app, in order. Copy message 1 before you start.
- [ ] Use the phone's own **screen recorder with the microphone on**, so the voice is recorded with the screen. Hold the phone upright.
- [ ] One person taps (Jayesh), one person speaks (Paveesh), close to the phone, in a quiet corner.
- [ ] Do one practice run with a timer. Then record. Two takes at most; keep the better one.

## The messages (fictional)

**1. Job offer**
```
Bonjour Kevin! THINK RECRUITMENT LTD here. Hotel job in Canada, salary CAD 3,000. To secure your place, pay the processing fee of Rs 50,000 today by Juice. Urgent, only 2 places left.
```
**2. Fake bank link**
```
MCB: Unusual activity on your account. Verify your account at mcb-login-secure.net or it will be blocked.
```
**3. Real-style bank code SMS**
```
MCB: Your OTP for the online payment of Rs 1,250.00 at DARTY is 482913. Never share this code with anyone, including MCB staff.
```

## The script

| Time | On screen | Say |
|---|---|---|
| **0:00–0:12** | The Check tab, empty | "This is Verifye. Kevin, 24, gets a job offer on WhatsApp: a hotel job in Canada, if he pays a Rs 50,000 processing fee today. Before he pays, he checks." |
| **0:12–0:35** | Paste message 1 → **Check message** → the result: **Stop – high risk**, with the highlighted words | "He pastes the message. Online checks are off: this runs on his phone, with no internet. Verifye says Stop. It highlights the fee and the pressure to pay today." |
| **0:35–0:58** | Open the job check → pick THINK RECRUITMENT LTD → pick Processing fee → the result | "The agency is in the Ministry of Labour's register. But Verifye says: listed, this does not prove the message is from them. And by law, the processing fee is paid by the employer. Regulations 2025, regulation 7(2)(e)." |
| **0:58–1:10** | **What to do now** → tap the call button: the dialler opens with the register's number. Go back. | "What to do now: call the agency on the number from the official register, never the one in the message." |
| **1:10–1:25** | Back to Check → paste message 2 → Check → **Stop** | "A fake bank message. The link is not MCB's official website, mcb.mu. Stop, and here is MCB's real number." |
| **1:25–1:37** | Paste message 3 → Check → **No warning signs found – still check** | "A real bank code SMS: no false alarm. And Verifye never says 'safe'. It says: still check." |
| **1:37–1:48** | Type `asdf asdf` → Check → the amber box. Then tap Check several times fast on message 1 → one result. | "Our surprise card: wrong input never gets a result, and panic taps give one answer." |
| **1:48–2:00** | Settings → **Online checks ON** → check message 2 again → the Online check card | "Online, Verifye also checks the link itself and reports from other phones. The server keeps no message. Verifye avan ou peye. Check before you pay." |

**Total: 2:00.** If you run over, cut the 1:37–1:48 row first, then shorten the first sentence.

## Rules for what we say

- Say "fake offer" or "fake recruiter". Don't say "scam", "safe" or "nothing leaves the phone".
- The messages are fictional: it is fine to say so once ("a made-up message").
- Don't claim user tests or partners.
- If a step shows something different from this script on the final build (a button renamed, a screen moved), **follow the app**, and say what the screen shows.

## After recording

- [ ] Watch it once from start to end: the voice is clear, no personal notification or name appears, the result screens are readable.
- [ ] Upload it (Google Drive or an unlisted YouTube video). Set sharing to **"anyone with the link can view"**.
- [ ] Open the link in a private browser window to check it plays without a login.
- [ ] Put the link in `README.md` and `docs/submission.md` (Paveesh's Claude does this: send the link).
- [ ] Keep the file on the demo laptop too, opened and paused at 0:00 before the pitch.
