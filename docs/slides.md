# Pitch slides: draft (6 slides max)

*Drafted by Pushkar's Claude at 20:15 because D is missing (request from Jayesh on the board). D owns this file: change anything. Every number below has a checked source (links in `README.md` "Problem" and `docs/sources.md`). The demo messages are fictional.*

---

## 1. Kevin's story
**Kevin, 24, from Triolet**, gets a WhatsApp message: a hotel job in Canada. To "secure his place" he must pay a **Rs 50,000 processing fee today**. He asks his mother to lend it.

*Would you pay?*

Speaker note: 30 seconds, no technical words. End with the question.

---

## 2. The problem in numbers
- Radio One, 25 Aug 2026: **about twenty Mauritians** say one fake recruiter of jobs abroad cheated them (allegations, not convictions).
- Radio One, 7 Sep 2026: **four complainants, Rs 296,000** in total; one paid **Rs 50,000** for a job in Dubai.
- Ministry of Labour communiqué, 28 Apr 2022: warning against **fake recruitment agencies** offering jobs abroad.
- MAUCORS 2025: **913** of 6,073 reported incidents were scams and fraud.
- The law: **no agency or employer may charge a worker a recruitment fee** (Private Recruitment Agencies Act 2023, s.5). Processing, visa, passport, work-permit and air-ticket costs are the **employer's** (Regulations 2025, reg 7(2)).

Speaker note: the answer already exists in the law and in the official register. Nobody checks it at the moment of paying.

---

## 3. Live demo: FraudLens Moris, *Verifye avan ou peye*
Airplane mode **on** the whole time.
1. Paste Kevin's (fictional) message → X-Ray highlights "processing fee", "Rs 50,000", "today".
2. Job check: the agency is **listed** for jobs abroad, but *"this does not prove the message is from them"*. The processing fee is the **employer's** (reg 7(2)(e)) → **Stop – high risk**.
3. What to do now: call the agency on the **register's** number, never the one in the message; share a summary with Mum.
4. Fake MCB message with `mcb-login-secure.net` → **not MCB's official website** (mcb.mu, Bank of Mauritius list) → MCB's official number.
5. A real MCB code SMS → **No warning signs found – still verify**. No false alarm.

Speaker note: if the phone fails, play the 2-minute backup video.

---

## 4. Our data: real, official, dated
| Data | Records | Source |
|---|---|---|
| Recruitment agencies | 79 licences (12 for jobs abroad) | Ministry of Labour register, 4 Nov 2026 |
| Who pays recruitment costs | 8 rules | Act 2023 s.5, Regulations 2025 reg 7(2) |
| Banks and payment apps | 18 banks + 3 payment providers | Bank of Mauritius list, 13 Nov 2026 |
| Investment warnings | 21 organisations | FSC investor alerts, 2017–2026 |
| Security alert campaigns | 5 alerts | CERT-MU, Feb–Oct 2026 |

Every warning in the app shows its source and date. No personal names stored. No AI model: clear rules that anyone can check. 96 engine tests, including every demo message you just saw.

---

## 5. Impact: who runs it, cost, reach
- **Who could run it:** the Ministry of Labour's Recruitment Licence Unit and CERT-MU, which already publish this data. We'd propose a handover; there is no partnership today.
- **Cost:** Rs 0 to run. No server, works offline; keeping the data fresh takes a person a few hours a month.
- **Reach:** jobseekers and their families, through employment information offices, bank branches and community groups; works on Android, iPhone and the web.
- **What we'd measure in a pilot:** how many users call the official number before paying. We don't claim losses prevented.

---

## 6. Surprise card + what's next
- **Surprise card:** *"Survive a user doing the wrong thing: wrong input, skipped steps, panic-tapping."*
  - Our key flow: **Scan → Result → Job check → What to do now**.
  - **Fail safe:** empty, garbage or broken input never shows "No warning signs found". One action per tap. Skipped steps never give a green light.
  - Tested with 500 random messages, a 200,000-character paste and 20 repeated taps.
  - *(You just saw it live: the "try to break it" minute.)*
- **What's next:**
  - **Arnak? Live:** a warning that appears *during* a call when a bank app is opened.
  - Updating the data automatically from the official sources.
  - A full Kreol voice mode.
  - **Shield (opt-in, Android):** check new WhatsApp and SMS messages automatically, if the user turns it on. Nothing saved.

Speaker note: finish with "Verifye avan ou peye."
