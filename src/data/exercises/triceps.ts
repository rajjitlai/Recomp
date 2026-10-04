import { createExercise } from "../exerciseFactory";

export const tricepsExercises = [
  "Triceps Pushdown",
  "Rope Pushdown",
  "Straight-Bar Pushdown",
  "Reverse-Grip Pushdown",
  "Overhead Cable Extension",
  "Overhead Dumbbell Extension",
  "Skull Crushers",
  "EZ-Bar Skull Crushers",
  "Dumbbell Skull Crushers",
  "Close-Grip Bench Press",
  "Bench Dips",
  "Triceps Dips",
  "Dumbbell Kickbacks",
  "Cable Kickbacks",
  "Single-Arm Pushdown",
  "Single-Arm Overhead Extension",
  "JM Press",
].map((name) => createExercise(name, "triceps"));
