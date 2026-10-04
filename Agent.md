# AGENTS.md

## 1. Project Overview

Build a **Gym Exercise & Weekly Workout Rotation App** using:

* React Native
* Expo
* TypeScript
* NativeWind / TailwindCSS
* Expo Router
* Local image assets
* AsyncStorage for local persistence

The application generates a structured **Monday–Saturday workout plan** and automatically rotates exercises every week while preserving the user's workout split.

The user will provide the exercise images. The application must therefore use a clean local asset structure where images can easily be replaced or added.

---

# 2. Core Weekly Split

The default weekly schedule is fixed:

| Day       | Workout            |
| --------- | ------------------ |
| Monday    | Chest + Triceps    |
| Tuesday   | Back + Biceps      |
| Wednesday | Legs               |
| Thursday  | Shoulders + Traps  |
| Friday    | Arms + Accessories |
| Saturday  | Cardio Circuit     |
| Sunday    | Rest               |

### Exercise distribution

Most resistance-training days use:

**6 major-muscle exercises + 3 minor-muscle exercises**

Exception:

**Wednesday — Legs: 6 exercises**

Saturday uses:

**9 cardio/bodyweight exercises × 3 rounds**

---

# 3. Weekly Exercise Rotation

The application must NOT display exactly the same exercises every week.

Instead, maintain a large exercise pool for each muscle group and automatically select a different combination every week.

Example:

```text
Week 1:
Bench Press
Incline Dumbbell Press
Incline Barbell Press
Machine Chest Press
Cable Fly
Pec Deck

Week 2:
Flat Dumbbell Press
Decline Barbell Press
Incline Dumbbell Fly
Cable Crossover
Chest Dips
Push-Ups
```

Rotation must:

1. Keep the same muscle-group split.
2. Keep the required number of exercises.
3. Prefer exercises that were not used in the previous week.
4. Avoid repeating the same exercise in consecutive weeks.
5. Avoid excessive repetition across recent weeks.
6. Eventually cycle through the entire available exercise pool.
7. Produce deterministic results for a given week so the plan does not randomly change every time the app opens.

Use a deterministic seed based on:

```text
currentWeekNumber
```

or another stable weekly identifier.

---

# 4. Workout Database

Create strongly typed exercise data.

Example:

```ts
export type ExerciseCategory =
  | "chest"
  | "triceps"
  | "back"
  | "biceps"
  | "shoulders"
  | "traps"
  | "quads"
  | "hamstrings"
  | "glutes"
  | "calves"
  | "cardio"
  | "core";
```

Exercise interface:

```ts
export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  secondaryCategories?: ExerciseCategory[];
  type: "strength" | "cardio" | "core";
  equipment?: string;
  sets?: number;
  reps?: string;
  duration?: string;
  image: any;
}
```

Keep exercise data separate from UI components.

Recommended structure:

```text
src/
├── data/
│   ├── exercises/
│   │   ├── chest.ts
│   │   ├── triceps.ts
│   │   ├── back.ts
│   │   ├── biceps.ts
│   │   ├── shoulders.ts
│   │   ├── traps.ts
│   │   ├── legs.ts
│   │   └── cardio.ts
│   ├── workoutPlans.ts
│   └── exerciseTypes.ts
│
├── services/
│   ├── workoutRotation.ts
│   └── storage.ts
│
├── components/
│   ├── ExerciseCard.tsx
│   ├── WorkoutCard.tsx
│   ├── ExerciseImage.tsx
│   ├── ProgressBar.tsx
│   └── DaySelector.tsx
│
├── app/
│   ├── index.tsx
│   ├── workout/
│   ├── exercise/
│   └── history/
│
└── assets/
    └── exercises/
```

---

# 5. Complete Exercise Database

## Chest

Add all of the following:

```text
Barbell Bench Press
Incline Barbell Bench Press
Decline Barbell Bench Press
Flat Dumbbell Press
Incline Dumbbell Press
Decline Dumbbell Press
Dumbbell Fly
Incline Dumbbell Fly
Cable Crossover
High-to-Low Cable Fly
Low-to-High Cable Fly
Pec Deck
Machine Chest Press
Incline Machine Press
Decline Machine Press
Push-Ups
Wide-Grip Push-Ups
Diamond Push-Ups
Chest Dips
Dumbbell Pullover
```

---

## Triceps

```text
Triceps Pushdown
Rope Pushdown
Straight-Bar Pushdown
Reverse-Grip Pushdown
Overhead Cable Extension
Overhead Dumbbell Extension
Skull Crushers
EZ-Bar Skull Crushers
Dumbbell Skull Crushers
Close-Grip Bench Press
Bench Dips
Triceps Dips
Dumbbell Kickbacks
Cable Kickbacks
Single-Arm Pushdown
Single-Arm Overhead Extension
JM Press
```

---

## Back

```text
Deadlift
Romanian Deadlift
Conventional Deadlift
Sumo Deadlift
Rack Pull
Pull-Ups
Chin-Ups
Wide-Grip Lat Pulldown
Close-Grip Lat Pulldown
Reverse-Grip Lat Pulldown
Neutral-Grip Pulldown
Barbell Row
Pendlay Row
T-Bar Row
Dumbbell Row
Single-Arm Dumbbell Row
Chest-Supported Row
Seated Cable Row
Close-Grip Cable Row
Machine Row
Inverted Row
Straight-Arm Pulldown
Dumbbell Pullover
Face Pull
```

---

## Biceps

```text
Barbell Curl
EZ-Bar Curl
Dumbbell Curl
Alternating Dumbbell Curl
Incline Dumbbell Curl
Hammer Curl
Cross-Body Hammer Curl
Preacher Curl
Preacher Hammer Curl
Concentration Curl
Cable Curl
Rope Cable Curl
Bayesian Curl
Spider Curl
Reverse Curl
Zottman Curl
Drag Curl
Machine Biceps Curl
Single-Arm Cable Curl
```

---

## Shoulders

```text
Barbell Overhead Press
Dumbbell Shoulder Press
Arnold Press
Machine Shoulder Press
Smith Machine Shoulder Press
Push Press
Dumbbell Lateral Raise
Cable Lateral Raise
Machine Lateral Raise
Leaning Cable Lateral Raise
Front Dumbbell Raise
Front Plate Raise
Cable Front Raise
Rear Delt Dumbbell Fly
Cable Rear Delt Fly
Reverse Pec Deck
Bent-Over Rear Delt Raise
Upright Row
Face Pull
```

---

## Traps

```text
Barbell Shrugs
Dumbbell Shrugs
Smith Machine Shrugs
Cable Shrugs
Behind-the-Back Shrugs
Farmer's Walk
Rack Pull
Face Pull
```

---

# 6. Legs

Legs are limited to **6 exercises per workout**.

### Quads

```text
Barbell Squat
Front Squat
Hack Squat
Leg Press
Bulgarian Split Squat
Walking Lunges
Reverse Lunges
Forward Lunges
Goblet Squat
Sissy Squat
Step-Ups
Leg Extension
```

### Hamstrings / Glutes

```text
Romanian Deadlift
Stiff-Leg Deadlift
Good Morning
Lying Leg Curl
Seated Leg Curl
Standing Leg Curl
Nordic Hamstring Curl
Hip Thrust
Barbell Hip Thrust
Glute Bridge
Cable Pull-Through
Bulgarian Split Squat
Reverse Lunge
```

### Calves

```text
Standing Calf Raise
Seated Calf Raise
Leg Press Calf Raise
Smith Machine Calf Raise
Donkey Calf Raise
Single-Leg Calf Raise
```

Leg rotation should ensure that the six selected exercises provide reasonable coverage of:

```text
Quads
Hamstrings
Glutes
Calves
```

Do not randomly select six exercises from the entire legs pool without considering muscle coverage.

---

# 7. Friday — Arms + Accessories

Friday uses:

**6 Biceps + 3 Triceps**

### Biceps

```text
Barbell Curl
EZ-Bar Curl
Dumbbell Curl
Alternating Dumbbell Curl
Incline Dumbbell Curl
Hammer Curl
Cross-Body Hammer Curl
Preacher Curl
Preacher Hammer Curl
Concentration Curl
Cable Curl
Rope Cable Curl
Bayesian Curl
Spider Curl
Reverse Curl
Zottman Curl
Drag Curl
Machine Biceps Curl
Single-Arm Cable Curl
```

### Triceps

```text
Triceps Pushdown
Rope Pushdown
Straight-Bar Pushdown
Reverse-Grip Pushdown
Overhead Cable Extension
Overhead Dumbbell Extension
Skull Crushers
EZ-Bar Skull Crushers
Dumbbell Skull Crushers
Close-Grip Bench Press
Bench Dips
Triceps Dips
Dumbbell Kickbacks
Cable Kickbacks
Single-Arm Pushdown
Single-Arm Overhead Extension
JM Press
```

Do not use the exact same six biceps and three triceps exercises every Friday.

---

# 8. Saturday — Cardio Circuit

Saturday is a **bodyweight/cardio circuit**, not traditional gym-machine cardio.

Use:

**9 exercises × 3 rounds**

Default timing:

```text
40 seconds work
20 seconds transition/rest
1–2 minutes rest between rounds
```

### High-Intensity Exercises

```text
Burpees
Burpee Broad Jumps
Mountain Climbers
High Knees
Butt Kicks
Jumping Jacks
Star Jumps
Tuck Jumps
Squat Jumps
Split Jumps
Skater Jumps
Broad Jumps
Lateral Jumps
Box Jumps
Jump Rope
Shadow Boxing
```

### Bodyweight Exercises

```text
Push-Ups
Wide Push-Ups
Diamond Push-Ups
Incline Push-Ups
Decline Push-Ups
Pike Push-Ups
Hindu Push-Ups
Bodyweight Squats
Jump Squats
Lunges
Reverse Lunges
Walking Lunges
Bulgarian Split Squats
Step-Ups
```

### Core

```text
Plank
Side Plank
Mountain Climbers
Bicycle Crunches
Crunches
Reverse Crunches
Sit-Ups
Leg Raises
Hanging Leg Raises
Knee Raises
Flutter Kicks
Russian Twists
V-Ups
Toe Touches
Dead Bug
Bird Dog
Heel Taps
Plank Shoulder Taps
Plank Jacks
Hollow Body Hold
```

The rotation system should create varied circuits.

Example:

```text
Week 1:
Jumping Jacks
Mountain Climbers
Push-Ups
High Knees
Burpees
Bodyweight Squats
Skater Jumps
Bicycle Crunches
Plank

Week 2:
Burpees
Jump Squats
Shadow Boxing
Mountain Climbers
Diamond Push-Ups
High Knees
Russian Twists
Skater Jumps
Hollow Body Hold
```

Avoid selecting nine exercises that excessively overload the same movement pattern.

---

# 9. Sets and Reps

Default strength recommendations:

### Compound exercises

```text
3–4 sets
6–10 reps
```

### Isolation exercises

```text
3 sets
10–15 reps
```

### Calves

```text
3–4 sets
12–20 reps
```

### Bodyweight/cardio

```text
40 sec work
20 sec rest
```

These values should be stored as exercise metadata rather than hardcoded into UI components.

---

# 10. Weekly Rotation Algorithm

Create:

```ts
generateWeeklyWorkout(weekNumber: number)
```

The algorithm should:

1. Load the exercise pool.
2. Determine the current week's schedule.
3. Select exercises based on muscle category.
4. Check recently used exercises.
5. Prefer unused exercises.
6. Maintain exercise-count requirements.
7. Maintain muscle-group balance.
8. Generate a deterministic result.
9. Save the generated plan locally.

Pseudo-logic:

```ts
function generateWeeklyWorkout(weekNumber: number) {
  const seed = createWeeklySeed(weekNumber);

  return {
    monday: generateSplit(...),
    tuesday: generateSplit(...),
    wednesday: generateLegWorkout(...),
    thursday: generateSplit(...),
    friday: generateArmWorkout(...),
    saturday: generateCardioCircuit(...)
  };
}
```

Do NOT use:

```ts
Math.random()
```

directly for workout generation.

Otherwise the workout can change every time the screen reloads.

Use a seeded pseudo-random generator.

---

# 11. Workout History

Store completed workouts locally.

Example:

```ts
interface WorkoutHistory {
  weekNumber: number;
  date: string;
  day: string;
  exercises: string[];
  completedExercises: string[];
}
```

The user should be able to see:

```text
Week 1
✓ Monday
✓ Tuesday
✓ Wednesday
○ Thursday
○ Friday
○ Saturday
```

---

# 12. Exercise Completion

Every exercise should have a completion state.

Example:

```text
□ Bench Press
□ Incline Dumbbell Press
□ Cable Fly
```

When completed:

```text
✓ Bench Press
```

Persist this state locally.

If the app closes and opens again, completed exercises must remain completed.

---

# 13. Exercise Detail Screen

Tapping an exercise opens:

```text
Exercise Image

Bench Press

Chest

Sets
4

Reps
6–8

Equipment
Barbell

[ Mark Complete ]
```

Also include:

* Exercise image
* Muscle group
* Equipment
* Sets
* Reps/duration
* Short instructions
* Optional notes
* Completion button

---

# 14. Image System

The user will provide all images.

Do not download images automatically.

Use local assets:

```text
assets/
└── exercises/
    ├── chest/
    ├── triceps/
    ├── back/
    ├── biceps/
    ├── shoulders/
    ├── traps/
    ├── legs/
    └── cardio/
```

Example:

```ts
image: require("@/assets/exercises/chest/bench-press.jpg")
```

Use predictable filenames.

Example:

```text
barbell-bench-press.jpg
incline-dumbbell-press.jpg
lat-pulldown.jpg
barbell-curl.jpg
```

If an image is missing, display a clean placeholder rather than crashing.

---

# 15. Main Dashboard

The home screen should show:

```text
GOOD MORNING

Week 4

Today's Workout
Monday

Chest + Triceps

6 Chest
3 Triceps

[ Start Workout ]
```

Below it:

```text
This Week

MON   CHEST + TRI       ✓
TUE   BACK + BI         ✓
WED   LEGS              ○
THU   SHOULDERS         ○
FRI   ARMS              ○
SAT   CARDIO            ○
```

---

# 16. Workout Screen

Display exercises as cards.

Example:

```text
CHEST

01
Bench Press

4 × 6–8

[ View Exercise ] [ ✓ ]
```

Then:

```text
TRICEPS

07
Triceps Pushdown

3 × 10–15

[ View Exercise ] [ ✓ ]
```

Show progress:

```text
4 / 9 completed

████████░░
```

---

# 17. Navigation

Use Expo Router.

Suggested routes:

```text
/
├── workout/
│   └── [day].tsx
├── exercise/
│   └── [id].tsx
├── history.tsx
└── settings.tsx
```

Tabs can contain:

```text
Home
Workout
History
Settings
```

Keep navigation simple.

---

# 18. Styling

Use NativeWind/TailwindCSS.

Do not create a complicated design system unless required.

Prioritize:

* Dark gym-oriented UI
* Large exercise images
* Clear typography
* High contrast
* Large touch targets
* Minimal clutter
* Smooth transitions
* Clear workout progress

Use reusable components instead of repeating styles.

---

# 19. Important UX Rules

The application should answer these questions immediately:

```text
What am I training today?
What exercises do I have?
How many sets/reps?
What have I completed?
What is left?
```

Do not bury today's workout behind multiple screens.

---

# 20. Settings

Settings should allow:

* Reset current workout
* Regenerate current week
* Start a new week
* Reset all history
* Toggle notifications
* Change default workout timing
* View exercise database

Do not allow accidental destructive actions without confirmation.

---

# 21. Data Separation

Never hardcode exercise lists inside UI components.

Bad:

```tsx
const exercises = [
  "Bench Press",
  "Incline Press"
];
```

Instead:

```ts
import { chestExercises } from "@/data/exercises/chest";
```

Workout generation must operate on structured exercise objects.

---

# 22. TypeScript

Use strict TypeScript.

Avoid:

```ts
any
```

unless required by React Native's image typing.

Prefer:

```ts
type WorkoutDay =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday";
```

Use explicit types for:

* Exercises
* Workout days
* Workout plans
* Muscle groups
* Completion state
* History
* Rotation state

---

# 23. Performance

The application is primarily local and should work offline.

Avoid unnecessary:

* API calls
* Network dependencies
* Heavy state management
* Large runtime calculations
* Re-rendering entire workout lists

Exercise images should be optimized before being added to the application.

Use `FlatList` for long exercise lists.

---

# 24. Future Expansion

Structure the application so these can be added later:

* Custom workouts
* Exercise search
* Exercise filtering
* Weight tracking
* Reps tracking
* Personal records
* Workout timer
* Rest timer
* Workout streaks
* Progress charts
* Body measurements
* Multiple workout programs
* Cloud synchronization
* User accounts

Do not implement these unless explicitly requested.

---

# 25. Initial Development Order

Build in this order:

### Phase 1

Set up:

```text
Expo
TypeScript
Expo Router
NativeWind
```

### Phase 2

Create the exercise database.

### Phase 3

Create weekly workout-generation logic.

### Phase 4

Create the dashboard.

### Phase 5

Create workout screens.

### Phase 6

Create exercise detail screens.

### Phase 7

Add completion tracking.

### Phase 8

Add local persistence.

### Phase 9

Add weekly rotation.

### Phase 10

Add workout history.

### Phase 11

Polish UI and animations.

---

# 26. Critical Requirement

The application is **not a random workout generator**.

It is a **structured weekly gym program with intelligent exercise rotation**.

The following must remain fixed:

```text
Monday    → Chest + Triceps
Tuesday   → Back + Biceps
Wednesday → Legs
Thursday  → Shoulders + Traps
Friday    → Arms + Accessories
Saturday  → Cardio Circuit
Sunday    → Rest
```

Only the **specific exercises within each category** should rotate.

Never randomly change the muscle-group split.

---

# 27. Final Acceptance Criteria

The application is considered complete when:

* [ ] Expo project runs successfully.
* [ ] NativeWind/TailwindCSS works.
* [ ] All exercises are present in the database.
* [ ] Exercises have unique IDs.
* [ ] Exercise images can be added locally.
* [ ] Missing images do not crash the app.
* [ ] Monday–Saturday schedule is implemented.
* [ ] 6 + 3 exercise structure is enforced.
* [ ] Legs always contains exactly 6 exercises.
* [ ] Saturday contains exactly 9 cardio/bodyweight exercises.
* [ ] Saturday uses 3 rounds.
* [ ] Exercises rotate weekly.
* [ ] Consecutive-week repetition is minimized.
* [ ] Weekly plans are deterministic.
* [ ] Workout completion persists.
* [ ] Workout history persists.
* [ ] Exercise detail pages work.
* [ ] App works offline.
* [ ] UI is responsive on common Android phone sizes.
* [ ] No exercise data is duplicated inside UI components.
* [ ] TypeScript has no avoidable type errors.

The implementation should prioritize **correct workout generation and reliable local persistence before visual polish**.
