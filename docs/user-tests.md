# User tests

**Goal:** see where real people get stuck, then give Jayesh the **top 3 fixes**. About 10 minutes per person.

## Before you start
- **Device:** the app in the browser (on Pushkar's laptop, `npx expo start`, then press `w`) or in Expo Go on a phone (scan the QR code). This laptop (Adiyen's) has no Node.js, so it can't run the app.
- **Privacy:**
  - Ask "Can I watch you try our app for 10 minutes? We'll write notes, but not your name." Go ahead only on a yes.
  - Never write a tester's name or number. Use "Tester 1 (jobseeker, 20s)" and so on.
  - Use only the messages below, never the tester's own messages.
- **The rule while they try it:** hand over the device, read the task aloud once, then **say nothing and don't help**. Write down every place they stop, frown, tap the wrong thing or ask a question. If they're fully stuck for 30 seconds, note it, then help.

## The tests

### Tester 1: jobseeker (job offer)
Read out: *"Imagine you got this on WhatsApp. Use the app to decide what to do."* Show the message (fictional):
> Bonjour Kevin! THINK RECRUITMENT LTD here. Hotel job in Canada, salary CAD 3,000. To secure your place, pay the processing fee of Rs 50,000 today by Juice. Urgent, only 2 places left.

Kreol version if they prefer (fictional):
> Bonzour, nou ena travay dan lotel Kanada. Saler 90,000 par mwa. Bizin peye fre dosie Rs 45,000 avan vandredi.

Expected: **STOP**. Watch for:
- [ ] Do they find where to paste the message?
- [ ] Do they understand the big STOP banner?
- [ ] Do they tap "Job offer? Check the agency"?
- [ ] Can they pick the agency and the cost ("Processing fee")?
- [ ] Do they find "What to do now" and the official number to call?

### Tester 2: parent (bank message, then a real code SMS)
Read out: *"Your son forwarded you this. Use the app to check it."* (fictional):
> MCB: Unusual activity on your account. Verify your account at mcb-login-secure.net or it will be blocked.

Expected: **STOP**, with MCB's official number +230 202 6060.

Then: *"And this one?"* (fictional):
> MCB: Your OTP for the online payment of Rs 1,250.00 at DARTY is 482913. Never share this code with anyone, including MCB staff.

Expected: **No warning signs found – still check**. Watch for:
- [ ] Do they see *why* the link is a problem (the highlight in the message)?
- [ ] Do they know which number to call: the app's, not the message's?
- [ ] On the second message, do they still understand "still check", or do they read it as "it's fine"?

### Kreol reader (language check, about 10 minutes)
- Switch the app to **Kreol** on the Scan screen and read every screen aloud: Scan, Result, Job check, What to do now, History, Our sources.
- Check every Kreol text against the Kreol column in `docs/strings-fr-mfe.md` and write each fix in the table below (key, current text, better text).
- Ask: *"Would your mum or grandad understand this?"*

## Three questions after each test
1. "What would you do now, if this were a real message?"
2. "What was confusing or slow?"
3. "Would you use this before paying someone? Why or why not?"

## Notes

| Tester | Message | Where they hesitated (screen, what happened) | What they said | Fix idea |
|---|---|---|---|---|
| Tester 1 (…) | job offer | | | |
| Tester 2 (…) | MCB link + real code SMS | | | |
| Kreol reader (…) | all screens | | | |

### Kreol fixes

| key | current Kreol | better Kreol |
|---|---|---|
| | | |

## Top 3 fixes for Jayesh
1.
2.
3.

When the tests are done, post the top 3 on `automation.md` (Requests) for Jayesh. Send the Kreol fixes to Adiyen, who updates `docs/strings-fr-mfe.md`.
