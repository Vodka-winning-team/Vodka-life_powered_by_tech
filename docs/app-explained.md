# How Verifye works (1-page cheat sheet for the jury Q&A)

**One line:** Verifye checks a suspicious message on the phone, offline, against fixed rules and official Mauritian records, and tells you what to do next. No AI model, no server.

## The flow (what happens when you tap "Check message")

```
Scan screen ──text──► engine.check(text, jobAnswers) ──► CheckResult ──► Result screen
 (paste, share-in,        pure TypeScript, src/engine/       level + findings      banner, X-Ray highlights,
  or Shield alert)        rules + A's 5 data files           + official contacts   findings with source + date
```

1. **Input:** pasted text, a message shared from WhatsApp/SMS (*share-in*), or a tap on a Shield alert. All three go to the same `runCheck()` in `src/lib/store.tsx`.
2. **Engine** (Pushkar, `src/engine/`): pure TypeScript, no phone code, so it is tested without a phone (`npm test`, 100+ tests). It finds links, amounts, bank names, agency names and the warning-sign phrases (EN/FR/Kreol), then applies the **level rule**:
   - **STOP** if any: asks for a code/PIN · link is not the official site of the bank named · a job fee the employer must pay (Act 2023 s.5, Regs 2025 reg 7(2)) · matches an FSC alert.
   - **Be careful** if other warning signs. **No warning signs found – still verify** otherwise (never "safe").
3. **Data** (Adiyen, `app/src/main/assets/data/`): 5 JSON files built from official PDFs/pages, every row with `source_url` + `snapshot` date. Bundled in the app, so it works in airplane mode.
4. **Result** (Jayesh, `src/app/result.tsx`): shows the level, the message with highlights, each finding with its source and date, then *What to do now* (official number only, share a summary, report).

## The app's parts (Jayesh, `src/`)

| Part | File | What to say |
|---|---|---|
| Screens | `src/app/*.tsx` (Expo Router: one file = one screen) | Scan, Result, Job check, What to do now, History, Our sources, Official numbers, Shield setup |
| Shared state | `src/lib/store.tsx` | current case, history (saved **only when you tap Save**), language, Shield and Granny settings, saved on the phone with AsyncStorage |
| UI building blocks | `src/components/ui.tsx` | Button, Card, Label, banner, highlights; every size and colour comes from `src/constants/theme.ts` |
| Texts | `src/constants/strings.ts`, `finding-texts.ts` | every word on screen in EN/FR/Kreol; a test fails if "safe/genuine/scam/illegal" appears |
| Share-in | `src/components/share-in.tsx` (library `expo-share-intent`) | WhatsApp → Share → Verifye → Result |
| Shield | `modules/fraudlens-shield/` (Kotlin) + `src/components/shield-watcher.tsx` | opt-in; reads **only** WhatsApp/SMS notifications, only after you allow it in Android settings; `engine.shouldAlert()` decides; nothing saved or sent |
| Granny mode | `src/hooks/use-look.ts` | one switch: 1.4× text, bigger buttons, no grey text, Call button first |

## Surprise card ("survive wrong input, skipped steps, panic-tapping")

- **Panic-tapping:** every button ignores a 2nd tap within 1 s → one check, one save, one call, one screen.
- **Wrong input:** empty / 2 letters / emojis → "Paste the whole message to check it", never a result. A 200,000-character paste is checked (first 20,000) and says so.
- **Skipped steps:** skipping Job check or pressing Back never turns a warning into "No warning signs".
- **Errors:** the engine never crashes; on an internal error it says "We couldn't check this message" (Be careful).

## Likely questions, short answers

- **"Where's the AI?"** None on purpose (decision 2): rules plus official records, so every warning can be explained and traced to a source. AI tools were used to *build* it (README "AI tools").
- **"What if the data is out of date?"** Every record shows its date on screen ("Our sources"). Updating = re-run A's scripts on the new PDF and rebuild. Automatic updates are the "what's next" slide.
- **"Does it read my messages?"** Only what you paste or share. Shield is off by default; when on, it reads WhatsApp/SMS notification text on the phone, checks it, and keeps nothing.
- **"Why should I trust 'listed'?"** We never say "genuine": "Listed, but this does not prove the message is from them", plus the number from the official list to call.
- **"Does it work on any phone?"** Android 8+ APK (64- and 32-bit), offline; iPhone and web through Expo (no share-in/Shield there).
- **"What did you build in 24 hours?"** All code from scratch from 12:30 (commit history); the engine, data scripts, app, Shield module and tests.
