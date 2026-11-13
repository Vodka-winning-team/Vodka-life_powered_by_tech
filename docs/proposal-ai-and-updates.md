# Proposal: AI pattern score, on-phone learning, data updates from GitHub

**From:** Jayesh (C) · **Date:** Fri 13 Nov 2026 · **Status:** PROPOSAL, needs A, B, C and D to agree
Nothing here is built until the team agrees. Only after the **23:00 checkpoint** passes. The core (features 1–8) always comes first.

---

## 1. The idea in 4 lines

1. **AI pattern score:** a small Naive Bayes model, trained on real public SMS datasets, scores how "scam-like" a message's words are.
2. **On-phone learning:** the user taps "This was a scam" / "This looked fine" and the model updates on that phone, offline.
3. **Data updates from GitHub:** when online, the app downloads newer data files (banks, FSC alerts, model) from our public repo. No server.
4. **Shared learning between phones:** **pitch only** (slide 6, "what's next"). Not built.

**The app still works 100% offline, in airplane mode, on any phone with Android 8+.** No new libraries.

---

## 2. What it does NOT change

- Rules still decide **STOP**. The AI score can only add a **Be careful** finding. It never says STOP on its own.
- "Your code is 123456, never share it" (demo message 5) must still give **No warning signs found**.
- No server, no API keys, no cloud AI. Nothing leaves the phone except the update check (a download from GitHub).
- No messages are stored for learning: only word counts, numbers removed.

---

## 3. How each part works

### 3.1 AI pattern score
- **Training data (real, public):**
  - UCI SMS Spam Collection, about 5,500 SMS (spam / not spam), CC BY 4.0: https://archive.ics.uci.edu/dataset/228/sms+spam+collection
  - Mendeley Data "SMS Phishing Dataset for Machine Learning and Pattern Recognition" (2022), about 6,000 SMS (smishing / spam / normal). **A: confirm the link and licence.**
- **Training:** once, on a laptop, in Python. Naive Bayes written by hand (~40 lines, no scikit-learn). Output: `model.json` (word counts), bundled in the APK.
- **On the phone:** pure Kotlin in the engine. Scores in milliseconds.
- **Shown as:** one more `Finding` with kind `ai_pattern`, level CAREFUL, the top scam words as highlights, and the datasets as its source.

### 3.2 On-phone learning
- Two buttons on the Result screen: **"This was a scam"** / **"This looked fine"**.
- The engine adds the message's word counts to the model. The app saves the updated `model.json` in app storage.
- Limits: numbers and links are removed before counting; at most 200 learned messages; a **Reset learning** button in settings (we press it before the demo).

### 3.3 Data updates from GitHub
- Files live on a separate **`data` branch** of this repo, so a half-finished commit on `main` never reaches phones.
- The app reads `version.json`. If the version is newer, it downloads the files, checks they are valid, then swaps them in. If anything fails, it keeps the current data. The built-in data is always the fallback.
- "Our sources" shows: *Data updated 14 Nov 2026, from our repo*.
- Uses Android's built-in downloader and the INTERNET permission (granted automatically).

### 3.4 Shared learning (pitch only)
Slide 6: *"Next: when online, phones share anonymous word counts, so one person's flag protects everyone. Run by CERT-MU."* Needs a server, privacy checks and anti-abuse rules, so not for this hackathon.

---

## 4. Contract changes (TASKS.md §2), A + B + C must agree

**New data file** `app/src/main/assets/data/model.json` (A writes it):
```json
{
  "version": 1,
  "snapshot": "2026-11-14",
  "sources": [{ "name": "UCI SMS Spam Collection", "url": "...", "licence": "CC BY 4.0" }],
  "messages": { "scam": 0, "ok": 0 },
  "words":    { "verify": [0, 0] }
}
```
`words` maps each word to `[count in scam messages, count in ok messages]`.

**Shared tokeniser** (Python and Kotlin must match exactly):
lowercase → strip accents → links become `<url>` → numbers become `<num>` → split on anything that is not a letter → drop words shorter than 2 letters.

**Engine (B):** new class, existing calls keep working.
```kotlin
class ScamModel {
    companion object { fun fromJson(text: String): ScamModel }
    fun score(text: String): Double              // 0.0 to 1.0
    fun topWords(text: String, n: Int = 3): List<String>
    fun learn(text: String, isScam: Boolean): ScamModel
    fun toJson(): String
}
class Engine(val data: DataSet, val model: ScamModel? = null)   // null = no AI finding
```
**Level rule addition:** `ai_pattern` finding only when `score >= threshold` (A + B tune it on the 6 demo messages and 15 test cases). It can raise NONE to CAREFUL, never to STOP.

**Update files (C):** `version.json` on the `data` branch:
```json
{ "version": 2, "updated": "2026-11-14", "files": ["banks.json", "fsc_alerts.json", "model.json"] }
```

---

## 5. Files that would change

| File | Change | Owner |
|---|---|---|
| `PROJECT.md` §3 "Not building" | Remove "AI/ML models" and "live learning"; add "cloud AI, shared learning" | D |
| `CLAUDE.md` "Rules that are easy to break" | "No AI/ML models, no server, no live lookups" → "Only the on-device Naive Bayes model; no server; only update downloads from our repo" | D |
| `docs/TASKS.md` §2 | Add `model.json`, `ScamModel`, `Engine(data, model)`, level-rule line, `version.json` | A + B + C |
| `docs/TASKS.md` §3–5 | New steps below | each person |
| `docs/TASKS.md` §7 cut order | New features cut **first**: updates → learning → AI score | D |
| `docs/decisions.md` | Log the decision with the time | D |
| `README.md` | Data sources (both datasets + licences), AI section (the model), how updates work | D |
| `data/scripts/train_model.py` | New: training script | A |
| `engine/` | New: `ScamModel.kt` + tests | B |
| `app/` | Result buttons, Reset learning, update check, "Data updated" line | C |
| `app/src/main/AndroidManifest.xml` | Add INTERNET permission | C |

---

## 6. Who does what, and when

| Time | Who | Step | Done when |
|---|---|---|---|
| 01:00–02:30 | **Adiyen (A)** | Download both datasets, `train_model.py`, write `model.json`, report accuracy | `model.json` pushed + accuracy noted |
| 02:30–04:00 | **Pushkar (B)** | `ScamModel` + tests: Kotlin score = Python score on 5 messages; demo message 5 stays NONE | Tests green |
| 03:00–05:00 | **Jayesh (C)** | Show `ai_pattern` finding; feedback buttons + saving; Reset learning; update check from the `data` branch | Works on the phone |
| 04:30 | **All** | **Checkpoint:** AI score on the phone? If not, **drop all of it**. | |
| by 07:00 | **D** | README, decision log, slide 6 text | Pushed |

About **5–6 hours of work in total**, spread over A, B and C's free slots. If someone is behind on the core, they skip this.

---

## 7. Demo (adds about 40 seconds)

1. Check a message → result shows **"AI pattern score: high"** with the words that triggered it.
2. Tap **"This was a scam"** → check a similar message → the score goes up. *"It learns on your phone. Your messages never leave it."*
3. (Optional, last, needs the hotspot) Push a new FSC alert to the `data` branch → **Check for updates** → the app now flags that firm. Also in the backup video in case the internet fails.

---

## 8. Decision needed

- [ ] Adiyen (A) agrees
- [ ] Pushkar (B) agrees
- [ ] Jayesh (C) agrees
- [ ] D agrees

**Decision log line (D adds it with the real time):** *"Added an on-device Naive Bayes score trained on public SMS datasets, on-phone learning and data updates from our repo; rules still decide STOP; shared learning is pitch-only."*
