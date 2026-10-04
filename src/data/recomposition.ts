import type { Pool, WorkoutDay } from "./exerciseTypes";

export interface TrainingSlot {
  pool: Pool;
  names: string[];
  sets: number;
  reps: string;
  rest: number;
}
const slot = (
  pool: Pool,
  names: string[],
  sets = 3,
  reps = "6–10",
  rest = 120,
): TrainingSlot => ({ pool, names, sets, reps, rest });
const flat = slot("chest", [
  "Barbell Bench Press",
  "Flat Dumbbell Press",
  "Machine Chest Press",
]);
const incline = slot("chest", [
  "Incline Dumbbell Press",
  "Incline Barbell Bench Press",
  "Incline Machine Press",
]);
const fly = slot(
  "chest",
  ["Cable Crossover", "Pec Deck", "Dumbbell Fly"],
  2,
  "10–15",
  75,
);
const row = slot("back", [
  "Chest-Supported Row",
  "Seated Cable Row",
  "Machine Row",
  "Single-Arm Dumbbell Row",
]);
const pull = slot("back", [
  "Neutral-Grip Pulldown",
  "Wide-Grip Lat Pulldown",
  "Close-Grip Lat Pulldown",
]);
const side = slot(
  "shoulders",
  ["Dumbbell Lateral Raise", "Cable Lateral Raise", "Machine Lateral Raise"],
  2,
  "10–15",
  75,
);
const rear = slot(
  "shoulders",
  ["Reverse Pec Deck", "Cable Rear Delt Fly", "Rear Delt Dumbbell Fly"],
  2,
  "10–15",
  75,
);
const shoulderPress = slot(
  "shoulders",
  [
    "Dumbbell Shoulder Press",
    "Machine Shoulder Press",
    "Barbell Overhead Press",
  ],
  2,
  "8–12",
  120,
);
const biceps = slot(
  "biceps",
  ["Dumbbell Curl", "Cable Curl", "EZ-Bar Curl"],
  2,
  "10–15",
  75,
);
const triceps = slot(
  "triceps",
  ["Rope Pushdown", "Overhead Cable Extension", "Triceps Pushdown"],
  2,
  "10–15",
  75,
);
const squat = slot("quads", [
  "Barbell Squat",
  "Hack Squat",
  "Leg Press",
  "Goblet Squat",
]);
const unilateral = slot(
  "quads",
  ["Reverse Lunges", "Bulgarian Split Squat", "Step-Ups"],
  2,
  "8–12 / side",
  90,
);
const hinge = slot(
  "posterior",
  ["Romanian Deadlift", "Stiff-Leg Deadlift"],
  3,
  "8–12",
  120,
);
const curl = slot(
  "posterior",
  ["Seated Leg Curl", "Lying Leg Curl", "Standing Leg Curl"],
  2,
  "10–15",
  75,
);
const glutes = slot(
  "posterior",
  ["Hip Thrust", "Glute Bridge", "Cable Pull-Through"],
  2,
  "10–15",
  90,
);
const calves = slot(
  "calves",
  ["Standing Calf Raise", "Seated Calf Raise", "Leg Press Calf Raise"],
  3,
  "12–20",
  75,
);

export const strengthSlots: Partial<Record<WorkoutDay, TrainingSlot[]>> = {
  monday: [
    flat,
    { ...incline, sets: 2, reps: "8–12" },
    row,
    pull,
    side,
    triceps,
    biceps,
  ],
  tuesday: [squat, unilateral, hinge, curl, glutes, calves],
  thursday: [incline, fly, row, pull, shoulderPress, rear],
  friday: [squat, unilateral, hinge, curl, glutes, calves],
};
export const recompositionSplit: Record<
  WorkoutDay,
  { title: string; subtitle: string }
> = {
  monday: {
    title: "Upper A · Build",
    subtitle: "Chest · back · shoulders · arms",
  },
  tuesday: {
    title: "Lower A · Build",
    subtitle: "Quads · hamstrings · glutes · calves",
  },
  wednesday: {
    title: "Move + Recover",
    subtitle: "Easy conditioning · 2 rounds · conversational pace",
  },
  thursday: { title: "Upper B · Build", subtitle: "Chest · back · shoulders" },
  friday: {
    title: "Lower B · Build",
    subtitle: "Quads · hamstrings · glutes · calves",
  },
  saturday: {
    title: "Condition + Core",
    subtitle: "Controlled bodyweight circuit · no jumping required",
  },
};
export const conditioningSlots: TrainingSlot[] = [
  slot("conditioning", ["Shadow Boxing"], 3),
  slot("bodyweight", ["Incline Push-Ups", "Push-Ups"], 3),
  slot("core", ["Dead Bug", "Bird Dog"], 3),
  slot("conditioning", ["High Knees"], 3),
  slot("bodyweight", ["Bodyweight Squats", "Reverse Lunges"], 3),
  slot("core", ["Heel Taps", "Bicycle Crunches"], 3),
  slot("conditioning", ["Butt Kicks"], 3),
  slot("bodyweight", ["Step-Ups", "Lunges"], 3),
  slot("core", ["Side Plank", "Plank"], 3),
];
