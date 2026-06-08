# Get ViralSnap on the Google Play Store (Windows)

Step-by-step guide to build the Android app on your PC and publish it to Google Play. Total time: ~3–6 hours, mostly downloads + Google's review.

---

## Part A — One-time setup on your PC (~1 hour)

Install these. Reboot if asked.

1. **Git for Windows** — https://git-scm.com/download/win
2. **Node.js LTS** — https://nodejs.org
3. **Bun for Windows** — open PowerShell:
   ```powershell
   powershell -c "irm bun.sh/install.ps1 | iex"
   ```
4. **Android Studio** — https://developer.android.com/studio (lets the wizard install the Android SDK)
5. **Java JDK 17** — bundled with Android Studio. Install from https://adoptium.net if `bunx cap sync` complains.

After installing, **close and reopen PowerShell**.

---

## Part B — Push code from Lovable to GitHub (~5 min)

In Lovable:
1. Bottom-left of chat → **+** → **GitHub** → **Connect project**
2. Authorize the Lovable GitHub app
3. Create the repo, copy the URL (e.g. `https://github.com/yourname/viralsnap.git`)

---

## Part C — Get the code on your PC (~5 min)

```powershell
cd Desktop
git clone https://github.com/yourname/viralsnap.git
cd viralsnap
bun install
```

---

## Part D — Build the Android project (~10 min)

```powershell
bun run build
bun run assets:generate
bunx cap add android
bunx cap sync
bunx cap open android
```

First open of Android Studio takes 2–5 minutes (downloads more SDK pieces, indexes). Wait until **"Gradle sync finished"**.

---

## Part E — Generate a signing key (do this ONCE, ever)

This key proves future updates come from you. **Lose it = you can never update your app.** Back it up.

In Android Studio:
1. **Build** → **Generate Signed App Bundle / APK**
2. **Android App Bundle** → Next
3. "Key store path" → **Create new**
4. Fill in:
   - Path: somewhere safe, **NOT inside the project folder** (e.g. `C:\Keys\viralsnap.jks`)
   - Password: strong, save in a password manager
   - Key alias: `viralsnap1`
   - Validity: 25 years
5. OK → **Next** → choose **release** → **Create**

After ~1 minute, locate the `.aab` file (`app-release.aab`). That's what you upload.

---

## Part F — Upload to Play Console (~30 min + review time)

1. https://play.google.com/console → **Create app** → name **ViralSnap**
2. Complete the left sidebar:
   - **App content** — privacy policy URL (`https://viralsnap.online/privacy`), data safety, target audience, content rating, **account deletion URL** (`https://viralsnap.online/account-deletion`)
   - **Store listing** — short + full description, screenshots, feature graphic (1024×500), app icon
   - **Category**: Social or Entertainment
3. **Closed testing** first (recommended) → **Create new release** → upload your `.aab`
4. Release notes → **Save** → **Review release** → **Start rollout**

First review usually takes **2–7 days**.

---

## Part G — For every future update

Easy path: just run the bundled script:

```powershell
cd Desktop\viralsnap
.\build-aab.ps1
```

It pulls the latest code, rebuilds web + native assets, bumps `versionCode`, and produces a signed `.aab` ready to upload.

Manual path:

```powershell
cd Desktop\viralsnap
git pull
bun install
bun run build
bun run assets:generate
bunx cap sync
```

Then in Android Studio: bump `versionCode` in `android/app/build.gradle` (1 → 2 → 3…), Build → Generate Signed App Bundle → same keystore from Part E.

---

## Common gotchas

- **Privacy policy + account deletion URLs** — must be public. ViralSnap already ships `/privacy`, `/terms`, `/account-deletion`, `/dmca`, `/refunds`, `/guidelines`, and `/contact`. Keep the app published so they're reachable.
- **Custom domain (`viralsnap.online`)** — `capacitor.config.ts` loads the live SSR site so the WebView hydrates correctly. Keep that domain live.
- **Test on your phone before publishing** — plug your Android phone in via USB with USB debugging on, click the green ▶ in Android Studio. Catches bugs before wasting a week of Google's review.
- **In-app purchases & Google Play policy** — ViralSnap sells digital goods (ViralSnap Pro, ViralCoins, gifts) through Stripe. Google Play generally requires **Google Play Billing** for in-app digital purchases. Two common compliant approaches: (a) keep all purchases on the web outside the app, or (b) integrate Google Play Billing for in-app purchases. Review Play's Payments policy before submitting to avoid rejection.
- **Stripe go-live** — complete Stripe go-live in your live account so real payments work before launch.
