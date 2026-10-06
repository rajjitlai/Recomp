import type { Pool } from "./exerciseTypes";
export type Pair = {
  pool: Pool;
  names: [string, string];
  reps?: string;
  rest?: number;
};
const pair = (
  pool: Pool,
  a: string,
  b: string,
  reps = "10–15",
  rest = 75,
): Pair => ({ pool, names: [a, b], reps, rest });
export const splitChest = [
  pair("chest", "Machine Chest Press", "Flat Dumbbell Press", "8–12", 120),
  pair("chest", "Incline Machine Press", "Incline Dumbbell Press", "8–12", 120),
  pair("chest", "Cable Crossover", "Pec Deck"),
  pair("chest", "High-to-Low Cable Fly", "Decline Dumbbell Press"),
  pair("chest", "Push-Ups", "Wide-Grip Push-Ups"),
];
export const splitTriceps = [
  pair("triceps", "Rope Pushdown", "Straight-Bar Pushdown"),
  pair("triceps", "Overhead Cable Extension", "Overhead Dumbbell Extension"),
  pair("triceps", "Dumbbell Kickbacks", "Cable Kickbacks"),
  pair("triceps", "Single-Arm Pushdown", "Reverse-Grip Pushdown"),
];
export const splitBack = [
  pair("back", "Neutral-Grip Pulldown", "Wide-Grip Lat Pulldown", "8–12", 120),
  pair("back", "Chest-Supported Row", "Machine Row", "8–12", 120),
  pair("back", "Seated Cable Row", "Single-Arm Dumbbell Row", "8–12", 120),
  pair("back", "Straight-Arm Pulldown", "Dumbbell Pullover"),
  pair("back", "Face Pull", "Inverted Row"),
];
export const splitBiceps = [
  pair("biceps", "Dumbbell Curl", "EZ-Bar Curl"),
  pair("biceps", "Hammer Curl", "Cross-Body Hammer Curl"),
  pair("biceps", "Preacher Curl", "Machine Biceps Curl"),
  pair("biceps", "Cable Curl", "Single-Arm Cable Curl"),
];
export const splitLegs = [
  pair("quads", "Goblet Squat", "Leg Press", "8–12", 120),
  pair("quads", "Reverse Lunges", "Step-Ups", "8–12 / side", 90),
  pair("posterior", "Romanian Deadlift", "Cable Pull-Through", "8–12", 120),
  pair("posterior", "Seated Leg Curl", "Lying Leg Curl"),
  pair("posterior", "Glute Bridge", "Hip Thrust"),
  pair("calves", "Standing Calf Raise", "Seated Calf Raise", "12–20"),
];
export const splitShoulders = [
  pair(
    "shoulders",
    "Machine Shoulder Press",
    "Dumbbell Shoulder Press",
    "8–12",
    120,
  ),
  pair("shoulders", "Dumbbell Lateral Raise", "Machine Lateral Raise"),
  pair("shoulders", "Reverse Pec Deck", "Rear Delt Dumbbell Fly"),
  pair("shoulders", "Face Pull", "Cable Rear Delt Fly"),
  pair("shoulders", "Cable Lateral Raise", "Leaning Cable Lateral Raise"),
  pair("traps", "Dumbbell Shrugs", "Barbell Shrugs"),
];
export const healthStrength = [
  splitLegs[0]!,
  splitChest[0]!,
  splitBack[1]!,
  splitLegs[2]!,
  splitBack[0]!,
  pair("core", "Dead Bug", "Bird Dog", "8–12 / side", 60),
];
