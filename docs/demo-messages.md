# Demo messages (PROJECT.md §9)

**All messages are fictional**, written for the demo. Real banks and agencies are named only to show the official checks. The app says "Listed, but this does not prove the message is from them". It never says an agency sent a message.

The texts are **exactly** the ones in B's engine tests (`src/engine/__tests__/engine.test.ts`), so what we show on stage is what is tested. Change a text here and there together. Airplane mode is on for the whole demo.

| Step | What we show | Expected |
|---|---|---|
| 1 | Job offer WhatsApp → X-Ray → Job check | **STOP** |
| 2 | What to do now: dialler + share preview + save | (same case) |
| 3 | Follow-up: new cost on the saved case | **STOP** |
| 4 | Bank lookalike link | **STOP** |
| 5 | Real bank one-time-code SMS | **NONE** ("No warning signs found – still verify") |
| 6 | Our sources panel | (counts and dates) |

## 1. Job offer → STOP
> Bonjour Kevin! THINK RECRUITMENT LTD here. Hotel job in Canada, salary CAD 3,000. To secure your place, pay the processing fee of Rs 50,000 today by Juice. Urgent, only 2 places left.

- X-Ray highlights "processing fee" (job fee) and "Urgent" (pressure to act fast).
- Job check: the app suggests **THINK RECRUITMENT LTD** from the register. Pick it, then pick the cost **Processing fee**.
- The result says "THINK RECRUITMENT LTD is listed for jobs abroad … Listed, but this does not prove the message is from them", and that the processing fee is paid by the employer, not the worker (Private Recruitment Agencies Regulations 2025, reg 7(2)(e)). **Stop.**
- Why: a job fee the employer should pay is a STOP rule. THINK RECRUITMENT LTD is in the Ministry list of 4 Nov 2026, page 7, licensed for jobs abroad and valid until 21 Apr 2029.

## 2. What to do now (same case)
- **Call the official number:** the dialler opens with the register number **+230 5256 8074**, never a number from the message. Don't press call.
- **Ask someone you trust:** the share preview goes "to Mum". Don't send.
- **Save to history:** the case is saved only because we tap Save.

## 3. Follow-up: a new cost → STOP
> They now want Rs 15,000 for the air ticket.

- Reopen the saved case (same agency) and pick the cost **Round trip air tickets**.
- The result says air tickets are paid by the employer (reg 7(2)(a)). **Stop.**

## 4. Bank lookalike link → STOP
> MCB: Unusual activity on your account. Verify your account at mcb-login-secure.net or it will be blocked.

- X-Ray: the link is not MCB's official website, and there's an alarm about your account.
- mcb-login-secure.net is not mcb.mu, the domain on the Bank of Mauritius list of licensees. **Stop.**
- What to do now: MCB's official number **+230 202 6060** (from mcb.mu), never one from the message.

## 5. Real bank code SMS → NONE
> MCB: Your OTP for the online payment of Rs 1,250.00 at DARTY is 482913. Never share this code with anyone, including MCB staff.

- **No warning signs found – still verify.** A code sent *to* you with "never share" is not a request for a code. This shows the app doesn't cry wolf.

## 6. Our sources
- Open **Our sources**: 79 agency licences (Ministry list of 4 Nov 2026), 8 fee rules (Act 2023 s.5, Regulations 2025 reg 7(2)), 18 banks and 3 payment providers (Bank of Mauritius), 21 FSC alerts, 5 CERT-MU security alerts. Each one has its date and link.

## Backup messages (if the jury asks for more)
- **Kreol job fee:** "Bonzour, nou ena travay dan lotel Kanada. Saler 90,000 par mwa. Bizin peye fre dosie Rs 45,000 avan vandredi." → **STOP** (in B's Kreol/French tests).
- **FSC firm:** "Earn 5% per day with AI trading on mornefundvex.net, join now!" → **STOP**, FSC alert of 30 Jun 2026.
- **CERT-MU campaign:** "Happy Divali! Divali Cash Gift of Rs. 2,000 for you. View Now: bit.ly/divali-gift" → **CAREFUL**, CERT-MU alert of 30 Oct 2026.
