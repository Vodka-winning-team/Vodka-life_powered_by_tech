# Arnak? Live: how to win

**Our app:** stops a scam *during* the phone call.
**Our user:** Mrs Devi, 68, banks on her phone.
**Deadline:** Sat 12:30. Late = not judged.

---

## Rules: stay safe

- [ ] Write all code fresh. Copy nothing from FraudLens or `E:\Hackathon`.
- [ ] Repo is public. Commit every hour or so.
- [ ] README lists every AI tool used and what it did.
- [ ] Our dataset must make the app work, not just sit on a slide.
- [ ] Everyone can explain every part of the app.
- [ ] Never save, report or blacklist a caller's number. Only check: is it saved in contacts? Only match banks and companies, never people.

---

## How to score on each judging point

### 1. Working solution
- Demo: a teammate calls from an unknown number, Mrs Devi opens MCB Juice, and the stop screen appears.
- Practise the demo 3+ times.
- Record the backup video as soon as it works.

### 2. Dataset doing real work
- The app list in the dataset decides which apps count as "bank apps".
- The stop screen shows the bank's **real number** and a **"Call [bank] now"** button.
- If the caller's number is a real bank number, show "This number belongs to MCB".
- Show in the app: *"Data checked 13 Nov 2026, source: Bank of Mauritius"*.

### 3. Innovation
- Other tools act *after* the scam. Ours acts *during the call*.
- Key line: **"It works with every Mauritian bank app today, because it needs nothing from the bank."**
- Wow moment: the Kreol voice line on the stop screen.

### 4. Real-world impact (one slide)
- **Who runs it:** CERT-MU or the Mauritius Bankers Association.
- **Cost:** Rs 0. No server.
- **How people get it:** bank branches, pension pay-out points, senior citizens' clubs.

### 5. Easy to use
- Big text ("grandma mode").
- 3-step setup.
- Kreol, French and English.
- Test it with a real older person tonight, even by phone. Tell the jury what we changed after.

### 6. Surprise card
- Keep all text in `strings.xml` so adding a language is fast.
- Keep sizes and colours in one theme file so accessibility changes are fast.
- The app already works offline.
- Make the change visible on screen and give it its own slide.

### 7. Pitch (max 6 slides)
1. Mrs Devi's story
2. The problem (Mauritian scam numbers from CERT-MU)
3. Live demo
4. Our data and where it came from
5. Impact and cost
6. Surprise card + what's next

### 8. Tech quality
- Clear commit messages.
- Split the code into: `CallWatcher`, `DangerRules`, `StopScreen`, `BankDirectory`.
- One test: every dataset row has a source and every number starts with +230.
- Write each decision in the decision log **with the real time**, as it happens.

---

## Don't

- Add too many features. Finish the must-haves first.
- Use fake or placeholder data.
- Say "for everyone in Mauritius". Always say Mrs Devi.
- Add the surprise card at the last minute.
- Skip sleep and food.

---

## Key times

| Time | Goal |
|---|---|
| Fri 18:00 | Stop screen works on the demo phone |
| Fri 22:00 | Full flow works with real data |
| Sat 08:00 | Stop adding features. Everyone explains a part they didn't build. |
| Sat 10:00 | Slides, video and README ready |
| Sat 12:00 | Submit (by 12:30 at the latest) |
