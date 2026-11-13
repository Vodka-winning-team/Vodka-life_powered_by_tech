# Proposal: opt-in automatic checking on Android ("Shield", switch off by default)

**From:** Paveesh (D) · **Date:** Fri 13 Nov 2026, 20:40 · **Status:** **AGREED at 21:01** by A, B, C and D (decision 15 in `decisions.md`). Texts: [`strings-shield.md`](strings-shield.md).
Shield was cut at 16:05 (decision 5). This brings it back **only as an opt-in switch**, and only if the gates below pass. Features 1–8, share-in and **the surprise card work (decision 14)** come first.

---

## 1. The idea in 4 lines

1. A switch on the Scan screen: **"Check new WhatsApp and SMS messages automatically (Android)"**. It's **off** by default.
2. When it's on, each new WhatsApp or SMS notification is run through the **same engine** on the phone.
3. Stop or Be careful → the app posts **"Warning signs found. Tap to see why."** No warning signs → it stays silent.
4. Tapping the alert opens the normal **Result** screen with that message. Job check, call, share and save all work as today.

**Why:** Kevin doesn't have to think of checking. The warning reaches him before he pays. On stage, a teammate sends the fake job offer by WhatsApp and the alert appears without anyone touching the phone.

## 2. What does NOT change

- Same rules, same levels, same wording ("Warning signs found", never "scam" or "safe").
- **Nothing is saved and nothing leaves the phone.** The notification text is checked in memory and then forgotten. History is still saved only when the user taps Save.
- Off by default. Turning it on is a short setup, each step explained in plain words:
  1. **Our explanation screen:** what the app reads (new WhatsApp and SMS notifications only), and that nothing is saved or sent.
  2. **Android's "Notification access" screen:** the user switches Verifye on.
  3. **Allow notifications** (Android 13 and later), so Verifye can show its alert.
  4. **Battery: "Unrestricted"** for Verifye. Some phones (Xiaomi, Oppo, some Samsung battery savers) otherwise stop background apps. Our screen opens the right settings page.
  5. **A reminder to keep message previews on in WhatsApp** (WhatsApp → Settings → Notifications → "Show preview"). Without previews, the notification has no text to check.
- It reads **WhatsApp and SMS app notifications only**. Every other app's notifications are ignored without being read.
- **Android only.** The switch is hidden on iPhone and the web.

## 3. Gates (all must pass, or we don't build it)

| Gate | When | If not |
|---|---|---|
| A, B and C vote yes | by 23:00 | Not built; slide 6 line only |
| The surprise card app work (tap guard, "paste the whole message", skipped Job check) is done | before work starts | Surprise card first |
| The APK builds on the demo phone (it can't run in Expo Go) | by 23:00 | Not built; slide 6 line only |
| Share-in from WhatsApp is done first (part of feature 1, never cut) | before work starts | Share-in first |
| Shield works on the APK | **03:00, hard stop** · ✅ **passed 22:33** (real WhatsApp test on the release APK) | Removed; slide 6 line only |

It is **never in the main demo path**. It's the last 20 seconds of the demo, and it's also recorded in the backup video in case it fails live.

## 4. Who does what (if voted yes)

| Time | Who | Step | Done when |
|---|---|---|---|
| ✅ done 21:04 (commit 5aec588) | **Pushkar (B)** | Pure function in the engine, so it's testable without a phone: `shouldAlert(appPackage: string, text: string): { alert: boolean; level: Level }`. It returns `alert: true` only for an allowed package (list below) **and** a STOP or CAREFUL result from `check()`. Jest tests: demo 1 → alert STOP; demo 5 → no alert; any other package → no alert; empty text → no alert. | `npm test` green |
| 23:30–02:30 | **Pushkar (B)**, in C's `src/` and `app.json` **only with Jayesh's yes on the board** | The Android part (section 5). | The alert works on the APK |
| 23:00–00:00 | **Paveesh (D)** | Wording for the switch, the explanation screen and the alert in English, French and Kreol, sent to Jayesh; a decision-log line; a slide line; a demo step | Texts on the board |
| 02:30–03:00 | **Paveesh (D)** | The quick test (section 6) on 2 phones | Pass or fail logged |
| 03:00 | **All** | **Checkpoint:** works on the APK? If not, remove it. | |

## 5. How the Android part works

- **Android's notification-reading service:** the app registers a notification listener (`NotificationListenerService`). The user grants it in Android Settings → Notification access. Our explanation screen opens that page.
- **Library, or our own module:** first try `react-native-android-notification-listener` (npm, version 5.0.1). **Warning:** its last release was December 2022, so it may not work with our React Native 0.88. Give it **30 minutes at most**. If it fails, write a small local Expo module (`npx create-expo-module --local`): one Kotlin class extending `NotificationListenerService` that sends `{ package, title, text }` to JavaScript, plus the service entry in the Android manifest.
- **Allowed packages:**
  - WhatsApp: `com.whatsapp`, `com.whatsapp.w4b`
  - SMS: `com.google.android.apps.messaging`, `com.samsung.android.messaging`
  - Debug builds only: `com.android.shell`, for the quick test in section 6
- **Ignore:** group summary notifications ("3 new messages"), and repeats of the same text within 1 minute.
- **Posting the alert:** use `expo-notifications`. Android 13 and later asks for permission to show notifications, once, when the switch is turned on. Tapping the alert opens `/result` with the text. Use the same entry as share-in, so share-in and Shield share one path into the app.
- **What we read:** the data behind the notification, not what's shown on the screen. Read the message text from the notification's extras: `android.messages` (WhatsApp's chat-style notifications, one entry per message) first, then `android.bigText`, then `android.text`. That usually gives the **whole message**, even when the phone shows it shortened. Only extremely long messages may be cut by the sending app; the engine says so (`message_truncated`).
- **Known limits, which we say openly.** Even with every permission on:

  | Case | What happens | What we do |
  |---|---|---|
  | The offer is an **image or a voice note** (job flyers often are) | No text to read | Share-in or paste stays the way in; the setup screen says so |
  | **WhatsApp previews are off** | The notification says only "New message" | Setup step 5 asks to keep previews on |
  | The chat or WhatsApp is **muted** | No notification, nothing to read | None: share-in or paste |
  | Kevin **already has that chat open** | WhatsApp shows no notification | None needed: he's reading it |
  | **One-time-code** messages on Android 15 and later | Android hides them from apps like ours | Little harm: these are mostly real bank code SMS, which give no warning anyway |
  | Phones that **stop background apps** | The listener can be stopped | Setup step 4 (battery "Unrestricted") |
  | **iPhone** | Apple doesn't allow it | Switch hidden; share-in or paste |
  | The **job check** | Needs the agency and the cost from Kevin | The alert opens the full check |

  **In short:** with the setup done, it catches most **text** messages on most Android phones. Share-in stays essential for images, voice notes and muted chats.

## 6. Making it quick to test (no second phone, no WhatsApp needed)

1. **Engine, no phone:** `npm test` runs the `shouldAlert` tests (section 4) in seconds.
2. **Fake a notification from the laptop.** Connect the phone by USB and run:
   ```
   adb shell cmd notification post -S bigtext -t "THINK RECRUITMENT" demo1 "Bonjour Kevin! THINK RECRUITMENT LTD here. Hotel job in Canada, salary CAD 3,000. To secure your place, pay the processing fee of Rs 50,000 today by Juice. Urgent, only 2 places left."
   ```
   Expect the Verifye alert within 2 seconds. Repeat with demo message 5 and expect **no** alert. (This works only in debug builds, because `com.android.shell` is allowed there.)
3. **"Send test alert" button**, debug builds only, under the switch. It runs demo message 1 through the same handler and posts the alert, so the alert → tap → Result path can be tested without notification access.
4. **Once at the end:** a real WhatsApp message from a teammate's phone to the demo phone.

## 7. Demo (adds about 20 seconds, at the very end)

> Jayesh's phone sends the fake job offer on WhatsApp → the demo phone shows **"Warning signs found. Tap to see why."** → tap → Result: **Stop – high risk**.
> *"And if Kevin turns it on, he doesn't even need to copy the message. It's his choice, and nothing is saved."*

## 8. Decision

- [x] Paveesh (D) agrees
- [x] Adiyen (A) agrees (in person, 21:01, reported by Paveesh)
- [x] Pushkar (B) agrees (in person, 21:01, reported by Paveesh)
- [x] Jayesh (C) agrees (in person, 21:01, reported by Paveesh)

**Decision log line (D adds it with the real time once all agree):** *"Shield comes back as an opt-in switch, off by default, Android APK only, WhatsApp and SMS notifications only, nothing saved; gated on the APK by 23:00 and a hard stop at 03:00."*
