# Proposal: Kreol voice, with an optional online switch ("Read aloud with myt AI")

**From:** Paveesh (D) · **Date:** Sat 14 Nov 2026 · **Status:** PROPOSAL. Nothing is built or decided. **Step 0 (a sound test) comes first.**
It builds on Jayesh's Read aloud button (00:35), which reads English and French with the phone's own voices. Kreol is the gap: phones have no Kreol voice, so Kreol is read with the French voice.

## 1. The idea in 4 lines

1. A setting, **off by default**, saved on the phone: **"Read aloud with myt AI (needs internet)"**.
2. When it's on and the language is Kreol, the **"Ekout"** (Listen) button sends **only our result text** (the level and the finding titles) to myt AI Cloud, Mauritius Telecom's text-to-speech service, and plays the audio.
3. **The user's message is never sent.** The checks still run on the phone, offline.
4. When the setting is off, or there's no internet, **Kreol read-aloud is off** (the button is hidden or says "Needs internet"). We don't read Kreol with a French voice. English and French keep the offline Read aloud.

## 2. Step 0: test before building (15 minutes)

One test call to `POST /v1/audio/speech` with model `myt/myt_tts`. The docs don't say whether it speaks Kreol, and they don't list the voice ids, the base URL, the price or the limits; those are inside the console (aiconsole.myt.mu), behind a login. Paveesh creates the key and runs the test. **The key is never pasted into the repo, the board or a chat.**

Test these three sentences and listen:
- "Aret. Pa peye. Apel nimero ofisiel la avan ou fer nanye."
- "Lalwa dir se patron ki peye sa fre la, pa ou."
- "Apel THINK RECRUITMENT lor 5256 8074."

Pass only if all four are true: it sounds like Kreol (not French reading Kreol); numbers and "Rs 50,000" are read properly; the audio comes back in under about 3 seconds; a parent would understand it the first time.

## 3. What we do after the test

| Test result | Plan |
|---|---|
| Kreol sounds natural | Build the switch (section 4). |
| Kreol sounds off, or it's slow | Drop myt AI. **Plan B: 3–4 recorded Kreol clips** in a team member's voice, one per level, bundled in the app: offline, free, and every current claim stays true. |
| No key or voice id within 30 minutes | Plan B. |

## 4. How it would be built (only if the test passes)

- **A small relay (Cloudflare Worker)** holds the API key as a secret and forwards the request. The key is never in the app or in git. The relay accepts only short texts and only our endpoint.
- **App (Jayesh's folder):** the setting, the "Ekout" button state, playing the audio, and a calm message on any error (no internet, 401, 429 budget exceeded, timeout). Never a crash.
- **Texts** in `strings.ts` (EN/FR/Kreol), written by D.
- **Time:** about 1.5–2 hours plus one more APK build, before the 07:00 freeze. If it isn't working on the APK by 05:00, it's dropped.

## 5. What changes in what we claim (D updates these only if it's built)

- "Nothing leaves the phone" → "Your message never leaves the phone. Optional: Kreol read-aloud sends only our result text to myt AI."
- "No server" → "No server for the checks." (The relay is a small server.)
- "Rs 0 to run" → "Rs 0 for the core app; the optional voice has a small usage cost."
- Decision 3 (no server) gets a new decision that amends it, with the time.

## 6. Risks

- **The demo would need internet.** The venue network has already blocked us once. It goes in the backup video, and is never in the main demo path.
- **The service is in beta and has a budget limit.** An error mid-pitch must show a message, not break the result.
- **Judges may ask why an offline app calls a server.** Answer: it's optional, off by default, and never sends the user's message. All three must be visibly true in the app.

## 7. Decision

- [ ] Step 0 test result (Paveesh): ______
- [ ] Adiyen · [ ] Pushkar · [ ] Jayesh agree to build it (only after a passed test)
