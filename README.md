# Form. — weekly training

An offline-first React Native / Expo app built from `Agent.md`. It includes the full exercise catalog, a fat-loss and muscle-gain program with four-week training blocks, completion tracking, exercise notes, history, circuit timing, and local workout reminders on Android/iOS.

## Run

Requires Node.js 20.19+ (Node 24 used for development).

```sh
npm install
npm start
```

Use an Expo SDK 55 compatible development client / Expo Go, or press `a` for an installed Android emulator. `npm run web` starts the browser version. To run native development builds, use `npx expo run:android` or `npx expo run:ios` (iOS requires macOS).

If the Windows npm launcher points at a missing global npm install, the installed Node distribution can run npm directly:

```powershell
node 'C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js' run web
```

## Checks

```sh
npm run typecheck
npm test
npm run export:web
npx expo export --platform android --output-dir dist-android
```

Tests cover the complete exercise catalog, 200 legacy weekly plans plus recomposition blocks and migration checks, category counts, leg and circuit balance, recent repetition, complete pool coverage, Monday/year boundaries, save/reload, targeted resets, and serialized writes with failure recovery.

## Add your images

No exercise images are downloaded or generated. The app currently uses intentional placeholders. The complete filename/ID list is in `assets/exercises/manifest.json`.

1. Copy optimized JPG, JPEG, PNG, or WebP files into the matching folders under `assets/exercises/`.
2. Match the filename in the manifest (the extension may differ).
3. Run `npm run images` to generate Metro-compatible literal `require()` entries.
4. Restart Metro. Missing or unreadable images show a placeholder.

For example: `assets/exercises/chest/barbell-bench-press.jpg`. The same physical image can serve multiple exercise entries when a movement belongs to more than one pool. All entries have unique IDs scoped to their pool.

## Structure

- `src/data/exercises/`: all requested exercise lists, kept out of components.
- `src/data/exerciseFactory.ts`: typed metadata, equipment, repetition defaults, and short technique cues.
- `src/services/workoutRotation.ts`: pure deterministic generation and calendar helpers.
- `src/services/state.ts`: state transitions, schema validation, and ordered save queue.
- `src/services/storage.ts`: AsyncStorage adapter; versioned, app-specific storage key.
- `src/context/WorkoutContext.tsx`: hydration, local persistence, and automatic week rollover.
- `src/app/`: Expo Router dashboard, workouts, details, library, history, and settings.
- `src/components/`: reusable NativeWind UI.

## Fat loss + muscle gain program

The default was revised following the request to prioritize fat loss and muscle gain, for a user with 6+ months of consistent lifting. This intentionally supersedes the original fixed body-part split and weekly exercise replacement in Agent.md.

- Monday: Upper A (7 exercises).
- Tuesday: Lower A (6 exercises).
- Wednesday: Easy conditioning (6 movements, 2 rounds).
- Thursday: Upper B (6 exercises).
- Friday: Lower B (6 exercises).
- Saturday: Conditioning + core (9 movements, 3 rounds; 2 in the lighter week).
- Sunday: Rest.

Each upper session includes chest, back, and shoulders; both lower sessions cover quads, hamstrings, glutes, and calves. Strength slots use 2–3 working sets, movement-specific rep ranges, 75–120 seconds rest, and 2–3 reps in reserve. Main exercises stay stable for four calendar weeks. Week four reduces sets as a conservative recovery default; this is an app programming choice, not a requirement for every trainee.

Progression is double progression: reach the top of the prescribed rep range on every set with good form and the target effort, then add the smallest available weight next time. Completion checkboxes never trigger load increases. Notes can hold weights and reps; there is no automatic performance tracking or calorie-burn estimator.

Conditioning alternates movements without requiring jumps. High knees are performed as marching, and butt kicks as standing heel curls. Maintain a conversational effort and take extra rest as needed. The in-app guide explains sustainable energy deficit, protein-containing meals, recovery, and building toward the general adult target of 150 minutes of moderate aerobic activity. Circuits alone are not presented as meeting that target or guaranteeing fat loss.

General principles are informed by [ACSM resistance-training guidance](https://acsm.org/resistance-training-guidelines-update-2026/) and [CDC activity and weight guidance](https://www.cdc.gov/healthy-weight-growth/physical-activity/). Specific splits, set prescriptions, rep ranges, and block structure are implementation choices, not individualized medical or nutrition advice.

## Rotation and persistence

Week IDs count local calendar Mondays from January 6, 2020. The new program rotates curated movement slots at four-week boundaries. Results are deterministic. The original seeded weekly rotation remains available internally to restore legacy plans and is still tested.

Migration updates untouched current/future weeks. Already-started weeks and older history keep their legacy program and exercise membership. New weeks use the revised program. Regenerating a saved week keeps its plan and completion data. Starting a new week advances the persistent calendar offset; it does not force different exercises within a block.

Completion, notes, settings, history, and plans stay local. Writes are serialized; failed saves show retry, and unreadable saves remain untouched. Native installed builds work offline; the web preview needs its server and is not an offline PWA.

## Validation and remaining device checks

The web UI has been checked at phone width, including workout/detail navigation, completion across reloads, history, and canceling reset confirmation. TypeScript, automated tests, web export, and Android JavaScript/Hermes export are checked during implementation.

A bundle export is not a native device test. Still verify on a physical Android/iOS device: notification permission and 8 AM scheduling, app suspend/resume, keyboard behavior, safe areas, and installed-app offline launch. Reminder controls are intentionally unavailable on web. No exercise photos have been supplied yet.

Setup follows the [Expo SDK 55 documentation](https://docs.expo.dev/versions/v55.0.0/) and [NativeWind v4 installation guide](https://www.nativewind.dev/docs/getting-started/installation).
