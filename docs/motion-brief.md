# Motion brief: scanner, stamp and button press (Person D → Jayesh)

**From:** Paveesh (D) · **Date:** Sat 14 Nov 2026 · **For:** Jayesh's Claude, on Jayesh's laptop (it has the keys, the build tools and the phone).
**Status:** REQUEST. Write the motion plan first, wait for Paveesh's or Jayesh's OK, then build.
**Priority:** this comes **after** removing the old `backend/` folder (Open item in `decisions.md`). Polish must not delay that.

---

## 1. How to work

- Use the skills **/impeccable animate**, **/apple-motion** and **/apple-design** together. Take only the **motion principles** from the Apple skills. The Android structure stays Material: 48 dp touch targets, and the system Back button always works.
- Build on a **separate branch** (for example `c/motion`), like `c/tabs-widget`, so `main` stays releasable. Merge only when it's tested on the phone.
- **React Native's built-in `Animated` API only. No new packages.** `useNativeDriver: true`. Animate **transform and opacity only**.
- **Don't change any logic, texts or colours.**
- Order of work: **motion plan → OK → build → tests, typecheck and lint → APK → phone test.**

## 2. What to build, in this order (lowest risk first)

### Step 1: Buttons (about 15 minutes)
- Scale to **0.97** on press-in (100 ms), and back on release.
- Do it once, in the shared button component, so every button gets it.

### Step 2: Stamp, on the Result (about 30 minutes)
- The verdict word goes from scale **1.35 to 1** with a decelerating curve: `Easing.bezier(0.16, 1, 0.3, 1)`, about **400 ms**, **no bounce**.
- Then the findings fade up **12 px** with a **60 ms** stagger, **240 ms in total at most** (cap it when there are many findings).
- **Play it only for a new result.** Reopening a case from History, or coming back from the Job check, shows the Result with no animation.

### Step 3: Scanner, from Check to Result (about 1 hour; drop it if it isn't working on the phone by 09:00)
- A **4 px `#F2C230` line** sweeps **once** over the message while the 4 sources tick off: Ministry register, fee rules, Bank of Mauritius, FSC/CERT-MU.
- **800 ms or less in total.** If it feels slow in rehearsal, cut it to 500 ms.
- **Tapping anywhere skips straight to the Result. Never block input.**
- **Only from the Check button.** Shared messages, the widget and Shield alerts go straight to the Result.

## 3. Rules that protect what already works

1. **Surprise card:** tapping during the sweep, or panic-tapping Check, must still open **exactly one** Result. Add a test: 6 fast taps during the sweep → 1 Result.
2. **Wrong input** (empty, random typing) never starts the scanner: it shows the amber "Please check your text" box as today.
3. **Reduce motion** (`AccessibilityInfo.isReduceMotionEnabled`): no movement at all, a **150 ms crossfade** only.
4. **Granny mode:** no scanner, and the stamp is a simple 150 ms fade. Older users get the answer immediately.
5. All existing tests keep passing (127 at 06:35), plus typecheck and lint.

## 4. Gates (freeze is 10:00, decision 22)

| Time | Must be true | If not |
|---|---|---|
| 08:00 | Buttons and stamp work on the phone | Ship buttons only |
| 09:00 | Scanner works on the phone | Drop the scanner |
| 09:30 | Branch merged, tests green, APK built | Don't merge; demo the current build |
| 10:00 | Freeze. Paveesh runs the quick test on the phone | — |

## 5. How Paveesh will test it on the phone

- Tap during the scan → it skips straight to the Result.
- Tap Check 6 times fast → one Result.
- Phone setting "Remove animations" on → nothing moves, only a short fade.
- Granny mode on → no scanner.
- Open a saved case from History → no stamp animation.
- Back button works at every moment, including mid-animation.
