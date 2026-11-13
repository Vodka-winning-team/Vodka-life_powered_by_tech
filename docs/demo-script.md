# Demo script and judge Q&A

Owner: D (Paveesh). The pitch and demo get **10 minutes in total**. We aim for **about 7 minutes of talk and demo**, which leaves **about 3 minutes for questions**.
The messages are in [`demo-messages.md`](demo-messages.md) and the slides in [`slides.md`](slides.md). The demo messages are fictional, and we say so on stage.

---

## Before we go on stage (10 min before)

- [ ] **Demo phone:** charged, brightness up, silent mode, notifications off ("Do not disturb"). **Phone is the default dialler:** if Truecaller or another dialler is installed, tap Call once and choose Phone → Always, or the demo shows an "Open with" chooser. **If Shield is in the demo**, add Verifye and WhatsApp to the Do-not-disturb exceptions, or the alert won't show.
- [ ] **Old FraudLens app removed:** uninstall the old FraudLens app (`com.fraudlens.shield`, from September) from every demo phone. It would also react to the same WhatsApp, and judges must only see code written this weekend (Rule 1: start from empty). In Android's Notification access list, only **"Verifye"** is on.
- [ ] **App open on the Scan screen**, language set to English, **History cleared** (History → Clear history).
- [ ] **Messages ready to paste:** keep demo messages 1, 3, 4 and 5 in a notes app on the phone, in order. Copy each one just before you need it.
- [ ] **Offline:**
  - **With the APK:** airplane mode on for the whole demo.
  - **With Expo Go:** the app is loaded from the laptop, so the phone must stay connected to it. Put the laptop and the phone on a hotspot that has **no internet**. That way we can still say "no internet is used", and it's true. Don't reload the app on stage.
- [ ] **Backup video** open on the laptop, paused at 0:00.
- [ ] **Screen mirroring** checked (phone → projector), or a camera on the phone.
- [ ] **Who does what:** Paveesh speaks, Jayesh drives the phone, Adiyen covers the data slide, Pushkar covers how the checks work.

---

## The script (about 7 minutes)

### 0:00–0:30 · Slide 1, Kevin's story · Paveesh
> "This is Kevin. He's 24, from Triolet. On WhatsApp he gets a hotel job in Canada. To secure his place, he has to pay a Rs 50,000 processing fee, today. He doesn't have it, so he asks his mother to lend it.
> Would you pay?"

*(Pause 2 seconds. Kevin is a persona built from real reported cases.)*

### 0:30–1:15 · Slide 2, the problem · Paveesh
> "This isn't made up. Radio One reported about twenty Mauritians who say one fake recruiter cheated them. Four complainants say they paid Rs 296,000 between them, and one paid Rs 50,000 for a job in Dubai. The Ministry of Labour has warned about fake recruitment agencies since at least 2022.
> And the law already answers Kevin. No agency or employer may charge a worker a recruitment fee: Act 2023, section 5. The processing fee, the visa and the air ticket are paid by the employer: Regulations 2025, regulation 7(2).
> The answer exists. Nobody checks it at the moment of paying. So we built *Verifye*: Kreol for “check”. *Verifye avan ou peye.*"

### 1:15–5:15 · Slide 3, live demo · Jayesh drives, Paveesh narrates

**Step 1: job offer (about 1 min)**
- Paste demo message 1 → tap **Check message**.
> "Kevin pastes the message. Nothing leaves the phone."
- Result: **Stop – high risk**. Point to the highlights: "processing fee", "Urgent".
> "X-Ray shows the tricks: a fee, and pressure to pay today."
- Tap **Job offer? Check the agency**. Under **Found in the message**, the app already suggests THINK RECRUITMENT LTD. Pick it. Under **2. What are they asking you to pay for?**, pick **Processing fee**.
> "THINK RECRUITMENT LTD is a real agency in the Ministry's register of 4 November, licensed for jobs abroad. But look at the wording: *listed, but this does not prove the message is from them*. Anyone can use a real agency's name.
> And the processing fee is paid by the employer, regulation 7(2)(e). So: Stop."

**Step 2: what to do now (about 35 s)**
- Tap **What to do now** → **Call the official number**. The dialler opens with +230 5256 8074. **Don't press call.**
> "The number comes from the Ministry register, never from the message, so Kevin calls the real agency."
- Go back → **Share a summary**, pick Mum in the share sheet. **Don't send.**
> "Kevin's mother gets the same evidence before any money moves."
- Go back to the result → **Save to history**.
> "It's saved only because we tapped Save."

**Step 3: follow-up (about 35 s)**
- Open **History**, then the saved case. Under **They asked for something new?**, paste demo message 3 ("They now want Rs 15,000 for the air ticket.") → tap **Add to this case and check again**.
- *Fallback (rehearse both):* **Job offer? Check the agency** → pick **Round trip air tickets** → **Check again**.
> "A week later they ask for Rs 15,000 for the air ticket. Same case, checked again: air tickets are the employer's cost too, regulation 7(2)(a). Stop."

**Step 4: fake bank link (about 30 s)**
- Back to Scan, paste demo message 4 → **Check message** → **Stop – high risk**.
> "Not only jobs. This says MCB, but the link is mcb-login-secure.net. MCB's official website on the Bank of Mauritius list is mcb.mu. Stop. And here is MCB's official number, from mcb.mu."

**Step 5: no false alarm (about 20 s)**
- Paste demo message 5 (the real-style MCB code SMS) → **Check message** → **No warning signs found – still verify**.
> "A real bank code SMS. It says *never share this code*, so the app doesn't cry wolf. And it never says 'safe'. It says: still verify."

**Step 6: surprise card, "try to break it" (about 60 s)**
> "Our surprise card: the app must survive a user doing the wrong thing. Kevin is stressed and in a hurry. Let's try to break it."
- Tap **Check message** with nothing pasted → *"Paste a message first."*
- Paste `🙂🙂🙂` → **Check message** → *"Paste the whole message to check it"*, never "No warning signs found".
- Paste demo message 1 with a line break inside "processing fee" (from `quick-test.md`, section B2) → tap **Check message** 5 times fast → one result: **Stop**.
- Open **Job offer? Check the agency** → tap **Back** without picking anything → the result still shows every warning sign. No green light.
> "Whatever Kevin does wrong, the app never gives him a false green light. It fails safe. We tested it with 500 random messages."
- *Before rehearsal: check each of these on the APK (Jayesh's app side was done at 21:00; `quick-test.md` section B2).*

**Optional extras, only if there's time (10 s each; pick one, rehearsed):** **Granny mode** (Settings card on Scan → big text, one plain sentence, Call button first) · **Search an agency or bank** (type "think" → THINK RECRUITMENT LTD with both register numbers) · **Read aloud** on the Result · the **"Checked against these official records"** card: *"Every result shows the date of each official list it used."*

**Step 7 (optional): automatic checking, Shield (about 20 s)**. Passed on the release APK at 22:33 (real WhatsApp test). Rehearse it once on the demo phone first.
- **Before this step: turn airplane mode off** (Wi-Fi or data on), so the WhatsApp message can arrive. Shield must already be switched on, with Notification access granted.
- Jayesh's phone sends demo message 1 by WhatsApp to the demo phone → **"Stop – warning signs found. Tap to see why, before you pay."** → tap → Result: **Stop**.
> "And if Kevin turns it on, he doesn't even need to copy the message. It's his choice, and nothing is saved."
- If the alert doesn't come within 5 seconds: skip it and say it's in the backup video.

### 5:15–5:45 · Slide 4, our data · Adiyen
*(If time allows, Jayesh opens **Our sources** on the phone during this slide.)*
> "79 agency licences from the Ministry of Labour, 8 fee rules from the Act and the Regulations, 18 banks and 3 payment apps from the Bank of Mauritius, 21 FSC investment warnings, and 5 CERT-MU alerts. Every row has its source link and date. Every agency row was checked against the official PDF, page by page, and a script checks every phone number against its row. We store no personal names. No AI model: clear rules anyone can check, and tests run every demo message you just saw."

### 5:45–6:30 · Slide 5, impact · Paveesh
> "Who could run it? The Ministry of Labour's Recruitment Licence Unit and CERT-MU already publish this data. We'd propose a handover; we have no partnership today. Running cost: Rs 0. No server, it works offline, and keeping the data fresh is a few hours a month.
> How it reaches people: employment offices, bank branches and community groups, on Android, iPhone and the web.
> In a pilot we'd measure one thing: how many users call the official number before they pay."

### 6:30–7:00 · Slide 6, surprise card + next · Paveesh
> "Our surprise card asked us to survive a user doing the wrong thing. We chose Kevin's key flow and made it fail safe: wrong input, skipped steps or panic-tapping never give a false green light. You saw it in the last minute of the demo."
> "Next: *Arnak? Live*, a warning that appears during a phone call when a bank app is opened.
> *Verifye avan ou peye.* Check before you pay. Thank you."

### If the demo breaks
- **App freezes or won't load:** say "Here's the same flow recorded this morning" → play the backup video from 0:00. Don't debug on stage.
- **Wrong result on stage:** say what it should show, move to the next step, and explain in Q&A. Don't argue with the phone.

---

## Judge Q&A

Answer in **two sentences**, then stop. The person in brackets answers first; anyone can add one line.

### The idea and the problem
1. **"Isn't this just another scam checker?"** (Paveesh)
   Most checkers guess from the words. Ours checks the actual job offer against the Ministry register and the Regulations, and cites the clause. "Employer pays the processing fee, reg 7(2)(e)" is a fact Kevin can show the agency.
2. **"Is Kevin real?"** (Paveesh)
   Kevin is a persona built from the reported cases: Radio One's Rs 50,000 case and the Ministry's warnings. The cases and the law are real; the message on the slide is fictional, and we say so.
3. **"Why would Kevin open an app at that moment?"** (Jayesh)
   He doesn't copy anything: in WhatsApp he long-presses the message, taps Share, then Verifye, and the result opens. On iPhone or the web he pastes it. And if he turns on automatic checking (Android), the warning comes to him.

### How it works
4. **"Why no AI or machine learning?"** (Pushkar)
   Every warning has to point to a rule or an official record, so a judge, a user or the Ministry can check it. The organisers' own advice was that a simple rule that works beats a model that doesn't.
5. **"A scammer can use a real agency's name. What then?"** (Pushkar)
   That's why the app says "Listed, but this does not prove the message is from them", and gives the register's number so Kevin calls the real agency. And a fee the employer must pay is a Stop, whatever the agency's name.
6. **"How does the bank link check work?"** (Pushkar)
   If a message names a bank, we compare the link with that bank's official domain from our bank list (sourced from the Bank of Mauritius list). Look-alikes such as mcb-login-secure.net, or mcb.mu.evil.com, are flagged; mcb.mu is not.
7. **"What about false alarms?"** (Pushkar)
   The real bank code SMS in the demo gives no warning. Our tests also caught one false alarm early: "fresh orange juice" was counted as MCB Juice. We fixed it so "juice" counts only next to banking words (decision 9).
8. **"And what if it misses something?"** (Pushkar)
   It can, which is why it never says "safe". The lowest level is "No warning signs found – still verify", always with the official number.
9. **"How do you test it?"** (Pushkar)
   Automated tests run the exact demo messages, A's 15 test cases in English, French and Kreol, and checks on the real data files (`npm test`). *(Give the number from the latest `npm test` run on the day.)*
10. **"Why did you switch from Kotlin to Expo?"** (Jayesh)
    At 18:15 we chose one codebase for Android, iPhone and the web, so it reaches more people. The engine was ported with the same names and tests (decision 7).

### The data
11. **"Where does the data come from, and how do you know it's right?"** (Adiyen)
    Official sources only: the Ministry register PDF, the Act and Regulations, the Bank of Mauritius list, FSC alerts and CERT-MU alerts. Every agency row was checked against the official PDF, page by page, and a script checks every phone number against its row; every clause was found word for word, and every bank phone was read on the bank's own website. `validate.py` checks every row.
12. **"What if the register changes tomorrow?"** (Adiyen)
    The app shows the date of every dataset, for example "Ministry list of 4 Nov 2026". Our script rebuilds the file from a new PDF in minutes. Automatic updates are on the "what's next" list.
13. **"How did you handle the data cleaning?"** (Adiyen)
    One Python script per source, using pdfplumber to read the PDFs. Directors' names and email columns are never read. Phones were normalised to +230 and checked against their own row of the PDF.

### Privacy and safety
14. **"What data do you collect?"** (Paveesh)
    None. Nothing leaves the phone, there are no accounts and no server, and a case is saved on the phone only when the user taps Save.
15. **"Could this be used to target people?"** (Adiyen)
    No. We store organisations only: no directors, and no FSC alerts that name a private person. The app never says a person or agency is a scammer; it says what the official record shows.
16. **"What if the app is wrong and someone loses money?"** (Paveesh)
    The app never says "safe", "scam" or "illegal". It shows the official record and its date, and always sends the user to the official number. The decision stays with the user, but now it's an informed one.

### Impact and next steps
17. **"Who would run this, and what does it cost?"** (Paveesh)
    The Ministry of Labour's Recruitment Licence Unit and CERT-MU are the natural owners, since they already publish the data; we'd propose a handover, and there's no partnership today. Running cost is Rs 0, plus a few hours a month to refresh the data.
18. **"How would you measure success?"** (Paveesh)
    In a pilot: how many users call the official number before paying. We don't claim losses prevented.
19. **"What about iPhone users?"** (Jayesh)
    The same code runs on iPhone through Expo Go and on the web. Only the Android APK is a separate install.
20. **"What about scams by phone call?"** (Paveesh)
    That's our next step, *Arnak? Live*: a warning during a call when a bank app is opened. We cut it this weekend to finish the job check properly (decision 5).

### Our own work
21. **"What did AI do, and what did you do?"** (Paveesh, then each person for their part)
    The README lists every tool, and `docs/ai-log.md` has one line per AI step with what we checked. We made the decisions, checked the data against the PDFs, wrote the test cases and tested the app on our own phones. Ask any of us to explain or change our part.
22. **"Change something live: can you show us?"** (the person who owns that part)
    Wording is in `src/constants/strings.ts`, colours and sizes in `src/constants/theme.ts`, and rules in `src/engine/rules.ts`. *(Rehearse one small change each.)*
23. **"Did you test it with real users?"** (Paveesh)
    Not with outside users yet, and we won't claim we did; that's the first step of a pilot. We tested the release APK on two real phones (Android 14 and 16): every demo message, wrong input, panic taps, share-in and automatic checking with a real WhatsApp. That found and fixed real problems, such as stacked Result screens after several shares, cut-off tags and a confusing label.
24. **"How did you handle the surprise card?"** (Paveesh)
    The card was "survive a user doing the wrong thing" (20:46). We chose Kevin's key flow and one principle, fail safe: the engine never crashes, and garbage, empty or broken input never shows "No warning signs found" (decision 14). It's the "try to break it" minute in the demo, with 24 engine tests behind it, including 500 random messages.

---

## Rehearsal checklist
- [ ] Run 1: full run with a timer. Cut words if it goes over 7 minutes.
- [ ] Run 2: with the backup video switch, as if the phone failed at step 3.
- [ ] Run 3: swap roles. Each person explains a part they didn't build (Q&A 5, 11, 14, 19).
- [ ] On the day: update Q&A 9 (test count); check Q23 and Q24 match what the app shows.
