# Recomp — Muscle & Fat Loss

**Build muscle. Support fat loss. Recover well.**

[![Version](https://img.shields.io/badge/version-1.0.0-d4f77d?style=flat-square)](./package.json)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](./LICENSE)
[![Expo](https://img.shields.io/badge/Expo-SDK%2057-000020?style=flat-square&logo=expo&logoColor=white)](https://docs.expo.dev/versions/v57.0.0/)
[![React Native](https://img.shields.io/badge/React_Native-0.86-61DAFB?style=flat-square&logo=react&logoColor=white)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?style=flat-square&logo=typescript&logoColor=white)](./tsconfig.json)
[![NativeWind](https://img.shields.io/badge/NativeWind-v4-38BDF8?style=flat-square&logo=tailwindcss&logoColor=white)](https://www.nativewind.dev/)
[![Platforms](https://img.shields.io/badge/platforms-Android%20%7C%20iOS%20%7C%20Web-526C36?style=flat-square)](#platform-support)

Recomp is an MIT-licensed, open-source workout app that combines structured resistance training, manageable conditioning, and recovery guidance. It is designed as a starting program for someone with **6+ months of consistent lifting**, with offline-first progress tracking and a four-week training cycle.

[Getting started](#getting-started) · [Training program](#training-program) · [Local images](#local-exercise-images) · [Development](#development-and-quality-checks) · [Troubleshooting](#troubleshooting)

> **Project status:** Working local app. TypeScript checks, 15 automated tests, Expo Doctor (21/21 checks), and web/Android bundle exports have passed during development. Physical-device verification remains pending. The badges above describe the project; they are not live CI results.

## Contents

- [Features](#features)
- [Technology stack](#technology-stack)
- [Platform support](#platform-support)
- [Prerequisites](#prerequisites)
- [Getting started](#getting-started)
- [Available commands](#available-commands)
- [Training program](#training-program)
- [Screens and navigation](#screens-and-navigation)
- [Local exercise images](#local-exercise-images)
- [Project structure](#project-structure)
- [Architecture and persistence](#architecture-and-persistence)
- [Configuration and app identity](#configuration-and-app-identity)
- [Development and quality checks](#development-and-quality-checks)
- [Builds and distribution](#builds-and-distribution)
- [Troubleshooting](#troubleshooting)
- [Limitations and planned extensions](#limitations-and-planned-extensions)
- [Contributing](#contributing)
- [License](#license)
- [References](#references)

## Features

| Area             | Included                                                                                     |
| ---------------- | -------------------------------------------------------------------------------------------- |
| Training plan    | Four upper/lower lifting sessions, two conditioning sessions, and Sunday rest                |
| Progression      | Stable four-week exercise blocks, rep targets, rest periods, and reps-in-reserve guidance    |
| Recovery         | A lighter fourth week with fewer sets and no automatic load increase                         |
| Exercise library | 188 uniquely identified exercise entries across the original muscle-group pools              |
| Workout tracking | Per-exercise completion, skipped sessions with reasons, session progress, and weekly history |
| Exercise details | Equipment, sets, reps or duration, short technique cues, and personal notes                  |
| Local assets     | Replaceable exercise photos with missing-image placeholders                                  |
| Settings         | Circuit timing, reminder toggle, week advancement, and confirmed resets                      |
| Reminders        | Local notifications Monday–Saturday at 8:00 AM in device time                                |
| Interface        | Dark theme, responsive layouts, large touch targets, and simple tab navigation               |
| Persistence      | On-device storage, ordered writes, validation, and save-error retry                          |

No sign-in, backend server, API key, or cloud account is required for the app's core features.

## Technology stack

Versions below reflect the project configuration, not a recommendation to install the newest release independently.

| Technology             | Version / configuration | Purpose                        |
| ---------------------- | ----------------------- | ------------------------------ |
| Expo                   | SDK 57 (`^57.0.26`)     | App tooling and native modules |
| React Native           | `0.86.3`                | Native UI                      |
| React                  | `19.2.0`                | Component model                |
| Expo Router            | `~57.0.24`              | File-based routing             |
| TypeScript             | `~5.9.2`, strict mode   | Type safety                    |
| NativeWind             | `^4.2.7`                | Utility-based styling          |
| Tailwind CSS           | `^3.4.17`               | Styling configuration          |
| AsyncStorage           | `2.2.0`                 | Local persistence              |
| Expo Notifications     | `~57.0.21`              | Local workout reminders        |
| Node test runner + tsx | See lockfile            | Logic and persistence tests    |

Use [package.json](./package.json) for declared ranges and [package-lock.json](./package-lock.json) for the exact dependency tree.

## Platform support

| Platform | Development path                                          | Current verification                                  |
| -------- | --------------------------------------------------------- | ----------------------------------------------------- |
| Web      | Expo dev server or exported single-page app               | Browser flows and phone-width layouts checked         |
| Android  | SDK-compatible Expo Go or a native development build      | Bundle export passed; physical-device checks pending  |
| iOS      | Compatible simulator client or a native development build | Bundle export passed; simulator/device checks pending |

Local reminders are unavailable on web and in Android Expo Go. Android Expo Go cannot load this notification setup because Expo Go removed Android push-notification support; use a native development build or installed app to enable reminders. Local scheduled notifications work in supported native builds and do not require a remote push server. Installed native release builds can run offline. The web version has no service worker or offline PWA support and needs its hosting server for initial loading.

## Prerequisites

### All platforms

- **Node.js 22.13.0 or newer** is required by Expo SDK 57. Node 24 is a suitable development choice. See the [SDK 57 release notes](https://expo.dev/changelog/sdk-57).
- **npm**, included with Node.js.
- **Git** to clone the repository.
- Internet access for the initial dependency installation.

Check your tools:

```sh
node --version
npm --version
git --version
```

### Native development

- **Android:** Android Studio, Android SDK and platform tools, a compatible JDK, and either a configured emulator or a USB-debugging-enabled device.
- **iOS:** macOS, Xcode and its command-line tools, plus the native dependencies required by Expo. Local iOS builds cannot run on Windows or Linux.
- For a physical device connecting to Metro over LAN, keep the device and computer on the same reachable network.

Follow Expo's [environment setup guide](https://docs.expo.dev/get-started/set-up-your-environment/) for the platform-specific SDK/JDK/Xcode installation steps.

## Getting started

### 1. Get the code

```sh
git clone https://github.com/rajjitlai/Recomp.git recomp-workout
cd recomp-workout
```

The repository is public and MIT-licensed. Anyone can clone it without requesting access. If you already have the checkout, open a terminal in the repository root instead.

### 2. Install dependencies

```sh
npm ci
```

Use `npm ci` for a reproducible installation from the committed lockfile. Use `npm install` when intentionally changing dependencies, and commit the updated lockfile with those changes.

No `.env` file, database provisioning, or backend configuration is needed.

### 3. Start the web preview

```sh
npm run web
```

Open the URL printed by Expo, usually `http://localhost:8081`. The CLI may choose or request a different port if that one is occupied.

### 4. Run on a phone or emulator

```sh
npm start
```

With a compatible client available, scan the QR code or use the terminal shortcuts:

| Key | Action                                          |
| --- | ----------------------------------------------- |
| `a` | Open on an Android emulator or connected device |
| `i` | Open the iOS Simulator on macOS                 |
| `w` | Open the web preview                            |

**Expo Go must support SDK 57.** Do not assume the current app-store version matches this project. Check the [Expo Go compatibility guidance](https://docs.expo.dev/troubleshooting/expo-go-version-mismatch/) and [available Expo Go builds](https://expo.dev/go). A native development build is the more reliable route for verifying app-specific native behavior.

### 5. Optional: create a native development client

The repository does not currently include `expo-dev-client`. To adopt it:

```sh
npx expo install expo-dev-client
npx expo run:android
```

On macOS, use this instead for iOS:

```sh
npx expo run:ios
```

These commands add dependencies and generate native projects when needed. Review those changes before committing. After installing the development client, later development sessions can use:

```sh
npx expo start --dev-client
```

Rebuild the native client after changing native dependencies, config plugins, display names, or URL schemes. See [Expo development builds](https://docs.expo.dev/develop/development-builds/introduction/).

## Available commands

| Command                          | Purpose                                                       |
| -------------------------------- | ------------------------------------------------------------- |
| `npm start`                      | Start Metro and the Expo development server                   |
| `npm run web`                    | Start the browser preview                                     |
| `npm run android`                | Start Expo and open Android; does not compile an APK          |
| `npm run ios`                    | Start Expo and open iOS Simulator; does not compile an IPA    |
| `npm run typecheck`              | Run strict TypeScript checks                                  |
| `npm test`                       | Run the automated test suite                                  |
| `npm run images`                 | Generate the local image registry from existing files         |
| `npm run export:web`             | Export the web app to `dist/`                                 |
| `npx expo start --clear`         | Restart Metro with a cleared bundler cache                    |
| `npx expo install --check`       | Check dependency alignment with the Expo SDK                  |
| `npx expo export --platform all` | Export web and native JavaScript/assets; not installable apps |

## Training program

### Weekly schedule

| Day       | Session          | Exercises | Rounds                       |
| --------- | ---------------- | --------- | ---------------------------- |
| Monday    | Upper A · Build  | 7         | Strength sets                |
| Tuesday   | Lower A · Build  | 6         | Strength sets                |
| Wednesday | Move + Recover   | 6         | 2                            |
| Thursday  | Upper B · Build  | 6         | Strength sets                |
| Friday    | Lower B · Build  | 6         | Strength sets                |
| Saturday  | Condition + Core | 9         | 3; reduced to 2 in week four |
| Sunday    | Rest             | —         | —                            |

Both upper sessions cover chest, back, and shoulders. Both lower sessions cover quads, hamstrings, glutes, and calves. The 188-entry library is broader than the curated exercise selection used by the current program.

This program supersedes the original body-part split and weekly exercise replacement described in [Agent.md](./Agent.md). The original algorithm remains in the codebase to restore legacy plans.

### Four-week progression

| Block week | Intent                                   | Prescription                                                                     |
| ---------- | ---------------------------------------- | -------------------------------------------------------------------------------- |
| 1          | Establish repeatable technique and loads | Normal working sets; approximately 3 good reps left                              |
| 2          | Build repetitions                        | Normal working sets; approximately 2 good reps left                              |
| 3          | Continue measured progression            | Normal working sets; approximately 2 good reps left                              |
| 4          | Reduce fatigue                           | One fewer set per strength exercise, minimum one; approximately 3 good reps left |

Normal strength prescriptions use 2–3 working sets, exercise-specific rep ranges, and 75–120 seconds of rest. Warm-up sets are additional. Exercise selection stays consistent within each four-week block and changes at the next block boundary.

Blocks follow the stable calendar week ID, not the install date. Starting the app mid-block does not automatically begin at week one.

**Double progression:** reach the top of the rep range on every working set with good form and the target effort, then add the smallest available weight next session. During week four, keep or reduce the load and reassess progression at normal volume. Completion checkboxes never trigger load increases.

### Conditioning and fat-loss guidance

- Default circuit timing: **40 seconds work, 20 seconds transition, 90 seconds between rounds**; adjustable in Settings.
- Keep a conversational pace instead of treating every circuit as an all-out HIIT session.
- Use marching for high knees and standing heel curls for butt kicks; jumping is not required.
- The in-app guide covers sustainable calorie deficit, protein-containing meals, walking, and recovery. It does not calculate personalized calorie targets or calories burned.
- Short circuits alone are not presented as satisfying the general adult target of 150 minutes of moderate aerobic activity per week.

General principles draw on [ACSM resistance-training guidance](https://acsm.org/resistance-training-guidelines-update-2026/) and [CDC activity and weight guidance](https://www.cdc.gov/healthy-weight-growth/physical-activity/). The specific split and four-week structure are app programming choices. Outcomes vary; this is general training guidance, not individualized medical or nutrition advice.

### Missed workouts and holidays

Open a workout, select **Skip workout**, choose Holiday, Travel, Rest, Busy, or Other, and confirm. Skipped sessions appear on Home, Train, and History with their reason. They do not count as completed; any exercises already checked off remain saved and visible.

Select **Reopen workout** to remove the skip and continue the session. Completion controls are disabled while a session is skipped. Completed sessions cannot be marked skipped.

The schedule remains calendar-based: skipping does not shift other sessions, add catch-up workouts, pause the four-week block, or increase prescribed training. For a multi-day holiday, mark each affected session individually. Unmarked days remain incomplete; the app never guesses that you skipped. Reminders remain active until disabled in Settings. Skip reasons and timestamps persist locally across restarts.

## Screens and navigation

| Route            | Screen                                                |
| ---------------- | ----------------------------------------------------- |
| `/`              | Dashboard, today's workout, and weekly progress       |
| `/train`         | Current training week                                 |
| `/workout/[day]` | Exercise list, prescriptions, and completion controls |
| `/exercise/[id]` | Exercise image, technique cues, notes, and completion |
| `/history`       | Saved weekly activity                                 |
| `/settings`      | Timing, reminders, program controls, and resets       |
| `/library`       | Full exercise catalog                                 |
| `/program`       | Muscle-building, fat-loss, and recovery guide         |

Workout and exercise routes can include a `week` query parameter to display the corresponding saved program. Exercise routes also accept a `day` parameter for workout-specific prescriptions.

## Local exercise images

Exercise images are supplied locally. No exercise photos are downloaded automatically. Until photos are added, the app shows designed placeholders.

1. Find an exercise in [assets/exercises/manifest.json](./assets/exercises/manifest.json).
2. Copy the image into the listed directory using the listed filename stem.
3. Use a lowercase `.jpg`, `.jpeg`, `.png`, or `.webp` extension.
4. Regenerate the registry and restart Metro.

```sh
npm run images
npx expo start --clear
```

Example asset:

```text
assets/exercises/chest/barbell-bench-press.jpg
```

Asset folders:

```text
assets/exercises/
├── back/
├── biceps/
├── cardio/
├── chest/
├── legs/
├── shoulders/
├── traps/
├── triceps/
└── manifest.json
```

The script writes literal `require()` entries into `src/data/imageRegistry.ts`, which Metro can bundle. It only registers files that exist. If multiple supported extensions share a stem, the first match wins in this order: JPG, JPEG, PNG, WebP.

Optimize dimensions and file size before adding assets. Missing or failed images fall back to a placeholder. Rebuild/re-export after changing assets intended for an installed or hosted release.

`imageRegistry.ts` is generated: manual edits are overwritten by `npm run images`. When adding entirely new exercises, also update the corresponding data pool and manifest entry. The image script does not regenerate the manifest itself.

## Project structure

```text
recomp-workout/
├── assets/exercises/         # Local photos and filename manifest
├── scripts/
│   └── sync-images.cjs       # Static image-registry generator
├── src/
│   ├── app/                  # Expo Router screens
│   │   ├── (tabs)/           # Home, workout overview, history, settings
│   │   ├── exercise/[id].tsx
│   │   ├── workout/[day].tsx
│   │   ├── library.tsx
│   │   └── program.tsx
│   ├── components/           # Shared UI and exercise/workout cards
│   ├── context/              # Hydration, state, and calendar refresh
│   ├── data/
│   │   ├── exercises/        # Typed exercise pools
│   │   ├── exerciseFactory.ts
│   │   ├── exerciseTypes.ts
│   │   ├── imageRegistry.ts  # Generated local asset references
│   │   ├── recomposition.ts  # Current program slots
│   │   └── workoutPlans.ts   # Legacy split metadata
│   └── services/             # Rotation, persistence, and reminders
├── tests/                    # Program and persistence tests
├── Agent.md                  # Original project brief
├── app.json                  # Expo application configuration
├── babel.config.js
├── global.css
├── metro.config.js
├── package.json
├── package-lock.json
├── tailwind.config.js
└── tsconfig.json
```

## Architecture and persistence

### Data flow

```text
Exercise catalog + program slots
              ↓
Deterministic weekly plan
              ↓
Workout context → screens and completion actions
              ↓
Validated state → ordered save queue → AsyncStorage
```

- **Generation:** `generateWeeklyWorkout(weekNumber)` is a pure function. Week IDs count local calendar Mondays from January 6, 2020; four-week blocks select curated exercise variants.
- **Legacy support:** `generateClassicWeeklyWorkout()` retains the original seeded pool rotation. It is used for legacy plan restoration and has separate test coverage.
- **State:** `reduceData()` handles completion, notes, resets, timing, and week advancement independently of UI components.
- **Hydration:** saved data is validated before use. Current/future untouched legacy weeks migrate to the new program; started legacy weeks and old history are retained.
- **Saving:** writes are serialized so rapid taps cannot overwrite newer state with an older snapshot. Failed saves show a retry banner; unreadable data is not silently erased.
- **Calendar refresh:** the app checks date changes while open and on return to the foreground.

### What stays on the device

Completion marks, skip reasons and timestamps, workout history, notes, settings, the week offset, and saved plan data use AsyncStorage. Exercise assets are bundled locally. Local notifications do not require a remote push server.

There is no cloud sync, account system, or backup/export feature. AsyncStorage is not an encrypted secrets store. Clearing app/browser storage or uninstalling the app can remove progress. On web, different origins or ports have separate storage.

### Settings behavior

| Action                  | Effect                                                                                            |
| ----------------------- | ------------------------------------------------------------------------------------------------- |
| Regenerate current week | Retains the existing saved plan and completion; creates the deterministic plan if absent          |
| Start a new week        | Increases the persistent calendar offset by one; does not force an exercise change within a block |
| Reset selected workout  | Clears completion for the chosen day in the active week                                           |
| Reset all history       | Clears all completion/history; keeps notes, plans, and settings                                   |
| Change circuit timing   | Updates circuit work, transition, and between-round durations                                     |
| Toggle reminders        | Requests native permission when enabling and schedules/cancels local reminders                    |

Reset and week-control actions use confirmation dialogs. Automatic calendar advancement continues to include the saved manual offset.

## Configuration and app identity

The app icon is configured from `assets/logo.png` for iOS and Android. Android uses it as the adaptive icon foreground over the app's charcoal background. The web app uses the PNG as its favicon. If you replace the image, rebuild the native app to update its installed launcher icon; a Metro refresh alone does not update an already-installed binary.

| Setting                 | Value / location                     |
| ----------------------- | ------------------------------------ |
| Display name            | `Recomp — Muscle & Fat Loss`         |
| Project slug / npm name | `recomp-workout`                     |
| Version                 | `1.0.0`                              |
| Main entry              | `expo-router/entry`                  |
| Primary deep link       | `recomp://`                          |
| Legacy deep link        | `formworkout://`                     |
| Android package         | `com.rajjitlaishram.recomp`                   |
| iOS bundle identifier   | `com.rajjitlaishram.recomp`                   |
| Storage key             | `form-workout:v1`                    |
| Web output              | `single` — a single-page application |
| Environment variables   | None required by application code    |

The legacy native identifiers and storage key are intentional: they preserve the installed app identity and saved progress after the rename from Form. Change them only when intentionally creating a separate app identity or designing a data migration.

Branding and native configuration live in `app.json`; visual tokens and content scanning live in `tailwind.config.js`. NativeWind uses the Babel preset, Metro integration, and `global.css`.

Previously scheduled reminders receive the new Recomp wording after reminders are disabled and enabled again in Settings. Native name and deep-link changes require a rebuilt app.

## Development and quality checks

Run before submitting changes:

```sh
npm run typecheck
npm test
npm run export:web
```

For native bundle validation:

```sh
npx expo export --platform all
```

### Automated coverage

The current 11-test suite checks:

- Catalog completeness and unique exercise IDs.
- Counts, muscle coverage, and deterministic legacy rotation across 200 weeks.
- Recent-repeat avoidance and eventual legacy pool coverage.
- Current upper/lower balance and conditioning constraints.
- Four-week exercise consistency and reduced fourth-week volume.
- Preservation of started/older legacy plans during migration.
- Monday boundaries, year transitions, and week-ID round trips.
- Save/reload, notes, settings, undo, and targeted resets.
- Invalid-data rejection and serialized-write failure recovery.

No CI workflow is currently configured. Run these checks locally; badge colors do not indicate automated build status.

### Manual verification

Before distributing a native release, verify on real devices:

- [ ] Fresh installation and return launch.
- [ ] Completion and notes persist after force-close/reopen.
- [ ] Installed release launches offline.
- [ ] Notification permission granted/denied and 8 AM reminder delivery.
- [ ] Date rollover and foreground resume behavior.
- [ ] Small-screen layout, safe areas, keyboard, and accessibility controls.
- [ ] Real images and missing-image fallback.
- [ ] Reset confirmations and legacy-data migration with realistic saved data.

Previously verified browser flows include navigation, matching workout/detail prescriptions, completion across reloads, history, and canceling a destructive-action confirmation. Native bundle export is not a substitute for device testing.

## Builds and distribution

### Web export

```sh
npm run export:web
```

The generated `dist/` directory contains the production web assets. To preview with single-page routing:

```sh
npx serve -s dist
```

This preview command may install the `serve` utility on first use. A hosting provider must serve assets normally and fall back to `index.html` for client-side routes such as `/workout/monday`. See [Expo website publishing](https://docs.expo.dev/guides/publishing-websites/). No hosting deployment is configured in this repository.

### Native bundle export

```sh
npx expo export --platform android --output-dir dist-android
npx expo export --platform all
```

These commands validate and export JavaScript/Hermes bundles and assets. They **do not produce APK, AAB, or IPA installers**.

### Installable releases

This repository includes an EAS preview profile that creates an installable Android APK. From the project root, authenticate with Expo and build it with:

```bash
npx eas-cli login
npx eas-cli build --platform android --profile preview
```

On the first build, EAS may ask you to link the project and create Android signing credentials. Download the completed APK from the build page or CLI link, install it on a physical Android device, and verify the release checklist above before publishing it as a GitHub Release. Increment `android.versionCode` in `app.json` for each subsequent APK release so Android can install updates over the previous version.

The `production` profile keeps EAS's default Android App Bundle output for a future Google Play release. An APK is suitable for GitHub direct downloads and sideloading; Google Play distribution uses an AAB. Store listing, privacy information, and submission automation are not configured. This README does not imply the app is published in a store.

## Troubleshooting

| Problem                                                  | What to check                                                                                            |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `npm` points to a missing global installation on Windows | Use the direct Node/npm command below, then repair the local npm launcher separately                     |
| Expo Go says the project is incompatible                 | Update Expo Go and confirm the project uses SDK 57-compatible dependencies, or build a native development client |
| Android emulator is not found                            | Start an emulator in Android Studio and verify the SDK/platform tools setup                              |
| iOS launch fails on Windows                              | Use Android/web locally; local iOS compilation requires macOS and Xcode                                  |
| Phone cannot reach Metro                                 | Check the printed server address, shared network, and local firewall rules; try an emulator or USB setup |
| Port 8081 is occupied                                    | Use `npx expo start --port 8082`; remember that web storage is origin-specific                           |
| Styling is stale                                         | Restart with `npx expo start --clear`; check the NativeWind Babel/Metro setup and `darkMode: "class"`    |
| Exercise photos are missing                              | Check manifest paths, lowercase extensions, run `npm run images`, then restart Metro                     |
| A removed photo causes a bundling error                  | Regenerate `imageRegistry.ts` so it no longer requires the removed file                                  |
| Workout progress appears missing on web                  | Check whether the browser profile, hostname, port, or stored site data changed                           |
| A save-error banner appears                              | Keep the app open and retry; check available device/browser storage                                      |
| Saved-data loading fails                                 | Retry without clearing storage; unsupported/corrupt data is intentionally not overwritten                |
| Exercise selection did not change after advancing a week | Selection stays stable inside the four-week block by design                                              |
| Reminder toggle is disabled                              | Reminders are unavailable on web and Android Expo Go; verify them in a native development or installed build |
| Reminder text still says Form                            | Disable and enable reminders again to reschedule their content                                           |

If PowerShell cannot run the npm launcher, try the Windows command shim from the repository root:

```powershell
npm.cmd ci
npm.cmd run web
```

If `npm.cmd` is not available, repair the Node.js installation or its PATH entry, then open a new terminal. Avoid copying machine-specific installation paths into project commands.

For dependency mismatches, first inspect:

```sh
npx expo install --check
```

If alignment is needed, `npx expo install --fix` changes dependencies and the lockfile. Review the result and rerun the checks. Avoid upgrading React Native independently of the Expo SDK.

## Limitations and planned extensions

**Current limitations:** exercise photos have not been supplied; device testing is pending; no cloud backup, account system, offline web install, automatic weight/repetition logging, or personalized calorie calculation is implemented.

Possible future extensions, **not current features**, include load/repetition tracking, custom programs, progress charts, backup/export, and optional synchronization. The present architecture keeps exercise data, training logic, persistence, and UI separate to support later development.

## Contributing

Contributions are welcome. Read [CONTRIBUTING.md](./CONTRIBUTING.md) for the development workflow and submission guidelines. Use [GitHub Issues](https://github.com/rajjitlai/Recomp/issues) for reproducible bugs and feature proposals.

1. Create a focused branch from the current project baseline.
2. Keep exercise definitions and program selection out of UI components.
3. Preserve deterministic generation and explicitly test persistence migrations.
4. Update the manifest when adding image-backed catalog entries.
5. Run TypeScript, the test suite, and the relevant bundle export.
6. Include a concise description of behavior changes and validation in the pull request.

Do not commit credentials, signing files, generated exports, or `node_modules`. When generating native projects, deliberately choose whether to maintain those directories or regenerate them; the current checkout does not contain native `android/` or `ios/` projects.

## Credits

Recomp was made by **GPT-6 Astra**, with direction and feedback from **Rajjit Laishram**. See [Credit.md](./Credit.md) for the full attribution.

## License

Copyright (c) 2026 Rajjit Laishram. Licensed under the [MIT License](./LICENSE).

You may use, modify, and redistribute this project's code, including commercially, under the terms in `LICENSE`. Retain the copyright and license notice in copies or substantial portions of the software. The software is provided without warranty.

Third-party dependencies retain their own licenses. Only contribute exercise images that you own or have permission to redistribute, including any required attribution. No exercise photos are bundled yet.

The `private: true` field in `package.json` prevents accidental npm publication; it does not make the GitHub repository private or restrict the MIT license.

## References

- [Expo SDK 57 release notes](https://expo.dev/changelog/sdk-57)
- [Expo environment setup](https://docs.expo.dev/get-started/set-up-your-environment/)
- [Expo development builds](https://docs.expo.dev/develop/development-builds/introduction/)
- [NativeWind installation](https://www.nativewind.dev/docs/getting-started/installation)
- [ACSM resistance-training guidance](https://acsm.org/resistance-training-guidelines-update-2026/)
- [CDC activity and weight guidance](https://www.cdc.gov/healthy-weight-growth/physical-activity/)

---

**Recomp** · Consistent training. Measured progression. Sustainable habits.
