# Pitch cheat sheet (one page)

Owner: D (Paveesh). Pitches start at **13:00**: 10 minutes for the pitch and demo together. Aim for 7 minutes, leave 3 for questions. Full script: [`demo-script.md`](demo-script.md).

## The opening: act it out (20 seconds)

**Who:** one teammate plays Kevin (with a phone), one plays his mother. Paveesh stands to the side. Slide 1 is on screen.
1. Kevin's phone pings. He reads aloud: *"Hotel job in Canada. Salary 3,000 dollars. Pay the Rs 50,000 processing fee today to secure your place."*
2. Kevin turns to his mother: *"Ma, to kapav pret mwa Rs 50,000?"* *(Kreol draft: Paveesh corrects it.)*
3. She reaches for her purse.
4. Paveesh steps in: **"Stop. Before she pays, let's check."**

Then Paveesh says:
> "This is Kevin. He's 24, from Triolet. This happens in Mauritius: about twenty people say one fake recruiter cheated them. Verifye is what Kevin opens before the money moves."

**If the skit isn't rehearsed, say this alone instead:**
> "This is Kevin. He's 24, from Triolet. On WhatsApp he gets a hotel job in Canada. To secure his place, he has to pay a Rs 50,000 processing fee, today. His mother is asked to lend it. Would you pay?"

## The one line (say it at the start and at the end)

> "Before you pay, Verifye checks the law, the official lists and the link, in Kreol. *Verifye avan ou peye.*"

## 3 numbers to remember

| Number | What it is | Source |
|---|---|---|
| **Rs 50,000 asked, Rs 0 owed** | By law the employer pays the fee | Regulations 2025, reg 7(2)(e); Act 2023, s.5 |
| **About 20 people, Rs 296,000** | Reported cases of one fake recruiter; four complainants | Radio One, 25 Aug and 7 Sep 2026 (allegations) |
| **79 agencies, 21 banks and payment apps** | What the app checks against, each with its date | Ministry list of 4 Nov 2026; Bank of Mauritius list |

## The order (7 minutes)

| Time | Slide | Who | The point |
|---|---|---|---|
| 0:00 | 1 Kevin | Two teammates act it; Paveesh steps in | "Stop. Before she pays, let's check." |
| 0:30 | 2 Problem | Paveesh | The answer exists in the law; nobody checks at the moment of paying |
| 1:15 | 3 Demo | Jayesh drives, Paveesh talks | Job offer → Stop · call the official number · fake bank link → Stop · real code SMS → no false alarm · try to break it · online check |
| 5:15 | 4 Data | Adiyen | Real, official, dated; no AI verdicts |
| 5:45 | 5 Impact | Paveesh | Who runs it, who pays, how it reaches people |
| 6:30 | 6 Surprise card + next | Paveesh | Fail safe; then the closing line |

## Words to use, and words to avoid

- **Say:** "Every check works on the phone, offline. Online adds live link checks, reports from other phones and a Kreol voice. The server keeps no message."
- **Never say:** "no server", "nothing leaves the phone", "safe", "scam", "we tested with users", "partnered with".
- **Say instead of "partnered":** "built on their public data".

## The 6 hardest questions

1. **"You reused an old project, didn't you?"**
   "The idea, yes: the organisers approved a rebuild. Every line we submit was written this weekend. At 02:55 our old server was added to the repo. We saw it broke the start-from-empty rule, wrote a new server from scratch that night, and removed the old one at 06:58. It's all in our decision log and the README."
2. **"Did you test it with real users?"**
   "Not with outside users, and we won't claim we did. We tested the release builds on two real phones, Android 14 and 16. User tests are step 1 of our pilot."
3. **"Why no AI?"**
   "No AI model decides a result, so every warning points to a rule or an official record anyone can check. The only AI service is the optional Kreol voice."
4. **"What data do you collect?"**
   "For the checks, none: they run on the phone. The online check is optional; the server uses the message in memory for one request and never stores it. A report keeps a fingerprint, never the words."
5. **"How do you make money?"**
   "Free for users: no ads, no data sold. Fraud costs banks and the state money, so they'd fund it: a sponsored pilot, then our checks licensed into banking apps. Nobody has signed."
6. **"What if it's wrong?"**
   "It never says 'safe'. The lowest result is 'No warning signs found – still check', always with the official number. And wrong input never gets a result at all: that's our surprise card."

## If something breaks

- **App or server fails:** "Here is the same flow recorded this morning." Play the video. Don't debug on stage.
- **Online card doesn't appear in 5 seconds:** "Everything you saw ran offline; the online card is in the video." Move on.
- **A judge's own message gives an odd result:** say what it should show, and explain in Q&A.

## Before going on stage

- [ ] Phone: charged, bright, silent, Phone app as default dialler, old FraudLens app removed.
- [ ] App on the Check tab, English, History cleared, welcome page and tour already done. **Online checks switch OFF** for the first part of the demo, ON for the online step.
- [ ] Demo messages in the notes app, in order.
- [ ] Server running on Jayesh's laptop; phone on USB or hotspot; Online check card seen once.
- [ ] Backup video open and paused.
- [ ] Each person knows their slide, and one question they answer.
